import { Outlet, Navigate } from "react-router-dom";
import { useUser } from "../Context/AuthContext";

export default function AuthRoutes (){
    const {user} = useUser()
    
    return user ? <Outlet/> : <Navigate to="/auth"/>
}