const API_BASE = "http://127.0.0.1:8000";

export const uploadRelCAL = async (estudFK, actividFK, file, comentario) => {
  const formData = new FormData();
  formData.append("estudFK", estudFK.toString());
  formData.append("actividFK", actividFK.toString());
  formData.append("file", file);
  formData.append("comentario", comentario);

  const res = await fetch(`${API_BASE}/rel_score/upload-relCAL`, {
    method: "PUT",
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Error al subir la entrega");
  }

  return await res.json(); // { success, message, data }
};

export const gradeRelCAL = async (relCALData) => {
  return await fetch(`${API_BASE}/rel_score/grade-relCAL`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(relCALData),
  });
};

export const getRelCAL = async () => {
  const res = await fetch(`${API_BASE}/rel_score/get-relCAL/`);
  return await res.json();
};

export const getRelCALById = async (id_relCAL) => {
  const res = await fetch(`${API_BASE}/rel_score/get-relCAL-id/${id_relCAL}`);
  return await res.json();
};