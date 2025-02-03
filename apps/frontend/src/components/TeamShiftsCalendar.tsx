import { useCallback, useState } from "react";
import { useParams } from "react-router";
import { DayDate } from "@/day-date";
import { Dialog } from "./Dialog";
import { MonthCalendar } from "./MonthCalendar";
import { generateMonthDays } from "../utils/generateMonthDays";
import { CreateOrEditScheduleShiftPosition } from "./CreateOrEditScheduleShiftPosition";
import { Suspense } from "./Suspense";
import { useTeamShiftActions } from "../hooks/useTeamShiftActions";
import { useTeamShiftsQuery } from "../hooks/useTeamShiftsQuery";
import { getDefined } from "@/utils";
import { useTeamShiftsDragAndDrop } from "../hooks/useTeamShiftsDragAndDrop";
import { useTeamShiftsClipboard } from "../hooks/useTeamShiftsClipboard";
import { ShiftPosition } from "./ShiftPosition";
import { useTeamShiftsFocusNavigation } from "../hooks/useTeamShiftsFocusNavigation";
import {
  type ShiftPositionWithFake,
  useTeamShiftPositionsMap,
} from "../hooks/useTeamShiftPositionsMap";
import { classNames } from "../utils/classNames";

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

  const { shiftPositionsMap } = useTeamShiftPositionsMap({
    draggingShiftPosition,
    shiftPositionsResult,
  });

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
          const rowCount = shiftPositions.reduce(
            (acc, shiftPosition) => acc + shiftPosition.rowSpan,
            0
          );
          return (
            <div
              className={classNames("h-full w-full grid")}
              style={{
                gridTemplateRows: `repeat(${
                  !Number.isNaN(rowCount) ? rowCount : shiftPositions.length
                }, 1fr)`,
              }}
            >
              {shiftPositions.map((shiftPosition, shiftPositionIndex) => (
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
              ))}
            </div>
          );
        }}
        onCellDrop={onCellDrop}
        onCellDragOver={onCellDragOver}
        onCellDragLeave={onCellDragLeave}
      />
    </>
  );
};
