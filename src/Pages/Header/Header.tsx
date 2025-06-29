import "./Header.css";
import AuthCheckComponent from "../../Components/AuthCheckComponent.tsx";

const Header = () => {
    const isLoggedIn: boolean | null = AuthCheckComponent()
  
    return (
        <div className="Header">
            <div className="Header__Text">
                <div className="Header__Text_Publications">
                    <h2 className="text-3xl mt-4 font-light">Публікації</h2>
                </div>
                <div className="Header__Text_Title">
                    <h2 className="text-3xl mt-4 font-light">CharityLife</h2>
                </div>
                <div className="Header__Text_Menu">
                    {isLoggedIn ? <h2 className="text-3xl mt-4 font-light">Меню</h2> :
                        <h2 className="text-3xl mt-4 font-light">Авторизація</h2>
                    }
                </div>
            </div>
        </div>
    );
};

export default Header;
