import { createContext, useContext, useState } from "react";

const UserContext = createContext()

export const useUser = () => useContext(UserContext)

export default function UserProvider ({children}){
    const [user, setUser] = useState(null)

    async function login (){
        const res = await fetch("http://localhost:8000/api/auth/user", {
            credentials : "include",
        })

        if (res.ok) {
            const user = await res.json()
            setUser(user)
        }
    }

    return <UserContext.Provider value={{user, login}}>
        {children}
    </UserContext.Provider>
}