import {useSelector} from "react-redux";
import {selectCurrentRole} from "../redux/authSlice.ts";
import {Navigate} from "react-router-dom";
import PublishPage from "./PublishPage.tsx";

const RequireAdmin = () => {
    const role = useSelector(selectCurrentRole)

    if (!role || role !== "admin") {
        return <Navigate to="/" replace/>;
    }

    return <PublishPage/>
}

export default RequireAdmin