const API_BASE = "http://127.0.0.1:8000"; 

export const getAssignments = async () => {
  const res = await fetch(`${API_BASE}/assignments/get-assignments/`);
  return await res.json();
};

export const getAssignmentById = async (id_activid) => {
  const res = await fetch(`${API_BASE}/assignments/get-assignment/${id_activid}`);
  return await res.json();
};

export const createAssignment = async (data) => {
  const res = await fetch(`${API_BASE}/assignments/create-assignment/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Error al crear la actividad");
  }
  
  return await res.json(); // { success, message, data }
};

export const updateAssignment = async (assignment) => {
  const {id_activid, titulo, descripcion, fecha, grupo, materias} =assignment; 
  return await fetch(`${API_BASE}/assignments/update_assignment/${id_activid}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({id_activid, titulo, descripcion, fecha, grupo, materias}),
  });
};