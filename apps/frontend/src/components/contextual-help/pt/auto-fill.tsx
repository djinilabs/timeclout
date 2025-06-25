import { HelpSection } from "../types";
import { FeatureDependenciesHelp } from "../components/FeatureDependenciesHelp.pt";
import { RoleBasedHelp } from "../components/RoleBasedHelp.pt";

export const autoFillHelp: HelpSection = {
  title: "Agendamento Inteligente com Preenchimento Automático",
  description: (
    <>
      Aproveite o poder da otimização de agendamento orientada por IA. A
      funcionalidade de preenchimento automático atribui inteligentemente
      membros da equipa aos turnos com base nas suas qualificações,
      disponibilidade, preferências e regras de distribuição de carga de
      trabalho. Este algoritmo avançado garante cobertura ideal mantendo a
      justiça e conformidade com as políticas e regulamentos da sua equipa.
    </>
  ),
  features: [
    {
      title: "Correspondência Inteligente de Qualificações",
      description:
        "Corresponde automaticamente membros da equipa aos turnos com base nas suas qualificações e certificações específicas. O sistema garante que apenas indivíduos qualificados sejam atribuídos a posições que requerem competências particulares, mantendo padrões operacionais e conformidade de segurança.",
    },
    {
      title: "Resolução Avançada de Conflitos",
      description:
        "Resolve inteligentemente conflitos de agendamento incluindo reservas duplas, violações de períodos de descanso e incompatibilidades de qualificação. O algoritmo encontra soluções ótimas que minimizam perturbações mantendo a integridade do horário e satisfação da equipa.",
    },
    {
      title: "Otimização de Equilíbrio de Carga de Trabalho",
      description:
        "Distribui turnos de forma justa entre membros da equipa, considerando a sua carga de trabalho atual, preferências e padrões de atribuição históricos. O sistema previne sobrecarga garantindo que todos os membros da equipa tenham oportunidades apropriadas.",
    },
    {
      title: "Agendamento Consciente de Preferências",
      description:
        "Tem em conta as preferências dos membros da equipa, padrões de disponibilidade e histórico de agendamento para criar horários que funcionem para todos. O sistema aprende com atribuições passadas para melhorar decisões futuras de agendamento.",
    },
    {
      title: "Conformidade Regulatória",
      description:
        "Garante que os horários cumprem regulamentações laborais, incluindo períodos mínimos de descanso, horas máximas de trabalho e requisitos de qualificação. O sistema sinaliza automaticamente potenciais problemas de conformidade e sugere alternativas.",
    },
    {
      title: "Otimização em Tempo Real",
      description:
        "Otimiza continuamente horários à medida que nova informação se torna disponível. O sistema pode ajustar atribuições em tempo real para acomodar alterações de última hora, emergências ou novos requisitos.",
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
              turno e os seus requisitos de qualificação, horários e
              necessidades especiais
            </li>
            <li>
              <strong>Avaliar Disponibilidade:</strong> Verifica a
              disponibilidade dos membros da equipa, compromissos existentes e
              preferências de agendamento
            </li>
            <li>
              <strong>Corresponder Qualificações:</strong> Identifica membros da
              equipa com as competências e certificações necessárias para cada
              posição
            </li>
            <li>
              <strong>Otimizar Distribuição:</strong> Equilibra a carga de
              trabalho entre membros da equipa respeitando as suas preferências
              e limitações
            </li>
            <li>
              <strong>Validar Conformidade:</strong> Garante que o horário
              proposto cumpre todos os requisitos regulatórios e políticos
            </li>
            <li>
              <strong>Gerar Horário:</strong> Cria o horário final otimizado com
              todas as atribuições e resoluções de conflitos
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
              todas as qualificações dos membros da equipa estão atuais e
              refletem com precisão as suas capacidades
            </li>
            <li>
              <strong>Definir Preferências Claras:</strong> Encoraje membros da
              equipa a definir as suas preferências de disponibilidade e
              restrições de agendamento
            </li>
            <li>
              <strong>Rever Antes de Publicar:</strong> Sempre reveja horários
              gerados automaticamente antes de publicar para garantir que
              satisfazem as suas necessidades específicas
            </li>
            <li>
              <strong>Usar como Ponto de Partida:</strong> Considere resultados
              de preenchimento automático como um ponto de partida que pode ser
              ajustado manualmente para circunstâncias especiais
            </li>
            <li>
              <strong>Monitorizar Performance:</strong> Acompanhe quão bem o
              preenchimento automático funciona e ajuste parâmetros ou
              preferências conforme necessário
            </li>
            <li>
              <strong>Comunicar Alterações:</strong> Informe membros da equipa
              sobre o uso de preenchimento automático e como afeta os seus
              horários
            </li>
            <li>
              <strong>Publicar Resultados:</strong> Lembre-se de publicar
              horários gerados automaticamente para os tornar visíveis aos
              membros da equipa
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
                Use preenchimento automático para agendamento semanal ou mensal
                de rotina quando tem requisitos consistentes e disponibilidade
                da equipa.
              </p>
            </div>
            <div>
              <h5 className="font-medium text-gray-800">
                Requisitos Complexos de Qualificação
              </h5>
              <p className="text-sm text-gray-600">
                Ideal quando tem múltiplas posições que requerem qualificações
                diferentes e precisa garantir correspondência adequada de
                competências.
              </p>
            </div>
            <div>
              <h5 className="font-medium text-gray-800">
                Gestão de Equipas Grandes
              </h5>
              <p className="text-sm text-gray-600">
                Especialmente valioso para equipas com muitos membros onde o
                agendamento manual seria demorado e propenso a erros.
              </p>
            </div>
            <div>
              <h5 className="font-medium text-gray-800">
                Ambientes Críticos de Conformidade
              </h5>
              <p className="text-sm text-gray-600">
                Use quando precisa garantir aderência estrita a regulamentações
                laborais e requisitos de qualificação.
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
