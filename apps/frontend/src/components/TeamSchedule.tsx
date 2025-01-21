import { useState } from "react";
import { MonthlySchedule } from "./MonthlySchedule";

export const TeamSchedule = () => {
  const [date, setDate] = useState(new Date());
  return (
    <MonthlySchedule
      year={date.getFullYear()}
      month={date.getMonth()}
      goTo={(year, month) => setDate(new Date(year, month))}
    />
  );
};
