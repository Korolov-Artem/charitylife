import "./SideBar.css";
import {useGetArticlesQuery} from "../../services/blogApi.ts";
import Article from "./Article/Article.tsx";
import {ArticleType} from "../../types/ArticleType.ts";

const SideBar = () => {
    const {data: articles, isLoading, isError} = useGetArticlesQuery(undefined)

    if (isLoading) return "Loading...";
    if (isError) return "Some error occurred"

    if (!articles) return "Nothing here, yet"

    const numberToStartSelectingFrom = Math.floor(
        Math.random() * (articles.length - 1 + 1));
    const maxArticles = numberToStartSelectingFrom + 5
    const interestingArticles: ArticleType[] = []

    for (let i = numberToStartSelectingFrom; i < maxArticles; i++) {
        if (articles[i]) {
            interestingArticles.push(articles[i])
        }
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
                    return <Article data={a} count={
                        interestingArticles.indexOf(a)}/>
                })}
            </div>
        </div>
    );
};

export default SideBar;
