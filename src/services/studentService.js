//1. Creación de servicios
//La creación de servicios parte desde las rutas de la API
//No es necesario que el dato que se pasa, en este caso el id, se llame igual que en el servicio de la API (mas es preferible que así sea)
const API_BASE = "http://127.0.0.1:8000"; //ESTA CONFIGURACION DEBE HACERSE CON VARIABLES DE ENTORNO A LA HORA DE USAR CONTENEDORES DOCKER

export const getStudents = async () => {
  const res = await fetch(`${API_BASE}/student/get-users/`);
  return await res.json();
};

export const getStudentById = async (id_estud) => {
  const res = await fetch(`${API_BASE}/student/users/${id_estud}`);
  return await res.json();
};

export const createStudent = async (data) => {
  return await fetch(`${API_BASE}/student/create-user/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};

export async function changeStudentStatus(id_estud, estado) {
  return await fetch(`${API_BASE}/student/toggle_user_status/${id_estud}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ estado }),
  });
}

export const updateStudent = async (student) => {
  const {id_estud, nombre, usuario, contraseña, correo, telefono, grupo, padre_familia} =student; //De-estructuración de elementos, donde según el servicio solo tomo los datos necesarios
  return await fetch(`${API_BASE}/student/update_user/${id_estud}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({id_estud, nombre, usuario, contraseña, correo, telefono, grupo, padre_familia}),//No se envia el estado
  });
};