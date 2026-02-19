import { useState, useEffect, useRef, useCallback, createContext, useContext, Children } from "react";

/* ─── Language Context ─── */
const LangContext = createContext("ko");
function useLang() { return useContext(LangContext); }

/* ─── Mobile Hook ─── */
function useIsMobile(bp = 768) {
  const [m, setM] = useState(() => window.innerWidth < bp);
  useEffect(() => {
    const mql = window.matchMedia(`(max-width:${bp - 1}px)`);
    const h = (e) => setM(e.matches);
    mql.addEventListener("change", h);
    return () => mql.removeEventListener("change", h);
  }, [bp]);
  return m;
}

/* ─── Translations ─── */
const i18n = {
  ko: {
    cmdTeam:"팀", cmdAbout:"제품 소개", cmdDemovideo:"데모 영상",
    cmdFeature:"기능 명세", cmdTraction:"트랙션", cmdWhy:"지원 동기",
    cmdContact:"연락처", cmdClear:"초기화",

    countdown:"Vibe Labs Seoul 시작까지",

    homeTagline:"✦ Release First, Validate Fast with Vibe Coding",
    homeBullet1:"• 아이디어에 집착하지 않고 시장에서 검증합니다.",
    homeBullet2:"• 탁상공론보단 배포하고 모니터링합니다.",
    homeBullet3p1:"• PMF를 찾기 위해 실행 ", homeBullet3p2:" 측정 ", homeBullet3p3:" 실행 ", homeBullet3p4:" 측정을 반복합니다.",
    homeGuide:"아래 명령어를 입력하거나, 입력창을 클릭해 선택하세요:",

    aboutShort:"당신의 커리어 벨류를 높이는 AI 에이전트",
    aboutDesc:"이력서를 업로드하면, SPENCER가 12,000+ IT 채용공고를 분석해 TOP 25 포지션을 매칭하고, 연봉 협상 전략과 맞춤 자기소개서까지 생성합니다. 6단계 AI 파이프라인으로 약 10분 만에 종합 커리어 리포트를 제공합니다.",

    founderName:"이승태",

    whyP1:"IT 채용 시장의 정보 비대칭은 심각합니다. 구직자에게 진짜 필요한 건 공고 목록이 아니라, '내 이력서가 어디에 얼마나 맞는지', '연봉 실태는 어떤지', '협상은 어떻게 해야 하는지'입니다. SPENCER는 이 간극을 AI로 무너뜨리는 서비스입니다.",
    whyP2:"바이브 코딩으로 자연어 채용검색 서비스 Jobbot(jobbot.kr)을 만들어 배포했을때, 구직자가 진짜 원하는 건 '검색'이 아니라 '분석'이라는 걸 발견했습니다. SPENCER는 그렇게 시작했습니다.",
    whyP3:"솔직히 말씀드리면, 제품을 빠르게 만드는 건 자신 있지만, 실제 유저 트래픽을 만들고 비즈니스로 작동시킨 경험은 아직 없습니다. 창업에서 가장 어려운 지점이 바로 여기라는 걸 알고 있습니다.",
    whyP4:"그 경험을 압축적으로 쌓는 데 해쉬드바이브랩스의 환경과 네트워크가 결정적이라고 판단했습니다. PMF를 찾을 때까지 빠르게 실험하고 유연하게 피벗할 준비가 되어 있습니다. 프로그램 기간 내에 유료 전환율을 검증하고, 반복 가능한 성장 모델을 만드는 것이 목표입니다.",
    menuTitle:"명령어 선택", menuHint:"↵ 선택",
    placeholder:"명령어를 입력하세요...",
    placeholderNext:"명령어를 입력하세요... 다음 컨텐츠는",
    errorHint:"입력창을 클릭해 명령어를 선택하세요.",

    applicantLabel:"SPENCER · 이승태",
  },
  en: {
    cmdTeam:"Team", cmdAbout:"About", cmdDemovideo:"Demo Video",
    cmdFeature:"Features", cmdTraction:"Traction", cmdWhy:"Why Vibe Labs",
    cmdContact:"Contact", cmdClear:"Clear",

    countdown:"Until Vibe Labs Seoul",

    homeTagline:"✦ Release First, Validate Fast with Vibe Coding",
    homeBullet1:"• We validate ideas in the market, not cling to them.",
    homeBullet2:"• We ship and monitor, rather than theorize.",
    homeBullet3p1:"• To find PMF, we iterate: Execute ", homeBullet3p2:" Measure ", homeBullet3p3:" Execute ", homeBullet3p4:" Measure.",
    homeGuide:"Type a command below, or click the input to select:",

    aboutShort:"Your AI Career Agent — Elevating Your Career Value",
    aboutDesc:"Upload your resume and SPENCER analyzes 12,000+ IT job postings, matches TOP 25 positions, generates salary negotiation strategies and personalized cover letters. A comprehensive career report delivered in ~10 minutes via a 6-step AI pipeline.",

    founderName:"Seungtae Lee",

    whyP1:"The IT job market has a severe information asymmetry problem. What job seekers actually need isn't a list of postings — it's knowing how well their resume fits, what the real salary situation is, and how to negotiate. SPENCER breaks down this gap with AI.",
    whyP2:"When I built and deployed Jobbot (jobbot.kr), a natural language job search service, through vibe coding, I discovered that what job seekers truly want isn't search — it's analysis. That's how SPENCER started.",
    whyP3:"Honestly, I'm confident in building products fast, but I haven't yet generated real user traffic or made a business work. I know this is exactly the hardest part of building a startup.",
    whyP4:"I believe Hashed Vibe Labs' environment and network are critical for compressing that learning curve. I'm ready to experiment fast and pivot flexibly until PMF is found. My goal within the program is to validate paid conversion and build a repeatable growth model.",
    menuTitle:"Select Command", menuHint:"↵ Select",
    placeholder:"Type a command...",
    placeholderNext:"Type a command... Next content is",
    errorHint:"Click the input to select a command.",

    applicantLabel:"SPENCER · Seungtae Lee",
  },
};

function useT() {
  const lang = useLang();
  return (key) => i18n[lang][key] || key;
}

/* ─── Tokens ─── */
const C = {
  bg:"#111111", surface:"#191919", raised:"#212121",
  border:"#2e2e2e", borderHi:"#3a3a3a",
  primary:"#F78547", pBg:"rgba(247,133,71,0.07)",
  green:"#7ad67a", cyan:"#7ad6d6", red:"#d67a7a",
  text:"#e0e0e0", dim:"#a0a0a0", faint:"#6a6a6a",
};
const F = "'PT Mono','Fira Code','IBM Plex Mono','Consolas',monospace";

/* ─── Data ─── */
const CMD_KEYS = [
  { key:"team",      label:"/team",      descKey:"cmdTeam",      n:"[1]" },
  { key:"about",     label:"/about",     descKey:"cmdAbout",     n:"[2]" },
  { key:"demovideo", label:"/demovideo", descKey:"cmdDemovideo", n:"[3]" },
  { key:"feature",   label:"/feature",   descKey:"cmdFeature",   n:"[4]" },
  { key:"traction",  label:"/traction",  descKey:"cmdTraction",  n:"[5]" },
  { key:"why",       label:"/why",       descKey:"cmdWhy",       n:"[6]" },
  { key:"contact",   label:"/contact",   descKey:"cmdContact",   n:"[7]" },
  { key:"clear",     label:"/clear",     descKey:"cmdClear",     n:"[8]" },
];


const VIBE_ASCII = ` ██╗ ██╗ ██╗  ██╗ █████╗ ███████╗██╗  ██╗███████╗██████╗
████████╗██║  ██║██╔══██╗██╔════╝██║  ██║██╔════╝██╔══██╗
╚██╔═██╔╝███████║███████║███████╗███████║█████╗  ██║  ██║
████████╗██╔══██║██╔══██║╚════██║██╔══██║██╔══╝  ██║  ██║
╚██╔═██╔╝██║  ██║██║  ██║███████║██║  ██║███████╗██████╔╝
 ╚═╝ ╚═╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚══════╝╚═════╝
██╗   ██╗██╗██████╗ ███████╗    ██╗      █████╗ ██████╗ ███████╗
██║   ██║██║██╔══██╗██╔════╝    ██║     ██╔══██╗██╔══██╗██╔════╝
██║   ██║██║██████╔╝█████╗      ██║     ███████║██████╔╝███████╗
╚██╗ ██╔╝██║██╔══██╗██╔══╝      ██║     ██╔══██║██╔══██╗╚════██║
 ╚████╔╝ ██║██████╔╝███████╗    ███████╗██║  ██║██████╔╝███████║
  ╚═══╝  ╚═╝╚═════╝ ╚══════╝    ╚══════╝╚═╝  ╚═╝╚═════╝ ╚══════╝`;


