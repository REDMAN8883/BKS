import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";   
import linksByRole from '../components/LinkByRole';

// Css
import styles from '../css/clientCss/navBar.module.css';

// Importaciones de imagenes
import BusinessLogo from "../assets/BussinesLogo.png";

export default function NavBar({className = ''}){
    const { user } = useAuth();
    // console.log("USER:", user);
    const links = linksByRole[user?.rol] || [];

    return (
        <aside className={`${styles.navbar} ${className}`}>
            <img className={styles.LogoNav} src={BusinessLogo} alt="Imagen_BKS" />
            {links.map((link) => (
                <Link className={styles.link} key={link.path} to={link.path}>
                    {link.label}
                </Link>
            ))}
        </aside>
    )
}