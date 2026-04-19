"use client";
import React, { useEffect } from "react";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  title?: React.ReactNode;
}

export default function Modal({ open, onClose, children, size = "md", title }: ModalProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  const sizeClass = size === "sm" ? "modal--sm" : size === "lg" ? "modal--lg" : "";
  return (
    <div className={`modal open ${sizeClass}`.trim()} role="dialog" aria-modal="true">
      <div className="modal__backdrop" onClick={onClose} />
      <div className="modal__dialog">
        <div className="row between">
          <div className="card__title">{title || "Dialog"}</div>
          <button className="icon-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="stack" style={{ marginTop: 8 }}>{children}</div>
      </div>
    </div>
  );
}
