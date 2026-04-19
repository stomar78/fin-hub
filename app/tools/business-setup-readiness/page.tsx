import { notFound } from 'next/navigation';

import ToolPage from '@/components/tools/tool-page';
import { getToolDefinition } from '@/lib/tool-registry';

export default function BusinessSetupReadinessToolPage() {
  const tool = getToolDefinition('business-setup-readiness');

  if (!tool) {
    notFound();
  }

  return <ToolPage tool={tool} />;
}
