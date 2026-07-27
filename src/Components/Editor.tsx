import "react-quill-new/dist/quill.snow.css";
import ReactQuill, { Quill } from "react-quill-new";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { useUploadMediaMutation } from "../services/mediaApi.ts";
import MediaDrawer from "./MediaDrawer.tsx";
import { API_URL } from "../config.ts";

const metaUrl = API_URL;

const BlockEmbed = Quill.import("blots/block/embed") as any;

class VideoBlot extends BlockEmbed {
  static create(value: string) {
    const node = super.create();
    node.setAttribute("src", value);
    node.setAttribute("controls", "true");
    node.setAttribute("controlsList", "nodownload");
    node.setAttribute("playsinline", "true");
    node.style.width = "100%";
    node.style.maxWidth = "700px";
    node.style.margin = "1.5rem auto";
    node.style.display = "block";
    return node;
  }
  static value(node: HTMLElement) {
    return node.getAttribute("src");
  }
}
VideoBlot.blotName = "video";
VideoBlot.tagName = "video";
Quill.register(VideoBlot, true);

class AudioBlot extends BlockEmbed {
  static create(value: string) {
    const node = super.create();
    node.setAttribute("src", value);
    node.setAttribute("controls", "true");
    node.style.width = "100%";
    node.style.maxWidth = "500px";
    node.style.margin = "1rem auto";
    node.style.display = "block";
    return node;
  }
  static value(node: HTMLElement) {
    return node.getAttribute("src");
  }
}
AudioBlot.blotName = "audio";
AudioBlot.tagName = "audio";
Quill.register(AudioBlot, true);

const icons = Quill.import("ui/icons") as any;
icons["audio"] = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 16px; height: 16px; margin-top: 1px;">
    <path d="M9 18V5l12-2v13"></path>
    <circle cx="6" cy="18" r="3"></circle>
    <circle cx="18" cy="16" r="3"></circle>
  </svg>
`;
icons["archive"] = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 16px; height: 16px;">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <circle cx="8.5" cy="8.5" r="1.5"></circle>
    <polyline points="21 15 16 10 5 21"></polyline>
  </svg>
`;

interface EditorProps {
  value: string;
  onChange: (content: string) => void;
}

/**
 * Rebuild a File from a data: URI so it can go through the normal upload path.
 */
const dataUriToFile = (uri: string): File | null => {
  const match = /^data:([^;,]+)(;base64)?,([\s\S]*)$/.exec(uri);
  if (!match) return null;

  const [, mime, base64Flag, payload] = match;

  try {
    const binary = base64Flag ? atob(payload) : decodeURIComponent(payload);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

    const ext = (mime.split("/")[1] || "png").split("+")[0];
    return new File([bytes], `pasted-${Date.now()}.${ext}`, { type: mime });
  } catch {
    return null;
  }
};