/* ═══ Icons ═══ */
const IconMail = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign:"middle", marginRight:"6px" }}>
    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);
const IconPhone = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign:"middle", marginRight:"6px" }}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);
const IconGitHub = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ verticalAlign:"middle", marginRight:"6px" }}>
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

/* ═══ CLI Reveal ═══ */
function CLIReveal({ children, interval = 60 }) {
  const items = Children.toArray(children);
  const [count, setCount] = useState(1);
  const doneRef = useRef(false);
  const elRef = useRef(null);

  useEffect(() => {
    if (doneRef.current) { setCount(items.length); return; }
    if (count >= items.length) { doneRef.current = true; return; }
    const id = setTimeout(() => setCount(c => c + 1), interval);
    return () => clearTimeout(id);
  }, [count, items.length, interval]);

  useEffect(() => {
    const sc = elRef.current?.closest("[data-scroll]");
    if (sc) sc.scrollTop = sc.scrollHeight;
  }, [count]);

  return <div ref={elRef}>{items.slice(0, count)}</div>;
}

/* ═══ SRCL Primitives ═══ */
const Card = ({ title, titleR, children, st }) => {
  const mob = useIsMobile();
  return (
    <div style={{ border:`1px solid ${C.border}`, background:C.surface, marginBottom:"14px", ...st }}>
      {title && (
        <div style={{ padding:mob?"10px 12px":"10px 16px", borderBottom:`1px solid ${C.border}`, background:C.raised, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontSize:"14px", color:C.dim, fontWeight:600, letterSpacing:"0.8px", textTransform:"uppercase" }}>{title}</span>
          {titleR && <span style={{ fontSize:"13px", color:C.faint }}>{titleR}</span>}
        </div>
      )}
      <div style={{ padding:mob?"12px 12px":"16px 18px" }}>{children}</div>
    </div>
  );
};

const Table = ({ hd, rows, w }) => {
  const mob = useIsMobile();
  return (
    <div style={{ border:`1px solid ${C.border}`, background:C.surface, marginBottom:"14px", overflow:"hidden", ...(mob?{overflowX:"auto"}:{}) }}>
      <table style={{ width:"100%", borderCollapse:"collapse", fontFamily:F }}>
        <thead><tr style={{ background:C.raised }}>
          {hd.map((h,i) => <th key={i} style={{ padding:mob?"8px 10px":"10px 14px", fontSize:mob?"13px":"14px", color:C.dim, fontWeight:600, letterSpacing:"0.5px", textTransform:"uppercase", textAlign:"left", borderBottom:`1px solid ${C.border}`, width:mob?undefined:w?.[i] }}>{h}</th>)}
        </tr></thead>
        <tbody>
          {rows.map((r,ri) => <tr key={ri}>
            {r.map((c,ci) => <td key={ci} style={{ padding:mob?"8px 10px":"8px 14px", fontSize:mob?"13px":"15px", color:ci===0?C.text:C.dim, borderBottom:ri<rows.length-1?`1px solid ${C.border}`:"none", width:mob?undefined:w?.[ci] }}>{c}</td>)}
          </tr>)}
        </tbody>
      </table>
    </div>
  );
};

const KV = ({ k, v, link }) => {
  const mob = useIsMobile();
  return (
    <div style={{ display:"flex", flexDirection:mob?"column":"row", gap:mob?"4px":"12px", fontSize:"15px", lineHeight:"2.2" }}>
      <span style={{ color:C.dim, minWidth:mob?"auto":"120px" }}>{k}</span>
      {link ? (
        <a href={v.startsWith("http")?v:`https://${v}`} target="_blank" rel="noopener noreferrer" style={{ color:C.cyan, textDecoration:"underline", cursor:"pointer" }}>{v}</a>
      ) : (
        <span style={{ color:C.text }}>{v}</span>
      )}
    </div>
  );
};


/* ═══ Deadline Countdown ═══ */
function Countdown() {
  const t = useT();
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const id = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(id); }, []);
  const deadline = new Date("2026-03-03T00:00:00+09:00").getTime();
  const diff = Math.max(0, deadline - now);
  const d = Math.ceil(diff / 86400000);
  return (
    <span>
      <span style={{ color:C.dim, fontSize:"14px" }}>{t("countdown")} </span>
      <span style={{ color:C.primary, fontSize:"14px", fontWeight:700 }}>D-{d}</span>
    </span>
  );
}

/* ═══ Section Renderers ═══ */

function HomeSection() {
  const t = useT();
  const mob = useIsMobile();
  return <CLIReveal interval={40}>
    <div style={{ margin:"16px 0 10px", fontFamily:F }}>
      <span style={{ color:C.faint, fontSize:"16px" }}>{"// "}</span>
      <span style={{ color:"#4deeea", fontSize:"16px", letterSpacing:"3px", fontWeight:600 }}>APPLY FOR</span>
    </div>
    {mob
      ? <div style={{ color:C.primary, fontSize:"18px", fontWeight:700, margin:"0 0 20px", letterSpacing:"1px" }}>HASHED VIBE LABS</div>
      : <pre style={{ color:C.primary, fontSize:"10.5px", lineHeight:"1.15", fontFamily:F, margin:"0 0 20px", opacity:0.85, letterSpacing:"0.5px" }}>{VIBE_ASCII}</pre>
    }
    <div style={{ color:C.primary, fontSize:"16px", margin:"0 0 22px" }}>
      —— SPENCER applying for 1st Batch 2026: Seoul ——
    </div>
    <div style={{ border:`1px solid ${C.primary}40`, borderRadius:"2px", padding:mob?"12px 14px":"14px 18px", background:C.pBg, marginBottom:"22px" }}>
      <span style={{ color:C.primary, fontSize:"16px" }}>{t("homeTagline")}</span>
    </div>
    <div style={{ fontSize:"16px", lineHeight:"2.2", color:C.text, marginBottom:"22px" }}>
      <div>{t("homeBullet1")}</div>
      <div>{t("homeBullet2")}</div>
      <div>{t("homeBullet3p1")}{">"}{t("homeBullet3p2")}{">"}{t("homeBullet3p3")}{">"}{t("homeBullet3p4")}</div>
    </div>
    <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:"16px" }}>
      <div style={{ color:C.dim, fontSize:"14px", marginBottom:"12px" }}>{t("homeGuide")}</div>
      <div style={{ display:"grid", gridTemplateColumns:mob?"1fr":"1fr 1fr", gap:"2px 0" }}>
        {CMD_KEYS.filter(c=>c.key!=="clear").map(c => (
          <div key={c.key} style={{ fontSize:"15px", lineHeight:"2.2" }}>
            <span style={{ color:C.primary }}>{c.n} </span>
            <span style={{ color:C.cyan }}>{c.label}</span>
            <span style={{ color:C.faint }}> {t(c.descKey)}</span>
          </div>
        ))}
      </div>
    </div>
  </CLIReveal>;
}

function AboutSection() {
  const t = useT();
  return <CLIReveal>
    <Card title="applicant · spencer">
      <a href="https://spencer.ai.kr" target="_blank" rel="noopener noreferrer" style={{ color:C.primary, fontWeight:700, fontSize:"20px", marginBottom:"10px", display:"block", textDecoration:"none" }}>SPENCER ↗</a>
      <div style={{ color:C.text, fontSize:"16px", marginBottom:"12px" }}>{t("aboutShort")}</div>
      <div style={{ color:C.dim, fontSize:"15px", lineHeight:"2" }}>
        {t("aboutDesc")}
      </div>
    </Card>
    <Card title="info">
      <KV k="Live URL" v="spencer.ai.kr" link />
      <KV k="First Commit" v="2026.01.28" />
      <KV k="Stage" v="MVP Deployed (2026.02.13)" />
      <KV k="Location" v="Seoul, South Korea" />
      <KV k={<><IconGitHub />Repo</>} v="github.com/stleeqwe/spencer" link />
    </Card>
  </CLIReveal>;
}

