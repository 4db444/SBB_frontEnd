import { useEffect, useState } from "react"
import styles from "./TransactionPage.module.css"
import { MdOutlineGroup } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import Cookies from "js-cookie";
import TransactionForm from "../Components/TransactionPage/TransactionForm";


export default function TransactionPage (){
    const [transactions, setTransactions] = useState([])
    const [showForm, setShowForm] = useState(true)
    const [totalIncomes, setTotalIncomes] = useState(0)
    const [totalExpenses, setTotalExpenses] = useState(0)

    useEffect(() => {

        getTransactions()

    }, [])

    function close (){
        setShowForm(false)
    }

    function addTransaction (newTransaction){
        setTransactions(prev => [
            newTransaction,
            ... prev
        ])
    }

    async function getTransactions (){
        const incomeRes = await fetch("http://localhost:8000/api/income", {
            credentials : "include"
        })
        const incomeData = await incomeRes.json();
        incomeData.length && setTotalIncomes(incomeData.reduce((acc, next) => acc + next.amount, 0))

        const expenseRes = await fetch("http://localhost:8000/api/expense", {
            credentials : "include"
        })

        const expenseData = await expenseRes.json()
        expenseData.length && setTotalExpenses(expenseData.reduce((acc, next) => acc + next.amount, 0))
        
        setTransactions([...incomeData, ...expenseData].sort((a, b) => b.created_at.localeCompare(a.created_at)))
    }

    async function handleDelete (transaction, type){
        if(!confirm("are you sure you want to delete this task ?")) return

        const res = await fetch(`http://localhost:8000/api/${type}/${transaction.id}`, {
            method : "DELETE",
            credentials : "include",
            headers : {
                "X-XSRF-TOKEN" : Cookies.get("XSRF-TOKEN")
            }
        })

        if (res.ok){
            setTransactions(prev => prev.filter(t => t.id !== transaction.id))
            type === "expense" ? setTotalExpenses(prev => prev - transaction.amount) : setTotalIncomes(prev => prev - transaction.amount)
        }
    }




    return <main>
        <h1>transactoins apge</h1>

        <div className={styles.stats}>

            <div className={styles.stat}>
                total incomes {totalIncomes}
            </div>
            <div className={styles.stat}>
                total expenses {totalExpenses}
            </div>
            <div className={styles.stat}></div>

        </div>

        <table className={styles.table}>
            <thead>
                <tr>
                    <th>description</th>
                    <th>amount</th>
                    <th>category</th>
                    <th>actions</th>
                </tr> 
            </thead>
            <tbody>
                {
                    transactions.map(t => <tr>
                        <td>
                            {t.description}   
                            {t?.group?.name && <span className={styles.group}>   
                                    <MdOutlineGroup/>  {t.group.name}
                                </span>}
                        </td>
                        {t.expense_category_id !== undefined ? 
                            <td className={styles.expense}> - {t.amount}$</td>
                            : 
                            <td className={styles.income}> + {t.amount}$</td>
                         }
                        <td>{t?.category?.name || "-"}</td>
                        <td className={styles.actions}>
                            <MdOutlineRemoveRedEye className={styles.eye}/>
                            <MdDeleteOutline className={styles.trash} onClick={() => handleDelete(t, t.expense_category_id !== undefined ? "expense" : "income")}/>
                        </td>
                    </tr>)
                }
            </tbody>
            
        </table>
        {showForm && <TransactionForm handleClose={close} addTransaction={addTransaction} />}
    </main>
}