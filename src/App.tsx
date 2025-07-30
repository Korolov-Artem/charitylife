import "./App.css";
import Header from "./Pages/Header/Header.tsx";
import SideBar from "./Pages/SideBar/SideBar.tsx";
import HomePage from "./Pages/Content/HomePage.tsx";
import Footer from "./Pages/Footer/Footer.tsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import LoginForm from "./Components/LoginForm.tsx";
import Article from "./Components/Article.tsx";
import {AppLoaderManager} from "./Components/AppLoaderManager.tsx";

function App() {
    return (
        <AppLoaderManager>
            <BrowserRouter>
                <div className="App">
                    <Routes>
                        <Route path="/" element={[<SideBar/>, <HomePage/>, <Header/>, <Footer/>]}/>
                        <Route path="/login" element={<LoginForm/>}/>
                        <Route path="/:id" element={[<Article/>, <Header/>]}/>
                    </Routes>
                </div>
            </BrowserRouter>
        </AppLoaderManager>
    );
}

export default App;
