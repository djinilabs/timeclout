import { HelpSection } from "../types";
import { FeatureDependenciesHelp } from "../components/FeatureDependenciesHelp.pt";
import { RoleBasedHelp } from "../components/RoleBasedHelp.pt";

export const companyDashboardHelp: HelpSection = {
  title: "Painel de Gestão da Empresa",
  description: (
    <>
      O seu centro de comando central para gerir toda a organização. O painel da
      empresa fornece supervisão abrangente de todas as unidades, equipas e
      operações da empresa. Desde planeamento estratégico até monitorização
      operacional, esta interface poderosa dá-lhe visibilidade e controlo
      completos sobre a gestão da força de trabalho da sua organização,
      garantindo consistência, eficiência e conformidade em todos os níveis.
    </>
  ),
  features: [
    {
      title: "Gestão Estratégica de Unidades",
      description:
        "Crie e gere unidades de negócio que representam diferentes departamentos, localizações ou divisões operacionais dentro da sua empresa. Cada unidade pode ter as suas próprias equipas, políticas e parâmetros operacionais mantendo alinhamento com padrões da empresa.",
    },
    {
      title: "Visão Geral Abrangente de Equipas",
      description:
        "Visualize todas as equipas em diferentes unidades com o seu estado atual, métricas de performance e saúde operacional. Obtenha insights instantâneos sobre composição da equipa, eficiência de agendamento e utilização de recursos em toda a sua organização.",
    },
    {
      title: "Controlo de Políticas da Empresa",
      description:
        "Configure e gere políticas da empresa, padrões e procedimentos operacionais que se aplicam a todas as unidades e equipas. Garanta consistência em práticas de agendamento, políticas de licença e requisitos de qualificação em toda a organização.",
    },
    {
      title: "Análise Organizacional",
      description:
        "Aceda a análises de alto nível e relatórios sobre performance organizacional, incluindo utilização da força de trabalho, eficiência de agendamento e métricas operacionais. Use insights baseados em dados para tomar decisões estratégicas e otimizar performance organizacional.",
    },
    {
      title: "Controlo de Acesso Multi-Nível",
      description:
        "Gere acesso de utilizadores e permissões em diferentes níveis organizacionais. Configure controlos de acesso baseados em funções que garantem visibilidade e capacidades apropriadas para diferentes tipos de utilizadores em toda a organização.",
    },
    {
      title: "Estrutura Organizacional Escalável",
      description:
        "Construa e mantenha uma estrutura organizacional escalável que pode crescer com o seu negócio. Adicione novas unidades, reestruture as existentes e mantenha eficiência operacional à medida que a sua organização evolui e se expande.",
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
              estrutura geral da sua empresa com divisões claras de unidades e
              relações de reporte
            </li>
            <li>
              <strong>Configurar Políticas da Empresa:</strong> Configure
              políticas da empresa para agendamento, gestão de licenças,
              qualificações e procedimentos operacionais
            </li>
            <li>
              <strong>Criar Unidades de Negócio:</strong> Estabeleça unidades
              que representam diferentes departamentos, localizações ou áreas
              operacionais dentro da sua organização
            </li>
            <li>
              <strong>Configurar Equipas:</strong> Crie equipas dentro de cada
              unidade com propósitos, configurações e atribuições de membros
              específicos
            </li>
            <li>
              <strong>Estabelecer Sistemas de Monitorização:</strong> Implemente
              sistemas de análise e relatórios para acompanhar performance
              organizacional e identificar oportunidades de otimização
            </li>
            <li>
              <strong>Configurar Controlos de Acesso:</strong> Configure funções
              de utilizador e permissões apropriadas para garantir operações
              seguras e eficientes
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
              estrutura organizacional bem definida com relações de reporte
              claras e responsabilidade em todos os níveis
            </li>
            <li>
              <strong>Implementação Consistente de Políticas:</strong> Garanta
              que políticas da empresa são aplicadas consistentemente em todas
              as unidades permitindo adaptações específicas da unidade quando
              necessário
            </li>
            <li>
              <strong>Revisões Regulares de Performance:</strong> Realize
              avaliações periódicas de performance organizacional, eficiência da
              unidade e eficácia da equipa para identificar oportunidades de
              melhoria
            </li>
            <li>
              <strong>Tomada de Decisões Baseada em Dados:</strong> Use análises
              organizacionais e métricas de performance para tomar decisões
              estratégicas informadas sobre alocação de recursos e otimização
              operacional
            </li>
            <li>
              <strong>Planeamento de Crescimento Escalável:</strong> Projete
              estruturas e processos organizacionais que podem acomodar
              crescimento e mudança mantendo eficiência operacional
            </li>
            <li>
              <strong>Cultura de Melhoria Contínua:</strong> Fomente uma cultura
              de melhoria contínua revendo regularmente processos, recolhendo
              feedback e implementando melhorias organizacionais
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
                Reveja regularmente métricas organizacionais, performance da
                unidade e eficiência da equipa para identificar áreas de
                melhoria e otimização em toda a empresa.
              </p>
            </div>
            <div>
              <h5 className="font-medium text-gray-800">
                Otimização de Recursos
              </h5>
              <p className="text-sm text-gray-600">
                Analise utilização de recursos entre unidades e equipas para
                identificar oportunidades de melhor alocação e melhorias de
                eficiência.
              </p>
            </div>
            <div>
              <h5 className="font-medium text-gray-800">
                Padronização de Políticas
              </h5>
              <p className="text-sm text-gray-600">
                Garanta aplicação consistente de políticas da empresa permitindo
                adaptações específicas da unidade necessárias para satisfazer
                necessidades operacionais locais.
              </p>
            </div>
            <div>
              <h5 className="font-medium text-gray-800">
                Planeamento de Crescimento
              </h5>
              <p className="text-sm text-gray-600">
                Planeie crescimento organizacional projetando estruturas e
                processos escaláveis que podem acomodar expansão mantendo
                eficiência operacional.
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
