import { FC, PropsWithChildren } from "react";
import { AgreementDialog } from "./AgreementDialog";
import { useAgreement } from "../../hooks/useAgreement";

export const AgreementWrapper: FC<PropsWithChildren> = ({ children }) => {
  const { hasAgreed, isDialogOpen, handleAgree, handleDisagree } =
    useAgreement();

  // Don't render children if user hasn't agreed to terms
  if (hasAgreed === false) {
    return (
      <AgreementDialog
        isOpen={isDialogOpen}
        onAgree={handleAgree}
        onDisagree={handleDisagree}
      />
    );
  }

  return (
    <>
      {children}
      <AgreementDialog
        isOpen={isDialogOpen}
        onAgree={handleAgree}
        onDisagree={handleDisagree}
      />
    </>
  );
};
