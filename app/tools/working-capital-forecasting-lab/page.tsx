import { notFound } from 'next/navigation';

import ToolPage from '@/components/tools/tool-page';
import { getToolDefinition } from '@/lib/tool-registry';

export default function WorkingCapitalForecastingLabToolPage() {
  const tool = getToolDefinition('working-capital-forecasting-lab');

  if (!tool) {
    notFound();
  }

  return <ToolPage tool={tool} />;
}
