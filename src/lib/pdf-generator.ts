import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/**
 * Tailwind CSS v4 uses lab()/oklch() color functions that html2canvas cannot parse.
 * Fix: (1) strip unsupported color functions from cloned stylesheets,
 *      (2) apply computed RGB inline styles to all cloned elements.
 */

function cacheComputedStyles(el: HTMLElement) {
    const allElements = [el, ...Array.from(el.getElementsByTagName('*'))];
    return allElements.map(e => {
        const cs = window.getComputedStyle(e);
        return {
            color: cs.color,
            backgroundColor: cs.backgroundColor,
            borderColor: cs.borderColor,
            borderTopColor: cs.borderTopColor,
            borderBottomColor: cs.borderBottomColor,
            borderLeftColor: cs.borderLeftColor,
            borderRightColor: cs.borderRightColor,
            outlineColor: cs.outlineColor,
        };
    });
}

type StyleCache = ReturnType<typeof cacheComputedStyles>;

function applyToClone(clonedDoc: Document, clonedEl: HTMLElement, cache: StyleCache) {
    // Step 1: Strip lab()/oklch()/oklab()/lch() from ALL stylesheets in the cloned document
    clonedDoc.querySelectorAll('style').forEach(style => {
        if (style.textContent) {
            style.textContent = style.textContent.replace(
                /(?:lab|oklch|oklab|lch)\([^)]*\)/gi,
                'transparent'
            );
        }
    });

    // Step 2: Apply cached computed RGB colors as inline styles (overrides everything)
    const allCloned = [clonedEl, ...Array.from(clonedEl.getElementsByTagName('*'))];
    for (let i = 0; i < cache.length && i < allCloned.length; i++) {
        const ce = allCloned[i] as HTMLElement;
        const s = cache[i];
        ce.style.color = s.color;
        ce.style.backgroundColor = s.backgroundColor;
        ce.style.borderColor = s.borderColor;
        ce.style.borderTopColor = s.borderTopColor;
        ce.style.borderBottomColor = s.borderBottomColor;
        ce.style.borderLeftColor = s.borderLeftColor;
        ce.style.borderRightColor = s.borderRightColor;
        ce.style.outlineColor = s.outlineColor;
    }
}

export const generateAuditPDF = async (
    candidateName: string,
    _overallLevel: string,
    _avgScore: number,
    _categoryScores: Record<string, number>,
    _aiReport: string
) => {
    console.log("[Audit PDF] Segmented Safe-Mode Start...");

    const el = document.getElementById('ai-report-content');
    if (!el) {
        alert("리포트 내용을 찾을 수 없습니다.");
        return;
    }

    try {
        const doc = new jsPDF('p', 'mm', 'a4');
        const pageWidth = 210;

        const scale = 1.5;
        const widthPx = el.offsetWidth;
        const totalHeightPx = el.scrollHeight;

        const pxPerPage = Math.floor(widthPx * 1.414);
        const totalPages = Math.ceil(totalHeightPx / pxPerPage);

        console.log(`[PDF] Total segments to capture: ${totalPages}`);

        // Cache computed RGB styles once (getComputedStyle always returns rgb/rgba)
        const styleCache = cacheComputedStyles(el);

        for (let i = 0; i < totalPages; i++) {
            if (i > 0) doc.addPage();

            const currentY = i * pxPerPage;

            const canvas = await html2canvas(el, {
                scale,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff',
                y: currentY,
                height: Math.min(pxPerPage, totalHeightPx - currentY),
                width: widthPx,
                windowWidth: widthPx,
                onclone: (clonedDoc: Document, clonedEl: HTMLElement) => {
                    applyToClone(clonedDoc, clonedEl, styleCache);
                },
            });

            const imgData = canvas.toDataURL('image/jpeg', 0.85);
            const drawHeight = (canvas.height * pageWidth) / canvas.width;
            doc.addImage(imgData, 'JPEG', 0, 0, pageWidth, drawHeight, undefined, 'FAST');
        }

        doc.save(`IOSH_Audit_Report_${candidateName}_${new Date().getTime()}.pdf`);
        console.log("[Audit PDF] Success.");

    } catch (err) {
        console.error("[Audit PDF] Error, switching to Print Mode.", err);
        alert("전문 리포트 생성을 위해 브라우저의 전용 PDF 엔진을 호출합니다.\n\n[확인]을 누르신 후 인쇄 창에서 'PDF로 저장'을 선택해 주세요.");
        window.print();
    }
};
