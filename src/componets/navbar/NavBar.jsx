import { useAuth } from "../AuthContext";
import NavItem from "../navbar/NavItem.jsx";
import ScrollContainer from "../navbar/ScrollContainer.jsx";

function NavBar() {
  const { profile } = useAuth();

  return (
    <nav>
      {/* Exibir item apenas para certos perfis */}
      {profile === "monitor" && (
        <ScrollContainer>
          <NavItem to="/monitor" label="Monitoria" />
        </ScrollContainer>
      )}

      {profile === "professor" && (
        <ScrollContainer>
          <NavItem to="/professor" label="Painel Professor" />
        </ScrollContainer>
      )}

      {profile === "aluno" && (
        <ScrollContainer>
          <NavItem to="/editais" label="Editais" />
          <NavItem to="/monitorias" label="Agenda" />
        </ScrollContainer>
      )}

      {profile === "admin" && (
        <ScrollContainer>
          <NavItem to="/admin" label="Painel Admin" />
          <NavItem to="/instituicoes" label="Instituições" />
          <NavItem to="/coordenadores" label="Coordenadores" />
          <NavItem to="/alunos" label="Alunos" />
          <NavItem to="/disciplinas" label="Disciplinas" />
           <NavItem to="/cursos/novo" label="Cursos" />
            <NavItem to="/processos-seletivos" label="Processos Seletivos" />
        </ScrollContainer>
      )}

      {profile === "coordenador" && (
        <ScrollContainer>
          <NavItem to="/coordenador" label="Coordenação" />
          <NavItem to="/alunos" label="Alunos" />
          <NavItem to="/disciplinas" label="Disciplinas" />
          <NavItem to="/monitorias" label="Monitoria" />
          <NavItem to="/professor" label="Painel Professor" />
           <NavItem to="/cursos/novo" label="Cursos" />

        </ScrollContainer>
      )}
    </nav>
  );
}

export default NavBar;
