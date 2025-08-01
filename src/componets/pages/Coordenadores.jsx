import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as coordenadorService from "../services/coordenadorService";
import Button from "../../componets/form/Button.jsx";

export default function Coordenadores() {
  const navigate = useNavigate();
  const [coordenadores, setCoordenadores] = useState([]);
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarCoordenadores();
  }, []);

  function carregarCoordenadores() {
    setCarregando(true);
    coordenadorService
      .getCoordenadores()
      .then((response) => {
        setCoordenadores(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar coordenadores:", error);
        setErro("Erro ao carregar a lista de coordenadores.");
      })
      .finally(() => {
        setCarregando(false);
      });
  }

  function deletar(id) {
    if (
      window.confirm(
        "Tem certeza que deseja remover o cargo deste coordenador? Ele voltará a ser apenas um professor."
      )
    ) {
      coordenadorService
        .deleteCoordenador(id)
        .then(() => {
          setCoordenadores(coordenadores.filter((c) => c.id !== id));
        })
        .catch((error) => {
          console.error("Erro ao remover cargo de coordenador:", error);
          alert("Erro ao remover o cargo do coordenador.");
        });
    }
  }

  if (carregando) return <p className="text-center mt-4">Carregando...</p>;
  if (erro) return <p className="text-red-500 text-center mt-4">{erro}</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gerenciar Coordenadores</h1>
        <Button onClick={() => navigate("/coordenadores/novo")}>
          Novo Coordenador
        </Button>
      </div>

      {coordenadores.length === 0 ? (
        <p>Nenhum coordenador cadastrado.</p>
      ) : (
        <table className="min-w-full border border-gray-300 rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border-b border-gray-300 text-left">Nome</th>
              <th className="p-3 border-b border-gray-300 text-left">Email</th>
              <th className="p-3 border-b border-gray-300 text-left">
                Cursos Coordenados
              </th>
              <th className="p-3 border-b border-gray-300 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {coordenadores.map((coord) => (
              <tr key={coord.id} className="hover:bg-gray-50">
                <td className="p-3 border-b border-gray-300">{coord.nome}</td>
                <td className="p-3 border-b border-gray-300">{coord.email}</td>
                <td className="p-3 border-b border-gray-300">
                  {coord.cursosResponseDTO && coord.cursosResponseDTO.length > 0
                    ? coord.cursosResponseDTO.map((curso) => curso.nome).join(", ")
                    : "Sem curso"}
                </td>
                <td className="p-3 border-b border-gray-300 text-center space-x-2">
                  <Button
                    onClick={() => navigate(`/coordenadores/editar/${coord.id}`)}
                    color="color"
                  >
                    Editar
                  </Button>
                  <Button onClick={() => deletar(coord.id)} color="red">
                    Excluir
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
