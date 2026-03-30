import { useState, useRef, useEffect } from "react";

const SB_URL = import.meta.env.VITE_SUPABASE_URL;
const SB_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const C = { bg:"#F8F5F1",card:"#FFFFFF",muted:"#F2EDE7",navy:"#1B2B3A",navyMid:"#2D4558",terra:"#C85A3A",rose:"#C4849A",rosePale:"#F5E8EE",sage:"#5C8060",amber:"#C49A3A",amberPale:"#F5F0E0",border:"#E4DDD5",dark:"#1E1612",mid:"#5A4A40",gray:"#9A8878",white:"#FFFFFF",green:"#4A9E6A",greenPale:"#E8F5EE",red:"#C84848",redPale:"#FAE8E8" };
const SF = "'Georgia',serif";
const SS = "-apple-system,sans-serif";
const fmt = n => "$"+Math.round(Math.abs(n)).toLocaleString();
const pct = n => Math.round(n)+"%";
const cl = (v,lo,hi) => Math.max(lo,Math.min(hi,v));

function Gauge({value}){
  const s=cl(Math.round(value),-20,100),n=cl((s+20)/120,0,1),a=-135+n*270,r=70,cx=90,cy=90;
  const toR=d=>d*Math.PI/180;
  const arc=(s1,e1,col,w=10)=>{const x1=cx+r*Math.cos(toR(s1)),y1=cy+r*Math.sin(toR(s1)),x2=cx+r*Math.cos(toR(e1)),y2=cy+r*Math.sin(toR(e1)),lg=e1-s1>180?1:0;return <path d={`M${x1},${y1} A${r},${r},0,${lg},1,${x2},${y2}`} fill="none" stroke={col} strokeWidth={w} strokeLinecap="round"/>};
  const col=s>=42?C.green:s>=26?C.amber:C.red,lbl=s>=42?"Strong":s>=26?"Thin":"Leaking";
  const nx=cx+(r-8)*Math.cos(toR(a)),ny=cy+(r-8)*Math.sin(toR(a));
  return <div style={{textAlign:"center"}}><svg width="180" height="120" viewBox="0 0 180 120">{arc(-135,135,C.border)}{arc(-135,-135+n*270,col)}<line x1={cx} y1={cy} x2={nx} y2={ny} stroke={col} strokeWidth="2.5" strokeLinecap="round"/><circle cx={cx} cy={cy} r={5} fill={col}/><text x={cx} y={cy+22} textAnchor="middle" fill={col} fontSize="26" fontFamily={SF}>{pct(s)}</text><text x={cx} y={cy+38} textAnchor="middle" fill={C.gray} fontSize="11" fontFamily={SS} letterSpacing="1">{lbl.toUpperCase()}</text><text x="22" y="112" fill={C.gray} fontSize="9" fontFamily={SS}>Poor</text><text x="142" y="112" fill={C.gray} fontSize="9" fontFamily={SS}>Strong</text></svg><p style={{fontSize:12,color:C.gray,fontFamily:SS,margin:0}}>Margin health score</p></div>;
}

