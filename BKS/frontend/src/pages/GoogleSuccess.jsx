import { useEffect } from "react"; 
import { useNavigate, useSearchParams } from "react-router-dom"; 
import { useAuth } from "../context/useAuth";

export default function GoogleSuccess() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    console.log("TOKEN:", searchParams.get("token"));
    console.log("USUARIO:", searchParams.get("usuario"));
    const {login} = useAuth();

    useEffect (() => {
        const token = searchParams.get("token");
        const usuarioString = searchParams.get("usuario");

        

        if (!token || !usuarioString) {
            navigate("/login");
            return;
        }

        try {
            const usuario = JSON.parse(usuarioString);

            // Guardamos la autenticacion
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(usuario));
            localStorage.setItem("usuario_id", usuario.id);

            login(usuario);

            const rol = usuario.rol?.toLowerCase().trim();

            if (rol === "admin") {
                navigate("/admin", {replace: true});
            } else if (
                rol === "cliente" ||
                rol == "usuario"
            ) {
                navigate("/cliente", {replace: true});
            } else {
                navigate("/login", {replace: true});
            }
        } catch (error){
            console.error("Error procesando login de google:", error);

            navigate("/login", {replace: true});
        }
    }, [navigate, searchParams, login]);

    return(
        <div>
            iniciando sesion....
        </div>
    );
}