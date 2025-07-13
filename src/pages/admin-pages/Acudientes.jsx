import { useEffect, useState } from "react";
import BtnAdd from "../../components/btn-add/BtnAdd";
import ContentHeader from "../../components/content-header/ContentHeader";
import InputSearch from "../../components/input-search/InputSearch";
import DataTable from "react-data-table-component";
import Modal from "../../components/modal/Modal"
import Swal from "sweetalert2"
import TopBar from '../../components/topbar/TopBar'

//Importanción de servicios de la API
import { getParents, createParent, updateParent, changeParentStatus } from "../../services/parentService"; //definición de métodos o servicios a usar


//Configuración de Columnas

const Acudientes =()=>{//recordar que los <></> iniciales, son un fragmento, lo cual exige react para declarar múltiples sentencias

    // Estado para mostrar u ocultar el modal
     const [showModal, setShowModal] = useState(false);
   
     // Estado para guardar la lista de colaboradores (usuarios)
     const [parents, setParents] = useState([]);
     // Para diferenciar si giuardo o actualizo
     const [parentEditado, setParentEditado] = useState([]); 

     //NOTA Para evitar error de carga del modal al editar y guardar, definir método closeModal
     // Llamarlo abajo en la línea 220, como se indica en comentario.

     const closeModal = () => {
        setShowModal(false); // Cierre el modal
        setParentEditado(null); //Restablezca el estado
        setNewParent({ //Restablezca los campos
          nombre: "",
          usuario: "",
          correo: "",
          contraseña: "",
          telefono: "",
          estado: 1,
        });
      };
      
   
     // Estado para el formulario de un nuevo colaborador
     const [newParent, setNewParent] = useState({
        nombre: "",
        usuario: "",
        correo: "",
        contraseña: "",
        telefono: "",
        estado: 1,
     });

    //Función para obtener datos de usuarios desde la API
    const fetchParents = async () => {
        try{
            const res= await getParents();
            setParents(res.data || []); // El || en JS significa or, y se asigna un array vacío en caso de que falle la petición
        }catch(error){
            Swal.fire("Error", "No se han podido cargar los usuarios", "error")
        }
    }
    useEffect(()=>{ //El useEffect es un hook de React que me permite ejecutar peticiones, como la de fetchUsers
        fetchParents();
    }, []);
    //Config de columnas y rellenar con datos de API
    const columns=[
        {name: "Nombre", selector: row => row.nombre, sortable: true},
        {name: "Usuario", selector: row => row.usuario},
        {name: "Correo", selector: row => row.correo},
        {name: "Contraseña", selector: row => row.contraseña},
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
       setNewParent({ ...newParent, [e.target.name]: e.target.value });
     };
   
     // Manejador para envío del formulario (crear usuario)
     const handleSubmit = async (e) => {
       e.preventDefault(); // Previene recarga de página
       try{
         if(parentEditado){
           const res= await updateParent({...newParent, id_pfamilia: parentEditado.id_pfamilia });
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
           const res= await createParent(newParent);
           if(res.ok){
             const data= await res.json();
             Swal.fire("Usuario agregado", data.message, "success");
           }else{
             const dataError= await res.json();
             Swal.fire("Error", dataError.message, "error");
           }
         }
   
         setShowModal(false);
         setParentEditado(null);
         setNewParent({
          nombre: "",
          usuario: "",
          correo: "",
          contraseña: "",
          telefono: "",
          estado: 1,
         });
         fetchParents(); // Actualizamos la tabla para ver los cambios reflejados
       }catch(error){
         Swal.fire("Error", "Ocurrió inesperado", "error");
       }
      
     };
   
   
     const handleEdit = (padre_familia) =>{
       setNewParent({
       nombre: padre_familia.nombre,
       usuario: padre_familia.usuario,
       correo: padre_familia.correo,
       contraseña: padre_familia.contraseña,
       telefono: padre_familia.telefono,
       estado: padre_familia.estado
       })
       setParentEditado(padre_familia);
       setShowModal(true);
     }
   
     // Manejador para cambiar el estado del usuario (activo/inactivo)
     const handleToggleEstado = async (padre_familia) => {
       const nuevoEstado = padre_familia.estado === 1 ? 0 : 1;
       const estadoTexto = nuevoEstado === 1 ? "activar" : "inactivar";
     
       const result = await Swal.fire({
         title: `¿Estás seguro de que quieres ${estadoTexto} a ${padre_familia.nombre}?`,
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
           const res = await changeParentStatus(padre_familia.id_pfamilia, nuevoEstado);
           if (res.ok) {
             Swal.fire("Actualizado", `El usuario ha sido ${estadoTexto} correctamente.`, "success");
             fetchParents(); // Refresca la tabla
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
        title={"Acudientes"}
        paragraph={"Gestiona a todos los acudientes"}></ContentHeader>
        <div className="content-search">
            <InputSearch></InputSearch>
            <BtnAdd 
                textButton="Invitar a acudiente" 
                onClick={()=>{
                    setShowModal(true);
                    }}></BtnAdd>
        </div>
        <div className="table-container">
            <DataTable
            columns={columns}
            data={parents}
            pagination
            highlightOnHover>
            </DataTable>
        </div>

        <Modal
        isOpen={showModal}
        //onClose={()=> setShowModal(false)} remplazar esta línea
        onClose={closeModal} //por esta
        title={"Registrar Acudiente"}>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Nombre</label>
                    <input type="text" name="nombre" value={newParent.nombre} onChange={handleChange}></input>
                </div>
                <div className="form-group">
                    <label>Usuario</label>
                    <input type="text" name="usuario" value={newParent.usuario} onChange={handleChange}></input>
                </div>
                <div className="form-group">
                    <label>Correo</label>
                    <input type="text" name="correo" value={newParent.correo} onChange={handleChange}></input>
                </div>
                <div className="form-group">
                    <label>Contraseña</label>
                    <input type="text" name="contraseña" value={newParent.contraseña} onChange={handleChange}></input>
                </div>
                <div className="form-group">
                    <label>Telefono</label>
                    <input type="text" name="telefono" value={newParent.telefono} onChange={handleChange}></input>
                </div>
                {!parentEditado && ( //De esta forma controlamos que el modal no muestre el estado, si el userEditado es falso o no tiene ningún valor almacenado
                  <div className="form-group">
                    <label>Estado</label>
                    <select name="estado" value={newParent.estado} onChange={handleChange}>
                        <option value={1}>Activo</option>
                        <option value={0}>Inactivo</option>
                    </select>
                </div>
                )}

                <button type="submit" className="submit-btn"> 
                  {parentEditado ? "Actualizar" : "Invitar"} {/*Lo anterior es un verificador, donde ? comprueba si userEditado tiene datos o no, y así saber si actualizar o invitar */}
                </button>
            </form>
        </Modal>
                    
        </>
    );
};

export default Acudientes;