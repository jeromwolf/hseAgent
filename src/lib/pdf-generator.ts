import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const generateAuditPDF = async (
    candidateName: string,
    overallLevel: string,
    avgScore: number,
    categoryScores: Record<string, number>,
    aiReport: string
) => {
    console.log("[Audit PDF] Segmented Safe-Mode Start...");

    const el = document.getElementById('ai-report-content');
    if (!el) {
        alert("리포트 내용을 찾을 수 없습니다.");
        return;
    }

    try {
        // 1. 아주 긴 문서도 견딜 수 있도록 분할 캡처 로직 준비
        const doc = new jsPDF('p', 'mm', 'a4');
        const pageWidth = 210;
        const pageHeight = 297;

        // 브라우저 부하를 최소화하는 1.0 배율 사용
        const scale = 1.0;
        const widthPx = el.offsetWidth;
        const totalHeightPx = el.scrollHeight;

        // A4 비율에 맞춘 페이지당 픽셀 높이 (약 1.41배)
        const pxPerPage = Math.floor(widthPx * 1.414);
        const totalPages = Math.ceil(totalHeightPx / pxPerPage);

        console.log(`[PDF] Total segments to capture: ${totalPages}`);

        for (let i = 0; i < totalPages; i++) {
            if (i > 0) doc.addPage();

            const currentY = i * pxPerPage;

            // 핵심: 전체를 찍지 않고 해당 구간만 정밀 캡처
            const canvas = await html2canvas(el, {
                scale: scale,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff',
                y: currentY,
                height: Math.min(pxPerPage, totalHeightPx - currentY),
                width: widthPx,
                windowWidth: widthPx
            });

            const imgData = canvas.toDataURL('image/jpeg', 0.85);
            // 페이지에 맞게 이미지 삽입 (마지막 페이지는 높이 조절)
            const drawHeight = (canvas.height * pageWidth) / canvas.width;
            doc.addImage(imgData, 'JPEG', 0, 0, pageWidth, drawHeight, undefined, 'FAST');
        }

        doc.save(`IOSH_Audit_Report_${candidateName}_${new Date().getTime()}.pdf`);
        console.log("[Audit PDF] Success.");

    } catch (err) {
        console.error("[Audit PDF] Memory error, switching to Print Mode.", err);
        // 모든 시스템이 실패할 경우를 대비한 최후의 보루: 인쇄 모드
        alert("전문 리포트 생성을 위해 브라우저의 전용 PDF 엔진을 호출합니다.\n\n[확인]을 누르신 후 인쇄 창에서 'PDF로 저장'을 선택해 주세요.");
        window.print();
    }
};
