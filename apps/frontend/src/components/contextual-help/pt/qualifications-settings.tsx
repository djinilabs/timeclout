import { HelpSection } from "../types";
import { FeatureDependenciesHelp } from "../components/FeatureDependenciesHelp.pt";
import { RoleBasedHelp } from "../components/RoleBasedHelp.pt";

export const qualificationsSettingsHelp: HelpSection = {
  title: "Gestão de Qualificações",
  description: (
    <>
      Gerir qualificações e requisitos de competências dos membros da equipa.
      Crie e configure qualificações que definem as capacidades e conhecimentos
      necessários para diferentes funções. Utilize esta interface para garantir
      uma correspondência adequada de competências e cobertura da equipa.
    </>
  ),
  features: [
    {
      title: "Criação de Qualificações",
      description:
        "Crie novas qualificações com nomes e cores personalizados. Defina as competências e capacidades necessárias para diferentes funções e posições da equipa.",
    },
    {
      title: "Atribuição de Qualificações",
      description:
        "Atribua qualificações aos membros da equipa através de uma interface intuitiva. Utilize o sistema de emblemas para adicionar ou remover rapidamente qualificações dos membros da equipa.",
    },
    {
      title: "Organização Visual",
      description:
        "Os emblemas de qualificação codificados por cores facilitam a identificação das capacidades dos membros da equipa num relance. Cada qualificação tem a sua própria cor distinta para reconhecimento rápido.",
    },
    {
      title: "Gestão de Qualificações",
      description:
        "Adicione ou remova facilmente qualificações utilizando o menu pendente. A interface mostra as qualificações disponíveis e impede atribuições duplicadas.",
    },
  ],
  sections: [
    {
      title: "Configurar Qualificações",
      content: (
        <>
          <p>Para configurar as qualificações da equipa:</p>
          <ol>
            <li>Navegue até ao separador de definições de qualificações</li>
            <li>Crie novas qualificações com nomes e cores apropriados</li>
            <li>
              Atribua qualificações aos membros da equipa utilizando o sistema
              de emblemas
            </li>
            <li>
              Utilize o botão + para adicionar novas qualificações aos membros
              da equipa
            </li>
            <li>
              Remova qualificações clicando no X no emblema da qualificação
            </li>
          </ol>
        </>
      ),
    },
    {
      title: "Boas Práticas",
      content: (
        <>
          <ul>
            <li>
              Crie nomes de qualificação claros e específicos que reflitam as
              competências reais
            </li>
            <li>
              Utilize cores distintas para diferentes tipos de qualificação
            </li>
            <li>
              Reveja e atualize regularmente as qualificações dos membros da
              equipa
            </li>
            <li>
              Garanta que as qualificações estão alinhadas com os requisitos das
              posições de turno
            </li>
            <li>Mantenha a lista de qualificações gerível e relevante</li>
          </ul>
        </>
      ),
    },
  ],
  dependencies: <FeatureDependenciesHelp context="qualifications-settings" />,
  roles: <RoleBasedHelp context="qualifications-settings" />,
};
