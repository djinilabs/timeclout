import { offlineExchange, Data, Entity } from "@urql/exchange-graphcache";
import { makeDefaultStorage } from "@urql/exchange-graphcache/default-storage";
import merge from "deepmerge";
import { type Session } from "next-auth";
import { fetchExchange, createClient as urqlCreateClient } from "urql";
import type { Client, ClientOptions, Exchange } from "urql";

type WithSession = {
  session: Session;
};

export interface AdditionalClientOptions {
  additionalExchanges?: Exchange[];
}

const defaultClientOptions = ({
  additionalExchanges = [],
}: AdditionalClientOptions = {}): ClientOptions => ({
  url: new URL(`/graphql`, globalThis.location.origin).toString(),
  fetchOptions: {
    credentials: "same-origin",
    headers: {},
  },
  requestPolicy: "cache-and-network",
  suspense: true,
  exchanges: [
    offlineExchange({
      storage: makeDefaultStorage(),
      keys: {
        Company: (c: Data) => c.pk as string,
        User: (u: Data) => u.pk as string,
        Unit: (u: Data) => u.pk as string,
        Team: (t: Data) => t.pk as string,
        Invitation: (index: Data) => `${index.pk}:${index.email}`,
        Leave: (l: Data) => `${l.pk}:${l.sk}`,
        LeaveRequest: (l: Data) => `${l.pk}:${l.sk}`,
        Calendar: (c: Data) => c.year?.toString() ?? "",
        Schedule: (s: Data) => s.pk?.toString() ?? "",
        UserSchedule: (s: Data) => s.pk?.toString() ?? "",
        MemberQualifications: () => null,
        ShiftPositionSchedule: () => null,
        ShiftPosition: (s: Data) => `${s.pk}:${s.sk}`,
        AutoFillWorkHour: () => null,
        AutoFillSlotWorker: () => null,
        ShiftsAutoFillParams: () => null,
        QuotaFulfilment: () => null,
        QueryShiftPositionsOutput: () => null,
      },
      updates: {
        Mutation: {
          deleteShiftPosition: (result, _arguments, cache) => {
            cache.invalidate(result.deleteShiftPosition as Entity);
          },
          createUnit: (result, _arguments, cache) => {
            // Invalidate the units query to refresh the units list
            cache.invalidate("Query", "units");
            // Also invalidate the company query to refresh the company's units
            const createUnitResult = result.createUnit as Data;
            if (
              createUnitResult &&
              typeof createUnitResult === "object" &&
              "companyPk" in createUnitResult
            ) {
              // Fix: Invalidate the company query with the correct cache key
              // The company query is stored under "Query" with key "company"
              cache.invalidate("Query", "company");
              // Also invalidate any specific company cache entries
              cache.invalidate("Company", createUnitResult.companyPk as string);
            }
          },
          updateUnit: (result, _arguments, cache) => {
            // Invalidate the units query to refresh the units list
            cache.invalidate("Query", "units");
            // Also invalidate the specific unit
            const updateUnitResult = result.updateUnit as Data;
            if (
              updateUnitResult &&
              typeof updateUnitResult === "object" &&
              "pk" in updateUnitResult
            ) {
              cache.invalidate("Unit", updateUnitResult.pk as string);
            }
          },
          deleteUnit: (result, _arguments, cache) => {
            // Invalidate the units query to refresh the units list
            cache.invalidate("Query", "units");
            // Also invalidate the company query to refresh the company's units
            const deleteUnitResult = result.deleteUnit as Data;
            if (
              deleteUnitResult &&
              typeof deleteUnitResult === "object" &&
              "companyPk" in deleteUnitResult
            ) {
              cache.invalidate("Company", deleteUnitResult.companyPk as string);
            }
          },
          createTeam: (result, _arguments, cache) => {
            // Invalidate the teams query to refresh the teams list
            cache.invalidate("Query", "allTeams");
            // Also invalidate the unit query to refresh the unit's teams
            const createTeamResult = result.createTeam as Data;
            if (
              createTeamResult &&
              typeof createTeamResult === "object" &&
              "pk" in createTeamResult
            ) {
              cache.invalidate("Unit", createTeamResult.pk as string);
            }
          },
          updateTeam: (result, _arguments, cache) => {
            // Invalidate the teams query to refresh the teams list
            cache.invalidate("Query", "allTeams");
            // Also invalidate the specific team
            const updateTeamResult = result.updateTeam as Data;
            if (
              updateTeamResult &&
              typeof updateTeamResult === "object" &&
              "pk" in updateTeamResult
            ) {
              cache.invalidate("Team", updateTeamResult.pk as string);
            }
          },
          deleteTeam: (result, _arguments, cache) => {
            // Invalidate the teams query to refresh the teams list
            cache.invalidate("Query", "allTeams");
            // Also invalidate the unit query to refresh the unit's teams
            const deleteTeamResult = result.deleteTeam as Data;
            if (
              deleteTeamResult &&
              typeof deleteTeamResult === "object" &&
              "pk" in deleteTeamResult
            ) {
              cache.invalidate("Unit", deleteTeamResult.pk as string);
            }
          },
          createCompany: (_result, _arguments, cache) => {
            // Invalidate the companies query to refresh the companies list
            cache.invalidate("Query", "companies");
          },
          updateCompany: (result, _arguments, cache) => {
            // Invalidate the companies query to refresh the companies list
            cache.invalidate("Query", "companies");
            // Also invalidate the specific company
            const updateCompanyResult = result.updateCompany as Data;
            if (
              updateCompanyResult &&
              typeof updateCompanyResult === "object" &&
              "pk" in updateCompanyResult
            ) {
              cache.invalidate("Company", updateCompanyResult.pk as string);
            }
          },
          deleteCompany: (_result, _arguments, cache) => {
            // Invalidate the companies query to refresh the companies list
            cache.invalidate("Query", "companies");
          },
        },
      },
    }),
    ...additionalExchanges,
    fetchExchange,
  ],
});

export const clientOptions = ({
  additionalExchanges,
  ...options
}: Partial<ClientOptions & AdditionalClientOptions>): ClientOptions =>
  merge(defaultClientOptions({ additionalExchanges }), options);

export const createClient = (
  options: Partial<
    ClientOptions & WithSession & AdditionalClientOptions & { locale?: string }
  > = {}
): Client => {
  const { locale, ...restOptions } = options;

  const clientOptions_ = clientOptions({
    ...restOptions,
    fetchOptions: () => {
      const baseFetchOptions =
        typeof restOptions.fetchOptions === "function"
          ? restOptions.fetchOptions()
          : restOptions.fetchOptions || {};

      return {
        ...baseFetchOptions,
        headers: {
          ...baseFetchOptions.headers,
          ...(locale && { "Accept-Language": locale }),
        },
      };
    },
  });

  return urqlCreateClient(clientOptions_);
};
