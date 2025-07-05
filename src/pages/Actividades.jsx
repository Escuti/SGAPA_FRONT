import { useEffect, useState } from "react";
import BtnAdd from "../components/btn-add/BtnAdd";
import ContentHeader from "../components/content-header/ContentHeader";
import InputSearch from "../components/input-search/InputSearch";
import DataTable from "react-data-table-component";
import Modal from "../components/modal/Modal"
import Swal from "sweetalert2"

//Importanción de servicios de la API
import { getAssignments, createAssignment, updateAssignment } from "../services/assignmentService"; //definición de métodos o servicios a usar
import { getGroups } from "../services/groupService";
import { getSubjects } from "../services/subjectService";


//Configuración de Columnas

const Actividades =()=>{//recordar que los <></> iniciales, son un fragmento, lo cual exige react para declarar múltiples sentencias

    // Estado para mostrar u ocultar el modal
     const [showModal, setShowModal] = useState(false);
   
     // Estado para guardar la lista de colaboradores (usuarios)
     const [assignments, setAssignments] = useState([]);
     // Para diferenciar si giuardo o actualizo
     const [assignmentEditado, setAssignmentEditado] = useState([]); 

     //NOTA Para evitar error de carga del modal al editar y guardar, definir método closeModal
     // Llamarlo abajo en la línea 220, como se indica en comentario.

     const closeModal = () => {
        setShowModal(false); // Cierre el modal
        setAssignmentEditado(null); //Restablezca el estado
        setNewAssignment({ //Restablezca los campos
          titulo: "",
          descripcion: "",
          fecha: "",
          grupo: "",
          materias: ""
        });
      };
      
   
     // Estado para el formulario de un nuevo colaborador
     const [newAssignment, setNewAssignment] = useState({
        titulo: "",
        descripcion: "",
        fecha: "",
        grupo: "",
        materias: ""
     });

     const [groups, setGroups] = useState([]);
     const [subjects, setSubjects] = useState([]);

    //Función para obtener datos de actividades desde la API
    const fetchAssignments = async () => {
        try{
            const res= await getAssignments();
            setAssignments(res.data || []); // El || en JS significa or, y se asigna un array vacío en caso de que falle la petición
        }catch(error){
            Swal.fire("Error", "No se han podido cargar los usuarios", "error")
        }
    }
    //Función para traer grupos desde la API
    const fetchGroups = async () => {
            try {
                const res = await getGroups();
                console.log(res);
    
                if (res.success) {
                    setGroups(res.data);
                }
            } catch (error) {
                Swal.fire("Error", "No se han podido cargar los padres de familia", "error")
            }
        }
    
    const fetchSubjects = async () => {
            try {
                const res = await getSubjects();
                console.log(res);
    
                if (res.success) {
                    setSubjects(res.data);
                }
            } catch (error) {
                Swal.fire("Error", "No se han podido cargar los padres de familia", "error")
            }
        }
    useEffect(()=>{ //El useEffect es un hook de React que me permite ejecutar peticiones, como la de fetchUsers
        fetchAssignments();
        fetchGroups();
        fetchSubjects();
    }, []);
    //Config de columnas y rellenar con datos de API
    const columns=[
        {name: "Título", selector: row => row.titulo},
        {name: "Descripción", selector: row => row.descripcion},
        {name: "Fecha", selector: row => row.fecha},
        {name: "Grupo", selector: row => row.grupo},
        {name: "Materia", selector: row => row.materias},
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
       setNewAssignment({ ...newAssignment, [e.target.name]: e.target.value });
     };
   
     // Manejador para envío del formulario (crear usuario)
     const handleSubmit = async (e) => {
       e.preventDefault(); // Previene recarga de página
       try{
         if(assignmentEditado){
           const res= await updateAssignment({...newAssignment, id_activid: assignmentEditado.id_activid });
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
           const res= await createAssignment(newAssignment);
           if(res.ok){
             const data= await res.json();
             Swal.fire("Actividad creado", data.message, "success");
           }else{
             const dataError= await res.json();
             Swal.fire("Error", dataError.message, "error");
           }
         }
   
         setShowModal(false);
         setAssignmentEditado(null);
         setNewAssignment({
          titulo: "",
          descripcion: "",
          fecha: "",
          grupo: "",
          materias: ""
         });
         fetchAssignments(); // Actualizamos la tabla para ver los cambios reflejados
       }catch(error){
         Swal.fire("Error", "Ocurrió inesperado", "error");
       }
      
     };
   
   
     const handleEdit = (actividades) =>{
       setNewAssignment({
       titulo: actividades.titulo,
       descripcion: actividades.descripcion,
       fecha: actividades.fecha,
       grupo: actividades.grupo,
       materias: actividades.materias

       })
       setAssignmentEditado(actividades);
       setShowModal(true);
     }
   
    //Aquí hacia arriba manejo de servicios
    return(
        <>
        <ContentHeader
        title={"Actividades"}
        paragraph={"Lorem Ipsum"}></ContentHeader>
        <div className="content-search">
            <InputSearch></InputSearch>
            <BtnAdd 
                textButton="Crear Actividad" 
                onClick={()=>{
                    setShowModal(true);
                    }}></BtnAdd>
        </div>
        <div className="table-container">
            <DataTable
            columns={columns}
            data={assignments}
            pagination
            highlightOnHover>
            </DataTable>
        </div>

        <Modal
        isOpen={showModal}
        //onClose={()=> setShowModal(false)} remplazar esta línea
        onClose={closeModal} //por esta
        title={"Creación de Actividad"}>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Título</label>
                    <input type="text" name="titulo" value={newAssignment.titulo} onChange={handleChange}></input>
                </div>
                <div className="form-group">
                    <label>Descripción</label>
                    <input type="text" name="descripcion" value={newAssignment.descripcion} onChange={handleChange}></input>
                </div>
                <div className="form-group">
                    <label>Fecha</label>
                    <input type="text" name="fecha" value={newAssignment.fecha} onChange={handleChange}></input>
                </div>
                <div className="form-group">
                        <label>Grupo</label>

                        <select name="grupo" value={newAssignment.grupo} onChange={handleChange} required>
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
                        <label>Materia</label>

                        <select name="materias" value={newAssignment.materias} onChange={handleChange} required>
                            <option value="">Seleccione un grupo</option> 
                            {subjects.map((nombremat) => { 
                                return ( 
                                    <option key={nombremat.id_materia} value={nombremat.id_materia}>
                                        {nombremat.nombremat}
                                    </option>
                                ); //Aquí cierra
                            })}

                        </select>
                    </div>
                <button type="submit" className="submit-btn"> 
                  {assignmentEditado ? "Actualizar" : "Crear"} {/*Lo anterior es un verificador, donde ? comprueba si userEditado tiene datos o no, y así saber si actualizar o invitar */}
                </button>
            </form>
        </Modal>
                    
        </>
    );
};

export default Actividades;