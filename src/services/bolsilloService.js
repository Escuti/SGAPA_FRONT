//1. Creación de servicios
const API_BASE = "http://127.0.0.1:8000"; //ESTA CONFIGURACION DEBE HACERSE CON VARIABLES DE ENTORNO A LA HORA DE USAR CONTENEDORES DOCKER

export const getBolsillos= async() =>{
    const response= await fetch(`${API_BASE}/bolsillo/get-bolsillos`)
    return await response.json();
}

export const createBolsillo= async(data)=>{
    const response= await fetch(`${API_BASE}/bolsillo/create-bolsillo`, {
        method : "POST",
        headers: {
            "Content-Type": "application/json",
          },
        body: JSON.stringify(data)
    })

    return response;
}