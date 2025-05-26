import { Link } from "react-router-dom"
import styles from "./Nav.module.css"

export default function Nav (){
    return <header className={styles.header}>
        <nav className={styles.nav}>
            <h1>budget buddy</h1>
            <ul>
                <li><Link>dashboard</Link></li>
                <li><Link>incomes</Link></li>
                <li><Link>expenses</Link></li>
                <li><Link>groups</Link></li>
            
            </ul>
        </nav>
    </header>
}