import { useEffect, useState } from "react";
import BtnAdd from "../../components/btn-add/BtnAdd";
import ContentHeader from "../../components/content-header/ContentHeader";
import DataTable from "react-data-table-component";
import Modal from "../../components/modal/Modal";
import Swal from "sweetalert2";
import TopBar from '../../components/topbar/TopBar';
import { getAssignments } from "../../services/assignmentService";
import { gradeRelCAL, getRelCAL } from "../../services/relCALService";

const CalificacionesDocente = () => {
  // Estados
  const [assignments, setAssignments] = useState([]);
  const [relCALs, setRelCALs] = useState([]); // Nuevo estado para relaciones de calificación
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [calificacion, setCalificacion] = useState({
    nota: null,
    feedback: "",
  });

  // Cargar actividades y relaciones de calificación
  const fetchData = async () => {
    try {
      const [assignmentsRes, relCALsRes] = await Promise.all([
        getAssignments(),
        getRelCAL()
      ]);
      setAssignments(assignmentsRes.data || []);
      setRelCALs(relCALsRes.data || []);
    } catch (error) {
      Swal.fire("Error", "No se pudieron cargar los datos", "error");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Verificador de estado (igual al que me mostraste)
  const hasGrade = (id_activid) => {
    const calificacion = relCALs.find(rel => 
      rel.actividFK === id_activid
    );
    return calificacion?.nota !== null && calificacion?.nota !== undefined;
  };

  // Cerrar modal y resetear estados
  const closeModal = () => {
    setShowModal(false);
    setSelectedAssignment(null);
    setCalificacion({ nota: null, feedback: "" });
  };

  // Manejador de cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCalificacion({
      ...calificacion,
      [name]: name === "nota" ? parseFloat(value) : value,
    });
  };

  // Enviar calificación a la API
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const relCALData = {
        estudFK: 0, 
        actividFK: selectedAssignment.id_activid,
        nota: parseFloat(calificacion.nota), 
        archivo_url: "", 
        comentario: "", 
        feedback: calificacion.feedback,
      };

      const res = await gradeRelCAL(relCALData);
      if (res.ok) {
        const data = await res.json();
        Swal.fire("Éxito", data.message, "success");
        fetchData(); // Actualizar ambos estados
        closeModal();
      } else {
        const errorData = await res.json();
        Swal.fire("Error", errorData.message, "error");
      }
    } catch (error) {
      Swal.fire("Error", "Ocurrió un error inesperado", "error");
    }
  };

  // Columnas del DataTable (con el verificador adaptado)
  const columns = [
    { name: "Título", selector: (row) => row.titulo, sortable: true },
    { name: "Descripción", selector: (row) => row.descripcion },
    { name: "Fecha", selector: (row) => new Date(row.fecha).toLocaleDateString() },
    {
      name: "Acciones",
      cell: (row) => (
        <span
          className={`badge ${hasGrade(row.id_activid) ? "badge-blue" : "badge-green"}`}
          onClick={() => {
            setSelectedAssignment(row);
            // Precargar datos si existe calificación
            const calificacionExistente = relCALs.find(rel => 
              rel.actividFK === row.id_activid
            );
            setCalificacion({
              nota: calificacionExistente?.nota || null,
              feedback: calificacionExistente?.feedback || "",
            });
            setShowModal(true);
          }}
          style={{ cursor: "pointer", padding: "5px 10px", borderRadius: "4px" }}
        >
          {hasGrade(row.id_activid) ? "Editar Nota" : "Calificar"}
        </span>
      ),
      ignoreRowClick: true,
    },
  ];

  return (
    <>
      <TopBar />
      <ContentHeader
        title={"Calificaciones"}
        paragraph={"Gestión de notas y feedback para actividades"}
      />
      <div className="table-container">
        <DataTable
          columns={columns}
          data={assignments}
          pagination
          highlightOnHover
        />
      </div>

      {/* Modal para calificar */}
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={selectedAssignment ? `Calificar: ${selectedAssignment.titulo}` : "Calificar Actividad"}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nota</label>
            <input
              type="number"
              name="nota"
              step="0.1"
              min="0"
              max="5"
              value={calificacion.nota || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Feedback</label>
            <textarea
              name="feedback"
              value={calificacion.feedback}
              onChange={handleChange}
              rows="3"
              required
            />
          </div>
          <button type="submit" className="submit-btn">
            {hasGrade(selectedAssignment?.id_activid) ? "Actualizar" : "Guardar"}
          </button>
        </form>
      </Modal>
    </>
  );
};

export default CalificacionesDocente;