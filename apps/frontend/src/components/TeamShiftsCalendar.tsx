import { useState } from "react";
import { useParams } from "react-router";
import { DayDate } from "@/day-date";
import shiftPositionsQuery from "@/graphql-client/queries/shiftPositions.graphql";
import { Dialog } from "./Dialog";
import { MonthCalendar } from "./MonthCalendar";
import { generateMonthDays } from "../utils/generateMonthDays";
import { CreateScheduleShiftPosition } from "./CreateScheduleShiftPosition";
import { Suspense } from "./Suspense";
import { useQuery } from "../hooks/useQuery";
import { ShiftPosition } from "libs/graphql/src/types.generated";

export const TeamShiftsCalendar = () => {
  const { team } = useParams();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<DayDate>(() =>
    DayDate.today()
  );
  const [shiftPositionsResult] = useQuery<{
    shiftPositions: ShiftPosition[];
  }>({
    query: shiftPositionsQuery,
    variables: {
      team,
      startDay: selectedDate.fullMonthBackFill().toString(),
      endDay: selectedDate.fullMonthForwardFill().toString(),
    },
  });
  const shiftPositions = shiftPositionsResult?.data?.shiftPositions;

  console.log(shiftPositions);

  return (
    <>
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        title="Insert position"
      >
        <Suspense>
          <CreateScheduleShiftPosition
            day={selectedDate}
            onCancel={() => setCreateDialogOpen(false)}
            onSuccess={() => setCreateDialogOpen(false)}
          />
        </Suspense>
      </Dialog>
      <MonthCalendar
        year={selectedDate.getYear()}
        month={selectedDate.getMonth() - 1}
        onAddPosition={() => setCreateDialogOpen(true)}
        addButtonText="Add position"
        goTo={(year, month) => {
          console.log("goTo", year, month);
          setSelectedDate(new DayDate(year, month + 1, 1));
        }}
        days={generateMonthDays(
          selectedDate.getYear(),
          selectedDate.getMonth() - 1,
          DayDate.today()
        )}
      />
    </>
  );
};
