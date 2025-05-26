import { Outlet } from "react-router-dom";
import { Suspense } from "react";
import Nav from "./Nav";
import Footer from "./Footer";

export default function Layout (){
    return <>
        <Nav />
        <Suspense fallback={<p>loading ...</p>}>
            <Outlet/>
        </Suspense>
        <Footer/>
    </>
}