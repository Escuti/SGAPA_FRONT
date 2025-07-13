import { useEffect, useState } from "react";
import BtnAdd from "../../components/btn-add/BtnAdd";
import ContentHeader from "../../components/content-header/ContentHeader";
import InputSearch from "../../components/input-search/InputSearch";
import DataTable from "react-data-table-component";
import Modal from "../../components/modal/Modal"
import Swal from "sweetalert2"
import TopBar from '../../components/topbar/TopBar'

//Importanción de servicios de la API
import { getProfessors, createProfessor, updateProfessor, changeProfessorStatus } from "../../services/professorService"; //definición de métodos o servicios a usar


//Configuración de Columnas

const Docentes =()=>{//recordar que los <></> iniciales, son un fragmento, lo cual exige react para declarar múltiples sentencias

    // Estado para mostrar u ocultar el modal
     const [showModal, setShowModal] = useState(false);
   
     // Estado para guardar la lista de colaboradores (usuarios)
     const [professors, setProfessors] = useState([]);
     // Para diferenciar si giuardo o actualizo
     const [professorEditado, setProfessorEditado] = useState([]); 

     //NOTA Para evitar error de carga del modal al editar y guardar, definir método closeModal
     // Llamarlo abajo en la línea 220, como se indica en comentario.

     const closeModal = () => {
        setShowModal(false); // Cierre el modal
        setProfessorEditado(null); //Restablezca el estado
        setNewProfessor({ //Restablezca los campos
          nombre: "",
          usuario: "",
          correo: "",
          contraseña: "",
          telefono: "",
          estado: 1,
        });
      };
      
   
     // Estado para el formulario de un nuevo colaborador
     const [newProfessor, setNewProfessor] = useState({
        nombre: "",
        usuario: "",
        correo: "",
        contraseña: "",
        telefono: "",
        estado: 1,
     });

    const fetchProfessors = async () => {
        try{
            const res= await getProfessors();
            setProfessors(res.data || []); // El || en JS significa or, y se asigna un array vacío en caso de que falle la petición
        }catch(error){
            Swal.fire("Error", "No se han podido cargar los docentes", "error")
        }
    }

    useEffect(()=>{ //El useEffect es un hook de React que me permite ejecutar peticiones, como la de fetchUsers
        fetchProfessors();
    }, []);
    //Config de columnas y rellenar con datos de API
    const columns=[
        {name: "Nombre", selector: row => row.nombre, sortable: true},
        {name: "Usuario", selector: row => row.usuario, sortable: true},
        {name: "Correo", selector: row => row.correo},
        {name: "contraseña", selector: row => row.contraseña},
        {name: "Telefono", selector: row => row.telefono},
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
       setNewProfessor({ ...newProfessor, [e.target.name]: e.target.value });
     };
   
     // Manejador para envío del formulario (crear usuario)
     const handleSubmit = async (e) => {
       e.preventDefault(); // Previene recarga de página
       try{
         if(professorEditado){
           const res= await updateProfessor({...newProfessor, id_doc: professorEditado.id_doc });
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
           const res= await createProfessor(newProfessor);
           if(res.ok){
             const data= await res.json();
             Swal.fire("Usuario agregado", data.message, "success");
           }else{
             const dataError= await res.json();
             Swal.fire("Error", dataError.message, "error");
           }
         }
   
         setShowModal(false);
         setProfessorEditado(null);
         setNewProfessor({
          nombre: "",
          usuario: "",
          correo: "",
          contraseña: "",
          telefono: "",
          estado: 1,
         });
         fetchProfessors(); // Actualizamos la tabla para ver los cambios reflejados
       }catch(error){
         Swal.fire("Error", "Ocurrió inesperado", "error");
       }
      
     };
   
   
     const handleEdit = (docente) =>{
       setNewProfessor({
       nombre: docente.nombre,
       usuario: docente.usuario,
       correo: docente.correo,
       contraseña: docente.contraseña,
       telefono: docente.telefono,
       estado: docente.estado
       })
       setProfessorEditado(docente);
       setShowModal(true);
     }
   
     // Manejador para cambiar el estado del usuario (activo/inactivo)
     const handleToggleEstado = async (docente) => {
       const nuevoEstado = docente.estado === 1 ? 0 : 1;
       const estadoTexto = nuevoEstado === 1 ? "activar" : "inactivar";
     
       const result = await Swal.fire({
         title: `¿Estás seguro de que quieres ${estadoTexto} a ${docente.nombre}?`,
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
           const res = await changeProfessorStatus(docente.id_doc, nuevoEstado);
           if (res.ok) {
             Swal.fire("Actualizado", `El usuario ha sido ${estadoTexto} correctamente.`, "success");
             fetchProfessors(); // Refresca la tabla
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
        title={"Docentes"}
        paragraph={"Gestiona a todos los docentes"}></ContentHeader>
        <div className="content-search">
            <BtnAdd 
                textButton="Invitar a docente" 
                onClick={()=>{
                    closeModal();
                    setShowModal(true);
                    }}></BtnAdd>
        </div>
        <div className="table-container">
            <DataTable
            columns={columns}
            data={professors}
            pagination
            highlightOnHover>
            </DataTable>
        </div>

        <Modal
        isOpen={showModal}
        //onClose={()=> setShowModal(false)} remplazar esta línea
        onClose={closeModal} //por esta
        title={"Registrar Docente"}>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Nombre</label>
                    <input type="text" name="nombre" value={newProfessor.nombre} onChange={handleChange}></input>
                </div>
                <div className="form-group">
                    <label>Usuario</label>
                    <input type="text" name="usuario" value={newProfessor.usuario} onChange={handleChange}></input>
                </div>
                <div className="form-group">
                    <label>Correo</label>
                    <input type="text" name="correo" value={newProfessor.correo} onChange={handleChange}></input>
                </div>
                <div className="form-group">
                    <label>Contraseña</label>
                    <input type="text" name="contraseña" value={newProfessor.contraseña} onChange={handleChange}></input>
                </div>
                <div className="form-group">
                    <label>Telefono</label>
                    <input type="text" name="telefono" value={newProfessor.telefono} onChange={handleChange}></input>
                </div>

                {!professorEditado && ( //De esta forma controlamos que el modal no muestre el estado, si el userEditado es falso o no tiene ningún valor almacenado
                  <div className="form-group">
                    <label>Estado</label>
                    <select name="estado" value={newProfessor.estado} onChange={handleChange}>
                        <option value={1}>Activo</option>
                        <option value={0}>Inactivo</option>
                    </select>
                </div>
                )}

                <button type="submit" className="submit-btn"> 
                  {professorEditado ? "Actualizar" : "Invitar"} {/*Lo anterior es un verificador, donde ? comprueba si userEditado tiene datos o no, y así saber si actualizar o invitar */}
                </button>
            </form>
        </Modal>
                    
        </>
    );
};

export default Docentes;