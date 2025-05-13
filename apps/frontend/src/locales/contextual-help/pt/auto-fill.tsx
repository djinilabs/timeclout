import { HelpSection } from "../types";
import { FeatureDependenciesHelp } from "../components/FeatureDependenciesHelp.pt";
import { RoleBasedHelp } from "../components/RoleBasedHelp.pt";

export const autoFillHelp: HelpSection = {
  title: "Preenchimento Automático de Turnos",
  description: (
    <>
      Atribua automaticamente membros da equipa aos turnos com base nas suas
      qualificações, preferências e disponibilidade. O sistema otimizará o
      horário para garantir uma distribuição justa e uma cobertura adequada.
    </>
  ),
  features: [
    {
      title: "Atribuição Inteligente",
      description:
        "Atribua automaticamente membros com base em qualificações e preferências",
    },
    {
      title: "Resolução de Conflitos",
      description: "Gira conflitos de horário e encontre soluções ótimas",
    },
    {
      title: "Otimização do Horário",
      description:
        "Equilibre a carga de trabalho e garanta uma distribuição justa dos turnos",
    },
  ],
  dependencies: <FeatureDependenciesHelp context="auto-fill" />,
  roles: <RoleBasedHelp context="autoFill" />,
};
