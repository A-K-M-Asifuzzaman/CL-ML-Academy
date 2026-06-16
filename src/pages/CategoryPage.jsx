import { Link, useParams } from 'react-router-dom';
import { T } from '../theme.js';
import { getCategoryById } from '../data/categories.js';
import { getTopicsByCategory } from '../data/topics.js';

export default function CategoryPage() {
  const { catId } = useParams();
  const cat = getCategoryById(catId);
  const topics = getTopicsByCategory(catId);
  if (!cat) return <div style={{ color:T.t2,padding:40,textAlign:'center' }}>Category not found.</div>;
  return (
    <div style={{ maxWidth:1100,margin:'0 auto',padding:'0 20px 60px' }}>
      <div style={{ padding:'32px 0 24px' }}>
        <Link to="/" style={{ fontSize:12,color:T.t2,textDecoration:'none',marginBottom:16,display:'inline-block' }}>← Back to Home</Link>
        <div style={{ display:'flex',alignItems:'center',gap:16,marginBottom:16 }}>
          <div style={{ fontSize:40 }}>{cat.icon}</div>
          <div>
            <h1 style={{ margin:0,fontSize:28,fontWeight:800,color:cat.color }}>{cat.label}</h1>
            <p style={{ margin:0,color:T.t2,fontSize:14 }}>{cat.description}</p>
          </div>
        </div>
        <div style={{ display:'flex',gap:10,flexWrap:'wrap' }}>
          <span style={{ fontSize:12,padding:'3px 10px',borderRadius:12,background:cat.color+'20',color:cat.color,border:`1px solid ${cat.color}40` }}>{topics.length} topics</span>
          <span style={{ fontSize:12,padding:'3px 10px',borderRadius:12,background:T.gn+'15',color:T.gn,border:`1px solid ${T.gn}30` }}>▶ {topics.filter(t=>t.viz&&t.viz!=='none').length} with live visualizer</span>
        </div>
      </div>
      <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:14 }}>
        {topics.map(topic=>(
          <Link key={topic.id} to={`/topic/${topic.id}`}
            style={{ textDecoration:'none',display:'block',padding:18,borderRadius:12,background:T.s1,border:`1px solid ${topic.color}25`,transition:'all .2s',color:'inherit',position:'relative',overflow:'hidden' }}
            onMouseEnter={e=>{e.currentTarget.style.border=`1px solid ${topic.color}70`;e.currentTarget.style.background=T.s2;e.currentTarget.style.transform='translateY(-2px)';}}
            onMouseLeave={e=>{e.currentTarget.style.border=`1px solid ${topic.color}25`;e.currentTarget.style.background=T.s1;e.currentTarget.style.transform='translateY(0)';}}>
            <div style={{ position:'absolute',top:0,right:0,width:44,height:44,borderRadius:'0 12px 0 44px',background:topic.color+'12' }}/>
            <div style={{ display:'flex',justifyContent:'space-between',marginBottom:8 }}>
              <span style={{ fontSize:24 }}>{topic.icon}</span>
              {topic.viz&&topic.viz!=='none'&&<span style={{ fontSize:10,padding:'2px 7px',borderRadius:10,background:T.gn+'18',color:T.gn,border:`1px solid ${T.gn}30` }}>▶ Interactive</span>}
            </div>
            <div style={{ fontSize:15,fontWeight:700,color:topic.color,marginBottom:5 }}>{topic.title}</div>
            <div style={{ fontSize:12,color:T.t2,lineHeight:1.5,marginBottom:10 }}>{topic.overview.slice(0,100)}...</div>
            <div style={{ display:'flex',gap:4,flexWrap:'wrap' }}>
              {topic.tags.slice(0,3).map(tag=><span key={tag} style={{ fontSize:9,padding:'2px 7px',borderRadius:8,background:topic.color+'12',color:topic.color,border:`1px solid ${topic.color}20` }}>{tag}</span>)}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
