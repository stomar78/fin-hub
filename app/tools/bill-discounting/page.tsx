import { notFound } from 'next/navigation';

import ToolPage from '@/components/tools/tool-page';
import { getToolDefinition } from '@/lib/tool-registry';

export default function BillDiscountingToolPage() {
  const tool = getToolDefinition('bill-discounting');

  if (!tool) {
    notFound();
  }

  return <ToolPage tool={tool} />;
}
