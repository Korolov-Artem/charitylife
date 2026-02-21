import {useEffect, useState} from "react";
import {useGetArticlesQuery} from "../services/articlesApi.ts";
import {ArticleType} from "../types/ArticleType.ts";
import {useIntersectionObserver} from "../hooks/useIntersectionObserver.ts";
import {useNavigate} from "react-router-dom";
import {getImageUrl} from "./getImageUrl.ts";

const AllArticles = () => {
    const [pageNumber, setPageNumber] = useState(1);
    const [articles, setArticles] = useState<ArticleType[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const {targetRef, isIntersecting} = useIntersectionObserver();

    const [click, setClick] = useState<boolean>(false)
    const navigate = useNavigate()

    const {data, isFetching} = useGetArticlesQuery({pgNumber: pageNumber, pgSize: 10});

    useEffect(() => {
        if (!data) return
        if (data.length === 0) {
            setHasMore(false)
        } else {
            setArticles(prev => {
                const newUnique = data.filter(n => !prev.some(p => p.id === n.id));
                return [...prev, ...newUnique];
            });
        }
    }, [data])

    useEffect(() => {
        if (isIntersecting && hasMore && !isFetching) {
            setPageNumber(prev => prev + 1);
        }
    }, [isIntersecting, hasMore, isFetching]);

    const handleBackClick = () => {
        setClick(true)
    }
    useEffect(() => {
        if (click) {
            navigate("/")
        }
    }, [click, navigate]);

    return (
        <div>
            <div
                className="text-black text-4xl flex mt-[3vh] ml-[4vw] font-light hover:text-[#BD3900] transition-all duration-300 cursor-pointer"
                onClick={handleBackClick}
            >
                {"⇚ Назад"}
            </div>
            {articles.map((article) => (
                <div key={article.id}>
                    <h2 className="font-bold text-xl">{article.title}</h2>
                    <img src={getImageUrl(article.image)} className="w-full h-32 object-cover"/>
                </div>
            ))}
            <div ref={targetRef} className="h-20 border-4 border-red-500">
                {isFetching && <p>Loading more...</p>}
                {!hasMore && <p>End of content.</p>}
            </div>
        </div>
    )
}

export default AllArticles;