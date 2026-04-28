import { useState, useRef, useEffect } from "react";

const C = {
  linen:"#F2EDE6",cream:"#FAF7F3",parchment:"#EDE7DC",dark:"#1C1612",mid:"#4A3F36",muted:"#8A7D72",light:"#C4B8AC",border:"#DDD5C8",sage:"#7A8E7C",sageDark:"#4E6250",clay:"#B06A50",white:"#FFFFFF",green:"#5A8A6A",greenPale:"#EBF2EC",amber:"#A07830",amberPale:"#F5EDD8",red:"#A04848",redPale:"#F5E8E8",
};
const SF="'Georgia',serif",SS="-apple-system,sans-serif";
const fmt=n=>"$"+Math.round(Math.abs(n)).toLocaleString();
const pct=n=>Math.round(n)+"%";
const cl=(v,lo,hi)=>Math.max(lo,Math.min(hi,v));

const Logo=()=><svg width="20" height="20" viewBox="0 0 22 22" fill="none"><ellipse cx="11" cy="11" rx="10" ry="5" stroke="#1C1612" strokeWidth="1.2" fill="none"/><circle cx="11" cy="11" r="2.5" fill="#1C1612"/></svg>;

function Gauge({value}){
  const s=cl(Math.round(value),-20,100),n=cl((s+20)/120,0,1),a=-135+n*270,r=65,cx=85,cy=82;
  const toR=d=>d*Math.PI/180;
  const arc=(s1,e1,col,w=8)=>{const x1=cx+r*Math.cos(toR(s1)),y1=cy+r*Math.sin(toR(s1)),x2=cx+r*Math.cos(toR(e1)),y2=cy+r*Math.sin(toR(e1));return <path d={`M${x1},${y1} A${r},${r},0,${e1-s1>180?1:0},1,${x2},${y2}`} fill="none" stroke={col} strokeWidth={w} strokeLinecap="round"/>;};
  const col=s>=42?C.green:s>=26?C.amber:C.red,lbl=s>=42?"Healthy":s>=26?"Thin":"Leaking";
  const nx=cx+(r-6)*Math.cos(toR(a)),ny=cy+(r-6)*Math.sin(toR(a));
  return <div style={{textAlign:"center"}}><svg width="170" height="110" viewBox="0 0 170 110">{arc(-135,135,C.border)}{arc(-135,-135+n*270,col)}<line x1={cx} y1={cy} x2={nx} y2={ny} stroke={col} strokeWidth="2" strokeLinecap="round"/><circle cx={cx} cy={cy} r={4} fill={col}/><text x={cx} y={cy+20} textAnchor="middle" fill={col} fontSize="24" fontFamily={SF}>{pct(s)}</text><text x={cx} y={cy+34} textAnchor="middle" fill={C.muted} fontSize="9.5" fontFamily={SS} letterSpacing="2">{lbl.toUpperCase()}</text></svg><p style={{fontSize:11,color:C.muted,fontFamily:SS,margin:0,letterSpacing:1}}>MARGIN SCORE</p></div>;
}

