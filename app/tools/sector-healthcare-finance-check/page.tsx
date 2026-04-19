import { notFound } from 'next/navigation';

import ToolPage from '@/components/tools/tool-page';
import { getToolDefinition } from '@/lib/tool-registry';

export default function SectorHealthcareFinanceCheckToolPage() {
  const tool = getToolDefinition('sector-healthcare-finance-check');

  if (!tool) {
    notFound();
  }

  return <ToolPage tool={tool} />;
}
