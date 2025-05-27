import { lazy, useEffect } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Cookies from "js-cookie"
import Layout from "./Layout/Layout.jsx"
import AuthRoutes from "./Route Protection/AuthRoutes.jsx"
import GuestRoutes from "./Route Protection/GuestRoutes.jsx"
import { useUser } from "./Context/AuthContext.jsx"
import { useGroup } from "./Context/GroupContext.jsx"

const HomePage = lazy(() => import("./pages/HomePage.jsx"))
const AuthPage = lazy(() => import("./pages/AuthPage.jsx"))
const LandingPage = lazy(() => import("./pages/LandingPage.jsx"))
const TransactionPage = lazy(() => import("./pages/TransactionPage.jsx"))
const GroupPage = lazy(() => import("./pages/GroupPage.jsx"))
const AboutPage = lazy(() => import("./pages/AboutPage.jsx"))
const ContactPage = lazy(() => import("./pages/ContactPage.jsx"))
const ProfilePage = lazy(() => import("./pages/ProfilePage.jsx"))
const NotFound = lazy(() => import("./pages/NotFound.jsx"))


export default function App (){
  const {login} = useUser()
  const {groups, getGroups} = useGroup()

  useEffect(() => {
    if(!Cookies.get("XSRF-TOKEN")){
      fetch("http://localhost:8000/sanctum/csrf-cookie", {
        credentials : "include"
      })
    }
    login()

    if(!groups){
      getGroups()
    }
  }, [])
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout/>}>

          <Route element={<AuthRoutes/>}>
            <Route path="/" element={<HomePage/>}/>
            <Route path="/transactions" element={<TransactionPage/>}/>
            <Route path="/groups" element={<GroupPage/>}/>
            <Route path="/profile" element={<ProfilePage/>}/>
          </Route>

          <Route element={<GuestRoutes/>}>
            <Route path="/auth" element={<AuthPage/>}/>
          </Route>

            <Route path="/welcome" element={<LandingPage/>}/>
            <Route path="/contact" element={<ContactPage/>}/>
            <Route path="/about" element={<AboutPage/>}/>

          <Route path="*" element={<NotFound/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}