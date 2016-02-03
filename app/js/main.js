$(function() {
	var ed_opt = {
	    mode: 'text/html',
	    gutter: true,
	    lineNumbers: true
	};
	var htmlEd = CodeMirror.fromTextArea($('.html').get(0), ed_opt);
	ed_opt.mode = 'css';
	var cssEd = CodeMirror.fromTextArea($('.css').get(0), ed_opt);
	cssEd.setValue("body {color: red;}")
	ed_opt.mode = 'javascript';
	var jsEd = CodeMirror.fromTextArea($('.js').get(0), ed_opt);
});