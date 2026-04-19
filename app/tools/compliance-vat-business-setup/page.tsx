import { notFound } from 'next/navigation';

import ToolPage from '@/components/tools/tool-page';
import { getToolDefinition } from '@/lib/tool-registry';

export default function ComplianceVatBusinessSetupToolPage() {
  const tool = getToolDefinition('compliance-vat-business-setup');

  if (!tool) {
    notFound();
  }

  return <ToolPage tool={tool} />;
}
