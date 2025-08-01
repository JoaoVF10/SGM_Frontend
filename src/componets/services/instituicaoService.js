import axios from "axios";

// URL base da API para instituições
const API_URL = "http://localhost:8080/api/instituicoes";

const instituicaoService = {
  // Buscar todas as instituições, recebendo token para autenticação
  getInstituicoes: async (token) => {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // retorna só os dados da resposta
  },
};

export default instituicaoService;
