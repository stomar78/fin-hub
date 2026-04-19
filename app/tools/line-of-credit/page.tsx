import { notFound } from 'next/navigation';

import ToolPage from '@/components/tools/tool-page';
import { getToolDefinition } from '@/lib/tool-registry';

export default function LineOfCreditToolPage() {
  const tool = getToolDefinition('line-of-credit');

  if (!tool) {
    notFound();
  }

  return <ToolPage tool={tool} />;
}
