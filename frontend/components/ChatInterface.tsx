import React, { useState } from 'react';

interface Interaction {
  id: string;
  question: string;
  answer: string;
}

interface Props {
  documentId: string;
}

const ChatInterface: React.FC<Props> = ({ documentId }) => {
  const [question, setQuestion] = useState('');
  const [history, setHistory] = useState<Interaction[]>([]);

  const ask = async () => {
    if (!question) return;
    const res = await fetch(`/api/documents/${documentId}/interactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });
    const data: Interaction = await res.json();
    setHistory((h) => [...h, data]);
    setQuestion('');
  };

  return (
    <div>
      <div className="mb-4">
        {history.map((i) => (
          <div key={i.id} className="mb-2">
            <p className="font-semibold">You: {i.question}</p>
            <p className="ml-4">Bot: {i.answer}</p>
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="flex-1 p-2 border"
          placeholder="Ask a question..."
        />
        <button
          onClick={ask}
          className="ml-2 px-4 py-2 bg-green-600 text-white rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;