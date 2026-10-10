(function(){
var S=window.SONG;
if(window.Shell&&!document.getElementById("chart"))Shell.mount({base:"../",current:"resources",keybar:true,main:"<p><a href=\"index.html\">&larr; All resources</a></p><h2 id=\"songTitle\"></h2><p class=\"lead\" id=\"songMeta\"></p><div class=\"capobox\"><div class=\"kv\"><span>Key</span><b id=\"kKey\"></b></div><div class=\"kv\"><span>Capo</span><b id=\"kCapo\"></b></div></div><div class=\"shapes\"><span>Play shapes in</span><div class=\"keys\" id=\"shapes\"></div></div><div id=\"chart\"></div><p class=\"lead\" style=\"margin-top:18px\">Chords shown are the shapes you play with the capo. Pick a key above and the capo changes so the song sounds in that key.</p>"});
var SHARP=["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"],FLAT=["C","Db","D","Eb","E","F","Gb","G","Ab","A","Bb","B"];
var KEYS=[["C",0],["Db",1],["D",2],["Eb",3],["E",4],["F",5],["F#",6],["G",7],["Ab",8],["A",9],["Bb",10],["B",11]],FLATKEYS=[1,3,5,8,10],OFF=[0,2,4,5,7,9,11];
var key=0;KEYS.forEach(function(k){if(k[0]===S.key)key=k[1]});
var SH=[["G",7],["D",2],["C",0],["A",9],["E",4]],shape=7;
if(S.capo!=null)shape=((key-S.capo)%12+12)%12;else if(S.shapes)SH.forEach(function(x){if(x[0]===S.shapes)shape=x[1]});
if(!SH.some(function(x){return x[1]===shape}))SH.push([SHARP[shape],shape]);
function nm(i){return (FLATKEYS.indexOf(key)>-1?FLAT:SHARP)[((i%12)+12)%12]}
function sn(i){return (FLATKEYS.indexOf(shape)>-1?FLAT:SHARP)[((i%12)+12)%12]}
function acc(a){return (a==="b"||a==="\u266d")?-1:(a==="#"||a==="\u266f")?1:0}
function chord(t){var m=t.match(/^([b#\u266d\u266f]?)([1-7])(m?)([^\/]*)(?:\/([b#\u266d\u266f]?)([1-7]))?$/);if(!m)return t;
  var r=sn(shape+OFF[m[2]-1]+acc(m[1]))+m[3]+m[4];if(m[6])r+="/"+sn(shape+OFF[m[6]-1]+acc(m[5]));return r}
function show(c){return c.replace(/b(?=[1-7])/g,"\u266d").replace(/#(?=[1-7])/g,"\u266f")}
function capo(){
  var f=((key-shape)%12+12)%12;
  var kk=document.getElementById("kKey"),kc=document.getElementById("kCapo");
  if(kk)kk.textContent=nm(key);
  if(kc)kc.textContent=f===0?"None":f+(f>7?" (high)":"");
  [].forEach.call(document.querySelectorAll("#shapes button"),function(b){b.setAttribute("aria-pressed",String(+b.dataset.k===shape))});
}
function render(){
  capo();
  document.getElementById("chart").innerHTML=S.sections.map(function(s){
    return '<div class="sec"><h3>'+s.name+'</h3>'+s.lines.map(function(l){
      return '<div class="ln"><div class="ch">'+l.c.split(" ").map(function(t){return '<span class="c">'+chord(t)+'</span>'}).join("")+'<div class="nums">'+l.c+'</div></div>'+(l.t?'<p>'+l.t+'</p>':'')+'</div>';
    }).join("")+'</div>';
  }).join("");
  [].forEach.call(document.querySelectorAll("#keys button"),function(b){b.setAttribute("aria-pressed",String(+b.dataset.k===key))});
}
document.getElementById("songTitle").textContent=S.title;
document.getElementById("songMeta").innerHTML='<span class="meta">'+S.writers+'</span><br><span class="meta">Original key: '+S.key+'. Order: '+S.structure+'.</span>';
document.title=S.title+" chords";
var kb=document.getElementById("keys");
KEYS.forEach(function(k){var b=document.createElement("button");b.textContent=k[0];b.dataset.k=k[1];
  b.addEventListener("click",function(){key=k[1];render()});kb.appendChild(b)});
var sb=document.getElementById("shapes");
if(sb)SH.forEach(function(x){var b=document.createElement("button");b.textContent=x[0];b.dataset.k=x[1];
  b.addEventListener("click",function(){shape=x[1];render()});sb.appendChild(b)});
render();
})();

/* Auto-scroll: tap to start, tap again to go faster, Stop to end. Touching or scrolling the page also stops it. */
(function(){
var SPEEDS=[20,40,70,110,160],lvl=0,raf=0,last=0,acc=0;
var st=document.createElement("style");
st.textContent=".autoscroll{position:fixed;right:max(16px,env(safe-area-inset-right,0px));bottom:max(16px,calc(env(safe-area-inset-bottom,0px) + 8px));z-index:6;display:flex;gap:8px}"+
".autoscroll button{font:500 .95rem Figtree,system-ui,sans-serif;min-height:44px;padding:0 16px;border:0;border-radius:999px;background:var(--chip-on);color:var(--chip-on-ink);cursor:pointer;box-shadow:0 2px 10px rgba(0,0,0,.35)}"+
"#asStop{background:var(--chip);color:var(--ink)}.autoscroll button[hidden]{display:none}";
document.head.appendChild(st);
document.body.insertAdjacentHTML("beforeend",'<div class="autoscroll" id="autoscroll"><button type="button" id="asStop" hidden>Stop</button><button type="button" id="asGo">Auto-scroll</button></div>');
var go=document.getElementById("asGo"),stp=document.getElementById("asStop");
function label(){
  go.textContent=lvl===0?"Auto-scroll":lvl===SPEEDS.length?"Speed "+lvl+" (max)":"Speed "+lvl+" +";
  go.setAttribute("aria-label",lvl===0?"Start auto-scroll":"Auto-scroll speed "+lvl+" of "+SPEEDS.length+(lvl<SPEEDS.length?", tap for faster":""));
  stp.hidden=lvl===0;
}
function tick(t){
  if(!lvl)return;
  if(last){acc+=SPEEDS[lvl-1]*(t-last)/1000;var d=Math.floor(acc);if(d>0){window.scrollBy({top:d,left:0,behavior:"instant"});acc-=d}}
  last=t;
  if(window.innerHeight+window.scrollY>=document.documentElement.scrollHeight-2){stop();return}
  raf=requestAnimationFrame(tick);
}
function stop(){lvl=0;cancelAnimationFrame(raf);raf=0;label()}
go.addEventListener("click",function(){if(lvl<SPEEDS.length)lvl++;label();if(!raf){last=0;acc=0;raf=requestAnimationFrame(tick)}});
stp.addEventListener("click",stop);
function user(e){if(lvl&&!(e.target.closest&&e.target.closest("#autoscroll")))stop()}
["wheel","touchstart","keydown"].forEach(function(n){window.addEventListener(n,user,{passive:true})});
label();
})();
