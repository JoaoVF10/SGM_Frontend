// src/monitoria/MonitorCard.jsx
export default function MonitorCard({ monitor }) {
  const disciplina = monitor.disciplinaResponseDTO?.nome || "N/A";
  const professor = monitor.professorResponseDTO?.nome || "N/A";
  const processo = monitor.processoSeletivoResponseDTO;

  const processoTexto = processo
    ? `Processo ${processo.numero} (${new Date(processo.inicio).toLocaleDateString()})`
    : "N/A";

  return (
    <div className="flex flex-col">
      <span><strong>Disciplina:</strong> {disciplina}</span>
      <span><strong>Professor:</strong> {professor}</span>
      <span><strong>Processo:</strong> {processoTexto}</span>
      <span><strong>Vagas:</strong> {monitor.numeroVaga} ({monitor.numeroVagaBolsa} com bolsa)</span>
      <span><strong>Carga Horária:</strong> {monitor.cargaHoraria}h/semana</span>
    </div>
  );
}
