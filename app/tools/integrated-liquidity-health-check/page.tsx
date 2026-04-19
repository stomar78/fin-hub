import { notFound } from 'next/navigation';

import ToolPage from '@/components/tools/tool-page';
import { getToolDefinition } from '@/lib/tool-registry';

export default function IntegratedLiquidityHealthCheckToolPage() {
  const tool = getToolDefinition('integrated-liquidity-health-check');

  if (!tool) {
    notFound();
  }

  return <ToolPage tool={tool} />;
}
