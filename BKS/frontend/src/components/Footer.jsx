// CSS
import styles from "../css/Footer.module.css";

// Importaciones de imagenes
import BusinessLogo from "../assets/BusinessLogo.avif";

export default function footer(){
    return (
        <>
            <footer className={styles.container}> 
                <div className={styles.top}>

                    {/* Logo y Agradecimiento */}
                    <div className={styles.info_thanks}>
                        <div className={styles.text_info}>
                            <h1>Gracias por</h1>
                            <h1>visitarnos</h1>
                        </div>

                        <img className={styles.LogoFooter} src={BusinessLogo} alt="Imagen_BKS" />
                    </div>

                    {/* Informacion de "Contactos y Ubicacion" */}
                    <details className={styles.store_info_container}>
                        <summary className={styles.accordion}>
                            <h2>Contactanos</h2>
                            <span className={styles.arrow}>▼</span>
                        </summary>
                        <div className={styles.accordion_content}>
                            <p>Tel: 300 123 4567</p>
                            <p>julianbeltran081@gmail.com</p>
                            <p>WhatsApp: 031 987 6543</p>
                        </div>
                    </details>

                    <details className={styles.store_info_container}>
                        <summary className={styles.accordion}>
                            <h2>Puntos de venta</h2>
                            <span className={styles.arrow}>▼</span>
                        </summary>
                        <div className={styles.accordion_content}>
                            <p>Carrera 15 # 42-18</p>
                            <p>Carrera 27 # 63-05</p>
                        </div>
                    </details>

                    {/* Redes sociales */}
                    <div className={styles.social_media}>
                        <h3>Redes sociales:</h3>
                        <div className={styles.social_icons}>
                            <a 
                                href="https://github.com/REDMAN8883" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className={styles.red_social}
                            >
                            <i className='bx bxl-github icon3'></i>
                            </a>

                            <a
                                href="https://discord.com/channels/828341060320755733/828341871695626290"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.red_social}
                            >
                            <i className="bx bxl-discord icon3"></i>
                            </a>

                            <a 
                                href="mailto:julianbeltran081@gmail.com" 
                                target='_blank' 
                                rel="noopener noreferrer"
                                className={styles.red_social}
                            >
                            <i className='bx bxl-gmail icon3' ></i>
                            </a>

                            <a 
                                href="https://wa.me/3226600792" 
                                target='_blank' 
                                rel="noopener noreferrer"
                                className={styles.red_social}
                            >
                            <i className='bx bxl-whatsapp-square icon3' ></i>
                            </a>
                        </div>
                    </div>
                </div>

                <hr className={styles.line} />

                {/* Derechos de autor */}
                <div className={styles.copyrigth}>
                    <p>© 2026 <strong>BKS.</strong> Todos los derechos reservados.</p>
                    <p>Un proyecto de <strong>REDMAN</strong></p>
                </div>
            </footer>
        </>
    )
}