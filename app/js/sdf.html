(function() {
  // get rid of console_runner overwiring stuff....
  // delete window.console.log;  // this removes just log
  for (var key in console) { // all of them
    if (console.hasOwnProperty(key) && console[key].toString().indexOf("unction ")) {
      // console.log("deleting console.", key);
      delete console[key];
    }
  }

  
  var location = { hash: "", qs: {}}; // hash string, guery params
  if (window.location.search) {
    var qs = window.location.search.substr(1).split('&');
      for (var p, i = 0; i < qs.length; i++) {
        p = qs[i].split('=', 2);
        location.qs[p[0]] =  (p.length == 1) ? "" : decodeURIComponent(p[1].replace(/\+/g, " "));
      }
  }
  location.hash = window.location.hash.replace("#", "");
  
  delete window.console.log;
  window.console.log(console, "location: ", location);;
  // Base template
  var output_page_template =
    "<!doctype html>\n" +
    "<html>\n" +
    "  <head>\n" +
    "    <meta charset=\"utf-8\">\n" +
    "    <title>My Web Lisp App</title>\n" +
    "  </head>\n" +
    "  <body>\n" +
    "  </body>\n" +
    "</html>";
  var lisp_panel_title;

  var mk_tag = function(tag, text, attrs) {
    attrs = attrs ? (" " + attrs) : "";
    return "<" + tag + attrs + ">" + text + "</" + tag + ">";
  }

  var prepareSource = function() {
    var lisp = lisp_editor.getValue();
    var html = html_editor.getValue();
    var css = css_editor.getValue();
    var js = js_editor.getValue();
    var tmp, src = output_page_template;
    if ((tmp=lisp.match(/\s*;+\s*(\w+.*)\n/))) 
      src = output_page_template = 
          src.replace(/title>(.*)<\/title>/, 
                      "title>"+(lisp_panel_title=tmp[1])+"<\/title>");
    
    src = src.replace('</body>', html + '</body>');
    css = "<style>" + css + '</style>';
    src = src.replace('</head>', css + '</head>');
    js = mk_tag('script', js);
    src = src.replace('</body>', js + '</body>');
    //console.log(src);
    return src;
  };

  var get_elt = function(id) {
    return (document).getElementById(id);
  };

  var get_text = function(code_elt) {
    if (code_elt.taName === "textarea")
      return code_elt.value;
    return (code_elt.innerText || code_elt.textContent).trim();
  };

  var render = function() {
    console.log("render");
    var source = prepareSource();;
    var iframe = document.querySelector('#output iframe');
    var section = iframe.parentElement;
    section.removeChild(iframe);
    iframe = document.createElement("iframe");
    section.appendChild(iframe);
    iframe_doc = iframe.contentDocument;
    iframe_doc.open();
    iframe_doc.write(source);
    iframe_doc.close();
  };

  var html_box = document.querySelector('#html textarea');
  var html_editor = CodeMirror.fromTextArea(html_box, {
    mode: 'text/html',
    gutter: true,
    lineNumbers: true,
    matchBrackets: true
      //,extraKeys:{"Shift-Tab":autoFormatSelection}
  });
  var css_box = document.querySelector('#css textarea');
  var css_editor = CodeMirror.fromTextArea(css_box, {
    mode: 'css',
    gutter: true,
    lineNumbers: true,
    matchBrackets: true
      //,extraKeys:{"Shift-Tab":autoFormatSelection}
  });;;

  var lisp_box = document.querySelector('#lisp textarea');
  var lisp_editor = CodeMirror.fromTextArea(lisp_box, {
    mode: 'lisp', // commonlisp',
    gutter: true,
    lineNumbers: true,
    matchBrackets: true,
    autoCloseBrackets: true,
    extraKeys: {
      "Alt-F": "findPersistent" // for search extensions
        ,
      "Ctrl-Space": "autocomplete"
        // had to extend keymap for # this way. problem is that closebrackets.js
        // does not allow to have # to double-enter
        // in predefiend way (such as () etc and as "".... due to the way how
        // its function handleChar is written. 
        ,
      "'#'": function(cm) {
        var pos = cm.getCursor();
        var line = cm.getLine(pos.line);
        console.log(line, pos);
        //todo: maybe more cases....
        if (pos.ch == 0 || line.charAt(pos.ch - 1).match(/[\s.(\[]/)) {
          cm.replaceSelection("##");
          cm.setCursor({
            line: pos.line,
            ch: pos.ch + 1
          });
        } else
          cm.replaceSelection("#");
      }
    },
    undoDepth: 300
      //,extraKeys:{"Shift-Tab":autoFormatSelection}
  });
  
  var js_box = document.querySelector('#js textarea');
  var js_editor = CodeMirror.fromTextArea(js_box, {
    mode: 'javascript'
      //,gutter: true
      ,
    lineNumbers: true,
    matchBrackets: true
      //,lineWrapping: true
      ,
    gutters: ["CodeMirror-lint-markers"],
    lint: true
      //,extraKeys: {"Ctrl-Space": "autocomplete"}
      //,extraKeys:{"Shift-Tab":autoFormatSelection}
  });

  Split(['#code_editors', '#output'], {
    gutterSize: 14,
    cursor: 'col-resize',
    onDrag: resize_CM_editors_on_drag,
    editors: [html_editor, css_editor, lisp_editor, js_editor]
  });

  var all_editors = [html_editor, css_editor, lisp_editor, js_editor];

  Split(['#html', '#css', '#lisp', '#js'], {
    onDrag: resize_CM_editors_on_drag,
    direction: 'vertical',
    sizes: [10, 10, 50, 30],
    gutterSize: 6,
    editors: all_editors,
    minSize: 10,
    cursor: 'row-resize'
  });
  
  var cms = document.querySelectorAll('.CodeMirror');
  for (var i = 0; i < cms.length; i++) {

    /*cms[i].style.position = 'absolute';
    cms[i].style.top = '0px';
    cms[i].style.bottom = '0';
    cms[i].style.left = '0';
    cms[i].style.right = '0';*/
  }

  cms = document.querySelectorAll('.CodeMirror-scroll');
  /*for (i = 0; i < cms.length; i++) 
    cms[i].style.height = '50%';*/

  // note use_package will make it global global
  Lisp.range =  function(start, stop, step, inclusive) { // these values can be numbers or string holding numbers
    // console.log("range", start, stop, step);
    if (stop == null) stop = +start || 0, start = 0;
    else start = +start||0, stop = +stop;
    if (inclusive) stop++;
    step = +step || 1;
    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);
    for (var idx = 0; idx < length; idx++, start += step) 
      range[idx] = start;

    return range;
  };
  
  Lisp.use_package("Lisp");
  
  var js_code = []; // macro 'include' needs this
  var js_out = function(jscode, beautify) {
    jscode = semicolon_cleanup(jscode);
    if (!jscode.match(/.+[;\}]\s*$/)) jscode += ";";
    if (beautify) jscode = tidyup_js_code(jscode);
    js_editor.setValue(jscode);
    return jscode;
  };
  var processToplevels = function(lisp_text, action, end_regexp) {
    action = action || js_out;
    end_regexp = end_regexp || /_^/; // default is 'match nothing'
    var curr = 0;
    while (!lisp_text.substring(curr).match(end_regexp)) {
      LispTrans.resetState();
      var res = read_from_string(lisp_text, curr);
      if (!res) break;
      curr = res.cdr;
      action(res.car);
    }
  };

  // Extension: Removal of Option Semicolons
  var semicolon_cleanup = (function() {
    LispTrans.setTokens({ //COMMA: ",\n", SEMICOL: ";\n", SEMICOL_RET: " ;\n", 
      RBC_CODE: "}/*{C}*/\n",
      RBC_OBJ: "}/*{O}*/\n",
      RBC_FUNC: "}\n/*{F}*/"
    });
    return function(js_code) { // ugly regexp stuff, but fast and helps to keep Jhint happier
      js_code = js_code.replace(/\n(\/\*[^\*]*\*\/\n);/g, "$1"); // for macros
      js_code = js_code.replace(/\/\*{F}\*\/;(\w*[^\(])/g, "$1"); // for non application
      js_code = js_code.replace(/\/\*{[COIW]}\*\/\n*;/g, ""); // for all blocks followed by ;
      js_code = js_code.replace(/\/\*{[COIWF]}\*\//g, ""); // remove markers
      return js_code;
    }; })();

  // This loads useful macros extending the basic set provided by Lisp.
  // Currently, load time is completely negligible, under 10ms. 
  var time = new Date();
  processToplevels(get_text(get_elt("extensions")), function(e) {
          translate(macroexpand(e));
  }); 
  console.log("extensions load time, ms:", new Date() - time);
  
  LispTrans.setSpecialTerms({"nil":undefined}); //this excludes t:true, use #t or 't or 1 or true or ""
  // One more useful extension. Example: (include #example15 #example1)
  LispTrans.global_macros["include"] = LispTrans.global_macros["import"] = function() { // vararg macro!
    for (var i = 0; i < arguments.length; i++) {
      var name = arguments[i];
      if (name.constructor === LispString) name = name.text;
      var node_list = document.querySelectorAll(name),
        msg = "included:";
      for (var j = 0; j < node_list.length; j++) {
        var elt = node_list[j]; // console.log(elt);
        processToplevels(get_text(elt), function(e) {
          js_code.push(translate(macroexpand(e)));
        });
        msg += " " + elt.id || elt.name || elt.dir || elt.tagName;
      }
    }
    return "\n/* " + (node_list.length ? msg : "") + " */\n";
  };
  
  // Extension:  String Interpolation feature
  (function(prefix) { // $ @ . # or empty
    Lisp.string_interpolation_enabled = true; // interpolation is new feature in Lisp15
    var re = new RegExp("\\" + prefix + "{[^ ;{}]+}", "g"); // alternatives: /\${[^{}]+}/g or /\
    LispTrans.setReadStringWrapper(function(str) {
      if (!Lisp.string_interpolation_enabled)  return new LispString(str);
      var match = str.match(re);
      if (!match) return new LispString(str);
      str = str.replace(re, match[0]).split(match[0]); // use it as splitter
      var plus_args = [new LispString(str[0])];
      match.forEach(function(s, i) {
        plus_args.push(s.slice(1+prefix.length, -1));
        plus_args.push(new LispString(str[i+1]))});
      plus_args = plus_args.filter(function(e) {  return !(e && e.constructor == LispString && e.text == "");});
      return cons("+", arr2list(plus_args));
    });
  })("");

  var lisp_to_js = function(lisp_code, beautify) {
    js_code = [];
    processToplevels(lisp_code, function(e) {
      js_code.push(translate(macroexpand(e)))
    });
    js_out(js_code.join(";"), beautify);
    var totalLines = js_editor.lineCount();
    //js_editor.autoFormatRange({line:0, ch:0}, {line:totalLines});
  }

  var tidyup_js_code = function(code) {
    return js_beautify(code, {
      indent_size: 2,
      break_chained_methods: true,
      wrap_line_length: 40,
      brace_style: "collapse"
    }).replace(/    return\n[ ]+/g, // work around horrible bug in js_beautify
      "    return ");
  };

  lisp_editor.on("change", function(cm, change) {
    //console.log("lisp changed: ", change);
    for (var i = 5; i>0; i--) localStorage["hist" + i] = localStorage["hist" + (i-1)];
    var lisp = localStorage["hist0"] =  lisp_editor.getValue();
    lisp_to_js(lisp);
    // the following hack prevents losing paren highlighting
    // in the lisp editor caused by rendering into js editor
    setTimeout(function() {
      var cursor = lisp_editor.getCursor()
      lisp_editor.setCursor({
        line: cursor.line,
        ch: cursor.ch - 1
      });
      lisp_editor.setCursor(cursor);

    }, 100);;

  });

  js_editor.on("change", function(cm, change) {
    //console.log("js changed: ", change);
    render();
  });

  get_elt("tidy_js").onclick = function() {
    var pp_text = tidyup_js_code(js_editor.getValue());
    js_editor.setValue(pp_text);
  };
  var popups_zindex = 99;
  get_elt("Lisp_label").onclick = function() {
    var popup = get_elt("lisp_history");
    for (var i = 5; i>-1; i--) 
      get_elt("hist"+i).value = localStorage["hist"+i];
    get_elt("hist1").value = localStorage["hist1"];
    popup.style.display = "block";
    popup.style["z-index"] = popups_zindex++;
  };
  
  get_elt("lisp_history_close").onclick = function() {
    var popup = get_elt("lisp_history");
    popup.style.display = "none";
  };
  
  get_elt("HTML_label").onclick = function() {
    var popup = get_elt("html_template");
    get_elt("html_template_ta").value = output_page_template;
    popup.style.display = "block";
    popup.style["z-index"] = popups_zindex++;
  };
  
  get_elt("html_template_ok").onclick = function() {
    output_page_template = get_elt("html_template_ta").value;
    get_elt("html_template").style.display = "none";
  };
  
  get_elt("html_template_cancel").onclick = function() {
    get_elt("html_template").style.display = "none";
  };
  
  function wrap_lisp_code() {
   return "\n<code style='display:none;'>" + lisp_editor.getValue() + "\n</code>\n";
  }
  
  get_elt("save_result_html").onclick = function() {
    var link = document.createElement("a");
    link.download = "result.html";
    // simple method. problem -  sometimes get  ^R in JS code. 
    // link.href = "data:text/html," + prepareSource();
    // blob method:
    var blob = new Blob([
      prepareSource()
      ,wrap_lisp_code()
    ], { type: "octet/stream" });
    link.href = window.URL.createObjectURL(blob);
    link.click();
  };
  
  // some additional gist services
  var your_secure_gist_credentials_api; // see https://developer.github.com/v3/oauth/#web-application-flow
  var gist_pat = (your_secure_gist_credentials_api && your_secure_gist_credentials_api()) ||
      location.qs.pat || localStorage["pat"] ; // ONLY FOR TESTS! NOT SECURE!!
  var gist_id; // when both gist id and pat are specified, will 'update' rather than create a new gist.

  get_elt("save_result_gist").onclick = function() {
    var files = {
      'code.lisp': lisp_editor.getValue()
      ,'code.html': html_editor.getValue()
      ,'code.css': css_editor.getValue()
      ,'index.html': prepareSource() + wrap_lisp_code()
    };
    var ops = { description: lisp_panel_title || "my lisp work"};
    if (gist_pat) ops.accessToken = gist_pat;
    var cb = function(err, gist_info) {
      console.log("new gist, err:", err, " id: ", gist_info);
      if (err) ; //alert("console"+ console.constructor + "gist creation error: " + err + " gist_info: " + gist_info);
      else {
        if (typeof gist_info === "string") gist_id = gist_info;
        var popup = get_elt("gist_save_notification");
        var link = get_elt("gist_url");
        link.innerHTML = link.href = "https://gist.github.com/" + gist_id;
        link = get_elt("run_gist_from_blocks");
        link.href = "http://bl.ocks.org/" + gist_id;
        get_elt("gist_personal_at_note").style.display = gist_pat ? "none" : "block" ;
        popup.style.display = "block";
        popup.style["z-index"] = popups_zindex++;
      }
    }; // end of func cb
    if (gist_pat && !gist_id) // code snippets from gist storage may contain id; use it.
      if (gist_id=files["code.lisp"].match(/;;\sgist:(\w+)/))  gist_id = gist_id[1];
    if (gist_id)
      gistachio.patchFiles (gist_id, files, ops, cb);
    else 
      gistachio.postFiles(files, ops, cb);
  }; // end of save_result_gist onclick

  get_elt("gist_dialog_close").onclick = function() {
    get_elt("gist_save_notification").style.display = "none";
  };

  (function() { // examples 'rolodeck' with buttons next and prev
    var load = function(pre_elt) {
      var lisp_elt = pre_elt.querySelectorAll("textarea:not([id*=__])")[0];
      //var example_id = lisp_elt.id;
      var html_elt = pre_elt.querySelectorAll("textarea[id*=html]")[0] || get_elt("example1__html");
      var css_elt = pre_elt.querySelectorAll("textarea[id*=css]")[0] || get_elt("example1__css");
      html_editor.setValue(get_text(html_elt));
      css_editor.setValue(get_text(css_elt));
      lisp_editor.setValue(get_text(lisp_elt));
    };

    var examples = document.querySelectorAll("#examples pre");
    // console.log([examples]);
    var example_n = 0;
    var location_hash = window.location.hash.replace("#", "");
    if (!isNaN(location_hash)) example_n = Number.parseInt(location_hash) - 1;
    else if (location_hash != "") { // example name/id?
      var txt_a = document.querySelector("#" + location_hash);
      var pre = txt_a && txt_a.parentElement;;;
      for (var i = 0; i < examples.length; i++)
        if (examples[i] == pre)
          example_n = i;
    }

    var next_example = get_elt("next_example").onclick = function() {
      var pre_elt = examples[example_n++];
      if (!pre_elt) example_n = 1, pre_elt = examples[0];
      load(pre_elt);
    };
    get_elt("prev_example").onclick = function() {
      if (example_n < 2) example_n = examples.length + 1;
      var pre_elt = examples[--example_n - 1];
      load(pre_elt);
      gist_id = undefined;
    };
    next_example();;
  })();
  

  // detect css reloading (inspired by codepen, work in progress)
  var CSSReload = {
    head: null,
    init: function() {
      this._storeHead(), this._listenToPostMessages()
    },
    _storeHead: function() {
      this.head = document.head || document.getElementsByTagName("head")[0]
    },
    _listenToPostMessages: function() {
      var e = this;
      window[this._eventMethod()](this._messageEvent(), function(t) {
        try {
          var s = JSON.parse(t.data);
          "string" == typeof s.css && e._refreshCSS(s)
        } catch (n) {}
      }, !1)
    },
    _messageEvent: function() {
      return "attachEvent" === this._eventMethod() ? "onmessage" : "message"
    },
    _eventMethod: function() {
      return window.addEventListener ? "addEventListener" : "attachEvent"
    },
    _refreshCSS: function(e) {
      var t = this._findPrevCPStyle(),
        s = document.createElement("style");
      s.type = "text/css", s.className = "cp-pen-styles", s.styleSheet ? s.styleSheet.cssText = e.css : s.appendChild(document.createTextNode(e.css)), this.head.appendChild(s), t && t.parentNode.removeChild(t), "prefixfree" === e.css_prefix && StyleFix.process()
    },
    _findPrevCPStyle: function() {
      for (var e = document.getElementsByTagName("style"), t = e.length - 1; t >= 0; t--)
        if ("cp-pen-styles" === e[t].className) return e[t];
      return !1
    }
  };
  // CSSReload.init();

  window.onkeydown = function(e) {
    var e = e || event;
    if (e.ctrlKey && !e.shiftKey && e.keyCode == 82) {
      console.log("got Ctrl-R in LispPlayground, deflect!!!");
      e.preventDefault();
      e.stopPropagation();
      return;
    }
  }

  window.onresize = function() {
    //console.log("window.onresize");
    resize_CM_editors_on_drag(all_editors);
  };
   window.onresize(); // force scrollbars to render on startup

  // if hash location specified, jump to the given example. 

}());

// for debugging only
function output_window() {
  return document.querySelector('#output iframe').contentWindow;
}