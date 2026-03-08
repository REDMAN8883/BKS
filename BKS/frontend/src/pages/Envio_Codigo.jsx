// Importaciones necesarias
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

// Importaciones de imagenes
import Logo from "../assets/LogoEjemplo.png"

// Pages o componentes necesarios
import LoadingOverlay from "../components/LoandingOverlay";

// CSS
import "../css/RecuperarContrasena.css";

// Alertas
import Swal from "sweetalert2";


export default function R_Contraseña1(){
    // Loadings
    const [cargaRegresar, setCargaRegresar] = useState(false);
    // Crear cuenta
    const [isSubmitting, setIsSubmitting] = useState(false); 
    // Navegar
    const navigate = useNavigate();

    const [correo, setCorreo] = useState("");


    // Conexion al controlador y al API
    const handelSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Llamado al API
            const res = await axios.post("http://127.0.0.1:8000/api/recuperar-password",{
                correo: correo
            });

            // Codigo existente
            if(res.data.message === "Ya tienes un codigo activo. Revisa tu correo"){
                Swal.fire('Aviso', res.data.message, "warning");
            } else {
                // Codigo enviado
                Swal.fire('Envio exitoso', 'El codigo se envio con exito', 'success');
                navigate('/Recuperar2') // --- CAMBIAR ESTE NOMBRE ---
            }
        } catch (error) {
            // Mustra de error
            console.error('Error:', error)
            Swal.fire('Error', error.response?.data?.error || 'Error al enviar el codigo', 'error');
        } finally {
            setIsSubmitting(false);
        }
    }
    

    // Loading (Inicio de sesion)
    const handelRegresar = async () => {
        setCargaRegresar(true);

        setTimeout(() =>{
            navigate("/login");
        }, 1500);
    }

    // const handleSimulacion = async () => {
    //     setLoanding(true);

    //     setTimeout(() =>{
    //         navigate("/Recuperar2");
    //     }, 1500);
    // }

    return(
            <>
                <LoadingOverlay visible={cargaRegresar} text="Cargando..."/>
                {/* <LoadingOverlay visible={loading} text="Enviando codigo..."/> */}
                <div className="Pagina-Principal">
                    <aside className="SubPagina">
                        <div className="Bloque_uno">
                            <h1>Recuperar Contraseña</h1>
                            <img src={Logo} alt="logo" />
                        </div>

                        <div className="Bloque_dos">
                            <form onSubmit={handelSubmit} className="FormularioRegistro1">
                                <h4 className="TituloFormulario1">Escribe el correo que registraste para enviarte un codigo de verficación.</h4>

                                <input type="email" className="form-control-custom" value={correo} onChange={(e) => setCorreo(e.target.value)} placeholder="Correo electronico" required/>

                                <div className="Botones">
                                    <button type="submit" className="btn-custom BTN " disabled={isSubmitting}>{isSubmitting ? "Enviando..." : "Enviar codigo"}</button>
                                    <button type="button" className="BTN" onClick={handelRegresar} disabled={cargaRegresar}>{cargaRegresar ? "Regresando..." : "Regresar"}</button>
                                </div>
                            </form>
                        </div>
                    </aside>
                </div>
            </>
        )
    
}