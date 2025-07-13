import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import Modal from "../../components/modal/Modal";
import Swal from "sweetalert2";
import TopBar from '../../components/topbar/TopBar';
import ContentHeader from "../../components/content-header/ContentHeader";
import BtnAdd from "../../components/btn-add/BtnAdd";

// Servicios
import { getAssignments } from "../../services/assignmentService";
import { uploadRelCAL, getRelCAL } from "../../services/relCALService";

const EntregaEstudiante = () => {
  // Estados
  const [assignments, setAssignments] = useState([]);
  const [relCALs, setRelCALs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [file, setFile] = useState(null);
  const [comentario, setComentario] = useState("");
  const [estudFK, setEstudFK] = useState(null);

  // Obtener datos del estudiante logueado desde sessionStorage
  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    if (userData && userData.id_detalle) {
      setEstudFK(userData.id_detalle); // Asignar id_detalle como estudFK
    }
  }, []);

  // Cargar actividades y entregas
  const fetchData = async () => {
    try {
      const assignmentsRes = await getAssignments();
      setAssignments(assignmentsRes.data || []);

      const relCALRes = await getRelCAL();
      setRelCALs(relCALRes.data || []);
    } catch (error) {
      Swal.fire("Error", "No se pudieron cargar los datos", "error");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Verificar si ya existe una entrega para una actividad
  const hasSubmission = (id_activid) => {
  const entrega = relCALs.find(rel => 
    rel.actividFK === id_activid
  );
  
  // Verificar si existe y tiene archivo_url válido
  return entrega?.archivo_url !== null && 
         entrega?.archivo_url !== undefined && 
         entrega?.archivo_url !== "";
};

  // Manejador para subir/editar entrega
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !selectedAssignment || !estudFK) {
      Swal.fire("Error", "Faltan datos requeridos", "error");
      return;
    }

    try {
      const res = await uploadRelCAL(estudFK, selectedAssignment.id_activid, file, comentario);
      if (res.success) {
        Swal.fire("Éxito", res.message, "success");
        setShowModal(false);
        fetchData(); // Actualizar tabla
      }
    } catch (error) {
      Swal.fire("Error", error.message || "Error al subir la entrega", "error");
    }
  };

  // Configuración de columnas para DataTable
  const columns = [
    { name: "Título", selector: row => row.titulo },
    { name: "Descripción", selector: row => row.descripcion },
    { name: "Fecha", selector: row => new Date(row.fecha).toLocaleDateString() },
    {
      name: "Acciones",
      cell: row => (
        <span 
          className={`badge ${hasSubmission(row.id_activid) ? "badge-blue" : "badge-green"}`}
          onClick={() => {
            setSelectedAssignment(row);
            setShowModal(true);
          }}
          style={{ cursor: "pointer" }} // Para mantener el efecto clickeable
        >
          {hasSubmission(row.id_activid) ? "Editar Entrega" : "Subir Entrega"}
        </span>
      ),
      ignoreRowClick: true,
    }
  ];

  return (
    <>
      <TopBar />
      <ContentHeader
        title={"Entregas de Actividades"}
        paragraph={"Sube o edita tus entregas aquí"}
      />
      <div className="table-container">
        <DataTable
          columns={columns}
          data={assignments}
          pagination
          highlightOnHover
        />
      </div>

      {/* Modal para subir/editar entrega */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedAssignment(null);
          setFile(null);
          setComentario("");
        }}
        title={selectedAssignment ? `Entrega: ${selectedAssignment.titulo}` : "Subir Entrega"}
      >
        <form onSubmit={handleUpload}>
          <div className="form-group">
            <label>Archivo</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              required
            />
          </div>
          <div className="form-group">
            <label>Comentario</label>
            <textarea
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="Opcional"
            />
          </div>
          <button type="submit" className="submit-btn">
            {hasSubmission(selectedAssignment?.id_activid) ? "Actualizar" : "Subir"}
          </button>
        </form>
      </Modal>
    </>
  );
};

export default EntregaEstudiante; 