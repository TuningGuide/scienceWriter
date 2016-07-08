function initEditorOutline(editor, document) {
	var thesis = document.getElementsByTagName('article')[0];

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
}