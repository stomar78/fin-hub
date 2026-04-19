import { notFound } from 'next/navigation';

import ToolPage from '@/components/tools/tool-page';
import { getToolDefinition } from '@/lib/tool-registry';

export default function ProjectFinanceReadinessTrackerToolPage() {
  const tool = getToolDefinition('project-finance-readiness-tracker');

  if (!tool) {
    notFound();
  }

  return <ToolPage tool={tool} />;
}
