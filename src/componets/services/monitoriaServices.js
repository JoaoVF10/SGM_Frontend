import api from "./api";

// Buscar todas as disciplinas
export const getDisciplinas = () => {
  return api.get("/disciplinas");
};

// Buscar todos os processos seletivos
export const getProcessosSeletivos = () => {
  return api.get("/processos-seletivos");
};
