import { useState } from "react";
import { DayDate } from "@/day-date";
import { Dialog } from "./Dialog";
import { MonthCalendar } from "./MonthCalendar";
import { generateMonthDays } from "../utils/generateMonthDays";
import { CreateScheduleShiftPosition } from "./CreateScheduleShiftPosition";

export const TeamShiftsCalendar = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<DayDate>(
    () => new DayDate(new Date())
  );

  return (
    <>
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        title="Insert position"
      >
        <CreateScheduleShiftPosition
          day={selectedDate}
          onCancel={() => setCreateDialogOpen(false)}
        />
      </Dialog>
      <MonthCalendar
        year={selectedDate.getYear()}
        month={selectedDate.getMonth() - 1}
        onAddPosition={() => setCreateDialogOpen(true)}
        addButtonText="Add position"
        goTo={(year, month) => {
          console.log("goTo", year, month);
          setSelectedDate(new DayDate(`${year}-01-01`).setMonth(month + 1));
        }}
        days={generateMonthDays(
          selectedDate.getYear(),
          selectedDate.getMonth() - 1,
          new Date().toISOString().split("T")[0]
        )}
      />
    </>
  );
};
