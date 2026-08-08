import { useState, useEffect, useRef } from "react";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const timeoutRef = useRef(null);

    // Tiempo de inactividad
    const resetInactivityTimer = () => {
        clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(() => {
            logout();
            alert("Tu sesión ha expirado por inactividad.");
        }, 30 * 60 * 100); // 30 minutos  30 * 60 * 100
    };

    // Guardamos la session del usuario
    useEffect(() => {
        const usuarioGuardado = 
            localStorage.getItem("user") ||
            sessionStorage.getItem("user");
        
        if(usuarioGuardado){
            setUser(JSON.parse(usuarioGuardado));
        }
        setLoading(false);
    }, []);

    // Controlamos la inactividad del usuario
    useEffect(() => {
        const events = [
            "mousemove",
            "mousedown",
            "keypress",
            "scroll",
            "touchstart"
        ];

        if (user) {
            resetInactivityTimer();

            events.forEach(event =>
                window.addEventListener(event, resetInactivityTimer)
            );
        }

        return () => {
            clearTimeout(timeoutRef.current);

            events.forEach(event =>
                window.removeEventListener(event, resetInactivityTimer)
            );
        };
    }, [user]);
    

    const login = (usuario) => {
        setUser(usuario);
    };

    // Remueve todo
    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("usuario_id")

        sessionStorage.removeItem("user");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("usuario_id")

        clearTimeout(timeoutRef.current);
        window.location.href = "/login";
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading}}>
            {children}
        </AuthContext.Provider>
    )
}