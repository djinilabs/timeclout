import type { Client, ClientOptions } from "urql";
import { fetchExchange, createClient as urqlCreateClient } from "urql";
import { offlineExchange, Data, Entity } from "@urql/exchange-graphcache";
import { makeDefaultStorage } from "@urql/exchange-graphcache/default-storage";
import merge from "deepmerge";
import { type Session } from "next-auth";

type WithSession = {
  session: Session;
};

const defaultClientOpts = (): ClientOptions => ({
  url: new URL(`/graphql`, window.location.origin).toString(),
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
        Invitation: (i: Data) => `${i.pk}:${i.email}`,
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
      },
      updates: {
        Mutation: {
          deleteShiftPosition: (result, _args, cache) => {
            cache.invalidate(result.deleteShiftPosition as Entity);
          },
        },
      },
    }),
    fetchExchange,
  ],
});

export const clientOptions = (options: Partial<ClientOptions>): ClientOptions =>
  merge(defaultClientOpts(), options);

export const createClient = (
  options: Partial<ClientOptions & WithSession> = {}
): Client => urqlCreateClient(clientOptions(options));
