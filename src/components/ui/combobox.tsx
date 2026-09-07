"use client"

import * as React from "react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Popover as PopoverPrimitive,
  PopoverContent as PopoverContentPrimitive,
  PopoverTrigger as PopoverTriggerPrimitive,
} from "@/components/ui/popover"
import {
  Command as CommandPrimitive,
  CommandEmpty as CommandEmptyPrimitive,
  CommandGroup as CommandGroupPrimitive,
  CommandInput as CommandInputPrimitive,
  CommandItem as CommandItemPrimitive,
  CommandList as CommandListPrimitive,
  CommandSeparator as CommandSeparatorPrimitive,
} from "@/components/ui/command"
import { CaretDownIcon, XIcon, CheckIcon } from "@phosphor-icons/react"

// Context internal untuk menghubungkan Radix Popover + cmdk
interface ComboboxContextValue {
  value: any;
  onValueChange?: (value: any) => void;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  items?: any[];
  getItemLabel?: (item: any) => string;
  getItemValue?: (item: any) => string;
  searchValue: string;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
}

const ComboboxContext = React.createContext<ComboboxContextValue | null>(null);

function useComboboxContext() {
  const ctx = React.useContext(ComboboxContext);
  if (!ctx) {
    throw new Error("Combobox sub-components must be used within a <Combobox /> provider.");
  }
  return ctx;
}

interface ComboboxProps {
  items?: any[];
  value?: any;
  defaultValue?: any;
  onValueChange?: (value: any) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  getItemLabel?: (item: any) => string;
  getItemValue?: (item: any) => string;
  children?: React.ReactNode;
}

function Combobox({
  items,
  value: controlledValue,
  defaultValue,
  onValueChange,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  getItemLabel = (item) => (typeof item === "string" ? item : item?.name || item?.label || ""),
  getItemValue = (item) => (typeof item === "string" ? item : item?.slug || item?.value || item?.id || ""),
  children,
}: ComboboxProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const [searchValue, setSearchValue] = React.useState("");

  const isControlledValue = controlledValue !== undefined;
  const value = isControlledValue ? controlledValue : uncontrolledValue;

  const isControlledOpen = controlledOpen !== undefined;
  const open = isControlledOpen ? controlledOpen : uncontrolledOpen;

  const setOpen = React.useCallback(
    (nextOpen: boolean | ((prev: boolean) => boolean)) => {
      const computed = typeof nextOpen === "function" ? nextOpen(open) : nextOpen;
      if (!isControlledOpen) {
        setUncontrolledOpen(computed);
      }
      if (onOpenChange) {
        onOpenChange(computed);
      }
    },
    [open, isControlledOpen, onOpenChange]
  );

  const handleValueChange = React.useCallback(
    (val: any) => {
      if (!isControlledValue) {
        setUncontrolledValue(val);
      }
      if (onValueChange) {
        onValueChange(val);
      }
    },
    [isControlledValue, onValueChange]
  );

  return (
    <ComboboxContext.Provider
      value={{
        value,
        onValueChange: handleValueChange,
        open,
        setOpen,
        items,
        getItemLabel,
        getItemValue,
        searchValue,
        setSearchValue,
      }}
    >
      <PopoverPrimitive open={open} onOpenChange={setOpen}>
        {children}
      </PopoverPrimitive>
    </ComboboxContext.Provider>
  );
}

function ComboboxValue({ children, placeholder }: { children?: React.ReactNode; placeholder?: string }) {
  const { value, getItemLabel } = useComboboxContext();
  if (children) return <>{children}</>;
  if (!value) return <>{placeholder || ""}</>;
  if (typeof value === "string") return <>{value}</>;
  const label = getItemLabel ? getItemLabel(value) : value?.name || value?.label || "";
  return <>{label || placeholder || ""}</>;
}

function ComboboxTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof PopoverTriggerPrimitive>) {
  return (
    <PopoverTriggerPrimitive
      data-slot="combobox-trigger"
      className={cn("[&_svg:not([class*='size-'])]:size-4", className)}
      {...props}
    >
      {children}
      <CaretDownIcon className="pointer-events-none size-4 text-muted-foreground" />
    </PopoverTriggerPrimitive>
  );
}

function ComboboxClear({ className, onClick, ...props }: React.ComponentProps<"button">) {
  const { onValueChange } = useComboboxContext();
  return (
    <InputGroupButton
      variant="ghost"
      size="icon-xs"
      data-slot="combobox-clear"
      className={cn(className)}
      onClick={(e) => {
        if (onValueChange) onValueChange(null);
        if (onClick) onClick(e);
      }}
      {...props}
    >
      <XIcon className="pointer-events-none" />
    </InputGroupButton>
  );
}

