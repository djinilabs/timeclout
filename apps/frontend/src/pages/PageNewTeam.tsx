import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "@tanstack/react-form";
import { ExclamationCircleIcon } from "@heroicons/react/16/solid";
import toast from "react-hot-toast";
import { useMutation } from "urql";
import { BreadcrumbNav } from "../components/BreadcrumbNav";
import { createTeamMutation } from "../graphql/mutations/createTeam";

export const PageNewTeam = () => {
  const { company: companyPk, unit: unitPk } = useParams();
  const navigate = useNavigate();
  const [, createTeam] = useMutation(createTeamMutation);
  const form = useForm<{ "team-name": string }>({
    onSubmit: async ({ value }) => {
      const response = await createTeam({
        unitPk,
        name: value["team-name"],
      });
      if (response.error) {
        toast.error("Error creating team: " + response.error.message);
      } else {
        navigate(`/companies/${companyPk}/units/${unitPk}`);
      }
    },
    onSubmitInvalid: () => {
      toast.error("Please fill in all fields");
    },
  });
  return (
    <div>
      <BreadcrumbNav />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div className="space-y-12">
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
            <div>
              <h2 className="text-base/7 font-semibold text-gray-900">
                Create a new team for this unit
              </h2>
              <p className="mt-1 text-sm/6 text-gray-600">
                To create a new team you just have to fill in the team name and
                click on "Create".
              </p>
            </div>

            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
              <div className="sm:col-span-3">
                <form.Field
                  name="team-name"
                  validators={{
                    onChange: ({ value }) => {
                      if (!value) {
                        return "Team name is required";
                      }
                    },
                  }}
                  children={(field) => {
                    return (
                      <div>
                        <label
                          htmlFor="first-name"
                          className="block text-sm/6 font-medium text-gray-900"
                        >
                          Team name
                        </label>
                        <div className="mt-2 grid grid-cols-1">
                          <input
                            autoFocus
                            id={field.name}
                            name={field.name}
                            type="text"
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="Maintenance"
                            className={`col-start-1 row-start-1 block w-full rounded-md bg-white py-1.5 pl-3 pr-10 text-base outline outline-1 -outline-offset-1 focus:outline focus:outline-2 focus:-outline-offset-2 sm:pr-9 sm:text-sm/6 ${
                              field.state.meta.errors.length > 0
                                ? "placeholder:text-red-300 outline-red-300 focus:outline-red-600"
                                : ""
                            }`}
                          />
                          {field.state.meta.errors.length > 0 ? (
                            <ExclamationCircleIcon
                              aria-hidden="true"
                              className="pointer-events-none col-start-1 row-start-1 mr-3 size-5 self-center justify-self-end text-red-500 sm:size-4"
                            />
                          ) : null}
                        </div>
                        {field.state.meta.errors.length > 0 ? (
                          <p className="mt-2 text-sm text-red-600">
                            {field.state.meta.errors.join(", ")}
                          </p>
                        ) : null}
                      </div>
                    );
                  }}
                ></form.Field>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            onClick={() => navigate("/")}
            type="button"
            className="text-sm/6 font-semibold text-gray-900"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={form.state.isSubmitting}
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
};
