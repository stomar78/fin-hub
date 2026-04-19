import { notFound } from 'next/navigation';

import ToolPage from '@/components/tools/tool-page';
import { getToolDefinition } from '@/lib/tool-registry';

export default function TradeFinanceBidBondToolPage() {
  const tool = getToolDefinition('trade-finance-bid-bond');

  if (!tool) {
    notFound();
  }

  return <ToolPage tool={tool} />;
}
