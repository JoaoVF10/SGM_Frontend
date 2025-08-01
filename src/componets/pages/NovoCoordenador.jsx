import React from "react";
import * as coordenadorService from "../services/coordenadorService";
import Button from "../form/Button.jsx";
import Campo from "../form/Campo.jsx";

class CoordenadorManager extends React.Component {
  state = {
    coordenadores: [],
    instituicoes: [],
    cursos: [],
    erros: "",
    loading: false,

    // Form state
    form: {
      id: null,
      nome: "",
      cpf: "",
      email: "",
      emailAcademico: "",
      matricula: "",
      instituicaoId: "",
      cursosId: [],
      senha: "",
    },

    // UI state
    showForm: false,
    isEditMode: false,
    showDeleteModal: false,
    deleteId: null,
  };

  componentDidMount() {
    this.carregarDados();
  }

  carregarDados = () => {
    this.setState({ loading: true, erros: "" });

    Promise.all([
      coordenadorService.getCoordenadores(),
      coordenadorService.getInstituicoes(),
      coordenadorService.getCursos(),
    ])
      .then(([coordenadoresRes, instituicoesRes, cursosRes]) => {
        this.setState({
          coordenadores: coordenadoresRes.data,
          instituicoes: instituicoesRes.data,
          cursos: cursosRes.data,
          loading: false,
        });
      })
      .catch(() => {
        this.setState({ erros: "Erro ao carregar dados", loading: false });
      });
  };

