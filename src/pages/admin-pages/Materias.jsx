import { useEffect, useState } from "react";
import BtnAdd from "../../components/btn-add/BtnAdd";
import ContentHeader from "../../components/content-header/ContentHeader";
import InputSearch from "../../components/input-search/InputSearch";
import DataTable from "react-data-table-component";
import Modal from "../../components/modal/Modal"
import Swal from "sweetalert2"
import TopBar from '../../components/topbar/TopBar'

//Importanción de servicios de la API
import { getSubjects, createSubject, updateSubject } from "../../services/subjectService"; //definición de métodos o servicios a usar


//Configuración de Columnas

const Materias =()=>{//recordar que los <></> iniciales, son un fragmento, lo cual exige react para declarar múltiples sentencias

    // Estado para mostrar u ocultar el modal
     const [showModal, setShowModal] = useState(false);
   
     // Estado para guardar la lista de colaboradores (usuarios)
     const [subjects, setSubjects] = useState([]);
     // Para diferenciar si giuardo o actualizo
     const [subjectEditado, setSubjectEditado] = useState([]); 

     //NOTA Para evitar error de carga del modal al editar y guardar, definir método closeModal
     // Llamarlo abajo en la línea 220, como se indica en comentario.

     const closeModal = () => {
        setShowModal(false); // Cierre el modal
        setSubjectEditado(null); //Restablezca el estado
        setNewSubject({ //Restablezca los campos
          nombremat: "",
        });
      };
      
   
     // Estado para el formulario de un nuevo colaborador
     const [newSubject, setNewSubject] = useState({
        nombremat: "",
     });

    //Función para obtener datos de materias desde la API
    const fetchSubjects = async () => {
        try{
            const res= await getSubjects();
            setSubjects(res.data || []); // El || en JS significa or, y se asigna un array vacío en caso de que falle la petición
        }catch(error){
            Swal.fire("Error", "No se han podido cargar las materias", "error")
        }
    }
    useEffect(()=>{ //El useEffect es un hook de React que me permite ejecutar peticiones, como la de fetchUsers
        fetchSubjects();
    }, []);
    //Config de columnas y rellenar con datos de API
    const columns=[
        {name: "Materia", selector: row => row.nombremat},
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
       setNewSubject({ ...newSubject, [e.target.name]: e.target.value });
     };
   
     // Manejador para envío del formulario (crear usuario)
     const handleSubmit = async (e) => {
       e.preventDefault(); // Previene recarga de página
       try{
         if(subjectEditado){
           const res= await updateSubject({...newSubject, id_materia: subjectEditado.id_materia });
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
           const res= await createSubject(newSubject);
           if(res.ok){
             const data= await res.json();
             Swal.fire("Materia creada", data.message, "success");
           }else{
             const dataError= await res.json();
             Swal.fire("Error", dataError.message, "error");
           }
         }
   
         setShowModal(false);
         setSubjectEditado(null);
         setNewSubject({
          nombremat: "",
         });
         fetchSubjects(); // Actualizamos la tabla para ver los cambios reflejados
       }catch(error){
         Swal.fire("Error", "Ocurrió inesperado", "error");
       }
      
     };
   
   
     const handleEdit = (materias) =>{
       setNewSubject({
       nombremat: materias.nombremat
       })
       setSubjectEditado(materias);
       setShowModal(true);
     }
   
    //Aquí hacia arriba manejo de servicios
    return(
        <>
        <TopBar></TopBar>
        <ContentHeader
        title={"Materias"}
        paragraph={"Gestiona todas las materias"}></ContentHeader>
        <div className="content-search">
            <InputSearch></InputSearch>
            <BtnAdd 
                textButton="Crear Materia" 
                onClick={()=>{
                    setShowModal(true);
                    }}></BtnAdd>
        </div>
        <div className="table-container">
            <DataTable
            columns={columns}
            data={subjects}
            pagination
            highlightOnHover>
            </DataTable>
        </div>

        <Modal
        isOpen={showModal}
        //onClose={()=> setShowModal(false)} remplazar esta línea
        onClose={closeModal} //por esta
        title={"Creación de Materia"}>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Materia</label>
                    <input type="text" name="nombremat" value={newSubject.nombremat} onChange={handleChange}></input>
                </div>

                <button type="submit" className="submit-btn"> 
                  {subjectEditado ? "Actualizar" : "Crear"} {/*Lo anterior es un verificador, donde ? comprueba si userEditado tiene datos o no, y así saber si actualizar o invitar */}
                </button>
            </form>
        </Modal>
                    
        </>
    );
};

export default Materias;