import NavBar from "../src/components/NavBar";
import Footer from "../src/components/Footer";

// Dependencias
import { Outlet } from "react-router-dom";
// CSS
import '../src/css/LayoutGeneral.css';
import { useLoading } from "../src/context/useLoading";


export default function LayoutGeneral() {
    const { loading } = useLoading();
    return (
        <div className="app-container">
            <main className={`main-container ${loading ? "content-hidden" : ""}`}>
                <Outlet/>
            </main>

            <div className={`footer-con ${loading ? "content-hidden" : ""}`}>
                <Footer />
            </div> 
        </div>
    );
}