import { useMemo, useState } from "react";
import { useParams } from "react-router";
import { DayDate } from "@/day-date";
import { Dialog } from "./Dialog";
import { MonthCalendar } from "./MonthCalendar";
import { generateMonthDays } from "../utils/generateMonthDays";
import { CreateOrEditScheduleShiftPosition } from "./CreateOrEditScheduleShiftPosition";
import { Suspense } from "./Suspense";
import { type ShiftPosition as ShiftPositionType } from "libs/graphql/src/types.generated";
import { splitShiftPositionForEachDay } from "../utils/splitShiftPositionsForEachDay";
import { useTeamShiftActions } from "../hooks/useTeamShiftActions";
import { useTeamShiftsQuery } from "../hooks/useTeamShiftsQuery";
import { getDefined } from "@/utils";
import { useTeamShiftsDragAndDrop } from "../hooks/useTeamShiftsDragAndDrop";
import { useTeamShiftsClipboard } from "../hooks/useTeamShiftsClipboard";
import { ShiftPosition } from "./ShiftPosition";

type ShiftPositionWithFake = ShiftPositionType & {
  fake?: boolean;
  fakeFrom?: string;
  original?: ShiftPositionType;
};

const sortShiftPositions = (
  a: ShiftPositionWithFake,
  b: ShiftPositionWithFake
) => {
  return (
    (a.assignedTo?.name ?? "ZZZZZZZZZZ").localeCompare(
      b.assignedTo?.name ?? "ZZZZZZZZZZ"
    ) ?? a.sk.localeCompare(b.sk)
  );
};

export const TeamShiftsCalendar = () => {
  const { team } = useParams();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<DayDate>(() =>
    DayDate.today()
  );

  const { data: shiftPositionsResult } = useTeamShiftsQuery(
    getDefined(team),
    selectedDate
  );

  const { draggingShiftPosition, onCellDragOver, onCellDragLeave, onCellDrop } =
    useTeamShiftsDragAndDrop(shiftPositionsResult);

  const shiftPositions = useMemo(() => {
    if (draggingShiftPosition) {
      const shiftPositions = [...(shiftPositionsResult ?? [])];
      shiftPositions.push(draggingShiftPosition);
      return shiftPositions;
    }
    return shiftPositionsResult;
  }, [draggingShiftPosition, shiftPositionsResult]);

  const shiftPositionsMap = useMemo(() => {
    const entries = shiftPositions.flatMap((shiftPosition) => {
      return splitShiftPositionForEachDay(shiftPosition).map(
        (splittedShiftPosition) =>
          [
            splittedShiftPosition.day,
            {
              ...splittedShiftPosition,
              original: shiftPosition,
            },
          ] as [string, ShiftPositionWithFake]
      );
    });

    return entries?.reduce(
      (acc, [day, shiftPosition]) => {
        const dayPositions = acc[day] ?? [];
        acc[day] = dayPositions;
        const pos =
          draggingShiftPosition &&
          shiftPosition.sk === draggingShiftPosition.fakeFrom
            ? {
                ...shiftPosition,
                fake: true,
              }
            : shiftPosition;
        dayPositions.push(pos);
        return acc;
      },
      {} as Record<string, ShiftPositionWithFake[]>
    );
  }, [draggingShiftPosition, shiftPositions]);

  const [focusedShiftPosition, setFocusedShiftPosition] =
    useState<ShiftPositionWithFake | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const {
    copyShiftPositionToClipboard,
    pasteShiftPositionFromClipboard,
    hasCopiedShiftPosition,
  } = useTeamShiftsClipboard(focusedShiftPosition, selectedDay);

  const { deleteShiftPosition } = useTeamShiftActions();

  // editing shift position
  const [editingShiftPosition, setEditingShiftPosition] = useState<
    ShiftPositionWithFake | undefined
  >(undefined);

  const handleEditShiftPosition = (shiftPosition: ShiftPositionWithFake) => {
    setEditingShiftPosition(shiftPosition.original ?? shiftPosition);
    setCreateDialogOpen(true);
  };

  return (
    <>
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        title={
          editingShiftPosition
            ? "Edit position"
            : "Insert position into the team schedule."
        }
      >
        <Suspense>
          <CreateOrEditScheduleShiftPosition
            editingShiftPosition={editingShiftPosition}
            day={selectedDay ? new DayDate(selectedDay) : selectedDate}
            onCancel={() => setCreateDialogOpen(false)}
            onSuccess={() => setCreateDialogOpen(false)}
          />
        </Suspense>
      </Dialog>
      <MonthCalendar
        onDayFocus={setSelectedDay}
        year={selectedDate.getYear()}
        month={selectedDate.getMonth() - 1}
        onAddPosition={() => {
          setEditingShiftPosition(undefined);
          setCreateDialogOpen(true);
        }}
        addButtonText="Add position"
        goTo={(year, month) => {
          const day = new DayDate(year, month + 1, 1);
          setSelectedDay(day.toString());
          setSelectedDate(day);
        }}
        days={generateMonthDays(
          selectedDate.getYear(),
          selectedDate.getMonth() - 1,
          DayDate.today()
        )}
        renderDay={(day, dayIndex) => {
          const shiftPositions = shiftPositionsMap?.[day.date];
          if (!shiftPositions) {
            return null;
          }
          return shiftPositions
            .sort(sortShiftPositions)
            .map((shiftPosition, shiftPositionIndex) => (
              <ShiftPosition
                key={shiftPosition.sk}
                autoFocus={dayIndex === 0 && shiftPositionIndex === 0}
                shiftPosition={shiftPosition}
                setFocusedShiftPosition={setFocusedShiftPosition}
                tabIndex={dayIndex * 100 + shiftPositionIndex}
                handleEditShiftPosition={handleEditShiftPosition}
                copyShiftPositionToClipboard={copyShiftPositionToClipboard}
                hasCopiedShiftPosition={hasCopiedShiftPosition}
                pasteShiftPositionFromClipboard={
                  pasteShiftPositionFromClipboard
                }
                deleteShiftPosition={deleteShiftPosition}
              />
            ));
        }}
        onCellDrop={onCellDrop}
        onCellDragOver={onCellDragOver}
        onCellDragLeave={onCellDragLeave}
      />
    </>
  );
};
