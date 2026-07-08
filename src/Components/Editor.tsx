import "react-quill-new/dist/quill.snow.css";
import ReactQuill, { Quill } from "react-quill-new";
import { useMemo, useRef } from "react";
import { useUploadImageMutation } from "../services/articlesApi.ts";

const metaUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

const BlockEmbed = Quill.import("blots/block/embed") as any;

// Custom HTML5 Video element handling
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
VideoBlot.tagName = "video"; // Transforms native Quill video into HTML5 <video>
Quill.register(VideoBlot, true);

// Custom HTML5 Audio element handling
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
AudioBlot.tagName = "audio"; // Registers brand new HTML5 <audio> tag
Quill.register(AudioBlot, true);

// Inject a premium SVG wave icon into the Quill toolbar for our custom audio button
const icons = Quill.import("ui/icons") as any;
icons["audio"] = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 16px; height: 16px; margin-top: 1px;">
    <path d="M9 18V5l12-2v13"></path>
    <circle cx="6" cy="18" r="3"></circle>
    <circle cx="18" cy="16" r="3"></circle>
  </svg>
`;

interface EditorProps {
  value: string;
  onChange: (content: string) => void;
}

export const Editor = ({ value, onChange }: EditorProps) => {
  const quillRef = useRef<ReactQuill>(null);

  const [uploadFile] = useUploadImageMutation();

  // function that handles uploads for images, video, or audio
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
          // Send the binary file chunk straight through RTK Query upload endpoint
          const result = await uploadFile(file).unwrap();
          const url = `${metaUrl}${result.url}`;

          const quill = quillRef.current?.getEditor();
          const range = quill?.getSelection();

          if (quill && range) {
            // Inserts the correct HTML tag (img, video, or audio) with the source url
            quill.insertEmbed(range.index, embedType, url);
            // Move cursor past the newly injected media item
            quill.setSelection(range.index + 1);
          }
        } catch (error) {
          console.error(`${embedType} upload failed`, error);
        }
      }
    };
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [2, 3, false] }],
          ["bold", "italic", "underline"],
          // Added "video" and our custom "audio" token directly into the media toolbar block
          ["blockquote", "link", "image", "video", "audio"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["clean"],
        ],
        handlers: {
          // Intercept the toolbar clicks and map them to our custom file picker
          image: () => mediaUploadHandler("image/*", "image"),
          video: () => mediaUploadHandler("video/*", "video"),
          audio: () => mediaUploadHandler("audio/*", "audio"),
        },
      },
    }),
    [uploadFile],
  );

  return (
    <div className="editorial-editor-wrapper w-full h-full flex flex-col">
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        placeholder="Write your editorial piece here..."
        className="bg-white font-serif flex-1 flex flex-col"
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
            background-color: #f9fafb;
            padding: 1rem;
            border-top-left-radius: 0.375rem;
            border-top-right-radius: 0.375rem;
        }
        .editorial-editor-wrapper .ql-editor {
            min-height: 500px;
            padding: 2.5rem;
        }
        .editorial-editor-wrapper .ql-editor.ql-blank::before {
            left: 2.5rem;
            font-style: normal;
            color: #9ca3af;
        }
      `}</style>
    </div>
  );
};
