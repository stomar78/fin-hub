import { notFound } from 'next/navigation';

import ToolPage from '@/components/tools/tool-page';
import { getToolDefinition } from '@/lib/tool-registry';

export default function InvoicePurchaseComparisonToolPage() {
  const tool = getToolDefinition('invoice-purchase-comparison');

  if (!tool) {
    notFound();
  }

  return <ToolPage tool={tool} />;
}
