'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { useAdminStore, PageContent, PageSection } from '@/lib/admin-store';

export default function PoliciesPage() {
  const { pages, updatePage, updateSection, addSection, deleteSection } = useAdminStore();
  const [selectedId, setSelectedId] = useState(pages[0]?.id ?? '');
  const [saved, setSaved] = useState(false);
  const [addingSection, setAddingSection] = useState(false);
  const [newSection, setNewSection] = useState({ heading: '', content: '' });
  const [localPages, setLocalPages] = useState<Record<string, PageContent>>(() =>
    Object.fromEntries(pages.map((p) => [p.id, { ...p, sections: p.sections.map((s) => ({ ...s })) }]))
  );

  const page = localPages[selectedId];

  const updateLocalSection = (sectionId: string, field: 'heading' | 'content', value: string) => {
    setLocalPages((prev) => ({
      ...prev,
      [selectedId]: {
        ...prev[selectedId],
        sections: prev[selectedId].sections.map((s) =>
          s.id === sectionId ? { ...s, [field]: value } : s
        ),
      },
    }));
  };

  const updateLocalMeta = (field: 'title' | 'metaDescription', value: string) => {
    setLocalPages((prev) => ({
      ...prev,
      [selectedId]: { ...prev[selectedId], [field]: value },
    }));
  };

  const save = () => {
    const local = localPages[selectedId];
    updatePage(selectedId, { title: local.title, metaDescription: local.metaDescription });
    local.sections.forEach((s) => updateSection(selectedId, s.id, s.content, s.heading));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleAddSection = () => {
    if (!newSection.heading.trim()) return;
    addSection(selectedId, { heading: newSection.heading, content: newSection.content });
    const newId = 'section-' + Date.now();
    setLocalPages((prev) => ({
      ...prev,
      [selectedId]: {
        ...prev[selectedId],
        sections: [...prev[selectedId].sections, { id: newId, ...newSection }],
      },
    }));
    setNewSection({ heading: '', content: '' });
    setAddingSection(false);
  };

  const handleDeleteSection = (sectionId: string) => {
    deleteSection(selectedId, sectionId);
    setLocalPages((prev) => ({
      ...prev,
      [selectedId]: {
        ...prev[selectedId],
        sections: prev[selectedId].sections.filter((s) => s.id !== sectionId),
      },
    }));
  };

  const PAGE_ICONS: Record<string, string> = {
    garanzia: 'ShieldCheck', privacy: 'Lock', termini: 'FileText', faq: 'HelpCircle', contatti: 'Mail',
  };

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Pagine & Policy</h1>
        <p className="text-sm text-muted-foreground mt-1">Modifica il contenuto delle pagine informative del sito</p>
      </div>

      <div className="grid lg:grid-cols-[240px_1fr] gap-6 items-start">
        {/* Page list */}
        <div className="bg-[#111118] border border-white/[0.06] rounded-2xl overflow-hidden">
          {pages.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedId(p.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 text-left border-b border-white/[0.04] last:border-0 transition-all ${
                selectedId === p.id ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-white/[0.03]'
              }`}
            >
              <Icon name={(PAGE_ICONS[p.id] || 'FileText') as 'FileText'} size={15} className={selectedId === p.id ? 'text-primary' : ''} />
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold truncate ${selectedId === p.id ? 'text-primary' : ''}`}>{p.title}</p>
                <p className="text-[10px] text-muted-foreground truncate">{p.slug}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Editor */}
        {page && (
          <div className="space-y-5">
            {/* Meta */}
            <div className="bg-[#111118] border border-white/[0.06] rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display font-bold text-foreground flex items-center gap-2">
                  <Icon name="Settings" size={16} className="text-primary" />
                  Metadati pagina
                </h2>
                <a href={page.slug} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1">
                  <Icon name="ExternalLink" size={11} />Anteprima
                </a>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Titolo pagina</label>
                  <input
                    value={page.title}
                    onChange={(e) => updateLocalMeta('title', e.target.value)}
                    className="w-full bg-[#0a0a10] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:border-primary/60 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Meta description (SEO)</label>
                  <input
                    value={page.metaDescription}
                    onChange={(e) => updateLocalMeta('metaDescription', e.target.value)}
                    className="w-full bg-[#0a0a10] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:border-primary/60 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-3">
              {page.sections.map((section: PageSection, idx: number) => (
                <div key={section.id} className="bg-[#111118] border border-white/[0.06] rounded-2xl p-5 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-[10px] font-bold text-primary">{idx + 1}</span>
                    </div>
                    <input
                      value={section.heading}
                      onChange={(e) => updateLocalSection(section.id, 'heading', e.target.value)}
                      className="flex-1 bg-transparent text-sm font-bold text-foreground outline-none border-b border-white/[0.06] pb-1 focus:border-primary/60 transition-all"
                      placeholder="Titolo sezione"
                    />
                    <button
                      onClick={() => handleDeleteSection(section.id)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-500/10 transition-colors"
                    >
                      <Icon name="Trash2" size={13} className="text-muted-foreground hover:text-red-400" />
                    </button>
                  </div>
                  <textarea
                    value={section.content}
                    onChange={(e) => updateLocalSection(section.id, 'content', e.target.value)}
                    rows={4}
                    placeholder="Contenuto della sezione…"
                    className="w-full bg-[#0a0a10] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-muted-foreground leading-relaxed outline-none focus:border-primary/60 transition-all resize-y"
                  />
                </div>
              ))}
            </div>

            {/* Add section */}
            {addingSection ? (
              <div className="bg-[#111118] border border-primary/20 rounded-2xl p-5 space-y-3">
                <input
                  value={newSection.heading}
                  onChange={(e) => setNewSection((p) => ({ ...p, heading: e.target.value }))}
                  placeholder="Titolo nuova sezione"
                  className="w-full bg-[#0a0a10] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:border-primary/60 transition-all"
                />
                <textarea
                  value={newSection.content}
                  onChange={(e) => setNewSection((p) => ({ ...p, content: e.target.value }))}
                  rows={3}
                  placeholder="Contenuto sezione…"
                  className="w-full bg-[#0a0a10] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary/60 transition-all resize-none"
                />
                <div className="flex gap-2">
                  <button onClick={() => setAddingSection(false)} className="flex-1 py-2 rounded-xl border border-white/[0.08] text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">Annulla</button>
                  <button onClick={handleAddSection} className="flex-1 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-colors">Aggiungi</button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setAddingSection(true)}
                className="w-full py-3 rounded-2xl border border-dashed border-white/[0.12] text-sm text-muted-foreground hover:text-foreground hover:border-white/30 transition-all flex items-center justify-center gap-2"
              >
                <Icon name="Plus" size={15} />
                Aggiungi sezione
              </button>
            )}

            {/* Save button */}
            <div className="flex items-center gap-3">
              <button
                onClick={save}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all ${
                  saved ? 'bg-emerald-600 text-white' : 'bg-primary text-white hover:bg-primary/90'
                }`}
              >
                <Icon name={saved ? 'Check' : 'Save'} size={16} />
                {saved ? 'Salvato!' : 'Salva modifiche'}
              </button>
              <p className="text-xs text-muted-foreground">
                Ultimo aggiornamento: {new Date(pages.find((p) => p.id === selectedId)?.updatedAt ?? '').toLocaleString('it-IT')}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
