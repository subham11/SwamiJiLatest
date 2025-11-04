export type DocType = 'image' | 'pdf' | 'other';
export type DocumentItem = { id: string; title: string; url: string; type: DocType };

// year-month key format: YYYY-MM
export type DocumentsByMonth = Record<string, DocumentItem[]>;

export function getSeedDocuments(): DocumentsByMonth {
  return {
    '2025-10': [
      { id: 'img-1', title: 'Swamiji Image 1', url: '/images/SwamiJi/swami-ji-1.jpg', type: 'image' },
      { id: 'img-2', title: 'Swamiji Image 2', url: '/images/SwamiJi/swami-ji-2.jpg', type: 'image' },
    ],
    '2025-11': [
      { id: 'img-3', title: 'Swamiji Image 3', url: '/images/SwamiJi/swami-ji-3.jpg', type: 'image' },
      { id: 'img-4', title: 'Swamiji Image 4', url: '/images/SwamiJi/swami-ji-4.jpg', type: 'image' },
    ],
  };
}

export function monthsToYears(docs: DocumentsByMonth): Array<{ year: string; months: string[] }>{
  const years: Record<string, string[]> = {};
  for (const key of Object.keys(docs)){
    const [year, month] = key.split('-');
    if (!years[year]) years[year] = [];
    years[year].push(month);
  }
  return Object.keys(years)
    .sort((a,b)=> Number(b)-Number(a))
    .map(year => ({ year, months: years[year].sort((a,b)=> Number(b)-Number(a)) }));
}
