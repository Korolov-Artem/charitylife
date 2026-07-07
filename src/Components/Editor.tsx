import "react-quill-new/dist/quill.snow.css";
import ReactQuill from "react-quill-new";
import { useMemo, useRef } from "react";
import { useUploadImageMutation } from "../services/articlesApi.ts";

const metaUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface EditorProps {
  value: string;
  onChange: (content: string) => void;
}

export const Editor = ({ value, onChange }: EditorProps) => {
  const quillRef = useRef<ReactQuill>(null);
  const [uploadImage] = useUploadImageMutation();

  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      if (input.files && input.files[0]) {
        const file = input.files[0];

        try {
          const result = await uploadImage(file).unwrap();
          const url = `${metaUrl}${result.url}`;

          const quill = quillRef.current?.getEditor();
          const range = quill?.getSelection();

          if (quill && range) {
            quill.insertEmbed(range.index, "image", url);
          }
        } catch (error) {
          console.error("Upload failed", error);
        }
      }
    };
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          // Enforcing the design system by removing custom fonts/sizes
          [{ header: [2, 3, false] }], // H2, H3, Normal
          ["bold", "italic", "underline"], // Emphasis
          ["blockquote", "link", "image"], // Blocks and Media
          [{ list: "ordered" }, { list: "bullet" }], // Lists
          ["clean"], // Remove formatting
        ],
        handlers: {
          image: imageHandler,
        },
      },
    }),
    [uploadImage],
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

      {/*
              Custom CSS override to fix Quill's default height and borders.
              This makes it look like a seamless, premium writing canvas.
            */}
      <style>{`
                .editorial-editor-wrapper .quill {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                }
                .editorial-editor-wrapper .ql-container {
                    min-height: 500px; /* Gives the author massive writing space */
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