function ComboboxInput({
  className,
  children,
  disabled = false,
  showTrigger = true,
  showClear = false,
  placeholder,
  value: controlledInputValue,
  onChange,
  ...props
}: React.ComponentProps<"input"> & {
  showTrigger?: boolean;
  showClear?: boolean;
}) {
  const { value, getItemLabel, setSearchValue, searchValue, setOpen } = useComboboxContext();

  const displayLabel = React.useMemo(() => {
    if (!value) return "";
    return getItemLabel ? getItemLabel(value) : (typeof value === "string" ? value : value?.name || value?.label || "");
  }, [value, getItemLabel]);

  return (
    <InputGroup className={cn("w-auto", className)}>
      <InputGroupInput
        disabled={disabled}
        placeholder={placeholder}
        value={controlledInputValue !== undefined ? controlledInputValue : searchValue || displayLabel}
        onChange={(e) => {
          setSearchValue(e.target.value);
          setOpen(true);
          if (onChange) onChange(e);
        }}
        onClick={() => setOpen(true)}
        {...props}
      />
      <InputGroupAddon align="inline-end">
        {showTrigger && (
          <InputGroupButton
            size="icon-xs"
            variant="ghost"
            asChild
            data-slot="input-group-button"
            className="group-has-data-[slot=combobox-clear]/input-group:hidden data-pressed:bg-transparent"
            disabled={disabled}
          >
            <ComboboxTrigger />
          </InputGroupButton>
        )}
        {showClear && <ComboboxClear disabled={disabled} />}
      </InputGroupAddon>
      {children}
    </InputGroup>
  );
}

function ComboboxContent({
  className,
  children,
  side = "bottom",
  sideOffset = 6,
  align = "start",
  alignOffset = 0,
  showSearch = true,
  searchPlaceholder = "Search...",
  ...props
}: React.ComponentProps<typeof PopoverContentPrimitive> & {
  showSearch?: boolean;
  searchPlaceholder?: string;
}) {
  const { searchValue, setSearchValue } = useComboboxContext();

  return (
    <PopoverContentPrimitive
      data-slot="combobox-content"
      side={side}
      sideOffset={sideOffset}
      align={align}
      alignOffset={alignOffset}
      className={cn(
        "group/combobox-content relative max-h-(--available-height) w-(--anchor-width) max-w-(--available-width) min-w-[calc(var(--anchor-width)+--spacing(7))] origin-(--transform-origin) overflow-hidden rounded-3xl bg-popover text-popover-foreground shadow-lg ring-1 ring-foreground/5 duration-100 data-[chips=true]:min-w-(--anchor-width) data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 *:data-[slot=input-group]:m-1.5 *:data-[slot=input-group]:mb-0 *:data-[slot=input-group]:h-8 *:data-[slot=input-group]:border-input/30 *:data-[slot=input-group]:bg-input/50 *:data-[slot=input-group]:shadow-none dark:ring-foreground/10 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 p-1",
        className
      )}
      {...props}
    >
      <CommandPrimitive value={searchValue} onValueChange={setSearchValue}>
        {showSearch && (
          <CommandInputPrimitive
            placeholder={searchPlaceholder}
            value={searchValue}
            onValueChange={setSearchValue}
          />
        )}
        {children}
      </CommandPrimitive>
    </PopoverContentPrimitive>
  );
}

function ComboboxList({ className, children, ...props }: React.ComponentProps<typeof CommandListPrimitive>) {
  const { items } = useComboboxContext();

  return (
    <CommandListPrimitive
      data-slot="combobox-list"
      className={cn(
        "no-scrollbar max-h-[min(calc(--spacing(72)---spacing(9)),calc(var(--available-height)---spacing(9)))] scroll-py-1.5 overflow-y-auto overscroll-contain p-1.5 data-empty:p-0",
        className
      )}
      {...props}
    >
      {typeof children === "function" ? items?.map(children) : children}
    </CommandListPrimitive>
  );
}

