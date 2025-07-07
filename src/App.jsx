import React from 'react';
import { Outlet } from 'react-router-dom'
import './App.css'
import Estudiantes from './pages/Estudiantes'
import Docentes from './pages/Docentes'
import Actividades from './pages/Actividades'
import Grupos from './pages/Grupos'
import Materias from './pages/Materias'
import Acudientes from './pages/Acudientes'
import Products from './pages/Products'
import NavBar from './components/navbar/NavBar'

function App() { //Funcion de declaracion

  return (
    <section id='container'>
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
