import { FC } from "react";
import { EmailToManagerToNotifyAboutRejectedLeaveRequestParams } from "./types";
import { Body, Head, Html, Heading } from "@react-email/components";
import { Text } from "@react-email/text";

export const LeaveRequestRejectedToManagerEmail: FC<
  EmailToManagerToNotifyAboutRejectedLeaveRequestParams
> = ({
  leaveRequestType,
  leaveRequestReason,
  leaveRequestStartDate,
  leaveRequestEndDate,
  employingEntity,
  requester,
  manager,
  rejecter,
}) => {
  return (
    <Html>
      <Head>
        <Heading>[{employingEntity}] Leave Request Rejected</Heading>
      </Head>
      <Body>
        <Text>
          Dear {manager.name ?? manager.email},
          <br />
          {rejecter.name ?? rejecter.email} has rejected{" "}
          {requester.name ?? requester.email}'s {leaveRequestType} leave
          {leaveRequestReason && ` for ${leaveRequestReason} `} from{" "}
          {leaveRequestStartDate} to {leaveRequestEndDate}.
        </Text>
      </Body>
    </Html>
  );
};
