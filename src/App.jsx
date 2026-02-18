import { useState, useEffect, useRef, useCallback } from "react";

/* ─── Tokens ─── */
const C = {
  bg:"#1a1a1a", surface:"#222222", raised:"#2a2a2a",
  border:"#363636", borderHi:"#444444",
  primary:"#f0946c", pDim:"#a06848", pBg:"rgba(240,148,108,0.07)",
  green:"#5fbf5f", cyan:"#5fbfbf", red:"#bf5f5f",
  text:"#cccccc", dim:"#888888", faint:"#555555",
};
const F = "'PT Mono','Fira Code','IBM Plex Mono','Consolas',monospace";

/* ─── Data ─── */
const CMDS = [
  { key:"about",    label:"/about",    desc:"제품 소개",    n:"[1]" },
  { key:"team",     label:"/team",     desc:"파운더",       n:"[2]" },
  { key:"product",  label:"/product",  desc:"제품 & 데모",  n:"[3]" },
  { key:"traction", label:"/traction", desc:"트랙션",       n:"[4]" },
  { key:"stack",    label:"/stack",    desc:"기술 스택",    n:"[5]" },
  { key:"why",      label:"/why",      desc:"지원 동기",    n:"[6]" },
  { key:"contact",  label:"/contact",  desc:"연락처",       n:"[7]" },
  { key:"clear",    label:"/clear",    desc:"초기화",       n:"[8]" },
];


const FEATURES = [
  { ic:"⚡", n:"Contextual Review",  d:"레포 전체 컨텍스트를 이해한 코드 리뷰" },
  { ic:"🛡", n:"Security Scanner",   d:"OWASP Top 10 기반 보안 취약점 자동 탐지" },
  { ic:"📊", n:"Perf Insights",      d:"시간복잡도 분석 & 최적화 제안" },
  { ic:"🔗", n:"GitHub Integration", d:"PR 코멘트로 자동 피드백, 원클릭 설치" },
];

const MAU = [
  ["2025.09","  120","██"],
  ["2025.10","  210","████"],
  ["2025.11","  380","███████"],
  ["2025.12","  560","██████████"],
  ["2026.01","  890","████████████████"],
  ["2026.02","1,240","██████████████████████"],
];

const MILESTONES = [
  ["2025.09","프로덕트 런칭 (베타)"],
  ["2025.11","ProductHunt #3 of the day"],
  ["2025.12","엔터프라이즈 첫 계약"],
  ["2026.01","MAU 1,000 돌파"],
];

const STACK = `  // ─── Frontend ───
  Next.js 14      TypeScript
  Tailwind CSS    Framer Motion

  // ─── Backend ───
  Node.js         FastAPI
  PostgreSQL      Redis

  // ─── AI / ML ───
  Claude API      LangChain
  Pinecone        HuggingFace

  // ─── Infrastructure ───
  Vercel          AWS (ap-northeast-2)
  Docker          GitHub Actions

  commits: 2,847  |  last deploy: 2h ago`;

const VIBE_ASCII = `██╗  ██╗ █████╗ ███████╗██╗  ██╗███████╗██████╗
██║  ██║██╔══██╗██╔════╝██║  ██║██╔════╝██╔══██╗
███████║███████║███████╗███████║█████╗  ██║  ██║
██╔══██║██╔══██║╚════██║██╔══██║██╔══╝  ██║  ██║
██║  ██║██║  ██║███████║██║  ██║███████╗██████╔╝
╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚══════╝╚═════╝
██╗   ██╗██╗██████╗ ███████╗    ██╗      █████╗ ██████╗
██║   ██║██║██╔══██╗██╔════╝    ██║     ██╔══██╗██╔══██╗
██║   ██║██║██████╔╝█████╗      ██║     ███████║██████╔╝
╚██╗ ██╔╝██║██╔══██╗██╔══╝      ██║     ██╔══██║██╔══██╗
 ╚████╔╝ ██║██████╔╝███████╗    ███████╗██║  ██║██████╔╝
  ╚═══╝  ╚═╝╚═════╝ ╚══════╝    ╚══════╝╚═╝  ╚═╝╚═════╝`;


