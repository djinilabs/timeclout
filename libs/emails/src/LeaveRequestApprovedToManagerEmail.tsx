import { FC } from "react";
import { EmailToManagerToNotifyAboutApprovedLeaveRequestParams } from "./types";
import { Body, Button, Head, Html, Heading } from "@react-email/components";
import { Text } from "@react-email/text";

export const LeaveRequestApprovedToManagerEmail: FC<
  EmailToManagerToNotifyAboutApprovedLeaveRequestParams
> = ({
  leaveRequestType,
  leaveRequestReason,
  leaveRequestStartDate,
  leaveRequestEndDate,
  employingEntity,
  requester,
  manager,
  approver,
}) => {
  return (
    <Html>
      <Head>
        <Heading>[{employingEntity}] Leave Request Approved</Heading>
      </Head>
      <Body>
        <Text>
          Dear {manager.name ?? manager.email},
          <br />
          {approver.name ?? approver.email} has approved{" "}
          {requester.name ?? requester.email}'s {leaveRequestType} leave
          {leaveRequestReason && ` for ${leaveRequestReason} `} from{" "}
          {leaveRequestStartDate} to {leaveRequestEndDate}.
        </Text>
      </Body>
    </Html>
  );
};
