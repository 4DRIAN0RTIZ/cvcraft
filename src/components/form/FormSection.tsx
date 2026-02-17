import { useState, type ReactNode } from 'react';

interface Props {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export default function FormSection({ title, children, defaultOpen = true }: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="form-section">
      <button
        type="button"
        className="form-section-header"
        onClick={() => setOpen(!open)}
      >
        <span>{title}</span>
        <span className="form-section-arrow">{open ? '\u25B2' : '\u25BC'}</span>
      </button>
      {open && <div className="form-section-body">{children}</div>}
    </div>
  );
}