/* ═══ SRCL Primitives ═══ */
const Card = ({ title, titleR, children, st }) => (
  <div style={{ border:`1px solid ${C.border}`, background:C.surface, marginBottom:"14px", ...st }}>
    {title && (
      <div style={{ padding:"10px 16px", borderBottom:`1px solid ${C.border}`, background:C.raised, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <span style={{ fontSize:"14px", color:C.dim, fontWeight:600, letterSpacing:"0.8px", textTransform:"uppercase" }}>{title}</span>
        {titleR && <span style={{ fontSize:"13px", color:C.faint }}>{titleR}</span>}
      </div>
    )}
    <div style={{ padding:"16px 18px" }}>{children}</div>
  </div>
);

const Table = ({ hd, rows, w }) => (
  <div style={{ border:`1px solid ${C.border}`, background:C.surface, marginBottom:"14px", overflow:"hidden" }}>
    <table style={{ width:"100%", borderCollapse:"collapse", fontFamily:F }}>
      <thead><tr style={{ background:C.raised }}>
        {hd.map((h,i) => <th key={i} style={{ padding:"10px 14px", fontSize:"14px", color:C.dim, fontWeight:600, letterSpacing:"0.5px", textTransform:"uppercase", textAlign:"left", borderBottom:`1px solid ${C.border}`, width:w?.[i] }}>{h}</th>)}
      </tr></thead>
      <tbody>
        {rows.map((r,ri) => <tr key={ri}>
          {r.map((c,ci) => <td key={ci} style={{ padding:"8px 14px", fontSize:"15px", color:ci===0?C.text:C.dim, borderBottom:ri<rows.length-1?`1px solid ${C.border}`:"none", width:w?.[ci] }}>{c}</td>)}
        </tr>)}
      </tbody>
    </table>
  </div>
);

const KV = ({ k, v, link }) => (
  <div style={{ display:"flex", gap:"12px", fontSize:"15px", lineHeight:"2.2" }}>
    <span style={{ color:C.dim, minWidth:"120px" }}>{k}</span>
    <span style={{ color:link?C.cyan:C.text, textDecoration:link?"underline":"none", cursor:link?"pointer":"default" }}>{v}</span>
  </div>
);


/* ═══ Deadline Countdown ═══ */
function Countdown() {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  const deadline = new Date("2026-03-03T00:00:00+09:00").getTime();
  const diff = Math.max(0, deadline - now);
  const d = Math.ceil(diff / 86400000);
  return (
    <span>
      <span style={{ color:C.dim, fontSize:"14px" }}>Vibe Labs Seoul 시작까지 </span>
      <span style={{ color:C.primary, fontSize:"14px", fontWeight:700 }}>D-{d}</span>
    </span>
  );
}

/* ═══ Section Renderers ═══ */

function HomeSection() {
  return <>
    <div style={{ margin:"16px 0 10px", fontFamily:F }}>
      <span style={{ color:C.faint, fontSize:"16px" }}>{"// "}</span>
      <span style={{ color:"#4deeea", fontSize:"16px", letterSpacing:"3px", fontWeight:600 }}>APPLY FOR</span>
    </div>
    <pre style={{ color:C.primary, fontSize:"10.5px", lineHeight:"1.15", fontFamily:F, margin:"0 0 20px", opacity:0.85, letterSpacing:"0.5px" }}>{VIBE_ASCII}</pre>
    <div style={{ color:C.primary, fontSize:"16px", margin:"0 0 22px" }}>
      —— 1st Batch 2026: Seoul Edition ——
    </div>
    <div style={{ border:`1px solid ${C.primary}40`, borderRadius:"2px", padding:"14px 18px", background:C.pBg, marginBottom:"22px" }}>
      <span style={{ color:C.primary, fontSize:"16px" }}>✦ Release First, Fail Fast with Vibe Coding</span>
    </div>
    <div style={{ fontSize:"16px", lineHeight:"2.2", color:C.text, marginBottom:"22px" }}>
      <div>• 아이디어에 집착하지 않고 시장에서 검증합니다.</div>
      <div>• 탁상공론보단 배포하고 모니터링합니다.</div>
      <div>• PMF를 찾기 위해 실행 {">"} 측정 {">"} 실행 {">"} 측정을 반복합니다.</div>
    </div>
    <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:"16px" }}>
      <div style={{ color:C.dim, fontSize:"14px", marginBottom:"12px" }}>아래 명령어를 입력하거나, 입력창을 클릭해 선택하세요:</div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"2px 0" }}>
        {CMDS.filter(c=>c.key!=="clear").map(c => (
          <div key={c.key} style={{ fontSize:"15px", lineHeight:"2.2" }}>
            <span style={{ color:C.primary }}>{c.n} </span>
            <span style={{ color:C.cyan }}>{c.label}</span>
            <span style={{ color:C.faint }}> {c.desc}</span>
          </div>
        ))}
      </div>
    </div>
  </>;
}

