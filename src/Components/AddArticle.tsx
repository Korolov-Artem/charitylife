import {ChangeEvent, FormEvent, useEffect, useState} from "react";
import {useCreateArticleMutation, useUploadImageMutation} from "../services/articlesApi.ts";
import {Editor} from "./Editor.tsx";
import {useNavigate} from "react-router-dom";

const AddArticle = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadImage, {isLoading: isUploading}] = useUploadImageMutation()
    const [createArticle, {isLoading: isCreating}] = useCreateArticleMutation()

    const [content, setContent] = useState("")
    const [click, setClick] = useState<boolean>(false)
    const [title, setTitle] = useState("")
    const [synopsis, setSynopsis] = useState("")
    const [theme, setTheme] = useState("")

    const navigate = useNavigate()

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
        }
    }

    const handleTitleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setTitle(e.target.value)
    }
    const handleSynopsisChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setSynopsis(e.target.value)
    }
    const handleThemeChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setTheme(e.target.value)
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!selectedFile || !title || !content || !theme) {
            alert("Please fill in all fields and select a cover image.");
            return;
        }

        try {
            const uploadResponse = await uploadImage(selectedFile).unwrap();
            const imageUrl = uploadResponse.url

            const articleData = {
                title: title,
                content: content,
                synopsis: synopsis,
                theme: theme,
                image: imageUrl,
            }

            await createArticle(articleData).unwrap()
            navigate("/")
        } catch (error) {
            console.error("Failed to publish:", error);
            alert("An error occurred while publishing.");
        }
    }

    const handleBackClick = () => {
        setClick(true)
    }
    useEffect(() => {
        if (click) {
            navigate("/")
        }
    }, [click, navigate]);

    const isLoading = isUploading || isCreating;

    return (
        <form onSubmit={handleSubmit}>
            <div
                className="text-black text-4xl flex mt-[3vh] ml-[4vw] font-light hover:text-[#BD3900] transition-all duration-300 cursor-pointer"
                onClick={handleBackClick}
            >
                {"⇚ Назад"}
            </div>
            <div className="flex-col gap-8 mt-[5vh] ml-[3vw] flex">
                <textarea
                    onChange={handleTitleChange}
                    placeholder={"Заголовок"}
                    value={title}
                    className="bg-white border-1 border-black resize-none w-[15vw] h-[8vh] overflow-scroll"
                />
                <textarea
                    onChange={handleSynopsisChange}
                    placeholder={"Синопсис"}
                    value={synopsis}
                    className="bg-white border-1 border-black resize-none w-[15vw] h-[8vh] overflow-scroll"
                />
                <textarea
                    onChange={handleThemeChange}
                    placeholder={"Тема"}
                    value={theme}
                    className="bg-white border-1 border-black resize-none w-[15vw] h-[8vh] overflow-scroll"
                />
            </div>
            <div className="p-8 bg-[#ECEBDF] m-4">
                <Editor value={content} onChange={setContent}/>
            </div>
            <div className="flex justify-between ml-[37vw] mr-[37vw]">
                <label
                    className="flex items-center justify-center !bg-red-700 text-white !text-xl font-medium rounded-lg w-[11vw] transition-all duration-300 cursor-pointer hover:bg-red-900">
                    {selectedFile ? `${selectedFile.name}` : 'Обкладинка'}
                    <input
                        type="file"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </label>
                <button
                    type="submit"
                    disabled={isLoading || !selectedFile}
                    className="!bg-red-700 text-white !text-xl rounded-b-none transition-all duration-300 cursor-pointer hover:bg-red-900"
                >
                    {isLoading ? "Uploading..." : "Опублікувати"}
                </button>
            </div>

        </form>
    )
}

export default AddArticle