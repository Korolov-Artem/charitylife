import "./Header.css";
import Menu from "../../Components/Menu.tsx";
import {useState} from "react";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMenuVisible, setIsMenuVisible] = useState(false);


    const toggleMenu = () => {
        if (isMenuOpen) {
            // Start closing animation
            setIsMenuVisible(false);
            // Wait for animation to complete before unmounting
            setTimeout(() => {
                setIsMenuOpen(false);
            }, 300);
        } else {
            // Mount component first
            setIsMenuOpen(true);
            // Then start opening animation
            setTimeout(() => {
                setIsMenuVisible(true);
            }, 10);
        }
    };

    const handleMenuClose = () => {
        setIsMenuVisible(false);
        setTimeout(() => {
            setIsMenuOpen(false);
        }, 300);
    };


    return (
        <header className="Header">
            <div className="Header__Text">
                <div className="Header__Text_Publications">
                    <h2 className="text-3xl mt-4 font-light hover:tracking-widest transition-all duration-300">Публікації</h2>
                </div>
                <div className="Header__Text_Title">
                    <h2 className="text-3xl mt-4 font-light">CharityLife</h2>
                </div>
                <div className="Header__Text_Menu">
                    <h2
                        className="z-50 text-3xl mt-4 font-light hover:tracking-widest transition-all duration-300"
                        id="menu"
                        onClick={toggleMenu}>Меню</h2>
                    {/*<h2 className="text-3xl mt-4 font-light hover:tracking-widest transition-all duration-300"*/}
                    {/*    onClick={handleClick}>Авторизація</h2>*/}
                </div>
            </div>
            {isMenuOpen && <Menu isOpen={isMenuVisible} onClose={handleMenuClose}/>}
        </header>
    );
};

export default Header;
