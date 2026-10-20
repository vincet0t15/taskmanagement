'use client'

import { useId, useState } from 'react'
import type { MouseEvent } from 'react'

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from '@/components/ui/combobox'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export type ComboboxMultipleExpandableProps<T = string> = {
  /** Label text for the combobox */
  label?: string
  /** Custom id for accessibility */
  id?: string
  /** List of items to choose from */
  items: T[]
  /** Controlled value */
  value?: T[]
  /** Default value for uncontrolled usage */
  defaultValue?: T[]
  /** Callback when value changes */
  onValueChange?: (values: T[]) => void
  /** Function to get the display label for an item */
  getLabel?: (item: T) => React.ReactNode
  /** Function to get the value/key for an item */
  getValue?: (item: T) => string | number
  /** Maximum number of chips to show before expanding */
  maxVisible?: number
  /** Text shown when no items are found */
  emptyText?: string
  /** Placeholder for input */
  placeholder?: string
  /** Disable the combobox */
  disabled?: boolean
  /** Additional className for wrapper */
  className?: string
  /** Additional className for combobox */
  comboboxClassName?: string
}

export function ComboboxMultipleExpandable<T = string>({
  label,
  id: idProp,
  items,
  value,
  defaultValue = [],
  onValueChange,
  getLabel = (item: T) => String(item) as React.ReactNode,
  getValue = (item: T) => String(item),
  maxVisible = 2,
  emptyText = 'No items found.',
  placeholder,
  disabled = false,
  className,
  comboboxClassName,
}: ComboboxMultipleExpandableProps<T>) {
  const generatedId = useId()
  const id = idProp ?? generatedId
  const anchor = useComboboxAnchor()
  const [expanded, setExpanded] = useState(false)

  const isControlled = value !== undefined
  const [internalValue, setInternalValue] = useState<T[]>(defaultValue)
  const currentValues = isControlled ? (value as T[]) : internalValue

  const handleValueChange = (vals: T[]) => {
    if (!isControlled) {
      setInternalValue(vals)
    }
    onValueChange?.(vals)
  }

  const getItemValue = (item: T) => getValue(item).toString()

  return (
    <div className={cn('w-full space-y-2', className)}>
      {label && <Label htmlFor={id}>{label}</Label>}

      <Combobox
        multiple
        autoHighlight
        id={id}
        items={items}
        value={currentValues}
        onValueChange={handleValueChange}
        disabled={disabled}
        className={comboboxClassName}
      >
        <ComboboxChips ref={anchor}>
          <ComboboxValue>
            {(values: T[]) => {
              const visibleValues = expanded ? values : values.slice(0, maxVisible)
              const hiddenCount = values.length - maxVisible

              return (
                <>
                  {visibleValues.map((valueItem: T) => (
                    <ComboboxChip key={getItemValue(valueItem)}>
                      {getLabel(valueItem)}
                    </ComboboxChip>
                  ))}
                  {values.length > maxVisible && (
                    <ComboboxChip
                      key="toggle"
                      showRemove={false}
                      className="cursor-pointer select-none"
                      onClick={(e: MouseEvent) => {
                        e.stopPropagation()
                        setExpanded((prev) => !prev)
                      }}
                    >
                      {expanded ? 'Show Less' : `+${hiddenCount} more`}
                    </ComboboxChip>
                  )}
                  <ComboboxChipsInput placeholder={placeholder} />
                </>
              )
            }}
          </ComboboxValue>
        </ComboboxChips>

        <ComboboxContent anchor={anchor}>
          <ComboboxEmpty>{emptyText}</ComboboxEmpty>
          <ComboboxList>
            {(item: T) => (
              <ComboboxItem key={getItemValue(item)} value={item}>
                {getLabel(item)}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  )
}

export default ComboboxMultipleExpandable
