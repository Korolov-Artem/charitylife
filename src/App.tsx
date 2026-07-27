import { useState } from "react";
import "./App.css";
import HomePage from "./Pages/Content/HomePage.tsx";
import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";
import LoginForm from "./Components/LoginForm.tsx";
import { AppLoaderManager } from "./Components/AppLoaderManager.tsx";
import RegisterForm from "./Components/RegisterForm.tsx";
import RequireAdmin from "./Components/RequireAdmin.tsx";
import PublishPage from "./Components/PublishPage.tsx";
import AllArticles from "./Components/AllArticles.tsx";
import Layout from "./Pages/Layout.tsx";
import Preloader from "./Components/Preloader.tsx";
import VisualIndex from "./Components/VisualIndex.tsx";
import CreatePoll from "./Components/CreatePoll.tsx";
import ForgotPassword from "./Components/ForgotPassword.tsx";
import ResetPassword from "./Components/ResetPassword.tsx";
import ThemePage from "./Components/ThemePage.tsx";
import ArticleView from "./Components/ArticleView.tsx";
import GlobalSensoryUX from "./Components/GlobalSensoryUX.tsx";
import ScrollManager from "./Components/ScrollManager.tsx";

const LayoutWrapper = () => {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

function App() {
  const [isPreloading, setIsPreloading] = useState(true);

  return (
    <>
      {isPreloading && <Preloader onComplete={() => setIsPreloading(false)} />}

      <AppLoaderManager>
        <BrowserRouter>
          <GlobalSensoryUX/>
          <ScrollManager />
            <Routes>
              {/* Sits outside the shell on purpose — an article runs full-bleed,
                  with no masthead or colophon around it. */}
              <Route path="/:id" element={<ArticleView />} />

              <Route element={<LayoutWrapper />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/theme/:themeId" element={<ThemePage />} />

                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<RegisterForm />} />

                <Route element={<RequireAdmin />}>
                  <Route path="/publish" element={<PublishPage />} />
                  <Route path="/publish-poll" element={<CreatePoll />} />
                </Route>

                <Route path="/allArticles" element={<AllArticles />} />
                <Route path="/archive" element={<VisualIndex />} />

                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
              </Route>
            </Routes>
        </BrowserRouter>
      </AppLoaderManager>
    </>
  );
}

export default App;
