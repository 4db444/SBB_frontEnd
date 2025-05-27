import { useState } from "react"
import Cookies from "js-cookie"
import styles from "./AuthPage.module.css"
import { useUser } from "../Context/AuthContext"

export default function AuthPage () {
    const {login} = useUser()
    const [authType, setAuthType] = useState("login")
    const [formData, setFormData] = useState({
        email : "", 
        password : "",
        first_name : "",
        last_name : "",
        password_confirmation : "",
        starting_budget : ""
    })

    function initializeState (){
        setFormData({
            email : "", 
            password : "",
            first_name : "",
            last_name : "",
            password_confirmation : "",
            starting_budget : ""
        })
    }

    function handleChange (e){
        const {name, value} = e.target
        setFormData(prev => ({
            ... prev, 
            [name] : value
        }))
    }
    
    async function handleSubmit (e){
        e.preventDefault()
        
        const res = await fetch(`http://localhost:8000/api/auth/${authType}`, {
            method : "POST",
            credentials : "include",
            headers : {
                "content-type" : "application/json",
                "X-XSRF-TOKEN" : Cookies.get("XSRF-TOKEN")
            },
            body : JSON.stringify(formData)
        })

        if(res.ok){
            authType === "login" ? login() : setAuthType("login")
        }

    }
    return <main className={styles.main}>
        <h1 className={styles.title}>auth page</h1>
        <form className={styles.form}>

            <h2>{authType} form</h2>
            <div className={styles.choice}>
                <input type="radio" name="auth" id="login" checked={authType === "login"} onChange={() => {setAuthType("login"); initializeState()}} />
                <label htmlFor="login">log in</label>
                <input type="radio" name="auth" id="signup" checked={authType === "register"} onChange={() => {setAuthType("register"); initializeState()}} />
                <label htmlFor="signup">sign Up</label>
                <div></div>
            </div>
            { authType === 'register' && <>
                    <label htmlFor="first_name">first name</label>
                    <input type="text" name="first_name" onChange={handleChange} value={formData.first_name} />

                    <label htmlFor="last_name">last name</label>
                    <input type="text" name="last_name" onChange={handleChange} value={formData.last_name} />
                </>
            }
            
            <label htmlFor="email">email</label>
            <input type="email" name="email" onChange={handleChange} value={formData.email} />

            <label htmlFor="password">password</label>
            <input type="password" name="password" onChange={handleChange} value={formData.password} />

            { authType === 'register' && <>
                    <label htmlFor="password_confirmation">confim password</label>
                    <input type="password" name="password_confirmation" onChange={handleChange} value={formData.password_confirmation} />

                    <label htmlFor="starting_budget">Stargin budget</label>
                    <input type="number" name="starting_budget" onChange={handleChange} value={formData.starting_budget} />
                </>
            }

            <button type="submit" onClick={handleSubmit}>submit</button>
        </form>
    </main>
}