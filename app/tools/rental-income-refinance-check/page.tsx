import { notFound } from 'next/navigation';

import ToolPage from '@/components/tools/tool-page';
import { getToolDefinition } from '@/lib/tool-registry';

export default function RentalIncomeRefinanceCheckToolPage() {
  const tool = getToolDefinition('rental-income-refinance-check');

  if (!tool) {
    notFound();
  }

  return <ToolPage tool={tool} />;
}
