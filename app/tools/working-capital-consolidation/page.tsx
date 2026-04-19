import { notFound } from 'next/navigation';

import ToolPage from '@/components/tools/tool-page';
import { getToolDefinition } from '@/lib/tool-registry';

export default function WorkingCapitalConsolidationToolPage() {
  const tool = getToolDefinition('working-capital-consolidation');

  if (!tool) {
    notFound();
  }

  return <ToolPage tool={tool} />;
}
