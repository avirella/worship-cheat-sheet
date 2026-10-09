/* Shared page shell (header, menu, footer) for the resource pages.
   Change the layout here once and every song page updates. */
window.Shell=(function(){
var PAGES=[["progressions", "Progressions"], ["hymns", "Hymn staples"], ["scale", "Chords in this key"], ["capo", "Capo shortcuts"], ["upgrades", "Chord upgrades"], ["strum", "Strumming"], ["team", "Playing with a team"]];
var HERO="<header class=\"hero\">\n  <div class=\"wrap hero-in\">\n    <div>\n      <h1>Worship guitar<span>chord cheat sheet</span></h1>\n      <p>Progressions, capo shortcuts, and playing tips for church guitarists. Pick a key below and every chord on the page updates.</p>\n    </div>\n  </div>\n  <div class=\"verse\">Genesis 2:7</div>\n</header>";
var KEYBAR='<div class="keybar" role="group" aria-label="Choose a key"><div class="wrap"><b>Key</b><div class="keys" id="keys"></div></div></div>';
function menu(base,current,root){
  return '<aside class="side"><nav id="menu" aria-label="Pages">'+PAGES.map(function(p){return root?'<a href="#'+p[0]+'" data-page="'+p[0]+'">'+p[1]+'</a>':'<a href="'+base+'index.html#'+p[0]+'">'+p[1]+'</a>'}).join("")+
    '<a href="'+base+'resources/index.html"'+(current==="resources"?' aria-current="page"':'')+'>Resources</a></nav></aside>';
}
function mount(o){
  var base=o.base||"../";
  document.body.insertAdjacentHTML("afterbegin",HERO+(o.keybar?KEYBAR:"")+
    '<div class="wrap layout">'+menu(base,o.current)+'<main><section class="page on">'+o.main+'</section></main></div>'+
    '<footer class="wrap"><p>Soli Deo gloria.</p></footer>');
}
var FOOTER='<footer class="wrap"><p>Soli Deo gloria.</p></footer>';
/* Home page: fill the placeholders in index.html */
[].forEach.call(document.querySelectorAll("[data-shell]"),function(e){
  var t=e.getAttribute("data-shell");
  e.outerHTML=t==="hero"?HERO:t==="menu"?menu("","",true):FOOTER;
});
return {mount:mount};
})();
