import { notFound } from 'next/navigation';

import ToolPage from '@/components/tools/tool-page';
import { getToolDefinition } from '@/lib/tool-registry';

export default function PortfolioRepricingReviewToolPage() {
  const tool = getToolDefinition('portfolio-repricing-review');

  if (!tool) {
    notFound();
  }

  return <ToolPage tool={tool} />;
}
