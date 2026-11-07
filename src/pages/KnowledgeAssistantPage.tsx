import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { askKnowledgeApi } from '../services/api';
import { ChatMessage, PolicyCategory } from '../types';
import { Card } from '../components/shared/Card';
import { Button } from '../components/shared/Button';
import { Badge } from '../components/shared/Badge';
import {
  Bot,
  User,
  Send,
  Trash2,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  FileText,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Check,
  Filter
} from 'lucide-react';

export const KnowledgeAssistantPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { openDocumentById, showToast, logAuditEvent } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<PolicyCategory | 'All'>('All');
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [feedbackGiven, setFeedbackGiven] = useState<Record<string, 'up' | 'down'>>({});

  const chatBottomRef = useRef<HTMLDivElement>(null);
  const processedQueryRef = useRef<string | null>(null);

  // Initial seed conversation
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: `Hello! I am **FinNova Knowledge Assistant**, operating in privacy-first local mode. I can answer inquiries regarding company policies, reimbursement limits, information security, and governance standards with exact documentary citations.\n\nAsk a question or select from the suggested prompts below.`,
      timestamp: 'Just now',
      confidence: 'High'
    }
  ]);

  const scrollToBottom = () => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string, wasSanitized: boolean = false) => {
    const text = (textToSend !== undefined ? textToSend : inputText).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sanitizationApplied: wasSanitized
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const result = await askKnowledgeApi(text, categoryFilter);

      const assistantMessage: ChatMessage = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        text: result.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: result.citations,
        isRefusal: result.isRefusal,
        confidence: result.confidence
      };

      setMessages(prev => [...prev, assistantMessage]);

      // If answered via fallback, log event locally
      if (result.source === 'local_fallback' && result.citations && result.citations.length > 0) {
        logAuditEvent(
          'POLICY_ACCESS',
          'Knowledge Worker',
          `Knowledge query processed: Cited ${result.citations[0].policyId} (${result.citations[0].clauseNumber})`,
          {
            policyId: result.citations[0].policyId,
            clauseNumber: result.citations[0].clauseNumber,
            isRefusal: false,
            confidence: result.confidence
          }
        );
      }
    } catch (err) {
      showToast('error', 'Query Processing Error', 'Failed to retrieve response from knowledge engine.');
    } finally {
      setIsLoading(false);
    }
  };

  // Check if a question was passed via navigation state (e.g. from Question Shield or Dashboard)
  useEffect(() => {
    const state = location.state as { sanitizedQuery?: string; initialQuery?: string } | null;
    const incomingQuery = state?.sanitizedQuery || state?.initialQuery;
    const wasSanitized = Boolean(state?.sanitizedQuery);

    if (incomingQuery && typeof incomingQuery === 'string') {
      const trimmedQuery = incomingQuery.trim();
      // Ensure we only process this incoming query once (guards against React StrictMode double invocation & history re-renders)
      if (trimmedQuery && processedQueryRef.current !== trimmedQuery) {
        processedQueryRef.current = trimmedQuery;

        // Clear navigation history state immediately so page refresh or back/forward won't re-trigger
        navigate(location.pathname, { replace: true, state: {} });

        // Auto-send single message cleanly without double-populating input
        setInputText('');
        handleSendMessage(trimmedQuery, wasSanitized);
      }
    }
  }, [location.state, navigate, location.pathname]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('success', 'Answer Copied', 'Response text copied to clipboard.');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFeedback = (messageId: string, type: 'up' | 'down') => {
    setFeedbackGiven(prev => ({ ...prev, [messageId]: type }));
    showToast(
      'info',
      type === 'up' ? 'Feedback Recorded: Helpful' : 'Feedback Recorded: Needs Improvement',
      'Evaluation recorded into local prototype state.'
    );
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `msg-welcome-${Date.now()}`,
        sender: 'assistant',
        text: `Conversation cleared. All local session buffers have been reset.\n\nFeel free to ask a new question about FinNova policies.`,
        timestamp: 'Just now',
        confidence: 'High'
      }
    ]);
    showToast('info', 'Chat Cleared', 'Conversation history has been reset.');
  };

  const suggestedQuestions = [
    {
      label: 'Remote Work Stipend',
      query: 'What is our remote work home setup allowance and monthly internet reimbursement?'
    },
    {
      label: 'Annual Leave Rollover',
      query: 'How many days of annual leave can I roll over into the next year?'
    },
    {
      label: 'Expense Receipt Limit',
      query: 'What is the minimum expense amount that requires an itemized receipt?'
    },
    {
      label: 'VPN Security Mandate',
      query: 'Can I connect to Slack without VPN when working from home Wi-Fi?'
    },
    {
      label: 'Slack 90-Day Retention',
      query: 'What is the automatic purge schedule for internal Slack channels?'
    },
    {
      label: 'Test Refusal (Crypto)',
      query: 'What is our policy on cryptocurrency trading bonuses and tokens?'
    }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <Bot className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            AI Knowledge Assistant
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Deterministic local retrieval with strict documentary citations & zero hallucination
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Space Filter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs shadow-sm">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value as any)}
              className="bg-transparent text-slate-700 dark:text-slate-200 font-medium focus:outline-none cursor-pointer"
            >
              <option value="All">All Knowledge Spaces</option>
              <option value="HR & People">HR & People</option>
              <option value="Security & Infosec">Security & Infosec</option>
              <option value="Finance & Travel">Finance & Travel</option>
              <option value="Legal & Compliance">Legal & Compliance</option>
            </select>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleClearChat}
            leftIcon={<Trash2 className="w-3.5 h-3.5" />}
          >
            Clear Chat
          </Button>
        </div>
      </div>

      {/* Prototype Notice Banner */}
      <div className="px-4 py-2.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-between gap-3 text-xs text-indigo-900 dark:text-indigo-200">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <span>
            <strong>Prototype Mode:</strong> Responses are generated locally from the synthetic FinNova policy corpus. No external LLM API or backend is utilized.
          </span>
        </div>
        <span className="hidden md:inline font-mono text-[11px] text-indigo-500">
          Latency: ~350ms
        </span>
      </div>

      {/* Suggested Questions Grid */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Suggested Questions
        </span>
        <div className="flex flex-wrap gap-2">
          {suggestedQuestions.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(item.query)}
              className="text-xs px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all text-left flex items-center gap-1.5 shadow-subtle"
            >
              <Sparkles className="w-3 h-3 text-indigo-500 shrink-0" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Container */}
      <Card className="min-h-[460px] flex flex-col justify-between overflow-hidden">
        <div className="p-5 space-y-6 flex-1 overflow-y-auto max-h-[540px]">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex gap-3.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-2xl rounded-2xl p-4.5 space-y-3 ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white shadow-sm rounded-tr-sm'
                    : msg.isRefusal
                    ? 'bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-slate-800 dark:text-slate-200 rounded-tl-sm'
                    : 'bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-800 dark:text-slate-200 rounded-tl-sm'
                }`}
              >
                {/* User Sanitized Tag */}
                {msg.sender === 'user' && msg.sanitizationApplied && (
                  <div className="inline-flex items-center gap-1 text-[10px] bg-indigo-700 px-2 py-0.5 rounded-full font-medium text-indigo-100">
                    <ShieldCheck className="w-3 h-3" />
                    Sanitized by Question Shield
                  </div>
                )}

                {/* Message Body */}
                <div className="text-sm leading-relaxed whitespace-pre-line font-sans">
                  {msg.text}
                </div>

                {/* Source Citations for Assistant */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="pt-2 border-t border-slate-200/80 dark:border-slate-700/80 space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-indigo-500" />
                        Source Documentary Citations ({msg.citations.length})
                      </span>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                        Deterministic Match
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                      {msg.citations.map((cite, cIdx) => (
                        <div
                          key={cIdx}
                          onClick={() => openDocumentById(cite.policyId, cite.version)}
                          className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 cursor-pointer transition-all shadow-subtle group"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="primary" size="sm">
                                {cite.policyId}
                              </Badge>
                              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                {cite.policyTitle} ({cite.version})
                              </span>
                            </div>
                            <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                              Score: {cite.relevanceScore}%
                              <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-indigo-500" />
                            </span>
                          </div>

                          <div className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 line-clamp-2 italic">
                            "{cite.matchedText}"
                          </div>

                          <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                            <span>Clause: {cite.clauseNumber} ({cite.clauseTitle})</span>
                            <span>Effective: {cite.effectiveDate}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Message Footer Actions */}
                {msg.sender === 'assistant' && (
                  <div className="flex items-center justify-between pt-1 text-xs text-slate-400 border-t border-slate-100 dark:border-slate-800/80">
                    <span className="text-[11px]">{msg.timestamp}</span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleCopyMessage(msg.id, msg.text)}
                        className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors"
                        title="Copy answer"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        onClick={() => handleFeedback(msg.id, 'up')}
                        className={`p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors ${
                          feedbackGiven[msg.id] === 'up' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-500'
                        }`}
                        title="Helpful citation"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleFeedback(msg.id, 'down')}
                        className={`p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors ${
                          feedbackGiven[msg.id] === 'down' ? 'text-rose-600 font-bold' : 'text-slate-500'
                        }`}
                        title="Incorrect or insufficient"
                      >
                        <ThumbsDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0 shadow-sm mt-0.5 font-bold text-xs">
                  SJ
                </div>
              )}
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex gap-3 items-center text-slate-500 dark:text-slate-400 text-xs">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-100 dark:bg-slate-800">
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.15s]" />
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.3s]" />
                <span className="ml-1 text-slate-600 dark:text-slate-300">Searching synthetic policy clauses...</span>
              </div>
            </div>
          )}
          <div ref={chatBottomRef} />
        </div>

        {/* Text Input Bottom Bar */}
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-end gap-2.5">
            <div className="flex-1 relative">
              <textarea
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about remote work, annual leave, corporate expenses, infosec VPN rules, or travel per-diems (Press Enter to send)..."
                rows={2}
                className="w-full resize-none rounded-xl p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
            <Button
              variant="primary"
              size="md"
              disabled={!inputText.trim() || isLoading}
              onClick={() => handleSendMessage()}
              rightIcon={<Send className="w-4 h-4" />}
              className="h-[52px]"
            >
              Send
            </Button>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
            <span>Shift + Enter for new line • Enter to submit</span>
            <span>Zero external API dependencies</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
