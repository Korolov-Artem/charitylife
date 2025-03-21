import './App.css'
import Rebuilding from './assets/Rebuilding.png'

function App() {
    return (
        <div className="App">
            <div className="App__maintenance_img">
                <img src={Rebuilding} alt={Rebuilding}/>
            </div>
            <div className="App__maintenance_text">
                <h1>О ні!</h1>
                <h1>Схоже, у нас перебудова...</h1>
            </div>
        </div>
    )
}

export default App
