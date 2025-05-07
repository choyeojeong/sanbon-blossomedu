// src/components/ExportPDF.jsx
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

function ExportPDF({ student, scores }) {
  const handleExportPDF = async () => {
    const categories = ['내신', '모의고사', '블라썸고3'];
    const pdf = new jsPDF('p', 'mm', 'a4');

    for (let i = 0; i < categories.length; i++) {
      const section = document.getElementById(`${categories[i]}-section`);
      if (!section) continue;

      // header + section 묶어 캡처
      const header = document.getElementById('student-header');
      const wrapper = document.createElement('div');
      wrapper.style.padding = '10px';
      if (header) wrapper.appendChild(header.cloneNode(true));
      wrapper.appendChild(section.cloneNode(true));
      document.body.appendChild(wrapper);

      const canvas = await html2canvas(wrapper, { scale: 1.5 });
      document.body.removeChild(wrapper);

      const imgData = canvas.toDataURL('image/png');
      const imgProps = pdf.getImageProperties(imgData);

      // 가로 여백 10mm씩 확보
      const pdfWidth = pdf.internal.pageSize.getWidth() - 20;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      if (i !== 0) pdf.addPage();
      pdf.addImage(imgData, 'PNG', 10, 10, pdfWidth, pdfHeight);
    }

    pdf.save(`${student.name}_성적표.pdf`);
  };

  return (
    <button
      onClick={handleExportPDF}
      style={{
        marginLeft: '1rem',
        padding: '0.5rem',
        backgroundColor: '#ef4444',
        color: 'white',
        border: 'none',
        borderRadius: '4px'
      }}
    >
      PDF 저장
    </button>
  );
}

export default ExportPDF;
