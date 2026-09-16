import recipes from '../catalog/recipes.json' with {type:'json'};
import sides from '../catalog/dry-sides.json' with {type:'json'};
export const people=['Sireesha','Vamsi','Samhit','Sanvika','Rajamannar','Padma'];

export const catalog=recipes;
export const drySides=sides;
export const slots=['breakfast','lunch','snack','dinner'];
export const schedule=[['06:00','milk',['Sireesha','Samhit','Sanvika']],['07:00','breakfast',people],['09:00','milk',['Rajamannar','Padma']],['10:30','tea',['Sireesha','Vamsi']],['11:30','tea',['Rajamannar','Padma']],['12:00','lunch',people],['12:30','buttermilk',['Sireesha','Padma','Vamsi']],['16:00','snack',people],['16:30','milk',['Sireesha','Samhit','Sanvika']],['16:30','tea',['Vamsi','Rajamannar','Padma']],['19:00','dinner',people],['19:30','buttermilk',['Sireesha','Padma','Vamsi']]];
export const today=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kolkata',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
export const addDays=(day,n)=>new Date(Date.parse(day+'T12:00:00Z')+n*86400000).toISOString().slice(0,10);
export function dateOK(d){return /^\d{4}-\d{2}-\d{2}$/.test(d)&&!Number.isNaN(Date.parse(d+'T12:00:00Z'))&&addDays(d,0)===d}
export function safeRecipes(settings,slot){const excludes=(settings.excludes||[]).map(x=>x.toLowerCase());return catalog.filter(r=>r.slot===slot&&!r.allergens.some(a=>excludes.includes(a))&&!excludes.some(x=>r.name.en.toLowerCase().includes(x)||r.ingredients.some(i=>i.name.toLowerCase().includes(x))))}
export function generate(start,settings,existing=[],history=[]){
 const result=[],lastDate=new Map();
 for(const h of history.filter(h=>h.recipeId).sort((a,b)=>a.date.localeCompare(b.date)))lastDate.set(h.recipeId,h.date);
 for(let day=0;day<7;day++)for(const slot of slots){const date=addDays(start,day),saved=existing.find(x=>x.date===date&&x.slot===slot);if(saved&&(saved.confirmed||saved.started||saved.served)){result.push(saved);if(saved.recipeId)lastDate.set(saved.recipeId,date);continue}const pool=safeRecipes(settings,slot),r=pool.find(r=>!lastDate.has(r.id)||addDays(lastDate.get(r.id),14)<=date);if(!r){result.push({date,slot,recipeId:null,confirmed:false,conflict:'No dish fits the household restrictions without repeating within 14 days.'});continue}lastDate.set(r.id,date);result.push({date,slot,recipeId:r.id,confirmed:false,drySide:slot==='lunch'?drySides[day%drySides.length].id:null,liquid:slot==='lunch'?['Rasam','Kattu','Sambar'][day%3]:null})}
 return result;
}
export function services(plan,date,settings){return schedule.map(([time,kind,recipients],index)=>{const meal=plan.find(x=>x.date===date&&x.slot===kind),r=catalog.find(x=>x.id===meal?.recipeId),at=Date.parse(date+'T'+time+':00+05:30');return{id:date+'_'+index,date,time,kind,recipients,recipeId:r?.id||null,meal,at,prepAt:at-(r?(r.cook+r.lead):10)*60000,readyAt:at-(r?.cook||10)*60000,enabled:!slots.includes(kind)||Boolean(meal?.confirmed&&r),name:r?.name||{en:kind,te:kind==='milk'?'పాలు':kind==='tea'?'టీ':kind==='buttermilk'?'మజ్జిగ':kind,hi:kind==='milk'?'दूध':kind==='tea'?'चाय':kind==='buttermilk'?'छाछ':kind}}})}
export function groceryTotals(plans,settings){const totals=new Map(),factor=Object.values(settings.portions||{}).reduce((a,v)=>a+Number(v),0)||6;function add(name,qty,unit){const k=name+'|'+unit;totals.set(k,{name,unit,qty:Math.round(((totals.get(k)?.qty||0)+qty)*100)/100})}for(const m of plans.filter(m=>m.confirmed)){const r=catalog.find(r=>r.id===m.recipeId);r?.ingredients.forEach(i=>add(i.name,i.qty*factor,i.unit));if(m.slot==='lunch'){const side=drySides.find(d=>d.id===m.drySide);side?.ingredients?.forEach(i=>add(i.name,i.qty*factor,i.unit));add(m.liquid||'Rasam / Kattu / Sambar',150*2,'ml')}}return [...totals.values()]}
