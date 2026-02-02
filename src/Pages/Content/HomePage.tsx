import NewArticle from "../../Components/NewArticle";
import "./HomePage.css";
import ArticlesThemes from "../../Components/ArticlesThemes.tsx";
import AddArticle from "../../Components/AddArticle.tsx";

const Content = () => {
    return (
        <div className="HomePage">
            <NewArticle/>
            <ArticlesThemes/>
            <div style={{
                position: "fixed",
                bottom: "20px",
                right: "20px",
                zIndex: 9999,
                backgroundColor: "white",
                padding: "20px",
                border: "2px solid red" // Red border to make it obvious
            }}>
                <h3>Dev Upload Tool</h3>
                <AddArticle/>
            </div>
        </div>
    );
};

export default Content;
