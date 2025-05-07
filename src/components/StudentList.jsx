import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { exportSelectedStudents } from '../utils/exportExcel';

function StudentList() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [filterField, setFilterField] = useState('name');
  const [gradeFilter, setGradeFilter] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const [examInfo, setExamInfo] = useState({
    type: '내신',
    year: '',
    semester: '',
    examType: '',
    month: '',
    round: '',
    date: ''
  });

  const [newStudent, setNewStudent] = useState({
    name: '',
    school: '',
    grade: '중1',
    teacher: ''
  });

  const [editingStudent, setEditingStudent] = useState(null);

  // Fetch students from Supabase
  const fetchStudents = async () => {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: true });
    if (!error) setStudents(data);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Add student
  const handleAddStudent = async () => {
    const { name, school, grade, teacher } = newStudent;
    if (!name || !school || !teacher) {
      alert('모든 항목을 입력하세요.');
      return;
    }
    await supabase.from('students').insert([newStudent]);
    setNewStudent({ name: '', school: '', grade: '중1', teacher: '' });
    fetchStudents();
  };

  // Initiate edit
  const handleEditInitiate = (student) => {
    setEditingStudent({ ...student });
  };

  // Change edit field
  const handleEditChange = (field, value) => {
    setEditingStudent({ ...editingStudent, [field]: value });
  };

  // Save edited student
  const handleSaveEdit = async () => {
    const { id, name, school, grade, teacher } = editingStudent;
    await supabase
      .from('students')
      .update({ name, school, grade, teacher })
      .eq('id', id);
    setEditingStudent(null);
    fetchStudents();
  };

  // Cancel edit
  const handleCancelEdit = () => setEditingStudent(null);

  // Delete student
  const handleDeleteStudent = async (id) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      await supabase.from('students').delete().eq('id', id);
      fetchStudents();
    }
  };

  // Select student checkboxes
  const handleSelectStudent = (id) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Select all students
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedStudents([]);
      setSelectAll(false);
    } else {
      setSelectedStudents(students.map((s) => s.id));
      setSelectAll(true);
    }
  };

  // Export selected students to Excel
  const handleExportExcel = async () => {
    if (selectedStudents.length === 0) {
      alert('학생을 선택하세요.');
      return;
    }
    const selected = students.filter((s) => selectedStudents.includes(s.id));
    await exportSelectedStudents(selected, examInfo);
  };

  // Filter students by search and grade
  const filteredStudents = students.filter((student) => {
    const fieldValue = (student[filterField] || '').toLowerCase();
    const matchesSearch = fieldValue.includes(search.toLowerCase());
    const matchesGrade = gradeFilter ? student.grade === gradeFilter : true;
    return matchesSearch && matchesGrade;
  });

  // Navigate to student dashboard
  const handleStudentClick = (id) => navigate(`/students/${id}`);

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        학생 목록 (산본 블라썸에듀)
      </h2>

      {/* 시험 선택 & 엑셀 저장 */}
      <div style={{ marginBottom: '1rem' }}>
        <select
          value={examInfo.type}
          onChange={(e) => setExamInfo({ ...examInfo, type: e.target.value })}
          style={{ marginRight: '0.5rem' }}
        >
          <option value="내신">내신</option>
          <option value="모의고사">모의고사</option>
          <option value="블라썸고3">블라썸고3</option>
        </select>
        <input
          type="text"
          placeholder="연도"
          value={examInfo.year}
          onChange={(e) => setExamInfo({ ...examInfo, year: e.target.value })}
          style={{ marginRight: '0.5rem' }}
        />
        {examInfo.type === '내신' && (
          <>
            <input
              type="text"
              placeholder="학기"
              value={examInfo.semester}
              onChange={(e) => setExamInfo({ ...examInfo, semester: e.target.value })}
              style={{ marginRight: '0.5rem' }}
            />
            <input
              type="text"
              placeholder="중간/기말"
              value={examInfo.examType}
              onChange={(e) => setExamInfo({ ...examInfo, examType: e.target.value })}
              style={{ marginRight: '0.5rem' }}
            />
          </>
        )}
        {examInfo.type === '모의고사' && (
          <input
            type="text"
            placeholder="월"
            value={examInfo.month}
            onChange={(e) => setExamInfo({ ...examInfo, month: e.target.value })}
            style={{ marginRight: '0.5rem' }}
          />
        )}
        {examInfo.type === '블라썸고3' && (
          <>
            <input
              type="text"
              placeholder="회차"
              value={examInfo.round}
              onChange={(e) => setExamInfo({ ...examInfo, round: e.target.value })}
              style={{ marginRight: '0.5rem' }}
            />
            <input
              type="date"
              placeholder="날짜"
              value={examInfo.date}
              onChange={(e) => setExamInfo({ ...examInfo, date: e.target.value })}
              style={{ marginRight: '0.5rem' }}
            />
          </>
        )}
        <button
          onClick={handleExportExcel}
          style={{
            padding: '0.5rem',
            backgroundColor: '#22c55e',
            color: 'white',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          엑셀로 저장
        </button>
      </div>

      {/* 학생 추가 / 수정 폼 */}
      <div
        style={{
          marginBottom: '2rem',
          border: '1px solid #ccc',
          padding: '1rem',
          borderRadius: '8px'
        }}
      >
        <h3 style={{ marginBottom: '1rem' }}>
          {editingStudent ? '학생 정보 수정' : '학생 추가'}
        </h3>

        {editingStudent ? (
          <>
            <input
              type="text"
              value={editingStudent.name}
              onChange={(e) => handleEditChange('name', e.target.value)}
              style={{ marginRight: '0.5rem', padding: '0.5rem' }}
            />
            <input
              type="text"
              value={editingStudent.school}
              onChange={(e) => handleEditChange('school', e.target.value)}
              style={{ marginRight: '0.5rem', padding: '0.5rem' }}
            />
            <select
              value={editingStudent.grade}
              onChange={(e) => handleEditChange('grade', e.target.value)}
              style={{ marginRight: '0.5rem', padding: '0.5rem' }}
            >
              {['중1', '중2', '중3', '고1', '고2', '고3'].map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
            <input
              type="text"
              value={editingStudent.teacher}
              onChange={(e) => handleEditChange('teacher', e.target.value)}
              style={{ marginRight: '0.5rem', padding: '0.5rem' }}
            />
            <button
              onClick={handleSaveEdit}
              style={{
                padding: '0.5rem',
                backgroundColor: '#4f46e5',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                marginRight: '0.5rem'
              }}
            >
              저장
            </button>
            <button onClick={handleCancelEdit} style={{ padding: '0.5rem' }}>
              취소
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="이름"
              value={newStudent.name}
              onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
              style={{ marginRight: '0.5rem', padding: '0.5rem' }}
            />
            <input
              type="text"
              placeholder="학교"
              value={newStudent.school}
              onChange={(e) => setNewStudent({ ...newStudent, school: e.target.value })}
              style={{ marginRight: '0.5rem', padding: '0.5rem' }}
            />
            <select
              value={newStudent.grade}
              onChange={(e) => setNewStudent({ ...newStudent, grade: e.target.value })}
              style={{ marginRight: '0.5rem', padding: '0.5rem' }}
            >
              {['중1', '중2', '중3', '고1', '고2', '고3'].map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="담당선생님"
              value={newStudent.teacher}
              onChange={(e) => setNewStudent({ ...newStudent, teacher: e.target.value })}
              style={{ marginRight: '0.5rem', padding: '0.5rem' }}
            />
            <button
              onClick={handleAddStudent}
              style={{
                padding: '0.5rem',
                backgroundColor: '#4f46e5',
                color: 'white',
                border: 'none',
                borderRadius: '4px'
              }}
            >
              추가
            </button>
          </>
        )}
      </div>

      {/* 검색 & 전체선택 */}
      <div style={{ marginBottom: '1rem' }}>
        <select
          value={filterField}
          onChange={(e) => setFilterField(e.target.value)}
          style={{ marginRight: '0.5rem', padding: '0.5rem' }}
        >
          <option value="name">이름</option>
          <option value="school">학교</option>
          <option value="grade">학년</option>
          <option value="teacher">담당선생님</option>
        </select>
        <input
          type="text"
          placeholder="검색어 입력"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginRight: '0.5rem', padding: '0.5rem' }}
        />
        <select
          value={gradeFilter}
          onChange={(e) => setGradeFilter(e.target.value)}
          style={{ marginRight: '0.5rem', padding: '0.5rem' }}
        >
          <option value="">전체 학년</option>
          {['중1', '중2', '중3', '고1', '고2', '고3'].map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
        <button onClick={handleSelectAll} style={{ padding: '0.5rem' }}>
          {selectAll ? '전체해제' : '전체선택'}
        </button>
      </div>

      {/* 학생 목록 테이블 */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ borderBottom: '1px solid #ccc', padding: '0.5rem' }} />
            <th style={{ borderBottom: '1px solid #ccc', padding: '0.5rem' }}>이름</th>
            <th style={{ borderBottom: '1px solid #ccc', padding: '0.5rem' }}>학교</th>
            <th style={{ borderBottom: '1px solid #ccc', padding: '0.5rem' }}>학년</th>
            <th style={{ borderBottom: '1px solid #ccc', padding: '0.5rem' }}>담당선생님</th>
            <th style={{ borderBottom: '1px solid #ccc', padding: '0.5rem' }}>관리</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((student) => (
            <tr key={student.id}>
              <td style={{ borderBottom: '1px solid #ccc', padding: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={selectedStudents.includes(student.id)}
                  onChange={() => handleSelectStudent(student.id)}
                />
              </td>
              <td
                style={{ borderBottom: '1px solid #ccc', padding: '0.5rem', cursor: 'pointer' }}
                onClick={() => handleStudentClick(student.id)}
              >
                {student.name}
              </td>
              <td style={{ borderBottom: '1px solid #ccc', padding: '0.5rem' }}>
                {student.school}
              </td>
              <td style={{ borderBottom: '1px solid #ccc', padding: '0.5rem' }}>
                {student.grade}
              </td>
              <td style={{ borderBottom: '1px solid #ccc', padding: '0.5rem' }}>
                {student.teacher}
              </td>
              <td style={{ borderBottom: '1px solid #ccc', padding: '0.5rem' }}>
                <button onClick={() => handleEditInitiate(student)} style={{ marginRight: '0.5rem' }}>
                  수정
                </button>
                <button onClick={() => handleDeleteStudent(student.id)} style={{ color: 'red', border: 'none', background: 'none' }}>
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudentList;
