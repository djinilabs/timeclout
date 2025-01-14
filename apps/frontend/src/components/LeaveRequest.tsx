export const LeaveRequest = ({
  createdBy,
  createdAt,
  startDate,
  endDate,
  type,
  reason,
}: LeaveRequest) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Leave Request Details</h2>
      <div className="space-y-2">
        <div>
          <span className="font-semibold">Created By:</span> {createdBy}
        </div>
        <div>
          <span className="font-semibold">Created At:</span>{" "}
          {new Date(createdAt).toLocaleString()}
        </div>
        <div>
          <span className="font-semibold">Start Date:</span> {startDate}
        </div>
        <div>
          <span className="font-semibold">End Date:</span> {endDate}
        </div>
        <div>
          <span className="font-semibold">Type:</span> {type}
        </div>
        <div>
          <span className="font-semibold">Reason:</span> {reason}
        </div>
      </div>
    </div>
  );
};
