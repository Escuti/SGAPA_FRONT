import React from 'react';
import { Outlet } from 'react-router-dom'
import './App.css'
import Estudiantes from './pages/admin-pages/Estudiantes';
import Docentes from './pages/admin-pages/Docentes';
import Actividades from './pages/professor-pages/Actividades';
import Grupos from './pages/admin-pages/Grupos';
import Materias from './pages/admin-pages/Materias';
import Acudientes from './pages/admin-pages/Acudientes';
import NavBar from './components/navbar/NavBar'

import Entregas from './pages/student-pages/relCAL_Entregas';

import Calificaciones from './pages/professor-pages/relCAL_Calificaciones';

function App() { //Funcion de declaracion
  const userData = sessionStorage.getItem('userData');
  return (
    <section id="container" key={userData ? JSON.parse(userData).tipo_usuario : 'login'}>
      <NavBar></NavBar>
      <main>
        <div className='frame-content'>
          <Outlet> </Outlet>
        </div>
      </main>
      
    </section>
  )
}

export default App
