'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/redux/store';
import { NavBar } from '@/components/NavBar';
import { YearMonthAccordion } from '@/components/dashboard/YearMonthAccordion';
import { DocumentList } from '@/components/dashboard/DocumentList';
import { DocumentViewer } from '@/components/dashboard/DocumentViewer';
import { UploadPanel } from '@/components/dashboard/UploadPanel';
import { PageComponentManager } from '@/components/dashboard/PageComponentManager';
import { DocumentItem, DocumentsByMonth, getSeedDocuments, monthsToYears } from '@/data/docs.seed';

export default function DashboardPage(){
  const router = useRouter();
  const user = useAppSelector(s => s.auth?.user);
  const [activeTab, setActiveTab] = useState<'documents' | 'content'>('documents');

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
      <section className="container" style={{ paddingTop: '1.5rem', paddingBottom: '3rem' }}>
        <h1 style={{ fontSize:'clamp(1.25rem,2.5vw,1.75rem)', margin:'0.5rem 0 1.5rem' }}>Dashboard</h1>

        {/* Tab Navigation */}
        {user?.role === 'admin' && (
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', borderBottom: '1px solid #e5e7eb' }}>
            <button
              onClick={() => setActiveTab('documents')}
              style={{
                padding: '0.75rem 1.5rem',
                border: 'none',
                background: 'transparent',
                borderBottom: activeTab === 'documents' ? '3px solid var(--color-primary)' : '3px solid transparent',
                color: activeTab === 'documents' ? 'var(--color-primary)' : '#666',
                fontWeight: activeTab === 'documents' ? 600 : 500,
                cursor: 'pointer',
                fontSize: '1rem',
                transition: 'all 0.2s ease',
              }}
            >
              📄 Documents
            </button>
            <button
              onClick={() => setActiveTab('content')}
              style={{
                padding: '0.75rem 1.5rem',
                border: 'none',
                background: 'transparent',
                borderBottom: activeTab === 'content' ? '3px solid var(--color-primary)' : '3px solid transparent',
                color: activeTab === 'content' ? 'var(--color-primary)' : '#666',
                fontWeight: activeTab === 'content' ? 600 : 500,
                cursor: 'pointer',
                fontSize: '1rem',
                transition: 'all 0.2s ease',
              }}
            >
              🧩 Pages & Components
            </button>
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 250px', gap: '1.5rem' }}>
            <div>
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
          </div>
        )}

        {/* Content Management Tab */}
        {activeTab === 'content' && (
          <div>
            <PageComponentManager />
          </div>
        )}
      </section>
      <DocumentViewer doc={viewerDoc} onClose={()=> setViewerDoc(null)} />
    </main>
  );
}
