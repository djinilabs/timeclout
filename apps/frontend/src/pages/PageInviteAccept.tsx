import { AcceptInvite } from "../components/AcceptInvite";
import { Suspense } from "../components/stateless/Suspense";

export const PageInviteAccept = () => {
  return (
    <Suspense>
      <AcceptInvite />
    </Suspense>
  );
};
