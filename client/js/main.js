(function () {
	var thesis = document.getElementsByTagName('main')[0];

	var documentOutline = HTML5Outline(thesis);
	if (documentOutline != null) {
		var toc = document.getElementById('toc');
		if (toc)
			toc.innerHTML = documentOutline.asHTML(true);
	}

	{
		var toc = document.getElementById('toc-img');
		if (toc) {
			var content = TOCCreator(thesis, 'img') || "No Images found!";
			toc.innerHTML = content;
		}
	}

	{
		var container = $(thesis).children('section');
		var toc = document.getElementById('toc-table');
		if (toc) {
			var content = TOCCreator(container, 'table') || "No Tables found!";
			toc.innerHTML = content;
		}
	}

	var saveChapterNum = function(par, children) {
		for(var i = 0; i < children.length; i++) {
			var prefix = par ? par.getAttribute('data-chapternum') + '.' : '';
			children[i].setAttribute('data-chapternum', prefix + (i+1));

			saveChapterNum(children[i], $(children[i]).children('section'));
		}
	}

	saveChapterNum(null, $(thesis).children('section'));

	var references = document.getElementsByClassName('bibref');
	for(i = 0; i < references.length; i++) {
		references[i].id = (references[i].innerText || references[i].textContent).match(/\w+/g)[0].toLowerCase();
	}

	$(thesis).find('img').each(function(index, el) {
		var f = $(el).css('float') ? 'style="float:' + $(el).css('float') + '"' : '';
		var alt = $(el).attr('alt') ? ': ' + $(el).attr('alt') : '';
		var margin = $(el).css('margin');
		var w = $(el).width() ? $(el).css('width') : "100%";
		var textAlign = $(el).css('float') ? 'text-align:' + $(el).css('float') + ';' : '';
		$(el).css('float', 'none').css('margin-bottom', 0).wrap('<figure class="clearfix" '+ f +'></figure>')
			.parent().append('<figcaption style="width:'+w+'; margin:'+margin+'; margin-top:0; '+ textAlign +'">Abbildung '+ (index+1) + alt +'</figcaption>');
	});

	$(thesis).each(function(){
		$(this).html(
			$(this).html().replace(/\\(chapter|reference|quote):([\w\-]*)(?=[^>]*<)/gm,
				function(token, match1, match2, offset, txt) {
					try {
						match2 = match2.toLowerCase();
						var el = document.getElementById(match2);
						var headline = ($(el).children('h1') || $(el).children('h2') || $(el).children('h3'))[0];

						var tex = el.getAttribute('data-chapternum');
						var tit = headline ? (headline.innerText || headline.textContent) : (el.innerText || el.textContent);

						return '<a href="#'+match2+'" class="cross-ref" title="'+ tit +'">'+ tex +'</a>';
					} catch(error) {
						console.log('Can not find "'+token+'" at:\n'+txt.substring(offset-50, offset+80));
						return token;
					}
				}
			)
		)
	});


	$(thesis).find('section').each(function(){
		$(this).html(
			$(this).html().replace(/\\\[([\w\-]*)\](?=[^>]*<)/gm,
				function(token, match1, offset, txt) {

					try {
						match1 = match1.toLowerCase();
						var el = document.getElementById(match1);
						var headline = ($(el).children('h1') || $(el).children('h2') || $(el).children('h3'))[0];

						var caption = headline ? (headline.innerText || headline.textContent) : (el.innerText || el.textContent);

						return '<a href="#'+match1+'" class="bib-ref">'+ caption +'</a>';
					} catch(error) {
						console.log('Can not find "'+token+'" at:\n'+txt.substring(offset-50, offset+80));
						return token;
					}
				}
			)
		)
	});

	$('#glossar tr td:first-child').each(function(index, el){
		if(!$(el).attr('id')) {
			$(el).attr('id', 'glossar-'+$(el).text().toLowerCase().replace(/\s\/\s|\s/g, "-"));
		}
	});

	/*$('article a[href^="http"]').each(function(index, el) {
		$(el).after('<div class="js-footnote">'+$(el).attr('href')+'</div>');
	});*/

	/*thesis.html( thesis.html().replace(/\\quote:\(?([\w\-:]*)\)?(?=[^>]*<)/gm,
		function(token, match1, offset, txt) {

			try {
				match1 = match1.toLowerCase();
				var el = document.getElementById(match1);
				var headline = ($(el).children('h1') || $(el).children('h2') || $(el).children('h3'))[0];

				caption = headline ? (headline.innerText || headline.textContent) : (el.innerText || el.textContent);

				return '<a href="#'+match1+'" class="">'+caption+'</a>';
			} catch(error) {
				console.log('Can not find "'+token+'" at:\n'+txt.substring(offset-50, offset+80));
				return token;
			}
		}
	));*/

	/*thesis.innerHTML = thesis.innerHTML.replace(/<br><\/br><br><\/br><br><\/br><br><\/br><br><\/br><br><\/br><br><\/br><br><\/br>/g, function(token, offset, txt) {
		console.log(token);
		return "<br/>";
	});*/

}());
