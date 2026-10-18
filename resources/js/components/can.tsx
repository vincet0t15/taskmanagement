import type { ReactNode } from 'react';
import { useCan } from '@/hooks/use-can';

export function Can({
    permission,
    children,
}: {
    permission: string | string[];
    children: ReactNode;
}) {
    const can = useCan();
    const allowed = Array.isArray(permission)
        ? permission.some((item) => can(item))
        : can(permission);

    if (!allowed) {
        return null;
    }

    return <>{children}</>;
}
