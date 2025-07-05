const API_BASE = "http://127.0.0.1:8000"; 

export const getSubjects = async () => {
  const res = await fetch(`${API_BASE}/subjects/get-subjects/`);
  return await res.json();
};

export const getSubjectById = async (id_materia) => {
  const res = await fetch(`${API_BASE}/subjects/get-subject/${id_materia}`);
  return await res.json();
};

export const createSubject = async (data) => {
  return await fetch(`${API_BASE}/subjects/create-subject/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};

export const updateSubject = async (subject) => {
  const {id_materia, nombremat} =subject; 
  return await fetch(`${API_BASE}/subjects/update_subject/${id_materia}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({id_materia, nombremat}),
  });
};