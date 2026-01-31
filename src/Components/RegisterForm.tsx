import React, {useEffect, useState} from "react";
import {useRegisterMutation} from "../services/authApi.ts";
import {useNavigate} from "react-router-dom";

const RegisterForm = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [formError, setFormError] = useState<string | null>(null);
    const [click, setClick] = useState<boolean>(false);

    const [register, {isLoading}] = useRegisterMutation()
    const navigate = useNavigate()

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
            const response = await register({email, password, name}).unwrap()
            if (response.user !== false) {
                return response.user
            } else {
                setFormError("Registration success but no id received");
            }
            navigate("/");
        } catch (error: any) {
            console.log("Failed to register: ", error)
            if (error.data && error.data.error) {
                setFormError(error.data.error)
            } else {
                setFormError("An unexpected error occurred during registration process, please try again later");
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
                <h2 className="text-3xl mt-[5vh]">Welcome</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <div className="font-[Cormorant_Garamond]">
                            <label
                                htmlFor="name"
                                className="flex ml-[2.5vw] text-xl mt-[5vh]"
                            >
                                Your Name
                            </label>
                            <input
                                type="name"
                                id="name"
                                value={name}
                                placeholder="Joshua Jebkins"
                                onChange={(e) => setName(e.target.value)}
                                className="bg-[#ECEBDF] text-lg text-black pl-[1vw] border border-[#EEC5C5] rounded-sm mt-[1vh] w-[25vw] h-[4vh]"
                            />
                        </div>
                        <div className="font-[Cormorant_Garamond]">
                            <label
                                htmlFor="email"
                                className="flex ml-[2.5vw] text-xl mt-[2vh]"
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
                            ) : "Register"}
                        </button>
                        <div className="mt-[3vh]">
                            <label className="text-xl !text-[#faeeee] font-[Cormorant_Garamond]">
                                Already have an account?
                            </label>
                            <a
                                className="text-xl !text-[#faeeee] !underline"
                                href="/login"
                            >
                                Login!
                            </a>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default RegisterForm
