import { useMemo, useRef, useState } from "react";
import { useParams } from "react-router";
import { DayDate } from "@/day-date";
import shiftPositionsQuery from "@/graphql-client/queries/shiftPositions.graphql";
import moveShiftPositionMutation from "@/graphql-client/mutations/moveShiftPosition.graphql";
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
          setSelectedDate(new DayDate(year, month + 1, 1));
        }}
        days={generateMonthDays(
          selectedDate.getYear(),
          selectedDate.getMonth() - 1,
          DayDate.today()
        )}
        renderDay={(day) => {
          const shiftPositions = shiftPositionsMap?.[day.date];
          if (!shiftPositions) {
            return null;
          }
          return shiftPositions.map((shiftPosition) => {
            const { schedules } = shiftPosition;
            return (
              <div
                key={`${shiftPosition.sk}`}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData(shiftPosition.sk, "");
                  e.dataTransfer.dropEffect = "move";
                }}
                onDragEnd={(e) => {
                  console.log("onDragEnd", e);
                  e.dataTransfer.clearData();
                }}
                className={`items-center justify-center gap-1 hover:shadow-md hover:border hover:border-gray-200 rounded cursor-grab active:cursor-grabbing ${
                  shiftPosition.fake ? "opacity-50" : ""
                }`}
              >
                {shiftPosition.assignedTo && (
                  <div className="flex-auto flex items-center justify-left min-w-[25px]">
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
          console.log("onCellDrop", day);
          const data = e.dataTransfer.types[0];
          setDraggingShiftPosition(null);
          console.log("lastDraggedToDay", lastDraggedToDay.current);
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
