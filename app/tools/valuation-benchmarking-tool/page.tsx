import { notFound } from 'next/navigation';

import ToolPage from '@/components/tools/tool-page';
import { getToolDefinition } from '@/lib/tool-registry';

export default function ValuationBenchmarkingToolToolPage() {
  const tool = getToolDefinition('valuation-benchmarking-tool');

  if (!tool) {
    notFound();
  }

  return <ToolPage tool={tool} />;
}
