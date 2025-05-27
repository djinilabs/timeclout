import { FC, memo, useCallback } from "react";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/16/solid";
import { CheckIcon } from "@heroicons/react/20/solid";

export interface ListBoxProps<TKey extends string | number = string | number> {
  options: { key: TKey; value: string }[];
  selected: TKey | undefined;
  onChange: (option: TKey) => void;
}

export const ListBox: FC<ListBoxProps> = memo(
  ({ options, selected, onChange }) => {
    const selectedOption = options.find((option) => option.key == selected);

    const onValueChange = useCallback(
      (option: { key: number | string; value: string }) => {
        onChange(option.key);
      },
      [onChange]
    );

    return (
      <Listbox value={selectedOption} onChange={onValueChange}>
        <div className="relative">
          <ListboxButton className="grid w-full cursor-default grid-cols-1 rounded-md bg-white py-1.5 pl-3 pr-2 text-left text-gray-outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-teal-600 sm:text-sm/6">
            <span className="col-start-1 row-start-1 truncate pr-6">
              {selectedOption?.value ?? "Select one"}
            </span>
            <ChevronUpDownIcon
              aria-hidden="true"
              className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4"
            />
          </ListboxButton>

          <ListboxOptions
            transition
            className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-hidden data-closed:data-leave:opacity-0 data-leave:transition data-leave:duration-100 data-leave:ease-in sm:text-sm"
          >
            {options.map((option) => (
              <ListboxOption
                key={option.key}
                value={option}
                className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-focus:bg-teal-600 data-focus:text-white data-focus:outline-hidden"
              >
                <span className="block truncate font-normal group-data-selected:font-semibold">
                  {option.value}
                </span>

                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-teal-600 group-[&:not([data-selected])]:hidden group-data-focus:text-white">
                  <CheckIcon aria-hidden="true" className="size-5" />
                </span>
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      </Listbox>
    );
  }
);
