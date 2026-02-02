import "./App.css";
import Header from "./Pages/Header/Header.tsx";
import SideBar from "./Pages/SideBar/SideBar.tsx";
import HomePage from "./Pages/Content/HomePage.tsx";
import Footer from "./Pages/Footer/Footer.tsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import LoginForm from "./Components/LoginForm.tsx";
import Article from "./Components/Article.tsx";
import {AppLoaderManager} from "./Components/AppLoaderManager.tsx";
import RegisterForm from "./Components/RegisterForm.tsx";
import RequireAdmin from "./Components/RequireAdmin.tsx";
import PublishPage from "./Components/PublishPage.tsx";

function App() {
    return (
        <AppLoaderManager>
            <BrowserRouter>
                <div className="App">
                    <Routes>
                        <Route path="/" element={[<SideBar/>, <Header/>, <HomePage/>, <Footer/>]}/>
                        <Route path="/login" element={<LoginForm/>}/>
                        <Route path="/register" element={<RegisterForm/>}/>
                        <Route path="/:id" element={[<Article/>, <Header/>]}/>
                        <Route element={<RequireAdmin/>}>
                            <Route path="/publish" element={<PublishPage/>}/>
                        </Route>
                    </Routes>
                </div>
            </BrowserRouter>
        </AppLoaderManager>
    );
}

export default App;
