import { FC } from "react";
import {
  EmailToManagerToNotifyAboutRejectedLeaveRequestParams,
  EmailToUserToNotifyAboutRejectedLeaveRequestParams,
} from "./types";
import { Body, Button, Head, Html, Heading } from "@react-email/components";
import { Text } from "@react-email/text";

export const LeaveRequestRejectedToUserEmail: FC<
  EmailToUserToNotifyAboutRejectedLeaveRequestParams
> = ({
  leaveRequestType,
  leaveRequestReason,
  leaveRequestStartDate,
  leaveRequestEndDate,
  employingEntity,
  requester,
  rejecter,
}) => {
  return (
    <Html>
      <Head>
        <Heading>[{employingEntity}] Leave Request Rejected</Heading>
      </Head>
      <Body>
        <Text>
          Dear {requester.name ?? requester.email},
          <br />
          {rejecter.name ?? rejecter.email} has rejected your {leaveRequestType}{" "}
          leave
          {leaveRequestReason && ` for ${leaveRequestReason} `} from{" "}
          {leaveRequestStartDate} to {leaveRequestEndDate}.
        </Text>
      </Body>
    </Html>
  );
};
