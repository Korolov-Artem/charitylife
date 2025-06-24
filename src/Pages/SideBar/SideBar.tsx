import "./SideBar.css";
import Article from "./Article/Article.tsx";

const SideBar = () => {
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
                <Article count={1}/>
                <Article count={2}/>
                <Article count={3}/>
                <Article count={4}/>
                <Article count={5}/>
            </div>
        </div>
    );
};

export default SideBar;