function Steps({cur,total}){
  return <div style={{display:"flex",alignItems:"center",justifyContent:"center",marginBottom:40}}>{Array.from({length:total}).map((_,i)=><div key={i} style={{display:"flex",alignItems:"center"}}><div style={{width:26,height:26,borderRadius:13,background:i<cur?C.sageDark:i===cur?C.dark:"transparent",border:`1px solid ${i<=cur?C.dark:C.border}`,display:"flex",alignItems:"center",justifyContent:"center"}}>{i<cur?<svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5l2.5 2.5 3.5-4" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>:<span style={{fontSize:10,color:i===cur?C.white:C.muted,fontFamily:SS}}>{i+1}</span>}</div>{i<total-1&&<div style={{width:36,height:1,background:i<cur?C.dark:C.border}}/>}</div>)}</div>;
}

function Slider({label,value,min,max,step=1,prefix="",suffix="",onChange,hint}){
  const n=((value-min)/(max-min))*100;
  return <div style={{marginBottom:32,position:"relative"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:10}}><span style={{fontSize:13,color:C.mid,fontFamily:SS,letterSpacing:0.3}}>{label}</span><span style={{fontSize:18,color:C.dark,fontFamily:SF}}>{prefix}{value.toLocaleString()}{suffix}</span></div><div style={{position:"relative",height:1,background:C.border,marginBottom:4}}><div style={{position:"absolute",left:0,top:0,height:"100%",width:`${n}%`,background:C.dark}}/><div style={{position:"absolute",top:"50%",left:`${n}%`,transform:"translate(-50%,-50%)",width:14,height:14,borderRadius:7,background:C.white,border:`1.5px solid ${C.dark}`,boxShadow:"0 1px 4px rgba(0,0,0,0.12)"}}/></div><input type="range" min={min} max={max} step={step} value={value} onChange={e=>onChange(Number(e.target.value))} style={{position:"absolute",opacity:0,width:"100%",height:"100%",cursor:"pointer",zIndex:2,top:0,left:0}}/>{hint&&<p style={{fontSize:11,color:C.muted,margin:"6px 0 0",fontFamily:SS,letterSpacing:0.3}}>{hint}</p>}</div>;
}

function Toggle({label,sub,checked,onChange}){
  return <div onClick={()=>onChange(!checked)} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 0",borderBottom:`1px solid ${C.border}`,cursor:"pointer",marginBottom:16}}><div><p style={{fontSize:13,color:C.dark,fontFamily:SS,margin:0}}>{label}</p>{sub&&<p style={{fontSize:11,color:C.muted,fontFamily:SS,margin:"3px 0 0"}}>{sub}</p>}</div><div style={{width:40,height:22,borderRadius:11,background:checked?C.dark:C.border,position:"relative",flexShrink:0,transition:"background 0.2s"}}><div style={{position:"absolute",top:3,left:checked?21:3,width:16,height:16,borderRadius:8,background:C.white,transition:"left 0.2s"}}/></div></div>;
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
  const [focused,setFocused]=useState(false);
  const top=useRef(null);
  useEffect(()=>{top.current?.scrollIntoView({behavior:"smooth",block:"start"});},[step]);

  const rev=guests*price,vCost=rev*(venue/100),fCost=rev*(food/100),tCost=rev*(travel/100);
  const mCost=mkt?rev*(mktPct/100):0,tmCost=time?days*8*75:0;
  const total=vCost+fCost+tCost+mCost+tmCost,profit=rev-total;
  const margin=rev>0?(profit/rev)*100:0,perGuest=guests>0?profit/guests:0;
  const hourly=time&&days>0?profit/(days*10):null;
  const tier=margin>=42?"strong":margin>=26?"thin":"leaking";
  const tc={strong:{col:C.green,bg:C.greenPale,msg:"You're running this well. The question now is whether it's repeatable — and whether the host is sustainable inside it."},thin:{col:C.amber,bg:C.amberPale,msg:"Thin margins are the silent tax on retreat leaders who price from intuition. You're not underpaid because you lack worth. You're underpaid because the structure isn't built right."},leaking:{col:C.red,bg:C.redPale,msg:"This is the number that explains the exhaustion. Sold out. Empty account. Depleted host. It's not a mindset problem — it's a math problem. And math problems have solutions."}}[tier];

  const submit=async()=>{
    if(!email.trim())return;
    setLoading(true);
    try{await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/retreat_leads`,{method:"POST",headers:{"Content-Type":"application/json","apikey":import.meta.env.VITE_SUPABASE_ANON_KEY,"Authorization":`Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,"Prefer":"return=minimal"},body:JSON.stringify({email,results:{guests,price,days,revenue:rev,profit,margin:Math.round(margin)},created_at:new Date().toISOString()})});}catch(e){}
    setLoading(false);setStep(3);
  };

  const D=<div style={{width:32,height:1,background:C.border,margin:"28px 0"}}/>;

  return <div ref={top} style={{background:C.cream,minHeight:"100vh",fontFamily:SS}}>
    <div style={{background:C.cream,borderBottom:`1px solid ${C.border}`,padding:"16px 28px"}}>
      <span style={{fontSize:13,color:C.muted,fontFamily:SF,letterSpacing:1,fontStyle:"italic"}}>re:center · Retreat Profit Calculator</span>
    </div>

    {step===0&&<div>
      <div style={{background:C.dark,padding:"72px 24px 64px",textAlign:"center"}}>
        <p style={{fontSize:10,color:"#6A5E54",letterSpacing:3,textTransform:"uppercase",margin:"0 0 24px"}}>For retreat leaders, hosts & community gatherers</p>
        <h1 style={{fontSize:"clamp(30px,5vw,50px)",fontWeight:400,color:"#F5F0EA",margin:"0 auto 20px",maxWidth:580,lineHeight:1.12,fontFamily:SF}}>Do you actually know if your retreat is profitable?</h1>
        <p style={{fontSize:17,color:"#9A8E84",maxWidth:440,margin:"0 auto 16px",lineHeight:1.8}}>Most retreat leaders price from the heart. The market prices from math. This tool shows you exactly where those two things collide — in under two minutes.</p>
        <p style={{fontSize:12,color:"#6A5E54",margin:"0 0 48px",letterSpacing:0.5}}>Free. No signup required.</p>
        <button onClick={()=>setStep(1)} style={{padding:"15px 40px",fontSize:13,letterSpacing:1.5,textTransform:"uppercase",background:"#F5F0EA",color:C.dark,border:"none",borderRadius:2,cursor:"pointer",fontFamily:SS,fontWeight:500}}>Calculate my numbers</button>
      </div>
      <div style={{background:C.linen,borderBottom:`1px solid ${C.border}`,padding:"28px 24px",display:"flex",justifyContent:"center",gap:"48px",flexWrap:"wrap"}}>
        {[["70%","of retreat hosts quit within 3 years","burnout + bad margins"],["$8,400","average revenue left on the table","per retreat"],["$23/hr","what most hosts actually take home","after real costs"]].map(([s,l,sub])=><div key={s} style={{textAlign:"center"}}><p style={{fontSize:26,color:C.dark,fontFamily:SF,margin:"0 0 5px"}}>{s}</p><p style={{fontSize:12,color:C.mid,margin:"0 0 3px",fontFamily:SS}}>{l}</p><p style={{fontSize:11,color:C.muted,margin:0,fontFamily:SS,fontStyle:"italic"}}>{sub}</p></div>)}
      </div>
      <div style={{maxWidth:520,margin:"0 auto",padding:"52px 24px"}}>
        <p style={{fontSize:18,color:C.dark,lineHeight:1.75,marginBottom:16,fontFamily:SF,fontStyle:"italic"}}>You're good at holding space. You're good at creating experiences that genuinely transform people.</p>
        <p style={{fontSize:15,color:C.mid,lineHeight:1.85,marginBottom:14}}>But then there's the other side — the marketing, the strategy, the finance. The margins, the hidden costs, what your real hourly rate is at the end of the day.</p>
        <p style={{fontSize:15,color:C.mid,lineHeight:1.85}}>Most retreat hosts don't even know if they're running a profitable business. This tool changes that.</p>
        {D}
        <p style={{fontSize:13,color:C.mid,lineHeight:1.8,fontFamily:SS}}>This tool is brought to you by <a href="https://recenterlife.com" style={{color:C.sageDark,textDecoration:"none",fontWeight:500}}>re:center</a> — a nervous system regulation lodge in Santa Teresa, Costa Rica that helps retreat leaders like you not only sell out, but run profitable businesses they can be proud of.</p>
      </div>
    </div>}

    {(step===1||step===2)&&<div style={{maxWidth:520,margin:"0 auto",padding:"48px 24px 80px"}}>
      <Steps cur={step-1} total={3}/>
      {step===1&&<><p style={{fontSize:10,color:C.muted,letterSpacing:2.5,textTransform:"uppercase",margin:"0 0 8px"}}>Step 1 of 3</p>
        <h2 style={{fontSize:26,fontWeight:400,color:C.dark,margin:"0 0 6px",fontFamily:SF}}>Your retreat</h2>
        <p style={{fontSize:13,color:C.muted,margin:"0 0 36px",lineHeight:1.6}}>We'll use this to calculate your revenue potential.</p>
        <Slider label="Number of guests" value={guests} min={4} max={40} onChange={setGuests}/>
        <Slider label="Price per guest" value={price} min={300} max={8000} step={100} prefix="$" onChange={setPrice} hint="Full retreat investment per person"/>
        <Slider label="Retreat length" value={days} min={2} max={14} onChange={setDays} suffix={days===1?" day":" days"}/>
        <div style={{background:C.linen,padding:"18px 20px",borderRadius:2,display:"flex",justifyContent:"space-between",alignItems:"center",margin:"8px 0 36px",border:`1px solid ${C.border}`}}>
          <span style={{fontSize:12,color:C.mid,fontFamily:SS,letterSpacing:0.3}}>Total revenue</span>
          <span style={{fontSize:22,color:C.dark,fontFamily:SF}}>{fmt(rev)}</span>
        </div>
        <button onClick={()=>setStep(2)} style={{width:"100%",padding:"15px",fontSize:12,letterSpacing:2,textTransform:"uppercase",background:C.dark,color:C.cream,border:"none",borderRadius:2,cursor:"pointer",fontFamily:SS}}>Next: Your costs →</button>
      </>}
      {step===2&&<><p style={{fontSize:10,color:C.muted,letterSpacing:2.5,textTransform:"uppercase",margin:"0 0 8px"}}>Step 2 of 3</p>
        <h2 style={{fontSize:26,fontWeight:400,color:C.dark,margin:"0 0 6px",fontFamily:SF}}>The real numbers</h2>
        <p style={{fontSize:13,color:C.muted,margin:"0 0 36px",lineHeight:1.6}}>You're working with <strong style={{color:C.dark}}>{fmt(rev)}</strong> in total revenue. Drag each slider to match your actual costs.</p>
        <Slider label="Venue & accommodation" value={venue} min={10} max={65} onChange={setVenue} suffix="%" hint={`Lodge/property rental · Industry avg 30–45% · = ${fmt(vCost)}`}/>
        <Slider label="Food & beverage" value={food} min={5} max={40} onChange={setFood} suffix="%" hint={`Meals, snacks, coffee for all guests · Industry avg 15–25% · = ${fmt(fCost)}`}/>
        <Slider label="Travel & logistics" value={travel} min={0} max={25} onChange={setTravel} suffix="%" hint={`Flights, transfers, incidentals · = ${fmt(tCost)}`}/>
        <div style={{margin:"8px 0 24px"}}>
          <Toggle label="Include marketing costs" sub={`${mktPct}% of revenue`} checked={mkt} onChange={setMkt}/>
          {mkt&&<div style={{paddingTop:8}}><Slider label="Marketing %" value={mktPct} min={3} max={35} onChange={setMktPct} suffix="%"/></div>}
          <Toggle label="Count your own time" sub="Your energy is a resource. Not a donation." checked={time} onChange={setTime}/>
          {time&&<p style={{fontSize:11,color:C.muted,margin:"0 0 16px",fontFamily:SS}}>Valued at $75/hr · {days} days · 8 hrs/day = {fmt(tmCost)}</p>}
        </div>
        <div style={{display:"flex",gap:12}}>
          <button onClick={()=>setStep(1)} style={{padding:"15px 24px",fontSize:12,letterSpacing:1.5,textTransform:"uppercase",background:"transparent",color:C.dark,border:`1px solid ${C.border}`,borderRadius:2,cursor:"pointer",fontFamily:SS}}>← Back</button>
          <button onClick={()=>setStep(2.5)} style={{flex:1,padding:"15px",fontSize:12,letterSpacing:2,textTransform:"uppercase",background:C.dark,color:C.cream,border:"none",borderRadius:2,cursor:"pointer",fontFamily:SS}}>See my results →</button>
        </div>
      </>}
    </div>}

    {step===2.5&&<div style={{maxWidth:480,margin:"0 auto",padding:"48px 24px 80px"}}>
      <Steps cur={2} total={3}/>
      <div style={{background:C.linen,border:`1px solid ${C.border}`,borderRadius:2,padding:"36px 28px"}}>
        <p style={{fontSize:10,color:C.muted,letterSpacing:2.5,textTransform:"uppercase",margin:"0 0 20px"}}>Your results are ready</p>
        <h2 style={{fontSize:26,fontWeight:400,color:C.dark,margin:"0 0 12px",fontFamily:SF,lineHeight:1.3}}>The number that changes everything is one field away.</h2>
        <p style={{fontSize:13,color:C.muted,margin:"0 0 28px",lineHeight:1.7}}>Drop your email. See your full profitability breakdown — and get a free guide on pricing your retreat with confidence.</p>
        <div style={{background:C.cream,padding:"14px 16px",borderRadius:2,marginBottom:24,border:`1px solid ${C.border}`}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:12,color:C.muted,fontFamily:SS}}>Estimated profit</span><span style={{fontSize:16,color:profit>=0?C.green:C.red,fontFamily:SF}}>{profit<0?"-":""}{fmt(profit)}</span></div>
          <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:12,color:C.muted,fontFamily:SS}}>On {fmt(rev)} revenue</span><span style={{fontSize:12,color:C.muted,fontFamily:SS}}>Margin ~{pct(margin)}</span></div>
        </div>
        <input type="email" placeholder="your@email.com" value={email} onChange={e=>setEmail(e.target.value)} onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)} onKeyDown={e=>e.key==="Enter"&&submit()} style={{width:"100%",padding:"14px 16px",fontSize:14,border:`1px solid ${focused?C.dark:C.border}`,borderRadius:2,background:C.white,color:C.dark,fontFamily:SS,outline:"none",boxSizing:"border-box",marginBottom:10,transition:"border-color 0.2s"}}/>
        <button onClick={submit} disabled={!email.trim()||loading} style={{width:"100%",padding:"15px",fontSize:12,letterSpacing:2,textTransform:"uppercase",background:C.dark,color:C.cream,border:"none",borderRadius:2,cursor:email.trim()?"pointer":"not-allowed",fontFamily:SS,opacity:!email.trim()||loading?0.5:1}}>{loading?"Loading...":"Show me my numbers"}</button>
        <p style={{fontSize:11,color:C.muted,textAlign:"center",margin:"12px 0 0",fontFamily:SS}}>No spam. Unsubscribe anytime.</p>
      </div>
    </div>}

    {step===3&&<div style={{maxWidth:560,margin:"0 auto",padding:"48px 24px 80px"}}>
      <div style={{background:C.dark,borderRadius:2,padding:"36px 28px",marginBottom:16}}>
        <p style={{fontSize:10,color:C.muted,letterSpacing:2.5,textTransform:"uppercase",margin:"0 0 24px"}}>Your profit report</p>
        <div style={{display:"flex",justifyContent:"center",marginBottom:24}}><Gauge value={margin}/></div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:1,background:"#2C2420"}}>
          {[["Revenue",fmt(rev),null],["Net profit",(profit<0?"-":"")+fmt(profit),profit>=0?C.green:C.red],["Per guest",fmt(perGuest),null],...(hourly?[["Hourly rate",`${fmt(hourly)}/hr`,null]]:[])].map(([l,v,c])=><div key={l} style={{background:"#1C1612",padding:"16px 18px"}}><p style={{fontSize:10,color:C.muted,margin:"0 0 6px",fontFamily:SS,letterSpacing:1.5,textTransform:"uppercase"}}>{l}</p><p style={{fontSize:18,color:c||C.cream,fontFamily:SF,margin:0}}>{v}</p></div>)}
        </div>
      </div>
      <div style={{background:tc.bg,border:`1px solid ${tc.col}40`,borderRadius:2,padding:"22px 24px",marginBottom:16}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}><div style={{width:8,height:8,borderRadius:4,background:tc.col}}/><span style={{fontSize:10,color:tc.col,fontWeight:600,letterSpacing:2,textTransform:"uppercase"}}>Margin verdict</span></div>
        <p style={{fontSize:14,color:C.mid,lineHeight:1.8,margin:0,fontFamily:SS}}>{tc.msg}</p>
      </div>
      <div style={{background:C.linen,border:`1px solid ${C.border}`,borderRadius:2,padding:"24px",marginBottom:16}}>
        <p style={{fontSize:10,color:C.muted,letterSpacing:2,textTransform:"uppercase",margin:"0 0 20px"}}>Cost breakdown</p>
        {[[vCost,"Venue & accommodation",C.clay],[fCost,"Food & beverage",C.sage],[tCost,"Travel & logistics",C.amber],...(mkt?[[mCost,"Marketing",C.sageDark]]:[]),...(time?[[tmCost,"Your time",C.mid]]:[])].map(([amt,lbl,col])=><div key={lbl} style={{marginBottom:14}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:12,color:C.mid,fontFamily:SS}}>{lbl}</span><span style={{fontSize:12,color:C.dark,fontFamily:SS,fontWeight:500}}>{fmt(amt)}</span></div><div style={{height:3,background:C.border,borderRadius:1}}><div style={{height:"100%",width:`${cl((amt/total)*100,0,100)}%`,background:col,borderRadius:1}}/></div></div>)}
        <div style={{display:"flex",justifyContent:"space-between",paddingTop:14,marginTop:6,borderTop:`1px solid ${C.border}`}}><span style={{fontSize:13,color:C.dark,fontFamily:SS}}>Total costs</span><span style={{fontSize:13,color:C.dark,fontFamily:SS,fontWeight:600}}>{fmt(total)}</span></div>
      </div>
      <div style={{border:`1px solid ${C.border}`,borderRadius:2,padding:"36px 28px",textAlign:"center",background:C.cream}}>
        <p style={{fontSize:10,color:C.muted,letterSpacing:2.5,textTransform:"uppercase",margin:"0 0 16px"}}>Free 30-minute call</p>
        <h2 style={{fontSize:24,fontWeight:400,color:C.dark,fontFamily:SF,margin:"0 0 12px",lineHeight:1.3}}>Learn how to sell out your retreat — and actually get paid for it.</h2>
        <p style={{fontSize:14,color:C.mid,lineHeight:1.75,maxWidth:380,margin:"0 auto 28px",fontFamily:SS}}>Book a free call with Ben. He's worked with retreat leaders across four continents on exactly this gap. No pitch. Just the honest conversation most people never have.</p>
        <a href="https://calendly.com/yobenlee/re-setos-discovery-call" style={{display:"inline-block",padding:"15px 36px",background:C.dark,color:C.cream,borderRadius:2,textDecoration:"none",fontSize:12,fontWeight:500,fontFamily:SS,letterSpacing:2,textTransform:"uppercase"}}>Book your free call with Ben</a>
        <p style={{fontSize:11,color:C.muted,marginTop:14,fontFamily:SS}}>30 minutes. Honest. Free.</p>
      </div>
      <p style={{fontSize:11,color:C.muted,textAlign:"center",margin:"28px 0 0",lineHeight:1.8,fontFamily:SS}}>Brought to you by <a href="https://recenterlife.com" style={{color:C.sageDark,textDecoration:"none"}}>re:center</a> — a nervous system regulation lodge in Santa Teresa, Costa Rica.</p>
    </div>}
  </div>;
}
