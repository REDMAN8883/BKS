// Importaciones necesarias
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Import components
import NavBar from '../../components/NavBar'
import LoadingOverlay from "../../components/LoandingOverlay";

// Css
import styles from '../../css/clientCss/panelInitialClient.module.css';

export default function PanelClient(){
    // const { user, logout } = useAuth();

    // Variables necesarias 
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const subscriptions = async () => {
            setLoading(true);

            setTimeout(() => {
                setLoading(false);
                navigate("/cliente/panelSubscriptions");
            }, 2000);
        };

    return (
        <>  
            <LoadingOverlay visible={loading} text="Horneando tu membresía ideal..."/>
            <div className={styles.pageWrapper}>
                <div className={styles.backgroundSectionOne} >
                    {/* Tarjeta y buscador unificados */}
                    <div className={styles.headerCard}>
                        <NavBar className={styles.panelNavBar}></NavBar>

                        <div className={styles.searchBarContainer}>
                            <div className={styles.inputWrapper}>
                                <input 
                                    type="text" 
                                    placeholder='Buscar producto...' 
                                    className={styles.searchInput} 
                                />
                                <span className={styles.searchIcon}><i className="bx bx-search" /></span>
                            </div>

                            <div className={styles.divider}></div>

                            <div className={styles.filterChips}>
                                <button className={`${styles.chip} ${styles.chipActive}`}>✦ Todo</button>
                                <button className={styles.chip}>🔥 Más vendidos</button>
                                <button className={styles.chip}>⏳ Integrales</button>
                                <button className={styles.chip}>🚫 Sin gluten</button>
                                <button className={styles.chip}>✅ Disponibles</button>
                            </div>
                        </div>
                    </div>

                    <section className={styles.heroSection}>
                        <div className={styles.heroContent}>
                            <h1 className={styles.heroTitle}>El Pan de hoy
                                <span className={styles.hgText}> recién salido </span> del horno
                            </h1>

                            <div className={styles.dottedDivider}></div>

                            <p className={styles.heroSubtitle}>Masa madre, harinas de origen y manos que conocen el tiempo. Cada pieza, una historia</p>

                            <div className={styles.heroButtons}>
                                <a className={styles.buttonPrimary} href="#catalog">Ir al catálogo<i className="bx bx-arrow-right-stroke" /></a>
                                <button className={styles.buttonSecond} onClick={subscriptions}>👀 Ver Suscripciones</button>
                            </div>
                        </div>

                        <div className={styles.promoCardContainer}>
                            <div className={styles.promoCard}>
                                <span className={styles.promoBadge}>PROMO ESPECIAL</span>
                                <p className={styles.promoText}>
                                    <strong>Calentitas y crujientes:</strong> aprovecha hoy nuestro{' '}
                                    <span className={styles.promoHg}>3x2 </span>en baguettes artesanales.
                                </p>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Catalogo */}
                <section className={styles.catalogSection}>
                    <h2 className={styles.catalogTitle} id="catalog">Catálago de productos</h2>
                    <button className={styles.car}><i className="bx bx-shopping-bag" /> Compras</button>

                    {/* Mapeo del catalogo */}
                    {/* Falta insertar productos para realizarlo */}
                    <h1>PRODUCTOS</h1>
                </section>
            </div>
        </>
    )
}