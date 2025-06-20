import "./App.css";
import Header from "./Pages/Header/Header.tsx";
import SideBar from "./Pages/SideBar/SideBar.tsx";
import HomePage from "./Pages/Content/HomePage.tsx";
import Footer from "./Pages/Footer/Footer.tsx";

function App() {
  return (
    <div className="App">
      <Header />
      <SideBar />
      <HomePage />
      <Footer />
    </div>
  );
}

export default App;
