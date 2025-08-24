import { Trans } from "@lingui/react/macro";
import { useEffect, useMemo, useRef } from "react";

import { version } from "../../../../../package.json";
import { useConfirmDialog } from "../../hooks/useConfirmDialog";
import { useQuery } from "../../hooks/useQuery";

import latestAppVersionQuery from "@/graphql-client/queries/latestAppVersion.graphql";

export const CheckLatestAppVersion = () => {
  const [{ data }] = useQuery<{ latestAppVersion: string }>({
    query: latestAppVersionQuery,
    pollingIntervalMs: 1000 * 60 * 5, // 5 minutes
  });
  const { showConfirmDialog } = useConfirmDialog();
  const alreadyShown = useRef(false);

  const text = useMemo(() => {
    return (
      <Trans>
        The most recent version of the app is available. Please update to the
        most recent version.
      </Trans>
    );
  }, []);

  const confirmText = useMemo(() => {
    return <Trans>Update now</Trans>;
  }, []);

  const cancelText = useMemo(() => {
    return <Trans>Ignore for now</Trans>;
  }, []);

  useEffect(() => {
    (async () => {
      if (
        data &&
        data.latestAppVersion &&
        data.latestAppVersion !== version &&
        !alreadyShown.current
      ) {
        alreadyShown.current = true;
        if (
          await showConfirmDialog({
            text,
            confirmText,
            cancelText,
          })
        ) {
          globalThis.location.reload();
        }
      }
    })();
  }, [
    cancelText,
    confirmText,
    data,
    data?.latestAppVersion,
    showConfirmDialog,
    text,
  ]);

  return null;
};
