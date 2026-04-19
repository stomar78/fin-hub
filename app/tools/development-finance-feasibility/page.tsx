import { notFound } from 'next/navigation';

import ToolPage from '@/components/tools/tool-page';
import { getToolDefinition } from '@/lib/tool-registry';

export default function DevelopmentFinanceFeasibilityToolPage() {
  const tool = getToolDefinition('development-finance-feasibility');

  if (!tool) {
    notFound();
  }

  return <ToolPage tool={tool} />;
}
