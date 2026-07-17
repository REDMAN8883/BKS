// Importaciones necesarias
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Importaciones de imagenes
import BusinessLogo from "../assets/BussinesLogo.png";
import chef from "../assets/chef.png";
import bread from "../assets/bread.png";
import shelf from "../assets/shelf.png";

// Css
import styles from "../css/LandingPage.module.css";
// Componenetes y paginas necesarias
import Footer from "../components/Footer";
import LoadingOverlay from "../components/LoandingOverlay";

export default function Principal()  {

    // Variables necesarias 
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Desactivación de botones despues de dar click
    const buttonLogin = async () => {
        setLoading(true);
        navigate("/login");
    };
    const buttonRegister = async () => {
        setLoading(true);
        navigate("/register");
    };

    return (
        <>
            <div className="page-fade">
                {/* NavBar para el usuario */}
                <nav className={styles.NavBar_invited}>
                    {/* Logo de BKS */}
                    <img className={styles.LogoNav} src={BusinessLogo} alt="Imagen_BKS" />

                    <div className={styles.links}>
                        <a href="#inicio" className={styles.a}>Inicio</a>
                        <a href="#nosotros" className={styles.a}>Nosotros</a>
                        <a href="#productos" className={`${styles.a} ${styles.link_us}`}>Productos destacado</a>
                        <a href="#contacto" className={styles.a}>Contactanos</a>
                    </div>

                    {/* Botones de inicio de sesion o registro */}
                    <div className={styles.actionsButtons} >
                        <button className={styles.Login}
                            onClick={buttonLogin}
                            disabled={loading}>Iniciar sesión
                        </button>

                        <button className={styles.Register}
                            onClick={buttonRegister}
                            disabled={loading}>Crear cuenta
                        </button>
                    </div>
                </nav>

                {/* Informacion del slogan */}
                <section className={styles.slogan} id="inicio">
                    <div className={styles.info}>
                        <h1>BKS</h1>
                        <p>Donde la innovación y el sabor se encuentran.</p>
                    </div>

                    <div className={styles.images}>
                        <img className={styles.chef} src={chef} alt="chef" />
                        <img className={styles.bread} src={bread} alt="bread" />
                    </div>
                </section>

                <hr className={styles.line} />

                {/* Información de "Nosotros" */}
                <section className={styles.us} id="nosotros">
                    <div className={styles.info_us}>
                        <h1>Nosotros</h1>
                        <p> <strong>BKS</strong> nació con la misión de fusionar la panadería artesanal con la innovación tecnológica, cuidando cada detalle <strong>—desde la precisión en las recetas hasta la experiencia digital—</strong> para asegurar productos frescos, saludables y consistentes <br /><br />
                        
                        Desde el inicio, <strong>BKS</strong> ha buscado ir más allá de la panadería tradicional, integrando técnica, calidad y pasión en cada uno de sus procesos. <br /><br />

                        En <strong>BKS</strong> reinventamos la panadería tradicional con un enfoque moderno y saludable, trabajando con ingredientes naturales, procesos cuidadosamente controlados y un firme compromiso con la excelencia. Cada pieza de pan refleja equilibrio, frescura y la pasión por hacer las cosas bien. <br /><br />

                        Nuestro objetivo es crear productos que nutran, inspiren y conquisten los sentidos, elevando lo saludable a una experiencia sofisticada y diferente.
                        </p>
                    </div>

                    <div className={styles.image}>
                        <img src={shelf} alt="estante" className={styles.shelf} />
                    </div>
                </section>

                <h1 className={styles.title} id="productos">Productos destacados</h1>
                
                {/* Información de productos destacados */}
                <section className={styles.products_featured}>
                    {/* <div className={styles.info_us}>
                        Mapeo de cards promo o descuentos
                    </div> */}
                </section>

                <h1 className={styles.title}>Productos más vendidos</h1>

                {/* Información de productos más vendidos */}
                <section className={styles.products_featured}>
                    {/* <div className={styles.info_us}>
                        Mapeo de cards productos mas vendidos
                    </div> */}
                </section>



                <div className="footer-con" id="contacto">
                    <Footer />
                </div> 
            </div>
        </>
    )
}