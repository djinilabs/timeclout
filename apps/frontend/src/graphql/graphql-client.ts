import { cacheExchange } from "@urql/exchange-graphcache";
import type { Client, ClientOptions } from "urql";
import { fetchExchange, createClient as urqlCreateClient } from "urql";
import { type Session } from "next-auth";
import merge from "deepmerge";

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
    cacheExchange({
      keys: {
        Company: (c: any) => c.pk,
        User: (u: any) => u.pk,
        Unit: (u: any) => u.pk,
        Team: (i: any) => i.pk,
        Invitation: (i: any) => `${i.pk}:${i.email}`,
        Leave: (l: any) => `${l.pk}:${l.sk}`,
        LeaveRequest: (l: any) => `${l.pk}:${l.sk}`,
        Calendar: (c: any) => c.year,
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
