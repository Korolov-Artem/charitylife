import {ChangeEvent, FormEvent, useState} from "react";
import {useUploadImageMutation} from "../services/articlesApi.ts";
import {Editor} from "./Editor.tsx";

const AddArticle = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadImage, {isLoading}] = useUploadImageMutation()
    const [content, setContent] = useState("")

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
        }
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!selectedFile) {
            return;
        }
        try {
            const response = await uploadImage(selectedFile).unwrap();
            console.log("Server saved it at:", response.url)
            alert(`Uploaded! URL: ${response.url}`);
        } catch (error) {
            console.log("Error failed ", error);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <input type="file" onChange={handleFileChange}/>
            <button
                type="submit"
                disabled={isLoading || !selectedFile}
            >
                {isLoading ? "Uploading..." : "Add Article"}
            </button>
            <div className="p-8 bg-white m-4 rounded shadow">
                <h2 className="text-2xl mb-4">Article Content</h2>
                <Editor value={content} onChange={setContent}/>
            </div>
        </form>
    )
}

export default AddArticle