function ComboboxItem({
  className,
  children,
  value: itemValue,
  onSelect,
  ...props
}: React.ComponentProps<typeof CommandItemPrimitive> & { value: any }) {
  const { value: selectedValue, onValueChange, setOpen, getItemValue, getItemLabel } = useComboboxContext();

  const getVal = (i: any) => (getItemValue ? getItemValue(i) : typeof i === "string" ? i : i?.slug || i?.value || i?.id || "");
  const getLbl = (i: any) => (getItemLabel ? getItemLabel(i) : typeof i === "string" ? i : i?.name || i?.label || "");

  const currentItemValue = getVal(itemValue);
  const selectedItemValue = getVal(selectedValue);
  const isSelected = Boolean(currentItemValue && selectedItemValue && currentItemValue === selectedItemValue);

  const itemText = typeof children === "string" ? children : getLbl(itemValue);

  return (
    <CommandItemPrimitive
      data-slot="combobox-item"
      value={itemText}
      onSelect={(currentVal) => {
        if (onValueChange) onValueChange(itemValue);
        setOpen(false);
        if (onSelect) onSelect(currentVal);
      }}
      className={cn(
        "relative flex w-full cursor-default items-center gap-2.5 rounded-2xl py-2 pr-8 pl-3 text-sm font-medium outline-hidden select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground not-data-[variant=destructive]:data-highlighted:**:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
      {isSelected && (
        <span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center">
          <CheckIcon className="pointer-events-none" />
        </span>
      )}
    </CommandItemPrimitive>
  );
}

function ComboboxGroup({ className, ...props }: React.ComponentProps<typeof CommandGroupPrimitive>) {
  return (
    <CommandGroupPrimitive
      data-slot="combobox-group"
      className={cn(className)}
      {...props}
    />
  );
}

function ComboboxLabel({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="combobox-label"
      className={cn("px-3 py-2.5 text-xs text-muted-foreground", className)}
      {...props}
    />
  );
}

function ComboboxCollection({ children }: { children?: React.ReactNode }) {
  return <div data-slot="combobox-collection">{children}</div>;
}

function ComboboxEmpty({ className, children, ...props }: React.ComponentProps<typeof CommandEmptyPrimitive>) {
  return (
    <CommandEmptyPrimitive
      data-slot="combobox-empty"
      className={cn(
        "w-full justify-center py-2 text-center text-sm text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
    </CommandEmptyPrimitive>
  );
}

function ComboboxSeparator({ className, ...props }: React.ComponentProps<typeof CommandSeparatorPrimitive>) {
  return (
    <CommandSeparatorPrimitive
      data-slot="combobox-separator"
      className={cn("-mx-1.5 my-1.5 h-px bg-border", className)}
      {...props}
    />
  );
}

function ComboboxChips({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="combobox-chips"
      className={cn(
        "flex min-h-9 flex-wrap items-center gap-1.5 rounded-3xl border border-transparent bg-input/50 bg-clip-padding px-3 py-1.5 text-sm transition-[color,box-shadow,background-color] focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/30 has-aria-invalid:border-destructive has-aria-invalid:ring-3 has-aria-invalid:ring-destructive/20 has-data-[slot=combobox-chip]:px-1.5 dark:has-aria-invalid:border-destructive/50 dark:has-aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function ComboboxChip({
  className,
  children,
  showRemove = true,
  onRemove,
  ...props
}: React.ComponentProps<"div"> & {
  showRemove?: boolean;
  onRemove?: () => void;
}) {
  return (
    <div
      data-slot="combobox-chip"
      className={cn(
        "flex h-[calc(--spacing(5.5))] w-fit items-center justify-center gap-1 rounded-3xl bg-input px-2 text-xs font-medium whitespace-nowrap text-foreground has-disabled:pointer-events-none has-disabled:cursor-not-allowed has-disabled:opacity-50 has-data-[slot=combobox-chip-remove]:pr-0 dark:bg-input/60",
        className
      )}
      {...props}
    >
      {children}
      {showRemove && (
        <Button
          variant="ghost"
          size="icon-xs"
          className="-ml-1 opacity-50 hover:opacity-100"
          data-slot="combobox-chip-remove"
          onClick={onRemove}
        >
          <XIcon className="pointer-events-none" />
        </Button>
      )}
    </div>
  );
}

function ComboboxChipsInput({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      data-slot="combobox-chip-input"
      className={cn("min-w-16 flex-1 outline-none bg-transparent text-sm", className)}
      {...props}
    />
  );
}

function useComboboxAnchor() {
  return React.useRef<HTMLDivElement | null>(null);
}

export {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxGroup,
  ComboboxLabel,
  ComboboxCollection,
  ComboboxEmpty,
  ComboboxSeparator,
  ComboboxChips,
  ComboboxChip,
  ComboboxChipsInput,
  ComboboxTrigger,
  ComboboxValue,
  useComboboxAnchor,
}
