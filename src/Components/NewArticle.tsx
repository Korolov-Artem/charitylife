import {useGetArticlesQuery} from "../services/articlesApi.ts";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import Loader from "../assets/Loader.tsx";

const getImageUrl = (path: string | undefined) => {
    if (!path) return "";
    const cleanPath = path.replace(/&#x2F;/g, "/").replace(/"/g, "");
    if (cleanPath.startsWith("http")) return cleanPath;
    const normalizedPath = cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;
    return `http://localhost:3000${normalizedPath}`;
}

const NewArticle = () => {
    const [clickData, setClickData] = useState(false);
    const navigate = useNavigate();

    const handleClick = () => {
        setClickData(true);
    }

    useEffect(() => {
        if (clickData) {
            navigate(`/${mostRecentArticle.id}`);
        }
    }, [clickData, setClickData]);

    const {data: articles, isLoading, isError} = useGetArticlesQuery(undefined);

    if (isLoading) return <Loader/>;

    if (isError) {
        const errorMessage = "An unknown error has occurred";
        return <div>{errorMessage}</div>;
    }

    const mostRecentArticle =
        articles && articles.length > 0 ? articles[0] : null;


    return mostRecentArticle ? (
        <div className="border-b-10 border-s-black relative self-start">
            <h1 className="-ml-130 mt-10 font-normal tracking-[1rem]">
                Найновіша Стаття
            </h1>
            <div>
                {mostRecentArticle.image ? (
                    <img
                        onClick={handleClick}
                        src={getImageUrl(mostRecentArticle.image)}
                        alt={mostRecentArticle.title}
                        className="flex max-h-250 min-h-205 max-w-110 min-w-110 object-cover ml-8 mt-10 hover:cursor-pointer"
                    />
                ) : (
                    <div
                        className="flex max-h-250 min-h-205 max-w-110 min-w-110 bg-gray-200 ml-8 mt-10 items-center justify-center">
                        <p className="text-gray-400">No Image Available</p>
                    </div>
                )}
            </div>
            <div className="">
                <h2 className="-mt-200 ml-130 max-w-130 text-left text-4xl font-light text-[#BD3900] leading-relaxed cursor-pointer hover:text-black hover:transition-colors hover:duration-200 hover:cursor-pointer"
                    onClick={handleClick}>
                    {mostRecentArticle.title}
                </h2>
            </div>
            <div className="flex flex-col flex-grow min-h-130">
                <p className="max-w-100 text-left font-[Cormorant_Garamond] ml-130 mt-20 text-[1.3rem] leading-[2] cursor-pointer hover:text-red-700 hover:transition-colors hover:duration-200 hover:cursor-pointer"
                   onClick={handleClick}>
                    {mostRecentArticle.synopsis}
                </p>
            </div>
            <div className="absolute bottom-4 flex justify-between items-center mt-8">
                <p className="text-[1rem] font-bold ml-130">
                    {mostRecentArticle.author}
                </p>
                <p className="ml-100 font-bold mr-10 text-[#BD3900] text-[1rem]">
                    {new Date(mostRecentArticle.dataPublished).toLocaleDateString(
                        "uk-UA",
                        {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        }
                    )}
                </p>
            </div>
        </div>
    ) : (
        <p>No articles found</p>
    );
};

export default NewArticle;
