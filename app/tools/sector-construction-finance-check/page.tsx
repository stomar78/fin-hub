import { notFound } from 'next/navigation';

import ToolPage from '@/components/tools/tool-page';
import { getToolDefinition } from '@/lib/tool-registry';

export default function SectorConstructionFinanceCheckToolPage() {
  const tool = getToolDefinition('sector-construction-finance-check');

  if (!tool) {
    notFound();
  }

  return <ToolPage tool={tool} />;
}
