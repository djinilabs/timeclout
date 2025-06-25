import { HelpSection } from "../types";
import { FeatureDependenciesHelp } from "../components/FeatureDependenciesHelp.pt";
import { RoleBasedHelp } from "../components/RoleBasedHelp.pt";

export const teamManagementHelp: HelpSection = {
  title: "Gestão Abrangente de Equipas",
  description: (
    <>
      Construa e gere <strong>equipas de alto desempenho</strong> dentro das
      suas unidades organizacionais. Esta interface poderosa permite-lhe criar
      equipas, atribuir membros com
      <em>funções e qualificações específicas</em>, configurar políticas
      específicas da equipa, e monitorizar <u>métricas de performance</u>. Desde
      a configuração inicial da equipa até à otimização contínua, o TT3 fornece
      todas as ferramentas que precisa para garantir que as suas equipas operem{" "}
      <strong>eficientemente e eficazmente</strong>.
    </>
  ),
  features: [
    {
      title: "Criação Estratégica de Equipas",
      description: (
        <>
          Crie equipas com <strong>propósitos específicos</strong>,
          configurações e atribuições de membros. Defina estrutura da equipa,
          hierarquia e <em>parâmetros operacionais</em> para corresponder às
          suas necessidades organizacionais. Cada equipa pode ter{" "}
          <u>configurações únicas</u> mantendo consistência com políticas da
          empresa.
        </>
      ),
    },
    {
      title: "Gestão Avançada de Membros",
      description: (
        <>
          Adicione, remova e gere membros da equipa com{" "}
          <strong>atribuições de funções detalhadas</strong> e níveis de
          permissão. Acompanhe <em>qualificações, histórico de performance</em>{" "}
          e padrões de disponibilidade dos membros. O sistema fornece{" "}
          <u>perfis abrangentes de membros</u> com toda a informação relevante
          num só local.
        </>
      ),
    },
    {
      title: "Configuração Flexível de Equipas",
      description: (
        <>
          Configure <strong>políticas específicas da equipa</strong>, horários,
          direitos de licença e requisitos de turno. Configure{" "}
          <em>padrões de trabalho, requisitos de qualificação</em> e regras
          operacionais que se alinhem com as necessidades e responsabilidades
          únicas da sua equipa.
        </>
      ),
    },
    {
      title: "Análise de Performance e Insights",
      description: (
        <>
          Aceda a <strong>métricas abrangentes de performance da equipa</strong>{" "}
          incluindo padrões de presença, indicadores de produtividade,{" "}
          <em>estatísticas de utilização de recursos</em> e tendências de
          eficiência. Use <u>insights baseados em dados</u> para otimizar
          performance da equipa e identificar oportunidades de melhoria.
        </>
      ),
    },
    {
      title: "Ferramentas de Comunicação Integradas",
      description: (
        <>
          Gere <strong>anúncios da equipa</strong>, notificações e preferências
          de comunicação. Configure <em>alertas automatizados</em> para
          alterações importantes de horário, atualizações de políticas e
          requisitos operacionais. Mantenha todos <u>informados e alinhados</u>{" "}
          com objetivos da equipa.
        </>
      ),
    },
    {
      title: "Operações de Equipa Escaláveis",
      description: (
        <>
          Escale operações de equipa <strong>eficientemente</strong> à medida
          que a sua organização cresce. Adicione novas equipas, reestruture as
          existentes e mantenha <em>consistência entre múltiplas equipas</em>{" "}
          preservando autonomia e flexibilidade individuais da equipa.
        </>
      ),
    },
  ],
  sections: [
    {
      title: "Processo de Configuração de Equipas",
      content: (
        <>
          <p>Siga este processo abrangente para configurar equipas eficazes:</p>
          <ol className="space-y-2">
            <li>
              <strong>Definir Propósito da Equipa:</strong> Estabeleça
              claramente a<em>missão, responsabilidades</em> e âmbito
              operacional da equipa dentro da sua organização
            </li>
            <li>
              <strong>Configurar Estrutura da Equipa:</strong> Configure
              hierarquia da equipa, funções e{" "}
              <strong>relações de reporte</strong> para garantir
              responsabilidade clara
            </li>
            <li>
              <strong>Estabelecer Políticas:</strong> Defina{" "}
              <u>políticas específicas da equipa</u>
              para agendamento, gestão de licenças, qualificações e
              procedimentos operacionais
            </li>
            <li>
              <strong>Adicionar Membros da Equipa:</strong> Recrute e atribua
              membros da equipa com <em>funções, permissões</em> e requisitos de
              qualificação apropriados
            </li>
            <li>
              <strong>Configurar Infraestrutura:</strong> Configure{" "}
              <strong>modelos de turno</strong>, horários de trabalho e
              parâmetros operacionais específicos às necessidades da equipa
            </li>
            <li>
              <strong>Implementar Monitorização:</strong> Estabeleça{" "}
              <em>métricas de performance</em> e sistemas de monitorização para
              acompanhar eficácia da equipa e identificar{" "}
              <u>áreas de melhoria</u>
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
              precisas de funções com <em>responsabilidades específicas</em>,
              permissões e <strong>requisitos de qualificação</strong> para cada
              posição da equipa
            </li>
            <li>
              <strong>Revisões Regulares de Performance:</strong> Realize
              avaliações periódicas de <em>composição da equipa</em>, métricas
              de performance e eficiência operacional para identificar{" "}
              <u>oportunidades de otimização</u>
            </li>
            <li>
              <strong>Distribuição Justa de Carga de Trabalho:</strong> Garanta{" "}
              <strong>distribuição equitativa</strong> de turnos,
              responsabilidades e oportunidades entre todos os membros da equipa
              para manter moral e prevenir <em>esgotamento</em>
            </li>
            <li>
              <strong>Consistência de Políticas:</strong> Mantenha
              configurações, políticas e procedimentos da equipa atualizados
              garantindo <u>alinhamento com padrões organizacionais</u> e
              requisitos regulatórios
            </li>
            <li>
              <strong>Decisões Baseadas em Dados:</strong> Use{" "}
              <em>análises e métricas de performance</em> para tomar decisões
              informadas sobre estrutura da equipa, agendamento e{" "}
              <strong>alocação de recursos</strong>
            </li>
            <li>
              <strong>Melhoria Contínua:</strong> Reveja regularmente operações
              da equipa, recolha feedback e implemente <u>melhorias</u> para
              aumentar eficiência e satisfação da equipa
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
                Reveja regularmente <em>padrões de presença</em>, métricas de
                produtividade e utilização de recursos para identificar áreas de{" "}
                <strong>melhoria e otimização</strong>.
              </p>
            </div>
            <div>
              <h5 className="font-medium text-gray-800">
                Desenvolvimento de Competências
              </h5>
              <p className="text-sm text-gray-600">
                Acompanhe <strong>lacunas de qualificação</strong> e forneça
                oportunidades de formação para aumentar capacidades da equipa e{" "}
                <em>flexibilidade operacional</em>.
              </p>
            </div>
            <div>
              <h5 className="font-medium text-gray-800">
                Melhoria da Comunicação
              </h5>
              <p className="text-sm text-gray-600">
                Otimize <em>canais de comunicação</em> e sistemas de notificação
                para garantir <strong>fluxo de informação atempado</strong> e
                coordenação da equipa.
              </p>
            </div>
            <div>
              <h5 className="font-medium text-gray-800">
                Alocação de Recursos
              </h5>
              <p className="text-sm text-gray-600">
                Analise <em>distribuição de carga de trabalho</em> e ajuste
                composição da equipa ou agendamento para maximizar{" "}
                <strong>eficiência</strong> e minimizar estrangulamentos
                operacionais.
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
