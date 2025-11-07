import { ReactElement } from "react";

export interface FeatureDependenciesHelpProps {
  context?: string;
}

export const FeatureDependenciesHelp = ({
  context,
}: FeatureDependenciesHelpProps): ReactElement => {
  const getDependenciesContent = () => {
    switch (context) {
      case "shifts-calendar":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              Passos de Configuração Necessários
            </h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Antes de gerir turnos, certifique-se que estes pré-requisitos
                estão concluídos:
              </p>
              <div className="pl-4 border-l-2 border-gray-200">
                <ol className="space-y-4 text-sm">
                  <li>
                    <h4 className="font-medium">1. Configuração da Equipa</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• Configurar nome e informações básicas da equipa</li>
                      <li>• Configurar horário de trabalho e fuso horário</li>
                      <li>• Definir funções e permissões dos membros</li>
                    </ul>
                  </li>
                  <li>
                    <h4 className="font-medium">2. Gestão de Membros</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• Adicionar membros com informações de contacto</li>
                      <li>• Atribuir funções apropriadas aos membros</li>
                      <li>• Configurar qualificações e competências</li>
                    </ul>
                  </li>
                  <li>
                    <h4 className="font-medium">3. Tipos de Ausência</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• Configurar tipos de ausência disponíveis</li>
                      <li>• Configurar quotas e políticas de ausência</li>
                      <li>• Definir fluxos de aprovação</li>
                    </ul>
                  </li>
                  <li>
                    <h4 className="font-medium">4. Modelos de Turno</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• Criar modelos de posições de turno</li>
                      <li>• Definir qualificações necessárias</li>
                      <li>• Configurar horários e durações</li>
                    </ul>
                  </li>
                </ol>
              </div>
              <div className="mt-4 pl-4 border-l-2 border-gray-200">
                <h4 className="font-medium">Próximos Passos:</h4>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>• Criar posições de turno individuais</li>
                  <li>• Atribuir membros aos turnos</li>
                  <li>• Usar preenchimento automático para agendamento</li>
                  <li>• Revisar e publicar o horário</li>
                </ul>
              </div>
            </div>
          </div>
        );
      case "new-leave-request":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              Passos de Configuração Necessários
            </h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Antes de submeter um pedido de ausência, certifique-se que estes
                pré-requisitos estão concluídos:
              </p>
              <div className="pl-4 border-l-2 border-gray-200">
                <ol className="space-y-4 text-sm">
                  <li>
                    <h4 className="font-medium">1. Pertencimento à Equipa</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• Ser membro ativo da equipa</li>
                      <li>• Ter permissões apropriadas</li>
                      <li>• Estar atribuído a uma equipa</li>
                    </ul>
                  </li>
                  <li>
                    <h4 className="font-medium">2. Política de Ausências</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• Equipa tem tipos de ausência definidos</li>
                      <li>• Quotas de ausência configuradas</li>
                      <li>• Fluxo de aprovação configurado</li>
                    </ul>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        );
      case "leave-request-management":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              Passos de Configuração Necessários
            </h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Para gerir pedidos de ausência, certifique-se que estes
                pré-requisitos estão concluídos:
              </p>
              <div className="pl-4 border-l-2 border-gray-200">
                <ol className="space-y-4 text-sm">
                  <li>
                    <h4 className="font-medium">1. Configuração da Equipa</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• Equipa está devidamente configurada</li>
                      <li>• Políticas de ausência definidas</li>
                      <li>• Fluxos de aprovação configurados</li>
                    </ul>
                  </li>
                  <li>
                    <h4 className="font-medium">2. Acesso do Membro</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• Membro tem permissões apropriadas</li>
                      <li>• Membro está atribuído a uma equipa</li>
                      <li>• Membro tem quota de ausência atribuída</li>
                    </ul>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        );
      case "work-schedule-settings":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              Passos de Configuração Necessários
            </h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Antes de configurar definições de horário de trabalho,
                certifique-se que estes pré-requisitos estão concluídos:
              </p>
              <div className="pl-4 border-l-2 border-gray-200">
                <ol className="space-y-4 text-sm">
                  <li>
                    <h4 className="font-medium">1. Configuração da Equipa</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• Equipa está criada e ativa</li>
                      <li>• Informações básicas configuradas</li>
                      <li>• Membros atribuídos</li>
                    </ul>
                  </li>
                  <li>
                    <h4 className="font-medium">2. Permissões</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• Utilizador tem permissões de administrador</li>
                      <li>• Utilizador pode modificar definições da equipa</li>
                    </ul>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        );
      case "yearly-quota-settings":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              Passos de Configuração Necessários
            </h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Antes de configurar quotas anuais, certifique-se que estes
                pré-requisitos estão concluídos:
              </p>
              <div className="pl-4 border-l-2 border-gray-200">
                <ol className="space-y-4 text-sm">
                  <li>
                    <h4 className="font-medium">1. Configuração da Equipa</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• Equipa está devidamente configurada</li>
                      <li>• Membros atribuídos</li>
                      <li>• Definições básicas configuradas</li>
                    </ul>
                  </li>
                  <li>
                    <h4 className="font-medium">2. Tipos de Ausência</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• Tipos de ausência definidos</li>
                      <li>• Políticas de ausência configuradas</li>
                    </ul>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        );
      case "company-settings":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              Passos de Configuração Necessários
            </h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Antes de configurar definições da empresa, certifique-se que
                estes pré-requisitos estão concluídos:
              </p>
              <div className="pl-4 border-l-2 border-gray-200">
                <ol className="space-y-4 text-sm">
                  <li>
                    <h4 className="font-medium">1. Configuração da Empresa</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• Empresa está criada e ativa</li>
                      <li>• Informações básicas configuradas</li>
                    </ul>
                  </li>
                  <li>
                    <h4 className="font-medium">2. Permissões</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>
                        • Utilizador tem permissões de administrador da empresa
                      </li>
                      <li>• Utilizador pode modificar definições da empresa</li>
                    </ul>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        );
      case "leave-approval-dashboard":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              Passos de Configuração Necessários
            </h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Antes de gerir aprovações de ausência, certifique-se que estes
                pré-requisitos estão concluídos:
              </p>
              <div className="pl-4 border-l-2 border-gray-200">
                <ol className="space-y-4 text-sm">
                  <li>
                    <h4 className="font-medium">1. Configuração da Equipa</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• Equipa está devidamente configurada</li>
                      <li>• Políticas de ausência definidas</li>
                      <li>• Fluxos de aprovação configurados</li>
                    </ul>
                  </li>
                  <li>
                    <h4 className="font-medium">2. Permissões</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• Utilizador tem permissões de administrador</li>
                      <li>• Utilizador pode aprovar pedidos de ausência</li>
                    </ul>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        );
      case "unit-settings":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              Passos de Configuração Necessários
            </h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Antes de configurar definições da unidade, certifique-se que
                estes pré-requisitos estão concluídos:
              </p>
              <div className="pl-4 border-l-2 border-gray-200">
                <ol className="space-y-4 text-sm">
                  <li>
                    <h4 className="font-medium">1. Configuração da Unidade</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• Unidade está criada e ativa</li>
                      <li>• Informações básicas configuradas</li>
                    </ul>
                  </li>
                  <li>
                    <h4 className="font-medium">2. Permissões</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>
                        • Utilizador tem permissões de administrador da unidade
                      </li>
                      <li>• Utilizador pode modificar definições da unidade</li>
                    </ul>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        );
      case "team-invitations":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              Passos de Configuração Necessários
            </h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Antes de gerir convites da equipa, certifique-se que estes
                pré-requisitos estão concluídos:
              </p>
              <div className="pl-4 border-l-2 border-gray-200">
                <ol className="space-y-4 text-sm">
                  <li>
                    <h4 className="font-medium">1. Configuração da Equipa</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• Equipa está devidamente configurada</li>
                      <li>• Funções da equipa definidas</li>
                      <li>• Permissões da equipa configuradas</li>
                    </ul>
                  </li>
                  <li>
                    <h4 className="font-medium">2. Permissões</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• Utilizador tem permissões de administrador</li>
                      <li>• Utilizador pode convidar membros</li>
                    </ul>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        );
      case "team-settings":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              Passos de Configuração Necessários
            </h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Antes de configurar definições da equipa, certifique-se que
                estes pré-requisitos estão concluídos:
              </p>
              <div className="pl-4 border-l-2 border-gray-200">
                <ol className="space-y-4 text-sm">
                  <li>
                    <h4 className="font-medium">1. Configuração da Equipa</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• Equipa está criada e ativa</li>
                      <li>• Informações básicas configuradas</li>
                      <li>• Membros atribuídos</li>
                    </ul>
                  </li>
                  <li>
                    <h4 className="font-medium">2. Permissões</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• Utilizador tem permissões de administrador</li>
                      <li>• Utilizador pode modificar definições da equipa</li>
                    </ul>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              Dependências da Funcionalidade
            </h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Esta funcionalidade requer configuração adequada da equipa. Por
                favor, certifique-se que todos os pré-requisitos estão
                concluídos antes de prosseguir.
              </p>
            </div>
          </div>
        );
    }
  };

  return getDependenciesContent();
};
