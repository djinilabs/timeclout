import { useParams } from "react-router-dom";
import { PendingLeaveRequests } from "./PendingLeaveRequests";

export const PendingCompanyLeaveRequests = () => {
  const { company } = useParams();

  return <PendingLeaveRequests companyPk={company} />;
};
