const API_BASE = "http://127.0.0.1:8000"; //ESTA CONFIGURACION DEBE HACERSE CON VARIABLES DE ENTORNO A LA HORA DE USAR CONTENEDORES DOCKER

export const getProfessors = async () => {
  const res = await fetch(`${API_BASE}/professor/get-users/`);
  return await res.json();
};

export const getProfessorById = async (id_doc) => {
  const res = await fetch(`${API_BASE}/professor/users/${id_doc}`);
  return await res.json();
};

export const createProfessor = async (data) => {
  return await fetch(`${API_BASE}/professor/create-user/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};

export async function changeProfessorStatus(id_doc, estado) {
  return await fetch(`${API_BASE}/professor/toggle_user_status/${id_doc}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ estado }),
  });
}

export const updateProfessor = async (professor) => {
  const {id_doc, nombre, usuario, correo, contraseña, telefono} =professor;
  return await fetch(`${API_BASE}/professor/update_user/${id_doc}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({id_doc, nombre, usuario, correo, contraseña, telefono}),
  });
};