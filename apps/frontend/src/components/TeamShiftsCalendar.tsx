import { useMemo, useState } from "react";
import { useParams } from "react-router";
import { DayDate } from "@/day-date";
import { Dialog } from "./Dialog";
import { MonthCalendar } from "./MonthCalendar";
import { generateMonthDays } from "../utils/generateMonthDays";
import { CreateScheduleShiftPosition } from "./CreateScheduleShiftPosition";
import { Suspense } from "./Suspense";
import { type ShiftPosition } from "libs/graphql/src/types.generated";
import { splitShiftPositionForEachDay } from "../utils/splitShiftPositionsForEachDay";
import { Avatar } from "./Avatar";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { classNames } from "../utils/classNames";
import { useTeamShiftActions } from "../hooks/useTeamShiftActions";
import { useTeamShiftsQuery } from "../hooks/useTeamShiftsQuery";
import { getDefined } from "@/utils";
import { useTeamShiftsDragAndDrop } from "../hooks/useTeamShiftsDragAndDrop";
import { useTeamShiftsClipboard } from "../hooks/useTeamShiftsClipboard";
import {
  type TimeSchedule,
  MiniTimeScheduleVisualizer,
} from "./MiniTimeScheduleVisualizer";

type ShiftPositionWithFake = ShiftPosition & {
  fake?: boolean;
  fakeFrom?: string;
};

const toMinutes = ([hours, minutes]: [number, number]) => {
  return hours * 60 + minutes;
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
        (shiftPosition) =>
          [shiftPosition.day, shiftPosition] as [string, ShiftPositionWithFake]
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

  const { copyShiftPositionToClipboard } = useTeamShiftsClipboard(
    focusedShiftPosition,
    selectedDay
  );

  const { deleteShiftPosition } = useTeamShiftActions();

  return (
    <>
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        title="Insert position"
      >
        <Suspense>
          <CreateScheduleShiftPosition
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
        onAddPosition={() => setCreateDialogOpen(true)}
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
            .map((shiftPosition, shiftPositionIndex) => {
              const { schedules } = shiftPosition;
              const startTime = toMinutes(
                schedules[0].startHourMinutes as [number, number]
              );
              const latestTime = toMinutes(
                schedules[schedules.length - 1].endHourMinutes as [
                  number,
                  number,
                ]
              );
              const totalMinutes = latestTime;
              const startPercent = Math.round((startTime / totalMinutes) * 100);
              return (
                <div
                  onFocus={() => setFocusedShiftPosition(shiftPosition)}
                  autoFocus={dayIndex === 0 && shiftPositionIndex === 0}
                  tabIndex={dayIndex * 100 + shiftPositionIndex}
                  key={`${shiftPosition.sk}`}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData(shiftPosition.sk, "");
                    e.dataTransfer.dropEffect = "move";
                  }}
                  onDragEnd={(e) => {
                    e.dataTransfer.clearData();
                  }}
                  className={`group relative items-center justify-center hover:ring-2 hover:ring-gray-200 -ring-offset-1 focus:ring-2 focus:ring-gray-200 focus:ring-offset-1 focus:outline-none cursor-grab active:cursor-grabbing ${
                    shiftPosition.fake ? "opacity-50" : ""
                  }`}
                >
                  <Menu
                    as="div"
                    className="right-0 top-0 absolute opacity-0 group-hover:opacity-100 z-[200]"
                  >
                    <MenuButton className="cursor-pointer hover:bg-gray-100 rounded">
                      <EllipsisHorizontalIcon className="w-4 h-4" />
                    </MenuButton>
                    <MenuItems className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <MenuItem>
                        {({ active }) => (
                          <button
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block w-full text-left px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            Edit
                          </button>
                        )}
                      </MenuItem>
                      <MenuItem>
                        {({ active }) => (
                          <button
                            onClick={() =>
                              copyShiftPositionToClipboard(shiftPosition)
                            }
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block w-full text-left px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            Copy
                          </button>
                        )}
                      </MenuItem>
                      <MenuItem>
                        {({ active }) => (
                          <button
                            onClick={() =>
                              deleteShiftPosition(
                                shiftPosition.pk,
                                shiftPosition.sk
                              )
                            }
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block w-full text-left px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            Delete
                          </button>
                        )}
                      </MenuItem>
                    </MenuItems>
                  </Menu>
                  {shiftPosition.assignedTo && (
                    <div
                      className="flex-auto flex items-center justify-left ml-2"
                      style={{
                        marginLeft: `${startPercent}%`,
                      }}
                    >
                      <Avatar size={25} {...shiftPosition.assignedTo} />
                    </div>
                  )}
                  <MiniTimeScheduleVisualizer
                    schedules={schedules as Array<TimeSchedule>}
                  />
                </div>
              );
            });
        }}
        onCellDrop={onCellDrop}
        onCellDragOver={onCellDragOver}
        onCellDragLeave={onCellDragLeave}
      />
    </>
  );
};
