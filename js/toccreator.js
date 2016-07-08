/**
 * Created with JetBrains PhpStorm.
 * User: velten
 * Date: 02.03.13
 * Time: 22:18
 * To change this template use File | Settings | File Templates.
 */
(function () {
	TOCCreator = function(container, tag) {
		var isIterable = function(el) {
			return (typeof el.length == 'number' || el[0] != undefined);
		};

		var r = null;
		if(isIterable(container)) {
			r = new Array();
			for (var i = 0; i < container.length; ++i) {
				var item = container[i];

				var tags = item.getElementsByTagName(tag);
				for (var j = 0; j < tags.length; ++j) {
					r.push(tags[j]);
				}
			}
		}
		else {
			r = container.getElementsByTagName(tag);
		}

		var v = function (a, i) {
			var id_gen = function(tag, i) { return "h5o-"+ tag + i; };

			var b = a.getAttribute("id");
			//if id doesn't exist or contains prefix
			if (!b || (b.indexOf(id_gen('', ''))+1)) {
				b = id_gen(tag, i);
				a.setAttribute("id", b);
			}
			return b;
		};

		var childrenWithTag = function(el, tagname) {
			var r = new Array();
			if(!el.hasChildNodes()) return r;

			for(var i = 0; i < el.childNodes.length; i++) {
				if(el.childNodes[i].nodeName.toLowerCase() == tagname) {
					r.push(el.childNodes[i]);
				}
			}

			return r;
		}

		var s = "";
		for(var i = 0; i < r.length; i++) {
			var el = r[i];

			var caption = childrenWithTag(el, "caption");
			caption = caption.length ? caption[0].innerHTML : false;

			var title = caption || el.getAttribute('alt') || el.getAttribute('title') || el.getAttribute('data-title') || 'Untitled Tag '+tag+' No. '+i ;
			s += '<li><a href="#'+v(el, i)+'">' + title + "</a></li>";
		}

		return s ? '<ol>'+s+'</ol>' : null;
	}
})();