"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";

export async function analyzeCompetency(data: string) {
    console.log(">>> [AUDIT] Starting Professional Mentorship Analysis...");

    const prompt = `당신은 IOSH 글로벌 안전보건 컨설팅 사의 **'Expert Partner 및 수석 멘토'**입니다. 
  당신은 이 전문가가 글로벌 TOP 수준으로 도약할 수 있도록 돕는 든든한 조력자이자 전략가입니다.

  [REPORTING PRINCIPLES]
  1. **Constructive Insight**: 부족한 부분은 '실패'가 아닌 '도약의 기회'로 정의하고, 구체적인 해결책을 제시하십시오.
  2. **Professional Support**: 사용자가 선택한 역량 수준을 존중하고, 이를 공식적으로 증명하기 위한 '증거 자료(Evidence)' 구성 팁을 전수하십시오.
  3. **Executive Presence**: 전문가가 경영진 앞에서 본인의 가치를 입증할 수 있도록 세련되고 임팩트 있는 비즈니스 용어를 사용하십시오.
  4. **Empowerment**: 리포트를 읽고 난 후, 전문가로서 자부심을 느끼고 실행 의지가 생기도록 격려 있는 어조를 유지하십시오.

  [REPORT STRUCTURE]
  # 🏆 Professional Growth Strategy: IOSH 글로벌 역량 가이드
  
  ## 🌟 1. 커리어 인사이트 (Executive Summary)
  - 현재 역량 데이터에서 발견된 사용자의 **'강점'**과 글로벌 시장에서의 잠재적 가치를 먼저 조명하십시오.
  - 다음 단계로 나아가기 위한 핵심 브릿지 전략을 한 문단으로 요약하십시오.
  
  ## 🔍 2. 도메인별 성장 로드맵 (Domain Growth Details)
  - **Technical Mastery**: 현재의 기술적 역량을 '실행 증거'로 자산화하는 방법 제안.
  - **Business Integration**: 최고 경영진의 언어로 안전보건 성과를 보고하는 전략 가이드.
  - **Leadership Behaviour**: 조직의 문화를 바꾸는 영향력 있는 리더가 되기 위한 커뮤니케이션 팁.

  ## 💡 3. 전문가 가치 증명 제언 (Strategic Evidence Guide)
  - 향후 감사나 승진 심사 시 본인의 역량을 완벽하게 증명할 수 있는 **'강력한 증거(Proof)'** 예시들을 추천하십시오.

  ## 📈 4. 12개월 커리어 액선 플랜 (Strategic Roadmap)
  - 분기별로 성장을 가시화할 수 있는 실무 과제와 학습 목표를 제시하십시오.

  [진단 데이터]
  ${data}

  ※ 반드시 한국어로 작성하되, 전문가의 파트너로서 예우를 다하는 정중하고 품격 있는 어조를 유지하십시오. 
  마지막에 "--- VERIFIED BY CLAUDE 3.5 SONNET: YOUR CAREER PARTNER ---" 라인을 추가하십시오.`;

    // Try Claude with multiple model variants
    if (process.env.ANTHROPIC_API_KEY) {
        const models = ["claude-3-5-sonnet-20241022", "claude-3-5-sonnet-20240620", "claude-3-haiku-20240307"];

        for (const modelId of models) {
            try {
                console.log(`>>> [CLAUDE] Trying model: ${modelId}`);
                const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
                const msg = await anthropic.messages.create({
                    model: modelId as any,
                    max_tokens: 4000,
                    temperature: 0.3,
                    messages: [{ role: "user", content: prompt }],
                });
                const content = msg.content[0];
                if (content.type === 'text') {
                    console.log(`>>> [SUCCESS] Claude (${modelId}) responded correctly.`);
                    return content.text;
                }
            } catch (err: any) {
                console.error(`Claude ${modelId} failed:`, err.message);
                // Continue to next model
            }
        }
    }

    // OpenAI Fallback if Claude fails
    if (process.env.OPENAI_API_KEY) {
        console.log(">>> [FALLBACK] Using OpenAI GPT-4o-mini");
        try {
            const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
            const response = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.5,
            });
            return response.choices[0].message.content + "\n\n--- NOTE: GENERATED VIA BACKUP ENGINE (OPENAI) ---";
        } catch (err: any) {
            console.error("OpenAI Fallback Failed:", err.message);
        }
    }

    // Google Gemini Fallback
    if (process.env.GOOGLE_API_KEY) {
        console.log(">>> [FALLBACK] Using Google Gemini 2.0-flash");
        try {
            const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
            const result = await model.generateContent(prompt);
            return result.response.text() + "\n\n--- NOTE: GENERATED VIA BACKUP ENGINE (GEMINI) ---";
        } catch (error: any) {
            console.error("Gemini Fallback Failed:", error.message);
        }
    }

    return "죄송합니다. 모든 인공지능 엔진(Claude, OpenAI, Gemini) 호출에 실패했습니다. API 키 설정 및 네트워크 상태를 확인해 주세요.";
}
