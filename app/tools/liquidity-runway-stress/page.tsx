import { notFound } from 'next/navigation';

import ToolPage from '@/components/tools/tool-page';
import { getToolDefinition } from '@/lib/tool-registry';

export default function LiquidityRunwayStressToolPage() {
  const tool = getToolDefinition('liquidity-runway-stress');

  if (!tool) {
    notFound();
  }

  return <ToolPage tool={tool} />;
}
