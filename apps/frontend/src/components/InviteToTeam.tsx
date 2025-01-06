import { FC } from "react";
import { Button } from "./Button";

export interface InviteToTeamProps {
  onSubmit: (email: string) => void;
  onCancel: () => void;
}

export const InviteToTeam: FC<InviteToTeamProps> = ({ onSubmit, onCancel }) => {
  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-base font-semibold text-gray-900">
          Invite to team
        </h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500">
          <p>Invite a team member to join your team.</p>
        </div>
        <form
          className="mt-5 sm:flex sm:items-center"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(e.currentTarget.email.value);
          }}
        >
          <div className="w-full sm:max-w-xs">
            <input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              aria-label="Email"
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            />
          </div>
          <button
            type="submit"
            className="mt-3 inline-flex w-full items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:ml-3 sm:mt-0 sm:w-auto"
          >
            Invite
          </button>
          <Button cancel onClick={onCancel}>
            Cancel
          </Button>
        </form>
      </div>
    </div>
  );
};
