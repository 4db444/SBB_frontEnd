import { createContext, useContext, useState } from "react";

const GroupContext = createContext()

export const useGroup = () => useContext(GroupContext)

export default function GroupProvider ({children}){
    const [groups, setGroups] = useState([])

    async function getGroups (){
        const res = await fetch("http://localhost:8000/group", {
            credentials : "include"
        })

        if (res.ok){
            const data = await res.json()
            setGroups(data)
        }
    }

    function getGroupById(id){
        const group = groups.find(g => g.id = id)

        return group
    }

    return <GroupContext.Provider value={{groups, getGroupById, getGroups}}>
        {children}
    </GroupContext.Provider>
}