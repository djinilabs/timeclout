import { HelpSection } from "../types";
import { FeatureDependenciesHelp } from "../components/FeatureDependenciesHelp.pt";
import { RoleBasedHelp } from "../components/RoleBasedHelp.pt";

export const createShiftHelp: HelpSection = {
  title: "Criar Turno",
  description: (
    <>
      Crie uma nova posição de turno para a sua equipa. Pode criar uma nova
      posição do zero ou reutilizar um modelo de posição existente. Os modelos
      ajudam a manter a consistência e poupam tempo ao criar turnos semelhantes.
      Defina os detalhes da posição, as qualificações necessárias e o horário
      para garantir uma cobertura adequada para as operações da sua equipa.
    </>
  ),
  features: [
    {
      title: "Modelos de Posição",
      description:
        "Selecione entre modelos de posição existentes para criar rapidamente turnos consistentes. Os modelos incluem nomes, cores e requisitos de qualificação predefinidos.",
    },
    {
      title: "Detalhes da Posição",
      description:
        "Defina o nome da posição do turno, descrição e requisitos. Ao utilizar um modelo, estes campos serão pré-preenchidos mas podem ser modificados conforme necessário.",
    },
    {
      title: "Configuração do Horário",
      description:
        "Configure o horário do turno, duração e frequência. Isto pode ser personalizado independentemente de estar a utilizar um modelo ou a criar uma nova posição.",
    },
    {
      title: "Requisitos de Qualificação",
      description:
        "Especifique as qualificações e competências necessárias para a posição. Os modelos incluirão os seus requisitos predefinidos, que pode ajustar para este turno específico.",
    },
  ],
  sections: [
    {
      title: "Criar um Turno com Modelos",
      content: (
        <>
          <p>Para criar um turno utilizando um modelo de posição:</p>
          <ol>
            <li>Clique em "Adicionar Posição" na vista do calendário</li>
            <li>Selecione um modelo de posição existente no menu pendente</li>
            <li>
              Reveja e ajuste os detalhes da posição pré-preenchidos se
              necessário
            </li>
            <li>Configure o horário específico para este turno</li>
            <li>Modifique os requisitos de qualificação se necessário</li>
            <li>Guarde a nova posição de turno</li>
          </ol>
          <p className="mt-2">
            A utilização de modelos garante consistência entre turnos
            semelhantes, permitindo flexibilidade para ajustar detalhes para
            necessidades específicas de agendamento.
          </p>
        </>
      ),
    },
    {
      title: "Boas Práticas",
      content: (
        <>
          <ul>
            <li>
              Utilize modelos para tipos de posição comuns para manter a
              consistência
            </li>
            <li>Reveja os detalhes do modelo antes de criar o turno</li>
            <li>
              Ajuste os requisitos de qualificação com base nas necessidades
              específicas do turno
            </li>
            <li>Considere criar novos modelos para tipos de posição únicos</li>
            <li>Mantenha os nomes e requisitos dos modelos atualizados</li>
          </ul>
        </>
      ),
    },
  ],
  dependencies: <FeatureDependenciesHelp context="create-shift" />,
  roles: <RoleBasedHelp context="create-shift" />,
};
