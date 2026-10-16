import { z } from 'zod';
import { workData } from '@/content/works';
import { authorData } from '@/content/authors';
import { sourceData } from '@/content/sources';
import { mediaData } from '@/content/media';
import { excerptData } from '@/content/excerpts';
import inventory from '@/content/curriculum/inventory.json';
import { authorSchema, curriculumSchema, excerptSchema, mediaSchema, sourceSchema, workSchema, type Work } from './validation';
export const allWorks=z.array(workSchema).parse(workData);
export const works=allWorks.filter(w=>w.status==='published');
export const allAuthors=z.array(authorSchema).parse(authorData);
export const authors=allAuthors.filter(a=>a.status==='published');
export const sources=z.array(sourceSchema).parse(sourceData);
export const media=z.array(mediaSchema).parse(mediaData);
export const excerpts=z.array(excerptSchema).parse(excerptData);
export const curriculum=z.array(curriculumSchema).parse(inventory);
export const normalize=(s:string)=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D').toLowerCase();
export function entryFor(w:Work){return curriculum.find(e=>w.curriculumId?e.id===w.curriculumId:normalize(e.workTitle)===normalize(w.title));}
export function authorFor(w:Work){return authors.find(a=>a.id===w.authorIds[0])!;}
export function sourcesFor(ids:string[]){return sources.filter(s=>ids.includes(s.id));}
export const genres=Array.from(new Map(works.map(w=>[w.genreSlug,{slug:w.genreSlug,name:w.genre}])).values());
export const topics=Array.from(new Set(works.flatMap(w=>w.topics)));
export function relatedTo(w:Work){return works.filter(x=>x.id!==w.id&&(x.genre===w.genre||x.topics.some(t=>w.topics.includes(t)))).slice(0,3);}
for(const w of works){
 if(!entryFor(w)||entryFor(w)!.includeDecision!=='include') throw new Error(`Tác phẩm ngoài phạm vi được chọn: ${w.id}`);
 for(const id of w.authorIds) if(!authors.some(a=>a.id===id)) throw new Error(`Thiếu tác giả ${id}`);
 for(const id of [...w.sourceIds,...w.sections.flatMap(s=>s.sourceIds),...w.sections.flatMap(s=>s.units?.map(u=>u.sourceId)??[])]) if(!sources.some(s=>s.id===id)) throw new Error(`Thiếu nguồn ${id}`);
 if(w.mediaId&&!media.some(m=>m.id===w.mediaId))throw new Error(`Thiếu ảnh ${w.mediaId}`);
}
