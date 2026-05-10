import { PHI, GOLDEN_ANGLE, DEG } from "../data/atlasConstants.js";
export { PHI, GOLDEN_ANGLE, DEG };
export function digitalRoot(n){ if(!Number.isFinite(n)||n<=0) return 0; return ((Math.trunc(n)-1)%9)+1; }
export function sectorFromAngle(theta){ const a=((theta%360)+360)%360; if(a>=90&&a<210) return 1; if(a>=210&&a<330) return 2; return 3; }
export function bandFromZ(z){ if(z<=2) return 1; if(z<=10) return 2; if(z<=18) return 3; if(z<=36) return 4; if(z<=54) return 5; return 6; }
export function heatColor(value,min,max){ if(value===null||value===undefined||Number.isNaN(value)||!Number.isFinite(value)) return "#e5e7eb"; const safeMin=Number.isFinite(min)?min:0; const safeMax=Number.isFinite(max)&&max!==safeMin?max:safeMin+1; const t=Math.max(0,Math.min(1,(value-safeMin)/(safeMax-safeMin))); const hue=220-180*t; return `hsl(${hue}, 78%, 76%)`; }
export function nearestMagic(value,magicNumbers){ const pool=Array.isArray(magicNumbers)&&magicNumbers.length?magicNumbers:[value]; let best=pool[0]; let distance=Math.abs(value-best); pool.forEach((c)=>{ const d=Math.abs(value-c); if(d<distance){best=c;distance=d;} }); return { value: best, distance }; }
export function parityLabel(z,n){ const zp=Math.abs(Math.trunc(z))%2===0?"even":"odd"; const np=Math.abs(Math.trunc(n))%2===0?"even":"odd"; return `${zp}-${np}`; }
