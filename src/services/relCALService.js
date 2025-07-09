const API_BASE = "http://127.0.0.1:8000";

export const uploadRelCAL = async (file, estudFK, actividFK, comentario) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("estudFK", estudFK.toString());
  formData.append("actividFK", actividFK.toString());
  formData.append("comentario", comentario);

  try {
    const res = await fetch(`${API_BASE}/upload-relCAL`, {
      method: "POST",
      body: formData, // ¡No headers Content-Type para FormData!
    });
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  } catch (error) {
    console.error("Error en uploadRelCAL:", error);
    throw error;
  }
};

export const gradeRelCAL = async (relCALData) => {
  return await fetch(`${API_BASE}/grade-relCAL`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(relCALData),
  });
};

// Opcional: Métodos para listar entregas si los necesitas
export const getRelCALByStudent = async (estudFK) => {
  const res = await fetch(`${API_BASE}/rel-calificacion/estudiante/${estudFK}`);
  return await res.json();
};