import {useEffect, useState} from "react";

const AuthCheckComponent = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token")

        if (token) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, [])

    return isLoggedIn
}

export default AuthCheckComponent;