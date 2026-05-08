export interface QuotaItem {
  id: string;
  label: string;
  used: number;
  limit: number | null; // null = unlimited
}

// Hard-coded free plan quotas — replace with API data when backend is ready
export const FREE_QUOTAS: QuotaItem[] = [
  { id: 'headshots',   label: 'AI Headshots',      used: 0, limit: 1    },
  { id: 'conversions', label: 'Conversions',        used: 0, limit: 2    },
  { id: 'ats',         label: 'ATS Fixes',          used: 0, limit: 1    },
  { id: 'jobopt',      label: 'Job Optimization',   used: 0, limit: 1    },
  { id: 'pdf',         label: 'PDF Downloads',      used: 0, limit: null },
];

export const PRO_QUOTAS: QuotaItem[] = [
  { id: 'headshots',   label: 'AI Headshots',      used: 0, limit: 3    },
  { id: 'conversions', label: 'Conversions',        used: 0, limit: 15   },
  { id: 'ats',         label: 'ATS Fixes',          used: 0, limit: 8    },
  { id: 'jobopt',      label: 'Job Optimization',   used: 0, limit: 8    },
  { id: 'pdf',         label: 'PDF Downloads',      used: 0, limit: null },
];
