import { useParams } from "react-router-dom";
import { PendingLeaveRequests } from "./PendingLeaveRequests";

const PendingCompanyLeaveRequests = () => {
  const { company } = useParams();

  return <PendingLeaveRequests companyPk={company} />;
};

export default PendingCompanyLeaveRequests;
