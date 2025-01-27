import { useState } from "react";
import { Dialog } from "./Dialog";
import { MonthCalendar } from "./MonthCalendar";
import { DayDate } from "@/day-date";

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
        title="Add position"
      >
        <div>
          <p>Add a position to the team at date {selectedDate?.toString()}</p>
        </div>
      </Dialog>
      <MonthCalendar
        year={selectedDate.getYear()}
        month={selectedDate.getMonth() - 1}
        onAddPosition={() => setCreateDialogOpen(true)}
        addButtonText="Add position"
        goTo={(year, month) => {
          setSelectedDate(new DayDate(`${year}-01-01`).setMonth(month));
        }}
      />
    </>
  );
};
