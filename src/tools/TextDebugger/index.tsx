import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Removed Card imports
import { calculateTextStats } from "./utils";
import { type TextStats } from "./types";

const initialStats: TextStats = {
  charCount: 0,
  charCountNoSpaces: 0,
  wordCount: 0,
  lineCount: 0,
  sentenceCount: 0,
  paragraphCount: 0,
  averageWordLength: 0,
};

export function TextDebuggerTool() {
  const [text, setText] = useState("");
  const [stats, setStats] = useState<TextStats>(initialStats);

  useEffect(() => {
    if (text.trim() === "") {
      setStats(initialStats);
      return;
    }
    const newStats = calculateTextStats(text);
    setStats(newStats);
  }, [text]);

  return (
    <div className="space-y-4 p-4">
      <Textarea
        placeholder="Paste your text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={10}
        className="w-full resize-y border rounded-md p-2"
        autoFocus
      />
      {/* Replaced Card with divs for stats display */}
      <div className="p-4 border rounded-md bg-slate-50 dark:bg-slate-800">
        <h2 className="text-xl font-semibold mb-3">Text Statistics</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          <StatDisplay label="Characters" value={stats.charCount} />
          <StatDisplay
            label="Characters (no spaces)"
            value={stats.charCountNoSpaces}
          />
          <StatDisplay label="Words" value={stats.wordCount} />
          <StatDisplay label="Lines" value={stats.lineCount} />
          <StatDisplay label="Sentences" value={stats.sentenceCount} />
          <StatDisplay label="Paragraphs" value={stats.paragraphCount} />
          <StatDisplay
            label="Avg. Word Length"
            value={stats.averageWordLength}
          />
        </div>
      </div>
    </div>
  );
}

interface StatDisplayProps {
  label: string;
  value: string | number;
}

function StatDisplay({ label, value }: StatDisplayProps) {
  return (
    <div className="flex flex-col p-3 bg-slate-100 dark:bg-slate-700 rounded-md">
      <span className="text-sm text-slate-600 dark:text-slate-400">{label}</span>
      <span className="text-lg font-semibold text-slate-800 dark:text-slate-200">{value}</span>
    </div>
  );
}

export default TextDebuggerTool;
