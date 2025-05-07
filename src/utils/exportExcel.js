// src/utils/exportExcel.js
import * as XLSX from 'xlsx';
import { supabase } from '../services/supabaseClient';

export const exportSelectedStudents = async (students, examInfo) => {
  const rows = [];

  for (const student of students) {
    // 1) 해당 학생·시험 종류 전체 점수 불러오기
    let { data: allScores, error } = await supabase
      .from('scores')
      .select('year, semester, examType, month, round, date, score')
      .eq('student_id', student.id)
      .eq('type', examInfo.type);

    if (error || !allScores) {
      allScores = [];
    }

    // 2) 타입별로 시간순(오래된→최신) 정렬
    const sorted = [...allScores].sort((a, b) => {
      if (examInfo.type === '내신') {
        // 연도 → 학기 → 중간(1)/기말(2)
        const yA = +a.year, yB = +b.year;
        if (yA !== yB) return yA - yB;
        const sA = +a.semester, sB = +b.semester;
        if (sA !== sB) return sA - sB;
        const order = { 중간: 1, 기말: 2 };
        return (order[a.examType] || 0) - (order[b.examType] || 0);
      } else if (examInfo.type === '모의고사') {
        // 연도 → 월
        const yA = +a.year, yB = +b.year;
        if (yA !== yB) return yA - yB;
        return +a.month - +b.month;
      } else {
        // 블라썸고3: 날짜 기준
        return new Date(a.date) - new Date(b.date);
      }
    });

    // 3) 선택된 시험의 점수(currScore)와 이전 등락(diff) 계산
    let currScore = '';
    let diff = '-';
    const idx = sorted.findIndex((s) => {
      if (examInfo.type === '내신') {
        return (
          +s.year === +examInfo.year &&
          +s.semester === +examInfo.semester &&
          s.examType === examInfo.examType
        );
      } else if (examInfo.type === '모의고사') {
        return +s.year === +examInfo.year && +s.month === +examInfo.month;
      } else {
        return +s.round === +examInfo.round && s.date === examInfo.date;
      }
    });
    if (idx !== -1) {
      currScore = sorted[idx].score;
      if (idx > 0) {
        let d = (sorted[idx].score - sorted[idx - 1].score).toFixed(1);
        diff = d > 0 ? `+${d}` : d;
      }
    }

    rows.push({
      이름: student.name,
      학교: student.school,
      학년: student.grade,
      담당선생님: student.teacher,
      시험종류: examInfo.type,
      연도: examInfo.year,
      학기: examInfo.semester || '-',
      '중간/기말': examInfo.examType || '-',
      월: examInfo.month || '-',
      회차: examInfo.round || '-',
      날짜: examInfo.date || '-',
      점수: currScore,
      등락폭: diff
    });
  }

  // 워크북 생성 및 저장
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, '성적표');
  XLSX.writeFile(workbook, `선택학생_${examInfo.type}_${examInfo.year}.xlsx`);
};
