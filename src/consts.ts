export const SITE_TITLE = 'Yunsub';
export const SITE_DESCRIPTION =
	'현장에서 8년간 쌓은 운영 감각 위에 데이터 파이프라인을 얹습니다. 프로젝트와 기록, 그리고 읽고 맡는 것들.';

export const PROFILE = {
	name: '윤섭',
	nameEn: 'Yunsub',
	// 한 줄 직함. 이력서/링크드인과 같은 표현으로 맞추는 게 좋습니다.
	role: '프로그램 개발 · 데이터 파이프라인',
	tagline: '도메인을 아는 사람이 만든 데이터 파이프라인.',
	intro:
		'교육 현장에서 8년간 프로그램을 개발하고 고객을 응대하며, 데이터가 어디서 새고 어디서 막히는지를 몸으로 익혔습니다. 정치외교학으로 사람과 제도를 읽는 법을, 데이터사이언스로 그것을 측정하는 법을 배웠습니다.',
	location: 'Seoul, KR',
	email: 'hello@yunsub.dev',
	phone: '010-8775-5280',
	// public/resume.pdf 를 넣은 뒤 '/resume.pdf' 로 바꾸면 About에 버튼이 나타난다.
	resumeUrl: '',
};

export const SOCIALS = {
	github: 'https://github.com/yunsub',
	linkedin: 'https://www.linkedin.com/in/yunsub',
	email: `mailto:${PROFILE.email}`,
};

export const NAV = [
	{ href: '/', label: 'Home' },
	{ href: '/projects', label: 'Projects' },
	{ href: '/blog', label: 'Blog' },
	{ href: '/notes', label: 'Notes' },
	{ href: '/about', label: 'About' },
];

export const SKILLS = [
	{
		area: 'Data',
		items: ['Python', 'SQL', 'ETL 파이프라인', '데이터 품질 검증'],
	},
	{
		area: 'AI / RAG',
		items: ['임베딩 · 벡터 검색', 'LLM 기반 QA', '평가셋 설계'],
	},
	{
		area: 'Engineering',
		items: ['Git · CI', 'Docker', '배치 자동화'],
	},
	{
		area: 'Domain',
		items: ['교육 프로그램 개발', 'CS 운영 · 응대 설계', '정량 리포팅'],
	},
];

export const CAREER = [
	{
		period: '2024.10 — 현재',
		org: '(주)코에듀지피티',
		role: 'AI Agent Programmer · PM',
		summary:
			'대입 진학 상담을 자동화하는 AI 에이전트를 직접 개발하고, 제품 방향과 일정을 함께 관리합니다.',
		points: [
			'생활기록부 PDF 입력부터 학과 추천 리포트 출력까지 이어지는 파이프라인을 설계·구현했습니다.',
			'약 500명의 사용자가 쓰는 서비스로 운영 중입니다.',
			'수작업 엑셀 가공을 자동화해 주당 10시간 이상 걸리던 데이터 구성 작업을 없앴습니다.',
		],
	},
	{
		period: '8년차 · 재직 중',
		org: 'conshow',
		role: '매니저 — 프로그램 개발 · CS',
		summary: '교육 프로그램을 직접 설계·개발하고, 고객 응대 프로세스를 함께 운영했습니다.',
		points: [
			'담당한 프로그램의 규모(수강생 수, 운영 기수, 매출 기여)를 숫자로 적습니다.',
			'CS 운영에서 개선한 지표(응대 시간, 재문의율, 이탈률)를 적습니다.',
			'현장 문제를 데이터 파이프라인으로 옮긴 계기를 적습니다.',
		],
	},
];

export const EDUCATION = [
	{
		school: '경희대학교',
		major: '정치외교학과',
		note: '주전공',
	},
	{
		school: '경희대학교',
		major: '데이터사이언스',
		note: '복수전공',
	},
];

export const BLOG_TAGS: Record<string, string> = {
	dev: '개발',
	data: '데이터',
	til: 'TIL',
	career: '커리어',
	life: '일상',
};

export const tagLabel = (slug: string) => BLOG_TAGS[slug] ?? slug;

export const NOTE_CATEGORIES = {
	book: { label: '독서', unit: '권' },
	perfume: { label: '향수', unit: '개' },
} as const;

export type NoteCategory = keyof typeof NOTE_CATEGORIES;
