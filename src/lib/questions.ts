export interface Question {
    id: string;
    category: "Technical" | "Core" | "Behavioural";
    sub_area: string;
    question: string;
    description: string;
    levels: {
        [key: number]: string;
    };
}

export const IOSH_QUESTIONS: Question[] = [
    {
        id: "T1-1",
        category: "Technical",
        sub_area: "Hazards and Risk Management",
        question: "설계 단계 기반 위험 제거(DfS) 역량",
        description: "설계 및 엔지니어링 단계에서 위험을 원천적으로 제거하거나 대체하는 능력",
        levels: {
            1: "위험보건 설계 원칙의 중요성을 이해하고 있습니다.",
            2: "표준 설계 가이드라인에 따른 위험 요소를 체크합니다.",
            3: "공정 설계 단계에 직접 참여하여 위험 제거(Elimination) 대책을 관철시킵니다.",
            4: "전사적 DfS 가이드라인을 수립하고 설계 자동화 시스템에 안전 로직을 통합합니다."
        }
    },
    {
        id: "T1-2",
        category: "Technical",
        sub_area: "Hazards and Risk Management",
        question: "동태적 위험 관리 및 작업중지 역량",
        description: "실시간으로 변하는 현장의 위험을 식별하고 즉각 조치하는 능력",
        levels: {
            1: "현장의 불안전한 상태를 식별할 수 있습니다.",
            2: "작업 전 안전점검(TBM)을 통해 매일의 위험을 확인합니다.",
            3: "고위험 인지 시 '작업중지권'을 실질적으로 행사하고 재작업 승인 절차를 리딩합니다.",
            4: "실시간 위치 인식 및 IoT 기술을 활용한 지능형 위험 예측 시스템을 운영합니다."
        }
    },
    {
        id: "T2-1",
        category: "Technical",
        sub_area: "Health and Safety Law",
        question: "법적 의무의 실질적 이행 진단 역량",
        description: "중대재해처벌법 등 법 규정의 '실질적 이행' 여부를 내부 감사하는 능력",
        levels: {
            1: "국내 안전보건 관련 법 규정의 종류를 이해합니다.",
            2: "법적 준수사항 리스트를 관리하고 주기적으로 점검합니다.",
            3: "최신 판례를 분석하여 법적 '실질적 이행 의무'의 결함을 진단하고 시스템을 개편합니다.",
            4: "정부 기관의 정책 수립에 참여하거나 산업 표준화 활동을 주도합니다."
        }
    },
    {
        id: "T3-1",
        category: "Technical",
        sub_area: "Accident and Incident Investigation",
        question: "인적 요인(Human Factors) 분석 역량",
        description: "사고 원인을 개인의 실수가 아닌 시스템과 인간의 상호작용 관점에서 분석하는 능력",
        levels: {
            1: "사고 발생 후 즉시 보고 및 초동 조치를 수행할 수 있습니다.",
            2: "5-Why 등을 활용해 직접적인 사고 원인을 도출합니다.",
            3: "인적 오류(Human Error) 배후의 조직적 결함을 분석하는 RCA 모델을 적용합니다.",
            4: "사고 데이터를 기반으로 인간 행동 패턴을 예측하여 선제적 예방 모델을 구축합니다."
        }
    },
    {
        id: "T4-1",
        category: "Technical",
        sub_area: "Occupational Health and Wellbeing",
        question: "정신건강 및 인간공학적 관리 역량",
        description: "신체적 건강뿐 아니라 정신적, 인간공학적 리스크를 관리하는 능력",
        levels: {
            1: "직업병의 종류와 주요 노출 인자를 이해합니다.",
            2: " MSD 관리 및 작업환경 측정을 주기적으로 수행합니다.",
            3: "직무 스트레스 및 마음건강 관리 프로그램을 기획하고 성과를 평가합니다.",
            4: "토탈 웰빙(Total Wellbeing) 전략을 수립하여 임직원의 삶의 질과 생산성을 연계합니다."
        }
    },
    {
        id: "T5-1",
        category: "Technical",
        sub_area: "Environmental Management",
        question: "순환경제 및 탄소중립 연계 역량",
        description: "HSE 활동을 탄소 저감 및 에너지 효율화와 통합하는 능력",
        levels: {
            1: "사업장 내 폐기물 처리 절차를 준수합니다.",
            2: "대기/수질 오염 방지 시설의 운영 상태를 관리합니다.",
            3: "탄소 배출 저감 목표를 HSE 시스템과 연계하여 실질적 감축 성과를 도출합니다.",
            4: "제품 생애주기 평가(LCA) 기반의 친환경 안전 공정을 설계하고 주도합니다."
        }
    },
    {
        id: "C1-1",
        category: "Core",
        sub_area: "Strategy and Business",
        question: "HSE 비즈니스 케이스(Business Case) 수립 역량",
        description: "안전보건 투자의 경제적 가치와 브랜드 가치를 증명하는 능력",
        levels: {
            1: "안전 관리가 기업 이미지에 영향을 미침을 인지합니다.",
            2: "안전 예산을 효율적으로 집행하고 결과를 보고합니다.",
            3: "HSE 투자 대비 효과(ROI)를 데이터로 입증하며 경영진의 의사결정을 지원합니다.",
            4: "안전보건을 기업의 지속가능한 성장을 위한 핵심 경쟁 우위로 전략화합니다."
        }
    },
    {
        id: "C2-1",
        category: "Core",
        sub_area: "Stakeholder Management",
        question: "공급망 전체 안전 리더십 역량",
        description: "사내를 넘어 협력사 및 공급망 전체의 안전 역량을 견인하는 능력",
        levels: {
            1: "협력사의 기본적인 안전 보건 서류를 검토합니다.",
            2: "협력사 안전 현장 점검을 실시하고 미흡 사항을 시정합니다.",
            3: "협력사 상생 안전 모델을 구축하여 협력사의 자율 안전 역량을 육성합니다.",
            4: "글로벌 공급망 표준을 선도하며 지속가능한 산업 생태계 안전망을 구축합니다."
        }
    },
    {
        id: "C3-1",
        category: "Core",
        sub_area: "Data Analysis and Performance",
        question: "예측적 성과 지표(Leading Indicators) 활용 역량",
        description: "후행 지표(사고율)를 넘어 예방적 지표를 통해 리스크를 선제 관리하는 능력",
        levels: {
            1: "사고율 및 재해 지수 등 후행 지표를 집계할 수 있습니다.",
            2: "아차사고 발견 건수 등 기초적인 예방 지표를 모니터링합니다.",
            3: "데이터 분석을 통해 사고 징후를 예측하고 자원을 선제적으로 투입합니다.",
            4: "AI 기반 실시간 예측 분석 대시보드를 구축하여 제로 리스크를 지향합니다."
        }
    },
    {
        id: "B1-1",
        category: "Behavioural",
        sub_area: "Leadership and Management",
        question: "안전 리더십 코칭 및 변화 리딩 역량",
        description: "현장 관리자들이 스스로 안전의 주체가 되도록 영향력을 미치는 능력",
        levels: {
            1: "안전 규칙 준수를 근로자에게 강조합니다.",
            2: "현장 패트롤을 통해 위반 사항을 지도 및 감독합니다.",
            3: "관리자 대상 안전 코칭을 통해 그들의 행동 변화를 성공적으로 이끌어냅니다.",
            4: "조직 내 모든 계층이 안전 리더가 되는 '심리적 안전' 문화를 확산합니다."
        }
    },
    {
        id: "B2-1",
        category: "Behavioural",
        sub_area: "Communication",
        question: "대상별 맞춤형 안전 커뮤니케이션 역량",
        description: "복잡한 안전 기술 정보를 청중의 눈높이에 맞춰 설득력 있게 전달하는 능력",
        levels: {
            1: "안전 교육 자료를 표준안에 따라 작성하고 전달합니다.",
            2: "현장 밀착형 티타임 등을 통해 작업자와 안전 정보를 공유합니다.",
            3: "외국인 근로자나 비전문 경영층 등 대상별 맞춤 소통 전략을 수립/실행합니다.",
            4: "글로벌 세미나 등 대외 채널에서 조직의 안전 성공 사례를 스토리텔링합니다."
        }
    },
    {
        id: "B3-1",
        category: "Behavioural",
        sub_area: "Professional Ethics",
        question: "전문가적 무결성 및 윤리적 리더십",
        description: "이해관계 충돌 상황에서도 안전 윤리 원칙을 고수할 수 있는 역량",
        levels: {
            1: "회사의 윤리 강령과 HSE 전문가 준수 수칙을 이해합니다.",
            2: "투명한 안전 점검 결과 보고 및 데이터 관리를 실천합니다.",
            3: "경영 압박 속에서도 전문가적 무결성을 지키며 최선의 안전 대안을 관철합니다.",
            4: "산업 전반의 안전 윤리 기준을 정립하고 후배들에게 롤모델이 됩니다."
        }
    }
];

export const CATEGORIES = {
    Technical: { icon: "🏗️", title: "Technical (기술 및 실무 기술)" },
    Core: { icon: "🎯", title: "Core (비즈니스 및 핵심 역량)" },
    Behavioural: { icon: "🤝", title: "Behavioural (행동 및 리더십 역량)" }
};

export const LEVEL_NAMES = {
    1: "Understand (이해)",
    2: "Implement (실행)",
    3: "Lead (리드)",
    4: "Innovate (혁신)"
};
