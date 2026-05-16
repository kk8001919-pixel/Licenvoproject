import type { ProductSortKey, ProductCollectionSortKey } from './types';

export const DEFAULT_PAGE_SIZE = 20;
export const DEFAULT_SORT_KEY: ProductSortKey = 'RELEVANCE';
export const DEFAULT_COLLECTION_SORT_KEY: ProductCollectionSortKey = 'BEST_SELLING';

// Mapping from Shopify collection handles to Licenvo categories
export const COLLECTION_TO_CATEGORY: Record<string, string> = {
  'sistemi-operativi': 'os',
  'office-produttivita': 'office',
  'software-pro': 'subscription',
  'antivirus-sicurezza': 'antivirus',
  'giochi-pc': 'gaming',
};

export const CATEGORY_TO_COLLECTION: Record<string, string> = {
  os: 'sistemi-operativi',
  office: 'office-produttivita',
  subscription: 'software-pro',
  antivirus: 'antivirus-sicurezza',
  gaming: 'giochi-pc',
};
