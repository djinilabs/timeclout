import latestAppVersionQuery from "@/graphql-client/queries/latestAppVersion.graphql";
import { useQuery } from "../../hooks/useQuery";
import { useConfirmDialog } from "../../hooks/useConfirmDialog";
import { Trans } from "@lingui/react/macro";
import { version } from "../../../../../package.json";
import { useCallback, useEffect, useMemo, useRef } from "react";

export const CheckLatestAppVersion = () => {
  console.log("CheckLatestAppVersion");
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
      if (data?.latestAppVersion !== version && !alreadyShown.current) {
        alreadyShown.current = true;
        if (
          await showConfirmDialog({
            text,
            confirmText,
            cancelText,
          })
        ) {
          console.log("CheckLatestAppVersion: onConfirm");
          window.location.reload();
        }
      }
    })();
  }, [
    cancelText,
    confirmText,
    data?.latestAppVersion,
    showConfirmDialog,
    text,
  ]);

  return null;
};
