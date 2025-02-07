import { MeEdit } from "../components/MeEdit";
import { Suspense } from "../components/stateless/Suspense";

export const PageMeEdit = () => {
  return (
    <Suspense>
      <MeEdit />
    </Suspense>
  );
};
