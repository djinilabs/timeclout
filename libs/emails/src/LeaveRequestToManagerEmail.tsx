import { Body, Button, Head, Html, Heading } from "@react-email/components";
import { Text } from "@react-email/text";
import { FC } from "react";

import { EmailToManagerToApproveLeaveRequestParams } from "./types";

export const LeaveRequestToManagerEmail: FC<
  EmailToManagerToApproveLeaveRequestParams
> = ({
  leaveRequestType,
  leaveRequestReason,
  leaveRequestStartDate,
  leaveRequestEndDate,
  employingEntity,
  requester,
  manager,
  continueUrl,
}) => {
  return (
    <Html>
      <Head>
        <Heading>[{employingEntity}] Leave Request to Manager</Heading>
      </Head>
      <Body>
        <Text>
          Dear {manager.name ?? manager.email},
          <br />
          {requester.name ?? requester.email} has requested {leaveRequestType}{" "}
          leave
          {leaveRequestReason && ` for ${leaveRequestReason} `} from{" "}
          {leaveRequestStartDate} to {leaveRequestEndDate}.
        </Text>
        <Text>
          Please review the request and approve or reject it.
          <br />
          <Button href={continueUrl}>Click here to review the request</Button>
        </Text>
      </Body>
    </Html>
  );
};
