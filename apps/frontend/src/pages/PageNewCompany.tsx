import { useNavigate } from "react-router-dom";
import { useForm } from "@tanstack/react-form";
import { ExclamationCircleIcon } from "@heroicons/react/16/solid";
import toast from "react-hot-toast";
import createCompanyMutation from "@/graphql-client/mutations/createCompany.graphql";
import { Button } from "../components/stateless/Button";
import { useMutation } from "../hooks/useMutation";
import { Mutation, MutationCreateCompanyArgs } from "../graphql/graphql";
import { Trans } from "@lingui/react/macro";
import { i18n } from "@lingui/core";

export const PageNewCompany = () => {
  const navigate = useNavigate();

  const [, createCompany] = useMutation<
    Mutation["createCompany"],
    MutationCreateCompanyArgs
  >(createCompanyMutation);

  const form = useForm({
    onSubmit: async ({ value }) => {
      const response = await createCompany({ name: value["company-name"] });
      if (!response.error) {
        toast.success("Company created");
        navigate("/");
      }
    },
    onSubmitInvalid: () => {
      toast.error("Please fill in all fields");
    },
  });
  return (
    <div>
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
                <Trans>Create a new Company</Trans>
              </h2>
              <p className="mt-1 text-sm/6 text-gray-600">
                <Trans>
                  To create a new company you just have to fill in the company
                  name and click on "Create".
                </Trans>
              </p>
            </div>

            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
              <div className="sm:col-span-3">
                <form.Field
                  name="company-name"
                  validators={{
                    onChange: ({ value }) => {
                      if (!value) {
                        return i18n.t("Company name is required");
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
                          <Trans>Company name</Trans>
                        </label>
                        <div className="mt-2 grid grid-cols-1">
                          <input
                            autoFocus
                            id={field.name}
                            name={field.name}
                            type="text"
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="ACME Inc"
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
          <Button to="/">
            <Trans>Cancel</Trans>
          </Button>
          <button
            type="submit"
            disabled={form.state.isSubmitting}
            className="rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
          >
            <Trans>Create</Trans>
          </button>
        </div>
      </form>
    </div>
  );
};