  abrirForm = (coordenador = null) => {
    if (coordenador) {
      // editar
      this.setState({
        form: {
          id: coordenador.id,
          nome: coordenador.nome || "",
          cpf: coordenador.cpf || "",
          email: coordenador.email || "",
          emailAcademico: coordenador.emailAcademico || "",
          matricula: coordenador.matricula || "",
          instituicaoId: coordenador.instituicaoResponseDTO?.id || "",
          cursosId: coordenador.cursosResponseDTO?.map(c => c.id) || [],
          senha: "",
        },
        isEditMode: true,
        showForm: true,
        erros: "",
      });
    } else {
      // novo
      this.setState({
        form: {
          id: null,
          nome: "",
          cpf: "",
          email: "",
          emailAcademico: "",
          matricula: "",
          instituicaoId: "",
          cursosId: [],
          senha: "",
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

  abrirDeleteModal = (id) => {
    this.setState({ showDeleteModal: true, deleteId: id });
  };

  fecharDeleteModal = () => {
    this.setState({ showDeleteModal: false, deleteId: null });
  };

  handleInputChange = (e) => {
    const { name, value, type, checked, options } = e.target;

    if (type === "select-multiple") {
      const selected = Array.from(options).filter(o => o.selected).map(o => Number(o.value));
      this.setState(prev => ({ form: { ...prev.form, [name]: selected } }));
    } else if (type === "checkbox") {
      this.setState(prev => ({ form: { ...prev.form, [name]: checked } }));
    } else {
      this.setState(prev => ({ form: { ...prev.form, [name]: value } }));
    }
  };

  salvarCoordenador = (e) => {
    e.preventDefault();
    const { form, isEditMode } = this.state;

    const payload = {
      nome: form.nome,
      cpf: form.cpf,
      email: form.email,
      emailAcademico: form.emailAcademico,
      matricula: form.matricula,
      instituicaoId: Number(form.instituicaoId),
      cursosId: form.cursosId,
      senha: form.senha,
    };

    if (isEditMode && form.id) {
      coordenadorService.updateCoordenador(form.id, payload)
        .then(() => {
          this.carregarDados();
          this.fecharForm();
        })
        .catch(err => {
          this.setState({ erros: err.response?.data?.message || "Erro ao atualizar coordenador" });
        });
    } else {
      coordenadorService.createCoordenador(payload)
        .then(() => {
          this.carregarDados();
          this.fecharForm();
        })
        .catch(err => {
          this.setState({ erros: err.response?.data?.message || "Erro ao criar coordenador" });
        });
    }
  };

  confirmarExclusao = () => {
    coordenadorService.deleteCoordenador(this.state.deleteId)
      .then(() => {
        this.carregarDados();
        this.fecharDeleteModal();
      })
      .catch(() => {
        this.setState({ erros: "Erro ao excluir coordenador" });
        this.fecharDeleteModal();
      });
  };

  render() {
    const {
      coordenadores, instituicoes, cursos, erros, loading,
      form, showForm, isEditMode, showDeleteModal,
    } = this.state;

    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Gerenciar Coordenadores</h1>

        {erros && <p className="text-red-600 mb-4">{erros}</p>}

        {!showForm && (
          <>
            <Button onClick={() => this.abrirForm()}>Novo Coordenador</Button>

            {loading ? (
              <p>Carregando...</p>
            ) : (
              <table className="w-full border-collapse border border-gray-300 mt-4">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2">Nome</th>
                    <th className="border border-gray-300 p-2">Email</th>
                    <th className="border border-gray-300 p-2">Instituição</th>
                    <th className="border border-gray-300 p-2">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {coordenadores.map(c => (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 p-2">{c.nome}</td>
                      <td className="border border-gray-300 p-2">{c.email}</td>
                      <td className="border border-gray-300 p-2">{c.instituicaoResponseDTO?.nome || "N/A"}</td>
                      <td className="border border-gray-300 p-2 space-x-2">
                        <Button onClick={() => this.abrirForm(c)}>Editar</Button>
                        <Button color="red" onClick={() => this.abrirDeleteModal(c.id)}>Excluir</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}

        {showForm && (
          <form onSubmit={this.salvarCoordenador} className="border p-6 rounded w-full max-w-xl shadow-lg mt-6">
            <h2 className="text-2xl font-bold mb-4">{isEditMode ? "Editar Coordenador" : "Adicionar Novo Coordenador"}</h2>

            <Campo label="Nome Completo" name="nome" value={form.nome} onChange={this.handleInputChange} required />
            <Campo label="CPF" name="cpf" value={form.cpf} onChange={this.handleInputChange} required />
            <Campo label="Email Pessoal" name="email" type="email" value={form.email} onChange={this.handleInputChange} required />
            <Campo label="Email Acadêmico" name="emailAcademico" type="email" value={form.emailAcademico} onChange={this.handleInputChange} />
            <Campo label="Matrícula" name="matricula" value={form.matricula} onChange={this.handleInputChange} required />
           {!isEditMode && (
             <Campo
               label="Senha"
               name="senha"
               type="password"
               value={form.senha}
               onChange={this.handleInputChange}
               required
             />
           )}

            <div className="mb-4">
              <label className="block mb-1 text-gray-600">Instituição</label>
              <select
                name="instituicaoId"
                value={form.instituicaoId}
                onChange={this.handleInputChange}
                className="mt-0.5 mb-3 p-[8px] border-2 border-[#ccc] focus:border-primaria focus:outline-none rounded w-full"
                required
              >
                <option value="">Selecione uma instituição</option>
                {instituicoes.map(inst => (
                  <option key={inst.id} value={inst.id}>{inst.nome}</option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block mb-1 text-gray-600">Cursos</label>
              <select
                multiple
                name="cursosId"
                value={form.cursosId}
                onChange={this.handleInputChange}
                className="mt-0.5 mb-3 p-[8px] border-2 border-[#ccc] focus:border-primaria focus:outline-none rounded w-full"
                required
              >
                {cursos.map(curso => (
                  <option key={curso.id} value={curso.id}>{curso.nome}</option>
                ))}
              </select>
              <small className="text-gray-500">Segure Ctrl (Windows) ou Cmd (Mac) para selecionar múltiplos cursos.</small>
            </div>

            {this.state.erros && <p className="text-red-500 mb-4">{this.state.erros}</p>}

            <div className="flex justify-center gap-2">
              <Button type="button" color="gray" onClick={this.fecharForm}>Cancelar</Button>
              <Button type="submit">{isEditMode ? "Atualizar" : "Salvar"}</Button>
            </div>
          </form>
        )}

        {/* Modal excluir */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded p-6 max-w-md w-full relative">
              <button
                onClick={this.fecharDeleteModal}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-900"
                aria-label="Fechar"
              >
                ×
              </button>
              <h2 className="text-xl font-bold mb-4">Confirmar exclusão</h2>
              <p>Tem certeza que deseja excluir este coordenador?</p>
              <div className="flex justify-end gap-2 mt-4">
                <Button color="gray" onClick={this.fecharDeleteModal}>Cancelar</Button>
                <Button color="red" onClick={this.confirmarExclusao}>Excluir</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default CoordenadorManager;
