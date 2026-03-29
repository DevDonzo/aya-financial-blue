import { type ReactNode } from "react";

export function Modal(input: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  if (!input.open) {
    return null;
  }

  return (
    <div className="modal-backdrop" onClick={input.onClose} role="presentation">
      <div
        className="modal-card"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={input.title}
      >
        <div className="modal-head">
          <h2>{input.title}</h2>
          <button type="button" className="ghost-button" onClick={input.onClose}>
            Close
          </button>
        </div>
        {input.children}
      </div>
    </div>
  );
}

