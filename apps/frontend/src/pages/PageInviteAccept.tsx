import { Suspense } from "react";
import { AcceptInvite } from "../components/AcceptInvite";

export const PageInviteAccept = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AcceptInvite />
    </Suspense>
  );
};
