'use client';

import {
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput as ComboboxInputComponent,
    ComboboxItem,
    ComboboxList,
    Combobox as ComboboxRoot,
} from '@/components/ui/combobox';
import { useEffect, useMemo, useRef, useState } from 'react';

type CustomComboBoxItem = { value: string; label: string };

interface CustomComboBoxProps {
    items: CustomComboBoxItem[];
    placeholder: string;
    value?: string | null;
    defaultValue?: string | null;
    onSelect?: (value: string | null) => void;
    showClear?: boolean;
    /** Optional id so an external <Label htmlFor={id}> targets this input. */
    id?: string;
}

export function CustomComboBox({
    items,
    placeholder,
    value,
    defaultValue,
    onSelect,
    showClear = false,
    id,
}: CustomComboBoxProps) {
    const comboboxRef = useRef<HTMLDivElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [popupOpen, setPopupOpen] = useState(false);

    // Radix Dialog (used by our modals) dismisses on Escape through a
    // document-level *capture* listener, which runs before Base UI closes
    // this popup (document-level *bubble* listener). While the popup is
    // open, mark Escape as handled at the window capture phase — earlier
    // than document capture — so the first press closes only the popup and
    // a second press closes the dialog. Base UI ignores defaultPrevented,
    // so the popup still closes normally.
    useEffect(() => {
        if (!popupOpen) return;

        const keepDialogOpen = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                event.preventDefault();
            }
        };

        window.addEventListener('keydown', keepDialogOpen, { capture: true });
        return () =>
            window.removeEventListener('keydown', keepDialogOpen, {
                capture: true,
            });
    }, [popupOpen]);

    const selectedItem = useMemo(() => {
        if (value == null) return null;
        return items.find((item) => item.value === value) || null;
    }, [value, items]);

    const defaultSelectedItem = useMemo(() => {
        if (defaultValue == null) return null;
        return items.find((item) => item.value === defaultValue) || null;
    }, [defaultValue, items]);

    // Directly update the input element's value in the DOM when selectedItem changes
    useEffect(() => {
        if (comboboxRef.current) {
            const input = comboboxRef.current.querySelector(
                'input[role="combobox"]',
            ) as HTMLInputElement;
            if (input) {
                // Always set the value, even if empty
                if (selectedItem) {
                    input.value = selectedItem.label;
                } else {
                    input.value = '';
                }
            }
        }
    }, [selectedItem?.value]);

    return (
        <div ref={containerRef}>
            <ComboboxRoot
                items={items}
                itemToStringValue={(item: CustomComboBoxItem) => item.label}
                value={selectedItem}
                defaultValue={defaultSelectedItem}
                onOpenChange={(open) => setPopupOpen(open)}
                onValueChange={(item: CustomComboBoxItem | null) => {
                    // Also update the input value immediately on selection
                    if (comboboxRef.current) {
                        const input = comboboxRef.current.querySelector(
                            'input[role="combobox"]',
                        ) as HTMLInputElement;
                        if (input) {
                            input.value = item?.label || '';
                        }
                    }
                    onSelect?.(item?.value ?? null);
                }}
            >
                <ComboboxInputComponent
                    id={id}
                    placeholder={placeholder}
                    showClear={showClear}
                />
                <ComboboxContent container={containerRef}>
                    <ComboboxEmpty>No items found.</ComboboxEmpty>
                    <ComboboxList>
                        {(item) => (
                            <ComboboxItem key={item.value} value={item}>
                                {item.label}
                            </ComboboxItem>
                        )}
                    </ComboboxList>
                </ComboboxContent>
            </ComboboxRoot>
        </div>
    );
}
