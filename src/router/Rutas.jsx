import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom"
import App from "../App";
import Estudiantes from "../pages/Estudiantes";
import Docentes from "../pages/Docentes";
import Actividades from "../pages/Actividades";
import Grupos from "../pages/Grupos";
import Materias from "../pages/Materias";
import Acudientes from "../pages/Acudientes";
import Bolsillos from "../pages/Bolsillos";
import Login from "../components/login/Login";

const getTipoUsuario = () => { //Local storage, que desde el login nos trae las credenciales insertadas y las almacena en un espacio local
  const userData = localStorage.getItem("userData");
  return userData ? JSON.parse(userData).tipo_usuario : null;
};

function Rutas(){ /*Al proceso de tener una ruta dentro de otra, le llamamos rutas anidadas */
    const tipoUsuario = getTipoUsuario();

    return(
        <Routes>
            {tipoUsuario === "administrador" && (
            <Route path="/dashboard" element={<App></App>}> 
                <Route path="students" element={<Estudiantes></Estudiantes>}></Route>
                <Route path="professors" element={<Docentes></Docentes>}></Route>
                <Route path="assignments" element={<Actividades></Actividades>}></Route>
                <Route path="groups" element={<Grupos></Grupos>}></Route>
                <Route path="subjects" element={<Materias></Materias>}></Route>
                <Route path="parents" element={<Acudientes></Acudientes>}></Route>
                <Route path="pockets" element={<Bolsillos></Bolsillos>}></Route>
                {/*Aqui van todas las rutas anidadas dentro del dashboard*/}
            </Route>
            )}

            {/*Rutas específicas de usuarios */}
            {tipoUsuario === "docente" &&(
                <Route path="/docente/inicio" element={<></>}></Route>
            )}

            {tipoUsuario === "estudiante" &&(
                <Route path="/estudiante/inicio" element={<></>}></Route>
            )}

            {tipoUsuario === "acudiente" &&(
                <Route path="/acudiente/inicio" element={<></>}></Route>
            )}

            {/* Ruta de login para usuarios */}
            <Route path="/login" element={<Login></Login>}></Route>

            {/*Redirecciones ruta que no existe */}
            <Route path="*" element={<Navigate to="/login"></Navigate>}></Route>
            {/*Las rutas se pueden controlar con códigos JSON, como un 404 para las rutas inexistentes. Esto se haría a través de un componente o page */}

        </Routes>
    )
}

export default Rutas;