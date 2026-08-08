import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
// CSS
import '../css/Navbar.css';

export default function NavBar(){
    const { user } = useAuth();

    const linksPorRol = {
        admin: [
            { path: "/admin/catalogo", label: "Catalogo"},
            { path: "/admin/perfil", label: "Perfil"},
            // Me faltan rutas
        ],
        cliente: [
            { path: "/cliente/catalogo", label: "Catalogo"},
            { path: "/cliente/perfil", label: "Perfil"},
            { path: "/login", label: "Login" },

            // Faltan mas rutas
        ],
    };

    const links = linksPorRol[user?.rol] || [];

    return (
        <>
            <nav>
                {links.map((link) => (
                    <Link key={link.path} to={link.path} className="Links">
                        {link.label}
                    </Link>
                ))}
            </nav>
        </>
    );
}