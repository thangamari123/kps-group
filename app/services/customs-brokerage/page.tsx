import type { Metadata } from 'next';
import CustomsBrokerageContent from '@/components/services/CustomsBrokerageContent';
import { servicesData } from '@/data/services';

const service = servicesData.customsBrokerage;

export const metadata: Metadata = {
  title: service.seoTitle,
  description: service.description,
  keywords: [service.primaryKeyword, ...(service.secondaryKeywords || [])],
};

export default function CustomsBrokeragePage() {
  return <CustomsBrokerageContent />;
}
