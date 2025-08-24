import { useEffect, useMemo, useState } from "react";

import { Button } from "../particles/Button";
import { ProgressBar } from "../particles/ProgressBar";

export const DownloadAILanguageModel = () => {
  const languageModel = useMemo(() => {
    if ("LanguageModel" in globalThis) {
      return globalThis.LanguageModel as LanguageModel | undefined;
    }
    return;
  }, []);

  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  useEffect(() => {
    if (downloading) {
      languageModel?.create({
        monitor: (m) => {
          m.addEventListener("downloadprogress", (e) => {
            setDownloadProgress(e.loaded / e.total);
            if (e.loaded === e.total) {
              setDownloaded(true);
            }
          });
        },
      });
    }
  }, [downloading, languageModel]);

  if (!languageModel) {
    return null;
  }

  if (!downloading) {
    return (
      <div>
        <Button
          onClick={() => {
            setDownloading(true);
          }}
        >
          Download Language Model
        </Button>
      </div>
    );
  }
  if (!downloaded) {
    return (
      <div className="flex flex-col items-center justify-center">
        <ProgressBar value={downloadProgress} />
      </div>
    );
  }
  return (
    <div>
      <p>AI Language Model downloaded.</p>
      <p>Please restart your browser to be able to use AI.</p>
    </div>
  );
};
