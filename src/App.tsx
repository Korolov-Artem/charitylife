import { useState } from "react";
import "./App.css";
import HomePage from "./Pages/Content/HomePage.tsx";
// Notice we added 'Outlet' to this import!
import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";
import LoginForm from "./Components/LoginForm.tsx";
import Article from "./Components/Article.tsx";
import { AppLoaderManager } from "./Components/AppLoaderManager.tsx";
import RegisterForm from "./Components/RegisterForm.tsx";
import RequireAdmin from "./Components/RequireAdmin.tsx";
import PublishPage from "./Components/PublishPage.tsx";
import AllArticles from "./Components/AllArticles.tsx";
import MediaGallery from "./Components/MediaGallery.tsx";
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

// --- NEW: A wrapper that injects the nested routes into your Layout ---
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
              {/* ── 1. FULL SCREEN ROUTE (No Sidebars) ── */}
              <Route path="/:id" element={<ArticleView />} />

              {/* ── 2. LAYOUT ROUTES (Everything inside gets Sidebars) ── */}
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
                <Route path="/gallery" element={<MediaGallery />} />
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
