import { AcceptInvite } from "../components/AcceptInvite";
import { Suspense } from "../components/atoms/Suspense";

export const PageInviteAccept = () => {
  return (
    <Suspense>
      <AcceptInvite />
    </Suspense>
  );
};
