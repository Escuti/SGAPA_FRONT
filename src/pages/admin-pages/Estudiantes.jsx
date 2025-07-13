import { useEffect, useState } from "react";
import BtnAdd from "../../components/btn-add/BtnAdd";
import ContentHeader from "../../components/content-header/ContentHeader";
import InputSearch from "../../components/input-search/InputSearch";
import DataTable from "react-data-table-component";
import Modal from "../../components/modal/Modal"
import Swal from "sweetalert2"
import TopBar from '../../components/topbar/TopBar'

//Importanción de servicios de la API
import { getStudents, createStudent, updateStudent, changeStudentStatus } from "../../services/studentService"; //definición de métodos o servicios a usar
import { getParents } from "../../services/parentService";
import { getGroups } from "../../services/groupService";


//Configuración de Columnas

const Estudiantes =()=>{//recordar que los <></> iniciales, son un fragmento, lo cual exige react para declarar múltiples sentencias

    // Estado para mostrar u ocultar el modal
     const [showModal, setShowModal] = useState(false);
   
     // Estado para guardar la lista de colaboradores (usuarios)
     const [students, setStudents] = useState([]);
     // Para diferenciar si giuardo o actualizo
     const [studentEditado, setStudentEditado] = useState([]); 

     //NOTA Para evitar error de carga del modal al editar y guardar, definir método closeModal
     // Llamarlo abajo en la línea 220, como se indica en comentario.

     const closeModal = () => {
        setShowModal(false); // Cierre el modal
        setStudentEditado(null); //Restablezca el estado
        setNewStudent({ //Restablezca los campos
          nombre: "",
          usuario: "",
          contraseña: "",
          correo: "",
          telefono: "",
          grupo: "",
          padre_familia: "",
          estado: 1,
        });
      };
      
   
     // Estado para el formulario de un nuevo colaborador
     const [newStudent, setNewStudent] = useState({
        nombre: "",
        usuario: "",
        contraseña: "",
        correo: "",
        telefono: "",
        grupo: "",
        padre_familia: "",
        estado: 1,
     });

     const [parents, setParents] = useState([]);
     const [groups, setGroups] = useState([]);

    //Función para obtener datos de estudiantes desde la API
    const fetchStudents = async () => {
        try{
            const res= await getStudents();
            setStudents(res.data || []); // El || en JS significa or, y se asigna un array vacío en caso de que falle la petición
        }catch(error){
            Swal.fire("Error", "No se han podido cargar los estudiantes", "error")
        }
    }

    //Función para obtener datos de acudientes desde la API
    const fetchParents = async () => {
        try {
            const res = await getParents();
            console.log(res);

            if (res.success) {
                setParents(res.data);
            }
        } catch (error) {
            Swal.fire("Error", "No se han podido cargar los padres de familia", "error")
        }
    }

    const fetchGroups = async () => {
        try {
            const res = await getGroups();
            console.log(res);

            if (res.success) {
                setGroups(res.data);
            }
        } catch (error) {
            Swal.fire("Error", "No se han podido cargar los grupos", "error")
        }
    }

    useEffect(()=>{ //El useEffect es un hook de React que me permite ejecutar peticiones, como la de fetchUsers
        fetchStudents();
        fetchParents();
        fetchGroups();
    }, []);
    //Config de columnas y rellenar con datos de API
    const columns=[
        {name: "Nombre", selector: row => row.nombre, sortable: true},
        {name: "Usuario", selector: row => row.usuario, sortable: true},
        {name: "Contraseña", selector: row => row.contraseña},
        {name: "Correo", selector: row => row.correo},
        {name: "Telefono", selector: row => row.telefono},
        {name: "Grupo", selector: row => row.grupo},
        {name: "Padre de Familia", selector: row => row.padre_familia},
        {name: "Estado", selector: row =>  ( //Ejemplo de renderizado condicional, donde traemos los badge del css y los aplicamos a un elemento específico del data-table
            <span className={`badge ${row.estado===1 ? "badge-blue" : "badge-red"}`}> 
                {row.estado===1 ? "Activo" : "Inactivo"}
            </span>
        )},
        {
           name: "Acciones",
           cell: row => (
             <div className="action-buttons">
               <i
                 className="fas fa-edit icon-btn"
                 title="Editar"
                 style={{ marginRight: "10px", cursor: "pointer" }}
                 onClick={() => handleEdit(row)} //Evento cuando haga click sobre opción editar
               ></i>
               <i
                 className={`fas ${row.estado === 1 ? "fa-toggle-on" : "fa-toggle-off"} icon-btn`}
                 title="Cambiar estado"
                 style={{ cursor: "pointer", color: row.estado === 1 ? "#2196F3" : "gray" }}
                 onClick={() => handleToggleEstado(row)}
               ></i>
             </div>
           ),
           ignoreRowClick: true,
           allowoverflow: true,
           button: "true",
         }
    ]

    // Manejador para cambios en los inputs del formulario
     const handleChange = (e) => {
       setNewStudent({ ...newStudent, [e.target.name]: e.target.value });
     };
   
     // Manejador para envío del formulario (crear usuario)
     const handleSubmit = async (e) => {
       e.preventDefault(); // Previene recarga de página
       try{
         if(studentEditado){
           const res= await updateStudent({...newStudent, id_estud: studentEditado.id_estud });
           if(res.ok){
             const data= await res.json();
             if(data.success){
               Swal.fire("Actualización", data.message, "success");
             }else{
               Swal.fire("Sin Cambios", data.message, "info");
             }
           }else{
             const dataError= await res.json();
             Swal.fire("Error", dataError.message, "error");
           }
         }else{
           const res= await createStudent(newStudent);
           if(res.ok){
             const data= await res.json();
             Swal.fire("Usuario agregado", data.message, "success");
           }else{
             const dataError= await res.json();
             Swal.fire("Error", dataError.message, "error");
           }
         }
   
         setShowModal(false);
         setStudentEditado(null);
         setNewStudent({
          nombre: "",
          usuario: "",
          contraseña: "",
          correo: "",
          telefono: "",
          grupo: "",
          padre_familia: "",
          estado: 1,
         });
         fetchStudents(); // Actualizamos la tabla para ver los cambios reflejados
       }catch(error){
         Swal.fire("Error", "Ocurrió inesperado", "error");
       }
      
     };
   
   
     const handleEdit = (estudiante) =>{
       setNewStudent({
       nombre: estudiante.nombre,
       usuario: estudiante.usuario,
       contraseña: estudiante.contraseña,
       correo: estudiante.correo,
       telefono: estudiante.telefono,
       grupo: estudiante.grupo,
       padre_familia: estudiante.padre_famlia,
       estado: estudiante.estado
       })
       setStudentEditado(estudiante);
       setShowModal(true);
     }
   
     // Manejador para cambiar el estado del usuario (activo/inactivo)
     const handleToggleEstado = async (estudiante) => {
       const nuevoEstado = estudiante.estado === 1 ? 0 : 1;
       const estadoTexto = nuevoEstado === 1 ? "activar" : "inactivar";
     
       const result = await Swal.fire({
         title: `¿Estás seguro de que quieres ${estadoTexto} a ${estudiante.nombre}?`,
         text: `Este usuario será marcado como ${nuevoEstado === 1 ? "activo" : "inactivo"}.`,
         icon: "warning",
         showCancelButton: true,
         confirmButtonColor: "#3085d6",
         cancelButtonColor: "#d33",
         confirmButtonText: `Sí, ${estadoTexto}`,
         cancelButtonText: "Cancelar"
       });
     
       if (result.isConfirmed) {
         try {
           const res = await changeStudentStatus(estudiante.id_estud, nuevoEstado);
           if (res.ok) {
             Swal.fire("Actualizado", `El usuario ha sido ${estadoTexto} correctamente.`, "success");
             fetchStudents(); // Refresca la tabla
           } else {
             Swal.fire("Error", "No se pudo actualizar el estado del usuario.", "error");
           }
         } catch (error) {
           Swal.fire("Error", "Ocurrió un error inesperado.", "error");
         }
       } 
     };
    //Aquí hacia arriba manejo de servicios
    return(
        <>
        <TopBar></TopBar>
        <ContentHeader
        title={"Estudiantes"}
        paragraph={"Gestiona a todos los estudiantes"}></ContentHeader>
        <div className="content-search">
            <BtnAdd 
                textButton="Invitar a estudiante" 
                onClick={()=>{
                    setShowModal(true);
                    }}></BtnAdd>
        </div>
        <div className="table-container">
            <DataTable
            columns={columns}
            data={students}
            pagination
            highlightOnHover>
            </DataTable>
        </div>

        <Modal
        isOpen={showModal}
        //onClose={()=> setShowModal(false)} remplazar esta línea
        onClose={closeModal} //por esta
        title={"Registrar Estudiante"}>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Nombre</label>
                    <input type="text" name="nombre" value={newStudent.nombre} onChange={handleChange}></input>
                </div>
                <div className="form-group">
                    <label>Usuario</label>
                    <input type="text" name="usuario" value={newStudent.usuario} onChange={handleChange}></input>
                </div>
                <div className="form-group">
                    <label>Contraseña</label>
                    <input type="text" name="contraseña" value={newStudent.contraseña} onChange={handleChange}></input>
                </div>
                <div className="form-group">
                    <label>Correo</label>
                    <input type="text" name="correo" value={newStudent.correo} onChange={handleChange}></input>
                </div>
                <div className="form-group">
                    <label>Telefono</label>
                    <input type="text" name="telefono" value={newStudent.telefono} onChange={handleChange}></input>
                </div>
                <div className="form-group">
                        <label>Grupo</label>

                        <select name="grupo" value={newStudent.grupo} onChange={handleChange} required>
                            <option value="">Seleccione un grupo</option> 
                            {groups.map((grupo) => { 
                                return ( 
                                    <option key={grupo.id_grupo} value={grupo.id_grupo}>
                                        {grupo.grupo}
                                    </option>
                                ); //Aquí cierra
                            })}

                        </select>
                    </div>
                <div className="form-group">
                        <label>Padre de Familia</label>

                        <select name="padre_familia" value={newStudent.padre_familia} onChange={handleChange} required>
                            <option value="">Seleccione un acudiente</option>
                            {parents.map((padre_familia) => {
                                return ( //Pilas aqué el elemento que falta para que cargue el select, correctamente
                                    <option key={padre_familia.id_pfamilia} value={padre_familia.id_pfamilia}>
                                        {padre_familia.nombre}
                                    </option>
                                );
                            })}

                        </select>
                    </div>

                {!studentEditado && ( //De esta forma controlamos que el modal no muestre el estado, si el userEditado es falso o no tiene ningún valor almacenado
                  <div className="form-group">
                    <label>Estado</label>
                    <select name="estado" value={newStudent.estado} onChange={handleChange}>
                        <option value={1}>Activo</option>
                        <option value={0}>Inactivo</option>
                    </select>
                </div>
                )}

                <button type="submit" className="submit-btn"> 
                  {studentEditado ? "Actualizar" : "Invitar"} {/*Lo anterior es un verificador, donde ? comprueba si userEditado tiene datos o no, y así saber si actualizar o invitar */}
                </button>
            </form>
        </Modal>
                    
        </>
    );
};

export default Estudiantes;