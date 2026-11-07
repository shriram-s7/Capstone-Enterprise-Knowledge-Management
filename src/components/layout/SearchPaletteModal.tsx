import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Dialog } from '../shared/Dialog';
import { Badge } from '../shared/Badge';
import { SYNTHETIC_POLICIES } from '../../data/policies';
import { SYNTHETIC_DECISIONS } from '../../data/decisions';
import { SYNTHETIC_CONFLICTS } from '../../data/conflicts';
import { Search, FileText, HelpCircle, GitCompare, ArrowRight } from 'lucide-react';

export const SearchPaletteModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, openDocumentById } = useApp();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();

    const matchedPolicies = SYNTHETIC_POLICIES.filter(p =>
      p.id.toLowerCase().includes(q) ||
      p.title.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q)) ||
      p.category.toLowerCase().includes(q)
    ).map(p => ({
      type: 'policy' as const,
      id: p.id,
      title: p.title,
      subtitle: `${p.category} • ${p.currentVersion}`,
      data: p
    }));

    const matchedDecisions = SYNTHETIC_DECISIONS.filter(d =>
      d.id.toLowerCase().includes(q) ||
      d.title.toLowerCase().includes(q) ||
      d.department.toLowerCase().includes(q) ||
      d.businessContext.toLowerCase().includes(q)
    ).map(d => ({
      type: 'decision' as const,
      id: d.id,
      title: d.title,
      subtitle: `${d.department} • ${d.date} • ${d.ownerName}`,
      data: d
    }));

    const matchedConflicts = SYNTHETIC_CONFLICTS.filter(c =>
      c.id.toLowerCase().includes(q) ||
      c.title.toLowerCase().includes(q) ||
      c.conflictDescription.toLowerCase().includes(q)
    ).map(c => ({
      type: 'conflict' as const,
      id: c.id,
      title: c.title,
      subtitle: `Severity: ${c.severity} • ${c.resolutionStatus}`,
      data: c
    }));

    const intelMatches = [];
    if ('unified intelligence github slack commits pull requests telemetry cross-platform'.includes(q) || q.includes('git') || q.includes('slack')) {
      intelMatches.push({
        type: 'intel' as const,
        id: 'nav-unified-intel',
        title: 'Unified Enterprise Intelligence Dashboard',
        subtitle: 'GitHub, Slack, activity timeline & AI cross-platform insights',
        data: {}
      });
    }

    return [...intelMatches, ...matchedPolicies, ...matchedDecisions, ...matchedConflicts].slice(0, 8);
  }, [query]);

  const handleSelect = (item: (typeof results)[0]) => {
    setIsSearchOpen(false);
    setQuery('');
    if (item.type === 'policy') {
      openDocumentById(item.id);
    } else if (item.type === 'decision') {
      navigate('/ask-why');
    } else if (item.type === 'conflict') {
      navigate('/conflicts');
    } else if (item.type === 'intel') {
      navigate('/unified-intelligence');
    }
  };

  return (
    <Dialog
      isOpen={isSearchOpen}
      onClose={() => {
        setIsSearchOpen(false);
        setQuery('');
      }}
      title="Global Search & Quick Actions"
      description="Instant lookup across policies, decision lineages, and detected conflicts"
      maxWidth="2xl"
    >
      <div className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type a policy name, tag (e.g. 'vpn', 'leave', 'expenses'), or decision ID..."
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>

        {/* Quick Suggestions if Query is Empty */}
        {!query.trim() && (
          <div className="space-y-2 pt-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Suggested Explorations
            </span>
            <div className="flex flex-wrap gap-2">
              {['Unified Intelligence', 'GitHub Telemetry', 'Slack Feed', 'Remote Work Stipend', 'VPN Mandate', 'SOC 2 Diligence'].map(tag => (
                <button
                  key={tag}
                  onClick={() => setQuery(tag)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results List */}
        {results.length > 0 && (
          <div className="space-y-1.5 pt-2 max-h-80 overflow-y-auto">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Matching Records ({results.length})
            </span>
            {results.map(item => (
              <div
                key={item.id}
                onClick={() => handleSelect(item)}
                className="group flex items-center justify-between p-3 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/60 cursor-pointer transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0">
                    {item.type === 'policy' && <FileText className="w-4 h-4" />}
                    {item.type === 'decision' && <HelpCircle className="w-4 h-4" />}
                    {item.type === 'conflict' && <GitCompare className="w-4 h-4" />}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate">
                        {item.title}
                      </span>
                      <Badge size="sm" variant={item.type === 'policy' ? 'primary' : item.type === 'conflict' ? 'warning' : 'purple'}>
                        {item.id}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-3" />
              </div>
            ))}
          </div>
        )}

        {query.trim() && results.length === 0 && (
          <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-sm">
            No matching documents or records found for "{query}".
          </div>
        )}
      </div>
    </Dialog>
  );
};
