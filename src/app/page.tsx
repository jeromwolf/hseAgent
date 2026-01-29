"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ShieldCheck,
    ChevronRight,
    ChevronLeft,
    FileText,
    TrendingUp,
    Target,
    Users,
    Loader2,
    Download,
    RotateCcw
} from "lucide-react";
import { IOSH_QUESTIONS, CATEGORIES } from "@/lib/questions";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { analyzeCompetency } from "./actions";
import { generateAuditPDF } from "@/lib/pdf-generator";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer
} from 'recharts';

// CSS for perfect PDF print output
const PRINT_STYLES = `
@media print {
    @page { size: A4; margin: 0; }
    body { background: white !important; margin: 0 !important; padding: 0 !important; }
    nav, .btn-primary, .cooldown-msg, button, .flex-between, footer { display: none !important; }
    .min-h-screen { min-height: 0 !important; padding: 0 !important; background: white !important; }
    .max-w-6xl { max-width: 100% !important; margin: 0 !important; border: none !important; }
    #ai-report-content { 
        width: 100% !important; 
        max-width: 100% !important; 
        margin: 0 !important; 
        border: none !important; 
        box-shadow: none !important; 
        display: block !important;
    }
    .grid { display: block !important; }
    .lg\\:grid-cols-3 { display: block !important; }
    .prose { max-width: 100% !important; font-size: 14px !important; }
}`;

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function Home() {
    const [step, setStep] = useState<number>(-1); // -1: Intro, 0~N: Assessment, 999: Result
    const [answers, setAnswers] = useState<Record<string, { score: number; evidence: string; selectedDesc: string; category: string }>>({});
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [aiReport, setAiReport] = useState("");
    const [aiError, setAiError] = useState("");
    const [cooldown, setCooldown] = useState(0);
    const [isDebug, setIsDebug] = useState(true);
    const totalSteps = IOSH_QUESTIONS.length;

    const [shuffledIndices, setShuffledIndices] = useState<number[]>([]);

    useEffect(() => {
        if (cooldown > 0) {
            const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [cooldown]);

    useEffect(() => {
        if (step >= 0 && step < totalSteps) {
            const order = [1, 2, 3, 4].sort(() => Math.random() - 0.5);
            setShuffledIndices(order);
        }
    }, [step, totalSteps]);

    const getAiAnalysis = async () => {
        if (!Object.keys(answers).length || cooldown > 0) return;
        setIsAnalyzing(true);
        setAiError("");
        try {
            const dataStr = Object.entries(answers)
                .map(([id, ans]) => {
                    const qIdx = IOSH_QUESTIONS.findIndex(q => q.id === id);
                    const qTitle = qIdx !== -1 ? IOSH_QUESTIONS[qIdx].question : id;
                    return `[항목: ${qTitle}]
- 선택한 기준: ${ans.selectedDesc} (레벨 ${ans.score})
- 제출한 증거: ${ans.evidence || "없음"}
------------------`;
                })
                .join("\n");

            const report = await analyzeCompetency(dataStr);
            if (report.includes("분석 요청이 너무 많습니다")) {
                setAiError(report);
                setCooldown(30);
            } else if (report.startsWith("AI 분석 중 오류") || report.startsWith("API 설정")) {
                setAiError(report);
            } else {
                setAiReport(report);
            }
        } catch (err) {
            setAiError("연결 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
            setCooldown(10);
        } finally {
            setIsAnalyzing(false);
        }
    };

    useEffect(() => {
        if (step === 999 && !aiReport && !aiError && !isAnalyzing) {
            getAiAnalysis();
        }
    }, [step, answers, aiReport, aiError, isAnalyzing]);

    const calculateResults = () => {
        const vals = Object.values(answers);
        const avg = vals.length > 0 ? vals.reduce((acc, curr) => acc + curr.score, 0) / vals.length : 0;

        let status = { label: "Understand", color: "bg-slate-500", border: "border-slate-500", text: "text-slate-500" };
        if (avg >= 3.6) status = { label: "Innovate", color: "bg-emerald-600", border: "border-emerald-600", text: "text-emerald-600" };
        else if (avg >= 2.6) status = { label: "Lead", color: "bg-brand-secondary", border: "border-brand-secondary", text: "text-brand-secondary" };
        else if (avg >= 1.6) status = { label: "Implement", color: "bg-amber-600", border: "border-amber-600", text: "text-amber-600" };

        return { avg, status };
    };

    const getCategoryAverages = () => {
        const results: Record<string, number> = {};
        Object.keys(CATEGORIES).forEach((key) => {
            const catAnswers = Object.values(answers).filter(a => a.category === key);
            results[key] = catAnswers.length > 0 ? catAnswers.reduce((acc, c) => acc + c.score, 0) / catAnswers.length : 0;
        });
        return results;
    };

    const { avg, status } = calculateResults();
    const catAvgs = getCategoryAverages();
    const chartData = Object.entries(CATEGORIES).map(([key, cat]) => ({
        subject: cat.title.split(' ')[0],
        A: catAvgs[key],
        fullMark: 4,
    }));

    // Intro View
    if (step === -1) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#001a33] text-white relative">
                <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="z-10 text-center max-w-4xl">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8">
                        <ShieldCheck className="w-5 h-5 text-brand-secondary" />
                        <span className="text-sm font-medium tracking-wider uppercase">Official IOSH Standard</span>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-bold mb-8 tracking-tighter leading-tight">
                        Professional <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-secondary to-yellow-200">Maturity Audit</span>
                    </h1>
                    <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
                        글로벌 전문인 대상 IOSH Blueprint V2.1 통합 진단 시스템. <br />
                        귀하의 역량을 정밀 감사하고 전략적 로드맵을 제공합니다.
                    </p>
                    <button onClick={() => setStep(0)} className="px-12 py-5 bg-brand-secondary text-brand-primary rounded-full font-bold text-xl hover:shadow-2xl transition-all">
                        심사 시작하기
                    </button>
                </motion.div>
            </div>
        );
    }

    // Result View
    if (step === 999) {
        return (
            <div className="min-h-screen bg-slate-50 p-6 md:p-12 pb-32">
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-between items-center mb-12">
                        <h1 className="text-4xl font-bold text-brand-primary">Audit Result Profile</h1>
                        <button onClick={() => { setStep(-1); setAnswers({}); setAiReport(""); setAiError(""); }} className="flex items-center gap-2 text-slate-500 hover:text-brand-primary transition-colors">
                            <RotateCcw className="w-5 h-5" /> 다시 진단하기
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                        <div className="lg:col-span-2 bg-white rounded-3xl p-12 shadow-sm border border-slate-100 flex flex-col items-center">
                            <h3 className="text-xl font-bold mb-8 text-slate-800">Domain Competency Radar</h3>
                            <div className="w-full h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                                        <PolarGrid stroke="#e2e8f0" />
                                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 13 }} />
                                        <Radar name="Maturity" dataKey="A" stroke="#003366" fill="#003366" fillOpacity={0.1} />
                                        <PolarRadiusAxis domain={[0, 4]} tick={false} axisLine={false} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="flex flex-col gap-6">
                            <div className={cn("bg-white rounded-3xl p-8 border-l-8 shadow-sm", status.border)}>
                                <p className="text-xs font-bold text-slate-400 uppercase mb-2">Overall Rank</p>
                                <h2 className={cn("text-4xl font-bold", status.text)}>{status.label}</h2>
                                <p className="text-sm font-bold mt-4">{avg.toFixed(2)} / 4.00</p>
                            </div>
                            <div className="bg-white rounded-3xl p-8 shadow-sm flex-1">
                                <h3 className="font-bold mb-6">Area Score Details</h3>
                                <div className="space-y-6">
                                    {Object.entries(CATEGORIES).map(([key, cat]) => (
                                        <div key={key}>
                                            <div className="flex justify-between text-sm mb-2 font-medium">
                                                <span>{cat.title}</span>
                                                <span className="text-brand-primary font-bold">{catAvgs[key].toFixed(1)}</span>
                                            </div>
                                            <div className="w-full bg-slate-50 h-2 rounded-full overflow-hidden">
                                                <div className="bg-slate-300 h-full" style={{ width: `${(catAvgs[key] / 4) * 100}%` }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* PREMIUM AI REPORT SECTION */}
                    <div className="bg-white p-12 rounded-3xl shadow-xl border border-slate-100 mb-12">
                        <h3 className="text-2xl font-bold mb-10 flex items-center gap-3">
                            <Users className="w-6 h-6 text-brand-secondary" /> Strategic Audit Analysis
                        </h3>

                        {isAnalyzing ? (
                            <div className="flex flex-col items-center justify-center py-24 gap-4">
                                <Loader2 className="w-12 h-12 text-brand-primary animate-spin" />
                                <p className="text-slate-500 font-medium">AI 수석 감사원이 리포트를 작성하고 있습니다...</p>
                            </div>
                        ) : aiError ? (
                            <div className="flex flex-col items-center justify-center py-12 gap-6 text-center">
                                <div className="p-6 bg-red-50 text-red-600 rounded-2xl border border-red-100 max-w-xl">{aiError}</div>
                                <button onClick={getAiAnalysis} className="btn-primary">다시 요청하기</button>
                            </div>
                        ) : (
                            <div id="ai-report-content" className="bg-white shadow-2xl mx-auto overflow-hidden" style={{ width: '100%', maxWidth: '850px', color: '#1e293b', fontFamily: 'Inter, "Noto Sans KR", system-ui, sans-serif', backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}>
                                {/* DOCUMENT COVER / HEADER */}
                                <div style={{ borderBottom: '6px solid #00264d' }} className="p-12 md:p-16 bg-[#fafafa]">
                                    <div className="flex justify-between items-start mb-10">
                                        <div className="flex items-center gap-3">
                                            <div style={{ backgroundColor: '#00264d' }} className="p-3 rounded-lg shadow-lg">
                                                <ShieldCheck style={{ color: '#fbbf24' }} className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <h2 style={{ color: '#00264d' }} className="text-xl font-black tracking-tighter uppercase leading-none">Global Advisory</h2>
                                                <p className="text-[10px] text-slate-400 font-bold tracking-widest mt-1 uppercase">Strategic HSE Unit</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div style={{ backgroundColor: '#fbbf24', color: '#00264d' }} className="inline-block px-5 py-2 rounded text-[10px] font-black uppercase tracking-[0.2em] shadow-lg mb-4">Official Audit</div>
                                            <p className="text-[10px] text-slate-400 font-mono">REF: IOSH-V2-2026</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 text-black">Candidate Report</p>
                                            <h1 className="text-4xl md:text-5xl font-black text-[#0f172a] leading-tight tracking-tight">
                                                Strategic <br />
                                                <span style={{ color: '#00264d' }}>Maturity Audit</span>
                                            </h1>
                                            <div className="mt-8 pt-8 border-t border-slate-200">
                                                <p className="text-sm text-slate-500 mb-1">AUDIT SUBJECT</p>
                                                <p className="text-xl font-bold text-slate-900">HSE Specialist</p>
                                            </div>
                                        </div>
                                        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="text-xs font-bold text-slate-400 uppercase">Executive Rank</span>
                                                <span className="text-lg font-black text-[#00264d]">{status.label}</span>
                                            </div>
                                            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                                                <div className={cn("h-full", status.color)} style={{ width: `${(avg / 4) * 100}%` }} />
                                            </div>
                                            <p className="text-right text-xs font-bold mt-2 text-slate-400">{avg.toFixed(2)} / 4.00</p>
                                        </div>
                                    </div>
                                </div>

                                {/* DATA SUMMARY TABLE (Injected for PDF consistency) */}
                                <div className="px-12 md:px-20 py-12 bg-slate-50">
                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">Domain Maturity Matrix</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {Object.entries(CATEGORIES).map(([key, cat]) => (
                                            <div key={key} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                                <p className="text-[10px] text-slate-400 font-bold uppercase truncate mb-1">{cat.title}</p>
                                                <p className="text-lg font-black text-slate-800">{catAvgs[key].toFixed(2)}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* MAIN AI CONTENT */}
                                <div className="p-10 md:p-20 pt-16 bg-white prose prose-slate max-w-none 
                                    prose-headings:text-[#00264d] prose-headings:font-black
                                    prose-h2:text-2xl prose-h2:mt-16 prose-h2:mb-8 prose-h2:bg-slate-50 prose-h2:p-5 prose-h2:rounded-r-xl prose-h2:border-l-8 prose-h2:border-[#00264d]
                                    prose-blockquote:border-l-4 prose-blockquote:border-[#fbbf24] prose-blockquote:bg-[#fefce8] prose-blockquote:p-10 prose-blockquote:rounded-r-2xl prose-blockquote:my-12
                                    prose-blockquote:text-xl prose-blockquote:text-[#1e293b] prose-blockquote:italic
                                    prose-p:text-lg prose-p:leading-[1.9] prose-p:text-slate-700
                                    prose-li:text-lg prose-li:text-slate-700
                                    prose-strong:text-[#00264d] prose-strong:font-bold
                                    ">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{aiReport}</ReactMarkdown>

                                    <div className="mt-32 pt-16 border-t-2 border-slate-100 flex flex-col md:flex-row justify-between items-end gap-12">
                                        <div className="space-y-6">
                                            <div style={{ borderColor: '#e2e8f0', border: '1px solid #e2e8f0' }} className="w-32 h-32 rounded-full flex items-center justify-center p-2 opacity-30">
                                                <div style={{ border: '1px dashed #00264d' }} className="w-full h-full rounded-full flex items-center justify-center text-[7px] font-black text-[#00264d] text-center uppercase tracking-tighter">OFFICIAL <br /> AUDIT SEAL</div>
                                            </div>
                                            <p className="text-[10px] text-slate-800 font-mono">TIMESTAMP: {new Date().toLocaleString('ko-KR')}</p>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <div className="w-64 h-px bg-[#00264d] mb-4 ml-auto"></div>
                                            <p className="text-xs font-black text-[#00264d] uppercase tracking-[0.2em]">Lead Partner, IOSH Audit Group</p>
                                            <p className="text-[10px] text-slate-600 mt-2 font-medium">Digital Signature Certified - Protocol V2.1</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-12 flex justify-center">
                        <button
                            disabled={isDownloading || isAnalyzing}
                            className={cn(
                                "btn-primary px-12 py-6 flex items-center gap-3 text-xl shadow-2xl transition-all",
                                (isDownloading || isAnalyzing) ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
                            )}
                            onClick={async () => {
                                setIsDownloading(true);
                                try {
                                    await generateAuditPDF("HSE Specialist", status.label, avg, catAvgs, aiReport);
                                } catch (err) {
                                    alert("리포트 생성 중 오류가 발생했습니다. 브라우저 콘솔을 확인해 주세요.");
                                } finally {
                                    setIsDownloading(false);
                                }
                            }}
                        >
                            {isDownloading ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <Download className="w-6 h-6" />
                            )}
                            {isDownloading ? "리포트 생성 중..." : "전문 PDF 리포트 다운로드"}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Assessment Steps
    const currentQ = IOSH_QUESTIONS[step];
    const progress = ((step + 1) / totalSteps) * 100;
    const currentAnswer = answers[currentQ.id];

    const handleNext = () => {
        if (step < totalSteps - 1) setStep(step + 1);
        else setStep(999);
    };

    const autoFill = () => {
        const newAnswers = { ...answers };
        IOSH_QUESTIONS.forEach(q => {
            if (!newAnswers[q.id]) {
                const lvl = Math.floor(Math.random() * 4) + 1;
                newAnswers[q.id] = { score: lvl, category: q.category, selectedDesc: (q.levels as any)[lvl], evidence: "" };
            }
        });
        setAnswers(newAnswers);
        setStep(999);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <style dangerouslySetInnerHTML={{ __html: PRINT_STYLES }} />
            <nav className="p-6 bg-white border-b border-slate-100 flex justify-between items-center fixed top-0 w-full z-50">
                <div className="font-bold tracking-tighter text-2xl flex items-center gap-2">
                    <ShieldCheck className="w-6 h-6 text-brand-primary" /> IOSH <span className="text-brand-secondary">AUDIT</span>
                </div>
                <div className="flex items-center gap-6 text-sm font-bold">
                    {isDebug && <button onClick={autoFill} className="hidden md:block px-3 py-1 bg-amber-100 text-amber-700 rounded-full">⚡ FAST-TRACK</button>}
                    <div>STEP <span className="text-brand-primary text-xl">{step + 1}</span> / {totalSteps}</div>
                </div>
            </nav>

            <main className="flex-1 pt-32 pb-12 px-6">
                <AnimatePresence mode="wait">
                    <motion.div key={currentQ.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-4xl mx-auto">
                        <div className="mb-8 flex items-center gap-3">
                            <span className="px-3 py-1 rounded-full bg-brand-primary/5 text-brand-primary text-xs font-bold uppercase tracking-widest">{currentQ.category}</span>
                            <span className="text-slate-300">/</span>
                            <span className="text-slate-500 text-sm font-medium">{currentQ.sub_area}</span>
                        </div>
                        <h2 className="text-4xl font-bold text-slate-900 mb-6 leading-tight">{currentQ.question}</h2>
                        <p className="text-xl text-slate-500 mb-12 font-light leading-relaxed">{currentQ.description}</p>

                        <div className="grid grid-cols-1 gap-4 mb-12">
                            {shuffledIndices.map((lvl) => {
                                const desc = (currentQ.levels as any)[lvl];
                                return (
                                    <button key={lvl} onClick={() => setAnswers({ ...answers, [currentQ.id]: { ...answers[currentQ.id], score: lvl, selectedDesc: desc, category: currentQ.category } })}
                                        className={cn("text-left p-6 rounded-2xl border-2 transition-all", currentAnswer?.score === lvl ? "bg-brand-primary/5 border-brand-primary shadow-md" : "bg-white border-slate-100 hover:border-slate-300")}>
                                        <div className="flex items-start gap-4">
                                            <div className={cn("mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0", currentAnswer?.score === lvl ? "border-brand-primary bg-brand-primary" : "border-slate-200")}>
                                                {currentAnswer?.score === lvl && <div className="w-2 h-2 bg-white rounded-full" />}
                                            </div>
                                            <p className={cn("text-lg", currentAnswer?.score === lvl ? "text-slate-900 font-medium" : "text-slate-600")}>{desc}</p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        <div className="mb-12">
                            <h4 className="font-bold flex items-center gap-2 mb-4"><FileText className="w-5 h-5 text-brand-secondary" /> 전문가 실행 증거 (Evidence)</h4>
                            <textarea value={currentAnswer?.evidence || ""} onChange={(e) => setAnswers({ ...answers, [currentQ.id]: { ...answers[currentQ.id], evidence: e.target.value, category: currentQ.category } })}
                                placeholder="해당 단계를 선택한 근거를 프로젝트 사례 중심으로 작성해 주세요..." className="w-full h-32 p-6 rounded-2xl border-slate-200 focus:border-brand-primary outline-none transition-all shadow-sm" />
                        </div>

                        <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                            <button onClick={() => setStep(step - 1)} disabled={step === 0} className="flex items-center gap-2 text-slate-400 font-bold disabled:opacity-0"><ChevronLeft className="w-5 h-5" /> PREV</button>
                            <button onClick={handleNext} disabled={!currentAnswer?.score} className="btn-primary flex items-center gap-2">{step === totalSteps - 1 ? "FINALIZE AUDIT" : "NEXT STEP"} <ChevronRight className="w-5 h-5" /></button>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
}
