import { notFound } from 'next/navigation';

import ToolCategoryPage from '@/components/tools/tool-category-page';
import { ENABLED_CATEGORY_SLUGS } from '@/lib/enabled-tool-categories';
import type { ToolCategorySlug } from '@/lib/tool-registry';

type CategoryParams = {
  params: {
    category: string;
  };
};

function isToolCategorySlug(slug: string): slug is ToolCategorySlug {
  return ENABLED_CATEGORY_SLUGS.includes(slug as ToolCategorySlug);
}

export function generateStaticParams() {
  return ENABLED_CATEGORY_SLUGS.map((slug) => ({ category: slug }));
}

export default function ToolCategoryRoutePage({ params }: CategoryParams) {
  const { category } = params;

  if (!isToolCategorySlug(category)) {
    notFound();
  }

  return <ToolCategoryPage slug={category} />;
}
