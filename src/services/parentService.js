const API_BASE = "http://127.0.0.1:8000"; 

export const getParents = async () => {
  const res = await fetch(`${API_BASE}/parent/get-users/`);
  return await res.json();
};

export const getParentById = async (id_pfamilia) => {
  const res = await fetch(`${API_BASE}/parent/users/${id_pfamilia}`);
  return await res.json();
};

export const createParent = async (data) => {
  return await fetch(`${API_BASE}/parent/create-user/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};

export async function changeParentStatus(id_pfamilia, estado) {
  return await fetch(`${API_BASE}/parent/toggle_user_status/${id_pfamilia}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ estado }),
  });
}

export const updateParent = async (parent) => {
  const {id_pfamilia, nombre, correo, contraseña, telefono} =parent; 
  return await fetch(`${API_BASE}/parent/update_user/${id_pfamilia}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({id_pfamilia, nombre, correo, contraseña, telefono}),
  });
};