export const Editor = ({ value, onChange }: EditorProps) => {
  const quillRef = useRef<ReactQuill>(null);
  const [isMediaDrawerOpen, setIsMediaDrawerOpen] = useState(false);
  const [uploadFile] = useUploadMediaMutation();

  const absorbing = useRef(false);

  /**
   * Moves data: URI images out of the document and into the media archive.
   *
   * The paste and drop handlers below catch images arriving as files, but an
   * image inlined in pasted text/html stays base64 and gets persisted into the
   * article body — one screenshot put 1.39MB into a single article, which every
   * list endpoint then ships to every reader. This is the backstop for those.
   */
  const absorbDataUris = useCallback(async () => {
    const quill = quillRef.current?.getEditor();
    if (!quill || absorbing.current) return;

    const nodes = Array.from(
      quill.root.querySelectorAll('img[src^="data:"]'),
    ) as HTMLImageElement[];
    if (!nodes.length) return;

    absorbing.current = true;
    try {
      for (const node of nodes) {
        const file = dataUriToFile(node.getAttribute("src") ?? "");
        if (!file) continue;

        try {
          const result = await uploadFile(file).unwrap();
          const url = `${metaUrl}${result.url}`;

          // Resolve the node's position through Quill rather than editing the
          // DOM directly, so the document model stays authoritative.
          const blot = Quill.find(node);
          if (!blot) continue;
          const index = quill.getIndex(blot as never);

          quill.deleteText(index, 1, "user");
          quill.insertEmbed(index, "image", url, "user");
        } catch (error) {
          // Leave the inline copy in place: a heavy article beats a lost one.
          console.error("Failed to archive inlined image", error);
        }
      }
    } finally {
      absorbing.current = false;
    }
  }, [uploadFile]);

  const handleDropCapture = async (e: React.DragEvent<HTMLDivElement>) => {
    const files = Array.from(e.dataTransfer?.files ?? []).filter((f) =>
      f.type.startsWith("image/"),
    );
    if (!files.length) return;

    // Pre-empt Quill's default drop, which inlines the file as base64.
    e.preventDefault();
    e.stopPropagation();

    const quill = quillRef.current?.getEditor();
    if (!quill) return;

    for (const file of files) {
      try {
        const result = await uploadFile(file).unwrap();
        const url = `${metaUrl}${result.url}`;
        const range = quill.getSelection() || {
          index: quill.getLength(),
          length: 0,
        };
        quill.insertEmbed(range.index, "image", url);
        quill.setSelection(range.index + 1);
      } catch (error) {
        console.error("Drop upload failed", error);
      }
    }
  };

  const handlePasteCapture = async (e: React.ClipboardEvent<HTMLDivElement>) => {
    if (e.clipboardData && e.clipboardData.files && e.clipboardData.files.length > 0) {
      const file = e.clipboardData.files[0];

      if (file.type.startsWith("image/")) {
        e.preventDefault();
        e.stopPropagation();

        try {
          const result = await uploadFile(file).unwrap();
          const url = `${metaUrl}${result.url}`;

          const quill = quillRef.current?.getEditor();
          if (quill) {
            const range = quill.getSelection() || { index: quill.getLength(), length: 0 };
            quill.insertEmbed(range.index, "image", url);
            quill.setSelection(range.index + 1);
          }
        } catch (error) {
          console.error("Paste upload failed", error);
        }
      }
    }
  };

  const mediaUploadHandler = (
    acceptType: string,
    embedType: "image" | "video" | "audio",
  ) => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", acceptType);
    input.click();

    input.onchange = async () => {
      if (input.files && input.files[0]) {
        const file = input.files[0];

        try {
          const result = await uploadFile(file).unwrap();
          const url = `${metaUrl}${result.url}`;

          const quill = quillRef.current?.getEditor();
          if (quill) {
            const range = quill.getSelection() || { index: quill.getLength(), length: 0 };
            quill.insertEmbed(range.index, embedType, url);
            quill.setSelection(range.index + 1);
          }
        } catch (error) {
          console.error(`${embedType} upload failed`, error);
        }
      }
    };
  };

  const handleInsertFromArchive = (imageUrl: string) => {
    const quill = quillRef.current?.getEditor();
    if (quill) {
      const range = quill.getSelection() || { index: quill.getLength(), length: 0 };
      quill.insertEmbed(range.index, "image", imageUrl);
      quill.setSelection(range.index + 1);
    }
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [2, 3, false] }],
          ["bold", "italic", "underline"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["blockquote", "link"],
          // No "image" button: images come in via the archive drawer or a paste,
          // both of which route through the upload path.
          ["video", "audio", "archive"],
          ["clean"],
        ],
        handlers: {
          video: () => mediaUploadHandler("video/*", "video"),
          audio: () => mediaUploadHandler("audio/*", "audio"),
          archive: () => setIsMediaDrawerOpen(true),
        },
      },
    }),
    [uploadFile],
  );

  return (
    <div
      className="editorial-editor-wrapper w-full h-full flex flex-col relative"
      onPasteCapture={handlePasteCapture}
      onDropCapture={handleDropCapture}
    >
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={(html) => {
          onChange(html);
          void absorbDataUris();
        }}
        modules={modules}
        placeholder="Пишіть свій матеріал тут…"
        className="bg-[#FAFAFA] font-serif flex-1 flex flex-col"
      />

      <MediaDrawer
        isOpen={isMediaDrawerOpen}
        onClose={() => setIsMediaDrawerOpen(false)}
        onSelectImage={handleInsertFromArchive}
      />

      <style>{`
        .editorial-editor-wrapper .quill {
            display: flex;
            flex-direction: column;
            height: 100%;
        }
        .editorial-editor-wrapper .ql-container {
            min-height: 500px;
            font-size: 1.125rem;
            font-family: inherit;
            border: none;
            border-top: 1px solid #e5e7eb;
            flex: 1;
        }

        .editorial-editor-wrapper .ql-toolbar {
            border: none;
            background-color: #FFFFFF;
            padding: 1rem 1.5rem;
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 0.5rem;
        }

        .editorial-editor-wrapper .ql-toolbar .ql-formats {
            display: flex;
            align-items: center;
            margin-right: 1.5rem;
            position: relative;
        }
        .editorial-editor-wrapper .ql-toolbar .ql-formats:not(:last-child)::after {
            content: '';
            position: absolute;
            right: -0.75rem;
            top: 15%;
            height: 70%;
            width: 1px;
            background-color: #E5E7EB;
        }

        .editorial-editor-wrapper .ql-toolbar button {
            width: 36px;
            height: 36px;
            padding: 6px;
            border-radius: 4px;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .editorial-editor-wrapper .ql-toolbar button:hover {
            background-color: #F3F4F6;
        }
        .editorial-editor-wrapper .ql-toolbar button svg {
            width: 18px;
            height: 18px;
        }

        /* Quill's snow theme hardcodes #06c on active/hover states. Overriding
           it takes three passes, since the icons use colour, fill and stroke. */

        /* colour */
        .editorial-editor-wrapper .ql-snow.ql-toolbar button:hover,
        .editorial-editor-wrapper .ql-snow .ql-toolbar button:hover,
        .editorial-editor-wrapper .ql-snow.ql-toolbar button.ql-active,
        .editorial-editor-wrapper .ql-snow .ql-toolbar button.ql-active,
        .editorial-editor-wrapper .ql-snow.ql-toolbar .ql-picker-label:hover,
        .editorial-editor-wrapper .ql-snow.ql-toolbar .ql-picker-label.ql-active,
        .editorial-editor-wrapper .ql-snow.ql-toolbar .ql-picker-item:hover,
        .editorial-editor-wrapper .ql-snow.ql-toolbar .ql-picker-item.ql-selected {
            color: #BD3900 !important;
        }

        /* fill */
        .editorial-editor-wrapper .ql-snow.ql-toolbar button:hover .ql-fill,
        .editorial-editor-wrapper .ql-snow .ql-toolbar button:hover .ql-fill,
        .editorial-editor-wrapper .ql-snow.ql-toolbar button.ql-active .ql-fill,
        .editorial-editor-wrapper .ql-snow .ql-toolbar button.ql-active .ql-fill,
        .editorial-editor-wrapper .ql-snow.ql-toolbar .ql-picker-label:hover .ql-fill,
        .editorial-editor-wrapper .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-fill,
        .editorial-editor-wrapper .ql-snow.ql-toolbar .ql-picker-item:hover .ql-fill,
        .editorial-editor-wrapper .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-fill,
        .editorial-editor-wrapper .ql-snow.ql-toolbar .ql-picker-item:hover .ql-stroke.ql-fill,
        .editorial-editor-wrapper .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke.ql-fill {
            fill: #BD3900 !important;
        }

        /* stroke */
        .editorial-editor-wrapper .ql-snow.ql-toolbar button:hover .ql-stroke,
        .editorial-editor-wrapper .ql-snow .ql-toolbar button:hover .ql-stroke,
        .editorial-editor-wrapper .ql-snow.ql-toolbar button.ql-active .ql-stroke,
        .editorial-editor-wrapper .ql-snow .ql-toolbar button.ql-active .ql-stroke,
        .editorial-editor-wrapper .ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke,
        .editorial-editor-wrapper .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke,
        .editorial-editor-wrapper .ql-snow.ql-toolbar .ql-picker-item:hover .ql-stroke,
        .editorial-editor-wrapper .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke,
        .editorial-editor-wrapper .ql-snow.ql-toolbar .ql-picker-item:hover .ql-stroke-miter,
        .editorial-editor-wrapper .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke-miter {
            stroke: #BD3900 !important;
        }

        .editorial-editor-wrapper .ql-picker {
            font-family: sans-serif;
            font-size: 14px;
            font-weight: 600;
            letter-spacing: 0.05em;
            text-transform: uppercase;
        }

        .editorial-editor-wrapper .ql-editor {
            min-height: 500px;
            padding: 3rem;
            color: #111827;
            line-height: 1.8;
        }
        .editorial-editor-wrapper .ql-editor.ql-blank::before {
            left: 3rem;
            font-style: italic;
            color: #9CA3AF;
        }
      `}</style>
    </div>
  );
};
