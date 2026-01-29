"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `당신은 세계 3대 경영 컨설팅 펌(McKinsey, BCG, Bain) 출신의 Senior Partner이자, IOSH(영국산업안전보건학회) Chartered Fellow로서 20년 이상의 글로벌 HSE 전략 컨설팅 경력을 보유한 최고 수준의 전문가입니다.

[YOUR ROLE]
- Fortune 500 기업 CEO 및 이사회에 HSE 전략을 보고하는 수준의 분석 리포트를 작성합니다.
- 데이터 기반의 정량적 분석과 전략적 인사이트를 결합합니다.
- IOSH Blueprint V2.1의 글로벌 벤치마크를 기준으로 객관적 진단을 수행합니다.

[WRITING PRINCIPLES]
1. Data-Driven: 모든 주장은 제공된 진단 데이터와 수치를 근거로 합니다.
2. Strategic: 단순 나열이 아닌, 경영 전략적 관점에서 우선순위를 제시합니다.
3. Actionable: 각 권고사항은 구체적이고 즉시 실행 가능해야 합니다.
4. Professional Tone: 최고 경영진 보고서 수준의 격조 있는 문체를 유지합니다. 전문가의 파트너로서 예우를 다하는 정중하고 품격 있는 어조를 유지하십시오.
5. Evidence-Based: 증거 기반 역량 증명을 위한 구체적 가이드를 제공합니다.
6. Constructive: 부족한 부분은 '실패'가 아닌 '성장 기회'로 정의하고, 전문가가 자부심과 실행 의지를 갖도록 합니다.`;

function buildUserPrompt(data: string): string {
    return `아래 IOSH Blueprint V2.1 기반 역량 성숙도 진단 결과를 분석하여, 아래 구조에 따라 전문 감사 리포트를 작성해 주십시오.
반드시 마크다운 문법(표, 목록, 볼드 등)을 적극 활용하여 가독성을 극대화하십시오.

---

# Professional Maturity Audit Report

## 1. Executive Dashboard
- 전체 성숙도 점수와 등급을 명시하고, 글로벌 HSE 전문가 평균 벤치마크(2.8~3.2)와 비교 분석하십시오.
- 3개 도메인(Technical / Core / Behavioural) 점수를 아래와 같은 **마크다운 표**로 정리하십시오:

| 도메인 | 점수 | 글로벌 벤치마크 | 평가 |
|--------|------|----------------|------|
| Technical | x.xx | 2.8~3.2 | ... |
| Core | x.xx | 2.8~3.2 | ... |
| Behavioural | x.xx | 2.8~3.2 | ... |

- 레벨 분포를 분석하여 역량 성숙도의 전반적 패턴을 진단하십시오.

## 2. Competency Gap Analysis
- 12개 평가 항목 중 GAP이 큰 항목(현재 레벨 ≤ 2)을 **Critical Gap**, 목표에 근접한 항목(현재 레벨 ≥ 3)을 **Near Target**으로 분류하십시오.
- 아래 형식의 마크다운 표로 정리하십시오:

| 상태 | 역량 항목 | 현재 레벨 | 목표 | GAP |
|------|-----------|----------|------|-----|

- 사용자가 제출한 증거(Evidence)의 품질을 평가하고, 보강 필요 부분을 지적하십시오.

## 3. Strategic SWOT Analysis
반드시 아래 마크다운 표 형식으로 작성하십시오:

| 구분 | 분석 |
|------|------|
| **Strengths** | 데이터에서 확인된 핵심 강점 (최소 3개) |
| **Weaknesses** | 즉각적 개선이 필요한 취약 영역 |
| **Opportunities** | 강점을 활용한 커리어 확장 기회 |
| **Threats** | 개선하지 않을 경우의 전문가적 리스크 |

## 4. Domain Deep-Dive

### 4.1 Technical Mastery
- 기술 역량 세부 분석 및 글로벌 기준 대비 포지셔닝
- 기술적 증거 자산화 전략

### 4.2 Core Business Integration
- 비즈니스 역량의 전략적 가치 분석
- 경영진 보고 스킬 강화 방안

### 4.3 Behavioural Leadership
- 리더십 행동 역량의 조직적 영향력 분석
- 안전 문화 변혁 리더로서의 성장 전략

## 5. Priority Action Matrix
아래 형식의 우선순위 매트릭스를 작성하십시오:

| 우선순위 | 역량 항목 | 현재 → 목표 | 핵심 실행 과제 | 예상 임팩트 |
|----------|-----------|-------------|---------------|------------|
| P1 (즉시) | ... | ... | ... | ... |
| P2 (3개월) | ... | ... | ... | ... |
| P3 (6개월) | ... | ... | ... | ... |

