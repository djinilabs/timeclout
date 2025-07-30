import { HelpSection } from "../types";
import { FeatureDependenciesHelp } from "../components/FeatureDependenciesHelp.pt";
import { RoleBasedHelp } from "../components/RoleBasedHelp.pt";

export const autoFillHelp: HelpSection = {
  title: "Preenchimento Automático de Agendamento",
  description: (
    <>
      <strong>Atribua automaticamente membros da equipa</strong> aos turnos
      usando algoritmos inteligentes. O sistema corresponde qualificações,
      equilibra carga de trabalho e resolve conflitos.
    </>
  ),
  features: [
    {
      title: "Atribuição Inteligente",
      description:
        "Corresponde automaticamente membros qualificados aos turnos baseado em competências e disponibilidade",
    },
    {
      title: "Resolução de Conflitos",
      description:
        "Resolve conflitos de agendamento como reservas duplas e violações de períodos de descanso",
    },
    {
      title: "Equilíbrio de Carga de Trabalho",
      description:
        "Distribui turnos de forma justa entre membros da equipa para prevenir sobrecarga",
    },
  ],
  sections: [
    {
      title: "Como Usar o Preenchimento Automático",
      content: (
        <div className="space-y-2">
          <p className="text-xs text-gray-600">
            1. Clique no botão <strong>"Preenchimento Automático"</strong> no
            calendário
          </p>
          <p className="text-xs text-gray-600">
            2. Selecione o <strong>intervalo de datas</strong> que quer
            preencher
          </p>
          <p className="text-xs text-gray-600">
            3. Escolha as suas <strong>preferências de otimização</strong>:
          </p>
          <div className="pl-4 space-y-1">
            <p className="text-xs text-gray-600">
              • <strong>Equilíbrio:</strong> Distribuição igual de turnos
            </p>
            <p className="text-xs text-gray-600">
              • <strong>Eficiência:</strong> Minimizar inconveniência total
            </p>
            <p className="text-xs text-gray-600">
              • <strong>Preferências:</strong> Respeitar preferências dos
              membros
            </p>
          </div>
          <p className="text-xs text-gray-600">
            4. Clique em <strong>"Executar Preenchimento Automático"</strong>{" "}
            para gerar atribuições
          </p>
          <p className="text-xs text-gray-600">
            5. <strong>Revise</strong> os resultados e publique se estiver
            satisfeito
          </p>
        </div>
      ),
    },
    {
      title: "O que o Preenchimento Automático Considera",
      content: (
        <div className="space-y-2">
          <div className="flex items-start text-xs">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 mr-2 flex-shrink-0"></div>
            <div>
              <strong>Qualificações:</strong> Só atribui membros com
              competências necessárias
            </div>
          </div>
          <div className="flex items-start text-xs">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-1 mr-2 flex-shrink-0"></div>
            <div>
              <strong>Disponibilidade:</strong> Verifica conflitos com
              atribuições existentes
            </div>
          </div>
          <div className="flex items-start text-xs">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-1 mr-2 flex-shrink-0"></div>
            <div>
              <strong>Períodos de Descanso:</strong> Garante descanso mínimo
              entre turnos
            </div>
          </div>
          <div className="flex items-start text-xs">
            <div className="w-2 h-2 bg-purple-500 rounded-full mt-1 mr-2 flex-shrink-0"></div>
            <div>
              <strong>Carga de Trabalho:</strong> Equilibra distribuição de
              turnos pela equipa
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Após o Preenchimento Automático",
      content: (
        <div className="space-y-2">
          <p className="text-xs text-gray-600">
            • <strong>Revise as atribuições</strong> antes de publicar
          </p>
          <p className="text-xs text-gray-600">
            • <strong>Ajustes manuais</strong> podem ser feitos se necessário
          </p>
          <p className="text-xs text-gray-600">
            • <strong>Publique</strong> quando estiver satisfeito com os
            resultados
          </p>
          <p className="text-xs text-gray-600">
            • <strong>Reverta</strong> para o estado anterior se não estiver
            satisfeito
          </p>
        </div>
      ),
    },
  ],
  screenshots: [
    {
      caption: "Diálogo de preenchimento automático com opções de otimização",
      alt: "Configuração de preenchimento automático",
    },
    {
      caption: "Vista de resultados mostrando membros atribuídos",
      alt: "Resultados do preenchimento automático",
    },
  ],
  dependencies: <FeatureDependenciesHelp context="auto-fill" />,
  roles: <RoleBasedHelp context="auto-fill" />,
};
