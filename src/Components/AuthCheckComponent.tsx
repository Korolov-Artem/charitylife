import {useEffect, useState} from "react";

const useAuthCheck = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
    const [userRole, setUserRole] = useState<string | null>("user")

    useEffect(() => {
        const token = localStorage.getItem("authToken")
        const role = localStorage.getItem("userRole")

        if (token) {
            setIsLoggedIn(true);
            setUserRole(role)
        } else {
            setIsLoggedIn(false);
        }
    }, [])

    return {
        isLoggedIn,
        userRole
    }
}

export default useAuthCheck;