import { notFound } from 'next/navigation';

import ToolPage from '@/components/tools/tool-page';
import { getToolDefinition } from '@/lib/tool-registry';

export default function IntegratedFinancialHealthToolPage() {
  const tool = getToolDefinition('integrated-financial-health');

  if (!tool) {
    notFound();
  }

  return <ToolPage tool={tool} />;
}
