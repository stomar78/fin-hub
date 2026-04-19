import { notFound } from 'next/navigation';

import ToolPage from '@/components/tools/tool-page';
import { getToolDefinition } from '@/lib/tool-registry';

export default function FundraisingReadinessAuditToolPage() {
  const tool = getToolDefinition('fundraising-readiness-audit');

  if (!tool) {
    notFound();
  }

  return <ToolPage tool={tool} />;
}
