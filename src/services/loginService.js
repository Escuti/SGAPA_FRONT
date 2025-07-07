const API_BASE = "http://127.0.0.1:8000";

export const loginUser = async (username, password) => {
  try {
    const res = await fetch(`${API_BASE}/userlog/login_user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Error en la autenticación");
    }

    const data = await res.json();
    return data;

  } catch (error) {
    console.error("Error en loginUser:", error);
    throw error;
  }
};