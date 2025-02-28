import { type FC, useCallback, useEffect, useMemo, useState } from "react";
import { dequal } from "dequal";
import { useParams } from "react-router-dom";
import { Qualifications } from "@/settings";
import { unique } from "@/utils";
import { Badges } from "./stateless/Badges";
import { Badge } from "./stateless/Badge";
import { Button } from "./stateless/Button";
import { Trans } from "@lingui/react/macro";

export interface EditQualificationsProps {
  qualificationSettings: Qualifications;
  qualifications: string[];
  onChange: (qualifications: string[]) => void;
}

export const EditQualifications: FC<EditQualificationsProps> = ({
  qualificationSettings,
  qualifications,
  onChange,
}) => {
  const { company, unit, team } = useParams();
  const removeQualification = useCallback(
    async (qualification: string) => {
      const newQualifications = qualifications.filter(
        (q) => q !== qualification
      );

      if (dequal(qualifications, newQualifications)) {
        return;
      }

      onChange(newQualifications);
    },
    [onChange, qualifications]
  );

  const addQualification = useCallback(
    async (qualification: string) => {
      const newQualifications = unique([...qualifications, qualification]);

      if (dequal(qualifications, newQualifications)) {
        return;
      }

      onChange(newQualifications);
    },
    [onChange, qualifications]
  );

  const badges = useMemo(
    () =>
      qualifications.map((qual) => ({
        name: qual,
        color:
          qualificationSettings?.find((tq) => tq.name === qual)?.color ??
          "green",
      })),
    [qualifications, qualificationSettings]
  );

  const applieableQualifications = useMemo(
    () =>
      qualificationSettings?.filter((q) => !qualifications.includes(q.name)),
    [qualifications, qualificationSettings]
  );

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = () => {
      if (isMenuOpen) {
        setTimeout(() => {
          setIsMenuOpen(false);
        }, 100);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (isMenuOpen && event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isMenuOpen]);

  return (
    <div>
      <h3>
        <Trans>Edit Qualifications</Trans>
      </h3>
      <p className="text-sm text-gray-500">
        <Trans>Select the required qualifications for this position</Trans>
      </p>
      <span className="flex items-center">
        <Badges
          badges={badges}
          onRemove={({ name }) => removeQualification(name)}
        />
        {(applieableQualifications?.length ?? 0) > 0 ? (
          <>
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="ml-2 inline-flex items-center rounded-full border border-gray-300 bg-white p-1 text-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              <span className="sr-only">
                <Trans>Add qualification</Trans>
              </span>
            </button>
            <div className="relative">
              <div
                role="menu"
                className={`absolute mt-1 w-fit rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 ${
                  isMenuOpen ? "block" : "hidden"
                }`}
              >
                <div className="p-2">
                  {applieableQualifications?.map((qualification) => (
                    <div
                      key={qualification.name}
                      className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      <button
                        type="button"
                        onClick={(ev) => {
                          console.log("clicked add button");
                          ev.stopPropagation();
                          setIsMenuOpen(false);
                          addQualification(qualification.name);
                        }}
                      >
                        <Badge
                          name={qualification.name}
                          color={qualification.color}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="ml-2">
            <p className="text-gray-500 text-sm">
              <Trans>No qualifications available for this team.</Trans>
            </p>
            <Button
              to={`/companies/${company}/units/${unit}/teams/${team}?tab=settings&settingsTab=qualifications`}
            >
              <Trans>Add qualifications</Trans>
            </Button>
          </div>
        )}
      </span>
    </div>
  );
};
