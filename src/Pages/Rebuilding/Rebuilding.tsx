import RebuildingImg from "../assets/Rebuilding.png"
import "./Rebuilding.css"

const Rebuilding = () => {
    return (
        <>
            <div className="App__maintenance_img">
                <img src={RebuildingImg} alt={RebuildingImg}/>
            </div>
            <div className="App__maintenance_text">
                <h1>О ні!</h1>
                <h1>Схоже, у нас перебудова...</h1>
                <h2>info@charitylife.org</h2>
            </div>
        </>
    )
}

export default Rebuilding