function TeamSection() {
  const t = useT();
  const lang = useLang();
  const CAREER = lang === "ko" ? [
    ["2023.09–2025.12","메리티움","QA Engineer","금융권 결제시스템 QA (신한·농협·KB·KT)"],
    ["2014.01–2016.12","티맥스소프트","기술영업","SW 솔루션 B2B/공공사업"],
    ["2011.08–2012.02","AhnLab","QA Intern","SW 솔루션 품질테스트"],
  ] : [
    ["2023.09–2025.12","Meritium","QA Engineer","Fintech Payment QA (Shinhan·NH·KB·KT)"],
    ["2014.01–2016.12","TmaxSoft","Tech Sales","Enterprise SW B2B Solutions"],
    ["2011.08–2012.02","AhnLab","QA Intern","SW Solution Quality Testing"],
  ];
  const PROJECTS = lang === "ko" ? [
    ["JobBot","자연어 채용검색 서비스","Python · FastAPI · Gemini API · Cloud Run","jobbot.kr","https://jobbot.kr"],
    ["5SEC","랜덤 화상채팅 iOS 앱","Swift · Firebase · Agora SDK · StoreKit 2","TestFlight",null],
    ["hyperai","멀티 에이전트 AI 시스템","Python · Claude · GPT · Gemini · Grok","GitHub","https://github.com/stleeqwe/hyperai"],
  ] : [
    ["JobBot","NL Job Search Service","Python · FastAPI · Gemini API · Cloud Run","jobbot.kr","https://jobbot.kr"],
    ["5SEC","Random Video Chat iOS App","Swift · Firebase · Agora SDK · StoreKit 2","TestFlight",null],
    ["hyperai","Multi-Agent AI System","Python · Claude · GPT · Gemini · Grok","GitHub","https://github.com/stleeqwe/hyperai"],
  ];
  const mob = useIsMobile();
  return <CLIReveal>
    <div style={{ display:"flex", gap:mob?"8px":"16px", marginBottom:"14px" }}>
      {[
        { k:lang==="ko"?"인원":"Members", v:"1" },
        { k:lang==="ko"?"풀타임":"Full-time", v:"1" },
        { k:"Social", v:<a href="https://github.com/stleeqwe" target="_blank" rel="noopener noreferrer" style={{ color:C.cyan, textDecoration:"underline" }}>GitHub ↗</a> },
      ].map((item,i) => (
        <div key={i} style={{ flex:1, padding:mob?"10px 10px":"12px 16px", border:`1px solid ${C.border}`, background:C.surface }}>
          <div style={{ color:C.faint, fontSize:"12px", textTransform:"uppercase", letterSpacing:"0.5px" }}>{item.k}</div>
          <div style={{ color:C.primary, fontSize:"20px", fontWeight:700, marginTop:"4px" }}>{item.v}</div>
        </div>
      ))}
    </div>
    <Card title="founder · spencer">
      <div style={{ display:"flex", alignItems:"center", gap:"16px", marginBottom:"14px" }}>
        <div style={{ width:"48px", height:"48px", border:`1px solid ${C.border}`, background:C.raised, display:"flex", alignItems:"center", justifyContent:"center", color:C.primary, fontSize:"15px", fontWeight:700 }}>ST</div>
        <div>
          <div style={{ color:C.text, fontWeight:600, fontSize:"18px" }}>{t("founderName")}</div>
          <div style={{ color:C.dim, fontSize:"15px" }}>Founder · Full-time</div>
        </div>
      </div>
      <KV k="Born" v="1988.10.03" />
      <KV k="Edu" v={lang==="ko"?"숭실대학교 컴퓨터공학부":"Soongsil Univ. Computer Science"} />
      <KV k={<><IconMail />Email</>} v="pukaworks@gmail.com" />
      <KV k={<><IconGitHub />GitHub</>} v="github.com/stleeqwe" link />
    </Card>
    <Card title={lang==="ko"?"경력 · IT 직군":"career · IT"} titleR={lang==="ko"?"총 5년 8개월":"5y 8m total"}>
      {CAREER.map((c,i) => (
        <div key={i} style={{ borderBottom:i<CAREER.length-1?`1px solid ${C.border}`:"none", padding:"8px 0" }}>
          <div style={{ display:"flex", flexDirection:mob?"column":"row", justifyContent:"space-between", alignItems:mob?"flex-start":"center" }}>
            <div>
              <span style={{ color:C.text, fontWeight:600, fontSize:"15px" }}>{c[1]}</span>
              <span style={{ color:C.dim, fontSize:"14px" }}> · {c[2]}</span>
            </div>
            <span style={{ color:C.faint, fontSize:"13px" }}>{c[0]}</span>
          </div>
          <div style={{ color:C.faint, fontSize:"14px", marginTop:"2px" }}>{c[3]}</div>
        </div>
      ))}
    </Card>
    <Card title={lang==="ko"?"사이드 프로젝트":"side projects"}>
      {PROJECTS.map((p,i) => (
        <div key={i} style={{ borderBottom:i<PROJECTS.length-1?`1px solid ${C.border}`:"none", padding:"8px 0" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span style={{ color:C.primary, fontWeight:600, fontSize:"15px" }}>{p[0]}</span>
            {p[4] ? (
              <a href={p[4]} target="_blank" rel="noopener noreferrer" style={{ color:C.cyan, fontSize:"13px", textDecoration:"underline" }}>{p[3]}</a>
            ) : (
              <span style={{ color:C.cyan, fontSize:"13px" }}>{p[3]}</span>
            )}
          </div>
          <div style={{ color:C.text, fontSize:"14px" }}>{p[1]}</div>
          <div style={{ color:C.faint, fontSize:"13px", marginTop:"2px" }}>{p[2]}</div>
        </div>
      ))}
    </Card>
  </CLIReveal>;
}

function DemoVideoSection() {
  const mob = useIsMobile();
  const SCREENSHOTS = [
    { src:"/ss-1.png", label:"프로필 분석" },
    { src:"/ss-2.png", label:"시장 분석" },
    { src:"/ss-3.png", label:"에이전트 분석" },
    { src:"/ss-4.png", label:"추천 공고" },
    { src:"/ss-5.png", label:"추천 공고 목록" },
    { src:"/ss-6.png", label:"협상 가이드" },
    { src:"/ss-7.png", label:"커리어 인사이트" },
    { src:"/ss-8.png", label:"Ask SPENCER" },
    { src:"/ss-9.png", label:"기업 분석" },
    { src:"/ss-10.png", label:"포지션" },
    { src:"/ss-11.png", label:"적합도" },
    { src:"/ss-12.png", label:"지원 전략" },
    { src:"/ss-13.png", label:"맞춤 지원서" },
    { src:"/ss-14.png", label:"맞춤 지원서 상세" },
  ];
  const [open, setOpen] = useState(false);
  const [popupIdx, setPopupIdx] = useState(-1);
  const touchRef = useRef(null);
  const popup = popupIdx >= 0 ? SCREENSHOTS[popupIdx] : null;
  const goPrev = () => setPopupIdx(i => (i - 1 + SCREENSHOTS.length) % SCREENSHOTS.length);
  const goNext = () => setPopupIdx(i => (i + 1) % SCREENSHOTS.length);
  const onTouchStart = (e) => { touchRef.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchRef.current === null) return;
    const dx = e.changedTouches[0].clientX - touchRef.current;
    touchRef.current = null;
    if (dx > 50) goPrev();
    else if (dx < -50) goNext();
  };
  return <>
    <a href="https://youtu.be/9KXnv_6cNFA" target="_blank" rel="noopener noreferrer" style={{ textDecoration:"none", display:"block" }}>
      <div style={{ border:`1px solid ${C.border}`, marginBottom:"14px", cursor:"pointer", transition:"border-color 0.15s" }}>
        <div style={{ height:mob?"180px":"240px", background:`url('/demo-thumbnail.png') center/cover no-repeat` }} />
        <div style={{ padding:"10px 16px", borderTop:`1px solid ${C.border}`, background:C.surface, display:"flex", justifyContent:"space-between" }}>
          <span style={{ color:C.dim, fontSize:"14px" }}>SPENCER Demo — AI Career Report in Action</span>
          <span style={{ color:C.cyan, fontSize:"14px" }}>YouTube ↗</span>
        </div>
      </div>
    </a>
    <div
      onClick={() => setOpen(!open)}
      style={{ border:`1px solid ${C.border}`, padding:"10px 16px", marginTop:"4px", cursor:"pointer", background:C.surface, display:"flex", justifyContent:"space-between", alignItems:"center" }}
    >
      <span style={{ color:C.dim, fontSize:"14px" }}>Screenshots ({SCREENSHOTS.length})</span>
      <span style={{ color:C.cyan, fontSize:"14px" }}>{open ? "▲ 접기" : "▼ 펼치기"}</span>
    </div>
    {open && (
      <div style={{ display:"grid", gridTemplateColumns:mob?"repeat(2, 1fr)":"repeat(4, 1fr)", gap:"8px", marginTop:"8px" }}>
        {SCREENSHOTS.map((s,i) => (
          <div key={i} onClick={() => setPopupIdx(i)} style={{ border:`1px solid ${C.border}`, background:C.surface, overflow:"hidden", cursor:"pointer" }}>
            <img src={s.src} alt={s.label} style={{ width:"100%", height:mob?"100px":"80px", objectFit:"cover", display:"block" }} />
            <div style={{ padding:"4px 8px", borderTop:`1px solid ${C.border}`, fontSize:mob?"12px":"11px", color:C.dim, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{s.label}</div>
          </div>
        ))}
      </div>
    )}
    {popup && (
      <div onClick={() => setPopupIdx(-1)} onKeyDown={e => { if(e.key==="ArrowLeft") goPrev(); if(e.key==="ArrowRight") goNext(); if(e.key==="Escape") setPopupIdx(-1); }} tabIndex={0} ref={el => el && el.focus()} style={{ position:"fixed", top:0, left:0, right:0, bottom:0, background:"rgba(0,0,0,0.85)", zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", outline:"none" }}>
        {mob ? (
          <div onClick={e => e.stopPropagation()} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} style={{ display:"flex", flexDirection:"column", alignItems:"center", maxWidth:"94vw" }}>
            <img src={popup.src} alt={popup.label} style={{ maxWidth:"94vw", maxHeight:"75vh", display:"block", border:`1px solid ${C.border}` }} />
            <div style={{ width:"100%", padding:"8px 16px", background:C.surface, borderTop:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ color:C.dim, fontSize:"14px" }}>{popupIdx + 1} / {SCREENSHOTS.length} — {popup.label}</span>
              <span onClick={() => setPopupIdx(-1)} style={{ color:C.cyan, fontSize:"14px", cursor:"pointer" }}>✕ 닫기</span>
            </div>
            <div style={{ display:"flex", gap:"32px", marginTop:"12px" }}>
              <div onClick={goPrev} style={{ color:C.cyan, fontSize:"32px", cursor:"pointer", padding:"8px 16px", userSelect:"none", background:C.surface, border:`1px solid ${C.border}`, borderRadius:"4px" }}>‹</div>
              <div onClick={goNext} style={{ color:C.cyan, fontSize:"32px", cursor:"pointer", padding:"8px 16px", userSelect:"none", background:C.surface, border:`1px solid ${C.border}`, borderRadius:"4px" }}>›</div>
            </div>
          </div>
        ) : (
          <div style={{ display:"flex", alignItems:"center", gap:"12px" }} onClick={e => e.stopPropagation()}>
            <div onClick={goPrev} style={{ color:C.cyan, fontSize:"32px", cursor:"pointer", padding:"8px", userSelect:"none" }}>‹</div>
            <div style={{ maxWidth:"80vw", maxHeight:"90vh", position:"relative" }}>
              <img src={popup.src} alt={popup.label} style={{ maxWidth:"80vw", maxHeight:"85vh", display:"block", border:`1px solid ${C.border}` }} />
              <div style={{ padding:"8px 16px", background:C.surface, borderTop:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ color:C.dim, fontSize:"14px" }}>{popupIdx + 1} / {SCREENSHOTS.length} — {popup.label}</span>
                <span onClick={() => setPopupIdx(-1)} style={{ color:C.cyan, fontSize:"14px", cursor:"pointer" }}>✕ 닫기</span>
              </div>
            </div>
            <div onClick={goNext} style={{ color:C.cyan, fontSize:"32px", cursor:"pointer", padding:"8px", userSelect:"none" }}>›</div>
          </div>
        )}
      </div>
    )}
  </>;
}

function FeatureSection() {
  const lang = useLang();
  const mob = useIsMobile();

  const PIPELINE = lang === "ko" ? [
    { step:"01", name:"이력서 분석", model:"Gemini 3.0 Pro", desc:"이력서 파싱 → 기술 스택 추출 → 경력 레벨 판별 → 적정 연봉 산출 → 커리어 방향 분석" },
    { step:"02", name:"시장 인텔리전스", model:"Gemini 3.0 Flash", desc:"Google Search Grounding으로 실시간 채용 동향 수집 + pgvector DB에서 유사 포지션 100개 통계 분석 (스킬 갭, 연봉 분포)" },
    { step:"03", name:"포지션 매칭", model:"Pro + Flash", desc:"3-Query 벡터 검색 (앵커 + LLM 확장 2개) → 60개 후보 → 2-Factor 스코어링 → TOP 25 선별" },
    { step:"04", name:"기업 심층 분석", model:"Gemini 3.0 Flash", desc:"6개 소스 (Catch · DART · Wanted · Jobplanet · 네이버뉴스 · Google Search) 크로스 검증 → 연봉 실태, 기업 문화, 리스크 분석" },
    { step:"05", name:"전략 수립", model:"Gemini 3.0 Flash", desc:"Step 1-4 데이터 종합 → 25개 포지션별 연봉 협상 전략, 어필 포인트, 리스크 대응, 커리어 시나리오 생성" },
    { step:"06", name:"리포트 생성", model:"Gemini 3.0 Pro", desc:"7개 섹션 종합 리포트: 프로필 요약 → 시장 브리핑 → TOP 3 → 추천 22건 → 협상 가이드 → 인사이트 → AI 챗" },
  ] : [
    { step:"01", name:"Resume Analysis", model:"Gemini 3.0 Pro", desc:"Resume parsing → Tech stack extraction → Career level detection → Fair salary estimation → Career direction analysis" },
    { step:"02", name:"Market Intelligence", model:"Gemini 3.0 Flash", desc:"Real-time hiring trends via Google Search Grounding + Statistical analysis of 100 similar positions from pgvector DB (skill gaps, salary distribution)" },
    { step:"03", name:"Position Matching", model:"Pro + Flash", desc:"3-Query vector search (anchor + 2 LLM expansions) → 60 candidates → 2-Factor scoring → TOP 25 selection" },
    { step:"04", name:"Company Deep Dive", model:"Gemini 3.0 Flash", desc:"6-source cross-validation (Catch · DART · Wanted · Jobplanet · Naver News · Google Search) → Salary reality, culture, risk analysis" },
    { step:"05", name:"Strategy Development", model:"Gemini 3.0 Flash", desc:"Synthesize Steps 1-4 → Per-position salary negotiation, appeal points, risk mitigation, career scenarios" },
    { step:"06", name:"Report Generation", model:"Gemini 3.0 Pro", desc:"7-section report: Profile → Market Brief → TOP 3 → 22 Recommendations → Negotiation Guide → Insights → AI Chat" },
  ];

  const FEATURES_DETAIL = lang === "ko" ? [
    { name:"이력서 구조화 분석", items:[
      "PDF/DOC 이력서 + GitHub URL 동시 분석",
      "기술 스택을 10점 만점 스킬 스코어로 정량화",
      "경력 레벨 자동 판별 (주니어 / 미드 / 시니어 / 리드 / 임원)",
      "적정 연봉 산출 (시장 데이터 + 경력 수준 기반)",
      "5가지 커리어 방향 벡터 추출",
    ]},
    { name:"TOP 25 매칭 엔진", items:[
      "pgvector 768차원 임베딩 코사인 유사도 검색",
      "3-Query 전략: 규칙 기반 앵커 + LLM 확장 2개 (가중 블렌드 0.55/0.25/0.20)",
      "2-Factor 스코어링: salary_upside × growth_fit (경력 레벨별 동적 가중치)",
      "4차원 평가: tech_fit · salary_upside · growth_fit · market_stability",
      "Hard Gate: 경력 과소/과다, tech_fit D등급, 연봉 하한선 즉시 제외",
      "Pool-Relative z-score 정규화 → N(72, σ) 분포",
      "동일 기업 3개 상한 + v3b 복합 중복 제거 (FP 0.3%)",
    ]},
    { name:"연봉 인텔리전스", items:[
      "5개 데이터 소스: Wanted · Catch · Jobplanet · DART · Google Search",
      "Company Salary Index (CSI): 기업별 연봉 보정 계수 0.70~1.70",
      "3단계 연봉 추정: 규칙 기반 티어 → 스크래퍼 보정 → CSI 적용",
      "TOP 3 포지션별 협상 레인지 + walk_away_threshold 산출",
      "포지션별 협상 레버: 스톡옵션 · 복리후생 · 원격근무 전략 포함",
    ]},
    { name:"AI 자기소개서 생성", items:[
      "공고별 요구사항 ↔ 이력서 실적 1:1 매핑",
      "기업 규모별 톤 자동 조정 (대기업=격식 / 스타트업=간결 / 외국계=임팩트)",
      "구조: 수신·발신 → 지원동기 → 핵심역량 2개 → 마무리",
      "Step 3 적합도 + Step 4 기업분석 데이터 크로스 활용",
      "세션별 캐싱으로 중복 생성 방지",
    ]},
  ] : [
    { name:"Resume Structured Analysis", items:[
      "Simultaneous PDF/DOC resume + GitHub URL analysis",
      "Tech stack quantified as 10-point skill scores",
      "Auto career level detection (Junior / Mid / Senior / Lead / Executive)",
      "Fair salary estimation (market data + career level based)",
      "5 career direction vectors extracted",
    ]},
    { name:"TOP 25 Matching Engine", items:[
      "pgvector 768-dim embedding cosine similarity search",
      "3-Query strategy: rule-based anchor + 2 LLM expansions (weighted blend 0.55/0.25/0.20)",
      "2-Factor scoring: salary_upside × growth_fit (level-dependent dynamic weights)",
      "4-dimensional eval: tech_fit · salary_upside · growth_fit · market_stability",
      "Hard Gates: experience under/over-qual, tech_fit D-grade, salary floor exclusion",
      "Pool-Relative z-score normalization → N(72, σ) distribution",
      "Per-company 3-cap + v3b composite dedup (FP 0.3%)",
    ]},
    { name:"Salary Intelligence", items:[
      "5 data sources: Wanted · Catch · Jobplanet · DART · Google Search",
      "Company Salary Index (CSI): per-company multiplier 0.70~1.70",
      "3-phase estimation: Rule-based tier → Scraper refinement → CSI applied",
      "TOP 3 negotiation range + walk_away_threshold computed",
      "Per-position levers: stock options · benefits · remote work strategy",
    ]},
    { name:"AI Cover Letter Generation", items:[
      "Job requirements ↔ Resume achievements 1:1 mapping",
      "Auto tone by company size (Enterprise=formal / Startup=concise / Foreign=impact)",
      "Structure: Header → Motivation → 2 Core Competencies → Closing",
      "Cross-leverages Step 3 fitness + Step 4 company deep dive",
      "Per-session caching prevents redundant generation",
    ]},
  ];

  const SCORING_WEIGHTS = [
    { level:lang==="ko"?"주니어 (≤3년)":"Junior (≤3yr)", sal:"35%", growth:"65%" },
    { level:lang==="ko"?"미드 (3-7년)":"Mid (3-7yr)", sal:"50%", growth:"50%" },
    { level:lang==="ko"?"시니어 (7-12년)":"Senior (7-12yr)", sal:"65%", growth:"35%" },
    { level:"Staff+ (>12yr)", sal:"70%", growth:"30%" },
  ];

  const REPORT_SECTIONS = lang === "ko" ? [
    { n:"01", name:"프로필 요약", desc:"시장 포지션 · 적정 연봉 · 핵심 역량 · 커리어 방향" },
    { n:"02", name:"시장 브리핑", desc:"채용 동향 · 스킬 수요 · 연봉 시세 · 핫 섹터" },
    { n:"03", name:"TOP 3 상세 분석", desc:"기업 분석 + 적합도 + 협상 레인지 + 성장 시나리오" },
    { n:"04", name:"추천 공고 22건", desc:"순위별 기업 · 포지션 · 핵심 포인트 요약 테이블" },
    { n:"05", name:"협상 가이드", desc:"코호트 연봉 분포 · 협상 레버 · 타이밍 전략" },
    { n:"06", name:"커리어 인사이트", desc:"2-3년 전망 · 스킬 개발 우선순위 · 도메인 전환 기회" },
    { n:"07", name:"Ask SPENCER", desc:"RAG 기반 AI 후속 상담 (최대 20턴)" },
  ] : [
    { n:"01", name:"Profile Summary", desc:"Market position · Fair salary · Core strengths · Career direction" },
    { n:"02", name:"Market Briefing", desc:"Hiring trends · Skill demand · Salary conditions · Hot sectors" },
    { n:"03", name:"TOP 3 Deep Analysis", desc:"Company analysis + Fitness + Negotiation range + Growth scenarios" },
    { n:"04", name:"22 Recommendations", desc:"Ranked companies · Positions · Key insights summary table" },
    { n:"05", name:"Negotiation Guide", desc:"Cohort salary distribution · Negotiation levers · Timing strategy" },
    { n:"06", name:"Career Insights", desc:"2-3yr outlook · Skill dev priorities · Domain transition opportunities" },
    { n:"07", name:"Ask SPENCER", desc:"RAG-powered AI follow-up consultation (max 20 turns)" },
  ];

  const DATA_SOURCES = [
    { src:"JobKorea", count:"~7,700", method:"AJAX API + Session Cookie" },
    { src:"Wanted", count:"~2,800", method:"REST API v4" },
    { src:"Jumpit", count:"~1,200", method:"REST API" },
    { src:"Zighang", count:"~4,400", method:"REST API + TipTap Parser" },
  ];

  const HARD_GATES = lang === "ko" ? [
    "경력 과소 → 즉시 제외 (주니어: 1.5년, 그 외: 1.0년 갭)",
    "경력 과다 → 즉시 제외 (일반: 3년, 리드: 5년, 임원: 7년 갭)",
    "tech_fit D등급 → TOP 25 제외 (기술 스택 근본 불일치)",
    "연봉 하한선 → job_max < 현재연봉 × 0.9 시 제외",
  ] : [
    "Experience Under-qual → Immediate exclusion (Junior: 1.5yr, Others: 1.0yr gap)",
    "Experience Over-qual → Immediate exclusion (General: 3yr, Lead: 5yr, Exec: 7yr gap)",
    "tech_fit D-grade → TOP 25 exclusion (fundamental tech mismatch)",
    "Salary Floor → Excluded if job_max < current_salary × 0.9",
  ];

  const METRICS = lang === "ko" ? [
    { k:"총 채용공고", v:"12,000+" }, { k:"분석 소요시간", v:"~10분" }, { k:"분석당 비용", v:"~₩1,500" },
    { k:"매칭 정밀도", v:"TOP 25/60" }, { k:"벡터 차원", v:"768-dim" }, { k:"API 엔드포인트", v:"25개" },
  ] : [
    { k:"Total Postings", v:"12,000+" }, { k:"Analysis Time", v:"~10 min" }, { k:"Cost / Analysis", v:"~₩1,500" },
    { k:"Match Precision", v:"TOP 25/60" }, { k:"Vector Dims", v:"768-dim" }, { k:"API Endpoints", v:"25" },
  ];

  return <CLIReveal>
    {/* Key Metrics */}
    <Card title="key metrics">
      <div style={{ display:"grid", gridTemplateColumns:mob?"1fr 1fr":"1fr 1fr 1fr", gap:"0" }}>
        {METRICS.map((m,i) => {
          const cols = mob ? 2 : 3;
          return (
            <div key={i} style={{ padding:"10px 0", borderBottom:i<METRICS.length-cols?`1px solid ${C.border}`:"none", borderRight:(i%cols!==cols-1)?`1px solid ${C.border}`:"none", paddingLeft:(i%cols!==0)?"16px":"0" }}>
              <div style={{ color:C.faint, fontSize:"12px", textTransform:"uppercase", letterSpacing:"0.5px" }}>{m.k}</div>
              <div style={{ color:C.primary, fontSize:"20px", fontWeight:700, marginTop:"4px" }}>{m.v}</div>
            </div>
          );
        })}
      </div>
    </Card>

    {/* 6-Step Pipeline */}
    <Card title="6-step ai pipeline" titleR="~10 min end-to-end">
      {PIPELINE.map((p,i) => (
        <div key={i} style={{ borderBottom:i<PIPELINE.length-1?`1px solid ${C.border}`:"none", padding:"12px 0" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"6px", flexWrap:"wrap" }}>
            <span style={{ color:C.primary, fontWeight:700, fontSize:"13px", background:C.pBg, border:`1px solid ${C.primary}25`, width:"32px", height:"24px", display:"inline-flex", alignItems:"center", justifyContent:"center" }}>{p.step}</span>
            <span style={{ color:C.text, fontWeight:600, fontSize:"15px" }}>{p.name}</span>
            <span style={{ color:C.faint, fontSize:"12px", marginLeft:"auto" }}>{p.model}</span>
          </div>
          <div style={{ color:C.dim, fontSize:"14px", lineHeight:"1.8", paddingLeft:mob?"0":"44px" }}>{p.desc}</div>
        </div>
      ))}
    </Card>

    {/* Core Features Detail */}
    {FEATURES_DETAIL.map((f,fi) => (
      <Card key={fi} title={`feature ${String(fi+1).padStart(2,"0")}`} titleR={f.name}>
        <div style={{ marginBottom:"12px" }}>
          <span style={{ color:C.text, fontWeight:700, fontSize:"16px" }}>{f.name}</span>
        </div>
        {f.items.map((item,ii) => (
          <div key={ii} style={{ display:"flex", gap:"10px", fontSize:"14px", lineHeight:"2.2", color:C.dim }}>
            <span style={{ color:C.primary, flexShrink:0 }}>▸</span>
            <span>{item}</span>
          </div>
        ))}
      </Card>
    ))}

    {/* 2-Factor Scoring Model */}
    <Card title="2-factor scoring model" titleR="salary_upside × growth_fit">
      <div style={{ marginBottom:"14px" }}>
        <code style={{ color:C.cyan, background:C.raised, padding:"4px 8px", fontSize:"13px", display:"inline-block" }}>
          overall_score = salary_upside × W_sal + growth_fit × W_growth + penalties
        </code>
      </div>
      <Table
        hd={[lang==="ko"?"경력 레벨":"Career Level","salary_upside","growth_fit"]}
        rows={SCORING_WEIGHTS.map(s=>[s.level,s.sal,s.growth])}
        w={["180px","120px","120px"]}
      />
      <div style={{ marginTop:"10px" }}>
        <div style={{ color:C.faint, fontSize:"13px", textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:"8px" }}>Hard Gates</div>
        {HARD_GATES.map((gate,i) => (
          <div key={i} style={{ display:"flex", gap:"10px", fontSize:"13px", lineHeight:"2", color:C.dim }}>
            <span style={{ color:C.red, flexShrink:0 }}>✕</span>
            <span>{gate}</span>
          </div>
        ))}
      </div>
    </Card>

    {/* Job Data Pipeline */}
    <Card title="job data pipeline" titleR="4 sources · 12,000+ active">
      <Table
        hd={["Source",lang==="ko"?"공고 수":"Count",lang==="ko"?"수집 방식":"Method"]}
        rows={DATA_SOURCES.map(d=>[d.src,d.count,d.method])}
        w={["120px","80px"]}
      />
      <div style={{ marginTop:"10px", color:C.faint, fontSize:"13px", textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:"8px" }}>
        {lang==="ko"?"처리 파이프라인":"Processing Pipeline"}
      </div>
      {(lang==="ko" ? [
        "수집 → Playwright 스크린샷 → Cloud Vision OCR → Gemini Flash 구조화",
        "v3b 복합 중복 제거: Token Jaccard + Jaro-Winkler + Role Veto (FP 0.3%)",
        "Gemini Embedding 768차원 벡터 생성 → IVFFlat 인덱스 (probes=10)",
      ] : [
        "Collection → Playwright Screenshot → Cloud Vision OCR → Gemini Flash Structuring",
        "v3b Composite Dedup: Token Jaccard + Jaro-Winkler + Role Veto (FP 0.3%)",
        "Gemini Embedding 768-dim vectors → IVFFlat index (probes=10)",
      ]).map((step,i) => (
        <div key={i} style={{ display:"flex", gap:"10px", fontSize:"13px", lineHeight:"2", color:C.dim }}>
          <span style={{ color:C.green, flexShrink:0 }}>{i+1}.</span>
          <span>{step}</span>
        </div>
      ))}
    </Card>

    {/* Company Salary Intelligence */}
    <Card title="company salary intelligence" titleR="CSI: 0.70 — 1.70">
      <div style={{ color:C.dim, fontSize:"14px", lineHeight:"2", marginBottom:"10px" }}>
        {lang==="ko"
          ?"기업별 연봉 보정 계수 (Company Salary Index)를 5개 소스에서 산출합니다."
          :"Company Salary Index computed from 5 data sources per company."}
      </div>
      <Table
        hd={[lang==="ko"?"우선순위":"Priority",lang==="ko"?"소스":"Source",lang==="ko"?"신뢰도":"Confidence"]}
        rows={[
          ["1","Wanted (NPS Salary)","HIGH"],
          ["2","Catch (Avg Salary)","HIGH"],
          ["3","Jobplanet (Salary Range)","HIGH"],
          ["4","DART (Revenue / Headcount)","MEDIUM"],
          ["5",lang==="ko"?"기업 규모 추정":"Company Size Estimate","LOW"],
        ]}
        w={["80px","220px"]}
      />
    </Card>

    {/* Output: 7-Section Report */}
    <Card title="output: 7-section report">
      {REPORT_SECTIONS.map((s,i) => (
        <div key={i} style={{ display:"flex", gap:mob?"8px":"14px", padding:"6px 0", borderBottom:i<REPORT_SECTIONS.length-1?`1px solid ${C.border}`:"none", alignItems:"baseline", flexWrap:mob?"wrap":"nowrap" }}>
          <span style={{ color:C.primary, fontWeight:700, fontSize:"13px", width:"24px", flexShrink:0 }}>{s.n}</span>
          <span style={{ color:C.text, fontWeight:600, fontSize:"14px", minWidth:mob?"auto":"140px" }}>{s.name}</span>
          <span style={{ color:C.faint, fontSize:"13px" }}>{s.desc}</span>
        </div>
      ))}
    </Card>
  </CLIReveal>;
}


function TractionSection() {
  const lang = useLang();
  const mob = useIsMobile();

  const STATUS = lang === "ko" ? [
    { k:"제품 단계", v:"MVP 배포 완료" },
    { k:"사용자 수", v:"0" },
    { k:"ARR", v:"$0" },
    { k:"첫 커밋", v:"2026.01.28" },
    { k:"MVP 배포", v:"2026.02.13" },
  ] : [
    { k:"Product Stage", v:"MVP Deployed" },
    { k:"Users", v:"0" },
    { k:"ARR", v:"$0" },
    { k:"First Commit", v:"2026.01.28" },
    { k:"MVP Deployed", v:"2026.02.13" },
  ];

  const PLAN = lang === "ko" ? [
    { phase:"M1", period:"2026.03", title:"커뮤니티 시딩(Blind·Velog·OKKY)으로 첫 유저 확보 → ₩5,900 유료 전환 검증 → 바이럴 루프 구축" },
    { phase:"M2", period:"2026.04-05", title:"채널별 CAC 측정 · SEO 스케일업 · 리텐션 루프 가동 · MAU 500+" },
    { phase:"M3", period:"2026.06-08", title:"반복 가능한 성장 모델 확립 · MAU 1,000+ · 유료 100+명 · MRR $1,500-2,000" },
  ] : [
    { phase:"M1", period:"2026.03", title:"Community seeding (Blind·Velog·OKKY) → First users → ₩5,900 paid conversion → Viral loop" },
    { phase:"M2", period:"2026.04-05", title:"CAC measurement by channel · SEO scale-up · Retention loops · MAU 500+" },
    { phase:"M3", period:"2026.06-08", title:"Repeatable growth model · MAU 1,000+ · 100+ paid · MRR $1,500-2,000" },
  ];

  return <CLIReveal>
    <div style={{ color:"#4deeea", fontSize:"18px", fontWeight:700, lineHeight:"2", marginBottom:"4px" }}>
      {lang==="ko"
        ?"트랙션은 아직 없습니다. 이제부터 만들겠습니다."
        :"No traction yet. We'll build it from here."}
    </div>

    <Card title="current status" titleR={lang==="ko"?"솔직한 현재":"honest reality"}>
      {STATUS.map((s,i) => (
        <div key={i} style={{ display:"flex", gap:"12px", fontSize:"15px", lineHeight:"2.2" }}>
          <span style={{ color:C.dim, minWidth:"120px" }}>{s.k}</span>
          <span style={{ color:s.v.startsWith("$0") || s.v.startsWith("0") ? C.faint : C.text, fontWeight:600 }}>{s.v}</span>
        </div>
      ))}
    </Card>

    <Card title="plan" titleR={lang==="ko"?"이렇게 하겠습니다":"what we'll do"}>
      {PLAN.map((m,i) => (
        <div key={i} style={{ display:"flex", alignItems:mob?"flex-start":"center", gap:"12px", padding:"8px 0", borderBottom:i<PLAN.length-1?`1px solid ${C.border}`:"none", flexWrap:"wrap" }}>
          <span style={{ color:C.primary, fontWeight:700, fontSize:"13px", background:C.pBg, border:`1px solid ${C.primary}25`, padding:"2px 8px", flexShrink:0 }}>{m.phase}</span>
          <span style={{ color:C.faint, fontSize:"13px", flexShrink:0 }}>{m.period}</span>
          <span style={{ color:C.dim, fontSize:"14px" }}>{m.title}</span>
        </div>
      ))}
      <div style={{ marginTop:"12px", color:C.faint, fontSize:"13px", fontStyle:"italic" }}>
        {lang==="ko"?"PMF 신호가 보이면 즉시 스케일, 아니면 빠르게 피벗":"Scale on PMF signal, pivot fast if not"}
      </div>
    </Card>

  </CLIReveal>;
}

function WhySection() {
  const t = useT();
  const mob = useIsMobile();
  return (
    <Card title="cat why-vibelabs.md">
      <div style={{ fontSize:mob?"15px":"16px", lineHeight:mob?"1.8":"2" }}>
        <div style={{ color:C.text, marginBottom:"14px" }}>{t("whyP1")}</div>
        <div style={{ color:C.text, marginBottom:"14px" }}>{t("whyP2")}</div>
        <div style={{ color:C.text, marginBottom:"14px" }}>{t("whyP3")}</div>
        <div style={{ color:C.text }}>{t("whyP4")}</div>
      </div>
    </Card>
  );
}

function ContactSection() {
  const t = useT();
  return (
    <Card title="contact --info">
      <KV k={<><IconMail />Email</>} v="pukaworks@gmail.com" />
      <KV k={<><IconPhone />Phone</>} v="010-6284-1326" />
    </Card>
  );
}

const SECTIONS = {
  home:HomeSection, about:AboutSection, team:TeamSection,
  demovideo:DemoVideoSection, feature:FeatureSection, traction:TractionSection,
  why:WhySection, contact:ContactSection,
};

/* ═══ MAIN APP ═══ */
export default function App() {
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");
  const [menu, setMenu] = useState(false);
  const [booted, setBooted] = useState(false);
  const [bootN, setBootN] = useState(0);
  const [lang, setLang] = useState("ko");
  const [usedCmds, setUsedCmds] = useState([]);
  const [menuIdx, setMenuIdx] = useState(-1);
  const scrollRef = useRef(null);
  const menuRef = useRef(null);
  const inputRef = useRef(null);
  const mob = useIsMobile();

  const t = (key) => i18n[lang][key] || key;

  const BOOT = [
    { t:"$ cat application.md", c:C.dim },
    { t:"loading...", c:C.faint },
    { t:"✔ ready", c:C.green },
  ];

  useEffect(() => {
    if (bootN < BOOT.length) {
      const id = setTimeout(() => setBootN(n=>n+1), 320);
      return () => clearTimeout(id);
    } else setTimeout(() => setBooted(true), 250);
  }, [bootN]);

  useEffect(() => { if (booted && !history.length) exec("home"); }, [booted]);

  const scrollDown = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const go = () => { el.scrollTop = el.scrollHeight; };
    go(); setTimeout(go,50); setTimeout(go,150); setTimeout(go,400); setTimeout(go,800);
  }, []);

  useEffect(() => { scrollDown(); }, [history, bootN, scrollDown]);

  useEffect(() => {
    if (!menu) return;
    const h = e => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenu(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [menu]);

  useEffect(() => {
    const h = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (document.activeElement !== inputRef.current) {
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, []);

  const exec = useCallback((raw) => {
    const c = raw.trim().toLowerCase().replace(/^\//,"");
    if (c === "clear") { setHistory([]); setBooted(false); setBootN(0); return; }
    const S = SECTIONS[c];
    const cmdObj = CMD_KEYS.find(x => x.key === c);
    const promptLabel = cmdObj ? `${cmdObj.n} ${cmdObj.label}` : null;
    if (S) {
      setHistory(p => [...p, { prompt: c==="home" ? null : promptLabel, cmd: null, el:<S /> }]);
      if (c !== "home") setUsedCmds([c]);
    } else {
      setHistory(p => [...p, { prompt:null, cmd:null, el:<ErrorMsg display={raw.trim()} /> }]);
    }
    setTimeout(scrollDown, 30);
  }, [scrollDown]);

  const submit = () => {
    if (!input.trim()) return;
    exec(input); setInput(""); setMenu(false);
  };
  const pick = (k) => {
    exec(k); setMenu(false); setInput("");
  };

  /* filter commands for autocomplete */
  const filterQuery = input.startsWith("/") ? input.slice(1).toLowerCase() : "";
  const filtered = filterQuery ? CMD_KEYS.filter(c => c.key.startsWith(filterQuery)) : CMD_KEYS;
  const autocomplete = (filterQuery && filtered.length > 0) ? "/" + filtered[0].key : null;
  const ghostText = (autocomplete && autocomplete !== input.toLowerCase()) ? autocomplete.slice(input.length) : "";

  /* find next command hint */
  const lastCmd = history.length > 0 ? history[history.length-1] : null;
  const lastKey = lastCmd ? Object.keys(SECTIONS).find(k => {
    const S = SECTIONS[k];
    return lastCmd.el?.type === S;
  }) : null;
  const lastIdx = CMD_KEYS.findIndex(c => c.key === lastKey);
  const nextCmd = lastIdx >= 0 && lastIdx < CMD_KEYS.length - 2 ? CMD_KEYS[lastIdx + 1] : null;

  return (
    <LangContext.Provider value={lang}>
    <div style={{ background:C.bg, height:"100vh", overflow:"hidden", fontFamily:F, fontSize:"16px", lineHeight:"1.8", color:C.text, display:"flex", flexDirection:"column", width:"100%" }}>

      {/* ═══ Top Bar ═══ */}
      <div style={{
        background:C.surface, borderBottom:`1px solid ${C.border}`,
        height:"48px",
        position:"sticky", top:0, zIndex:10,
      }}>
        <div style={{ maxWidth:"860px", margin:"0 auto", padding:mob?"0 12px":"0 32px", height:"100%", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"14px" }}>
            <div style={{ display:"flex", gap:"7px" }}>
              <div style={{ width:12, height:12, borderRadius:"50%", background:"#ff5f57" }} />
              <div style={{ width:12, height:12, borderRadius:"50%", background:"#febc2e" }} />
              <div style={{ width:12, height:12, borderRadius:"50%", background:"#28c840" }} />
            </div>
            {!mob && <span style={{ color:C.faint, fontSize:"14px" }}>spencer — #hashed-vibe-labs-seoul-2026</span>}
          </div>
          <Countdown />
        </div>
      </div>

      {/* ═══ Terminal Body ═══ */}
      <div ref={scrollRef} data-scroll style={{ flex:1, overflowY:"auto", padding:"24px 0 140px" }}>
        <div style={{ maxWidth:"860px", margin:"0 auto", padding:mob?"0 12px":"0 32px" }}>
        {/* Boot */}
        {BOOT.slice(0,bootN).map((b,i) => (
          <div key={i} style={{ color:b.c, fontSize:"15px", lineHeight:"2.2" }}>{b.t}</div>
        ))}

        {/* History */}
        {booted && history.map((h,i) => (
          <div key={i} style={{ marginTop:"28px" }}>
            {h.prompt && (
              <div style={{ color:C.primary, fontSize:"15px", marginBottom:"10px" }}>
                {">"} {h.prompt}
              </div>
            )}
            <div style={{ marginBottom:"14px", fontSize:"15px" }}>
              <span style={{ color:C.green }}>spencer@vibelabs</span>
              <span style={{ color:C.faint }}>:</span>
              <span style={{ color:C.cyan }}>~</span>
              <span style={{ color:C.faint }}>$ </span>
              <span style={{ color:C.text }}>{h.cmd}</span>
            </div>
            {h.el}
          </div>
        ))}
        </div>
      </div>

      {/* ═══ Status Bar ═══ */}
      <div style={{
        position:"fixed", bottom:"56px", left:0, right:0,
        width:"100%",
        background:C.raised, borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}`,
        fontSize:"13px", color:C.faint, zIndex:19,
      }}>
        <div style={{ maxWidth:"860px", margin:"0 auto", padding:mob?"6px 12px 8px":"6px 32px 8px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ display:"flex", gap:"20px" }}>
            {!mob && <><span>MEM: 48MB</span><span>CPU: 2%</span></>}
          </div>
          <div style={{ display:"flex", gap:"14px", alignItems:"center" }}>
            <span style={{ color:C.text }}>{t("applicantLabel")}</span>
            <span>|</span>
            <span
              onClick={() => setLang("ko")}
              style={{ color:lang==="ko"?C.text:C.faint, cursor:"pointer", transition:"color 0.15s" }}
            >한국어</span>
            <span>|</span>
            <span
              onClick={() => setLang("en")}
              style={{ color:lang==="en"?C.text:C.faint, cursor:"pointer", transition:"color 0.15s" }}
            >EN</span>
          </div>
        </div>
      </div>

      {/* ═══ Bottom Input + Menu ═══ */}
      <div ref={menuRef} style={{ position:"fixed", bottom:0, left:0, right:0, width:"100%", zIndex:20 }}>
        {menu && (
          <div style={{
            position:"absolute", bottom:"110px", right:mob?"12px":"20px", width:mob?"calc(100vw - 24px)":"320px",
            background:C.surface, border:`1px solid ${C.borderHi}`,
            borderRadius:"4px", overflow:"hidden",
            boxShadow:"0 10px 36px rgba(0,0,0,0.6)",
            animation:"menuPop 0.15s ease-out",
          }}>
            <div style={{ padding:"10px 14px", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between" }}>
              <span style={{ fontSize:"13px", color:C.dim, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.6px" }}>{t("menuTitle")}</span>
              <span style={{ fontSize:"12px", color:C.faint }}>{t("menuHint")}</span>
            </div>
            {filtered.length === 0 ? (
              <div style={{ padding:"10px 14px", color:C.faint, fontSize:"14px" }}>no match</div>
            ) : filtered.map((c,i) => {
              const used = usedCmds.includes(c.key);
              const active = i === menuIdx;
              const bg = active ? C.pBg : (used && menuIdx === -1) ? C.pBg : "transparent";
              return (
              <div key={c.key} onClick={() => pick(c.key)}
                style={{ display:"flex", alignItems:"center", gap:"12px", padding:"10px 14px", cursor:"pointer", fontSize:"15px", transition:"background 0.08s", borderBottom:i<filtered.length-1?`1px solid ${C.border}`:"none", background:bg, ...(mob?{minHeight:"44px"}:{}) }}
                onMouseEnter={e => { setMenuIdx(i); e.currentTarget.style.background=C.pBg; }}
                onMouseLeave={e => { setMenuIdx(-1); e.currentTarget.style.background="transparent"; }}
              >
                <span style={{ color:C.primary, width:"24px", height:"24px", display:"inline-flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:"13px", background:C.pBg, border:`1px solid ${C.primary}25` }}>{c.n.replace(/[\[\]]/g,"")}</span>
                <span style={{ color:C.cyan, minWidth:"80px", fontWeight:500 }}>{c.label}</span>
                <span style={{ color:C.faint }}>{t(c.descKey)}</span>
              </div>
              );
            })}
          </div>
        )}

        <div style={{ background:C.surface, borderTop:`1px solid ${C.border}` }}>
          <div style={{ maxWidth:"860px", margin:"0 auto", padding:mob?"10px 12px":"14px 32px", display:"flex", alignItems:"center", gap:"12px" }}>
          <span style={{ color:C.dim, fontSize:"16px", whiteSpace:"nowrap" }}>{">"}</span>
          <div style={{ flex:1, position:"relative", display:"flex", alignItems:"center" }}>
            <input ref={inputRef} type="text" value={input}
              onChange={e => { const v = e.target.value; setInput(v); setMenuIdx(-1); if (v.startsWith("/")) setMenu(true); else if (v === "") setMenu(false); }}
              onClick={() => setMenu(p=>!p)}
              onKeyDown={e => {
                if (e.key==="ArrowDown" && menu) { e.preventDefault(); setMenuIdx(i => i < filtered.length - 1 ? i + 1 : 0); return; }
                if (e.key==="ArrowUp" && menu) { e.preventDefault(); setMenuIdx(i => i > 0 ? i - 1 : filtered.length - 1); return; }
                if (e.key==="Tab") { e.preventDefault(); if (autocomplete) { setInput(autocomplete); } }
                if (e.key==="Enter") { if (menu && menuIdx >= 0 && filtered[menuIdx]) { pick(filtered[menuIdx].key); } else { submit(); } }
                if (e.key==="Escape") setMenu(false);
              }}
              placeholder={nextCmd ? `${t("placeholderNext")} ${nextCmd.n} ${nextCmd.label} ${t(nextCmd.descKey)}` : t("placeholder")}
              autoFocus
              className="term-input"
              style={{ width:"100%", background:"transparent", border:"none", outline:"none", color:C.text, fontFamily:F, fontSize:mob?"16px":"15px", cursor:"pointer" }}
            />
            {ghostText && !mob && <span style={{
              position:"absolute",
              left:`${input.length * 9.1}px`,
              top:"50%", transform:"translateY(-50%)",
              color:C.faint, fontSize:"15px", fontFamily:F,
              pointerEvents:"none", opacity:0.5,
            }}>{ghostText}</span>}
            <span className="cursor-blink" style={{
              position:"absolute",
              left:`${input.length * 9.1}px`,
              top:"50%", transform:"translateY(-50%)",
              width:"9px", height:"19px",
              background:C.primary,
              pointerEvents:"none",
            }} />
          </div>
          <div onClick={() => submit()}
            style={{ width:mob?"44px":"36px", height:mob?"44px":"36px", display:"flex", alignItems:"center", justifyContent:"center", borderRadius:"4px", cursor:"pointer", background:C.pBg, border:`1px solid ${C.primary}30`, color:C.primary, fontSize:"15px", fontWeight:700, flexShrink:0 }}
          >↵</div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes menuPop{from{opacity:0;transform:translateY(6px) scale(0.98)}to{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:6px}
        ::-webkit-scrollbar-track{background:${C.bg}}
        ::-webkit-scrollbar-thumb{background:${C.border}}
        ::-webkit-scrollbar-thumb:hover{background:${C.faint}}
        ::selection{background:${C.primary}25;color:${C.text}}
        input::placeholder{color:${C.faint}}
        .term-input{caret-color:transparent}
        .cursor-blink{animation:blink 1s step-end infinite}
        @media (max-width:767px){
          input{font-size:16px !important}
          .term-input{caret-color:${C.primary} !important}
          .cursor-blink{display:none !important}
        }
      `}</style>
    </div>
    </LangContext.Provider>
  );
}

/* ═══ Error Message Component ═══ */
function ErrorMsg({ display }) {
  const t = useT();
  return (
    <div style={{ color:C.red, fontSize:"15px" }}>
      zsh: command not found: {display}
      <div style={{ color:C.faint, marginTop:"6px" }}>{t("errorHint")}</div>
    </div>
  );
}
