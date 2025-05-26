import { Outlet } from "react-router-dom";
import { Suspense } from "react";
import Nav from "./Nav";

export default function Layout (){
    return <>
        <Nav />
        <Suspense fallback={<p>loading ...</p>}>
            <Outlet/>
        </Suspense>
    </>
}