// import { useState } from 'react'
import { AuthProvider} from "./context/AuthProvider";
import { useAuth } from "./context/useAuth";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Pagina principal y publicas
import Principal from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Registro";
import EnvioCodigo from "./pages/Envio_Codigo";
import Confirmacion_Codigo from "./pages/Confirmacion_Codigo";
import CambioContraseña from "./pages/Cambio_Contraseña";

// Importaciones de las demas vistas
import LayoutGeneral from "../Layouts/LayoutGeneral";
import Catalogo from "./pages/Catalogo";



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
  
  console.log("AppRoutes - user:", user, "loading:", loading); // Debug
  
  // Mientras carga, mostrar loading
  if (loading) {
    return <div>Cargando aplicación...</div>;
  }
  
  return (
    <Routes>
      {/* rutas publica Landing Page*/}
      <Route path="/" element={<Principal />} />
      {/* Inicio de sesion */}
      <Route path="/login" element={<Login />} />
      {/* Registro */}
      <Route path="/register" element={<Register />} />
      {/* Recuperacion, verificacion y cambio de contraseña */}
      <Route path="/Solicitud-de-codigo" element={<EnvioCodigo />} />
      <Route path="/Verificar-codigo" element={<Confirmacion_Codigo />} />
      <Route path="/Recuperar3" element={<CambioContraseña />} />

      {/* Rutas protegidas*/}
      <Route 
        path="/admin/*"
        element={
          <RutasProtegidas allowedRoles={["admin", "cliente", "usuario"]}>
            <LayoutGeneral />
          </RutasProtegidas>
        }
      >
        <Route index element={<Catalogo />}/>
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
        <Route index element={<Catalogo />}/>
      </Route>
      

      
    </Routes>
  );
}

export default function App(){
  console.log("App component rendering"); // Debug
  
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

// function AppRoutes() {
//   const { user } = useAuth();
//   console.log("Usuario en AppRoutes:", user);

//   return (
//     <Routes>
//           {/* Usuario no logueado → Login visible */}
//           <Route path="/" element={<Login />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="*" element={<Navigate to="/login" />} />
//     </Routes>
//   );

// }

// export default function App() {
//   return (
//     <AuthProvider>
//       <BrowserRouter>
//         <AppRoutes />
//       </BrowserRouter>
//     </AuthProvider>
//   );
// }