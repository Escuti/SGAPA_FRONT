import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import TopBar from '../../components/topbar/TopBar';
import ContentHeader from '../../components/content-header/ContentHeader';
import { getStudentByParent } from '../../services/studentService';
import { getAssignments } from '../../services/assignmentService';
import { getRelCAL } from '../../services/relCALService';
import { getSubjects } from '../../services/subjectService';
import Swal from 'sweetalert2';

const SeguimientoEstudiante = () => {
  const [student, setStudent] = useState(null);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Obtener ID del padre
        const userData = JSON.parse(sessionStorage.getItem('userData'));
        if (!userData?.id_detalle) {
          throw new Error('Datos de usuario no encontrados');
        }

        // 2. Obtener estudiante asociado
        const studentsRes = await getStudentByParent(userData.id_detalle);
        if (!studentsRes.success || !studentsRes.data?.length) {
          throw new Error('No se encontró estudiante asociado');
        }
        const studentData = studentsRes.data[0];
        setStudent(studentData);

        // 3. Obtener TODOS los datos necesarios en paralelo
        const [gradesRes, assignmentsRes, subjectsRes] = await Promise.all([
          getRelCAL(),
          getAssignments(),
          getSubjects() // Nuevo request
        ]);

        // 4. Crear mapas para búsquedas rápidas
        const activitiesMap = assignmentsRes.data.reduce((map, activity) => {
          map[activity.id_activid] = {
            titulo: activity.titulo,
            materiaFK: activity.materias // FK a materias
          };
          return map;
        }, {});

        const subjectsMap = subjectsRes.data.reduce((map, subject) => {
          map[subject.id_materia] = subject.nombremat;
          return map;
        }, {});

        // 5. Filtrar y mapear calificaciones
        const studentGrades = gradesRes.data
          .filter(grade => grade.estudFK === studentData.id_estud)
          .map(grade => {
            const activity = activitiesMap[grade.actividFK] || {};
            return {
              ...grade,
              actividad_titulo: activity.titulo || 'Sin título',
              materia_nombre: subjectsMap[activity.materiaFK] || 'Sin materia'
            };
          });

        setGrades(studentGrades);

      } catch (error) {
        Swal.fire('Error', error.message, 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Columnas actualizadas (sin fecha, con materia)
  const columns = [
    {
      name: 'Actividad',
      selector: row => row.actividad_titulo,
      sortable: true,
      grow: 2
    },
    {
      name: 'Materia',
      selector: row => row.materia_nombre,
      sortable: true,
      width: '200px'
    },
    {
      name: 'Nota',
      selector: row => row.nota?.toFixed(1) || 'Sin calificar',
      sortable: true,
      center: true,
      grow: 3
    },
    {
      name: 'Feedback',
      selector: row => row.feedback || 'Sin feedback',
      wrap: true,
      width: '120px'
    }
  ];

  return (
    <>
      <TopBar />
      <ContentHeader
        title="Seguimiento Académico"
        paragraph={student ? `Notas de ${student.nombre}` : 'Cargando...'}
      />

      <div className="table-container" style={{ padding: '0 20px' }}>
        <DataTable
          columns={columns}
          data={grades}
          pagination
          progressPending={loading}
          noDataComponent={
            <div style={{ padding: '40px', textAlign: 'center' }}>
              {loading ? 'Cargando calificaciones...' : 'No se encontraron registros'}
            </div>
          }
          highlightOnHover
        />
      </div>
    </>
  );
};

export default SeguimientoEstudiante;