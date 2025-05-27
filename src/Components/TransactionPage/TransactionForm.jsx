import { useEffect, useState } from "react";
import styles from "./TransactionForm.module.css"
import Cookies from "js-cookie";
import { useGroup } from "../../Context/GroupContext";

export default function TransactionForm ({handleClose, addTransaction}){
    const {groups, getGroupById} = useGroup()
    const [transactionType, setTransactionType] = useState("income")
    const [beneficiary, setBeneficiary] = useState("personal")
    const [categories, setCategories] = useState([])
    const [formData, setFormData] = useState({
        amount : '',
        description : "",
        category : "",
        group : ""
    })
    
    useEffect(() =>{
        getCategories()

        setFormData({
            amount : '',
            description : "",
            category : "",
            group : '',
            members : []
        })
        setBeneficiary("personal")
    }, [transactionType])
    
    useEffect (() => {
        setFormData(prev => ({
            ...prev,
            group : '',
            members : []
        }))

    }, [beneficiary])

    async function getCategories (){
        const res = await fetch(`http://localhost:8000/api/${transactionType}/categories`, {
            credentials : "include"
        })

        if (res.ok){
            const data = await res.json();
            setCategories(data)
        }
    }

    function handleChange (e){
        const {name, value} = e.target
        setFormData({
            ... formData,
            [name] : value
        })
    }

    async function handleSubmit (e){
        e.preventDefault()
        if(!formData.amount || !formData.description || !formData.category) return

        const res = await fetch(`http://localhost:8000/api/${transactionType}`, {
            method : 'post', 
            credentials : "include",
            headers : {
                "content-type" : "application/json",
                "X-XSRF-TOKEN" : Cookies.get("XSRF-TOKEN")
            },
            body : JSON.stringify(formData)
        })

        if (res.ok) {
            const data = await res.json()

            addTransaction(data)
        }
    }
console.log(formData)
    function handleMembers (e){
        const {value, checked} = e.target

        if(checked){
            setFormData(prev => ({
                ...prev,
                members : [...prev.members, value]
            }))
        }else {
            setFormData(prev => ({
                ...prev, 
                members : prev.members.filter(m => m != value)
            }))
        }
    }

    return <div className={styles.formOverlay}>

        <form className={styles.form} onSubmit={handleSubmit}>
            <button className={styles.close} onClick={handleClose}>&times;</button>
            <h2>{transactionType} form</h2>
            <div className={styles.choice}>
                <input type="radio" name="transaction" id="income" checked={transactionType === "income"} onChange={() => setTransactionType("income")} />
                <label htmlFor="income">income</label>
                <input type="radio" name="transaction" id="expense" checked={transactionType === "expense"} onChange={() => setTransactionType("expense")} />
                <label htmlFor="expense">expense</label>
                <div></div>
            </div>
            
            <label htmlFor="amount">amount</label>
            <input type="text" name="amount" value={formData.amount} onChange={handleChange} placeholder={`${(Math.random() * 100).toFixed(2)} $`}/>

            <label htmlFor="description">description</label>
            <textarea name="description" id="" placeholder="Small description to help you remember" rows={3} value={formData.description} onChange={handleChange}>
                {formData.description}
            </textarea>

            <label htmlFor="category">category</label>
            <select id="category" name="category" value={formData.category} onChange={handleChange}>
                <option value="" disabled>select a category</option>
                { 
                    categories.map(c => <optgroup label={c.name}>
                        {c.children.map (child => <option value={child.name}>{child.name}</option>)}
                    </optgroup>)
                }
            </select>

            {
                transactionType === "expense" && <>
                    <div className={styles.choice}>
                        <input type="radio" name="beneficiary" id="personal" checked={beneficiary === "personal"} onChange={() => setBeneficiary("personal")} />
                        <label htmlFor="personal">personal</label>
                        <input type="radio" name="beneficiary" id="group" checked={beneficiary === "group"} onChange={() => setBeneficiary("group")} />
                        <label htmlFor="group">group</label>
                        <div></div>
                    </div>

                    {beneficiary === "group" && <div className={styles.groups}>
                        {groups.length ?<>
                                <p>groups:</p>
                                {
                                    groups.map(g => <>
                                        <input type="radio" name="group" id={g.id} onChange={() => setFormData({...formData, group : g.id})} />
                                        <label className={styles.group} htmlFor={g.id}>{g.name}</label>
                                    </>)
                                }
                                {formData.group && <div className={styles.members}>
                                    <p>members: </p>
                                        {
                                            getGroupById(formData.group).members.map(m => <>
                                                <input type="checkbox" name="members" id={`${m.first_name}${m.last_name}`} value={m.id}checked={formData.members.includes(`${m.id}`)} onChange={handleMembers}/>
                                                
                                                <label htmlFor={`${m.first_name}${m.last_name}`}>{m.first_name} {m.last_name}</label>
                                            </>)
                                        }
                                    </div>
                                }
                            </>
                            : <p>you are not in any groups</p>
                        }
                    </div>}
                </>
            }
            <button type="submit" >submit</button>
        </form>
    </div>
}