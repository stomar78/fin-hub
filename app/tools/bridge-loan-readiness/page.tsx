import { notFound } from 'next/navigation';

import ToolPage from '@/components/tools/tool-page';
import { getToolDefinition } from '@/lib/tool-registry';

export default function BridgeLoanReadinessToolPage() {
  const tool = getToolDefinition('bridge-loan-readiness');

  if (!tool) {
    notFound();
  }

  return <ToolPage tool={tool} />;
}
