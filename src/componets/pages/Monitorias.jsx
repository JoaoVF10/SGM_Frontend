import { useEffect, useState } from "react";
import MonitorCard from "../monitoria/MonitorCard";
import {
  fetchMonitorias,
  createMonitoria,
  updateMonitoria,
  deleteMonitoria,
} from "../monitoria/fetchMonitores";
import {
  getDisciplinas,
  getProcessosSeletivos,
} from "../services/monitoriaServices";
import { getCoordenadores } from "../services/coordenadorService";

export default function Monitorias() {
  const [monitores, setMonitores] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [processosSeletivos, setProcessosSeletivos] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    disciplinaId: "",
    professorId: "",
    processoSeletivoId: "",
    numeroVaga: "",
    numeroVagaBolsa: "",
    cargaHoraria: "",
  });

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [monitorias, profs, discs, processos] = await Promise.all([
          fetchMonitorias(),
          getCoordenadores(),
          getDisciplinas(),
          getProcessosSeletivos(),
        ]);
        setMonitores(monitorias);
        setProfessores(profs.data);
        setDisciplinas(discs.data);
        setProcessosSeletivos(processos.data);
      } catch (e) {
        setError(e.message || "Erro ao carregar dados.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    try {
      const payload = {
        ...formData,
        numeroVaga: parseInt(formData.numeroVaga),
        numeroVagaBolsa: parseInt(formData.numeroVagaBolsa),
        cargaHoraria: parseInt(formData.cargaHoraria),
      };

      if (editId === null) {
        const nova = await createMonitoria(payload);
        setMonitores((prev) => [...prev, nova]);
      } else {
        const atualizada = await updateMonitoria(editId, payload);
        setMonitores((prev) =>
          prev.map((m) => (m.id === editId ? atualizada : m))
        );
        setEditId(null);
      }

      resetForm();
    } catch (e) {
      setError(e.message || "Erro ao salvar monitoria.");
    }
  }

  function handleEdit(monitor) {
    setEditId(monitor.id);
    setFormData({
      disciplinaId: monitor.disciplinaResponseDTO?.id || "",
      professorId: monitor.professorResponseDTO?.id || "",
      processoSeletivoId: monitor.processoSeletivoResponseDTO?.id || "",
      numeroVaga: monitor.numeroVaga || "",
      numeroVagaBolsa: monitor.numeroVagaBolsa || "",
      cargaHoraria: monitor.cargaHoraria || "",
    });
  }

  async function handleDelete(id) {
    if (!window.confirm("Tem certeza que deseja excluir essa monitoria?")) return;

    try {
      await deleteMonitoria(id);
      setMonitores((prev) => prev.filter((m) => m.id !== id));
    } catch (e) {
      setError(e.message || "Erro ao excluir monitoria.");
    }
  }

  function resetForm() {
    setFormData({
      disciplinaId: "",
      professorId: "",
      processoSeletivoId: "",
      numeroVaga: "",
      numeroVagaBolsa: "",
      cargaHoraria: "",
    });
  }

  return (
    <div className="w-full flex flex-col justify-start items-center p-4">
      <h1 className="text-2xl font-bold mb-4 text-center pt-4">Monitorias</h1>

      <form
        onSubmit={handleSubmit}
        className="mb-6 w-[90vw] max-w-md flex flex-col gap-3"
      >
        <select
          name="professorId"
          value={formData.professorId}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        >
          <option value="">Selecione o Professor</option>
          {professores.map((prof) => (
            <option key={prof.id} value={prof.id}>
              {prof.nome}
            </option>
          ))}
        </select>

        <select
          name="disciplinaId"
          value={formData.disciplinaId}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        >
          <option value="">Selecione a Disciplina</option>
          {disciplinas.map((disc) => (
            <option key={disc.id} value={disc.id}>
              {disc.nome}
            </option>
          ))}
        </select>

        <select
          name="processoSeletivoId"
          value={formData.processoSeletivoId}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        >
          <option value="">Selecione o Processo Seletivo</option>
          {processosSeletivos.map((proc) => (
            <option key={proc.id} value={proc.id}>
              {proc.numero || `Processo ${proc.id}`}
            </option>
          ))}
        </select>

        <input
          type="number"
          name="numeroVaga"
          value={formData.numeroVaga}
          onChange={handleChange}
          placeholder="Número total de vagas"
          required
          className="border p-2 rounded"
        />

        <input
          type="number"
          name="numeroVagaBolsa"
          value={formData.numeroVagaBolsa}
          onChange={handleChange}
          placeholder="Número de vagas com bolsa"
          required
          className="border p-2 rounded"
        />

        <input
          type="number"
          name="cargaHoraria"
          value={formData.cargaHoraria}
          onChange={handleChange}
          placeholder="Carga horária semanal (horas)"
          required
          className="border p-2 rounded"
        />

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {editId === null ? "Criar Monitoria" : "Atualizar Monitoria"}
          </button>
          {editId !== null && (
            <button
              type="button"
              onClick={() => {
                resetForm();
                setEditId(null);
              }}
              className="px-4 py-2 border rounded"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {error && <p className="text-red-600 mb-4 font-semibold">Erro: {error}</p>}

      {loading ? (
        <p>Carregando monitorias...</p>
      ) : (
        <div className="flex flex-col gap-4 w-full max-w-lg">
          {monitores.length === 0 && <p>Nenhuma monitoria cadastrada.</p>}
          {monitores.map((monitor) => (
            <div
              key={monitor.id}
              className="flex items-center justify-between gap-4 border p-4 rounded shadow"
            >
              <div className="flex-1">
                <p><strong>Disciplina:</strong> {monitor.disciplinaResponseDTO?.nome}</p>
                <p><strong>Professor:</strong> {monitor.professorResponseDTO?.nome}</p>
                <p><strong>Processo:</strong> {monitor.processoSeletivoResponseDTO?.numero}</p>
                <p><strong>Vagas:</strong> {monitor.numeroVaga} (Bolsa: {monitor.numeroVagaBolsa})</p>
                <p><strong>Carga Horária:</strong> {monitor.cargaHoraria}h</p>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleEdit(monitor)}
                  className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(monitor.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
