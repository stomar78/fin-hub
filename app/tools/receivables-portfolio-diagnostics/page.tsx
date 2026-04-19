import { notFound } from 'next/navigation';

import ToolPage from '@/components/tools/tool-page';
import { getToolDefinition } from '@/lib/tool-registry';

export default function ReceivablesPortfolioDiagnosticsToolPage() {
  const tool = getToolDefinition('receivables-portfolio-diagnostics');

  if (!tool) {
    notFound();
  }

  return <ToolPage tool={tool} />;
}
