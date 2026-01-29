# 🛡️ IOSH Professional HSE Audit System (V2.1)

> **"글로벌 표준 기반의 전략적 안전보건 성숙도 심사 및 리포팅 시스템"**

이 프로젝트는 **IOSH(Institution of Occupational Safety and Health) Blueprint V2.1** 역량 체계를 기반으로 안전보건 전문가의 실질적 역량을 진단하고, 세계 최고 수준의 AI(Claude 3.5 Sonnet)를 통해 전략 컨설팅 수준의 감사 보고서를 자동 생성하는 엔터프라이즈급 웹 솔루션입니다.

---

## ✨ 핵심 기능 (Key Features)

- **IOSH Blueprint V2.1 완벽 정합**: 12개의 핵심 역량 도메인에 걸친 단계별 성숙도(Maturity) 진단 프로세스.
- **AI 전략 감사 엔진**: Claude 3.5 Sonnet, GPT-4o, Gemini 등 최첨단 AI 모델을 활용한 다각도 역량 분석 및 리스크 평가.
- **프리미엄 비즈니스 리포트**: 맥킨지/BCG 스타일의 세련된 디자인이 적용된 리포트 대시보드.
- **방탄 PDF 생성 시스템**: 한글 깨짐 방지 및 아주 긴 리포트도 안정적으로 저장하는 분할 캡처(Segmented Canvas) 기술 적용.
- **멀티 엔진 폴백(Fallback)**: 특정 API 장애 시 다른 AI 엔진으로 즉시 전환되는 고가용성 분석 서비스.

## 📚 공식 레퍼런스 (Official Reference)

이 시스템은 다음의 공식 IOSH 역량 프레임워크 가이드를 준수하여 개발되었습니다:
- [IOSH Competency Framework Official Guidance](https://iosh.com/guidance-and-resources/professionals/competency-framework)

## 🛠️ 기술 스택 (Tech Stack)

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **AI Integrations**: Anthropic SDK (Claude), OpenAI SDK, Google Generative AI (Gemini)
- **Data Viz**: [Recharts](https://recharts.org/) (Radar Charts)
- **PDF Engine**: [jsPDF](https://github.com/parallax/jsPDF), [html2canvas](https://html2canvas.hertzen.com/)

---

## 🚀 빠른 시작 (Getting Started)

### 1. 프로젝트 설치
```bash
git clone https://github.com/jeromwolf/hseAgent.git
cd hseAgent/frontend
npm install
```

### 2. 환경 변수 설정
`frontend/.env.local` 파일을 생성하고 아래의 API 키를 입력합니다:
```bash
ANTHROPIC_API_KEY=your_claude_key
OPENAI_API_KEY=your_openai_key
GOOGLE_API_KEY=your_gemini_key
```

### 3. 로컬 서버 실행
```bash
npm run dev -- -p 3001
```
브라우저에서 `http://localhost:3001`에 접속합니다.

---

## 🚢 배포 (Deployment)

이 프로젝트는 **Vercel** 플랫폼에 최적화되어 있습니다.

1. GitHub 저장소를 Vercel에 연결합니다.
2. Vercel Dashboard의 **Project Settings > Environment Variables**에서 위의 API 키들을 모두 등록합니다.
3. 배포가 완료되면 전역 URL을 통해 즉시 서비스를 이용할 수 있습니다.

---

## 📝 라이선스 (License)

Copyright © 2026 jeromwolf. This project is licensed under the MIT License.

---
*Created with the **Antigravity AI** Elite Coding Partner.*
