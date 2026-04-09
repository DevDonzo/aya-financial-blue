import { memo } from 'react';
import { OpenSidebar } from './Menus';
import AyaRuntimeBadge from './AyaRuntimeBadge';

function Header() {
  return (
    <div className="absolute top-0 z-10 flex h-[52px] w-full items-center justify-between bg-gradient-to-b from-presentation to-transparent p-2 font-semibold text-text-primary">
      <div className="flex items-center gap-2 px-1">
        <OpenSidebar className="md:hidden" />
        <div className="rounded-full border border-border-light bg-surface-chat px-3 py-1 text-sm font-medium">
          Aya Employee Copilot
        </div>
        <AyaRuntimeBadge />
      </div>
      <div />
    </div>
  );
}

const MemoizedHeader = memo(Header);
MemoizedHeader.displayName = 'Header';

export default MemoizedHeader;
