import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import AuthCheckComponent from "./AuthCheckComponent.tsx";

const Menu = ({onClose, isOpen}: { onClose: () => void, isOpen: boolean }) => {
    const isLoggedIn: boolean | null = AuthCheckComponent()

    const navigate = useNavigate();
    const [clickData, setClickData] = useState(false)
    const [url, setUrl] = useState("");
    const [isVisible, setIsVisible] = useState(false);

    const handleHomeClick = () => {
        setClickData(true);
        setUrl("/")
    }
    const handleRegisterClick = () => {
        setClickData(true);
        setUrl("/register")
    }
    
    useEffect(() => {
        if (clickData && url.length > 0) {
            navigate(`${url}`)
        }
    }, [clickData, navigate, url])

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => setIsVisible(true), 10)
        } else {
            setIsVisible(false)
        }
    }, [isOpen])

    const handleClose = () => {
        setIsVisible(false)
        setTimeout(() => {
            onClose()
        }, 300)
    }

    return (
        <div className={`bg-[#ECEBDF] fixed inset-0 bg-opacity-95 z-40 transition-all duration-300 ease-in-out ${
            isVisible
                ? 'bg-opacity-95 backdrop-blur-sm'
                : 'bg-opacity-0 backdrop-blur-none pointer-events-none'
        }`}
        >
            <style>{`
                .bounce-arrow {
                    animation: bounce 2s infinite;
                }
                @keyframes bounce {
                    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                    40% { transform: translateY(-10px); }
                    60% { transform: translateY(-5px); }
                }
                
                 .menu-content {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                
                .menu-enter {
                    opacity: 0;
                    transform: translateY(-20px) scale(0.95);
                }
                
                .menu-enter-active {
                    opacity: 1;
                    transform: translateY(0) scale(1);
            `}</style>

            <div className={`menu-content ${isVisible ? 'menu-enter-active' : 'menu-enter'}`}>
                <h2
                    className="!bg-[#ECEBDF] text-[#BD3900] w-[5vw] h-[5vh] !text-5xl hover:!text-6xl transition-all duration-300 cursor-pointer flex justify-end text-right absolute right-0 top-0 mt-[0.5vh] mr-[3vw]"
                    onClick={handleClose}
                >
                    X
                </h2>

                {!isLoggedIn ?
                    <h2 className="font-light text-5xl underline cursor-pointer text-[#BD3900] ml-[42.5vw] mt-[1vh] w-[10vw]"
                        onClick={handleRegisterClick}
                    >
                        Реєстрація</h2>
                    : <h2></h2>
                }

                {/*<div*/}
                {/*    className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-[#BD3900] text-8xl bounce-arrow z-30">*/}
                {/*    ↓*/}
                {/*</div>*/}

                <div className="h-full overflow-y-auto pt-[10vh] pb-[5vh]">
                    <div className="flex flex-col items-center justify-start py-8">
                        <nav className="text-center text-6xl space-y-[8vh] tracking-widest w-[100vw]">
                            <h3 className="cursor-pointer transition-all duration-300 hover:text-[#BD3900]"
                                onClick={handleHomeClick}
                            >
                                Додому</h3>
                            <h3 className="cursor-pointer transition-all duration-300 hover:text-[#BD3900]">
                                Дизайн</h3>
                            <h3 className="cursor-pointer transition-all duration-300 hover:text-[#BD3900]">
                                Здоровʼя</h3>
                            <h3 className="cursor-pointer transition-all duration-300 hover:text-[#BD3900]">
                                Подорожі</h3>
                            <h3 className="cursor-pointer transition-all duration-300 hover:text-[#BD3900]">
                                Відносини</h3>
                            <h3 className="cursor-pointer transition-all duration-300 hover:text-[#BD3900]">
                                Їжа</h3>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Menu