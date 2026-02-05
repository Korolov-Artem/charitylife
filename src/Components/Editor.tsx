import "react-quill-new/dist/quill.snow.css";
import ReactQuill, {Quill} from "react-quill-new"
import {useMemo, useRef} from "react";
import {useUploadImageMutation} from "../services/articlesApi.ts";

const metaUrl = import.meta.env.VITE_API_URL || "http://localhost:3000"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Size = Quill.import('attributors/style/size') as any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Font = Quill.import('attributors/style/font') as any

const fontList = ['arial', 'comic-sans', 'courier-new', 'georgia', 'helvetica', 'lucida'];
const sizeList = ['10px', '12px', '14px', '16px', '18px', '20px', '24px', '30px'];

Size.whitelist = sizeList;
Font.whitelist = fontList;

Quill.register(Size, true);
Quill.register(Font, true);

interface EditorProps {
    value: string;
    onChange: (content: string) => void;
}

export const Editor = ({value, onChange}: EditorProps) => {
    const quillRef = useRef<ReactQuill>(null);
    const [uploadImage] = useUploadImageMutation();

    const imageHandler = () => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click()

        input.onchange = async () => {
            if (input.files && input.files[0]) {
                const file = input.files[0];

                try {
                    const result = await uploadImage(file).unwrap()
                    const url = `${metaUrl}${result.url}`

                    const quill = quillRef.current?.getEditor()
                    const range = quill?.getSelection()

                    if (quill && range) {
                        quill.insertEmbed(range.index, "image", url);
                    }
                } catch (error) {
                    console.error("Upload failed", error);
                }
            }
        }
    }

    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{"font": fontList}],
                [{"size": sizeList}],

                [{header: [1, 2, false]}],
                ["bold", "italic", "underline", "strike"],
                ["image"]
            ],
            handlers: {
                image: imageHandler,
            }
        }
    }), [uploadImage])

    return (
        <div className="h-[80vh] w-[50vw] mt-[-43vh] ml-[22.5vw]">
            <ReactQuill
                ref={quillRef}
                theme="snow"
                value={value}
                onChange={onChange}
                modules={modules}
                className="h-full bg-white"
            />
        </div>
    )
}