function Steps({cur,total}){
  return <div style={{display:"flex",alignItems:"center",justifyContent:"center",marginBottom:32}}>{Array.from({length:total}).map((_,i)=><div key={i} style={{display:"flex",alignItems:"center"}}><div style={{width:28,height:28,borderRadius:14,background:i<=cur?C.terra:C.border,display:"flex",alignItems:"center",justifyContent:"center"}}>{i<cur?<svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round"/></svg>:<span style={{fontSize:11,color:i===cur?C.white:C.gray,fontFamily:SS,fontWeight:600}}>{i+1}</span>}</div>{i<total-1&&<div style={{width:32,height:2,background:i<cur?C.terra:C.border}}/>}</div>)}</div>;
}

function Slider({label,value,min,max,step=1,prefix="",suffix="",onChange,hint,icon}){
  const n=((value-min)/(max-min))*100;
  return <div style={{marginBottom:28,position:"relative"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><div style={{display:"flex",alignItems:"center",gap:8}}>{icon&&<span style={{fontSize:16}}>{icon}</span>}<span style={{fontSize:14,color:C.mid,fontFamily:SS}}>{label}</span></div><div style={{background:C.muted,borderRadius:8,padding:"4px 12px"}}><span style={{fontSize:16,color:C.dark,fontFamily:SF}}>{prefix}{value.toLocaleString()}{suffix}</span></div></div><div style={{position:"relative",height:6,background:C.border,borderRadius:3,marginBottom:4}}><div style={{position:"absolute",left:0,top:0,height:"100%",width:`${n}%`,background:`linear-gradient(90deg,${C.rose},${C.terra})`,borderRadius:3}}/><div style={{position:"absolute",top:"50%",left:`${n}%`,transform:"translate(-50%,-50%)",width:16,height:16,borderRadius:8,background:C.white,border:`2px solid ${C.terra}`,boxShadow:"0 1px 6px rgba(0,0,0,0.15)"}}/></div><input type="range" min={min} max={max} step={step} value={value} onChange={e=>onChange(Number(e.target.value))} style={{position:"absolute",opacity:0,width:"100%",height:24,cursor:"pointer",zIndex:2,top:42}}/><div style={{display:"flex",justifyContent:"space-between",marginTop:4}}><span style={{fontSize:11,color:C.gray,fontFamily:SS}}>{prefix}{min.toLocaleString()}{suffix}</span>{hint&&<span style={{fontSize:11,color:C.gray,fontFamily:SS,flex:1,textAlign:"center",padding:"0 8px"}}>{hint}</span>}<span style={{fontSize:11,color:C.gray,fontFamily:SS}}>{prefix}{max.toLocaleString()}{suffix}</span></div></div>;
}

function Toggle({label,sub,checked,onChange}){
  return <div onClick={()=>onChange(!checked)} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 16px",background:checked?"#FDF5F2":C.white,border:`1.5px solid ${checked?C.terra:C.border}`,borderRadius:10,cursor:"pointer",marginBottom:12,transition:"all 0.2s"}}><div><p style={{fontSize:14,color:C.dark,fontFamily:SS,margin:0,fontWeight:500}}>{label}</p>{sub&&<p style={{fontSize:12,color:C.gray,fontFamily:SS,margin:"2px 0 0"}}>{sub}</p>}</div><div style={{width:44,height:24,borderRadius:12,background:checked?C.terra:C.border,position:"relative",flexShrink:0,transition:"background 0.25s"}}><div style={{position:"absolute",top:3,left:checked?22:3,width:18,height:18,borderRadius:9,background:C.white,transition:"left 0.25s",boxShadow:"0 1px 4px rgba(0,0,0,0.2)"}}/></div></div>;
}

function Card({children,style}){return <div style={{background:C.card,borderRadius:16,padding:"28px 24px",border:`1px solid ${C.border}`,boxShadow:"0 2px 16px rgba(30,22,18,0.06)",marginBottom:16,...style}}>{children}</div>;}

function Btn({children,onClick,secondary}){
  return <button onClick={onClick} style={{padding:"14px 28px",fontSize:15,borderRadius:10,border:"none",cursor:"pointer",fontFamily:SS,fontWeight:600,background:secondary?C.muted:`linear-gradient(135deg,${C.terra},#E07050)`,color:secondary?C.mid:C.white,boxShadow:secondary?"none":`0 4px 16px rgba(200,90,58,0.18)`}}>{children}</button>;
}

export default function App(){
  const [step,setStep]=useState(0);
  const [guests,setGuests]=useState(10);
  const [price,setPrice]=useState(2200);
  const [days,setDays]=useState(5);
  const [venue,setVenue]=useState(38);
  const [food,setFood]=useState(20);
  const [travel,setTravel]=useState(8);
  const [mktPct,setMktPct]=useState(12);
  const [mkt,setMkt]=useState(true);
  const [time,setTime]=useState(true);
  const [email,setEmail]=useState("");
  const [loading,setLoading]=useState(false);
  const top=useRef(null);
  useEffect(()=>{top.current?.scrollIntoView({behavior:"smooth",block:"start"});},[step]);

  const rev=guests*price;
  const vCost=rev*(venue/100),fCost=rev*(food/100),tCost=rev*(travel/100);
  const mCost=mkt?rev*(mktPct/100):0,tmCost=time?days*8*75:0;
  const total=vCost+fCost+tCost+mCost+tmCost;
  const profit=rev-total,margin=rev>0?(profit/rev)*100:0;
  const perGuest=guests>0?profit/guests:0;
  const hourly=time&&days>0?profit/(days*10):null;
  const tier=margin>=42?"strong":margin>=26?"thin":"leaking";
  const tc={strong:{col:C.green,bg:C.greenPale,msg:"You're running this well. The question now is whether it's repeatable — and whether the host is sustainable inside it."},thin:{col:C.amber,bg:C.amberPale,msg:"Thin margins are the silent tax on retreat leaders who price from intuition. You're not underpaid because you lack worth. You're underpaid because the structure isn't built right."},leaking:{col:C.red,bg:C.redPale,msg:"This is the number that explains the exhaustion. Sold out. Empty account. Depleted host. It's not a mindset problem — it's a math problem. And math problems have solutions."}}[tier];

  const submit=async()=>{
    if(!email.trim())return;
    setLoading(true);
    try{await fetch(`${SB_URL}/rest/v1/retreat_leads`,{method:"POST",headers:{"Content-Type":"application/json","apikey":SB_KEY,"Authorization":`Bearer ${SB_KEY}`,"Prefer":"return=minimal"},body:JSON.stringify({email,results:{guests,price,days,revenue:rev,profit,margin:Math.round(margin)},created_at:new Date().toISOString()})});}catch(e){}
    setLoading(false);setStep(3);
  };

  return <div ref={top} style={{background:C.bg,minHeight:"100vh",fontFamily:SS}}>
    <div style={{background:`linear-gradient(160deg,${C.navy},${C.navyMid})`,padding:"14px 24px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <span style={{fontSize:14,color:C.white,fontWeight:600}}>Retreat Profit Calculator</span>
      <span style={{fontSize:11,color:"rgba(255,255,255,0.4)",letterSpacing:1.5,textTransform:"uppercase"}}>Free Tool</span>
    </div>

    {step===0&&<div style={{background:`linear-gradient(160deg,${C.navy},${C.navyMid})`,padding:"48px 24px 40px",textAlign:"center"}}>
      <h1 style={{fontSize:"clamp(26px,5vw,42px)",fontWeight:400,color:C.white,margin:"0 auto 16px",maxWidth:520,lineHeight:1.2,fontFamily:SF}}>Sold out doesn't mean profitable.</h1>
      <p style={{fontSize:16,color:"rgba(255,255,255,0.55)",maxWidth:400,margin:"0 auto 32px",lineHeight:1.65}}>Most retreat leaders price from the heart. The market prices from math. See exactly where those two things collide.</p>
      <div style={{display:"flex",justifyContent:"center",gap:32,marginBottom:36,flexWrap:"wrap"}}>
        {[["70%","quit within 3 years"],["$8,400","avg revenue left on table"],["$23/hr","what most hosts actually earn"]].map(([s,l])=><div key={s} style={{textAlign:"center"}}><p style={{fontSize:22,color:C.terra,fontFamily:SF,margin:"0 0 4px"}}>{s}</p><p style={{fontSize:11,color:"rgba(255,255,255,0.4)",margin:0,maxWidth:110,lineHeight:1.4}}>{l}</p></div>)}
      </div>
      <Btn onClick={()=>setStep(1)}>Calculate my retreat profit →</Btn>
    </div>}

    {(step===1||step===2)&&<div style={{maxWidth:540,margin:"0 auto",padding:"32px 20px 60px"}}>
      <Steps cur={step-1} total={3}/>
      {step===1&&<Card>
        <h2 style={{fontSize:20,fontWeight:400,color:C.dark,margin:"0 0 6px",fontFamily:SF}}>Tell us about your retreat</h2>
        <p style={{fontSize:13,color:C.gray,margin:"0 0 28px"}}>We'll calculate your total revenue potential.</p>
        <Slider label="Guests" icon="👤" value={guests} min={4} max={40} onChange={setGuests}/>
        <Slider label="Price per guest" icon="💳" value={price} min={300} max={8000} step={100} prefix="$" onChange={setPrice} hint="Full investment per person"/>
        <Slider label="Retreat length" icon="📅" value={days} min={2} max={14} onChange={setDays} suffix={days===1?" day":" days"}/>
        <div style={{background:C.muted,borderRadius:10,padding:"14px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:8}}>
          <span style={{fontSize:13,color:C.mid}}>Total revenue</span>
          <span style={{fontSize:20,color:C.dark,fontFamily:SF}}>{fmt(rev)}</span>
        </div>
        <div style={{marginTop:20,display:"flex",justifyContent:"flex-end"}}><Btn onClick={()=>setStep(2)}>Next: Your costs →</Btn></div>
      </Card>}
      {step===2&&<Card>
        <h2 style={{fontSize:20,fontWeight:400,color:C.dark,margin:"0 0 6px",fontFamily:SF}}>Now the real numbers</h2>
        <p style={{fontSize:13,color:C.gray,margin:"0 0 28px"}}>This is where most retreat leaders discover the gap.</p>
        <Slider label="Venue & accommodation" icon="🏡" value={venue} min={10} max={65} onChange={setVenue} suffix="%" hint="Industry avg: 30–45%"/>
        <Slider label="Food & beverage" icon="🥗" value={food} min={5} max={40} onChange={setFood} suffix="%" hint="Industry avg: 15–25%"/>
        <Slider label="Travel & logistics" icon="✈️" value={travel} min={0} max={25} onChange={setTravel} suffix="%"/>
        <Toggle label="Include marketing costs" sub={`${mktPct}% of revenue`} checked={mkt} onChange={setMkt}/>
        {mkt&&<Slider label="Marketing %" value={mktPct} min={3} max={35} onChange={setMktPct} suffix="%"/>}
        <Toggle label="Count your own time" sub="Your energy is a resource. Not a donation." checked={time} onChange={setTime}/>
        {time&&<div style={{background:C.rosePale,borderRadius:10,padding:"12px 14px",marginBottom:16}}><p style={{fontSize:12,color:C.rose,margin:0}}>Your time cost: <strong>{fmt(tmCost)}</strong></p></div>}
        <div style={{display:"flex",justifyContent:"space-between",marginTop:8,gap:10}}>
          <Btn onClick={()=>setStep(1)} secondary>← Back</Btn>
          <Btn onClick={()=>setStep(2.5)}>See my results →</Btn>
        </div>
      </Card>}
    </div>}

    {step===2.5&&<div style={{maxWidth:480,margin:"0 auto",padding:"40px 20px 60px"}}>
      <Steps cur={2} total={3}/>
      <Card>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{width:56,height:56,borderRadius:28,background:C.muted,margin:"0 auto 16px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>📊</div>
          <h2 style={{fontSize:22,fontWeight:400,color:C.dark,fontFamily:SF,margin:"0 0 10px"}}>Your results are ready.</h2>
          <p style={{fontSize:14,color:C.gray,lineHeight:1.65,margin:0}}>Enter your email to see your full profitability breakdown.</p>
        </div>
        <div style={{background:C.muted,borderRadius:10,padding:"14px 16px",marginBottom:20}}>
          <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:13,color:C.mid}}>Estimated profit</span><span style={{fontSize:16,color:profit>=0?C.green:C.red,fontFamily:SF,fontWeight:600}}>{profit<0?"-":""}{fmt(profit)}</span></div>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:6}}><span style={{fontSize:13,color:C.mid}}>On {fmt(rev)} revenue</span><span style={{fontSize:13,color:C.gray}}>Margin: ~{pct(margin)}</span></div>
        </div>
        <input type="email" placeholder="your@email.com" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} style={{width:"100%",padding:"14px 16px",fontSize:15,border:`1.5px solid ${C.border}`,borderRadius:10,background:C.white,color:C.dark,fontFamily:SS,outline:"none",boxSizing:"border-box",marginBottom:12}}/>
        <button onClick={submit} disabled={!email.trim()||loading} style={{width:"100%",padding:"15px",fontSize:15,background:`linear-gradient(135deg,${C.terra},#E07050)`,color:C.white,border:"none",borderRadius:10,cursor:email.trim()?"pointer":"not-allowed",fontFamily:SS,fontWeight:600,opacity:!email.trim()||loading?0.6:1}}>{loading?"Loading...":"Show me my full report →"}</button>
        <p style={{fontSize:12,color:C.gray,textAlign:"center",marginTop:12}}>No spam. Unsubscribe anytime.</p>
      </Card>
    </div>}

    {step===3&&<div style={{maxWidth:560,margin:"0 auto",padding:"32px 20px 80px"}}>
      <Card style={{background:C.navy,border:"none"}}>
        <p style={{fontSize:11,color:"rgba(255,255,255,0.35)",letterSpacing:2,textTransform:"uppercase",margin:"0 0 16px"}}>Your retreat profit report</p>
        <div style={{display:"flex",justifyContent:"center",marginBottom:8}}><Gauge value={margin}/></div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {[["Total Revenue",fmt(rev),"💰",null],["Net Profit",(profit<0?"-":"")+fmt(profit),"📈",profit>=0?C.green:C.red],["Per Guest",fmt(perGuest),"👤",null],hourly?["Hourly Rate",`${fmt(hourly)}/hr`,"⏱",null]:null].filter(Boolean).map(([l,v,ic,c])=><div key={l} style={{background:"rgba(255,255,255,0.06)",borderRadius:12,padding:"14px"}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><p style={{fontSize:11,color:"rgba(255,255,255,0.35)",fontFamily:SS,margin:0,textTransform:"uppercase",letterSpacing:1}}>{l}</p><span style={{fontSize:14}}>{ic}</span></div><p style={{fontSize:20,color:c||C.white,fontFamily:SF,margin:0}}>{v}</p></div>)}
        </div>
      </Card>
      <Card style={{background:tc.bg,border:`1.5px solid ${tc.col}30`}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}><div style={{width:10,height:10,borderRadius:5,background:tc.col}}/><span style={{fontSize:12,color:tc.col,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase"}}>Margin verdict</span></div>
        <p style={{fontSize:14,color:C.mid,lineHeight:1.75,margin:0}}>{tc.msg}</p>
      </Card>
      <Card>
        <p style={{fontSize:12,color:C.gray,letterSpacing:1.5,textTransform:"uppercase",margin:"0 0 20px",fontWeight:600}}>Cost breakdown</p>
        {[[vCost,"Venue",C.terra],[fCost,"Food",C.rose],[tCost,"Travel",C.amber],mkt?[mCost,"Marketing",C.sage]:null,time?[tmCost,"Your time",C.navyMid]:null].filter(Boolean).map(([amt,lbl,col])=><div key={lbl} style={{marginBottom:12}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontSize:13,color:C.mid,fontFamily:SS}}>{lbl}</span><span style={{fontSize:13,color:C.dark,fontFamily:SS,fontWeight:600}}>{fmt(amt)}</span></div><div style={{height:6,background:C.border,borderRadius:3}}><div style={{height:"100%",width:`${cl((amt/total)*100,0,100)}%`,background:col,borderRadius:3}}/></div></div>)}
        <div style={{display:"flex",justifyContent:"space-between",paddingTop:14,marginTop:6,borderTop:`1px solid ${C.border}`}}><span style={{fontSize:14,color:C.dark,fontWeight:600}}>Total costs</span><span style={{fontSize:14,color:C.dark,fontWeight:600}}>{fmt(total)}</span></div>
      </Card>
      <Card style={{textAlign:"center",background:"linear-gradient(145deg,#FDF5F2,#F8EDE6)"}}>
        <h2 style={{fontSize:22,fontWeight:400,color:C.dark,fontFamily:SF,margin:"0 0 10px",lineHeight:1.3}}>Learn how to sell out your retreat — and actually get paid for it.</h2>
        <p style={{fontSize:14,color:C.mid,lineHeight:1.7,maxWidth:380,margin:"0 auto 24px"}}>Book a free 30-minute call with Ben. No pitch. No upsell. Just the honest conversation most people never have.</p>
        <a href="https://calendly.com/YOUR_LINK_HERE" style={{display:"inline-block",padding:"15px 32px",background:`linear-gradient(135deg,${C.terra},#E07050)`,color:C.white,borderRadius:10,textDecoration:"none",fontSize:15,fontWeight:600,fontFamily:SS,boxShadow:"0 4px 20px rgba(200,90,58,0.25)"}}>Book your free call with Ben</a>
        <p style={{fontSize:12,color:C.gray,marginTop:12}}>30 minutes. Honest. Free.</p>
      </Card>
      <p style={{fontSize:12,color:C.gray,textAlign:"center",lineHeight:1.8}}>Brought to you by <a href="https://recenterlife.com" style={{color:C.sage,textDecoration:"none",fontWeight:600}}>re:center</a> — a nervous system regulation lodge in Santa Teresa, Costa Rica.</p>
    </div>}
  </div>;
}
