import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { T } from '../theme.js';
import { TOPICS } from '../data/topics.js';
import { CATEGORIES } from '../data/categories.js';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [filter, setFilter] = useState('all');

  const results = useMemo(() => {
    const q = query.toLowerCase();
    return TOPICS.filter(t => {
      const matchQ = !q || t.title.toLowerCase().includes(q) || t.tags.some(tag=>tag.toLowerCase().includes(q)) || t.overview.toLowerCase().includes(q);
      const matchF = filter === 'all' || t.cat === filter;
      return matchQ && matchF;
    });
  }, [query, filter]);

  return (
    <div style={{ maxWidth:1100,margin:'0 auto',padding:'20px 20px 60px' }}>
      <h1 style={{ fontSize:24,fontWeight:700,color:T.t0,marginBottom:18 }}>Search Topics</h1>
      <div style={{ display:'flex',gap:10,marginBottom:18,flexWrap:'wrap' }}>
        <input value={query} onChange={e=>setSearchParams(e.target.value?{q:e.target.value}:{})} placeholder="Search topics, tags, concepts..."
          style={{ flex:1,minWidth:240,padding:'9px 14px',borderRadius:8,border:`1px solid ${T.bd}`,background:T.s1,color:T.t0,fontSize:14 }}/>
        <div style={{ display:'flex',gap:5,flexWrap:'wrap' }}>
          {[{id:'all',label:'All',color:T.t2},...CATEGORIES].map(c=>(
            <button key={c.id} onClick={()=>setFilter(c.id)}
              style={{ padding:'5px 12px',borderRadius:16,border:`1px solid ${filter===c.id?(c.color||T.cy):T.bd}`,background:filter===c.id?(c.color||T.cy)+'20':'transparent',color:filter===c.id?(c.color||T.cy):T.t2,cursor:'pointer',fontSize:11,fontWeight:filter===c.id?700:400 }}>
              {c.icon&&<span style={{marginRight:3}}>{c.icon}</span>}{c.label}
            </button>
          ))}
        </div>
      </div>
      <div style={{ color:T.t2,fontSize:12,marginBottom:14 }}>{results.length} result{results.length!==1?'s':''}{query?` for "${query}"`:''}</div>
      <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:12 }}>
        {results.map(topic=>(
          <Link key={topic.id} to={`/topic/${topic.id}`}
            style={{ textDecoration:'none',display:'block',padding:16,borderRadius:10,background:T.s1,border:`1px solid ${topic.color}25`,color:'inherit',transition:'all .18s' }}
            onMouseEnter={e=>{e.currentTarget.style.border=`1px solid ${topic.color}70`;e.currentTarget.style.background=T.s2;}}
            onMouseLeave={e=>{e.currentTarget.style.border=`1px solid ${topic.color}25`;e.currentTarget.style.background=T.s1;}}>
            <div style={{ display:'flex',justifyContent:'space-between',marginBottom:7 }}>
              <span style={{ fontSize:20 }}>{topic.icon}</span>
              {topic.viz&&topic.viz!=='none'&&<span style={{ fontSize:10,padding:'1px 6px',borderRadius:8,background:T.gn+'15',color:T.gn,border:`1px solid ${T.gn}25` }}>▶</span>}
            </div>
            <div style={{ fontSize:13,fontWeight:700,color:topic.color,marginBottom:4 }}>{topic.title}</div>
            <div style={{ fontSize:11,color:T.t2,lineHeight:1.5,marginBottom:8 }}>{topic.overview.slice(0,90)}...</div>
            <div style={{ display:'flex',gap:3,flexWrap:'wrap' }}>
              {topic.tags.slice(0,3).map(tag=><span key={tag} style={{ fontSize:9,padding:'1px 5px',borderRadius:7,background:topic.color+'12',color:topic.color,border:`1px solid ${topic.color}20` }}>{tag}</span>)}
            </div>
          </Link>
        ))}
        {results.length===0&&<div style={{ gridColumn:'1/-1',textAlign:'center',padding:'60px 0',color:T.t3 }}>No topics found. Try a different search term.</div>}
      </div>
    </div>
  );
}
