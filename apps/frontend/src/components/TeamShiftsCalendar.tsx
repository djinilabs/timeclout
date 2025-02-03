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
import { useKeysNavigation } from "../hooks/useKeysNavigation";

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

  const [focusedShiftPosition, setFocusedShiftPosition] =
    useState<ShiftPositionWithFake | null>(null);
  const [focusedDay, setFocusedDay] = useState<string | null>(null);

  const advanceFocusedShiftPositionByDays = (
    days: number,
    nextSelectionPreference: "same" | "first" | "last"
  ) => {
    if (focusedShiftPosition) {
      let triedFocus = 0;
      let tryDay = new DayDate(focusedShiftPosition.day);
      const initialIndex = shiftPositionsMap?.[tryDay.toString()]?.findIndex(
        (shiftPosition) => shiftPosition === focusedShiftPosition
      );
      while (triedFocus < 10) {
        triedFocus++;
        tryDay = tryDay.nextDay(days);
        // if previous day is not the same month, we need to navigate to the previous month
        if (tryDay.getMonth() !== selectedMonth.getMonth()) {
          setSelectedMonth(tryDay.firstOfMonth());
          setFocusedDay(tryDay.toString());
          break;
        }
        const previousShiftPositions = shiftPositionsMap?.[tryDay.toString()];
        if (previousShiftPositions) {
          if (nextSelectionPreference === "same") {
            const previousShiftPosition =
              previousShiftPositions[
                Math.min(initialIndex, previousShiftPositions.length - 1)
              ];
            if (previousShiftPosition) {
              setFocusedShiftPosition(previousShiftPosition);
              break;
            }
          } else if (nextSelectionPreference === "first") {
            const previousShiftPosition = previousShiftPositions[0];
            if (previousShiftPosition) {
              setFocusedShiftPosition(previousShiftPosition);
              break;
            }
          } else if (nextSelectionPreference === "last") {
            const previousShiftPosition =
              previousShiftPositions[previousShiftPositions.length - 1];
            if (previousShiftPosition) {
              setFocusedShiftPosition(previousShiftPosition);
              break;
            }
          }
        }
      }
    }
  };

  useKeysNavigation({
    onUp: () => {
      if (focusedShiftPosition) {
        const dayShiftPositions = shiftPositionsMap?.[focusedShiftPosition.day];
        const index = dayShiftPositions?.findIndex(
          (shiftPosition) => shiftPosition === focusedShiftPosition
        );
        if (index !== undefined && index > 0) {
          setFocusedShiftPosition(dayShiftPositions[index - 1]);
        } else {
          advanceFocusedShiftPositionByDays(-7, "last");
        }
      }
    },
    onDown: () => {
      if (focusedShiftPosition) {
        const dayShiftPositions = shiftPositionsMap?.[focusedShiftPosition.day];
        const index = dayShiftPositions?.findIndex(
          (shiftPosition) => shiftPosition === focusedShiftPosition
        );
        if (index !== undefined && index < dayShiftPositions.length - 1) {
          setFocusedShiftPosition(dayShiftPositions[index + 1]);
        } else {
          advanceFocusedShiftPositionByDays(7, "first");
        }
      }
    },
    onLeft: () => {
      advanceFocusedShiftPositionByDays(-1, "same");
    },
    onRight: () => {
      advanceFocusedShiftPositionByDays(1, "same");
    },
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
          setSelectedMonth(day);
          setFocusedDay(day.toString());
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
