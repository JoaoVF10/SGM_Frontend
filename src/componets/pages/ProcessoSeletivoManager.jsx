import React from "react";
import processoService from "../services/processoSeletivoServices";
import instituicaoService from "../services/instituicaoService";
import Button from "../form/Button";
import Campo from "../form/Campo";

class ProcessoSeletivoManager extends React.Component {
  state = {
    processos: [],
    instituicoes: [],
    form: {
      id: null,
      inicio: "",
      fim: "",
      numero: "",
      instituicaoId: "",
    },
    showForm: false,
    isEditMode: false,
    showDeleteModal: false,
    deleteId: null,
    erros: "",
    loading: false,
  };

  componentDidMount() {
    this.carregarDados();
  }

  carregarDados = () => {
    this.setState({ loading: true, erros: "" });
    const token = localStorage.getItem("token");

    Promise.all([
      processoService.listarTodos(token),
      instituicaoService.getInstituicoes(token),
    ])
      .then(([processosRes, instituicoesRes]) => {
        this.setState({
          processos: processosRes,
          instituicoes: instituicoesRes,
          loading: false,
        });
      })
      .catch(() => {
        this.setState({ erros: "Erro ao carregar dados", loading: false });
      });
  };

  abrirForm = (processo = null) => {
    if (processo) {
      this.setState({
        form: {
          id: processo.id,
          inicio: processo.inicio,
          fim: processo.fim,
          numero: processo.numero,
          instituicaoId: processo.instituicaoResponseDTO?.id || "",
        },
        isEditMode: true,
        showForm: true,
        erros: "",
      });
    } else {
      this.setState({
        form: {
          id: null,
          inicio: "",
          fim: "",
          numero: "",
          instituicaoId: "",
        },
        isEditMode: false,
        showForm: true,
        erros: "",
      });
    }
  };

  fecharForm = () => {
    this.setState({ showForm: false, erros: "" });
  };

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState((prev) => ({
      form: { ...prev.form, [name]: value },
    }));
  };

  salvarProcesso = (e) => {
    e.preventDefault();
    const { form, isEditMode } = this.state;
    const token = localStorage.getItem("token");

    const payload = {
      inicio: form.inicio,
      fim: form.fim,
      numero: form.numero,
      instituicaoId: Number(form.instituicaoId),
    };

    const acao = isEditMode
      ? processoService.atualizar(form.id, payload, token)
      : processoService.criar(payload, token);

    acao
      .then(() => {
        this.carregarDados();
        this.fecharForm();
      })
      .catch((err) => {
        this.setState({
          erros: err.response?.data?.message || "Erro ao salvar processo",
        });
      });
  };

  abrirDeleteModal = (id) => {
    this.setState({ showDeleteModal: true, deleteId: id });
  };

  fecharDeleteModal = () => {
    this.setState({ showDeleteModal: false, deleteId: null });
  };

  confirmarExclusao = () => {
    const token = localStorage.getItem("token");
    processoService
      .deletar(this.state.deleteId, token)
      .then(() => {
        this.carregarDados();
        this.fecharDeleteModal();
      })
      .catch(() => {
        this.setState({ erros: "Erro ao excluir processo" });
        this.fecharDeleteModal();
      });
  };

  render() {
    const {
      processos,
      instituicoes,
      form,
      showForm,
      isEditMode,
      showDeleteModal,
      erros,
      loading,
    } = this.state;

    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Gerenciar Processos Seletivos</h1>

        {erros && <p className="text-red-600 mb-4">{erros}</p>}

        {!showForm && (
          <>
            <Button onClick={() => this.abrirForm()}>Novo Processo</Button>

            {loading ? (
              <p>Carregando...</p>
            ) : (
              <table className="w-full border-collapse border border-gray-300 mt-4">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2">Número</th>
                    <th className="border p-2">Início</th>
                    <th className="border p-2">Fim</th>
                    <th className="border p-2">Instituição</th>
                    <th className="border p-2">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {processos.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="border p-2">{p.numero}</td>
                      <td className="border p-2">{p.inicio}</td>
                      <td className="border p-2">{p.fim}</td>
                      <td className="border p-2">
                        {p.instituicaoResponseDTO?.nome || "N/A"}
                      </td>
                      <td className="border p-2 space-x-2">
                        <Button onClick={() => this.abrirForm(p)}>Editar</Button>
                        <Button
                          color="red"
                          onClick={() => this.abrirDeleteModal(p.id)}
                        >
                          Excluir
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}

        {showForm && (
          <form
            onSubmit={this.salvarProcesso}
            className="border p-6 rounded shadow mt-6 max-w-xl mx-auto"
          >
            <h2 className="text-2xl font-bold mb-4">
              {isEditMode ? "Editar Processo" : "Novo Processo"}
            </h2>

            <Campo
              label="Número"
              name="numero"
              value={form.numero}
              onChange={this.handleInputChange}
              required
            />
            <Campo
              label="Data de Início"
              name="inicio"
              type="date"
              value={form.inicio}
              onChange={this.handleInputChange}
              required
            />
            <Campo
              label="Data de Fim"
              name="fim"
              type="date"
              value={form.fim}
              onChange={this.handleInputChange}
              required
            />

            <div className="mb-4">
              <label className="block mb-1 text-gray-600">Instituição</label>
              <select
                name="instituicaoId"
                value={form.instituicaoId}
                onChange={this.handleInputChange}
                className="p-2 border rounded w-full"
                required
              >
                <option value="">Selecione uma instituição</option>
                {instituicoes.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-center gap-2">
              <Button type="button" color="gray" onClick={this.fecharForm}>
                Cancelar
              </Button>
              <Button type="submit">{isEditMode ? "Atualizar" : "Salvar"}</Button>
            </div>
          </form>
        )}

        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow-lg relative max-w-md w-full">
              <button
                onClick={this.fecharDeleteModal}
                className="absolute top-2 right-2 text-gray-600"
              >
                ×
              </button>
              <h2 className="text-xl font-bold mb-4">Confirmar Exclusão</h2>
              <p>Deseja realmente excluir este processo seletivo?</p>
              <div className="flex justify-end gap-2 mt-4">
                <Button color="gray" onClick={this.fecharDeleteModal}>
                  Cancelar
                </Button>
                <Button color="red" onClick={this.confirmarExclusao}>
                  Excluir
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default ProcessoSeletivoManager;
