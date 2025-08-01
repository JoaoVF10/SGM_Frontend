import Button from "../form/Button";
import Campo from "../form/Campo";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useState } from "react";

export default function CadastroAluno() {
  const navigate = useNavigate();
  const [aluno, setAluno] = useState({});
  const [erro, setErro] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAluno((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/alunos", aluno);
      setAluno(response.data);
      navigate(-1);
    } catch (error) {
      console.error("Erro ao cadastrar aluno:", error);
      setErro("Erro ao cadastrar aluno");
    }
  };

  const rolesDisponiveis = [
    { value: "ROLE_DISCENTE", label: "Aluno" },
    { value: "ROLE_MONITOR", label: "Monitor" },
    { value: "ROLE_DOCENTE", label: "Professor" }, // cuidado com segurança!
    { value: "ROLE_COORDENADOR", label: "Coordenador" }, // cuidado com segurança!
  ];

  if (erro) return <div>{erro}</div>;

  return (
    <div className="flex justify-center items-center bg-gradient-custom min-h-screen">
      <div className="bg-white w-[74vw] max-w-[500px] min-w-[330px] max-h-[680px] border-2 border-primaria mx-auto mt-10 mb-10 p-6 rounded-[10px] shadow-2xl overflow-y-auto">
        <h1 className="text-2xl font-semibold mb-4">Cadastro</h1>
        <form onSubmit={handleSubmit}>
          <Campo
            autoComplete="username"
            label="Nome"
            name="nome"
            value={aluno.nome ?? ""}
            onChange={handleChange}
          />
          <Campo
            autoComplete="username"
            label="CPF"
            name="cpf"
            value={aluno.cpf ?? ""}
            onChange={handleChange}
          />
          <Campo
            autoComplete="username"
            label="E-mail"
            name="email"
            value={aluno.email ?? ""}
            onChange={handleChange}
          />
          <Campo
            autoComplete="username"
            label="E-mail Acadêmico"
            name="emailAcademico"
            value={aluno.emailAcademico ?? ""}
            onChange={handleChange}
          />
          <Campo
            autoComplete="username"
            label="Matrícula"
            name="matricula"
            value={aluno.matricula ?? ""}
            onChange={handleChange}
          />
          <Campo
            autoComplete="off"
            label="Instituição"
            name="instituicaoId"
            value={aluno.instituicaoId ?? ""}
            onChange={handleChange}
          />

          {/* Novo campo de seleção de perfil */}
          <div className="mb-4">
            <label htmlFor="role" className="block mb-1 font-semibold">
              Perfil
            </label>
            <select
              name="role"
              id="role"
              value={aluno.role ?? "ROLE_DISCENTE"}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              {rolesDisponiveis.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-center">
            <Button color="color" type="button" onClick={() => navigate("/")}>
              Cancelar
            </Button>
            <Button>Cadastrar</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
