import { HelpSection } from "../types";
import { FeatureDependenciesHelp } from "../components/FeatureDependenciesHelp.pt";
import { RoleBasedHelp } from "../components/RoleBasedHelp.pt";

export const companyDashboardHelp: HelpSection = {
  title: "Painel de Gestão da Empresa",
  description: (
    <>
      O seu <strong>centro de comando central</strong> para gerir toda a
      organização. O painel da empresa fornece <em>supervisão abrangente</em> de
      todas as unidades, equipas e operações da empresa. Desde{" "}
      <strong>planeamento estratégico</strong> até{" "}
      <em>monitorização operacional</em>, esta interface poderosa dá-lhe{" "}
      <u>visibilidade e controlo completos</u> sobre a gestão da força de
      trabalho da sua organização, garantindo{" "}
      <strong>consistência, eficiência e conformidade</strong> em todos os
      níveis.
    </>
  ),
  features: [
    {
      title: "Gestão Estratégica de Unidades",
      description: (
        <>
          Crie e gere <strong>unidades de negócio</strong> que representam
          diferentes departamentos, localizações ou divisões operacionais dentro
          da sua empresa. Cada unidade pode ter as suas próprias{" "}
          <em>equipas, políticas e parâmetros operacionais</em> mantendo
          alinhamento com <u>padrões da empresa</u>.
        </>
      ),
    },
    {
      title: "Visão Geral Abrangente de Equipas",
      description: (
        <>
          Visualize todas as equipas em diferentes unidades com o seu{" "}
          <strong>estado atual</strong>, <em>métricas de performance</em> e
          saúde operacional. Obtenha insights instantâneos sobre{" "}
          <u>composição da equipa</u>, eficiência de agendamento e utilização de
          recursos em toda a sua organização.
        </>
      ),
    },
    {
      title: "Controlo de Políticas da Empresa",
      description: (
        <>
          Configure e gere <strong>políticas da empresa</strong>, padrões e
          procedimentos operacionais que se aplicam a todas as unidades e
          equipas. Garanta <em>consistência</em> em práticas de agendamento,
          políticas de licença e <u>requisitos de qualificação</u> em toda a
          organização.
        </>
      ),
    },
    {
      title: "Análise Organizacional",
      description: (
        <>
          Aceda a <strong>análises de alto nível</strong> e relatórios sobre
          performance organizacional, incluindo{" "}
          <em>utilização da força de trabalho</em>, eficiência de agendamento e
          métricas operacionais. Use <u>insights baseados em dados</u> para
          tomar decisões estratégicas e otimizar performance organizacional.
        </>
      ),
    },
    {
      title: "Controlo de Acesso Multi-Nível",
      description: (
        <>
          Gere <strong>acesso de utilizadores e permissões</strong> em
          diferentes níveis organizacionais. Configure{" "}
          <em>controlos de acesso baseados em funções</em> que garantem
          visibilidade e capacidades apropriadas para diferentes tipos de
          utilizadores em toda a organização.
        </>
      ),
    },
    {
      title: "Estrutura Organizacional Escalável",
      description: (
        <>
          Construa e mantenha uma{" "}
          <strong>estrutura organizacional escalável</strong> que pode crescer
          com o seu negócio. Adicione novas unidades, reestruture as existentes
          e mantenha <em>eficiência operacional</em> à medida que a sua
          organização evolui e se expande.
        </>
      ),
    },
  ],
  sections: [
    {
      title: "Processo de Configuração Organizacional",
      content: (
        <>
          <p>
            Siga este processo estratégico para configurar a sua organização
            eficazmente:
          </p>
          <ol className="space-y-2">
            <li>
              <strong>Definir Estrutura Organizacional:</strong> Estabeleça a
              estrutura geral da sua empresa com{" "}
              <em>divisões claras de unidades</em> e
              <strong>relações de reporte</strong>
            </li>
            <li>
              <strong>Configurar Políticas da Empresa:</strong> Configure{" "}
              <u>políticas da empresa</u> para agendamento, gestão de licenças,
              qualificações e procedimentos operacionais
            </li>
            <li>
              <strong>Criar Unidades de Negócio:</strong> Estabeleça unidades
              que representam diferentes{" "}
              <em>departamentos, localizações ou áreas operacionais</em> dentro
              da sua organização
            </li>
            <li>
              <strong>Configurar Equipas:</strong> Crie equipas dentro de cada
              unidade com <strong>propósitos específicos</strong>, configurações
              e atribuições de membros
            </li>
            <li>
              <strong>Estabelecer Sistemas de Monitorização:</strong> Implemente{" "}
              <em>sistemas de análise e relatórios</em> para acompanhar
              performance organizacional e identificar{" "}
              <u>oportunidades de otimização</u>
            </li>
            <li>
              <strong>Configurar Controlos de Acesso:</strong> Configure{" "}
              <strong>funções de utilizador e permissões</strong> apropriadas
              para garantir operações seguras e eficientes
            </li>
          </ol>
        </>
      ),
    },
    {
      title: "Boas Práticas de Gestão Estratégica",
      content: (
        <>
          <ul className="space-y-2">
            <li>
              <strong>Hierarquia Organizacional Clara:</strong> Mantenha uma
              estrutura organizacional bem definida com{" "}
              <em>relações de reporte claras</em> e{" "}
              <strong>responsabilidade</strong> em todos os níveis
            </li>
            <li>
              <strong>Implementação Consistente de Políticas:</strong> Garanta
              que políticas da empresa são <u>aplicadas consistentemente</u> em
              todas as unidades permitindo{" "}
              <em>adaptações específicas da unidade</em> quando necessário
            </li>
            <li>
              <strong>Revisões Regulares de Performance:</strong> Realize
              avaliações periódicas de{" "}
              <strong>performance organizacional</strong>, eficiência da unidade
              e eficácia da equipa para identificar{" "}
              <em>oportunidades de melhoria</em>
            </li>
            <li>
              <strong>Tomada de Decisões Baseada em Dados:</strong> Use{" "}
              <u>análises organizacionais</u> e métricas de performance para
              tomar decisões estratégicas informadas sobre{" "}
              <strong>alocação de recursos</strong> e otimização operacional
            </li>
            <li>
              <strong>Planeamento de Crescimento Escalável:</strong> Projete
              estruturas e processos organizacionais que podem acomodar{" "}
              <em>crescimento e mudança</em> mantendo{" "}
              <strong>eficiência operacional</strong>
            </li>
            <li>
              <strong>Cultura de Melhoria Contínua:</strong> Fomente uma cultura
              de melhoria contínua revendo regularmente <em>processos</em>,
              recolhendo feedback e implementando{" "}
              <u>melhorias organizacionais</u>
            </li>
          </ul>
        </>
      ),
    },
    {
      title: "Estratégias de Otimização Organizacional",
      content: (
        <>
          <div className="space-y-3">
            <div>
              <h5 className="font-medium text-gray-800">
                Monitorização de Performance
              </h5>
              <p className="text-sm text-gray-600">
                Reveja regularmente <strong>métricas organizacionais</strong>,
                performance da unidade e eficiência da equipa para identificar
                áreas de <em>melhoria e otimização</em> em toda a empresa.
              </p>
            </div>
            <div>
              <h5 className="font-medium text-gray-800">
                Otimização de Recursos
              </h5>
              <p className="text-sm text-gray-600">
                Analise <em>utilização de recursos</em> entre unidades e equipas
                para identificar oportunidades de melhor{" "}
                <strong>alocação e melhorias de eficiência</strong>.
              </p>
            </div>
            <div>
              <h5 className="font-medium text-gray-800">
                Padronização de Políticas
              </h5>
              <p className="text-sm text-gray-600">
                Garanta <strong>aplicação consistente</strong> de políticas da
                empresa permitindo
                <em>adaptações específicas da unidade</em> necessárias para
                satisfazer necessidades operacionais locais.
              </p>
            </div>
            <div>
              <h5 className="font-medium text-gray-800">
                Planeamento de Crescimento
              </h5>
              <p className="text-sm text-gray-600">
                Planeie <strong>crescimento organizacional</strong> projetando{" "}
                <em>estruturas e processos escaláveis</em> que podem acomodar
                expansão mantendo eficiência operacional.
              </p>
            </div>
          </div>
        </>
      ),
    },
  ],
  dependencies: <FeatureDependenciesHelp context="company-dashboard" />,
  roles: <RoleBasedHelp context="company-dashboard" />,
};
