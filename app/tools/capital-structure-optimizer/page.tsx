import { notFound } from 'next/navigation';

import ToolPage from '@/components/tools/tool-page';
import { getToolDefinition } from '@/lib/tool-registry';

export default function CapitalStructureOptimizerToolPage() {
  const tool = getToolDefinition('capital-structure-optimizer');

  if (!tool) {
    notFound();
  }

  return <ToolPage tool={tool} />;
}
