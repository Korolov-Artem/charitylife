import {ArticleType} from "../types/ArticleType.ts";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

const ArticlesByTheme = ({articles}: { articles: ArticleType[] }) => {
    const [id, setId] = useState("");
    const navigate = useNavigate();

    const handleClick = (id: string) => {
        setId(id);
    }

    useEffect(() => {
        if (id) {
            navigate(`${id}`);
        }
    }, [id, setId]);


    return (
        <div className="grid grid-cols-3 gap-12 text-center w-full p-8 mt-[-10vh]">
            {articles.map((article) => (
                <div key={article.id}
                     onClick={() => {
                         handleClick(article.id)
                     }}
                     className="flex flex-row text-center items-start w-full transition-all duration-300 ease-in-out hover:text-red-700 hover:cursor-pointer hover:drop-shadow-md">

                    <div className="shrink-0">
                        <img
                            src={article.image}
                            className="w-[20vw] min-h-[40vh] transition-all object-cover"
                            alt={article.title}
                        />
                    </div>

                    <div className="flex flex-col items-center text-center flex-1 pl-8 mt-[42vh] ml-[-30vw]">
                        <div className="flex text-center">
                            <h2 className="text-4xl text-center font-serif">
                                {article.title}
                            </h2>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ArticlesByTheme;