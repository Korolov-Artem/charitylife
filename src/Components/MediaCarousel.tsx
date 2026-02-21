import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {useGetRandomArticlesQuery} from "../services/articlesApi";
import {getImageUrl} from "./getImageUrl";
import {ArticleType} from "../types/ArticleType";

const MediaCarousel = () => {
    const {data: randomArticles, isLoading} = useGetRandomArticlesQuery({limit: 10});
    const articles = randomArticles || [];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (articles.length === 0 || isHovered) return;

        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === articles.length - 1 ? 0 : prevIndex + 1
            );
        }, 4000);

        return () => clearInterval(timer);
    }, [articles.length, isHovered]);

    if (isLoading) return <div className="h-[400px] flex items-center justify-center text-white">Loading
        Highlights...</div>;
    if (articles.length === 0) return null;

    return (
        <div
            className="w-full overflow-hidden relative py-12 bg-[#1a1a1a] group ml-[-13vw] mt-[5vh]"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div
                className="flex items-center transition-transform duration-700 ease-in-out"
                style={{
                    transform: `translateX(calc(-${currentIndex * 33.333}% + 33.333%))`
                }}
            >
                {articles.map((article: ArticleType, idx: number) => {
                    const isActive = idx === currentIndex;

                    return (
                        <div
                            key={article.id}
                            className="w-[33.333%] flex-shrink-0 px-4 transition-all duration-700 ease-in-out"
                            style={{
                                transform: isActive ? "scale(1.05)" : "scale(0.85)",
                                opacity: isActive ? 1 : 0.3,
                                zIndex: isActive ? 10 : 0,
                                filter: isActive ? "blur(0px)" : "blur(2px)"
                            }}
                        >
                            <Link
                                to={`/${article.id}`}
                                className="block relative w-full h-[400px] rounded-2xl overflow-hidden shadow-2xl"
                            >
                                {article.image ? (
                                    <img
                                        src={getImageUrl(article.image)}
                                        alt={article.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div
                                        className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-500">
                                        No Image
                                    </div>
                                )}

                                <div
                                    className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-10"/>

                                <div className="absolute bottom-0 left-0 p-8 w-full">
                                    <span
                                        className="text-[#BD3900] text-sm font-bold uppercase tracking-wider mb-2 block drop-shadow-lg">
                                        {article.theme}
                                    </span>
                                    <h3 className={`text-white font-bold leading-tight drop-shadow-md transition-all duration-500 ${isActive ? 'text-3xl' : 'text-xl'}`}>
                                        {article.title}
                                    </h3>
                                </div>
                            </Link>
                        </div>
                    );
                })}
            </div>

            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-3">
                {articles.map((_, idx: number) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-2 rounded-full transition-all duration-500 ${
                            currentIndex === idx ? "bg-[#BD3900] w-10 shadow-[0_0_10px_#BD3900]" : "bg-white/40 w-3 hover:bg-white/80"
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default MediaCarousel;