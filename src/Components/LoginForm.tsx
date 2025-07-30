import React, {useEffect, useState} from "react";
import {useLoginMutation} from "../services/authApi.ts";
import {useNavigate} from "react-router-dom";
import {setCredentials} from "../redux/authSlice.ts";
import {useDispatch} from "react-redux";


const LoginForm = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [formError, setFormError] = useState<string | null>(null);
    const [click, setClick] = useState<boolean>(false);

    const [login, {isLoading}] = useLoginMutation()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleBackClick = () => {
        setClick(true)
    }
    useEffect(() => {
        if (click) {
            navigate("/")
        }
    }, [click, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);

        if (!email || !password) {
            setFormError("Please enter valid email and password");
            return;
        }

        try {
            const response = await login({email, password}).unwrap()

            if (response.accessToken) {
                localStorage.setItem("authToken", response.accessToken)
                if (response.deviceId) {
                    localStorage.setItem("deviceId", response.deviceId)
                }
                dispatch(setCredentials({
                    accessToken: response.accessToken,
                    deviceId: response.deviceId
                }))
            } else {
                setFormError("Login successfully but no authToken received");
            }
            navigate("/");
        } catch (error: any) {
            console.log("Failed to login: ", error)
            if (error.data && error.data.error) {
                setFormError(error.data.error)
            } else {
                setFormError("An unexpected error occurred during login process, please try again later");
            }
        }
    }

    return (
        <div
            className="text-[#faeeee] bg-[#ECEBDF] z-10 fixed inset-0 flex items-center justify-center overflow-hidden">

            <div
                className="text-black text-4xl flex -mt-[90vh] -ml-[30vw] font-light hover:text-[#BD3900] transition-all duration-300 cursor-pointer"
                onClick={handleBackClick}
            >
                {"⇚ Назад"}
            </div>

            <div className="bg-[#BD3900] rounded-lg w-[30vw] h-[60vh] drop-shadow-2xl backdrop-blur-[] ml-[23vw]">
                <h2 className="text-3xl mt-[5vh]">Welcome Back</h2>
                <h3 className="text-xl text-[#EEC5C5] mt-[2vh]">Login with your account information</h3>
                <form onSubmit={handleSubmit}>
                    <div>
                        <div className="font-[Cormorant_Garamond]">
                            <label
                                htmlFor="email"
                                className="flex ml-[2.5vw] text-xl mt-[5vh]"
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                placeholder="your@example.com"
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="bg-[#ECEBDF] text-lg text-black pl-[1vw] border border-[#EEC5C5] rounded-sm mt-[1vh] w-[25vw] h-[4vh]"
                            />
                        </div>
                        <div className="flex justify-between font-[Cormorant_Garamond]">
                            <label
                                htmlFor="password"
                                className="flex ml-[2.5vw] text-xl mt-[2vh]"
                            >
                                Password
                            </label>
                            <a
                                href="/register"
                                className="text-lg !text-[#faeeee] mt-[2vh] mr-[2.5vw]"
                            >Forgot your password?</a>
                        </div>
                        <div>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                placeholder="••••••••"
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="bg-[#ECEBDF] text-lg text-black pl-[1vw] border border-[#EEC5C5] rounded-sm mt-[1vh] w-[25vw] h-[4vh]"
                            />
                        </div>
                        {formError && (
                            <div className="mt-[2vh] underline">
                                <span
                                    className="text-xl font-[Cormorant_Garamond]"
                                >{formError}</span>
                            </div>
                        )}
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="w-[25vw] h-[5vh] !text-xl mt-[4vh] transition duration-200 hover:bg-[#ECEBDF] bg-black border-none hover:border-none"
                        >
                            {isLoading ? (
                                ""
                            ) : "Login"}
                        </button>
                        <div className="mt-[3vh]">
                            <label className="text-xl !text-[#faeeee] font-[Cormorant_Garamond]">Don't have an account
                                yet? </label>
                            <a
                                className="text-xl !text-[#faeeee] !underline"
                                href="/register"
                            >
                                Sign Up!
                            </a>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default LoginForm
