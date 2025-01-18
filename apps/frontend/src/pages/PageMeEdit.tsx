import { Suspense } from "react";
import { MeEdit } from "../components/MeEdit";

export const PageMeEdit = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MeEdit />
    </Suspense>
  );
};
