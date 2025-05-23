import { ReactElement } from "react";

export interface RoleBasedHelpProps {
  context?: string;
}

export const RoleBasedHelp = ({
  context,
}: RoleBasedHelpProps): ReactElement => {
  const getRoleBasedContent = () => {
    switch (context) {
      case "shifts-calendar":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Acesso Baseado em Função</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Diferentes funções têm diferentes permissões e capacidades no
                calendário de turnos:
              </p>
              <div className="pl-4 border-l-2 border-gray-200">
                <ul className="space-y-4 text-sm">
                  <li>
                    <h4 className="font-medium">Administrador da Equipa</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• Criar e gerir turnos</li>
                      <li>• Atribuir membros aos turnos</li>
                      <li>• Usar funcionalidade de preenchimento automático</li>
                      <li>• Ver e gerir todos os horários da equipa</li>
                    </ul>
                  </li>
                  <li>
                    <h4 className="font-medium">Membro da Equipa</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• Ver turnos atribuídos</li>
                      <li>• Solicitar alterações de turno</li>
                      <li>• Ver horário da equipa</li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );
      case "new-leave-request":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Acesso Baseado em Função</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Diferentes funções têm diferentes permissões para pedidos de
                ausência:
              </p>
              <div className="pl-4 border-l-2 border-gray-200">
                <ul className="space-y-4 text-sm">
                  <li>
                    <h4 className="font-medium">Membro da Equipa</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• Submeter pedidos de ausência</li>
                      <li>• Ver saldo de ausências</li>
                      <li>• Acompanhar estado do pedido</li>
                    </ul>
                  </li>
                  <li>
                    <h4 className="font-medium">Administrador da Equipa</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• Aprovar/rejeitar pedidos</li>
                      <li>• Ver todos os pedidos da equipa</li>
                      <li>• Gerir quotas de ausência</li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );
      case "leave-request-management":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Acesso Baseado em Função</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Diferentes funções têm diferentes permissões para gerir pedidos
                de ausência:
              </p>
              <div className="pl-4 border-l-2 border-gray-200">
                <ul className="space-y-4 text-sm">
                  <li>
                    <h4 className="font-medium">Administrador da Equipa</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• Aprovar/rejeitar pedidos</li>
                      <li>• Ver todos os pedidos da equipa</li>
                      <li>• Gerir quotas de ausência</li>
                      <li>• Configurar fluxos de aprovação</li>
                    </ul>
                  </li>
                  <li>
                    <h4 className="font-medium">Membro da Equipa</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• Ver pedidos próprios</li>
                      <li>• Acompanhar estado do pedido</li>
                      <li>• Ver saldo de ausências</li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );
      case "work-schedule-settings":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Acesso Baseado em Função</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Diferentes funções têm diferentes permissões para definições de
                horário de trabalho:
              </p>
              <div className="pl-4 border-l-2 border-gray-200">
                <ul className="space-y-4 text-sm">
                  <li>
                    <h4 className="font-medium">Administrador da Equipa</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• Configurar horários de trabalho</li>
                      <li>• Configurar padrões de turno</li>
                      <li>• Gerir horas da equipa</li>
                      <li>• Definir dias de trabalho</li>
                    </ul>
                  </li>
                  <li>
                    <h4 className="font-medium">Membro da Equipa</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• Ver horário de trabalho</li>
                      <li>• Ver padrões de turno</li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );
      case "yearly-quota-settings":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Acesso Baseado em Função</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Diferentes funções têm diferentes permissões para definições de
                quota anual:
              </p>
              <div className="pl-4 border-l-2 border-gray-200">
                <ul className="space-y-4 text-sm">
                  <li>
                    <h4 className="font-medium">Administrador da Equipa</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• Definir quotas anuais</li>
                      <li>• Configurar tipos de ausência</li>
                      <li>• Gerir quotas da equipa</li>
                      <li>• Ver utilização de quotas</li>
                    </ul>
                  </li>
                  <li>
                    <h4 className="font-medium">Membro da Equipa</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• Ver quota própria</li>
                      <li>• Acompanhar utilização de quota</li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );
      case "company-settings":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Acesso Baseado em Função</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Diferentes funções têm diferentes permissões para definições da
                empresa:
              </p>
              <div className="pl-4 border-l-2 border-gray-200">
                <ul className="space-y-4 text-sm">
                  <li>
                    <h4 className="font-medium">Administrador da Empresa</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• Configurar definições da empresa</li>
                      <li>• Gerir políticas da empresa</li>
                      <li>• Configurar regras da empresa</li>
                      <li>• Gerir unidades da empresa</li>
                    </ul>
                  </li>
                  <li>
                    <h4 className="font-medium">Administrador da Unidade</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• Ver definições da empresa</li>
                      <li>• Aplicar políticas da empresa</li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );
      case "leave-approval-dashboard":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Acesso Baseado em Função</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Diferentes funções têm diferentes permissões para aprovação de
                ausências:
              </p>
              <div className="pl-4 border-l-2 border-gray-200">
                <ul className="space-y-4 text-sm">
                  <li>
                    <h4 className="font-medium">Administrador da Equipa</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• Aprovar/rejeitar pedidos</li>
                      <li>• Ver todos os pedidos</li>
                      <li>• Gerir fluxos de aprovação</li>
                      <li>• Configurar regras de aprovação</li>
                    </ul>
                  </li>
                  <li>
                    <h4 className="font-medium">Membro da Equipa</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• Ver pedidos próprios</li>
                      <li>• Acompanhar estado de aprovação</li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );
      case "unit-settings":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Acesso Baseado em Função</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Diferentes funções têm diferentes permissões para definições da
                unidade:
              </p>
              <div className="pl-4 border-l-2 border-gray-200">
                <ul className="space-y-4 text-sm">
                  <li>
                    <h4 className="font-medium">Administrador da Unidade</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• Configurar definições da unidade</li>
                      <li>• Gerir equipas da unidade</li>
                      <li>• Definir políticas da unidade</li>
                      <li>• Ver métricas da unidade</li>
                    </ul>
                  </li>
                  <li>
                    <h4 className="font-medium">Administrador da Equipa</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• Ver definições da unidade</li>
                      <li>• Aplicar políticas da unidade</li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );
      case "team-invitations":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Acesso Baseado em Função</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Diferentes funções têm diferentes permissões para convites da
                equipa:
              </p>
              <div className="pl-4 border-l-2 border-gray-200">
                <ul className="space-y-4 text-sm">
                  <li>
                    <h4 className="font-medium">Administrador da Equipa</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• Enviar convites</li>
                      <li>• Gerir convites</li>
                      <li>• Atribuir funções</li>
                      <li>• Ver estado dos convites</li>
                    </ul>
                  </li>
                  <li>
                    <h4 className="font-medium">Membro da Equipa</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• Aceitar convites</li>
                      <li>• Ver convites próprios</li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );
      case "team-settings":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Acesso Baseado em Função</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Diferentes funções têm diferentes permissões para definições da
                equipa:
              </p>
              <div className="pl-4 border-l-2 border-gray-200">
                <ul className="space-y-4 text-sm">
                  <li>
                    <h4 className="font-medium">Administrador da Equipa</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• Configurar definições da equipa</li>
                      <li>• Gerir membros da equipa</li>
                      <li>• Definir políticas da equipa</li>
                      <li>• Ver métricas da equipa</li>
                    </ul>
                  </li>
                  <li>
                    <h4 className="font-medium">Membro da Equipa</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• Ver definições da equipa</li>
                      <li>• Aplicar políticas da equipa</li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Acesso Baseado em Função</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Diferentes funções têm diferentes permissões e capacidades. Por
                favor, certifique-se que tem a função apropriada para aceder a
                esta funcionalidade.
              </p>
            </div>
          </div>
        );
    }
  };

  return getRoleBasedContent();
};
