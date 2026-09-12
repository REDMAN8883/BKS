// import { useState } from 'react'
import { AuthProvider} from "./context/AuthProvider";
import { useAuth } from "./context/useAuth";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoadingProvider  from "./context/LoadingContext";

// Conforma la pagina
import LayoutGeneral from "../Layouts/LayoutGeneral";

// Pagina principal y publicas
import Principal from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SendCode from "./pages/stepsChangePassword/CodeRequest";
import ConfirmCode from "./pages/stepsChangePassword/ConfirmCode";
import PasswordChange from "./pages/stepsChangePassword/PasswordChange";
import Google from "./pages/GoogleSuccess";

// Vista para el cliente
import PanelIntialClient from "./pages/ClientView/PanelInitialClient";
import Subscriptions from "./pages/ClientView/PanelSubscriptions";
import Profile from "./pages/ClientView/Profile";



// Wrapper para obtener ID del usuario autenticado y pasarlo al componente del usuario
// function PerfilConAuth() {
//   const { user } = useAuth();
//   if(!user) return <div>Cargando usuario...</div>;
//   return <PerfilUsuario userId={user.id} />;
// }

function normalizeRole(role) {
  const normalizedRole = role?.toLowerCase();
  return normalizedRole === 'cliente' ? 'usuario' : normalizedRole;
}

function RutasProtegidas({ allowedRoles = [], children }) {
  const { user, loading} = useAuth();
  
  if(loading) return <div>Cargando...</div>;
  // Redirecion al Login
  if(!user) return <Navigate to="/login" replace />;

  // Normalizamos los roles
  const normalizedUserRole = normalizeRole(user.rol);

  // Verficacion que el usuario este permitido
  if (allowedRoles.length > 0 && !allowedRoles.includes(normalizedUserRole)){
    return <Navigate to={`/${normalizedUserRole}`} replace/>;
  }

  return children;
}

function AppRoutes() {
  const { user, loading } = useAuth();
  
  // console.log("AppRoutes - user:", user, "loading:", loading); // Debug
  
  // Mientras carga, mostrar loading
  if (loading) {
    return <div>Cargando aplicación...</div>;
  }
  
  return (
    <Routes>
      {/* rutas publica Landing Page*/}
      <Route path="/"
            element={
                user
                    ? <Navigate to={user.rol?.toLowerCase() === "admin" ? "/admin" : "/cliente"} replace />
                    : <Principal />
    } />
      {/* Inicio de sesion */}
      <Route path="/login" element={<Login />} />
      {/* Registro */}
      <Route path="/register" element={<Register />} />
      {/* Recuperacion, verificacion y cambio de contraseña */}
      <Route path="/sendCode" element={<SendCode />} />
      <Route path="/confirmCode" element={<ConfirmCode />} />
      <Route path="/passwordChange" element={<PasswordChange />} />
      {/* Redireccion de vista por si esta con Google */}
      <Route path="/google-success" element={<Google />} />
      {/* Ruta para el regreso al Home */}
      <Route path="/HomePage" element={<Principal />} />

      {/* Rutas protegidas*/}
      <Route 
        path="/admin/*"
        element={
          <RutasProtegidas allowedRoles={["admin", "cliente", "usuario"]}>
            <LayoutGeneral />
          </RutasProtegidas>
        }
      >
        <Route index element={<PanelIntialClient />}/>
      </Route>

      {/* Rutas protegidas*/}
      <Route 
        path="/cliente/*"
        element={
          <RutasProtegidas allowedRoles={["admin", "cliente", "usuario"]}>
            <LayoutGeneral />
          </RutasProtegidas>
        }
      >
        <Route index element={<PanelIntialClient />}/>
        <Route path="panelSubscriptions" element={<Subscriptions/>}/>
        <Route path="profile" element={<Profile/>}/>
      </Route>
      

      
    </Routes>
  );
}

export default function App(){
  // console.log("App component rendering"); // Debug
  
  return (
    <AuthProvider>
      <LoadingProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </LoadingProvider>
    </AuthProvider>
  );
}
