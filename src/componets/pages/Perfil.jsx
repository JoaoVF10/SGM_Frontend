import { useEffect, useState } from "react";
import api from "../services/api";  // seu axios já configurado
import Campo from "../form/Campo";   // componente de input estilizado
import ButtonSubmit from "../form/Button"; // botão estilizado

const niveisCurso = ["GRADUACAO", "TECNICO", "MESTRADO", "DOUTORADO", "OUTRO"];

export default function CursoForm() {
  const [curso, setCurso] = useState(null);
  const [form, setForm] = useState({
    nome: "",
    nivel: niveisCurso[0],
    duracao: 6,
    instituicaoId: "",
  });
  const [instituicoes, setInstituicoes] = useState([]);
  const [editando, setEditando] = useState(true);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    // Buscar instituições para dropdown
    api.get("/instituicoes")
      .then(res => {
        setInstituicoes(res.data);
        if (res.data.length > 0) setForm(f => ({ ...f, instituicaoId: res.data[0].id }));
      })
      .catch(err => {
        console.error("Erro ao carregar instituições:", err);
      });
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({
      ...f,
      [name]: name === "duracao" ? parseInt(value) : value,
    }));
  }

  function salvar() {

    const novoCurso = {
      nome: form.nome,
      nivel: form.nivel,
      duracao: form.duracao,
      instituicao: { id: form.instituicaoId }
    };

    api.post("/cursos", novoCurso)
      .then(res => {
        setCurso(res.data);
        setMensagem("Curso cadastrado com sucesso!");
        setEditando(false);
      })
      .catch(err => {
        console.error("Erro ao cadastrar curso:", err);
        setMensagem("Erro ao cadastrar curso.");
      });
  }

  if (instituicoes.length === 0) return <div className="text-center mt-10">Carregando instituições...</div>;

  return (
    <div className="max-w-[500px] w-[74vw] min-w-[330px] mx-auto mt-10 mb-10 p-6 rounded-2xl shadow-2xl border-2 border-primaria">
      <h2 className="text-2xl font-semibold mb-4">Cadastrar Curso</h2>

      <Campo
        label="Nome"
        name="nome"
        value={form.nome}
        onChange={handleChange}
        disabled={!editando}
      />

      <div className="mb-4">
        <label className="block mb-1 font-semibold">Nível</label>
        <select
          name="nivel"
          value={form.nivel}
          onChange={handleChange}
          disabled={!editando}
          className="w-full border border-gray-300 rounded px-2 py-1"
        >
          {niveisCurso.map(n => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>

      <Campo
        label="Duração (semestres)"
        name="duracao"
        type="number"
        min="1"
        value={form.duracao}
        onChange={handleChange}
        disabled={!editando}
      />

      <div className="mb-4">
        <label className="block mb-1 font-semibold">Instituição</label>
        <select
          name="instituicaoId"
          value={form.instituicaoId}
          onChange={handleChange}
          disabled={!editando}
          className="w-full border border-gray-300 rounded px-2 py-1"
        >
          {instituicoes.map(inst => (
            <option key={inst.id} value={inst.id}>{inst.nome}</option>
          ))}
        </select>
      </div>

      {mensagem && (
        <p className={`mb-4 ${mensagem.includes("sucesso") ? "text-green-600" : "text-red-600"}`}>
          {mensagem}
        </p>
      )}

      <div className="mt-6 flex justify-end gap-4">
        {editando ? (
          <>
            <ButtonSubmit
              type="button"
              color="gray"
              onClick={() => {
                setForm({
                  nome: "",
                  nivel: niveisCurso[0],
                  duracao: 6,
                  instituicaoId: instituicoes.length > 0 ? instituicoes[0].id : "",
                });
                setMensagem("");
              }}
              className="bg-gray-300 text-black px-4 py-2 rounded-lg"
            >
              Limpar
            </ButtonSubmit>
            <ButtonSubmit
              onClick={salvar}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Cadastrar
            </ButtonSubmit>
          </>
        ) : (
          <ButtonSubmit
            type="button"
            onClick={() => setEditando(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Editar
          </ButtonSubmit>
        )}
      </div>
    </div>
  );
}
