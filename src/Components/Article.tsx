import {useGetArticleByIdQuery} from "../services/articlesApi.ts";
import {useParams} from "react-router-dom";
import Suggestions from "./Suggestions.tsx";
import {getImageUrl} from "./getImageUrl.ts";

const Article = () => {
    const {id} = useParams<{ id: string }>();
    const {data: article, isLoading, isError} = useGetArticleByIdQuery(id)

    if (isLoading) return <div>"Loading data..."</div>;
    if (isError) {
        const errorMessage = "An unknown error has occurred";
        return <div>{errorMessage}</div>;
    }
    if (!id) {
        return <div>Invalid article ID</div>;
    }

    return (
        <div className="bg-[#ECEBDF] min-h-[85.4vh] w-[97vw]">
            <div className="absolute top-10 flex justify-between items-center mt-8">
                <p className="text-[1.3rem] font-bold ml-5">
                    {article.author}
                </p>
                <p className="ml-340 font-bold text-[#BD3900] text-[1.3rem]">
                    {new Date(article.dataPublished).toLocaleDateString(
                        "uk-UA",
                        {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        }
                    )}
                </p>
            </div>
            <div className="flex items-center justify-center">
                <h1 className="text-5xl font-thin mt-25 ml-15"
                >{article.title}</h1>
            </div>
            <div className="flex items-center justify-center">
                <img src={getImageUrl(article.image)} alt=""
                     className="max-h-250 min-h-205 max-w-160 min-w-160 object-cover mt-15 ml-13"
                />
            </div>
            <div className="text-center ml-[25vw] text-base mt-[1vh] max-w-[50vw]">
                <p>Long long long long long Image Credits </p>
            </div>
            <div
                className="text-[2.2vh] leading-relaxed font-[Cormorant_Garamond] w-[50vw] flex items-center justify-center ml-[25vw] mt-[5vh] text-left">
                <p>
                    {article.content}
                </p>
            </div>
            <Suggestions theme={article.theme}/>
        </div>
    )
}

export default Article