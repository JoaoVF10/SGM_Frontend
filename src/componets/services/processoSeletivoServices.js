import api from "./api"; // sua instância axios

const listarTodos = (token) => {
  return api
    .get("/processos-seletivos", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => res.data);
};

const criar = (data, token) => {
  return api.post("/processos-seletivos", data, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(res => res.data);
};

const atualizar = (id, data, token) => {
  return api.put(`/processos-seletivos/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(res => res.data);
};

const deletar = (id, token) => {
  return api.delete(`/processos-seletivos/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(res => res.data);
};

export default {
  listarTodos,
  criar,
  atualizar,
  deletar,
};
