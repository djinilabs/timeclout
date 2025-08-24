import { render } from "@react-email/components";

import { LeaveRequestApprovedToManagerEmail } from "./LeaveRequestApprovedToManagerEmail";
import { LeaveRequestRejectedToManagerEmail } from "./LeaveRequestRejectedToManagerEmail";
import { LeaveRequestRejectedToUserEmail } from "./LeaveRequestRejectedToUserEmail";
import { LeaveRequestToManagerEmail } from "./LeaveRequestToManagerEmail";
import { EmailParams as EmailParameters } from "./types";

const renderReactEmail = (parameters: EmailParameters) => {
  switch (parameters.type) {
    case "leaveRequestToManager": {
      return <LeaveRequestToManagerEmail {...parameters} />;
    }
    case "leaveRequestRejectedToManager": {
      return <LeaveRequestRejectedToManagerEmail {...parameters} />;
    }
    case "leaveRequestApprovedToManager": {
      return <LeaveRequestApprovedToManagerEmail {...parameters} />;
    }
    case "leaveRequestRejectedToUser": {
      return <LeaveRequestRejectedToUserEmail {...parameters} />;
    }
  }
};

export const renderEmail = (parameters: EmailParameters) =>
  render(renderReactEmail(parameters));
