import { render } from "@react-email/components";

import { LeaveRequestApprovedToManagerEmail } from "./LeaveRequestApprovedToManagerEmail";
import { LeaveRequestRejectedToManagerEmail } from "./LeaveRequestRejectedToManagerEmail";
import { LeaveRequestRejectedToUserEmail } from "./LeaveRequestRejectedToUserEmail";
import { LeaveRequestToManagerEmail } from "./LeaveRequestToManagerEmail";
import { EmailParams } from "./types";

const renderReactEmail = (params: EmailParams) => {
  switch (params.type) {
    case "leaveRequestToManager":
      return <LeaveRequestToManagerEmail {...params} />;
    case "leaveRequestRejectedToManager":
      return <LeaveRequestRejectedToManagerEmail {...params} />;
    case "leaveRequestApprovedToManager":
      return <LeaveRequestApprovedToManagerEmail {...params} />;
    case "leaveRequestRejectedToUser":
      return <LeaveRequestRejectedToUserEmail {...params} />;
  }
};

export const renderEmail = (params: EmailParams) =>
  render(renderReactEmail(params));
