import {readFile} from 'node:fs/promises';

const read=async file=>JSON.parse(await readFile(new URL(`../catalog/${file}`,import.meta.url),'utf8'));
const [recipes,sides,policy]=await Promise.all([read('recipes.json'),read('dry-sides.json'),read('catalog-policy.json')]);
const errors=[];
const languages=policy.languages||['en','te','hi'];
const nonempty=(x,label)=>{if(!x||typeof x!=='string')errors.push(`${label} is missing`)};
const translations=(x,label)=>languages.forEach(lang=>nonempty(x?.[lang],`${label}.${lang}`));
const validateDish=(dish,label)=>{
  nonempty(dish.id,`${label}.id`);
  translations(dish.name,`${label}.name`);
  translations(dish.prep,`${label}.prep`);
  if(!Array.isArray(dish.ingredients)||!dish.ingredients.length)errors.push(`${label}.ingredients must not be empty`);
  for(const [i,item] of (dish.ingredients||[]).entries()){
    nonempty(item.name,`${label}.ingredients[${i}].name`);
    if(!(Number(item.qty)>0))errors.push(`${label}.ingredients[${i}].qty must be positive`);
    nonempty(item.unit,`${label}.ingredients[${i}].unit`);
  }
  if(!Array.isArray(dish.videos)||dish.videos.length<2)errors.push(`${label}.videos needs at least two sources`);
  for(const [i,video] of (dish.videos||[]).entries()){
    nonempty(video.title,`${label}.videos[${i}].title`);
    if(!/^https:\/\//.test(video.url||''))errors.push(`${label}.videos[${i}].url must use HTTPS`);
  }
};

const ids=new Set();
for(const [i,dish] of [...recipes,...sides].entries()){
  validateDish(dish,`dish[${i}]`);
  if(ids.has(dish.id))errors.push(`duplicate id: ${dish.id}`);
  ids.add(dish.id);
}
const slots=['breakfast','lunch','snack','dinner'];
for(const [i,dish] of recipes.entries())if(!slots.includes(dish.slot))errors.push(`recipes[${i}].slot is invalid`);
for(const slot of slots){
  const count=recipes.filter(x=>x.slot===slot).length;
  if(count<(policy.minimumRecipesPerMealSlot||14))errors.push(`${slot} has ${count} recipes; minimum is ${policy.minimumRecipesPerMealSlot}`);
}
for(const [i,side] of sides.entries()){
  nonempty(side.style,`dry-sides[${i}].style`);
  const primary=side.ingredients?.[0]?.name;
  nonempty(side.vegetable||primary,`dry-sides[${i}].vegetable`);
  if(side.form&&!['dry','gravy'].includes(side.form))errors.push(`dry-sides[${i}].form must be dry or gravy`);
}
if(errors.length){console.error(`Recipe catalogue validation failed (${errors.length}):\n- ${errors.join('\n- ')}`);process.exit(1)}
const counts=Object.fromEntries(slots.map(slot=>[slot,recipes.filter(x=>x.slot===slot).length]));
console.log(`Recipe catalogue OK: ${recipes.length} meals, ${sides.length} vegetable recipes, slots ${JSON.stringify(counts)}, version ${policy.catalogVersion}.`);
