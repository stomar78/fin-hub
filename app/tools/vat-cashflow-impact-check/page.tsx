import { notFound } from 'next/navigation';

import ToolPage from '@/components/tools/tool-page';
import { getToolDefinition } from '@/lib/tool-registry';

export default function VatCashflowImpactCheckToolPage() {
  const tool = getToolDefinition('vat-cashflow-impact-check');

  if (!tool) {
    notFound();
  }

  return <ToolPage tool={tool} />;
}
