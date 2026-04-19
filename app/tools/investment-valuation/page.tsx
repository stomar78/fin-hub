import { notFound } from 'next/navigation';

import ToolPage from '@/components/tools/tool-page';
import { getToolDefinition } from '@/lib/tool-registry';

export default function InvestmentValuationToolPage() {
  const tool = getToolDefinition('investment-valuation');

  if (!tool) {
    notFound();
  }

  return <ToolPage tool={tool} />;
}
