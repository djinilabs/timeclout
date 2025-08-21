import { HelpSection } from "../types";

export const unassignShiftHelp: HelpSection = {
  title: "Desatribuir Posições de Turno",
  description:
    "Remova atribuições de posições de turno para um intervalo de datas específico.",
  features: [
    {
      title: "Seleção de Intervalo de Datas",
      description:
        "Selecione uma data de início e fim para desatribuir todas as posições de turno nesse período. O seletor de datas suporta seleção de um único dia ou de um intervalo.",
    },
    {
      title: "Desatribuição em Massa",
      description:
        "Remova de forma eficiente múltiplas atribuições de posições de turno de uma só vez ao selecionar um intervalo de datas. Isto é útil quando precisa de limpar atribuições para um período específico.",
    },
  ],
  sections: [
    {
      title: "Como Utilizar",
      content: (
        <div className="space-y-2">
          <p>
            1. Selecione um intervalo de datas utilizando o seletor de datas
          </p>
          <p>
            2. Reveja as datas selecionadas para garantir que abrangem o período
            correto
          </p>
          <p>
            3. Clique em &quot;Desatribuir&quot; para remover todas as
            atribuições de posições de turno dentro do intervalo selecionado
          </p>
          <p>
            4. Uma mensagem de confirmação aparecerá quando a operação for
            bem-sucedida
          </p>
        </div>
      ),
    },
    {
      title: "Notas Importantes",
      content: (
        <div className="space-y-2">
          <p>
            • Esta ação não pode ser anulada - todas as atribuições de posições
            de turno dentro do intervalo selecionado serão removidas
            permanentemente
          </p>
          <p>
            • Certifique-se de comunicar com os membros da equipa antes de
            desatribuir turnos
          </p>
          <p>
            • A operação afetará todas as posições de turno dentro do intervalo
            de datas selecionado
          </p>
        </div>
      ),
    },
  ],
};
