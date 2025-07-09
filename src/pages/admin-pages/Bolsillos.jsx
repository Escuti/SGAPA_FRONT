import { useState } from "react";
import BtnAdd from "../../components/btn-add/BtnAdd";
import ContentHeader from "../../components/content-header/ContentHeader";
import InputSearch from "../../components/input-search/InputSearch";
import DataTable from "react-data-table-component";
import Modal from "../../components/modal/Modal";
import Swal from "sweetalert2";

//Importación servicios que hacen las peticiones al backend
import { getBolsillos, createBolsillo } from "../../services/bolsilloService";
import { getStudents } from "../../services/studentService";

import { useEffect } from "react";


const Bolsillos = () => {
    const [bolsillos, setBolsillos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newBolsillo, setNewBolsillo] = useState({ //Establecemos los datos de la BD aún si son FK
        nombre: "",
        saldo: "",
        usuario: ""
    })
    const [users, setUsers] = useState([]);

    //Cargar bolsillos desde el API
    const fetchBolsillo = async () => {
        try {
            const res = await getBolsillos();
            if (res.success) {
                setBolsillos(res.data);
            }
        } catch (error) {
            Swal.fire("Error", "No se pudo cargar la información de los bolsillo", "error")
        }
    }

    const fetchUsuarios = async () => {
        try {
            const res = await getStudents();
            console.log(res);

            if (res.success) {
                setUsers(res.data);
            }
        } catch (error) {
            Swal.fire("Error", "No se pudo cargar la información de los usuarios", "error")
        }
    }

    useEffect(() => { //ESTE ES EL PRIMER PASO PARA CONECTAR CON FK, EL FETCH DEBE CORRESPONDER CON EL CAMPO QUE SEA FK, EN ESTE CASO ES fetchUsuarios()
        fetchBolsillo(); //FETCH DE CAMPO QUE SE RELACIONA A FK
        fetchUsuarios(); //FETCH DE FK
    }, []);


    const columns = [
        { name: "Nombre", selector: row => row.nombreb, sortable: true },
        { name: "Saldo", selector: row => row.saldo, sortable: true },
        { name: "Nombre Usuario", selector: row => row.nombre, sortable: true },
        { name: "Apellido Usuario", selector: row => row.apellido, sortable: true },
        { name: "Teléfono", selector: row => row.numtelefono },

    ];


    const closeModal = () => {
        setShowModal(false); // Cierre el modal
        setNewBolsillo({
            nombre: "",
            saldo: "",
            usuario: ""
        })

    };

    const handleChange = (e) => {
        setNewBolsillo({ ...newBolsillo, [e.target.name]: e.target.value })
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await createBolsillo(newBolsillo);
            const data = await res.json();
            //console.log(data); En caso de que haga falta verificar errores
            if (res.ok) {
                Swal.fire("Éxito", data.message, "success"); //data.message toma el message del diccionario json que viene desde la API cuando se hacen las peticiones
                setShowModal(false); //se cierra el modal
                setNewBolsillo({ //se restablecen los valores del modal a vacío, para una nueva petición create
                    nombre: "",
                    saldo: "",
                    usuario: ""
                })
                fetchBolsillo(); //Actualizar el datatable
            } else {
                Swal.fire("Error", data.message, "error");
            }
        } catch (error) {
            Swal.fire("Error", "Ocurrió un error inesperado", "error");
        }
    }

    return (
        <>
            <ContentHeader
                title="Bolsillos"
                paragraph="¡Bienvenido a la sección de Bolsillos! Aquí podrás crear, modificar, asociar, desactivar y eliminar a los bolsillo de tu empresa. Estamos aquí para ayudarte en todo lo que necesites."
            />

            <InputSearch />
            <BtnAdd textButton="Agregar Bolsillo" onClick={() => setShowModal(true)} />

            <div className="table-container">
                <DataTable
                    columns={columns}
                    data={bolsillos}
                    pagination
                    highlightOnHover
                />
            </div>

            <Modal
                isOpen={showModal}
                onClose={closeModal} //EN EL MODAL DE CADA PAGINA SE DEBEN USAR LAS CONSTANTES RESPECTIVAS DEFINIDAS AL INICIO, EJ: "newBolsillo"
                title="Crear Bolsillo">

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nombre:</label>
                        <input type="text" name="nombre" value={newBolsillo.nombre} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>Saldo:</label>
                        <input type="number" name="saldo" value={newBolsillo.saldo} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>Usuario:</label>


                        <select name="usuario" value={newBolsillo.usuario} onChange={handleChange} required>
                            <option value="">Seleccione un usuario</option>
                            {users.map((usuario) => { //EJEMPLO DE COMO TRAER UNA FK AL MODAL
                                return ( //Pilas aqué el elemento que falta para que cargue el select, correctamente
                                    <option key={usuario.id} value={usuario.id}>
                                        {usuario.nombre} {usuario.apellido}
                                    </option>
                                ); //cierra aquí
                            })}


                        </select>
                    </div>

                    <button type="submit" className="submit-btn">
                        Crear Bolsillo
                    </button>
                </form>

            </Modal>
        </>
    );

};
export default Bolsillos;