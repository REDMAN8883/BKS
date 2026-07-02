// Importaciones necesarias
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

// Importaciones de imagenes
// import Logo from "../assets/LogoEjemplo.png"

// Pages o componentes necesarios
import LoadingOverlay from "../components/LoandingOverlay";

// css
import "../css/Registro.css";

// Alertas
import Swal from "sweetalert2";

export default function Registro(){

    // Crear cuenta
    const [isSubmitting, setIsSubmitting] = useState(false); 
    
    // Loadings
    const [cargaRegresar, setCargaRegresar] = useState(false);
    const [cargaLogin, setCargaLogin] = useState(false);

    // Navegacion
    const navigate = useNavigate();

    // Visibilidad de las contraseña
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    // Alfanumerico para contraseñas
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&#]).{8,}$/;
    
    // Peticiones del formulario
    const [formData, setFormData] = useState({
        nombres: '',
        apellidos: '',
        numero_Celular: '',
        contrasena: '',
        contrasenaConfirmacion: '',
        correo_Personal: '',
        correo_PersonalConfirmacion: ''
    });

    const handelChange = (e) =>{
        const {name, value} = e.target;
        setFormData(prev =>({ ...prev, [name]: value}));
    }

    // Validacion de los campos
    const handelSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const {
            nombres,
            apellidos,
            numero_Celular,
            contrasena,
            contrasenaConfirmacion,
            correo_Personal,
            correo_PersonalConfirmacion,
        } = formData;

        // Validamos si los campos estan vacios o no
        if (!nombres || !apellidos || !numero_Celular || !correo_Personal || !correo_PersonalConfirmacion || !contrasena || !contrasenaConfirmacion){
            Swal.fire('Campos requeridos', 'Completa todos los campos', 'warning');
            // setIsSubmitting(false);
            return;
        }
        // Confirmacion de correo
        if (correo_Personal !== correo_PersonalConfirmacion) {
            Swal.fire('Error', 'Los correos no coinciden', 'error');
            // setIsSubmitting(false);
            return;
        }
        // Regex contraseña alfanumerica 
        if (!regex.test(contrasena)) {
            Swal.fire (
                'Contraseña insegura',
                'La contraseña debe contener numeros y por lo menos un simbolo',
                'warning'
            );
            setIsSubmitting(false);
            return;
        }
        // Confirmacion de contraseñas 
        if (contrasena !== contrasenaConfirmacion) {
            Swal.fire('Error', 'Las contraseñas no coinciden', 'warning');
            return;
        }

        // Creacion del usuario
        try {
            const res = await axios.post("http://127.0.0.1:8000/api/usuarios", formData);

                // console.log(res.data);

                if(res?.data?.data?.id){
                    localStorage.setItem("usuario_id", res.data.data.id);
                }

                Swal.fire('Registro exitoso', 'Cuenta creada con exito, inicia sesión ahora', 'success');
                navigate('/login')

            } catch (error) {
                console.error('Error:', error);
                Swal.fire('Error', error.response?.data?.error || 'Error al crear la cuenta', 'error');
            } finally {
                setIsSubmitting(false);
            }
    }

    // SIN REQUERIR AUN
//     const handleCancelar = () => {
//     Swal.fire({
//       title: 'Cancelado',
//       text: 'Registro cancelado.',
//       icon: 'info',
//       timer: 1200,
//       showConfirmButton: false
//     });
//     setTimeout(() => navigate('/admin/usuarios'), 1200);
//   };

    // Loading por si se tiene cuenta
    const handelLogin = async () => {
        setCargaLogin(true);

        setTimeout(() =>{
            navigate("/login");
        }, 1500);
    }

    // Loading para regresar
    const handelRegresar = async () => {
        setCargaRegresar(true);

        setTimeout(() =>{
            navigate("/");
        }, 1500);
    };
    return(
        <>
            <LoadingOverlay visible={cargaRegresar} text="Cargando..."/>
            <LoadingOverlay visible={cargaLogin} text="Cargando..."/>
            <div className="Pagina-Principal">
                <aside className="SubPagina">
                    {/* <div className="Bloque_uno">
                        <h1>Crear cuenta nueva</h1>
                        <img src={Logo} alt="logo" />
                    </div> */}

                    <div className="Bloque_dos">
                        <form onSubmit={handelSubmit} className="FormularioRegistro">
                            <h4 className="TituloFormulario">Llena los datos para continuar con tu cuenta</h4>
                            <label htmlFor="">Nombres: </label>
                            <input type="text" name="nombres" placeholder="Julian Daniel" className="Campo" onChange={handelChange} required/>

                            <label htmlFor="">Apellidos: </label>
                            <input type="text" name="apellidos" placeholder="Beltran Bustos"  className="Campo" onChange={handelChange} required/>

                            <label htmlFor="">Correo Electronico: </label>
                            <input type="email" name="correo_Personal" placeholder="ejemplo@dominio.com"  className="Campo" onChange={handelChange} required/>

                            <label htmlFor="">Confirmar Correo Electronico: </label>
                            <input type="email" name="correo_PersonalConfirmacion" placeholder="ejemplo@dominio.com"  className="Campo" onChange={handelChange} required/>

                            <label htmlFor="">Numero celular: </label>
                            <input type="number" name="numero_Celular" placeholder="312 4567891"  className="Campo" onChange={handelChange} required/>

                            <label htmlFor="">Contraseña: </label>
                            <div className="campo-password">
                                <input
                                    type={showPass ? "text" : "password"}
                                    name="contrasena"
                                    placeholder="1234567"
                                    className="Campo"
                                    minLength={8}
                                    onChange={handelChange}
                                    required
                                />
                                <span className="toggle" onClick={() => setShowPass(!showPass)}>
                                    <i className={showPass ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                                </span>
                            </div>

                            <label htmlFor="">Confirmar Contraseña: </label>
                            <div className="campo-password">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="contrasenaConfirmacion"
                                    placeholder="1234567"
                                    className="Campo"
                                    minLength={8}
                                    onChange={handelChange}
                                    required
                                />
                                <span className="toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                    <i className={showConfirmPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                                </span>
                            </div>

                            <div className="ayuda">
                                <button type="button" className="pregunta" onClick={handelLogin} disabled={cargaLogin}>¿Ya tienes cuenta? <span className="Crear">Inicia Sesión</span></button>
                            </div>

                            <div className="Botones">
                                <button type="submit" className="BTN" disabled={isSubmitting}>{isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}</button>
                                <button type="button" className="BTN" onClick={handelRegresar} disabled={cargaRegresar}>{cargaRegresar ? "Regresando..." : "Regresar"}</button>
                            </div>
                        </form>
                    </div>
                </aside>
            </div>
        </>
    )
}