## 6. 12-Month Strategic Roadmap
분기별 실행 계획을 수립하되, 각 분기에 구체적 KPI를 포함하십시오:
- **Q1 Foundation**: 즉각적 GAP 해소 및 증거 수집
- **Q2 Acceleration**: 핵심 역량 강화 및 인증 취득
- **Q3 Integration**: 조직 내 영향력 확대 및 성과 가시화
- **Q4 Leadership**: 산업 리더십 포지셔닝 및 외부 활동

## 7. Evidence Portfolio Blueprint
감사 및 승진 심사를 대비한 증거 포트폴리오 구성 가이드:
- 각 역량별 **필수 증거 유형** (문서, 프로젝트 결과물, 인증서, 성과 데이터 등)
- 증거의 **품질 기준** 및 **작성 팁**
- IOSH CPD(지속전문개발) 로그 연계 방안

## 8. Professional Investment Recommendations
- 추천 교육/인증 프로그램 (NEBOSH, ISO 45001 Lead Auditor 등)
- 참여 권장 글로벌 컨퍼런스 및 네트워킹
- 멘토링 및 코칭 프로그램 활용 방안

---

[진단 데이터]
${data}

---
※ 반드시 한국어로 작성하되, 글로벌 컨설팅 펌의 보고서 수준의 전문적이고 격조 있는 문체를 유지하십시오.
※ 표(Table)와 목록을 적극 활용하여 가독성을 극대화하십시오.
※ 수치와 데이터를 근거로 한 객관적 분석을 수행하십시오.
※ 절대로 HTML 태그(<br>, <b>, <p> 등)를 사용하지 마십시오. 오직 순수 마크다운 문법만 사용하십시오.
※ 표(Table) 작성 시 반드시 헤더 행과 구분선(|---|)을 포함하고, 각 셀 사이에 충분한 공백을 두십시오.
※ 줄바꿈이 필요하면 HTML <br> 대신 마크다운 줄바꿈(빈 줄 또는 문장 끝 공백 2개)을 사용하십시오.
※ 리포트 마지막에 서명이나 검증 라인을 추가하지 마십시오. 별도의 서명 영역이 자동으로 삽입됩니다.`;
}

export async function analyzeCompetency(data: string) {
    console.log(">>> [AUDIT] Starting Strategic Maturity Analysis...");

    const userPrompt = buildUserPrompt(data);

    // Try Claude with system message separation
    if (process.env.ANTHROPIC_API_KEY) {
        const models = [
            { id: "claude-sonnet-4-20250514", maxTokens: 8000 },
            { id: "claude-3-7-sonnet-20250219", maxTokens: 8000 },
            { id: "claude-3-5-haiku-20241022", maxTokens: 4096 },
        ];

        for (const model of models) {
            try {
                console.log(`>>> [CLAUDE] Trying model: ${model.id}`);
                const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
                const msg = await anthropic.messages.create({
                    model: model.id as any,
                    max_tokens: model.maxTokens,
                    temperature: 0.3,
                    system: SYSTEM_PROMPT,
                    messages: [{ role: "user", content: userPrompt }],
                });
                const content = msg.content[0];
                if (content.type === 'text') {
                    console.log(`>>> [SUCCESS] Claude (${model.id}) responded correctly.`);
                    return content.text;
                }
            } catch (err: any) {
                console.error(`Claude ${model.id} failed:`, err.message);
            }
        }
    }

    // OpenAI Fallback
    if (process.env.OPENAI_API_KEY) {
        console.log(">>> [FALLBACK] Using OpenAI GPT-4o-mini");
        try {
            const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
            const response = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: SYSTEM_PROMPT },
                    { role: "user", content: userPrompt },
                ],
                temperature: 0.3,
                max_tokens: 8000,
            });
            return response.choices[0].message.content || "";
        } catch (err: any) {
            console.error("OpenAI Fallback Failed:", err.message);
        }
    }

    // Google Gemini Fallback
    if (process.env.GOOGLE_API_KEY) {
        console.log(">>> [FALLBACK] Using Google Gemini 2.0-flash");
        try {
            const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
            const model = genAI.getGenerativeModel({
                model: "gemini-2.0-flash",
                systemInstruction: SYSTEM_PROMPT,
            });
            const result = await model.generateContent(userPrompt);
            return result.response.text();
        } catch (error: any) {
            console.error("Gemini Fallback Failed:", error.message);
        }
    }

    return "죄송합니다. 모든 인공지능 엔진(Claude, OpenAI, Gemini) 호출에 실패했습니다. API 키 설정 및 네트워크 상태를 확인해 주세요.";
}
