import { HelpSection } from "../types";
import { FeatureDependenciesHelp } from "../components/FeatureDependenciesHelp.pt";
import { RoleBasedHelp } from "../components/RoleBasedHelp.pt";

export const shiftsCalendarHelp: HelpSection = {
  title: "Gestão e Agendamento de Turnos",
  description: (
    <>
      A <strong>interface principal de agendamento</strong> para gerir horários
      de trabalho da equipa. Crie turnos, atribua membros da equipa e garanta
      cobertura ideal.
    </>
  ),
  features: [
    {
      title: "Criar e Editar Turnos",
      description:
        "Adicione novas posições de turno ou modifique existentes com arrastar e largar",
    },
    {
      title: "Atribuir Membros da Equipa",
      description:
        "Arraste membros qualificados para turnos com validação automática",
    },
    {
      title: "Preenchimento Automático",
      description:
        "Deixe o sistema atribuir automaticamente membros baseado em qualificações",
    },
  ],
  sections: [
    {
      title: "Ações Rápidas",
      content: (
        <div className="space-y-2">
          <p className="text-xs text-gray-600">
            • <strong>Criar Turno:</strong> Clique no botão "+" ou arraste do
            painel esquerdo
          </p>
          <p className="text-xs text-gray-600">
            • <strong>Atribuir Membro:</strong> Arraste um membro do painel
            direito para um turno
          </p>
          <p className="text-xs text-gray-600">
            • <strong>Preenchimento Automático:</strong> Use o botão auto-fill
            para atribuir automaticamente membros
          </p>
          <p className="text-xs text-gray-600">
            • <strong>Publicar:</strong> Clique em "Publicar" para tornar as
            alterações visíveis à equipa
          </p>
        </div>
      ),
    },
    {
      title: "Compreender a Interface",
      content: (
        <div className="space-y-2">
          <div className="flex items-center text-xs">
            <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
            <span className="text-gray-600">
              <strong>Membros Disponíveis:</strong> Membros da equipa
              qualificados prontos para atribuir
            </span>
          </div>
          <div className="flex items-center text-xs">
            <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
            <span className="text-gray-600">
              <strong>Turnos Atribuídos:</strong> Membros atribuídos com sucesso
              aos turnos
            </span>
          </div>
          <div className="flex items-center text-xs">
            <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
            <span className="text-gray-600">
              <strong>Conflitos:</strong> Conflitos de agendamento que precisam
              de resolução
            </span>
          </div>
        </div>
      ),
    },
    {
      title: "Publicar Alterações",
      content: (
        <div className="space-y-2">
          <p className="text-xs text-gray-600">
            • As alterações ficam <strong>não publicadas</strong> até clicar em
            "Publicar"
          </p>
          <p className="text-xs text-gray-600">
            • Alterações publicadas tornam-se visíveis a todos os membros da
            equipa
          </p>
          <p className="text-xs text-gray-600">
            • Use "Reverter para Publicado" para desfazer alterações não
            publicadas
          </p>
        </div>
      ),
    },
  ],
  screenshots: [
    {
      caption:
        "Vista principal do calendário com posições de turno e atribuições de membros",
      alt: "Interface do calendário de turnos",
      src: "/images/help/shifts-calendar-main.png",
    },
    {
      caption: "Interface de arrastar e largar para atribuir membros a turnos",
      alt: "Interface de atribuição de membros",
      src: "/images/help/shifts-calendar-drag.png",
    },
    {
      caption: "Diálogo de preenchimento automático com opções de atribuição",
      alt: "Agendamento com preenchimento automático",
      src: "/images/help/shifts-calendar-autofill.png",
    },
  ],
  dependencies: <FeatureDependenciesHelp context="shifts-calendar" />,
  roles: <RoleBasedHelp context="shifts-calendar" />,
};
