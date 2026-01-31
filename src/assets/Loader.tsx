import {SyncLoader} from "react-spinners";

const Loader = () => {
    return (
        <div className="bg-[#ECEBDF] w-[100vw] h-[100vh] flex items-center justify-center">
            <SyncLoader color="#e51f1f"/>
        </div>
    )
}

export default Loader