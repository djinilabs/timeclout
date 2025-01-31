import { cacheExchange, Data } from "@urql/exchange-graphcache";
import type { Client, ClientOptions } from "urql";
import { fetchExchange, createClient as urqlCreateClient } from "urql";
import { type Session } from "next-auth";
import merge from "deepmerge";
import { nanoid } from "nanoid";

type WithSession = {
  session: Session;
};

const defaultClientOpts = (): ClientOptions => ({
  url: new URL(`/graphql`, window.location.origin).toString(),
  fetchOptions: {
    credentials: "same-origin",
    headers: {},
  },
  requestPolicy: "cache-first",
  suspense: true,
  exchanges: [
    cacheExchange({
      keys: {
        Company: (c: Data) => c.pk as string,
        User: (u: Data) => u.pk as string,
        Unit: (u: Data) => u.pk as string,
        Team: (i: Data) => i.pk as string,
        Invitation: (i: Data) => `${i.pk}:${i.email}`,
        Leave: (l: Data) => `${l.pk}:${l.sk}`,
        LeaveRequest: (l: Data) => `${l.pk}:${l.sk}`,
        Calendar: (c: Data) => c.year?.toString() ?? "",
        Schedule: (s: Data) => s.pk?.toString() ?? "",
        UserSchedule: (s: Data) => s.pk?.toString() ?? "",
        MemberQualifications: (m: Data) =>
          m.userPk?.toString() ??
          (Array.isArray(m.qualifications) ? m.qualifications.join(",") : ""),
        ShiftPositionSchedule: () => nanoid(),
        ShiftPosition: (s: Data) => `${s.pk}:${s.sk}`,
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
