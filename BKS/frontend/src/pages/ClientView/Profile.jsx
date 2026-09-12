// Importaciones necesarias
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { useLoading } from "../../context/useLoading";

// APIS
import { getCountries, getCountryCallingCode } from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import "react-phone-number-input/style.css";

// Axios
import axios from 'axios';

// Import components
import NavBar from '../../components/NavBar'
import { profileFields } from '../../components/FormFields';

// Css
import styles from "../../css/clientCss/profile.module.css";
// imgs
import userIcon from "../../assets/userProfileIcon.png"

// Alertas
import Swal from "sweetalert2";
// import LoadingOverlay from "../../components/LoandingOverlay";


export default function Profile() {

    const {setLoading, setLoadingText } = useLoading();

    // Traemos el id del usuario con el token
    const { user } = useAuth();
    // Trae y actualiza la informacion
    const [profile, setProfile] = useState({});
    const [editing, setEditing] = useState(false);
    // Actualizacion de contraseña (Actual, Nueva, Confirmacion)
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    // Vista del modal
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    // Visibilidad de las contraseña
    const [showPass, setShowPass] = useState(false);
    const modalRef = useRef(null)
    // peticion de documentos
    const [documents, setDocument] = useState([]);
    // Cambio de imagen de perfil
    const [selectedImage, setSelectedImage] = useState(null);
    // prefijo
    const [country, setCountry] = useState("CO");
    const [showCountries, setShowCountries] = useState(false);
    const prefixRef = useRef(null)
    // Departamentos, Ciudades, Barrios
    const [departament, setDepartamet] = useState([]);
    const [cities, setCities] = useState([]);
    // Loadings
    const navigate = useNavigate();

    // Obtenemos la informacion de los documentos exitentes
    useEffect(() => {
        const obtainDocuments = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/documents");

                setDocument(response.data)
            } catch (error) {
                console.error("Error al obtener los documentos", error);
            }
        };

        obtainDocuments();
    }, []);

    // Obtenemos la informacion del usuario
    useEffect(() => {
        const obtainUser = async () => {
            try {
                setLoading(true);
                setLoadingText("Cargando tu perfil, un momento...")

                const token =
                    localStorage.getItem("token") ||
                    sessionStorage.getItem("token");

                const response = await axios.get("http://127.0.0.1:8000/api/usuarios",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                // console.log("RESPUESTA PERFIL:", response.data);

                setProfile(response.data);

            } catch (error) {
                console.error("Error al obtener el perfil", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            obtainUser();
        }
    }, [user]);

    // Actualizacion de datos del usuario
    const editProfile = async () => {
        try {
            const token =
                localStorage.getItem("token") ||
                sessionStorage.getItem("token");

            // Guardamos la imagen del usuario
            const formData = new FormData();

            Object.keys(profile).forEach((key) => {
                if (
                    key !== "id" && key !== "rol" && key !== "membresia" && key !== "imagen_Usuario"
                ) {
                    formData.append(key, profile[key] ?? "");
                }
            });

            // Podemos enviar la imagen al back
            if (selectedImage) {
                formData.append("imagen_Usuario", selectedImage);
            }

            formData.append("_method", "PUT");

            const response = await axios.post(`http://127.0.0.1:8000/api/usuarios/${profile.id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setProfile(response.data.data);
            setSelectedImage(null);
            setEditing(false);

            Swal.fire('Perfil actualizado', 'el perfil ha sido actualizado correctamete', 'success');

        } catch (error) {
            console.error("Error al actualizar el perfil", error);
            Swal.fire('Error', 'No se pudo actualizar el perfil', 'error');
        }
    };

    // Cambio de contraseña
    const editPassword = async () => {
        try {

            const token =
                localStorage.getItem("token") ||
                sessionStorage.getItem("token");

            if (!newPassword || !confirmPassword) {
                Swal.fire("Advertencia", "Todos los campos son obligatorios", "warning");
                return;
            }
            // Peticion de los digitos
            if (newPassword.length < 8) {
                Swal.fire("Advertencia", "La nueva contraseña debe tener por lo menos 8 caracteres", "warning")
                return;
            }
            // Peticion de igualdad
            if (newPassword !== confirmPassword) {
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
            if (!confirm.isConfirmed) return;

            setLoadingText("Guardando la contraseña nueva...")
            setLoading(true);

            await axios.put("http://127.0.0.1:8000/api/passwordChange",
                {
                    usuario_id: profile.id,
                    currentPassword,
                    newPassword,
                    confirmPassword
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            Swal.fire('Contraseña cambiada', 'La contraseña se ha cambiado correctamente,  te enviamos un correo de confirmación para que estés tranquilo."', 'success');

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setShowPasswordModal(false);

        } catch (error) {
            console.error("Error:", error.response?.data);
            Swal.fire('Contraseña incorrecta', error.response?.data?.mensaje || 'Verifica las contraseñas ingresadas', 'warning');
        } finally {
            setLoading(false);
        }
    }

    // Funcionalidad para el boton editar y lo inputs
    const handelChange = (e) => {
        const { name, value } = e.target;

        setProfile(prev => ({
            ...prev,
            [name]: value,

            ...(name === "departamento" && {
                ciudad: "",
                barrio: "",
            }),

            ...(name === "ciudad" && {
                barrio: ""
            })
        }));
    };

    // Funcionalidad para hacer click por fuera y se cierre
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (prefixRef.current && !prefixRef.current.contains(e.target)) {
                setShowCountries(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    })
    // Funcionalidad para dar click por fuera del modal
    useEffect(() => {
        const handleClicklOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                setShowPasswordModal(false);
            }
        };
        document.addEventListener("mousedown", handleClicklOutside);

        return () => {
            document.removeEventListener("mousedown", handleClicklOutside);
        }
    })
    // Funcionalidad para evitar el scroll por debajo del modal
    useEffect(() => {
        document.body.style.overflow = showPasswordModal ? "hidden" : "auto";

        return () => {
            document.body.style.overflow = "auto";
        }
    }, [showPasswordModal])

    // Funcionalidad para traer los departamentos
    useEffect(() => {
        const obtainDepartment = async () => {
            try {
                const response = await axios.get("https://api-colombia.com/api/v1/Department");


                setDepartamet(response.data);

            } catch (error) {
                console.error("Erro al obtener los departamentos", error);
            }
        };

        obtainDepartment();
    }, []);
    // Funcionalidad para traer las ciudades dependiendo del departamento
    useEffect(() => {
        const obtainCities = async () => {
            if (!profile.departamento) {
                setCities([]);
                return;
            }

            try {
                const response = await axios.get(`https://api-colombia.com/api/v1/Department/${profile.departamento}/cities`);

                setCities(response.data);
            } catch (error) {
                console.error("Error al obtener las ciudades:", error);
            }
        };
        obtainCities();
    }, [profile.departamento]);


    // Carga 
    const subscriptions = async () => {
        setLoadingText("Horneando tu membresía ideal...")
        setLoading(true);

        setTimeout(() => {
            setLoading(false);
            navigate("/cliente/panelSubscriptions");
        }, 2000);
    };
    return (
        <>
            {/* <LoadingOverlay className={styles.loading} visible={loading} text="Guardando la contraseña nueva..." />
            <LoadingOverlay visible={loading2} text="Horneando tu membresía ideal..." /> */}
            <NavBar></NavBar>

            {showPasswordModal && (
                <div className={styles.modalOverlay} onClick={() => setShowPasswordModal(false)}>
                    <div ref={modalRef} className={styles.passwordModal} onClick={(e) => e.stopPropagation()}>
                        <h2>Cambio de contraseña</h2>

                        <aside className={styles.leyend}>
                            Tu cuenta es como nuestra receta: <strong>única y privada.</strong>  Cambia tu contraseña para que solo tú tengas la llave de tus pedidos.
                        </aside>

                        {/* Contraseña actual */}
                        <div className={styles.inputsGroup}>
                            <input
                                type={showPass ? "text" : "password"}
                                placeholder='Contraseña actual'
                                value={currentPassword}
                                minLength={8}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                            />
                            <label htmlFor="">Contraseña actual <span className={styles.required}>*</span></label>
                            <span className={styles.toggle} onClick={() => setShowPass(!showPass)}>
                                <i className={showPass ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                            </span>
                        </div>
                        <div className={styles.inputsGroup}>
                            {/* Contraseña nueva */}
                            <input
                                type={showPass ? "text" : "password"}
                                placeholder='Nueva contraseña'
                                value={newPassword}
                                minLength={8}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <label htmlFor="">Contraseña Nueva <span className={styles.required}>*</span></label>
                            <span className={styles.toggle} onClick={() => setShowPass(!showPass)}>
                                <i className={showPass ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                            </span>
                        </div>
                        <div className={styles.inputsGroup}>
                            {/* Confirmacion contraseña */}
                            <input
                                type={showPass ? "text" : "password"}
                                placeholder='Confirmar tu contraseña'
                                value={confirmPassword}
                                minLength={8}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <label htmlFor="">Confirmar contraseña <span className={styles.required}>*</span></label>
                            <span className={styles.toggle} onClick={() => setShowPass(!showPass)}>
                                <i className={showPass ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                            </span>
                        </div>


                        <div className={styles.modalButtons}>
                            <button onClick={editPassword}>Cambiar contraseña</button>
                            <button onClick={() => setShowPasswordModal(false)}>
                                cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className={styles.container}>
                <h1>Mi perfil</h1>
                <div className={styles.buttonsEdits}>
                    {/* Boton de edicion del perfil */}
                    <button
                        className={styles.editProfile}
                        onClick={editing ? editProfile : () => setEditing(true)}
                    >
                        <i className={`bx ${editing ? "bx-save" : "bx-pencil"}`}></i>
                        {editing ? "Guardar" : "Editar"}
                    </button>

                    {editing && (
                        <button
                            className={styles.cancelEdit}
                            onClick={() => setEditing(false)}
                        >Cancelar</button>
                    )}
                </div>


                {/* Primera seccion de informacion del usuario */}
                <header className={styles.oneInfo}>
                    {/* Imagen */}
                    <div className={styles.containerImage}>
                        <img src={profile.imagen_Usuario?.startsWith("blob:")
                            ? profile.imagen_Usuario
                            : profile.imagen_Usuario
                                ? `http://127.0.0.1:8000/storage/${profile.imagen_Usuario}`
                                : userIcon
                        } alt="Imagen-usuario" />
                    </div>
                    {/* Rol y nombres */}
                    <div className={styles.containerName}>
                        <p className={styles.names}>{profile.nombres} {profile.apellidos}</p>
                        <p className={styles.role}>{profile.rol?.nombre || "Cliente"}</p>
                    </div>
                    {/* Plan */}
                    <div className={styles.containerPlan}>
                        <label className={styles.editImage} style={{ pointerEvents: editing ? "auto" : "none" }}>
                            Cambiar foto
                            <input
                                type='file'
                                accept="image/*"
                                hidden
                                onChange={(e) => {
                                    const file = e.target.files[0];

                                    if (file) {
                                        setSelectedImage(file);

                                        setProfile(prev => ({
                                            ...prev,
                                            imagen_Usuario: URL.createObjectURL(file)
                                        }));
                                    }
                                }}
                            />
                        </label>
                        {/* Hacer que funcione correctamente este boton para que pueda cambiar la imagen el usuario */}
                        <p onClick={subscriptions}>{profile.membresia?.nombre || "Sin plan"}</p>

                    </div>
                </header>

                {/* Segunda seccion de los datos del usuario */}
                <section className={styles.sectionOne}>
                    <div className={styles.containerInformation}>
                        <h4>Información personal</h4>
                        <button
                            onClick={() => setShowPasswordModal(true)}
                            disabled={!editing}
                        >Cambiar contraseña</button>
                    </div>

                    <div className={styles.dottedDivider}></div>

                    <div className={styles.containerData}>
                        {/* Hacer que le prefijo se visualice de la misma manera que se visualiza en el register */}
                        {profileFields
                            .filter(field => {
                                if (field.section !== "initial") return false;

                                if (field.name === "correo_Personal") {
                                    return profile.rol?.nombreRol === "cliente";
                                }

                                if (field.name === "correo_Empresarial") {
                                    return profile.rol?.nombreRol === "admin";
                                }

                                return true;
                            })
                            .map(field => (
                                <div key={field.name} className={`${styles.inputsGroup} ${field.name === "prefijo" ? styles.phoneField : field.name.includes("correo") ? styles.emailField : ""}`}>

                                    {field.name === "prefijo" ? (
                                        <div className={styles.phoneGroup}>
                                            <div className={styles.prefixContainer}>
                                                <div ref={prefixRef}>
                                                    <button
                                                        type="button"
                                                        className={styles.prefix}
                                                        disabled={!editing}
                                                        onClick={() => setShowCountries(!showCountries)}
                                                    >
                                                        {flags[country] && (() => {
                                                            const Flag = flags[country];

                                                            return (
                                                                <>
                                                                    <Flag className={styles.flags} />
                                                                    <span>+{getCountryCallingCode(country)}</span>
                                                                </>
                                                            );
                                                        })()}
                                                    </button>

                                                    {showCountries && (
                                                        <div className={styles.countriesList}>
                                                            {getCountries().map((c) => (
                                                                <button
                                                                    type="button"
                                                                    key={c}
                                                                    disabled={!editing}
                                                                    onClick={() => {
                                                                        setCountry(c);

                                                                        setProfile(prev => ({
                                                                            ...prev,
                                                                            prefijo: `+${getCountryCallingCode(c)}`
                                                                        }));
                                                                        setShowCountries(false);
                                                                    }}
                                                                >
                                                                    {flags[c] && (() => {
                                                                        const Flag = flags[c];

                                                                        return (
                                                                            <>
                                                                                <span>+{getCountryCallingCode(c)}</span>
                                                                            </>
                                                                        );
                                                                    })()}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <label>{field.label}</label>

                                            <div className={styles.phoneInput}>
                                                <label>Número celular</label>
                                                <input
                                                    type="text"
                                                    name="numero_Celular"
                                                    value={profile.numero_Celular || ""}
                                                    maxLength={10}
                                                    readOnly={!editing}
                                                    inputMode="numeric"
                                                    onChange={handelChange}
                                                />
                                            </div>
                                        </div>
                                    ) : field.name === "numero_Celular" ? null : (
                                        field.type === "select" ? (
                                            <>
                                                <select
                                                    name={field.name}
                                                    value={profile[field.name] || ""}
                                                    disabled={!editing}
                                                    onChange={handelChange}
                                                >
                                                    <option value="">Seleccionar documento</option>

                                                    {documents.map(document => (
                                                        <option key={document.id} value={document.id} >
                                                            {document.nombre}
                                                        </option>
                                                    ))}
                                                </select>

                                                <label>{field.label}</label>
                                            </>
                                        ) : (
                                            <>
                                                <input
                                                    type={field.type}
                                                    name={field.name}
                                                    value={profile[field.name] || ""}
                                                    readOnly={!editing}
                                                    maxLength={field.maxLength}
                                                    onChange={handelChange}
                                                />
                                                <label>{field.label}</label>
                                            </>
                                        ))}
                                </div>
                            ))}
                    </div>
                </section>

                {/* Tercera seccion sobre los datos adicionales del usuario */}
                <section className={styles.sectionTwo}>
                    <div className={styles.containerInformation}>
                        <h4>Dirección</h4>
                    </div>

                    <div className={styles.dottedDivider}></div>

                    <div className={styles.containerData}>
                        {profileFields
                            .filter(field => field.section === "address")
                            .map(field => (
                                <div key={field.name} className={styles.inputsGroup}>
                                    <label>{field.label}</label>
                                    {/* Departamento */}
                                    {field.name === "departamento" ? (
                                        <select
                                            name={field.name}
                                            value={profile[field.name] || ""}
                                            disabled={!editing}
                                            onChange={handelChange}
                                        >
                                            <option value="">Seleccionar departamento</option>

                                            {departament.map(depart => (
                                                <option key={depart.id} value={depart.id}>{depart.name}</option>
                                            ))}
                                        </select>
                                        // Ciudad
                                    ) : field.name === "ciudad" ? (
                                        <select
                                            name={field.name}
                                            value={profile[field.name] || ""}
                                            disabled={!editing}
                                            onChange={handelChange}
                                        >
                                            <option value="">Seleccionar ciudad</option>

                                            {cities.map(city => (
                                                <option key={city.id} value={city.name}>{city.name}</option>
                                            ))}
                                        </select>
                                        // Barrio
                                    ) : field.type === "textarea" ? (
                                        <>
                                            <textarea
                                                name={field.name}
                                                value={profile[field.name] || ""}
                                                readOnly={!editing}
                                                maxLength={field.maxLength}
                                                onChange={handelChange}
                                            />

                                            <span className={styles.count}>{(profile[field.name] || "").length}/{field.maxLength}</span>
                                        </>
                                    ) : (
                                        <input
                                            type={field.type}
                                            name={field.name}
                                            value={profile[field.name] || ""}
                                            inputMode={field.type === "number" ? "numeric" : undefined}
                                            maxLength={field.maxLength}
                                            readOnly={!editing}
                                            onChange={handelChange}
                                        />
                                    )}
                                </div>
                            ))
                        }
                    </div>
                </section>
            </div>
        </>
    )
}        