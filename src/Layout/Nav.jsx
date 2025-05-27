import { Link, useLocation } from "react-router-dom"
import styles from "./Nav.module.css"
import { useUser } from "../Context/AuthContext"
import { FaRegUser } from "react-icons/fa";

export default function Nav (){
    const {user} = useUser()
    const {pathname} = useLocation()

    return <header className={styles.header}>
        <nav className={styles.nav}>
            <h1><Link to="/welcome">budget buddy</Link></h1>
            <ul>
                {user && <>
                    <li className={pathname === "/" ? styles.selectedTab : ""}><Link to="/">dashboard</Link></li>
                    <li className={pathname === "/transactions" ? styles.selectedTab : ""}><Link to="/transactions">transactions</Link></li>
                    <li className={pathname === "/groups" ? styles.selectedTab : ""}><Link to="/groups">groups</Link></li>
                </>}
                
                <li className={pathname === "/contact" ? styles.selectedTab : ""}><Link to="/contact">contact</Link></li>
                <li className={pathname === "/about" ? styles.selectedTab : ""}><Link to="/about">about</Link></li>
            </ul>
            <button className={pathname === "/profile" || pathname === "/auth" ? styles.selectedTab : ""}>
                <Link to={user ? "/profile" : "/auth"} > 
                    <FaRegUser /> 
                    {user && `${user.first_name} ${user.last_name}`}
                </Link>
            </button>
        </nav>
    </header>
}