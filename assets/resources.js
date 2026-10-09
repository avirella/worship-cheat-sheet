Shell.mount({base:"../",current:"resources",main:'<h2>Resources</h2><p class="lead">Chord charts for songs we play. Each chart changes to any key you pick.</p><div class="songs">'+
(window.SONGS||[]).map(function(s){return '<a href="'+s.file+'"><span><b>'+s.title+'</b><small>'+s.writers+'</small></span><span class="k">Key of '+s.key+'</span></a>'}).join("")+'</div>'});
