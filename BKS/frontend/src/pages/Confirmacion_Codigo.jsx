// Importaciones necesarias
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

// Importaciones de imagenes
import Logo from "../assets/LogoEjemplo.png"

// Pages o componentes necesarios
import LoadingOverlay from "../components/LoandingOverlay";
import Swal from "sweetalert2";


export default function R_Contraseña1(){
    // Campo de validacion
    const [codigo, setCodigo] = useState("");
     // ID del usuario
    const usuario_id = localStorage.getItem("usuario_id");
    // Loadings
    const [cargaRegresar, setCargaRegresar] = useState(false);
    // Confirmar codigo
    const [isSubmitting, setIsSubmitting] = useState(false);
    // Navegar
    const navigate = useNavigate();

    // Loading - Regreso (Inicio de sesion)
    const handelRegresar = async () => {
        setCargaRegresar(true);

        setTimeout(() =>{
            navigate("/login");
        }, 1500);
    }


    const verificarCodigo = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            console.log({
                codigo,
                usuario_id
            });
            // Llamado al API
            const res = await axios.post("http://127.0.0.1:8000/api/verificar-correo",{
                // Validacion de usuario / campos
                usuario_id: Number(usuario_id),
                codigo: codigo.trim()
            });

            // Verificacion del codigo vencido
            if(res.data.message === "Codigo invalido o vencido"){
                Swal.fire('Aviso', res.data.mensaje, 'warning');
            } else {
                // Codigo correcto
                Swal.fire('Codigo exitoso', 'Codgio verificado correctamente', 'success');
                navigate('/Recuperar3');
            }
        } catch (error){
            // Musetra el error
            console.error('Error', error)
            // console.log(error.response.data);
            Swal.fire('Error', error?.response?.data?.mensaje  || 'Error al verificar el codigo', 'error' ); 
        } finally{
            setIsSubmitting(false);
        }

        // setTimeout(() =>{
        //     navigate("/Recuperar3");
        // }, 1500);
    }


    return(
            <>  
                {/* Loadings */}
                <LoadingOverlay visible={cargaRegresar} text="Cargando..."/>
                <LoadingOverlay visible={isSubmitting} text="Verificando codigo"/>

                {/* Formulario */}
                <div className="Pagina-Principal">
                    <aside className="SubPagina">
                        <div className="Bloque_uno">
                            <h1>Recuperar Contraseña</h1>
                            <img src={Logo} alt="logo" />
                        </div>

                        <div className="Bloque_dos">
                            <form className="FormularioRegistro" onSubmit={verificarCodigo}>
                                <h4 className="TituloFormulario">Te hemos enviado un codigo de verficacion a correo registrado</h4>

                                <input type="text" className="form-control-custom" placeholder="Codigo de verificación" value={codigo} onChange={(e)=> setCodigo(e.target.value)} required/>

                                <div className="Botones">
                                    <button type="submit" className="btn-custom BTN " disabled={isSubmitting}>{isSubmitting ? "Verificando..." : "Verificar codigo"}</button>
                                    <button type="button" className="BTN" onClick={handelRegresar} disabled={cargaRegresar}>{cargaRegresar ? "Regresando..." : "Regresar"}</button>
                                </div>
                            </form>
                        </div>
                    </aside>
                </div>
            </>
        )
    
}