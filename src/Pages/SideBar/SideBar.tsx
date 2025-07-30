import "./SideBar.css";
import {useGetArticlesQuery} from "../../services/articlesApi.ts";
import Article from "./Article/Article.tsx";
import {ArticleType} from "../../types/ArticleType.ts";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

const SideBar = () => {
    const {data: articles, isLoading, isError} = useGetArticlesQuery(undefined)

    const [clickData, setClickData] = useState(false);
    const [id, setId] = useState("");
    const navigate = useNavigate();

    const handleClick = (id: string) => {
        setClickData(true);
        setId(id)
    }

    useEffect(() => {
        if (clickData) {
            navigate(`/${id}`);
        }
    }, [clickData, setClickData, id, setId]);

    if (isLoading) return "Loading...";
    if (isError) return "Some error occurred"

    if (!articles) return "Nothing here, yet"

    const numberToStartSelectingFrom = Math.floor(
        Math.random() * articles.length);
    const interestingArticles: ArticleType[] = []

    for (let i = 0; i < 5; i++) {
        const index = (numberToStartSelectingFrom + i) % articles.length
        interestingArticles.push(articles[index]);
    }

    return (
        <div className="SideBar">
            <div className="SideBar__Topic">
                <div className="SideBar__Topic_Text">
                    <h2 className="text-2xl font-light mt-2">Всі Статті</h2>
                </div>
                <div className="SideBar__Topic_Count">
                    <h2 className="text-2xl font-light mt-2">(72)</h2>
                </div>
            </div>
            <div>
                {interestingArticles.map((a) => {
                    return (
                        <div onClick={() => {
                            handleClick(a.id)
                        }}>
                            <Article data={a} count={
                                interestingArticles.indexOf(a)}/>
                        </div>)
                })}
            </div>
        </div>
    );
};

export default SideBar;
