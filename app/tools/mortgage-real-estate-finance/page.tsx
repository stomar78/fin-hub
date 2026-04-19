import { notFound } from 'next/navigation';

import ToolPage from '@/components/tools/tool-page';
import { getToolDefinition } from '@/lib/tool-registry';

export default function MortgageRealEstateFinanceToolPage() {
  const tool = getToolDefinition('mortgage-real-estate-finance');

  if (!tool) {
    notFound();
  }

  return <ToolPage tool={tool} />;
}
