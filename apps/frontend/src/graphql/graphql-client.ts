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
        Company: (c: unknown) => c.pk,
        User: (u: unknown) => u.pk,
        Unit: (u: unknown) => u.pk,
        Team: (i: unknown) => i.pk,
        Invitation: (i: unknown) => `${i.pk}:${i.email}`,
        Leave: (l: unknown) => `${l.pk}:${l.sk}`,
        LeaveRequest: (l: unknown) => `${l.pk}:${l.sk}`,
        Calendar: (c: unknown) => c.year,
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
