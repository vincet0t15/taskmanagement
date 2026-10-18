import { useState } from 'react';
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const HEX_PATTERN = /^#[0-9A-Fa-f]{6}$/;

/**
 * Common status colours offered as one-click presets. Kept deliberately small
 * so the row wraps rather than dominating the dialog.
 */
const PRESET_COLORS = [
    '#64748B', // slate — neutral / to do
    '#2563EB', // blue — in progress
    '#D97706', // amber — on hold
    '#16A34A', // green — completed
    '#DC2626', // red — cancelled
    '#7C3AED', // violet
    '#DB2777', // pink
    '#0D9488', // teal
    '#EA580C', // orange
    '#000000', // black
];

interface ColorPickerProps {
    id: string;
    value: string;
    onValueChange: (value: string) => void;
    error?: string;
    disabled?: boolean;
}

export default function ColorPicker({
    id,
    value,
    onValueChange,
    error,
    disabled = false,
}: ColorPickerProps) {
    // Mirrors the hex input locally so a half-typed value (e.g. "#f") is
    // editable; only a complete colour is pushed back up to the form.
    const [draft, setDraft] = useState(value);

    const commit = (next: string) => {
        setDraft(next);

        if (HEX_PATTERN.test(next)) {
            onValueChange(next.toUpperCase());
        }
    };

    const isValid = HEX_PATTERN.test(value);

    return (
        <div className="grid gap-2">
            <Label htmlFor={id}>Color</Label>

            <div className="flex items-center gap-2">
                <label
                    htmlFor={id}
                    className={cn(
                        'relative inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-md border shadow-sm transition-opacity',
                        disabled && 'cursor-not-allowed opacity-50',
                    )}
                    style={{ backgroundColor: isValid ? value : 'transparent' }}
                    title="Pick a color"
                >
                    {/* Invisible native picker sitting on top of the swatch so the
                        whole chip is clickable, including keyboard focus. */}
                    <input
                        id={id}
                        name={id}
                        type="color"
                        value={isValid ? value : '#000000'}
                        disabled={disabled}
                        onChange={(e) => commit(e.target.value)}
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                        aria-label="Color picker"
                    />
                </label>

                <Input
                    id={`${id}-hex`}
                    name={`${id}-hex`}
                    value={draft}
                    onChange={(e) => commit(e.target.value)}
                    disabled={disabled}
                    placeholder="#2563EB"
                    maxLength={7}
                    spellCheck={false}
                    autoComplete="off"
                    className="flex-1 font-mono uppercase"
                    aria-invalid={!isValid}
                />
            </div>

            <div className="flex flex-wrap gap-1.5">
                {PRESET_COLORS.map((preset) => (
                    <button
                        key={preset}
                        type="button"
                        disabled={disabled}
                        onClick={() => commit(preset)}
                        title={preset}
                        aria-label={`Use color ${preset}`}
                        className={cn(
                            'h-6 w-6 rounded-full border transition-transform hover:scale-110',
                            value.toUpperCase() === preset
                                ? 'border-foreground ring-2 ring-ring ring-offset-2'
                                : 'border-black/10',
                        )}
                        style={{ backgroundColor: preset }}
                    />
                ))}
            </div>

            {!isValid && (
                <p className="text-sm text-muted-foreground">
                    Enter a hex color such as{' '}
                    <span className="font-mono">#2563EB</span>, or pick one
                    above.
                </p>
            )}

            <InputError message={error} />
        </div>
    );
}
