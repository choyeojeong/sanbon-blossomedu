import { useEffect, useState } from 'react';

function ScoreTable({ scores, type, onEdit, onDelete }) {
  const [sortedScores, setSortedScores] = useState([]);

  useEffect(() => {
    const filtered = scores.filter((s) => s.type === type);
    const sorted = filtered.sort((a, b) => {
      if (type === '내신') {
        const yA = +a.year, yB = +b.year;
        if (yA !== yB) return yA - yB;
        const sA = +a.semester, sB = +b.semester;
        if (sA !== sB) return sA - sB;
        const order = { 중간: 1, 기말: 2 };
        return (order[a.examType] || 0) - (order[b.examType] || 0);
      } else if (type === '모의고사') {
        const yA = +a.year, yB = +b.year;
        if (yA !== yB) return yA - yB;
        return +a.month - +b.month;
      } else {
        return new Date(a.date) - new Date(b.date);
      }
    });
    setSortedScores(sorted);
  }, [scores, type]);

  const calculateDiff = (current, prev) => {
    if (prev === null) return '-';
    const diff = current - prev;
    return diff > 0 ? `+${diff}` : diff.toString();
  };

  const averageScore = () => {
    if (sortedScores.length === 0) return '-';
    const total = sortedScores.reduce((sum, score) => sum + Number(score.score), 0);
    return (total / sortedScores.length).toFixed(1);
  };

  return (
    <div style={{ marginBottom: '3rem' }}>
      <h3 style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>{type} 성적표</h3>
      {sortedScores.length === 0 ? (
        <div>등록된 성적이 없습니다.</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ borderBottom: '1px solid #ccc', padding: '0.5rem' }}>시험 정보</th>
              <th style={{ borderBottom: '1px solid #ccc', padding: '0.5rem' }}>점수</th>
              <th style={{ borderBottom: '1px solid #ccc', padding: '0.5rem' }}>등락</th>
              <th style={{ borderBottom: '1px solid #ccc', padding: '0.5rem' }}>관리</th>
            </tr>
          </thead>
          <tbody>
            {sortedScores.map((score, idx) => {
              const prev = idx > 0 ? Number(sortedScores[idx - 1].score) : null;
              return (
                <tr key={score.id}>
                  <td style={{ borderBottom: '1px solid #ccc', padding: '0.5rem' }}>
                    {type === '내신' && `${score.year} ${score.semester} ${score.examType}`}
                    {type === '모의고사' && `${score.year} ${score.month}월`}
                    {type === '블라썸고3' && `${score.round}회 (${score.date})`}
                  </td>
                  <td style={{ borderBottom: '1px solid #ccc', padding: '0.5rem' }}>
                    {score.score}
                  </td>
                  <td style={{ borderBottom: '1px solid #ccc', padding: '0.5rem' }}>
                    {calculateDiff(Number(score.score), prev)}
                  </td>
                  <td style={{ borderBottom: '1px solid #ccc', padding: '0.5rem' }}>
                    <button
                      onClick={() => onEdit(score)}
                      style={{ marginRight: '0.5rem', padding: '0.25rem 0.5rem' }}
                    >
                      수정
                    </button>
                    <button
                      onClick={() => onDelete(score.id)}
                      style={{ padding: '0.25rem 0.5rem', color: 'red' }}
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              );
            })}
            <tr>
              <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>평균</td>
              <td style={{ padding: '0.5rem' }}>{averageScore()}</td>
              <td style={{ padding: '0.5rem' }}>-</td>
              <td style={{ padding: '0.5rem' }}>-</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ScoreTable;
