// src/components/ScoreGraph.jsx
import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from 'recharts';

function ScoreGraph({ scores, type }) {
  const [sortedScores, setSortedScores] = useState([]);

  useEffect(() => {
    const filtered = scores.filter((s) => s.type === type);
    const sorted = filtered.sort((a, b) => {
      if (type === '내신') {
        const yA = parseInt(a.year), yB = parseInt(b.year);
        if (yA !== yB) return yA - yB;
        const sA = parseInt(a.semester), sB = parseInt(b.semester);
        if (sA !== sB) return sA - sB;
        const order = { 중간: 1, 기말: 2 };
        return (order[a.examType] || 0) - (order[b.examType] || 0);
      } else if (type === '모의고사') {
        const yA = parseInt(a.year), yB = parseInt(b.year);
        if (yA !== yB) return yA - yB;
        return parseInt(a.month) - parseInt(b.month);
      } else {
        return new Date(a.date) - new Date(b.date);
      }
    });
    setSortedScores(sorted);
  }, [scores, type]);

  if (!sortedScores.length) return null;

  const data = sortedScores.map((score) => ({
    name:
      type === '내신'
        ? `${score.year} ${score.semester} ${score.examType}`
        : type === '모의고사'
        ? `${score.year} ${score.month}월`
        : `${score.round}회`,
    점수: Number(score.score)
  }));

  return (
    <div style={{ width: '100%', height: 300, marginBottom: '3rem' }}>
      <h3 style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>{type} 성적 그래프</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" interval={0} angle={-45} textAnchor="end" height={70} />
          <YAxis domain={[0, 100]}>
            <Label angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }}>
              점수
            </Label>
          </YAxis>
          <Tooltip />
          <Line type="monotone" dataKey="점수" stroke="#4f46e5" label={{ position: 'top' }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ScoreGraph;
