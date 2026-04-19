import { notFound } from 'next/navigation';

import ToolPage from '@/components/tools/tool-page';
import { getToolDefinition } from '@/lib/tool-registry';

export default function TreasuryLiquidityReviewToolPage() {
  const tool = getToolDefinition('treasury-liquidity-review');

  if (!tool) {
    notFound();
  }

  return <ToolPage tool={tool} />;
}
