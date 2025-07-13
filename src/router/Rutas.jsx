import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import App from "../App";
import Estudiantes from "../pages/admin-pages/Estudiantes";
import Docentes from "../pages/admin-pages/Docentes";
import Actividades from "../pages/professor-pages/Actividades";
import Grupos from "../pages/admin-pages/Grupos";
import Materias from "../pages/admin-pages/Materias";
import Acudientes from "../pages/admin-pages/Acudientes";
import Login from "../components/login/Login";
import Entregas from "../pages/student-pages/relCAL_Entregas";
import Calificaciones from "../pages/professor-pages/relCAL_Calificaciones";
import SeguimientoEstudiante from "../pages/parent-pages/Seguimiento";

const getTipoUsuario = () => {
  const userData = sessionStorage.getItem("userData");
  return userData ? JSON.parse(userData).tipo_usuario : null;
};

function Rutas() {
  const tipoUsuario = getTipoUsuario();

  return (
    <Routes>
      {/* Rutas para Administrador */}
      {tipoUsuario === "administrador" && ( //FUE NECESARIO USAR ESTRUCTURA DE /admin/* PARA INDICAR LAS SUBRUTAS DEL Outlet
        <Route path="/admin/*" element={<App></App>}> {/* El App se renderiza directamente aquí */}
          <Route path="crud-estudiantes" element={<Estudiantes></Estudiantes>} /> {/* El Outlet se encarga de desplegar las subrutas*/}
          <Route path="crud-docentes" element={<Docentes></Docentes>} />
          <Route path="crud-grupos" element={<Grupos></Grupos>} />
          <Route path="crud-materias" element={<Materias></Materias>} />
          <Route path="crud-acudientes" element={<Acudientes></Acudientes>} />
        </Route>
      )}

      {/* Rutas para Docente */}
      {tipoUsuario === "docente" && (
        <Route path="/professor/*" element={<App></App>}>
          <Route path="crud-actividades" element={<Actividades></Actividades>} />
          <Route path="calificaciones" element={<Calificaciones></Calificaciones>} />
        </Route>
      )}

      {/* Rutas para Estudiante */}
      {tipoUsuario === "estudiante" && (
        <Route path="/student/*" element={<App></App>}>
          <Route path="entregas" element={<Entregas></Entregas>} />
        </Route>
      )}

      {/* Rutas para Acudiente */}
      {tipoUsuario === "acudiente" && (
        <Route path="/parent/*" element={<App></App>}>
          <Route path="seguimiento" element={<SeguimientoEstudiante></SeguimientoEstudiante>} />
        </Route>
      )}

      {/* Ruta de Login */}
      <Route path="/login" element={<Login></Login>} />

      {/* Ruta de Configuración (compartida para admin y docente) */}
      <Route path="/config" element={<></>} />

      {/* Ruta de Inicio (común para todos) */}
      <Route path="/home" element={<></>} />

      {/* Redirección para rutas no existentes */}
      <Route path="*" element={<Navigate to="/login"></Navigate>} />
    </Routes>
  );
}

export default Rutas;