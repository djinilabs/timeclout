import { HelpSection } from "../types";
import { FeatureDependenciesHelp } from "../components/FeatureDependenciesHelp.pt";
import { RoleBasedHelp } from "../components/RoleBasedHelp.pt";

export const teamManagementHelp: HelpSection = {
  title: "Gestão Abrangente de Equipas",
  description: (
    <>
      Construa e gere equipas de alto desempenho dentro das suas unidades
      organizacionais. Esta interface poderosa permite criar equipas, atribuir
      membros com funções e qualificações específicas, configurar políticas
      específicas da equipa e monitorizar métricas de performance. Desde a
      configuração inicial da equipa até à otimização contínua, o TT3 fornece
      todas as ferramentas necessárias para garantir que as suas equipas operem
      de forma eficiente e eficaz.
    </>
  ),
  features: [
    {
      title: "Criação Estratégica de Equipas",
      description:
        "Crie equipas com propósitos, configurações e atribuições de membros específicos. Defina estrutura da equipa, hierarquia e parâmetros operacionais para corresponder às suas necessidades organizacionais. Cada equipa pode ter configurações únicas mantendo consistência com políticas da empresa.",
    },
    {
      title: "Gestão Avançada de Membros",
      description:
        "Adicione, remova e gere membros da equipa com atribuições de funções detalhadas e níveis de permissão. Acompanhe qualificações dos membros, histórico de performance e padrões de disponibilidade. O sistema fornece perfis abrangentes de membros com toda a informação relevante num só local.",
    },
    {
      title: "Configuração Flexível de Equipas",
      description:
        "Configure políticas específicas da equipa, horários, direitos de licença e requisitos de turno. Configure padrões de trabalho, requisitos de qualificação e regras operacionais que se alinhem com as necessidades e responsabilidades únicas da sua equipa.",
    },
    {
      title: "Análise de Performance e Insights",
      description:
        "Aceda a métricas abrangentes de performance da equipa incluindo padrões de presença, indicadores de produtividade, estatísticas de utilização de recursos e tendências de eficiência. Use insights baseados em dados para otimizar performance da equipa e identificar oportunidades de melhoria.",
    },
    {
      title: "Ferramentas de Comunicação Integradas",
      description:
        "Gere anúncios da equipa, notificações e preferências de comunicação. Configure alertas automatizados para alterações importantes de horário, atualizações de políticas e requisitos operacionais. Mantenha todos informados e alinhados com objetivos da equipa.",
    },
    {
      title: "Operações de Equipa Escaláveis",
      description:
        "Escale operações de equipa eficientemente à medida que a sua organização cresce. Adicione novas equipas, reestruture as existentes e mantenha consistência entre múltiplas equipas preservando autonomia e flexibilidade individuais da equipa.",
    },
  ],
  sections: [
    {
      title: "Processo de Configuração de Equipa",
      content: (
        <>
          <p>Siga este processo abrangente para configurar equipas eficazes:</p>
          <ol className="space-y-2">
            <li>
              <strong>Definir Propósito da Equipa:</strong> Estabeleça
              claramente a missão, responsabilidades e âmbito operacional da
              equipa dentro da sua organização
            </li>
            <li>
              <strong>Configurar Estrutura da Equipa:</strong> Configure
              hierarquia da equipa, funções e relações de reporte para garantir
              responsabilidade clara
            </li>
            <li>
              <strong>Estabelecer Políticas:</strong> Defina políticas
              específicas da equipa para agendamento, gestão de licenças,
              qualificações e procedimentos operacionais
            </li>
            <li>
              <strong>Adicionar Membros da Equipa:</strong> Recrute e atribua
              membros da equipa com funções, permissões e requisitos de
              qualificação apropriados
            </li>
            <li>
              <strong>Configurar Infraestrutura:</strong> Configure modelos de
              turno, horários de trabalho e parâmetros operacionais específicos
              às necessidades da equipa
            </li>
            <li>
              <strong>Implementar Monitorização:</strong> Estabeleça métricas de
              performance e sistemas de monitorização para acompanhar eficácia
              da equipa e identificar áreas de melhoria
            </li>
          </ol>
        </>
      ),
    },
    {
      title: "Boas Práticas de Gestão de Equipas",
      content: (
        <>
          <ul className="space-y-2">
            <li>
              <strong>Definição Clara de Funções:</strong> Mantenha definições
              precisas de funções com responsabilidades específicas, permissões
              e requisitos de qualificação para cada posição da equipa
            </li>
            <li>
              <strong>Revisões Regulares de Performance:</strong> Realize
              avaliações periódicas da composição da equipa, métricas de
              performance e eficiência operacional para identificar
              oportunidades de otimização
            </li>
            <li>
              <strong>Distribuição Justa de Carga de Trabalho:</strong> Garanta
              distribuição equitativa de turnos, responsabilidades e
              oportunidades entre todos os membros da equipa para manter moral e
              prevenir esgotamento
            </li>
            <li>
              <strong>Consistência de Políticas:</strong> Mantenha
              configurações, políticas e procedimentos da equipa atualizados
              garantindo alinhamento com padrões organizacionais e requisitos
              regulatórios
            </li>
            <li>
              <strong>Decisões Baseadas em Dados:</strong> Use análises e
              métricas de performance para tomar decisões informadas sobre
              estrutura da equipa, agendamento e alocação de recursos
            </li>
            <li>
              <strong>Melhoria Contínua:</strong> Reveja regularmente operações
              da equipa, recolha feedback e implemente melhorias para aumentar
              eficiência e satisfação da equipa
            </li>
          </ul>
        </>
      ),
    },
    {
      title: "Estratégias de Otimização de Equipas",
      content: (
        <>
          <div className="space-y-3">
            <div>
              <h5 className="font-medium text-gray-800">
                Monitorização de Performance
              </h5>
              <p className="text-sm text-gray-600">
                Reveja regularmente padrões de presença, métricas de
                produtividade e utilização de recursos para identificar áreas de
                melhoria e otimização.
              </p>
            </div>
            <div>
              <h5 className="font-medium text-gray-800">
                Desenvolvimento de Competências
              </h5>
              <p className="text-sm text-gray-600">
                Acompanhe lacunas de qualificação e forneça oportunidades de
                formação para melhorar capacidades da equipa e flexibilidade
                operacional.
              </p>
            </div>
            <div>
              <h5 className="font-medium text-gray-800">
                Melhoria da Comunicação
              </h5>
              <p className="text-sm text-gray-600">
                Otimize canais de comunicação e sistemas de notificação para
                garantir fluxo de informação atempado e coordenação da equipa.
              </p>
            </div>
            <div>
              <h5 className="font-medium text-gray-800">
                Alocação de Recursos
              </h5>
              <p className="text-sm text-gray-600">
                Analise distribuição de carga de trabalho e ajuste composição da
                equipa ou agendamento para maximizar eficiência e minimizar
                gargalos operacionais.
              </p>
            </div>
          </div>
        </>
      ),
    },
  ],
  dependencies: <FeatureDependenciesHelp context="team-management" />,
  roles: <RoleBasedHelp context="team-management" />,
};
