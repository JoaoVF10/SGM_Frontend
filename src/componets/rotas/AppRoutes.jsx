import { Route, Routes, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";

import Login from "../pages/Login";
import Aluno from "../pages/Aluno";
import Professor from "../pages/Professor";
import Coordenador from "../pages/Coordenador";
import Monitor from "../pages/Monitor";
import Admin from "../pages/Admin";
import CadastrarAluno from "../pages/CadastroAluno";
import SenhaEsquecida from "../pages/SenhaEsquecida";
import RotaProtegida from "./RotaProtegida";
import Cabeca from "../layout/Conteiner";
import Perfil from "../pages/Perfil";
import Editais from "../pages/Editais";
import Monitorias from "../pages/Monitorias";
import Alunos from "../pages/Alunos";
import Instituicoes from "../pages/Instituicoes";
import NovaInstituicao from "../pages/NovaInstituicao";
import EditarInstituicao from "../pages/EditarInstituicao";
import Disciplinas from "../pages/Disciplinas";
import NovaDisciplina from "../pages/NovaDisciplina";
import EditarDisciplina from "../pages/EditarDisciplina";
import CursoForm from "../pages/CursoForm";
import ProcessosSeletivos from "../pages/ProcessoSeletivoManager";


import Coordenadores from "../pages/Coordenadores.jsx";
import NovoCoordenador from "../pages/NovoCoordenador.jsx";
import EditarCoordenador from "../pages/EditarCoordenador.jsx";

function AppRoutes() {
  const location = useLocation();
  const { profile } = useAuth();

  // rotas que não devem exibir a NavBar
  const rotasSemNav = ["/", "/senhaEsquecida", "/cadastrarAluno"];
  const mostrarCon = !rotasSemNav.includes(location.pathname);


  const mensagens = {
    admin: "Perfil Admin",
    coordenador: "Perfil Coordenador",
    professor: "Perfil Professor",
    monitor: "Perfil Monitor",
    aluno: "Perfil Aluno",
  };

  return (
    <>
      {/* Navbar */}
      {mostrarCon && <Cabeca />}

      {/* Mensagem de boas-vindas centralizada abaixo da navbar */}
      {mostrarCon && profile && (
        <div
          style={{
            textAlign: "center",
            color: "green",
            fontWeight: "bold",
            fontSize: "1.5rem",
            marginTop: "2rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <span style={{ fontSize: "3rem" }}>👤</span>
          <span>{mensagens[profile]}</span>
        </div>
      )}

      {/* Rotas */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/senhaEsquecida" element={<SenhaEsquecida />} />

        <Route
          path="/coordenadores"
          element={
            <RotaProtegida perfilPermitido="admin">
              <Coordenadores />
            </RotaProtegida>
          }
        />
        <Route
          path="/coordenadores/novo"
          element={
            <RotaProtegida perfilPermitido="admin">
              <NovoCoordenador />
            </RotaProtegida>
          }
        />
        <Route
          path="/coordenadores/editar/:id"
          element={
            <RotaProtegida perfilPermitido="admin">
              <EditarCoordenador />
            </RotaProtegida>
          }
        />

        <Route
          path="/aluno/:id"
          element={
            <RotaProtegida
              perfilPermitido={["professor", "coordenador", "aluno", "monitor", "admin"]}
            >
              <Aluno />
            </RotaProtegida>
          }
        />

        <Route
          path="/perfil/:id"
          element={
            <RotaProtegida
              perfilPermitido={["professor", "coordenador", "aluno", "monitor", "admin"]}
            >
              <Perfil />
            </RotaProtegida>
          }
        />

        <Route
          path="/editais"
          element={
            <RotaProtegida
              perfilPermitido={["professor", "coordenador", "aluno", "monitor", "admin"]}
            >
              <Editais />
            </RotaProtegida>
          }
        />

        <Route
          path="/monitorias"
          element={
            <RotaProtegida
              perfilPermitido={["professor", "coordenador", "aluno", "monitor", "admin"]}
            >
              <Monitorias />
            </RotaProtegida>
          }
        />

        <Route
          path="/alunos"
          element={
            <RotaProtegida perfilPermitido={["coordenador", "admin"]}>
              <Alunos />
            </RotaProtegida>
          }
        />

        <Route
          path="/professor"
          element={
            <RotaProtegida perfilPermitido={["professor", "coordenador"]}>
              <Professor />
            </RotaProtegida>
          }
        />

        <Route path="/cadastrarAluno" element={<CadastrarAluno />} />

        <Route
          path="/coordenador"
          element={
            <RotaProtegida perfilPermitido="coordenador">
              <Coordenador />
            </RotaProtegida>
          }
        />

        <Route
          path="/monitor"
          element={
            <RotaProtegida perfilPermitido="monitor">
              <Monitor />
            </RotaProtegida>
          }
        />

        <Route
          path="/admin"
          element={
            <RotaProtegida perfilPermitido="admin">
              <Admin />
            </RotaProtegida>
          }
        />

        <Route
          path="/instituicoes"
          element={
            <RotaProtegida perfilPermitido="admin">
              <Instituicoes />
            </RotaProtegida>
          }
        />
        <Route
          path="/instituicoes/novo"
          element={
            <RotaProtegida perfilPermitido="admin">
              <NovaInstituicao />
            </RotaProtegida>
          }
        />
        <Route
          path="/instituicoes/:id"
          element={
            <RotaProtegida perfilPermitido="admin">
              <EditarInstituicao />
            </RotaProtegida>
          }
        />

        <Route
          path="/disciplinas"
          element={
            <RotaProtegida perfilPermitido={["coordenador", "admin"]}>
              <Disciplinas />
            </RotaProtegida>
          }
        />
        <Route
          path="/disciplinas/novo"
          element={
            <RotaProtegida perfilPermitido={["coordenador", "admin"]}>
              <NovaDisciplina />
            </RotaProtegida>
          }
        />
        <Route
          path="/disciplinas/:id"
          element={
            <RotaProtegida perfilPermitido={["coordenador", "admin"]}>
              <EditarDisciplina />
            </RotaProtegida>
          }
        />
        <Route
          path="/cursos/novo"
          element={
            <RotaProtegida perfilPermitido={["admin", "coordenador"]}>
              <CursoForm />
            </RotaProtegida>
          }
        />
        <Route
          path="/processos-seletivos"
          element={
            <RotaProtegida perfilPermitido="admin">
              <ProcessosSeletivos />
            </RotaProtegida>
          }
        />

      </Routes>
    </>
  );
}

export default AppRoutes;
