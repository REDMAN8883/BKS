// Importaciones necesarias
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

// Importaciones de imagenes
import Logo from "../assets/LogoEjemplo.png"

// Pages o componentes necesarios
import LoadingOverlay from "../components/LoandingOverlay";
import Swal from "sweetalert2";


export default function CambioContraseña(){
    // Loadings
    const [regresar, setRegresar] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    // Visibilidad de contraseñas
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    // Inputs de cambio de contraseña
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const usuario_id = localStorage.getItem("usuario_id");
    // Navegar
    const navigate = useNavigate();


    // Llamado al API
    const changePassword = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Peticion de cambios
        try{
            if(!newPassword || !confirmPassword){
                Swal.fire("Advertencia", "Todos los campos son obligatorios", "warning");
                return;
            }
            // Peticion de los digitos
            if(newPassword.length < 8){
                Swal.fire("Advertencia", "La nueva contraseña debe tener por lo menos 8 caracteres", "warning")
                return;
            }
            // Peticion de igualdad
            if(newPassword !== confirmPassword){
                Swal.fire("Advertencia", "Las contraseñas no coinciden", "warning")
                return; // Detiene el progreso por si no se cumple con lo requerido
            }
            // Alerta de contraseña nueva
            const confirm = await Swal.fire({
                title: "¿Cambiar contraseña?",
                text: "Tu contraseña sera cambiada",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Si, cambiar",
                cancelButtonText: "Cancelar",
                confirmButtonColor: "#2fa779",
                cancelButtonColor: "#2fa779"
            });
            // Guardar contraseña en BD
            if(!confirm.isConfirmed) return;

            await axios.put("http://127.0.0.1:8000/api/cambiar-contrasena", {
                usuario_id,
                newPassword,
                confirmPassword,
            });

            Swal.fire("Exito", "La contraseña se ha cambiado correctamente", "success");
            
            setNewPassword("");
            setConfirmPassword("");
            setTimeout(() => navigate('/login'));
        } catch (error){
            console.error(error);
            Swal.fire("Error", error.response?.data?.message || "No se pudo cambiar la contraseña", "Error");
        } finally{
            setIsSubmitting(false);
        }
        
    }

    // Loading (Inicio de sesion)
    const handelRegresar = async () => {
        setRegresar(true);

        setTimeout(() =>{
            navigate("/login");
        }, 1500);
    }

    // const handelLogin = async () => {
    //     setLoanding(true);

    //     setTimeout(() =>{
    //         navigate("/login");
    //     }, 1500)
    // }



    return(
            <>
                <LoadingOverlay visible={regresar} text="Cargando..."/>
                {/* <LoadingOverlay visible={isSubmitting} text="Cambiando contraseña..."/> */}
                <div className="Pagina-Principal">
                    <aside className="SubPagina">
                        <div className="Bloque_uno">
                            <h1>Recuperar Contraseña</h1>
                            <img src={Logo} alt="logo" />
                        </div>

                        <div className="Bloque_dos">
                            <form className="FormularioRegistro" onSubmit={changePassword}>
                                <h4 className="TituloFormulario">Cambia tu contraseña</h4>

                                <label htmlFor="">Contraseña nueva: </label>
                            <div className="campo-password">
                                <input
                                    type={showPass ? "text" : "password"}
                                    placeholder="1234567"
                                    minLength={8}
                                    className="Campo"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                                <span className="toggle"  onClick={() => setShowPass(!showPass)}>
                                    <i className={showPass ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                                </span>
                            </div>

                            <label htmlFor="">Confirmar Contraseña nueva: </label>
                            <div className="campo-password">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="1234567"
                                    className="Campo"
                                    minLength={8}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                                <span className="toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                    <i className={showConfirmPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                                </span>
                            </div>

                                <div className="Botones">
                                    <button type="submit" className="btn-custom BTN " disabled={isSubmitting}>{isSubmitting ? "Cambiando contraseña..." : "Cambiar contraseña"}</button>
                                    <button type="button" className="BTN" onClick={handelRegresar} disabled={regresar}>{regresar ? "Regresando..." : "Regresar"}</button>
                                </div>
                            </form>
                        </div>
                    </aside>
                </div>
            </>
        )
    
}