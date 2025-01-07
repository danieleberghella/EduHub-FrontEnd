import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function DatePickerInput({onChange, selected, className}: {onChange: (date?: Date) => void, selected: Date, className: string} ) {

  return (
      <Popover>
        <PopoverTrigger asChild className={className}>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !selected && "text-muted-foreground"
            )}
          >
            <CalendarIcon />
            {selected ? format(selected, "PPP") : <span>Birth Date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={selected}
            onSelect={onChange}
            initialFocus
          />
        </PopoverContent>
      </Popover>
  )
}
