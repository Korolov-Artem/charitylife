import './App.css'
import Header from "./Header/Header.tsx";
import SideBar from "./SideBar/SideBar.tsx";
import Content from "./Content/Content.tsx";
import Footer from "./Footer/Footer.tsx";

function App() {
    return (
        <div className="App">
            <Header />
            <SideBar />
            <Content />
            <Footer />
        </div>
    )
}

export default App
