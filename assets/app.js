(function(){
var SHARP=["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
var FLAT=["C","Db","D","Eb","E","F","Gb","G","Ab","A","Bb","B"];
var KEYS=[["C",0],["D",2],["E",4],["F",5],["G",7],["A",9],["Bb",10]];
var FLATKEYS=[5,10,3,8];
var key=7;
var CH={"I":[0,""],"ii":[2,"m"],"iii":[4,"m"],"IV":[5,""],"V":[7,""],"vi":[9,"m"],"iv":[5,"m"],"I7":[0,"7"]};
var PROGS=[
["The classic","I V vi IV","Anthemic and uplifting"],
["The emotional one","vi IV I V","Reflective, heartfelt"],
["Simple and strong","I IV V","Hymn-like, congregational"],
["Gentle build","I vi IV V","Warm and prayerful"],
["Rising praise","IV I V vi","Open and celebratory"],
["Slow and worshipful","I iii IV V","Tender and flowing"]];
var HYMNS=[
["Amen ending","IV I","Plagal cadence, the sound of \u201cAmen\u201d"],
["Resolving a verse","V I","The strongest way home"],
["Turnaround","I vi ii V","Hymn verses and transitions"],
["Gospel feel","I I7 IV iv I","Traditional and gospel style"],
["12-bar style","I I I I / IV IV I I / V IV I I","Upbeat gospel and praise"]];
var STRUMS=[
["Slow ballad","60\u201370 BPM","D,,D,D,,U,,D,U".split(","),["D","","D","","D","U","","U"],"Communion, reflective songs"],
["Mid-tempo","70\u201390 BPM",null,["D","","D","U","","U","D","U"],"Most worship songs"],
["Driving","90\u2013120 BPM",null,["D","D","D","U","","U","D","U"],"Upbeat praise"],
["Hymn style","80\u2013100 BPM",null,["D","","D","","D","","D",""],"Traditional hymns"]];
STRUMS[0][3]=["D","","D","","D","U","","U"];

function nm(i){var a=FLATKEYS.indexOf(key)>-1?FLAT:SHARP;return a[((i%12)+12)%12]}
function chord(tok){var d=CH[tok];return nm(key+d[0])+d[1]}
function chips(seq){
  return seq.split(" ").map(function(t){
    if(t==="/")return '<span class="slash" aria-hidden="true">/</span>';
    return '<span class="c">'+chord(t)+'</span>';
  }).join("");
}
function num(s){var M={"I":"1","ii":"2m","iii":"3m","IV":"4","V":"5","vi":"6m","iv":"4m","I7":"1<sup>7</sup>"};return s.split(" ").map(function(t){return M[t]||t}).join(" ")}
function rows(list,id){
  document.getElementById(id).innerHTML=list.map(function(p){
    return '<div class="row"><div class="nm">'+p[0]+'<small>'+p[2]+'</small></div><div class="ch">'+chips(p[1])+'<div class="nums">'+num(p[1])+'</div></div></div>';
  }).join("");
}
function scale(){
  var degs=[["1",0,""],["2m",2,"m"],["3m",4,"m"],["4",5,""],["5",7,""],["6m",9,"m"],["7\u00b0",11,"dim"]];
  var h='<tr><th>Number</th>'+degs.map(function(d){return '<th>'+d[0]+'</th>'}).join("")+'</tr><tr><td class="maj">Chord</td>';
  h+=degs.map(function(d,i){return '<td class="'+(i==0||i==3||i==4?'hl':'')+'"><b>'+nm(key+d[1])+d[2]+'</b></td>'}).join("")+'</tr>';
  document.getElementById("scaleTbl").innerHTML=h;
}
function capo(){
  var shapes=[["G",7],["D",2],["C",0],["A",9],["E",4]];
  var h='<tr><th>Play shapes in</th><th>Capo fret</th><th>First chords</th></tr>';
  shapes.forEach(function(s){
    var f=((key-s[1])%12+12)%12;
    var easy=f<=4;
    var I=SHARP[s[1]],IV=SHARP[(s[1]+5)%12],V=SHARP[(s[1]+7)%12],vi=SHARP[(s[1]+9)%12]+"m";
    h+='<tr><td>'+s[0]+' shapes</td><td class="'+(easy?'easy':'')+'">'+(f===0?"No capo":"Fret "+f)+(f>5?" (high)":"")+'</td><td>'+I+" \u00b7 "+IV+" \u00b7 "+V+" \u00b7 "+vi+'</td></tr>';
  });
  document.getElementById("capoTbl").innerHTML=h;
}
function strums(){
  var lab=["1","&","2","&","3","&","4","&"];
  document.getElementById("strums").innerHTML=STRUMS.map(function(s){
    var cells=lab.map(function(l){return '<span class="cnt">'+l+'</span>'}).join("")+s[3].map(function(c){return '<span class="'+(c?'':'off')+'">'+(c||"\u2013")+'</span>'}).join("");
    return '<div class="s-item"><div class="nm">'+s[0]+'<small>'+s[1]+' \u00b7 '+s[4]+'</small></div><div class="strum" role="img" aria-label="'+s[3].map(function(c){return c||"rest"}).join(", ")+'">'+cells+'</div></div>';
  }).join("");
}
function paint(){
  rows(PROGS,"progs");rows(HYMNS,"hym");scale();capo();
  var n=nm(key);
  [].forEach.call(document.querySelectorAll("[data-key]"),function(e){e.textContent=n});
  [].forEach.call(document.querySelectorAll("#keys button"),function(b){b.setAttribute("aria-pressed",String(+b.dataset.k===key))});
}
var kb=document.getElementById("keys");
KEYS.forEach(function(k){
  var b=document.createElement("button");b.textContent=k[0];b.dataset.k=k[1];
  b.addEventListener("click",function(){key=k[1];paint();try{localStorage.setItem("wk",String(key))}catch(e){}});
  kb.appendChild(b);
});
try{var s=localStorage.getItem("wk");if(s!==null&&KEYS.some(function(k){return k[1]===+s}))key=+s}catch(e){}
strums();paint();
var pages=[].slice.call(document.querySelectorAll(".page")),links=[].slice.call(document.querySelectorAll("#menu a[data-page]"));
function show(id,push){
  if(!pages.some(function(p){return p.id===id}))id="progressions";
  pages.forEach(function(p){p.classList.toggle("on",p.id===id)});
  links.forEach(function(a){if(a.dataset.page===id)a.setAttribute("aria-current","page");else a.removeAttribute("aria-current")});
  if(push){try{history.replaceState(null,"","#"+id)}catch(e){}window.scrollTo(0,0)}
}
links.forEach(function(a){a.addEventListener("click",function(e){e.preventDefault();show(a.dataset.page,true)})});
window.addEventListener("hashchange",function(){show(location.hash.slice(1))});
show(location.hash.slice(1));
})();