import { render } from "@react-email/components";
import { EmailParams } from "./types";
import { LeaveRequestToManagerEmail } from "./LeaveRequestToManagerEmail";

const renderReactEmail = (params: EmailParams) => {
  switch (params.type) {
    case "leaveRequestToManager":
      return <LeaveRequestToManagerEmail {...params} />;
    default:
      throw new Error(`Unknown email type: ${params.type}`);
  }
};

export const renderEmail = (params: EmailParams) =>
  render(renderReactEmail(params));
