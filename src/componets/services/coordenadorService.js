import api from "./api";

const API_URL = "/professores/coordenadores";

export const getCoordenadores = () => {
  return api.get(API_URL);
};

export const createCoordenador = (coordenadorData) => {
  return api.post("/professores", coordenadorData);  // <-- rota correta
};

export const getCoordenadorById = (id) => {
  return api.get(`${API_URL}/${id}`);
};

export const updateCoordenador = (id, coordenadorData) => {
   return api.put(`/professores/${id}`, coordenadorData);
};

export const deleteCoordenador = (id) => {
  return api.delete(`${API_URL}/${id}`);
};

export const getCursos = () => {
  return api.get("/cursos");
};

export const getInstituicoes = () => {
  return api.get("/instituicoes");
};
