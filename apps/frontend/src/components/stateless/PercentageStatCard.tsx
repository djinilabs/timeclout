export const PercentageStatCard = ({
  name,
  value,
}: {
  name: string;
  value: number;
}) => {
  return (
    <div
      key={name}
      className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
    >
      <dt className="truncate text-sm font-medium text-gray-500">{name}</dt>
      <dd className="space-y-2">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full ${
              value >= 90
                ? "bg-green-600"
                : value >= 70
                  ? "bg-yellow-400"
                  : "bg-red-600"
            }`}
            style={{
              width: `${Math.min(100, value).toLocaleString()}%`,
            }}
          />
        </div>
        <div className="text-3xl font-semibold tracking-tight text-gray-900 text-right">
          {value}%
        </div>
      </dd>
    </div>
  );
};
