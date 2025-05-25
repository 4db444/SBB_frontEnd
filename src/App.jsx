import { lazy } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "./Layout/Layout.jsx"

const HomePage = lazy(() => import("./pages/HomePage.jsx"))
const AuthPage = lazy(() => import("./pages/AuthPage.jsx"))
const LandingPage = lazy(() => import("./pages/LandingPage.jsx"))

export default function App (){
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout/>}>
          <Route path="/" element={<HomePage/>}/>
          <Route path="/auth" element={<AuthPage/>}/>
          <Route path="/welcome" element={<LandingPage/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}