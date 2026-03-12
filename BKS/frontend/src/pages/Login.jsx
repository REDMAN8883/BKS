import { useState } from "react"
import { useNavigate } from "react-router-dom";

// Css
import '../css/Login.css';

// Pages o components necesarios
import { useAuth } from "../context/useAuth";
import ToastNotification from "../components/ToastNotification";
import LoadingOverlay from "../components/LoandingOverlay";

//import de alerta y axios
import axios from "axios";

//import Swal from "sweetalert2";

export default function Login() {
    //Campos de validacion
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    // Visualizar contraseña
    const [showPass, setShowPass] = useState(false);
    // Carga de los campos
    const [loading, setLoanding] = useState(false);
    const [cargaRegresar, setCargaRegresar] = useState(false);
    const [cargaFomulario, setCargaFormulario] = useState(false);
    const [cargaRecuperar, setFormularioRecuperar] = useState(false);
    
    // auth
    const { login } = useAuth();
    
    //Navegador de paginas
    const navigate = useNavigate();
 
    // Estado de la alerta del inicio de sesion
    const [toast, setToast] = useState({
        isVisible: false,
        message: "",
        type: "success",
    });

    const showToast = (message, type = "success") => {
        setToast({
            isVisible: true,
            message,
            type,
        });
    };

    const hideToast = () => {
        setToast((prev) => ({
            ...prev,
            isVisible: false,
        }));
    };

    // Loading para regresar (Pagina Principal)
    const handelRegresar = async () => {
        setCargaRegresar(true);

        setTimeout(() =>{
            navigate("/");
        }, 1500);
    };
    // Loading para el registro
    const handelFormulario = async () => {
        setCargaFormulario(true);

        setTimeout(() =>{
            navigate("/register");
        }, 1500);
    };
    // Loading parara el formulario de recuperar contraseña
    const FormularioRecuperar = async () => {
        setFormularioRecuperar(true);

        setTimeout(() =>{
            navigate("/Solicitud-de-codigo");
        }, 1500);
    };

    // Conexion a la los controladores y apis
    const handelSubmit = async (e) => {
        e.preventDefault();
        setLoanding(true);

        try {
            const res = await axios.post("http://127.0.0.1:8000/api/login", {
                correo_Empresarial: email,
                contrasena: password,
            });

            const { token, usuario } = res.data;

            login(usuario);
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(usuario));
            localStorage.setItem("usuario_id", usuario.id);

            showToast("Inicio de sesión exitoso", "success");

            const userRole = usuario.rol?.toLowerCase().trim();

            setTimeout(() => {
                if(userRole === "admin"){
                    navigate("/admin");
                } else if (userRole === "cliente"){
                    navigate("/cliente");
                } else {
                    showToast(`Rol de usuario no válido: "${userRole}"`, "error");
                }
            }, 1000);
        } catch (err){
            console.error(err);
            showToast(err.response?.data?.mensaje || "Error en el servidor", "error");
        } finally {
            setLoanding(false);
        }
    };


    return (
        <>
            <LoadingOverlay visible={cargaFomulario} text="Cargando..."/>
            <LoadingOverlay visible={cargaRegresar} text="Cargando..."/>
            <LoadingOverlay visible={cargaRecuperar} text="Cargando..."/>
            <div className="login-page">
                <div className="bg-shapes">
                    <div className="shape"></div>
                    <div className="shape"></div>
                    <div className="shape"></div>
                    <div className="shape"></div>
                </div>

                {/* Notificacion */}
                <ToastNotification 
                    message={toast.message}
                    type={toast.type}
                    isVisible={toast.isVisible}
                    onClose={hideToast}
                />

                <div className="container-fluid">
                        <h1 className="title text-center mb-3">Inicio de sesión</h1>
                    <div className="form-container">
                        
                        <p className="text-muted text-center mb-4">Bienvenido a BKS</p>

                        <form onSubmit={handelSubmit}>
                            {/* Correo electronico */}
                            <div className="input-group-custom">
                                
                                <input type="email"
                                    className="form-control-custom"
                                    placeholder="Correo electrónico"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required />
                            </div>
                            {/* Contraseña */}
                            <div className="Campo-password">
                                <input type={showPass ? "text" : "password"}
                                    className="form-control-custom"
                                    placeholder="Contraseña"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required />
                                <span className="toggle" onClick={() => setShowPass(!showPass)}>
                                    <i className={showPass ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                                </span>
                            </div>

                            <div className="Ayuda">
                                <button type="button" className="Pregunta" onClick={handelFormulario} disabled={cargaFomulario}>¿No tienes cueta? <span className="Crear">Crea una</span></button>
                                <button type="button" className="Pregunta" onClick={FormularioRecuperar} disabled={loading}>Se me olvido la contraseña</button>
                            </div>
                            {/* Boton */}
                            <div className="Botones">
                                <button type="submit" className="btn-custom " disabled={loading}>{loading ? "Validando..." : "Iniciar Sesión"}</button>
                                <button className="btn-custom " onClick={handelRegresar} disabled={cargaRegresar}>{cargaRegresar ? "Regresando..." : "Regresar"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}