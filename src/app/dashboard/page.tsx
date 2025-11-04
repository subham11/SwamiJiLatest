'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/redux/store';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import { YearMonthAccordion } from '@/components/dashboard/YearMonthAccordion';
import { DocumentList } from '@/components/dashboard/DocumentList';
import { DocumentViewer } from '@/components/dashboard/DocumentViewer';
import { UploadPanel } from '@/components/dashboard/UploadPanel';
import { DocumentItem, DocumentsByMonth, getSeedDocuments, monthsToYears } from '@/data/docs.seed';

export default function DashboardPage(){
  const router = useRouter();
  const user = useAppSelector(s => s.auth?.user);

  // Guard: redirect to login if not signed in
  useEffect(() => {
    if (!user) (router.replace as any)('/login');
  }, [user, router]);

  const [docsByMonth, setDocsByMonth] = useState<DocumentsByMonth>(() => getSeedDocuments());
  const [selectedMonth, setSelectedMonth] = useState<string>(() => Object.keys(getSeedDocuments()).sort().pop() || '');
  const [viewerDoc, setViewerDoc] = useState<DocumentItem | null>(null);

  const years = useMemo(() => monthsToYears(docsByMonth), [docsByMonth]);
  const itemsForSelected = docsByMonth[selectedMonth] || [];

  const addDocs = (newDocs: DocumentItem[]) => {
    if (!selectedMonth) return;
    setDocsByMonth(prev => ({
      ...prev,
      [selectedMonth]: [...(prev[selectedMonth] || []), ...newDocs]
    }));
  };

  return (
    <main>
      <NavBar />
      <section className="container" style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:'1.5rem', alignItems:'start', padding:'1rem' }}>
        <div>
          <h1 style={{ fontSize:'clamp(1.25rem,2.5vw,1.75rem)', margin:'0.5rem 0 1rem' }}>Dashboard</h1>
          {user?.role === 'admin' && selectedMonth && (
            <UploadPanel monthKey={selectedMonth} onAdd={addDocs} />
          )}
          <DocumentList items={itemsForSelected} onOpen={setViewerDoc} />
        </div>
        <YearMonthAccordion
          years={years}
          selected={selectedMonth}
          onSelect={(key)=> setSelectedMonth(key)}
        />
      </section>
      <Footer />

      <DocumentViewer doc={viewerDoc} onClose={()=> setViewerDoc(null)} />
    </main>
  );
}
