import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../Context/AuthContext";

export default function GuestRoutes (){
    const {user} = useUser()

    return user ? <Navigate to="/"/> : <Outlet/>
}