function AboutSection() {
  return <>
    <Card title="applicant">
      <div style={{ color:C.primary, fontWeight:700, fontSize:"20px", marginBottom:"10px" }}>CodeFlow</div>
      <div style={{ color:C.text, fontSize:"16px", marginBottom:"12px" }}>AI-powered code review that actually understands your codebase.</div>
      <div style={{ color:C.dim, fontSize:"15px", lineHeight:"2" }}>
        PR을 올리면, CodeFlow가 전체 코드베이스의 컨텍스트를 이해하고
        버그 가능성, 성능 이슈, 보안 취약점을 자동으로 리뷰합니다.
        단순 린터가 아닌, 시니어 개발자 수준의 코드 리뷰를 제공합니다.
      </div>
    </Card>
    <Card title="info">
      <KV k="Founded" v="2025.09" />
      <KV k="Stage" v="Pre-Seed" />
      <KV k="Location" v="Seoul, South Korea" />
      <KV k="Live URL" v="https://codeflow.dev" link />
    </Card>
  </>;
}

function TeamSection() {
  return <>
    <Card title="founder">
      <div style={{ display:"flex", alignItems:"center", gap:"16px", marginBottom:"14px" }}>
        <div style={{ width:"48px", height:"48px", border:`1px solid ${C.border}`, background:C.raised, display:"flex", alignItems:"center", justifyContent:"center", color:C.primary, fontSize:"15px", fontWeight:700 }}>ST</div>
        <div>
          <div style={{ color:C.text, fontWeight:600, fontSize:"18px" }}>이승태</div>
          <div style={{ color:C.dim, fontSize:"15px" }}>Founder · Full-time</div>
        </div>
      </div>
      <KV k="📧 Email" v="pukaworks@gmail.com" />
      <KV k="🐙 GitHub" v="github.com/pukaworks" link />
    </Card>
  </>;
}

function ProductSection() {
  return <>
    <div style={{ border:`1px solid ${C.border}`, marginBottom:"14px" }}>
      <div style={{ height:"240px", background:"linear-gradient(135deg,#0a0a0f,#0a1628 50%,#0f2440)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", position:"relative" }}>
        <div style={{ width:"64px", height:"64px", borderRadius:"50%", background:C.primary, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"24px", color:"#000", fontWeight:700, boxShadow:`0 0 30px ${C.primary}50` }}>▶</div>
        <div style={{ position:"absolute", bottom:"12px", right:"16px", color:C.faint, fontSize:"13px" }}>2:34 · 1080p</div>
      </div>
      <div style={{ padding:"10px 16px", borderTop:`1px solid ${C.border}`, background:C.surface }}>
        <span style={{ color:C.dim, fontSize:"14px" }}>CodeFlow Demo — AI Code Review in Action</span>
        <span style={{ float:"right", color:C.cyan, fontSize:"14px", cursor:"pointer" }}>YouTube ↗</span>
      </div>
    </div>
    <Table hd={["","Feature","Description"]} rows={FEATURES.map(f=>[f.ic,f.n,f.d])} w={["32px","160px"]} />
  </>;
}

