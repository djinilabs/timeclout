import { HelpSection } from "../types";
import { FeatureDependenciesHelp } from "../components/FeatureDependenciesHelp.pt";
import { RoleBasedHelp } from "../components/RoleBasedHelp.pt";

export const createShiftHelp: HelpSection = {
  title: "Criar Turno",
  description: (
    <>
      <strong>Adicione uma nova posição de turno</strong> ao horário da sua
      equipa. Use modelos para consistência ou crie do zero.
    </>
  ),
  features: [
    {
      title: "Usar Modelos",
      description:
        "Selecione de modelos existentes para criar rapidamente turnos consistentes",
    },
    {
      title: "Detalhes Personalizados",
      description:
        "Defina nome da posição, requisitos e horário para este turno específico",
    },
    {
      title: "Correspondência de Qualificações",
      description:
        "Defina competências e qualificações necessárias para a posição",
    },
  ],
  sections: [
    {
      title: "Como Criar um Turno",
      content: (
        <div className="space-y-2">
          <p className="text-xs text-gray-600">
            1. Clique em <strong>"Adicionar Posição"</strong> no calendário
          </p>
          <p className="text-xs text-gray-600">
            2. Escolha um <strong>modelo</strong> ou crie do zero
          </p>
          <p className="text-xs text-gray-600">
            3. Defina o <strong>nome da posição</strong> e descrição
          </p>
          <p className="text-xs text-gray-600">
            4. Configure <strong>horários de início/fim</strong> e duração
          </p>
          <p className="text-xs text-gray-600">
            5. Adicione <strong>qualificações necessárias</strong>
          </p>
          <p className="text-xs text-gray-600">
            6. Clique em <strong>"Guardar"</strong> para criar o turno
          </p>
        </div>
      ),
    },
    {
      title: "Modelos vs Personalizado",
      content: (
        <div className="space-y-2">
          <div className="flex items-start text-xs">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 mr-2 flex-shrink-0"></div>
            <div>
              <strong>Modelos:</strong> Pré-preenchidos com configurações
              comuns, bons para consistência
            </div>
          </div>
          <div className="flex items-start text-xs">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-1 mr-2 flex-shrink-0"></div>
            <div>
              <strong>Personalizado:</strong> Comece do zero, bom para posições
              únicas
            </div>
          </div>
        </div>
      ),
    },
  ],
  screenshots: [
    {
      caption: "Diálogo criar turno com seleção de modelo",
      alt: "Formulário de criação de turno",
    },
    {
      caption: "Detalhes da posição e requisitos de qualificação",
      alt: "Configuração do turno",
    },
  ],
  dependencies: <FeatureDependenciesHelp context="create-shift" />,
  roles: <RoleBasedHelp context="create-shift" />,
};
