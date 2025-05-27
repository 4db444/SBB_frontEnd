import { useEffect, useState } from "react";
import styles from "./TransactionForm.module.css"
import Cookies from "js-cookie";

export default function TransactionForm ({handleClose, addTransaction}){
    const [transactionType, setTransactionType] = useState("income")
    const [beneficiary, setBeneficiary] = useState("personal")
    const [categories, setCategories] = useState([])
    const [formData, setFormData] = useState({
        amount : '',
        description : "",
        category : ""
    })
    
    useEffect(() =>{
        getCategories()

        setFormData({
            amount : '',
            description : "",
            category : ""
        })
    }, [transactionType])

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

            <select id="" name="category" value={formData.category} onChange={handleChange}>
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

                    <div>
                        <p>groups</p>
                        {}
                    </div>
                </>
            }


            <button type="submit" >submit</button>
        </form>
    </div>
}