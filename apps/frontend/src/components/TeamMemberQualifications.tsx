import { useParams } from "react-router-dom";
import { getDefined, unique } from "@/utils";
import { Qualifications, qualificationsParser } from "@/settings";
import teamWithSettingsQuery from "@/graphql-client/queries/teamWithSettings.graphql";
import updateTeamMemberQualificationsMutation from "@/graphql-client/mutations/updateTeamMemberQualifications.graphql";
import { QueryTeamArgs, Team, TeamSettingsArgs } from "../graphql/graphql";
import { useQuery } from "../hooks/useQuery";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { Suspense } from "./Suspense";
import { Badges } from "./Badges";
import { Badge } from "./Badge";
import { useMutation } from "../hooks/useMutation";
import toast from "react-hot-toast";
import { dequal } from "dequal";

export interface TeamMemberQualificationsProps {
  qualifications: string[];
  memberPk: string;
}

const InternalTeamMemberQualifications: FC<TeamMemberQualificationsProps> = ({
  qualifications,
  memberPk,
}) => {
  const { team: teamPk } = useParams();
  const [teamWithMembersAndSettingsQueryResponse] = useQuery<
    { team: Team },
    QueryTeamArgs & TeamSettingsArgs
  >({
    query: teamWithSettingsQuery,
    variables: {
      teamPk: getDefined(teamPk, "No team provided"),
      name: "qualifications",
    },
  });
  const team = teamWithMembersAndSettingsQueryResponse?.data?.team;
  const teamQualifications: Qualifications =
    team?.settings && qualificationsParser.parse(team.settings);

  const badges = useMemo(
    () =>
      qualifications.map((qual) => ({
        name: qual,
        color:
          teamQualifications?.find((tq) => tq.name === qual)?.color ?? "green",
      })),
    [qualifications, teamQualifications]
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

  const [, updateTeamMemberQualifications] = useMutation(
    updateTeamMemberQualificationsMutation
  );

  const removeQualification = useCallback(
    async (qualification: string) => {
      const newQualifications = qualifications.filter(
        (q) => q !== qualification
      );
      const response = await updateTeamMemberQualifications({
        teamPk: getDefined(teamPk, "No team provided"),
        memberPk: getDefined(memberPk, "No member provided"),
        qualifications: newQualifications,
      });

      if (!response.error) {
        toast.success("Qualification removed");
      }
    },
    [memberPk, qualifications, teamPk, updateTeamMemberQualifications]
  );

  const addQualification = useCallback(
    async (qualification: string) => {
      console.log("addQualification", qualification, memberPk, teamPk);
      const newQualifications = unique([...qualifications, qualification]);

      if (dequal(qualifications, newQualifications)) {
        return;
      }

      const response = await updateTeamMemberQualifications({
        teamPk: getDefined(teamPk, "No team provided"),
        memberPk: getDefined(memberPk, "No member provided"),
        qualifications: newQualifications,
      });

      if (!response.error) {
        toast.success("Qualification added");
      }
    },
    [memberPk, qualifications, teamPk, updateTeamMemberQualifications]
  );

  const applieableQualifications = useMemo(
    () => teamQualifications?.filter((q) => !qualifications.includes(q.name)),
    [qualifications, teamQualifications]
  );

  return (
    <span className="flex items-center">
      <Badges
        badges={badges}
        onRemove={({ name }) => removeQualification(name)}
      />
      {applieableQualifications.length > 0 ? (
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
            <span className="sr-only">Add qualification</span>
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
      ) : null}
    </span>
  );
};

export const TeamMemberQualifications: FC<TeamMemberQualificationsProps> = (
  props
) => {
  return (
    <Suspense>
      <InternalTeamMemberQualifications {...props} />
    </Suspense>
  );
};
