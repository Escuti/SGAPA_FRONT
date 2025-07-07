import { useEffect, useState } from "react";
import BtnAdd from "../components/btn-add/BtnAdd";
import ContentHeader from "../components/content-header/ContentHeader";
import InputSearch from "../components/input-search/InputSearch";
import DataTable from "react-data-table-component";
import Modal from "../components/modal/Modal"
import Swal from "sweetalert2"
import TopBar from '../components/topbar/TopBar'

//Importanción de servicios de la API
import { getGroups, createGroup, updateGroup } from "../services/groupService"; //definición de métodos o servicios a usar


//Configuración de Columnas

const Grupos =()=>{//recordar que los <></> iniciales, son un fragmento, lo cual exige react para declarar múltiples sentencias

    // Estado para mostrar u ocultar el modal
     const [showModal, setShowModal] = useState(false);
   
     // Estado para guardar la lista de colaboradores (usuarios)
     const [groups, setGroups] = useState([]);
     // Para diferenciar si giuardo o actualizo
     const [groupEditado, setGroupEditado] = useState([]); 

     //NOTA Para evitar error de carga del modal al editar y guardar, definir método closeModal
     // Llamarlo abajo en la línea 220, como se indica en comentario.

     const closeModal = () => {
        setShowModal(false); // Cierre el modal
        setGroupEditado(null); //Restablezca el estado
        setNewGroup({ //Restablezca los campos
          Grup0: "",
        });
      };
      
   
     // Estado para el formulario de un nuevo colaborador
     const [newGroup, setNewGroup] = useState({
        Grup0: "",
     });

    //Función para obtener datos de usuarios desde la API
    const fetchGroups = async () => {
        try{
            const res= await getGroups();
            setGroups(res.data || []); // El || en JS significa or, y se asigna un array vacío en caso de que falle la petición
        }catch(error){
            Swal.fire("Error", "No se han podido cargar los usuarios", "error")
        }
    }
    useEffect(()=>{ //El useEffect es un hook de React que me permite ejecutar peticiones, como la de fetchUsers
        fetchGroups();
    }, []);
    //Config de columnas y rellenar con datos de API
    const columns=[
        {name: "Grupo", selector: row => row.grupo},
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
             </div>
           ),
           ignoreRowClick: true,
           allowoverflow: true,
           button: "true",
         }
    ]

    // Manejador para cambios en los inputs del formulario
     const handleChange = (e) => {
       setNewGroup({ ...newGroup, [e.target.name]: e.target.value });
     };
   
     // Manejador para envío del formulario (crear usuario)
     const handleSubmit = async (e) => {
       e.preventDefault(); // Previene recarga de página
       try{
         if(groupEditado){
           const res= await updateGroup({...newGroup, id_grupo: groupEditado.id_grupo });
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
           const res= await createGroup(newGroup);
           if(res.ok){
             const data= await res.json();
             Swal.fire("Grupo creado", data.message, "success");
           }else{
             const dataError= await res.json();
             Swal.fire("Error", dataError.message, "error");
           }
         }
   
         setShowModal(false);
         setGroupEditado(null);
         setNewGroup({
          Grup0: "",
         });
         fetchGroups(); // Actualizamos la tabla para ver los cambios reflejados
       }catch(error){
         Swal.fire("Error", "Ocurrió inesperado", "error");
       }
      
     };
   
   
     const handleEdit = (grupo) =>{
       setNewGroup({
       Grup0: grupo.Grup0
       })
       setGroupEditado(grupo);
       setShowModal(true);
     }
   
    //Aquí hacia arriba manejo de servicios
    return(
        <>
        <TopBar></TopBar>
        <ContentHeader
        title={"Grupos"}
        paragraph={"Lorem Ipsum"}></ContentHeader>
        <div className="content-search">
            <InputSearch></InputSearch>
            <BtnAdd 
                textButton="Crear Grupo" 
                onClick={()=>{
                    setShowModal(true);
                    }}></BtnAdd>
        </div>
        <div className="table-container">
            <DataTable
            columns={columns}
            data={groups}
            pagination
            highlightOnHover>
            </DataTable>
        </div>

        <Modal
        isOpen={showModal}
        //onClose={()=> setShowModal(false)} remplazar esta línea
        onClose={closeModal} //por esta
        title={"Creación de Grupo"}>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Grupo</label>
                    <input type="text" name="grupo" value={newGroup.grupo} onChange={handleChange}></input>
                </div>

                <button type="submit" className="submit-btn"> 
                  {groupEditado ? "Actualizar" : "Crear"} {/*Lo anterior es un verificador, donde ? comprueba si userEditado tiene datos o no, y así saber si actualizar o invitar */}
                </button>
            </form>
        </Modal>
                    
        </>
    );
};

export default Grupos;