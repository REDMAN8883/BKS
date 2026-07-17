import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEffect } from "react";

// Css
import styles from '../css/Login.module.css';

// Pages o components necesarios
import { useAuth } from "../context/useAuth";
import ToastNotification from "../components/ToastNotification";
import LoadingOverlay from "../components/LoandingOverlay";

// Images
import BusinessLogo from "../assets/BussinesLogo.png"

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
    const [loadLoginUser, setLoadLoginUser] = useState(false);
    
    const { login } = useAuth();
    const navigate = useNavigate();

    // Alerts Login
    const [toast, setToast] = useState({
        isVisible: false,
        message: "",
        type: "success",
    });
    // ShowPassword
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
    const goBackHome = async () => {
        setLoanding(true);
        navigate("/");
    };

    // // Load Form Register
    // const createAccount = async () => {
    //     setLoanding(true);
    //     navigate("/register");
    // };

    // // Load Form Recovery Password
    // const recoveryFormStepOne = async () => {
    //     setLoanding(true);
    //     navigate("/recuperar-contrasena");
    // };

    // Conexion a la los controladores y apis
    const loginUser = async (e) => {
        e.preventDefault();
        setLoanding(true);
        setLoadLoginUser(true);

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

    // Background
    useEffect(() => {
        document.body.style.background ="linear-gradient( 135deg, #BA8C66 5%, #71380D 39%, #805332 100%, #66340F 94%)";

        return () => {
            document.body.style.background= "var(--color-background)"
        };
    }, []);

    return (
        <>
            <LoadingOverlay visible={loadLoginUser} text="Preparando tu mesa..."/>

            <div className={styles.backgroundLogin} id="page-fade">
                {/* Notificacion */}
                <ToastNotification 
                    message={toast.message}
                    type={toast.type}
                    isVisible={toast.isVisible}
                    onClose={hideToast}
                />

                <div className={styles.container}>
                    <div className={styles.logoContainer}>
                        <img className={styles.imageLogin} src={BusinessLogo} alt="" />
                    </div>
                    

                    <div className={styles.form}>
                        <h1>Inicio de sesión</h1>
                        <form className={styles.formContainer} onSubmit={loginUser}>
                            <div className={styles.rowInputs}>
                                <div className={styles.inputsGroup}>
                                    {/* Input Email */}
                                    <input type="email"
                                        className={styles.form_control_custom}
                                        placeholder="Introduce tu correo electrónico"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                    <label htmlFor="">Correo <span className={styles.required}>*</span></label>
                                </div>

                                <div className={styles.inputsGroup}>
                                    {/* Input Password */}
                                    <input type={showPass ? "text" : "password"}
                                        className={styles.form_control_custom}
                                        placeholder="Introduce tu contraseña"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <label htmlFor="">Contraseña <span className={styles.required}>*</span></label>
                                    <span className={styles.toggle} onClick={() => setShowPass(!showPass)}>
                                        <i className={showPass ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                                    </span>
                                </div>
                            </div>
                            

                            <div className={styles.helps}>
                                {/* checkbox */}
                                <div className={styles.checkbox}>
                                    <input type="checkbox" />
                                    <label>Recordarme</label>
                                </div>

                                {/* Recovery Password */}
                                <Link to="/recuperar-contrasena" className={styles.StepOne}>
                                    Se me olvido la contraseña
                                </Link>
                            </div>
                            
                            <div className={styles.buttonsLogin}>
                                {/* Button LogIn */}
                                <button type="submit" className="btn-custom" disabled={loading}>
                                    {loading ? "Validando" : "Iniciar sesión"}
                                </button>
                                {/* Button GoBack */}
                                <button onClick={goBackHome}  className="btn-custom" disabled={loading}>
                                    {loading ? "Regresando" : "Regresar"}
                                </button>
                            </div>

                            <Link to="/register" className={styles.accountNew}>
                                ¿No tienes cuenta? <span className={styles.underlined}>Crea cuenta</span>
                            </Link>

                            {/* Line */}
                            <div className={styles.dividerContainer}>
                                <span className={styles.dividerText}>O continua con</span>
                            </div>

                            {/* Buttons Social Medias */}
                            <div className={styles.socialMedialContainer}>
                                {/* Google */}
                                <button type="button" className={styles.socialButton}>
                                    <i className="bi bi-google"></i> Google
                                </button>

                                {/* Facebook */}
                                <button type="button" className={styles.socialButton}>
                                    <i className="bi bi-facebook"></i> Facebook
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}