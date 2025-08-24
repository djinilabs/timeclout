import { createContext, ReactNode, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";

import type {
  Company,
  Query,
  QueryCompanyArgs as QueryCompanyArguments,
  Team,
  Unit,
} from "../graphql/graphql";
import { useQuery } from "../hooks/useQuery";

import companyQuery from "@/graphql-client/queries/companyQuery.graphql";
import { teamWithMembers } from "@/graphql-client/queries/teamWithMembers.graphql";


export interface EntityNavigationContextType {
  companyPk: string | undefined;
  company: Company | undefined;
  unitPk: string | undefined;
  unit: Unit | undefined;
  teamPk: string | undefined;
  team: Team | undefined;
  refresh: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const EntityNavigationContext = createContext<
  EntityNavigationContextType | undefined
>(undefined);

export const EntityNavigationContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { company: companyPk, unit: unitPk, team: teamPk } = useParams();

  const [queryResponse, refetchCompany] = useQuery<
    { company: Query["company"] },
    QueryCompanyArguments
  >({
    query: companyQuery,
    variables: {
      companyPk: companyPk ?? "",
    },
    pause: !companyPk,
  });

  const company = companyPk ? queryResponse.data?.company : undefined;

  const unit = company?.units?.find((unit) => unit.pk === `units/${unitPk}`);

  const [teamQueryResponse, refetchTeam] = useQuery<{ team: Query["team"] }>({
    query: teamWithMembers,
    variables: {
      teamPk,
    },
    pause: !teamPk,
  });

  const team = teamPk ? teamQueryResponse.data?.team : undefined;

  const refresh = useCallback(() => {
    refetchCompany();
    refetchTeam();
  }, [refetchCompany, refetchTeam]);

  return (
    <EntityNavigationContext.Provider
      value={useMemo(
        () => ({ companyPk, company, unitPk, unit, teamPk, team, refresh }),
        [companyPk, company, unitPk, unit, teamPk, team, refresh]
      )}
    >
      {children}
    </EntityNavigationContext.Provider>
  );
};
