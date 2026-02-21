import "./App.css";
import HomePage from "./Pages/Content/HomePage.tsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import LoginForm from "./Components/LoginForm.tsx";
import Article from "./Components/Article.tsx";
import {AppLoaderManager} from "./Components/AppLoaderManager.tsx";
import RegisterForm from "./Components/RegisterForm.tsx";
import RequireAdmin from "./Components/RequireAdmin.tsx";
import PublishPage from "./Components/PublishPage.tsx";
import AllArticles from "./Components/AllArticles.tsx";
import MediaGallery from "./Components/MediaGallery.tsx";
import Layout from "./Pages/Layout.tsx";

function App() {
    return (
        <AppLoaderManager>
            <BrowserRouter>
                <Layout>
                    <Routes>
                        <Route path="/" element={<HomePage/>}/>

                        <Route path="/login" element={<LoginForm/>}/>
                        <Route path="/register" element={<RegisterForm/>}/>

                        <Route path="/:id" element={<Article/>}/>

                        <Route element={<RequireAdmin/>}>
                            <Route path="/publish" element={<PublishPage/>}/>
                        </Route>

                        <Route path="/allArticles" element={<AllArticles/>}/>
                        <Route path="/gallery" element={<MediaGallery/>}/>
                    </Routes>
                </Layout>
            </BrowserRouter>
        </AppLoaderManager>
    );
}

export default App;
