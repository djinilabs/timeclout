import { HelpSection } from "../types";
import { FeatureDependenciesHelp } from "../components/FeatureDependenciesHelp.pt";
import { RoleBasedHelp } from "../components/RoleBasedHelp.pt";

export const autoFillHelp: HelpSection = {
  title: "Agendamento Inteligente com Preenchimento Automático",
  description: (
    <>
      Aproveite o poder da{" "}
      <strong>otimização de agendamento orientada por IA</strong>. A
      funcionalidade de preenchimento automático atribui inteligentemente
      membros da equipa aos turnos com base nas suas{" "}
      <em>qualificações, disponibilidade, preferências</em> e{" "}
      <u>regras de distribuição de carga de trabalho</u>. Este algoritmo
      avançado garante <strong>cobertura ideal</strong> mantendo a justiça e
      conformidade com as políticas e regulamentos da sua equipa.
    </>
  ),
  features: [
    {
      title: "Correspondência Inteligente de Qualificações",
      description: (
        <>
          Corresponde automaticamente membros da equipa aos turnos com base nas
          suas <strong>qualificações específicas</strong> e certificações. O
          sistema garante que apenas <em>indivíduos qualificados</em> sejam
          atribuídos a posições que requerem competências particulares, mantendo{" "}
          <u>padrões operacionais</u> e conformidade de segurança.
        </>
      ),
    },
    {
      title: "Resolução Avançada de Conflitos",
      description: (
        <>
          Resolve inteligentemente conflitos de agendamento incluindo{" "}
          <u>reservas duplas</u>, <em>violações de períodos de descanso</em> e{" "}
          <strong>incompatibilidades de qualificação</strong>. O algoritmo
          encontra soluções ótimas que minimizam perturbações mantendo a{" "}
          <strong>integridade do horário</strong> e satisfação da equipa.
        </>
      ),
    },
    {
      title: "Otimização de Equilíbrio de Carga de Trabalho",
      description: (
        <>
          Distribui turnos <em>de forma justa</em> entre membros da equipa,
          considerando a sua <strong>carga de trabalho atual</strong>,
          preferências e padrões de atribuição históricos. O sistema previne{" "}
          <u>sobrecarga</u> garantindo que todos os membros da equipa tenham
          oportunidades apropriadas.
        </>
      ),
    },
    {
      title: "Agendamento Consciente de Preferências",
      description: (
        <>
          Tem em conta as <strong>preferências</strong> dos membros da equipa,{" "}
          <em>padrões de disponibilidade</em> e histórico de agendamento para
          criar horários que funcionem para todos. O sistema{" "}
          <u>aprende com atribuições passadas</u> para melhorar decisões futuras
          de agendamento.
        </>
      ),
    },
    {
      title: "Conformidade Regulatória",
      description: (
        <>
          Garante que os horários cumprem{" "}
          <strong>regulamentações laborais</strong>, incluindo{" "}
          <em>períodos mínimos de descanso</em>, horas máximas de trabalho e
          requisitos de qualificação. O sistema sinaliza automaticamente{" "}
          <u>potenciais problemas de conformidade</u> e sugere alternativas.
        </>
      ),
    },
    {
      title: "Otimização em Tempo Real",
      description: (
        <>
          Otimiza continuamente horários à medida que <em>nova informação</em>{" "}
          se torna disponível. O sistema pode ajustar atribuições em{" "}
          <strong>tempo real</strong> para acomodar{" "}
          <u>alterações de última hora</u>, emergências ou novos requisitos.
        </>
      ),
    },
  ],
  sections: [
    {
      title: "Como Funciona o Preenchimento Automático",
      content: (
        <>
          <p>
            O algoritmo de preenchimento automático segue estes passos para
            criar horários ótimos:
          </p>
          <ol className="space-y-2">
            <li>
              <strong>Analisar Requisitos:</strong> Revisa todas as posições de
              turno e os seus <em>requisitos de qualificação</em>,{" "}
              <strong>horários</strong> e necessidades especiais
            </li>
            <li>
              <strong>Avaliar Disponibilidade:</strong> Verifica a
              <em>disponibilidade</em> dos membros da equipa, compromissos
              existentes e <u>preferências de agendamento</u>
            </li>
            <li>
              <strong>Corresponder Qualificações:</strong> Identifica membros da
              equipa com as <strong>competências necessárias</strong> e
              certificações para cada posição
            </li>
            <li>
              <strong>Otimizar Distribuição:</strong> Equilibra a{" "}
              <em>carga de trabalho</em> entre membros da equipa respeitando as
              suas <u>preferências e limitações</u>
            </li>
            <li>
              <strong>Validar Conformidade:</strong> Garante que o horário
              proposto cumpre todos os{" "}
              <strong>requisitos regulatórios e políticos</strong>
            </li>
            <li>
              <strong>Gerar Horário:</strong> Cria o{" "}
              <em>horário final otimizado</em> com todas as atribuições e
              resoluções de conflitos
            </li>
          </ol>
        </>
      ),
    },
    {
      title: "Boas Práticas para Preenchimento Automático",
      content: (
        <>
          <ul className="space-y-2">
            <li>
              <strong>Manter Qualificações Atualizadas:</strong> Garanta que
              todas as qualificações dos membros da equipa estão{" "}
              <em>atuais e precisas</em> e refletem as suas capacidades
            </li>
            <li>
              <strong>Definir Preferências Claras:</strong> Encoraje membros da
              equipa a definir as suas <u>preferências de disponibilidade</u> e
              restrições de agendamento
            </li>
            <li>
              <strong>Rever Antes de Publicar:</strong> Sempre reveja horários
              gerados automaticamente antes de publicar para garantir que
              satisfazem as suas <strong>necessidades específicas</strong>
            </li>
            <li>
              <strong>Usar como Ponto de Partida:</strong> Considere resultados
              de preenchimento automático como um <em>ponto de partida</em> que
              pode ser ajustado manualmente para <u>circunstâncias especiais</u>
            </li>
            <li>
              <strong>Monitorizar Performance:</strong> Acompanhe quão bem o
              preenchimento automático funciona e ajuste{" "}
              <strong>parâmetros ou preferências</strong> conforme necessário
            </li>
            <li>
              <strong>Comunicar Alterações:</strong> Informe membros da equipa
              sobre o uso de preenchimento automático e como afeta os seus{" "}
              <em>horários</em>
            </li>
            <li>
              <strong>Publicar Resultados:</strong> Lembre-se de{" "}
              <u>publicar horários gerados automaticamente</u> para os tornar
              visíveis aos membros da equipa
            </li>
          </ul>
        </>
      ),
    },
    {
      title: "Quando Usar Preenchimento Automático",
      content: (
        <>
          <div className="space-y-3">
            <div>
              <h5 className="font-medium text-gray-800">
                Perfeito para Agendamento Regular
              </h5>
              <p className="text-sm text-gray-600">
                Use preenchimento automático para{" "}
                <em>agendamento semanal ou mensal de rotina</em> quando tem{" "}
                <strong>requisitos consistentes</strong> e disponibilidade da
                equipa.
              </p>
            </div>
            <div>
              <h5 className="font-medium text-gray-800">
                Requisitos Complexos de Qualificação
              </h5>
              <p className="text-sm text-gray-600">
                Ideal quando tem <strong>múltiplas posições</strong> que
                requerem qualificações diferentes e precisa garantir{" "}
                <em>correspondência adequada de competências</em>.
              </p>
            </div>
            <div>
              <h5 className="font-medium text-gray-800">
                Gestão de Equipas Grandes
              </h5>
              <p className="text-sm text-gray-600">
                Especialmente valioso para equipas com <em>muitos membros</em>{" "}
                onde o agendamento manual seria{" "}
                <u>demorado e propenso a erros</u>.
              </p>
            </div>
            <div>
              <h5 className="font-medium text-gray-800">
                Ambientes Críticos de Conformidade
              </h5>
              <p className="text-sm text-gray-600">
                Use quando precisa garantir <strong>aderência estrita</strong> a
                regulamentações laborais e <em>requisitos de qualificação</em>.
              </p>
            </div>
          </div>
        </>
      ),
    },
  ],
  dependencies: <FeatureDependenciesHelp context="auto-fill" />,
  roles: <RoleBasedHelp context="autoFill" />,
};
