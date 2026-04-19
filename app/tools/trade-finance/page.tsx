import { notFound } from 'next/navigation';

import ToolPage from '@/components/tools/tool-page';
import { getToolDefinition } from '@/lib/tool-registry';

export default function TradeFinanceToolPage() {
  const tool = getToolDefinition('trade-finance');

  if (!tool) {
    notFound();
  }

  return <ToolPage tool={tool} />;
}
