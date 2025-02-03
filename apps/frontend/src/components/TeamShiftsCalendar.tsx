import { useCallback, useMemo, useState } from "react";
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
import { useTeamShiftsFocusNavigation } from "../hooks/useTeamShiftsFocusNavigation";

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
  const [selectedMonth, setSelectedMonth] = useState<DayDate>(() =>
    DayDate.today()
  );
  const [previouslySelectedMonth, setPreviouslySelectedMonth] = useState<
    DayDate | undefined
  >();

  const goToMonth = useCallback(
    (_month: DayDate) => {
      const month = _month.firstOfMonth();
      setPreviouslySelectedMonth(selectedMonth);
      setSelectedMonth(month);
      setFocusedDay(month.toString());
    },
    [selectedMonth]
  );

  const { data: shiftPositionsResult } = useTeamShiftsQuery(
    getDefined(team),
    selectedMonth
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

  // ------- focus navigation -------

  const [focusedDay, setFocusedDay] = useState<string | null>(null);
  const { focusedShiftPosition, setFocusedShiftPosition } =
    useTeamShiftsFocusNavigation({
      shiftPositionsMap,
      selectedMonth,
      previouslySelectedMonth: previouslySelectedMonth ?? null,
      goToMonth,
    });
  // ------- clipboard -------

  const {
    copyShiftPositionToClipboard,
    pasteShiftPositionFromClipboard,
    hasCopiedShiftPosition,
  } = useTeamShiftsClipboard(focusedShiftPosition, focusedDay);

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
            day={focusedDay ? new DayDate(focusedDay) : selectedMonth}
            onCancel={() => setCreateDialogOpen(false)}
            onSuccess={() => setCreateDialogOpen(false)}
          />
        </Suspense>
      </Dialog>
      <MonthCalendar
        onDayFocus={setFocusedDay}
        year={selectedMonth.getYear()}
        month={selectedMonth.getMonth() - 1}
        onAddPosition={() => {
          setEditingShiftPosition(undefined);
          setCreateDialogOpen(true);
        }}
        addButtonText="Add position"
        goTo={(year, month) => {
          const day = new DayDate(year, month + 1, 1);
          goToMonth(day);
        }}
        days={generateMonthDays(
          selectedMonth.getYear(),
          selectedMonth.getMonth() - 1,
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
                focus={
                  (focusedShiftPosition &&
                    focusedShiftPosition == shiftPosition) ||
                  false
                }
                setFocusedShiftPosition={setFocusedShiftPosition}
                shiftPosition={shiftPosition}
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
