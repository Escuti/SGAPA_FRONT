import { NavLink } from 'react-router-dom';
import './NavBar.css';
import sgapalogo from "./sgapalogo.svg";

const NavBar = () => {
    return (

        <nav>
            <div className="nav-logo">
                <img src={sgapalogo} alt="logo-sgapa" />
            </div>
            <ul className="nav-menu">
                <li className="nav-item"><span className="material-symbols-rounded">Home</span><NavLink to="/home">Inicio</NavLink></li>                
                <li className="nav-item"><span className="material-symbols-rounded">settings</span><NavLink to="/config">Configuración</NavLink></li>
                <hr className="hr-separator" />
                <li className="nav-item"><NavLink to="/dashboard/students" className="item-intro">Estudiantes</NavLink></li>
                <li className="nav-item"><NavLink to="/dashboard/professors" className="item-intro">Docentes</NavLink></li>
                <li className="nav-item"><NavLink to="/dashboard/assignments" className="item-intro">Actividades</NavLink></li>
                <li className="nav-item"><NavLink to="/dashboard/groups" className="item-intro">Grupos</NavLink></li>
                <li className="nav-item"><NavLink to="/dashboard/subjects" className="item-intro">Materias</NavLink></li>
                <li className="nav-item"><NavLink to="/dashboard/parents" className="item-intro">Acudientes</NavLink></li>
                <li className="nav-item"><NavLink to="/dashboard/pockets" className="item-intro">Bolsillos</NavLink></li>
                <hr className="hr-separator" />
                <li className="nav-item"><span className="material-symbols-rounded">logout</span><NavLink to="/logout">Cerrar sesión</NavLink></li>
            </ul>

        </nav>

    );
};


export default NavBar;