import NewArticle from "../../Components/NewArticle";
import "./HomePage.css";
import ArticlesThemes from "../../Components/ArticlesThemes.tsx";

const Content = () => {
    return (
        <div className="HomePage">
            <NewArticle/>
            <ArticlesThemes/>
        </div>
    );
};

export default Content;
