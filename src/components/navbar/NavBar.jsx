import { NavLink, useNavigate } from 'react-router-dom';
import './NavBar.css';
import sgapalogo from "./sgapalogo.svg";

const NavBar = () => {
    // Obtener el tipo de usuario desde localStorage
    const userData = sessionStorage.getItem("userData");
    const tipoUsuario = userData ? JSON.parse(userData).tipo_usuario : null;

    const navigate = useNavigate();

    const cerrarSesion = () => {
        sessionStorage.removeItem("userInfo");
        sessionStorage.removeItem("token");
        navigate("/login");
    };

    return ( //SE MANEJA DESPLIEGUE DE USUARIO CON CONDICIONALES USANDO EL tipo_usuario DEL Login.jsx
        <nav>
            <div className="nav-logo">
                <img src={sgapalogo} alt="logo-sgapa" />
            </div>
            <ul className="nav-menu">
                {/* Botones para TODOS los usuarios */}
                
                {/* Mostrar Configuración solo para admin y docente */}
                {(tipoUsuario === "administrador" || tipoUsuario === "docente") && (
                    <li className="nav-item">
                        <span className="material-symbols-rounded"></span>
                        <NavLink to="">Configuración</NavLink>
                    </li>
                )}

                {/* Elementos específicos por rol */}
                {tipoUsuario === "administrador" && (
                    <>
                        <li className="nav-item">
                            <span className="material-symbols-rounded"></span>
                            <NavLink to="/admin">Inicio</NavLink>
                        </li>
                        <hr className="hr-separator" />
                        <li className="nav-item">
                            <NavLink to="/admin/crud-estudiantes" className="item-intro">Estudiantes</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/admin/crud-docentes" className="item-intro">Docentes</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/admin/crud-grupos" className="item-intro">Grupos</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/admin/crud-materias" className="item-intro">Materias</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/admin/crud-acudientes" className="item-intro">Acudientes</NavLink>
                        </li>
                    </>
                )}

                {tipoUsuario === "docente" && (
                    <>
                        <li className="nav-item">
                            <span className="material-symbols-rounded"></span>
                            <NavLink to="/professor">Inicio</NavLink>
                        </li>
                        <hr className="hr-separator" />
                        <li className="nav-item">
                            <NavLink to="/professor/crud-actividades" className="item-intro">Actividades</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/professor/calificaciones" className="item-intro">Calificaciones</NavLink>
                        </li>
                    </>
                )}

                {tipoUsuario === "estudiante" && (
                    <>
                        <li className="nav-item">
                            <span className="material-symbols-rounded"></span>
                            <NavLink to="/student">Inicio</NavLink>
                        </li>
                        <hr className="hr-separator" />
                        <li className="nav-item">
                            <NavLink to="/student/entregas" className="item-intro">Entregas</NavLink>
                        </li>
                    </>
                )}

                {tipoUsuario === "acudiente" && (
                    <>
                        <li className="nav-item">
                            <span className="material-symbols-rounded"></span>
                            <NavLink to="/parent">Inicio</NavLink>
                        </li>
                        <hr className="hr-separator" />
                        <li className="nav-item">
                            <NavLink to="/parent/seguimiento" className="item-intro">Seguimiento</NavLink>
                        </li>
                    </>
                )}

                <hr className="hr-separator" />

                {/* Botón de logout para todos */}
                <li className="nav-item">
                    <span className="material-symbols-rounded"></span>
                    <NavLink to="/login" onClick={cerrarSesion}>Cerrar sesión</NavLink>
                </li>
            </ul>
        </nav>
    );
};

export default NavBar;