function TractionSection() {
  return <>
    <div style={{ color:C.faint, fontSize:"14px", marginBottom:"12px" }}>📅 2025.09 — 2026.02 (6개월)</div>
    <Table hd={["Metric","Value","Growth"]} rows={[
      ["MAU","1,240","+42% MoM"],["ARR","$18,600","+68% MoM"],
      ["D30 Retention","87%","+12pp YoY"],["NPS","72","+8 QoQ"],
    ]} w={["140px","110px"]} />
    <Card title="mau trend" titleR="monthly active users">
      {MAU.map((r,i) => (
        <div key={i} style={{ display:"flex", gap:"12px", fontSize:"15px", lineHeight:"2", borderBottom:i<MAU.length-1?`1px solid ${C.border}`:"none", padding:"2px 0" }}>
          <span style={{ color:C.faint, width:"72px" }}>{r[0]}</span>
          <span style={{ color:C.text, width:"52px", textAlign:"right" }}>{r[1]}</span>
          <span style={{ color:C.primary, opacity:0.65 }}>{r[2]}</span>
        </div>
      ))}
    </Card>
    <Card title="milestones">
      {MILESTONES.map((m,i) => (
        <div key={i} style={{ display:"flex", gap:"14px", fontSize:"15px", lineHeight:"2.2", borderBottom:i<MILESTONES.length-1?`1px solid ${C.border}`:"none" }}>
          <span style={{ color:C.pDim, minWidth:"72px" }}>{m[0]}</span>
          <span style={{ color:C.faint }}>→</span>
          <span style={{ color:C.text }}>{m[1]}</span>
        </div>
      ))}
    </Card>
  </>;
}

function StackSection() {
  return (
    <Card title="stack.config" titleR="read-only">
      <pre style={{ margin:0, fontSize:"15px", lineHeight:"1.8", color:C.dim, fontFamily:F, whiteSpace:"pre" }}>{STACK}</pre>
    </Card>
  );
}

function WhySection() {
  return (
    <Card title="cat why-vibelabs.md">
      <div style={{ fontSize:"16px", lineHeight:"2" }}>
        <div style={{ color:C.text, marginBottom:"14px" }}>
          "설명이 아닌, 결과물을 봅니다"라는 Vibe Labs의 철학에 깊이 공감합니다.
        </div>
        <div style={{ color:C.dim, marginBottom:"14px" }}>
          바이브 코딩으로 코드 생성 속도는 빨라졌지만, 그만큼 검증되지 않은 코드도
          늘어나고 있습니다. CodeFlow는 이 간극을 메우는 제품입니다.
          AI가 만든 코드를, AI가 리뷰합니다.
        </div>
        <div style={{ color:C.dim, marginBottom:"14px" }}>
          Vibe Labs의 실행 중심 환경에서 빠르게 제품을 검증하고,
          Hashed의 글로벌 네트워크를 통해 아시아를 넘어
          확장하고 싶습니다.
        </div>
        <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:"12px" }}>
          <span style={{ color:C.primary, fontStyle:"italic" }}>
            이 지원서 자체가 제 빌딩 속도를 보여줍니다. 아이디어부터 이 페이지까지, 3시간.
          </span>
        </div>
      </div>
    </Card>
  );
}

function ContactSection() {
  return (
    <Card title="contact --info">
      <KV k="📧 Email" v="pukaworks@gmail.com" />
      <KV k="🐙 GitHub" v="github.com/pukaworks" link />
      <div style={{ borderTop:`1px solid ${C.border}`, marginTop:"12px", paddingTop:"12px", color:C.dim, fontSize:"15px" }}>
        궁금한 점이 있으시다면 편하게 연락주세요.
      </div>
    </Card>
  );
}

const SECTIONS = {
  home:HomeSection, about:AboutSection, team:TeamSection,
  product:ProductSection, traction:TractionSection, stack:StackSection,
  why:WhySection, contact:ContactSection,
};

