import './SideBar.css'
import Article from "./Article/Article.tsx";

const SideBar = () => {
    return (
        <div className='SideBar'>
            <div className='SideBar__Topic'>
                <div className='SideBar__Topic_Text'>
                    <h2>Всі Статті</h2>
                </div>
                <div className='SideBar__Topic_Count'>
                    <h2>(72)</h2>
                </div>
            </div>
            <div className='SideBar__Articles'>
                <Article/>
                <Article/>
                <Article/>
                <Article/>
                <Article/>
            </div>
        </div>
    )
}

export default SideBar