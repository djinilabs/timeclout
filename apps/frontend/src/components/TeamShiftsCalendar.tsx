import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router";
import { DayDate } from "@/day-date";
import shiftPositionsQuery from "@/graphql-client/queries/shiftPositions.graphql";
import moveShiftPositionMutation from "@/graphql-client/mutations/moveShiftPosition.graphql";
import copyShiftPositionMutation from "@/graphql-client/mutations/copyShiftPosition.graphql";
import { Dialog } from "./Dialog";
import { MonthCalendar } from "./MonthCalendar";
import { generateMonthDays } from "../utils/generateMonthDays";
import { CreateScheduleShiftPosition } from "./CreateScheduleShiftPosition";
import { Suspense } from "./Suspense";
import { useQuery } from "../hooks/useQuery";
import { type ShiftPosition } from "libs/graphql/src/types.generated";
import {
  type TimeSchedule,
  MiniTimeScheduleVisualizer,
} from "./MiniTimeScheduleVisualizer";
import { splitShiftPositionForEachDay } from "../utils/splitShiftPositionsForEachDay";
import { Avatar } from "./Avatar";
import { nanoid } from "nanoid";
import { useMutation } from "../hooks/useMutation";
import toast from "react-hot-toast";

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
  const [shiftPositionsResult] = useQuery<{
    shiftPositions: ShiftPosition[];
  }>({
    query: shiftPositionsQuery,
    pollingIntervalMs: 30000,
    variables: {
      team,
      startDay: selectedDate.fullMonthBackFill().toString(),
      endDay: selectedDate.fullMonthForwardFill().toString(),
    },
  });

  const [draggingShiftPosition, setDraggingShiftPosition] =
    useState<ShiftPositionWithFake | null>(null);
  const lastDraggedToDay = useRef<string | null>(null);

  const shiftPositionsMap = useMemo(() => {
    const shiftPositions = [
      ...(shiftPositionsResult?.data?.shiftPositions ?? []),
    ];
    if (draggingShiftPosition) {
      shiftPositions.push(draggingShiftPosition);
    }
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
  }, [draggingShiftPosition, shiftPositionsResult?.data?.shiftPositions]);

  const [, moveShiftPosition] = useMutation(moveShiftPositionMutation);

  // --- copy shift position
  const [focusedShiftPosition, setFocusedShiftPosition] =
    useState<ShiftPositionWithFake | null>(null);
  const [copyingShiftPosition, setCopyingShiftPosition] =
    useState<ShiftPositionWithFake | null>(null);

  // catch command-c
  useEffect(() => {
    const handleCopy = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === "c") {
        console.log("copy");
        if (focusedShiftPosition) {
          setCopyingShiftPosition(focusedShiftPosition);
        }
      }
    };
    window.addEventListener("keydown", handleCopy);
    return () => window.removeEventListener("keydown", handleCopy);
  }, [focusedShiftPosition]);

  const [, copyShiftPosition] = useMutation(copyShiftPositionMutation);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  // catch command-v
  useEffect(() => {
    const handlePaste = async (e: KeyboardEvent) => {
      if (e.metaKey && e.key === "v") {
        console.log("paste");
        if (!copyingShiftPosition || !selectedDay) {
          return;
        }
        const result = await copyShiftPosition({
          input: {
            pk: copyingShiftPosition.pk,
            sk: copyingShiftPosition.sk,
            day: selectedDay,
          },
        });
        if (!result.error) {
          toast.success("Shift position copied");
        }
      }
    };
    window.addEventListener("keydown", handlePaste);
    return () => window.removeEventListener("keydown", handlePaste);
  }, [copyShiftPosition, copyingShiftPosition, moveShiftPosition, selectedDay]);

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
        onDayFocus={setSelectedDay}
        year={selectedDate.getYear()}
        month={selectedDate.getMonth() - 1}
        onAddPosition={() => setCreateDialogOpen(true)}
        addButtonText="Add position"
        goTo={(year, month) => {
          setSelectedDate(new DayDate(year, month + 1, 1));
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
                  className={`items-center justify-center hover:shadow-md hover:border hover:border-gray-200 focus:shadow-md focus:border focus:border-gray-200 focus:outline-none rounded cursor-grab active:cursor-grabbing ${
                    shiftPosition.fake ? "opacity-50" : ""
                  }`}
                >
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
        onCellDrop={async (day, e) => {
          const data = e.dataTransfer.types[0];
          lastDraggedToDay.current = day;
          const foundPosition = shiftPositionsResult?.data?.shiftPositions.find(
            (shiftPosition) => shiftPosition.sk.toLowerCase() === data
          );
          if (!foundPosition || foundPosition.day == day) {
            return;
          }
          const result = await moveShiftPosition({
            input: {
              pk: foundPosition.pk,
              sk: foundPosition.sk,
              day,
            },
          });
          if (!result.error) {
            toast.success("Shift position moved");
          }
          setDraggingShiftPosition(null);
        }}
        onCellDragOver={(day, e) => {
          if (lastDraggedToDay.current == day) {
            return;
          }
          lastDraggedToDay.current = day;
          const data = e.dataTransfer.types[0];
          const foundPosition = shiftPositionsResult?.data?.shiftPositions.find(
            (shiftPosition) => shiftPosition.sk.toLowerCase() === data
          );
          if (!foundPosition || foundPosition.day == day) {
            return;
          }
          const position = {
            ...foundPosition,
            day,
            sk: `day/${nanoid()}`, // fake sk
            fake: true,
            fakeFrom: foundPosition.sk,
          };
          setDraggingShiftPosition(position);
        }}
        onCellDragLeave={() => {
          lastDraggedToDay.current = null;
          setDraggingShiftPosition(null);
        }}
      />
    </>
  );
};
