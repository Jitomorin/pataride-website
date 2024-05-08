import React from "react";
import {
  DateRangePicker,
  Radio,
  RadioGroup,
  Button,
  ButtonGroup,
  cn,
} from "@nextui-org/react";
import {
  today,
  startOfWeek,
  startOfMonth,
  endOfWeek,
  endOfMonth,
  DateFormatter,
  getLocalTimeZone,
} from "@internationalized/date";
import { useLocale } from "@react-aria/i18n";

export default function CustomDateRangePicker({ onChangeFunction }: any) {
  let defaultDate = {
    start: today(getLocalTimeZone()),
    end: today(getLocalTimeZone()).add({ days: 7 }),
  };
  let [value, setValue] = React.useState(defaultDate);

  let { locale } = useLocale();
  //   let formatter = DateFormatter({ dateStyle: "full" });
  let now = today(getLocalTimeZone());
  let nextWeek = {
    start: startOfWeek(now.add({ weeks: 1 }), locale),
    end: endOfWeek(now.add({ weeks: 1 }), locale),
  };
  let nextMonth = {
    start: startOfMonth(now.add({ months: 1 })),
    end: endOfMonth(now.add({ months: 1 })),
  };

  return (
    <DateRangePicker
      className=" my-8 p-2 max-w-lg"
      minValue={now}
      CalendarTopContent={
        <ButtonGroup
          fullWidth
          className="px-3 pb-2 pt-3 bg-content1 [&>button]:text-default-500 [&>button]:border-default-200/60"
          radius="full"
          size="sm"
          variant="bordered"
        >
          <Button
            onPress={() => {
              setValue({
                start: now,
                end: now.add({ days: 7 }),
              });
              onChangeFunction(
                now.toDate(getLocalTimeZone()),
                now.add({ days: 7 }).toDate(getLocalTimeZone())
              );
            }}
          >
            This week
          </Button>
          <Button
            onPress={() => {
              setValue(nextWeek);
              onChangeFunction(
                nextWeek.start.toDate(getLocalTimeZone()),
                nextWeek.end.toDate(getLocalTimeZone())
              );
            }}
          >
            Next week
          </Button>
          <Button
            onPress={() => {
              setValue(nextMonth);
              onChangeFunction(
                nextMonth.start.toDate(getLocalTimeZone()),
                nextMonth.end.toDate(getLocalTimeZone())
              );
            }}
          >
            Next month
          </Button>
        </ButtonGroup>
      }
      calendarProps={{
        focusedValue: value.start,
        nextButtonProps: {
          variant: "bordered",
        },
        prevButtonProps: {
          variant: "bordered",
        },
      }}
      value={value}
      onChange={(item) => {
        setValue(item);
        onChangeFunction(
          item.start.toDate(getLocalTimeZone()),
          item.end.toDate(getLocalTimeZone())
        );
        console.log(item);
      }}
      label="Event date"
    />
  );
}
