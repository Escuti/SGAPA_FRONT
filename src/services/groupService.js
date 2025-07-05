const API_BASE = "http://127.0.0.1:8000"; 

export const getGroups = async () => {
  const res = await fetch(`${API_BASE}/groups/get-groups/`);
  return await res.json();
};

export const getGroupById = async (id_grupo) => {
  const res = await fetch(`${API_BASE}/groups/get-group/${id_grupo}`);
  return await res.json();
};

export const createGroup = async (data) => {
  return await fetch(`${API_BASE}/groups/create-group/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};

export const updateGroup = async (group) => {
  const {id_grupo, grupo} =group; 
  return await fetch(`${API_BASE}/groups/update_group/${id_grupo}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({id_grupo, grupo}),
  }); //PODRÍA PRESENTAR FALLOS CON EL ENDPOINT POR PARÁMETRO "user"
};