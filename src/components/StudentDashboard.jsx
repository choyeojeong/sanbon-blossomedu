import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import ExportPDF from './ExportPDF';
import ScoreTable from './ScoreTable';
import ScoreGraph from './ScoreGraph';

function StudentDashboard() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [scores, setScores] = useState([]);
  const [newScore, setNewScore] = useState({
    type: '내신',
    year: '',
    semester: '',
    examType: '',
    month: '',
    round: '',
    date: '',
    score: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingScoreId, setEditingScoreId] = useState(null);

  const fetchStudent = async () => {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', id)
      .single();
    if (!error) setStudent(data);
  };

  const fetchScores = async () => {
    const { data, error } = await supabase
      .from('scores')
      .select('*')
      .eq('student_id', id)
      .order('created_at', { ascending: true });
    if (!error) setScores(data);
  };

  useEffect(() => {
    fetchStudent();
    fetchScores();
  }, [id]);

  const resetForm = () => {
    setNewScore({
      type: '내신',
      year: '',
      semester: '',
      examType: '',
      month: '',
      round: '',
      date: '',
      score: ''
    });
    setIsEditing(false);
    setEditingScoreId(null);
  };

  const handleAddOrUpdateScore = async () => {
    const { type, year, semester, examType, month, round, date, score } = newScore;
    if (!type || !year || !score) {
      alert('필수 정보를 입력하세요.');
      return;
    }
    const payload = { type, year, semester, examType, month, round, date, score, student_id: id };

    if (isEditing) {
      await supabase.from('scores').update(payload).eq('id', editingScoreId);
    } else {
      await supabase.from('scores').insert([payload]);
    }

    resetForm();
    fetchScores();
  };

  const handleDeleteScore = async (scoreId) => {
    await supabase.from('scores').delete().eq('id', scoreId);
    fetchScores();
  };

  const handleEditScore = (score) => {
    setIsEditing(true);
    setEditingScoreId(score.id);
    setNewScore({
      type: score.type,
      year: score.year,
      semester: score.semester,
      examType: score.examType,
      month: score.month,
      round: score.round,
      date: score.date,
      score: score.score
    });
  };

  if (!student) return <div>Loading...</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <div id="student-header" style={{ marginBottom: '1rem' }}>
        <h2 style={{ margin: 0, fontWeight: 'bold' }}>{student.name} 학생 성적 관리</h2>
        <h3 style={{ margin: 0 }}>산본 블라썸에듀</h3>
      </div>
      <ExportPDF student={student} scores={scores} />

      {/* 점수 추가/수정 폼 */}
      <div
        style={{
          marginTop: '2rem',
          marginBottom: '2rem',
          border: '1px solid #ccc',
          padding: '1rem',
          borderRadius: '8px'
        }}
      >
        <h3 style={{ marginBottom: '1rem' }}>
          {isEditing ? '성적 수정' : '성적 추가'}
        </h3>
        <select
          value={newScore.type}
          onChange={(e) => setNewScore({ ...newScore, type: e.target.value })}
          style={{ marginRight: '0.5rem' }}
        >
          <option value="내신">내신</option>
          <option value="모의고사">모의고사</option>
          <option value="블라썸고3">블라썸고3</option>
        </select>
        <input
          type="text"
          placeholder="연도"
          value={newScore.year}
          onChange={(e) => setNewScore({ ...newScore, year: e.target.value })}
          style={{ marginRight: '0.5rem' }}
        />
        {newScore.type === '내신' && (
          <>
            <input
              type="text"
              placeholder="학기"
              value={newScore.semester}
              onChange={(e) => setNewScore({ ...newScore, semester: e.target.value })}
              style={{ marginRight: '0.5rem' }}
            />
            <input
              type="text"
              placeholder="중간/기말"
              value={newScore.examType}
              onChange={(e) => setNewScore({ ...newScore, examType: e.target.value })}
              style={{ marginRight: '0.5rem' }}
            />
          </>
        )}
        {newScore.type === '모의고사' && (
          <input
            type="text"
            placeholder="월"
            value={newScore.month}
            onChange={(e) => setNewScore({ ...newScore, month: e.target.value })}
            style={{ marginRight: '0.5rem' }}
          />
        )}
        {newScore.type === '블라썸고3' && (
          <>
            <input
              type="text"
              placeholder="회차"
              value={newScore.round}
              onChange={(e) => setNewScore({ ...newScore, round: e.target.value })}
              style={{ marginRight: '0.5rem' }}
            />
            <input
              type="date"
              value={newScore.date}
              onChange={(e) => setNewScore({ ...newScore, date: e.target.value })}
              style={{ marginRight: '0.5rem' }}
            />
          </>
        )}
        <input
          type="number"
          placeholder="점수"
          value={newScore.score}
          onChange={(e) => setNewScore({ ...newScore, score: e.target.value })}
          style={{ marginRight: '0.5rem' }}
        />
        <button
          onClick={handleAddOrUpdateScore}
          style={{
            padding: '0.5rem',
            backgroundColor: '#4f46e5',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            marginRight: '0.5rem'
          }}
        >
          {isEditing ? '수정' : '추가'}
        </button>
        {isEditing && (
          <button onClick={resetForm} style={{ padding: '0.5rem' }}>
            취소
          </button>
        )}
      </div>

      {/* 성적표 & 그래프 섹션 */}
      <div id="내신-section">
        <ScoreTable scores={scores} type="내신" onEdit={handleEditScore} onDelete={handleDeleteScore} />
        <ScoreGraph scores={scores} type="내신" />
      </div>
      <div id="모의고사-section">
        <ScoreTable scores={scores} type="모의고사" onEdit={handleEditScore} onDelete={handleDeleteScore} />
        <ScoreGraph scores={scores} type="모의고사" />
      </div>
      <div id="블라썸고3-section">
        <ScoreTable scores={scores} type="블라썸고3" onEdit={handleEditScore} onDelete={handleDeleteScore} />
        <ScoreGraph scores={scores} type="블라썸고3" />
      </div>
    </div>
  );
}

export default StudentDashboard;
