"use client";
import React, { useState } from "react";

export interface AccordionItemProps {
  id: string;
  title: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function AccordionItem({ id, title, children, defaultOpen }: AccordionItemProps) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div className="accordion__item">
      <button
        aria-expanded={open}
        aria-controls={`acc-${id}`}
        onClick={() => setOpen((v) => !v)}
        className="accordion__button"
      >
        <span>{title}</span>
        <span className={`transition-transform ${open ? "rotate-180" : "rotate-0"}`}>⌄</span>
      </button>
      {open && (
        <div id={`acc-${id}`} className="accordion__panel">
          {children}
        </div>
      )}
    </div>
  );
}

export interface AccordionProps {
  items: AccordionItemProps[];
  defaultOpenId?: string;
}

export function Accordion({ items, defaultOpenId }: AccordionProps) {
  return (
    <div className="accordion">
      {items.map((it) => (
        <AccordionItem key={it.id} {...it} defaultOpen={it.id === defaultOpenId || it.defaultOpen} />
      ))}
    </div>
  );
}

export default Accordion;
