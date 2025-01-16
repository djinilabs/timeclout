import { render } from "@react-email/components";
import { EmailParams } from "./types";
import { LeaveRequestToManagerEmail } from "./LeaveRequestToManagerEmail";
import { LeaveRequestRejectedToManagerEmail } from "./LeaveRequestRejectedToManagerEmail";
import { LeaveRequestApprovedToManagerEmail } from "./LeaveRequestApprovedToManagerEmail";

const renderReactEmail = (params: EmailParams) => {
  switch (params.type) {
    case "leaveRequestToManager":
      return <LeaveRequestToManagerEmail {...params} />;
    case "leaveRequestRejectedToManager":
      return <LeaveRequestRejectedToManagerEmail {...params} />;
    case "leaveRequestApprovedToManager":
      return <LeaveRequestApprovedToManagerEmail {...params} />;
  }
};

export const renderEmail = (params: EmailParams) =>
  render(renderReactEmail(params));
