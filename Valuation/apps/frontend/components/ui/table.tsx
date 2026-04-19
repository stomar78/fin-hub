"use client";
import React from "react";

export function Table({ className, children }: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <table className={`w-full border-collapse ${className || ""}`.trim()}>{children}</table>
  );
}

export function THead({ className, children }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead className={className}>{children}</thead>
  );
}

export function TBody({ className, children }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className={className}>{children}</tbody>
  );
}

export function TR({ className, children }: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr className={className}>{children}</tr>
  );
}

export function TH({ className, children }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th className={`text-left text-xs text-slate-700 border-b border-slate-200 p-2 ${className || ""}`.trim()}>{children}</th>
  );
}

export function TD({ className, children }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={`text-sm border-b border-slate-100 p-2 align-top ${className || ""}`.trim()}>{children}</td>
  );
}

export default Table;
