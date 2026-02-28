// src/components/ui/multiple-selector.tsx
import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";

export type Option = {
  value: string;
  label: string;
};

interface MultipleSelectorProps {
  value?: Option[];
  onChange?: (options: Option[]) => void;
  defaultOptions?: Option[];
  placeholder?: string;
  emptyIndicator?: React.ReactNode;
}

export const MultipleSelector = ({
  value = [],
  onChange,
  defaultOptions = [],
  placeholder = "Select items...",
  emptyIndicator,
}: MultipleSelectorProps) => {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const selected = value;
  const selectables = defaultOptions.filter(
    (opt) => !selected.some((s) => s.value === opt.value)
  );

  const handleUnselect = (item: Option) => {
    onChange?.(selected.filter((i) => i.value !== item.value));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (inputValue === "" && e.key === "Backspace") {
      const newSelected = [...selected];
      newSelected.pop();
      onChange?.(newSelected);
    }
  };

  return (
    <div className="w-full">
      <div
        className="flex flex-wrap gap-1 min-h-[40px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
        onClick={() => setOpen(true)}
      >
        {selected.map((option) => (
          <Badge key={option.value} variant="secondary" className="mr-1 mb-1">
            {option.label}
            <button
              className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleUnselect(option);
                }
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleUnselect(option);
              }}
            >
              <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
            </button>
          </Badge>
        ))}
        <input
          className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
          placeholder={selected.length === 0 ? placeholder : ""}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      {open && (
        <div className="relative mt-1">
          <Command className="rounded-lg border shadow-md">
            <CommandInput
              placeholder="Search..."
              value={inputValue}
              onValueChange={setInputValue}
            />
            <CommandEmpty>{emptyIndicator || "No results found."}</CommandEmpty>
            <CommandGroup className="max-h-64 overflow-auto">
              {selectables.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => {
                    onChange?.([...selected, option]);
                    setInputValue("");
                  }}
                  className="cursor-pointer"
                >
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </div>
      )}
    </div>
  );
};
