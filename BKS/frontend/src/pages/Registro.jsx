// Importaciones necesarias
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from 'axios';
import { getCountries, getCountryCallingCode } from "react-phone-number-input";
import "react-phone-number-input/style.css";
// import "react-phone-number-input/style.css";

// Pages o componentes necesarios
// import LoadingOverlay from "../components/LoandingOverlay";

// Images
import BusinessLogo from "../assets/BussinesLogo.png"

// css
import styles from '../css/Registro.module.css';

// Alertas
import Swal from "sweetalert2";

export default function Registro(){

    // Crear cuenta
    // const [isSubmitting, setIsSubmitting] = useState(false); 
    const [loading, setLoanding] = useState(false);
    const [country, setCountry] = useState("CO");

    const [documents, setDocuments] = useState([]);
    // const _prefix = `+${getCountryCallingCode(country)}`;
    
    // Loadings
    // const [cargaRegresar, setCargaRegresar] = useState(false);
    // const [cargaLogin, setCargaLogin] = useState(false);

    // Navegacion
    const navigate = useNavigate();

    // // Visibilidad de las contraseña
    const [showPass, setShowPass] = useState(false);
    // const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    // // Alfanumerico para contraseñas
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&#]).{8,}$/;
    
    // // Peticiones del formulario
    const [formData, setFormData] = useState({
        nombres: '',
        apellidos: '',
        numero_Celular: '',
        contrasena: '',
        contrasenaConfirmacion: '',
        correo_Personal: '',
        correo_PersonalConfirmacion: ''
    });

    const formRegister = (e) =>{
        const {name, value} = e.target;
        setFormData(prev =>({ ...prev, [name]: value}));
    }

    // Validacion de los campos
    const registerUser = async (e) => {
        e.preventDefault();
        setLoanding(true);

        const {
            nombres,
            apellidos,
            numero_Celular,
            contrasena,
            contrasenaConfirmacion,
            correo_Personal,
            correo_PersonalConfirmacion,
            // id_Document
        } = formData;

        // Validamos si los campos estan vacios o no
        if (!nombres || !apellidos || !numero_Celular || !correo_Personal || !correo_PersonalConfirmacion || !contrasena || !contrasenaConfirmacion){
            Swal.fire('Campos requeridos', 'Completa todos los campos', 'warning');
            setLoanding(true)
            return;
        }
        // Confirmacion de correo
        if (correo_Personal !== correo_PersonalConfirmacion) {
            Swal.fire('Error', 'Los correos no coinciden', 'error');
            setLoanding(true)
            return;
        }
        // Regex contraseña alfanumerica 
        if (!regex.test(contrasena)) {
            Swal.fire (
                'Contraseña insegura',
                'La contraseña debe contener numeros y por lo menos un simbolo',
                'warning'
            );
            setLoanding(true)
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
                setLoanding(false)
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
    // const handelLogin = async () => {
    //     setCargaLogin(true);

    //     setTimeout(() =>{
    //         navigate("/login");
    //     }, 1500);
    // }

    // Loading para regresar
    // const handelRegresar = async () => {
    //     setCargaRegresar(true);

    //     setTimeout(() =>{
    //         navigate("/");
    //     }, 1500);
    // };

    // Background
        useEffect(() => {
            document.body.style.background ="linear-gradient( 135deg, #BA8C66 5%, #71380D 39%, #805332 100%, #66340F 94%)";
    
            return () => {
                document.body.style.background= "var(--color-background)"
            };
        }, []);

        useEffect(() => {
            axios.get("http://127.0.0.1:8000/api/documents")
                .then((res) => {
                    setDocuments(res.data);
                })
                .catch((err) => console.error(err));
        }, []);

    return(
        <>
            {/* <LoadingOverlay visible={cargaRegresar} text="Cargando..."/>
            <LoadingOverlay visible={cargaLogin} text="Cargando..."/> */}
            <div className={styles.backgroundRegister} id="page-fade">

                <div className={styles.container}>
                    <div className={styles.logoContainer}>
                        <img src={BusinessLogo} alt="" className={styles.imageRegister} />
                    </div>

                    <div className={styles.form}>
                        <h1>Comienza ahora</h1>
                        <aside className={styles.leyend}>
                            <strong>"Danos los ingredientes que faltan."</strong><br /><br />
                            Así como un buen pan lleva su tiempo, tu registro casi está en su punto. Completa tus datos y ¡listo!
                        </aside>

                        <form action="" onSubmit={registerUser}>
                            <div className={styles.rowInputs}>

                                <div className={styles.inputsGroup}>
                                    {/* Name */}
                                    <input type="text" 
                                        className={styles.form_control_custom}
                                        onChange={formRegister}
                                        placeholder="Ej. Juan"
                                        required 
                                    />
                                    <label htmlFor="">Nombres <span className={styles.required}>*</span></label>
                                </div>

                                <div className={styles.inputsGroup}>
                                    {/* LastName */}
                                    <input type="text" 
                                        className={styles.form_control_custom}
                                        onChange={formRegister}
                                        placeholder="Ej. Perez Gomez"
                                        required
                                    />
                                    <label htmlFor="">Apellidos <span className={styles.required}>*</span></label>
                                </div>
                                
                                <div className={styles.rowsPrefix}>
                                    <div className={styles.inputsGroup}>
                                        {/* Prefix */}
                                        <select 
                                            value={country}
                                            onChange={(e) => setCountry(e.target.value)}
                                            className={styles.prefix}
                                            >
                                            {getCountries().map((c) => (
                                                <option key={c} value={c}>
                                                    +{getCountryCallingCode(c)}
                                                </option>
                                            ))}
                                        </select>
                                        <label htmlFor="">Prefijo <span className={styles.required}>*</span></label>
                                    </div>

                                    <div className={styles.inputsGroup}>

                                        {/* Phone Number */}
                                        <input 
                                            type="number"
                                            onWheel={(e) => e.currentTarget.blur()}
                                            className={styles.form_control_custom}
                                            onChange={formRegister}
                                            placeholder="Ej. 300 123 4567"
                                            required
                                        />
                                        <label htmlFor="" >Numero celular <span className={styles.required}>*</span></label>
                                    </div>
                                </div>

                                <div className={styles.inputsGroup}>
                                    {/* Type Document */}
                                    <select 
                                        value={documents}
                                        onChange={(e) => setFormData({ 
                                            ...formData,
                                            id_Document: e.target.value
                                        })
                                    }
                                        className={styles.document}
                                        required
                                    >
                                        <option value="">Selecciones un documento</option>

                                        {documents.map((type) =>(
                                            <option key={type.id} value={type.id}>
                                                {type.abreviatura} - {type.nombre}
                                            </option>
                                        ))}
                                    </select>
                                    <label htmlFor="">Tipo de documento <span className={styles.required}>*</span></label>
                                </div>

                                <div className={styles.inputsGroup}>
                                    {/* Number document */}
                                    <input 
                                        type="number"
                                        onWheel={(e) => e.currentTarget.blur()}
                                        pattern="[0-9]*"
                                        onChange={formRegister}
                                        placeholder="Ej. 123456789"
                                        required
                                    />
                                    <label htmlFor="">Numero de documento <span className={styles.required}>*</span></label>
                                </div>

                                <div className={styles.inputsGroup}>
                                    {/* Input Email */}
                                    <input type="email"
                                        className={styles.form_control_custom}
                                        placeholder="Introduce tu correo electrónico"
                                        // value={email}
                                        onChange={formRegister}
                                        required
                                    />
                                    <label htmlFor="">Correo <span className={styles.required}>*</span></label>
                                </div>

                                <div className={styles.inputsGroup}>
                                    {/* Input Password */}
                                    <input type={showPass ? "text" : "password"}
                                        className={styles.form_control_custom}
                                        placeholder="Introduce tu contraseña"
                                        // value={password}
                                        // onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <label htmlFor="">Contraseña <span className={styles.required}>*</span></label>
                                    <span className={styles.toggle} onClick={() => setShowPass(!showPass)}>
                                        <i className={showPass ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                                    </span>
                                </div>

                                <div className={styles.inputsGroup}>
                                    {/* Confirmation Password */}
                                    <input 
                                        type={setShowPass ? "text" : "password"}
                                        className={styles.form_control_custom}
                                        placeholder="Repite tu contraseña"
                                        required
                                    />
                                    <label htmlFor="">Confirmacion de contraseña <span className={styles.required}>*</span></label>
                                    <span className={styles.toggle} onClick={() => setShowPass(!showPass)}>
                                        <i className={showPass ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                                    </span>
                                </div>
                            </div>

                            <div className={styles.helps}>
                                {/* checkbox */}
                                <div className={styles.checkbox}>
                                    <input type="checkbox" />
                                    <label>He leído y acepto los <strong><a className={styles.conditions}>Términos y Condiciones</a></strong>, así como la Política de Privacidad y el tratamiento de mis datos personales</label>
                                </div>

                                {/* checkbox */}
                                <div className={styles.checkbox}>
                                    <input type="checkbox" />
                                    <label>Al registrarte, confirmas que tienes al menos 18 años o que cuentas con la autorización de tus padres o tutores para realizar compras en este sitio</label>
                                </div>
                            </div>

                            <div className={styles.buttonsRegister}>
                                {/* Button LogIn */}
                                <button type="submit" className="btn-custom" disabled={loading}>
                                    {loading ? "Validando" : "Crear cuenta"}
                                </button>
                            </div>

                            {/* Buttons Social Medias */}
                            <div className={styles.socialMedialContainer}>
                                {/* Google */}
                                <button type="button" className={styles.socialButton}>
                                    <i className="bi bi-google"></i> 
                                </button>
                            
                                {/* Facebook */}
                                <button type="button" className={styles.socialButton}>
                                    <i className="bi bi-facebook"></i>
                                </button>
                            </div>

                            <Link to="/login" className={styles.accountNew}>
                                ¿Ya tienes una cuenta? <span className={styles.underlined}>Inicia sesión</span>
                            </Link>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}