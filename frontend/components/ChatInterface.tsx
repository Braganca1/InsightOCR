'use client';
import React, { useState, useEffect } from 'react';

interface Interaction {
  id: string;
  question: string;
  answer: string;
}

interface Props {
  documentId: string;
  /**
   * show full Q&A history (Conversations tab)
   * or just recent Q&A pairs (Ask AI card)
   */
  showHistory?: boolean;
}

const ChatInterface: React.FC<Props> = ({
  documentId,
  showHistory = true,
}) => {
  const [question, setQuestion] = useState('');
  const [history, setHistory] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(false);

  // Load all interactions on mount
  useEffect(() => {
    if (!documentId) return;
    fetch(`/api/documents/${documentId}/interactions`)
      .then((res) => res.json())
      .then((data: Interaction[]) => setHistory(data))
      .catch(console.error);
  }, [documentId]);

  // Send a new question
  const ask = async () => {
    if (!question.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/documents/${documentId}/interactions`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question }),
        }
      );
      if (!res.ok) {
        console.error('Ask failed:', await res.text());
        return;
      }
      const newI: Interaction = await res.json();
      setHistory((h) => [...h, newI]);
      setQuestion('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Get last 3 interactions (Q&A pairs)
  const recent = history.slice(-3);

  return (
    <div className="flex flex-col space-y-4">
      {/* Ask AI mode: show just recent Q&A pairs */}
      {!showHistory && recent.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium mb-2">Recent Q&amp;A</h3>
          <ul className="space-y-2">
            {recent.map((i) => (
              <li key={i.id} className="border-l-4 border-purple-600 pl-3">
                <p className="text-gray-800 font-semibold">Q: {i.question}</p>
                <p className="text-gray-700 ml-2">A: {i.answer}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Conversations mode: full chat history */}
      {showHistory && (
        <div className="bg-white p-4 rounded-lg shadow max-h-80 overflow-y-auto space-y-3">
          {history.length === 0 ? (
            <p className="text-gray-500">No conversations yet.</p>
          ) : (
            history.map((i) => (
              <div key={i.id}>
                <p className="font-semibold">You: {i.question}</p>
                <p className="ml-4">Bot: {i.answer}</p>
              </div>
            ))
          )}
        </div>
      )}

      {/* Input area */}
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && ask()}
          className="flex-1 border rounded-lg p-2 focus:outline-none focus:ring"
          placeholder="Ask a question…"
        />
        <button
          onClick={ask}
          disabled={loading || !question.trim()}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Sending…' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;