/* ═══ MAIN APP ═══ */
export default function App() {
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");
  const [menu, setMenu] = useState(false);
  const [booted, setBooted] = useState(false);
  const [bootN, setBootN] = useState(0);
  const scrollRef = useRef(null);
  const menuRef = useRef(null);

  const BOOT = [
    { t:"$ cat application.md", c:C.dim },
    { t:"loading...", c:C.faint },
    { t:"✔ ready", c:C.green },
  ];

  useEffect(() => {
    if (bootN < BOOT.length) {
      const t = setTimeout(() => setBootN(n=>n+1), 320);
      return () => clearTimeout(t);
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

  const exec = useCallback((raw) => {
    const c = raw.trim().toLowerCase().replace(/^\//,"");
    if (c === "clear") { setHistory([]); setBooted(false); setBootN(0); return; }
    const display = raw.trim();
    const S = SECTIONS[c];
    // find cmd index for prompt display
    const cmdObj = CMDS.find(x => x.key === c);
    const promptLabel = cmdObj ? `${cmdObj.n} ${cmdObj.label}` : null;
    if (S) {
      setHistory(p => [...p, { prompt: c==="home" ? null : promptLabel, cmd: null, el:<S /> }]);
    } else {
      setHistory(p => [...p, { prompt:null, cmd:null, el:(
        <div style={{ color:C.red, fontSize:"15px" }}>
          zsh: command not found: {display}
          <div style={{ color:C.faint, marginTop:"6px" }}>입력창을 클릭해 명령어를 선택하세요.</div>
        </div>
      )}]);
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

  /* find next command hint */
  const lastCmd = history.length > 0 ? history[history.length-1] : null;
  const lastKey = lastCmd ? Object.keys(SECTIONS).find(k => {
    const S = SECTIONS[k];
    return lastCmd.el?.type === S;
  }) : null;
  const lastIdx = CMDS.findIndex(c => c.key === lastKey);
  const nextCmd = lastIdx >= 0 && lastIdx < CMDS.length - 2 ? CMDS[lastIdx + 1] : null;

  return (
    <div style={{ background:C.bg, minHeight:"100vh", fontFamily:F, fontSize:"16px", lineHeight:"1.8", color:C.text, display:"flex", flexDirection:"column", maxWidth:"860px", margin:"0 auto", width:"100%", boxShadow:"0 0 80px rgba(0,0,0,0.5)", borderLeft:`1px solid ${C.border}`, borderRight:`1px solid ${C.border}` }}>

      {/* ═══ Top Bar ═══ */}
      <div style={{
        background:C.surface, borderBottom:`1px solid ${C.border}`,
        padding:"0 24px", height:"48px",
        display:"flex", alignItems:"center", justifyContent:"space-between",
        position:"sticky", top:0, zIndex:10,
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:"14px" }}>
          <div style={{ display:"flex", gap:"7px" }}>
            <div style={{ width:12, height:12, borderRadius:"50%", background:"#ff5f57" }} />
            <div style={{ width:12, height:12, borderRadius:"50%", background:"#febc2e" }} />
            <div style={{ width:12, height:12, borderRadius:"50%", background:"#28c840" }} />
          </div>
          <span style={{ color:C.faint, fontSize:"14px" }}>hashed — vibe-labs-seoul-2026</span>
        </div>
        <Countdown />
      </div>

      {/* ═══ Terminal Body ═══ */}
      <div ref={scrollRef} style={{ flex:1, padding:"24px 32px 140px", overflowY:"auto" }}>
        {/* Boot */}
        {BOOT.slice(0,bootN).map((b,i) => (
          <div key={i} style={{ color:b.c, fontSize:"15px", lineHeight:"2.2" }}>{b.t}</div>
        ))}

        {/* History */}
        {booted && history.map((h,i) => (
          <div key={i} style={{ marginTop:"28px" }}>
            {/* Section marker */}
            {h.prompt && (
              <div style={{ color:C.primary, fontSize:"15px", marginBottom:"10px" }}>
                {">"} {h.prompt}
              </div>
            )}
            {/* Command prompt */}
            <div style={{ marginBottom:"14px", fontSize:"15px" }}>
              <span style={{ color:C.green }}>user@vibelabs</span>
              <span style={{ color:C.faint }}>:</span>
              <span style={{ color:C.cyan }}>~</span>
              <span style={{ color:C.faint }}>$ </span>
              <span style={{ color:C.text }}>{h.cmd}</span>
            </div>
            {h.el}
          </div>
        ))}
      </div>

      {/* ═══ Status Bar ═══ */}
      <div style={{
        position:"fixed", bottom:"56px", left:"50%", transform:"translateX(-50%)",
        width:"100%", maxWidth:"860px",
        background:C.raised, borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}`,
        padding:"6px 28px",
        display:"flex", justifyContent:"space-between", alignItems:"center",
        fontSize:"13px", color:C.faint, zIndex:19,
      }}>
        <div style={{ display:"flex", gap:"20px" }}>
          <span>MEM: 48MB</span>
          <span>CPU: 2%</span>
        </div>
        <div style={{ display:"flex", gap:"14px" }}>
          <span>Applicant: <span style={{ color:C.text }}>이승태</span></span>
          <span>|</span>
          <span style={{ color:C.text }}>한국어</span>
          <span>|</span>
          <span>EN</span>
        </div>
      </div>

      {/* ═══ Bottom Input + Menu ═══ */}
      <div ref={menuRef} style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:"860px", zIndex:20 }}>
        {menu && (
          <div style={{
            position:"absolute", bottom:"110px", right:"20px", width:"320px",
            background:C.surface, border:`1px solid ${C.borderHi}`,
            borderRadius:"4px", overflow:"hidden",
            boxShadow:"0 10px 36px rgba(0,0,0,0.6)",
            animation:"menuPop 0.15s ease-out",
          }}>
            <div style={{ padding:"10px 14px", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between" }}>
              <span style={{ fontSize:"13px", color:C.dim, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.6px" }}>명령어 선택</span>
              <span style={{ fontSize:"12px", color:C.faint }}>↵ 선택</span>
            </div>
            {CMDS.map((c,i) => (
              <div key={c.key} onClick={() => pick(c.key)}
                style={{ display:"flex", alignItems:"center", gap:"12px", padding:"10px 14px", cursor:"pointer", fontSize:"15px", transition:"background 0.08s", borderBottom:i<CMDS.length-1?`1px solid ${C.border}`:"none" }}
                onMouseEnter={e => e.currentTarget.style.background=C.pBg}
                onMouseLeave={e => e.currentTarget.style.background="transparent"}
              >
                <span style={{ color:C.primary, width:"24px", height:"24px", display:"inline-flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:"13px", background:C.pBg, border:`1px solid ${C.primary}25` }}>{c.n.replace(/[\[\]]/g,"")}</span>
                <span style={{ color:C.cyan, minWidth:"80px", fontWeight:500 }}>{c.label}</span>
                <span style={{ color:C.faint }}>{c.desc}</span>
              </div>
            ))}
          </div>
        )}

        <div style={{ background:C.surface, borderTop:`1px solid ${C.border}`, padding:"14px 28px", display:"flex", alignItems:"center", gap:"12px" }}>
          <span style={{ color:C.dim, fontSize:"16px", whiteSpace:"nowrap" }}>{">"}</span>
          <div style={{ flex:1, position:"relative", display:"flex", alignItems:"center" }}>
            <input type="text" value={input}
              onChange={e => setInput(e.target.value)}
              onClick={() => setMenu(p=>!p)}
              onKeyDown={e => { if (e.key==="Enter") submit(); if (e.key==="Escape") setMenu(false); }}
              placeholder={nextCmd ? `명령어를 입력하세요... 다음 컨텐츠는 ${nextCmd.n} ${nextCmd.label} ${nextCmd.desc}` : "명령어를 입력하세요..."}
              autoFocus
              className="term-input"
              style={{ width:"100%", background:"transparent", border:"none", outline:"none", color:C.text, fontFamily:F, fontSize:"15px", cursor:"pointer" }}
            />
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
            style={{ width:"36px", height:"36px", display:"flex", alignItems:"center", justifyContent:"center", borderRadius:"4px", cursor:"pointer", background:C.pBg, border:`1px solid ${C.primary}30`, color:C.primary, fontSize:"15px", fontWeight:700 }}
          >↵</div>
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
      `}</style>
    </div>
  );
}
