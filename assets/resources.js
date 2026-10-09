function row(a,k,t,u){return '<a href="'+u+'"><span><b>'+t+'</b><small>'+a+'</small></span><span class="k">'+k+'</span></a>'}
var songs=(window.SONGS||[]).map(function(s){return row(s.writers,"Key of "+s.key,s.title,s.file)}).join("");
var links=(window.LINKS||[]).map(function(l){return row(l.by,l.tag,l.title,l.url)}).join("");
Shell.mount({base:"../",current:"resources",main:'<h2>Resources</h2><p class="lead">Chord charts for songs we play. Each chart changes to any key you pick.</p><div class="songs">'+songs+'</div>'+(links?'<hr><div class="songs">'+links+'</div>':'')});
