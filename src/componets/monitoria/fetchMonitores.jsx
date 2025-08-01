// monitoria/fetchMonitores.js

const BASE_URL = "http://localhost:8080/api/monitorias";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
}

export async function fetchMonitorias() {
  const res = await fetch(BASE_URL, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Erro ao buscar monitorias");
  return await res.json();
}

export async function createMonitoria(monitoria) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(monitoria),
  });
  if (!res.ok) throw new Error("Erro ao criar monitoria");
  return await res.json();
}

export async function updateMonitoria(id, monitoria) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(monitoria),
  });
  if (!res.ok) throw new Error("Erro ao atualizar monitoria");
  return await res.json();
}

export async function deleteMonitoria(id) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Erro ao excluir monitoria");
}
