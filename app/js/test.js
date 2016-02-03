/**
 * Diff Match and Patch
 *
 * Copyright 2006 Google Inc.
 * http://code.google.com/p/google-diff-match-patch/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function diff_match_patch() {
    this.Diff_Timeout = 1, this.Diff_EditCost = 4, this.Match_Threshold = .5, this.Match_Distance = 1e3, this.Patch_DeleteThreshold = .5, this.Patch_Margin = 4, this.Match_MaxBits = 32
}

function BarDragger(e) {
    this.handles = [e], this.bindHandles()
}! function() {
    var e = !1,
        t = /xyz/.test(function() {}) ? /\b_super\b/ : /.*/;
    this.Class = function() {}, Class.extend = function(n) {
        function s() {
            !e && this.init && this.init.apply(this, arguments)
        }
        var i = this.prototype;
        e = !0;
        var o = new this;
        e = !1;
        for (var r in n) o[r] = "function" == typeof n[r] && "function" == typeof i[r] && t.test(n[r]) ? function(e, t) {
            return function() {
                var n = this._super;
                this._super = i[e];
                var s = t.apply(this, arguments);
                return this._super = n, s
            }
        }(r, n[r]) : n[r];
        return s.prototype = o, s.prototype.constructor = s, s.extend = arguments.callee, s
    }
}();
var Love = {
    _saveLoveToDBFunc: null,
    THROTTLE_DELAY: 500,
    init: function() {
        _.extend(this, AJAXUtil), this.user = window.__user, this._bindToDOM(), this._createSaveLoveToDBFunc()
    },
    _createSaveLoveToDBFunc: function() {
        this._saveLoveToDBFunc = _.throttle(this._saveLoveChange, this.THROTTLE_DELAY, {
            leading: !1,
            trailing: !0
        })
    },
    _bindToDOM: function() {
        $("body").on("click", "a.loves, button.loves, span.loves", $.proxy(this._onHeartClick, this))
    },
    _onHeartClick: function(e) {
        if (e.preventDefault(), this._userNeedsToLogin()) return this._redirectToLogin();
        var t = $(e.target).closest(".loves");
        this._isOwned(t) || this._heartItem(t)
    },
    _userNeedsToLogin: function() {
        return 1 == this.user.id
    },
    _redirectToLogin: function() {
        window.location = "/login?type=love"
    },
    _isOwned: function(e) {
        return e.data("owned")
    },
    _heartItem: function(e) {
        var t = this._getNextLevel(e);
        this._showAsHearted(e, t), this._saveLoveToDBFunc(e.data("item"), e.data("hashid"), t)
    },
    _getNextLevel: function(e) {
        if (e.hasClass("comment-heart")) return this._isCommentedLoved(e) ? 0 : 1;
        var t = this._findTextLoveLevel(e.attr("class"));
        return this._nextLoveLevel(t)
    },
    _isCommentedLoved: function(e) {
        return e.hasClass("love")
    },
    _findTextLoveLevel: function(e) {
        var t = e.match(/loved-(\d)/);
        return t ? 1 * t[1] : 0
    },
    _nextLoveLevel: function(e) {
        return 3 === e ? 0 : e + 1
    },
    _showAsHearted: function(e, t) {
        e.hasClass("comment-heart") ? (this._showCommentHeartAsHearted(e, t), ga("send", "event", {
            eventCategory: "Love",
            eventAction: "Loved",
            eventLabel: "Comment",
            eventValue: t
        })) : (this._showStandardHeartAsHearted(e, t), ga("send", "event", {
            eventCategory: "Love",
            eventAction: "Loved",
            eventLabel: "Pen/Post/Collection",
            eventValue: t
        }))
    },
    _showCommentHeartAsHearted: function(e, t) {
        t > 0 ? e.addClass("love loved-1") : e.removeClass("love loved-1"), this._updateLoveCount(e, t)
    },
    _showStandardHeartAsHearted: function(e, t) {
        e.removeClass("loved-1 loved-2 loved-3 loved-0"), e.addClass("loved-" + t), this._updateLoveCount(e, t)
    },
    _updateLoveCount: function(e, t) {
        var n = e.find("span.count"),
            s = this._getValueToAddToCount(t);
        n.html(this._getLoveCount(n, s))
    },
    _getValueToAddToCount: function(e) {
        return 0 === e ? -1 : 1 === e ? 1 : 0
    },
    _getLoveCount: function(e, t) {
        var n = 1 * e.html(),
            s = isNaN(n) ? 0 : n;
        return s += t, s > 0 ? s : ""
    },
    _saveLoveChange: function(e, t, n) {
        var s = "/love/" + [e, t, n].join("/");
        this.post(s, {}, function() {
            this._doneSaveLoveChange(e)
        })
    },
    _doneSaveLoveChange: function(e) {
        "undefined" != typeof Hub && Hub.pub(e + "-hearted")
    }
};
Love.init();
var URLBuilder = {
        getHostURL: function(e, t) {
            var n = document.location,
                s = n.protocol,
                i = n.hostname,
                o = e ? window.__CPDATA.host_secure_subdomain : "";
            o = void 0 === typeof t ? o : t;
            var r = n.port ? ":" + n.port : "",
                a = "<%= protocol %>//<%= subdomain %><%= host %><%= port %>";
            return _.template(a, {
                protocol: s,
                subdomain: o,
                host: i,
                port: r
            })
        },
        getProtocolLessHostURL: function(e, t) {
            return this.getHostURL(e, t).replace(/(http:|https:)/, "")
        },
        getViewURL: function(e, t, n, s) {
            return this.getViewURLSimple(e, t.base_url, n.getActiveSlugHash(), s)
        },
        getViewURLSimple: function(e, t, n, s, i) {
            var o = "";
            return o += i ? URLBuilder.getProtocolLessHostURL(s, "") : URLBuilder.getHostURL(s), o += t + "/", o += e + "/", o += n + "/"
        },
        SHORT_HOST: "http://cdpn.io",
        getShortViewURL: function(e, t) {
            return e ? [this.SHORT_HOST, e, t.getActiveSlugHash()].join("/") : [this.SHORT_HOST, t.getActiveSlugHash()].join("/")
        }
    },
    LocalDataLoader = {
        latestObject: function(e, t, n) {
            if (!n) return e;
            if ("undefined" === n) return e;
            var s = $.parseJSON(n);
            return this._localStorageObjNewer(e, t, s) ? s : e
        },
        _localStorageObjNewer: function(e, t, n) {
            return this._getComparableClientTime(n, t) > t
        },
        _getComparableClientTime: function(e, t) {
            var n = e.last_updated + "",
                s = t + "",
                i = n.substr(0, s.length);
            return +i
        }
    };
$.fn.serializeObject = function() {
    var e = {},
        t = this.serializeArray();
    return $.each(t, function() {
        e[this.name] ? (e[this.name].push || (e[this.name] = [e[this.name]]), e[this.name].push(this.value || "")) : e[this.name] = this.value || ""
    }), e
};
var CodeEditorAnalyze = Class.extend({
        clearingShortcut: !1,
        init: function() {
            this.bindUIActions()
        },
        bindUIActions: function() {
            $("#analyze-html")._on("click", this.analyzeHTML, this), $("#analyze-css")._on("click", this.analyzeCSS, this), $("#analyze-js")._on("click", this.analyzeJS, this), $(document).on("click", "#clear-html-errors", $.proxy(this.clearHTMLErrors, this)).on("click", "#clear-css-errors", $.proxy(this.clearCSSErrors, this)).on("click", "#clear-js-errors", $.proxy(this.clearJSErrors, this))
        },
        enableClearingShortcut: function() {
            Keytrap.bind("comctrl+shift+8", function() {
                Analyze.clearAllErrors("html"), Analyze.clearAllErrors("css"), Analyze.clearAllErrors("js")
            }, !0), this.clearingShortcut = !0
        },
        analyzeHTML: function() {
            this._hidePanesOnTopOfEditor();
            var e = this;
            Loader.run("analyze-html", function() {
                Analyze.html(), e.clearingShortcut === !1 && e.enableClearingShortcut()
            })
        },
        analyzeCSS: function() {
            this._hidePanesOnTopOfEditor();
            var e = this;
            Loader.run("analyze-css", function() {
                Analyze.css(), e.clearingShortcut === !1 && e.enableClearingShortcut()
            })
        },
        analyzeJS: function() {
            this._hidePanesOnTopOfEditor();
            var e = this;
            Loader.run("analyze-js", function() {
                Analyze.js(), e.clearingShortcut === !1 && e.enableClearingShortcut()
            })
        },
        clearHTMLErrors: function(e) {
            e.preventDefault(), Analyze.clearAllErrors("html"), this._hidePanesOnTopOfEditor()
        },
        clearCSSErrors: function(e) {
            e.preventDefault(), Analyze.clearAllErrors("css"), this._hidePanesOnTopOfEditor()
        },
        clearJSErrors: function(e) {
            e.preventDefault(), Analyze.clearAllErrors("js"), this._hidePanesOnTopOfEditor()
        },
        _hidePanesOnTopOfEditor: function() {
            $.hideMessage(), CP.settingsController.hideSettingsPane()
        }
    }),
    DIFF_DELETE = -1,
    DIFF_INSERT = 1,
    DIFF_EQUAL = 0;
diff_match_patch.Diff, diff_match_patch.prototype.diff_main = function(e, t, n, s) {
    "undefined" == typeof s && (s = this.Diff_Timeout <= 0 ? Number.MAX_VALUE : (new Date).getTime() + 1e3 * this.Diff_Timeout);
    var i = s;
    if (null == e || null == t) throw new Error("Null input. (diff_main)");
    if (e == t) return e ? [
        [DIFF_EQUAL, e]
    ] : [];
    "undefined" == typeof n && (n = !0);
    var o = n,
        r = this.diff_commonPrefix(e, t),
        a = e.substring(0, r);
    e = e.substring(r), t = t.substring(r), r = this.diff_commonSuffix(e, t);
    var c = e.substring(e.length - r);
    e = e.substring(0, e.length - r), t = t.substring(0, t.length - r);
    var l = this.diff_compute_(e, t, o, i);
    return a && l.unshift([DIFF_EQUAL, a]), c && l.push([DIFF_EQUAL, c]), this.diff_cleanupMerge(l), l
}, diff_match_patch.prototype.diff_compute_ = function(e, t, n, s) {
    var i;
    if (!e) return [
        [DIFF_INSERT, t]
    ];
    if (!t) return [
        [DIFF_DELETE, e]
    ];
    var o = e.length > t.length ? e : t,
        r = e.length > t.length ? t : e,
        a = o.indexOf(r);
    if (-1 != a) return i = [
        [DIFF_INSERT, o.substring(0, a)],
        [DIFF_EQUAL, r],
        [DIFF_INSERT, o.substring(a + r.length)]
    ], e.length > t.length && (i[0][0] = i[2][0] = DIFF_DELETE), i;
    if (1 == r.length) return [
        [DIFF_DELETE, e],
        [DIFF_INSERT, t]
    ];
    var c = this.diff_halfMatch_(e, t);
    if (c) {
        var l = c[0],
            u = c[1],
            h = c[2],
            d = c[3],
            p = c[4],
            _ = this.diff_main(l, h, n, s),
            f = this.diff_main(u, d, n, s);
        return _.concat([
            [DIFF_EQUAL, p]
        ], f)
    }
    return n && e.length > 100 && t.length > 100 ? this.diff_lineMode_(e, t, s) : this.diff_bisect_(e, t, s)
}, diff_match_patch.prototype.diff_lineMode_ = function(e, t, n) {
    var s = this.diff_linesToChars_(e, t);
    e = s.chars1, t = s.chars2;
    var i = s.lineArray,
        o = this.diff_main(e, t, !1, n);
    this.diff_charsToLines_(o, i), this.diff_cleanupSemantic(o), o.push([DIFF_EQUAL, ""]);
    for (var r = 0, a = 0, c = 0, l = "", u = ""; r < o.length;) {
        switch (o[r][0]) {
            case DIFF_INSERT:
                c++, u += o[r][1];
                break;
            case DIFF_DELETE:
                a++, l += o[r][1];
                break;
            case DIFF_EQUAL:
                if (a >= 1 && c >= 1) {
                    o.splice(r - a - c, a + c), r = r - a - c;
                    for (var s = this.diff_main(l, u, !1, n), h = s.length - 1; h >= 0; h--) o.splice(r, 0, s[h]);
                    r += s.length
                }
                c = 0, a = 0, l = "", u = ""
        }
        r++
    }
    return o.pop(), o
}, diff_match_patch.prototype.diff_bisect_ = function(e, t, n) {
    for (var s = e.length, i = t.length, o = Math.ceil((s + i) / 2), r = o, a = 2 * o, c = new Array(a), l = new Array(a), u = 0; a > u; u++) c[u] = -1, l[u] = -1;
    c[r + 1] = 0, l[r + 1] = 0;
    for (var h = s - i, d = h % 2 != 0, p = 0, _ = 0, f = 0, g = 0, m = 0; o > m && !((new Date).getTime() > n); m++) {
        for (var v = -m + p; m - _ >= v; v += 2) {
            var b, C = r + v;
            b = v == -m || v != m && c[C - 1] < c[C + 1] ? c[C + 1] : c[C - 1] + 1;
            for (var T = b - v; s > b && i > T && e.charAt(b) == t.charAt(T);) b++, T++;
            if (c[C] = b, b > s) _ += 2;
            else if (T > i) p += 2;
            else if (d) {
                var y = r + h - v;
                if (y >= 0 && a > y && -1 != l[y]) {
                    var S = s - l[y];
                    if (b >= S) return this.diff_bisectSplit_(e, t, b, T, n)
                }
            }
        }
        for (var P = -m + f; m - g >= P; P += 2) {
            var S, y = r + P;
            S = P == -m || P != m && l[y - 1] < l[y + 1] ? l[y + 1] : l[y - 1] + 1;
            for (var w = S - P; s > S && i > w && e.charAt(s - S - 1) == t.charAt(i - w - 1);) S++, w++;
            if (l[y] = S, S > s) g += 2;
            else if (w > i) f += 2;
            else if (!d) {
                var C = r + h - P;
                if (C >= 0 && a > C && -1 != c[C]) {
                    var b = c[C],
                        T = r + b - C;
                    if (S = s - S, b >= S) return this.diff_bisectSplit_(e, t, b, T, n)
                }
            }
        }
    }
    return [
        [DIFF_DELETE, e],
        [DIFF_INSERT, t]
    ]
}, diff_match_patch.prototype.diff_bisectSplit_ = function(e, t, n, s, i) {
    var o = e.substring(0, n),
        r = t.substring(0, s),
        a = e.substring(n),
        c = t.substring(s),
        l = this.diff_main(o, r, !1, i),
        u = this.diff_main(a, c, !1, i);
    return l.concat(u)
}, diff_match_patch.prototype.diff_linesToChars_ = function(e, t) {
    function n(e) {
        for (var t = "", n = 0, o = -1, r = s.length; o < e.length - 1;) {
            o = e.indexOf("\n", n), -1 == o && (o = e.length - 1);
            var a = e.substring(n, o + 1);
            n = o + 1, (i.hasOwnProperty ? i.hasOwnProperty(a) : void 0 !== i[a]) ? t += String.fromCharCode(i[a]) : (t += String.fromCharCode(r), i[a] = r, s[r++] = a)
        }
        return t
    }
    var s = [],
        i = {};
    s[0] = "";
    var o = n(e),
        r = n(t);
    return {
        chars1: o,
        chars2: r,
        lineArray: s
    }
}, diff_match_patch.prototype.diff_charsToLines_ = function(e, t) {
    for (var n = 0; n < e.length; n++) {
        for (var s = e[n][1], i = [], o = 0; o < s.length; o++) i[o] = t[s.charCodeAt(o)];
        e[n][1] = i.join("")
    }
}, diff_match_patch.prototype.diff_commonPrefix = function(e, t) {
    if (!e || !t || e.charAt(0) != t.charAt(0)) return 0;
    for (var n = 0, s = Math.min(e.length, t.length), i = s, o = 0; i > n;) e.substring(o, i) == t.substring(o, i) ? (n = i, o = n) : s = i, i = Math.floor((s - n) / 2 + n);
    return i
}, diff_match_patch.prototype.diff_commonSuffix = function(e, t) {
    if (!e || !t || e.charAt(e.length - 1) != t.charAt(t.length - 1)) return 0;
    for (var n = 0, s = Math.min(e.length, t.length), i = s, o = 0; i > n;) e.substring(e.length - i, e.length - o) == t.substring(t.length - i, t.length - o) ? (n = i, o = n) : s = i, i = Math.floor((s - n) / 2 + n);
    return i
}, diff_match_patch.prototype.diff_commonOverlap_ = function(e, t) {
    var n = e.length,
        s = t.length;
    if (0 == n || 0 == s) return 0;
    n > s ? e = e.substring(n - s) : s > n && (t = t.substring(0, n));
    var i = Math.min(n, s);
    if (e == t) return i;
    for (var o = 0, r = 1;;) {
        var a = e.substring(i - r),
            c = t.indexOf(a);
        if (-1 == c) return o;
        r += c, (0 == c || e.substring(i - r) == t.substring(0, r)) && (o = r, r++)
    }
}, diff_match_patch.prototype.diff_halfMatch_ = function(e, t) {
    function n(e, t, n) {
        for (var s, i, o, a, c = e.substring(n, n + Math.floor(e.length / 4)), l = -1, u = ""; - 1 != (l = t.indexOf(c, l + 1));) {
            var h = r.diff_commonPrefix(e.substring(n), t.substring(l)),
                d = r.diff_commonSuffix(e.substring(0, n), t.substring(0, l));
            u.length < d + h && (u = t.substring(l - d, l) + t.substring(l, l + h), s = e.substring(0, n - d), i = e.substring(n + h), o = t.substring(0, l - d), a = t.substring(l + h))
        }
        return 2 * u.length >= e.length ? [s, i, o, a, u] : null
    }
    if (this.Diff_Timeout <= 0) return null;
    var s = e.length > t.length ? e : t,
        i = e.length > t.length ? t : e;
    if (s.length < 4 || 2 * i.length < s.length) return null;
    var o, r = this,
        a = n(s, i, Math.ceil(s.length / 4)),
        c = n(s, i, Math.ceil(s.length / 2));
    if (!a && !c) return null;
    o = c ? a && a[4].length > c[4].length ? a : c : a;
    var l, u, h, d;
    e.length > t.length ? (l = o[0], u = o[1], h = o[2], d = o[3]) : (h = o[0], d = o[1], l = o[2], u = o[3]);
    var p = o[4];
    return [l, u, h, d, p]
}, diff_match_patch.prototype.diff_cleanupSemantic = function(e) {
    for (var t = !1, n = [], s = 0, i = null, o = 0, r = 0, a = 0, c = 0, l = 0; o < e.length;) e[o][0] == DIFF_EQUAL ? (n[s++] = o, r = c, a = l, c = 0, l = 0, i = e[o][1]) : (e[o][0] == DIFF_INSERT ? c += e[o][1].length : l += e[o][1].length, i && i.length <= Math.max(r, a) && i.length <= Math.max(c, l) && (e.splice(n[s - 1], 0, [DIFF_DELETE, i]), e[n[s - 1] + 1][0] = DIFF_INSERT, s--, s--, o = s > 0 ? n[s - 1] : -1, r = 0, a = 0, c = 0, l = 0, i = null, t = !0)), o++;
    for (t && this.diff_cleanupMerge(e), this.diff_cleanupSemanticLossless(e), o = 1; o < e.length;) {
        if (e[o - 1][0] == DIFF_DELETE && e[o][0] == DIFF_INSERT) {
            var u = e[o - 1][1],
                h = e[o][1],
                d = this.diff_commonOverlap_(u, h),
                p = this.diff_commonOverlap_(h, u);
            d >= p ? (d >= u.length / 2 || d >= h.length / 2) && (e.splice(o, 0, [DIFF_EQUAL, h.substring(0, d)]), e[o - 1][1] = u.substring(0, u.length - d), e[o + 1][1] = h.substring(d), o++) : (p >= u.length / 2 || p >= h.length / 2) && (e.splice(o, 0, [DIFF_EQUAL, u.substring(0, p)]), e[o - 1][0] = DIFF_INSERT, e[o - 1][1] = h.substring(0, h.length - p), e[o + 1][0] = DIFF_DELETE, e[o + 1][1] = u.substring(p), o++), o++
        }
        o++
    }
}, diff_match_patch.prototype.diff_cleanupSemanticLossless = function(e) {
    function t(e, t) {
        if (!e || !t) return 6;
        var n = e.charAt(e.length - 1),
            s = t.charAt(0),
            i = n.match(diff_match_patch.nonAlphaNumericRegex_),
            o = s.match(diff_match_patch.nonAlphaNumericRegex_),
            r = i && n.match(diff_match_patch.whitespaceRegex_),
            a = o && s.match(diff_match_patch.whitespaceRegex_),
            c = r && n.match(diff_match_patch.linebreakRegex_),
            l = a && s.match(diff_match_patch.linebreakRegex_),
            u = c && e.match(diff_match_patch.blanklineEndRegex_),
            h = l && t.match(diff_match_patch.blanklineStartRegex_);
        return u || h ? 5 : c || l ? 4 : i && !r && a ? 3 : r || a ? 2 : i || o ? 1 : 0
    }
    for (var n = 1; n < e.length - 1;) {
        if (e[n - 1][0] == DIFF_EQUAL && e[n + 1][0] == DIFF_EQUAL) {
            var s = e[n - 1][1],
                i = e[n][1],
                o = e[n + 1][1],
                r = this.diff_commonSuffix(s, i);
            if (r) {
                var a = i.substring(i.length - r);
                s = s.substring(0, s.length - r), i = a + i.substring(0, i.length - r), o = a + o
            }
            for (var c = s, l = i, u = o, h = t(s, i) + t(i, o); i.charAt(0) === o.charAt(0);) {
                s += i.charAt(0), i = i.substring(1) + o.charAt(0), o = o.substring(1);
                var d = t(s, i) + t(i, o);
                d >= h && (h = d, c = s, l = i, u = o)
            }
            e[n - 1][1] != c && (c ? e[n - 1][1] = c : (e.splice(n - 1, 1), n--), e[n][1] = l, u ? e[n + 1][1] = u : (e.splice(n + 1, 1), n--))
        }
        n++
    }
}, diff_match_patch.nonAlphaNumericRegex_ = /[^a-zA-Z0-9]/, diff_match_patch.whitespaceRegex_ = /\s/, diff_match_patch.linebreakRegex_ = /[\r\n]/, diff_match_patch.blanklineEndRegex_ = /\n\r?\n$/, diff_match_patch.blanklineStartRegex_ = /^\r?\n\r?\n/, diff_match_patch.prototype.diff_cleanupEfficiency = function(e) {
    for (var t = !1, n = [], s = 0, i = null, o = 0, r = !1, a = !1, c = !1, l = !1; o < e.length;) e[o][0] == DIFF_EQUAL ? (e[o][1].length < this.Diff_EditCost && (c || l) ? (n[s++] = o, r = c, a = l, i = e[o][1]) : (s = 0, i = null), c = l = !1) : (e[o][0] == DIFF_DELETE ? l = !0 : c = !0, i && (r && a && c && l || i.length < this.Diff_EditCost / 2 && r + a + c + l == 3) && (e.splice(n[s - 1], 0, [DIFF_DELETE, i]), e[n[s - 1] + 1][0] = DIFF_INSERT, s--, i = null, r && a ? (c = l = !0, s = 0) : (s--, o = s > 0 ? n[s - 1] : -1, c = l = !1), t = !0)), o++;
    t && this.diff_cleanupMerge(e)
}, diff_match_patch.prototype.diff_cleanupMerge = function(e) {
    e.push([DIFF_EQUAL, ""]);
    for (var t, n = 0, s = 0, i = 0, o = "", r = ""; n < e.length;) switch (e[n][0]) {
        case DIFF_INSERT:
            i++, r += e[n][1], n++;
            break;
        case DIFF_DELETE:
            s++, o += e[n][1], n++;
            break;
        case DIFF_EQUAL:
            s + i > 1 ? (0 !== s && 0 !== i && (t = this.diff_commonPrefix(r, o), 0 !== t && (n - s - i > 0 && e[n - s - i - 1][0] == DIFF_EQUAL ? e[n - s - i - 1][1] += r.substring(0, t) : (e.splice(0, 0, [DIFF_EQUAL, r.substring(0, t)]), n++), r = r.substring(t), o = o.substring(t)), t = this.diff_commonSuffix(r, o), 0 !== t && (e[n][1] = r.substring(r.length - t) + e[n][1], r = r.substring(0, r.length - t), o = o.substring(0, o.length - t))), 0 === s ? e.splice(n - i, s + i, [DIFF_INSERT, r]) : 0 === i ? e.splice(n - s, s + i, [DIFF_DELETE, o]) : e.splice(n - s - i, s + i, [DIFF_DELETE, o], [DIFF_INSERT, r]), n = n - s - i + (s ? 1 : 0) + (i ? 1 : 0) + 1) : 0 !== n && e[n - 1][0] == DIFF_EQUAL ? (e[n - 1][1] += e[n][1], e.splice(n, 1)) : n++, i = 0, s = 0, o = "", r = ""
    }
    "" === e[e.length - 1][1] && e.pop();
    var a = !1;
    for (n = 1; n < e.length - 1;) e[n - 1][0] == DIFF_EQUAL && e[n + 1][0] == DIFF_EQUAL && (e[n][1].substring(e[n][1].length - e[n - 1][1].length) == e[n - 1][1] ? (e[n][1] = e[n - 1][1] + e[n][1].substring(0, e[n][1].length - e[n - 1][1].length), e[n + 1][1] = e[n - 1][1] + e[n + 1][1], e.splice(n - 1, 1), a = !0) : e[n][1].substring(0, e[n + 1][1].length) == e[n + 1][1] && (e[n - 1][1] += e[n + 1][1], e[n][1] = e[n][1].substring(e[n + 1][1].length) + e[n + 1][1], e.splice(n + 1, 1), a = !0)), n++;
    a && this.diff_cleanupMerge(e)
}, diff_match_patch.prototype.diff_xIndex = function(e, t) {
    var n, s = 0,
        i = 0,
        o = 0,
        r = 0;
    for (n = 0; n < e.length && (e[n][0] !== DIFF_INSERT && (s += e[n][1].length), e[n][0] !== DIFF_DELETE && (i += e[n][1].length), !(s > t)); n++) o = s, r = i;
    return e.length != n && e[n][0] === DIFF_DELETE ? r : r + (t - o)
}, diff_match_patch.prototype.diff_prettyHtml = function(e) {
    for (var t = [], n = /&/g, s = /</g, i = />/g, o = /\n/g, r = 0; r < e.length; r++) {
        var a = e[r][0],
            c = e[r][1],
            l = c.replace(n, "&amp;").replace(s, "&lt;").replace(i, "&gt;").replace(o, "&para;<br>");
        switch (a) {
            case DIFF_INSERT:
                t[r] = '<ins style="background:#e6ffe6;">' + l + "</ins>";
                break;
            case DIFF_DELETE:
                t[r] = '<del style="background:#ffe6e6;">' + l + "</del>";
                break;
            case DIFF_EQUAL:
                t[r] = "<span>" + l + "</span>"
        }
    }
    return t.join("")
}, diff_match_patch.prototype.diff_text1 = function(e) {
    for (var t = [], n = 0; n < e.length; n++) e[n][0] !== DIFF_INSERT && (t[n] = e[n][1]);
    return t.join("")
}, diff_match_patch.prototype.diff_text2 = function(e) {
    for (var t = [], n = 0; n < e.length; n++) e[n][0] !== DIFF_DELETE && (t[n] = e[n][1]);
    return t.join("")
}, diff_match_patch.prototype.diff_levenshtein = function(e) {
    for (var t = 0, n = 0, s = 0, i = 0; i < e.length; i++) {
        var o = e[i][0],
            r = e[i][1];
        switch (o) {
            case DIFF_INSERT:
                n += r.length;
                break;
            case DIFF_DELETE:
                s += r.length;
                break;
            case DIFF_EQUAL:
                t += Math.max(n, s), n = 0, s = 0
        }
    }
    return t += Math.max(n, s)
}, diff_match_patch.prototype.diff_toDelta = function(e) {
    for (var t = [], n = 0; n < e.length; n++) switch (e[n][0]) {
        case DIFF_INSERT:
            t[n] = "+" + encodeURI(e[n][1]);
            break;
        case DIFF_DELETE:
            t[n] = "-" + e[n][1].length;
            break;
        case DIFF_EQUAL:
            t[n] = "=" + e[n][1].length
    }
    return t.join("	").replace(/%20/g, " ")
}, diff_match_patch.prototype.diff_fromDelta = function(e, t) {
    for (var n = [], s = 0, i = 0, o = t.split(/\t/g), r = 0; r < o.length; r++) {
        var a = o[r].substring(1);
        switch (o[r].charAt(0)) {
            case "+":
                try {
                    n[s++] = [DIFF_INSERT, decodeURI(a)]
                } catch (c) {
                    throw new Error("Illegal escape in diff_fromDelta: " + a)
                }
                break;
            case "-":
            case "=":
                var l = parseInt(a, 10);
                if (isNaN(l) || 0 > l) throw new Error("Invalid number in diff_fromDelta: " + a);
                var u = e.substring(i, i += l);
                n[s++] = "=" == o[r].charAt(0) ? [DIFF_EQUAL, u] : [DIFF_DELETE, u];
                break;
            default:
                if (o[r]) throw new Error("Invalid diff operation in diff_fromDelta: " + o[r])
        }
    }
    if (i != e.length) throw new Error("Delta length (" + i + ") does not equal source text length (" + e.length + ").");
    return n
}, diff_match_patch.prototype.match_main = function(e, t, n) {
    if (null == e || null == t || null == n) throw new Error("Null input. (match_main)");
    return n = Math.max(0, Math.min(n, e.length)), e == t ? 0 : e.length ? e.substring(n, n + t.length) == t ? n : this.match_bitap_(e, t, n) : -1
}, diff_match_patch.prototype.match_bitap_ = function(e, t, n) {
    function s(e, s) {
        var i = e / t.length,
            r = Math.abs(n - s);
        return o.Match_Distance ? i + r / o.Match_Distance : r ? 1 : i
    }
    if (t.length > this.Match_MaxBits) throw new Error("Pattern too long for this browser.");
    var i = this.match_alphabet_(t),
        o = this,
        r = this.Match_Threshold,
        a = e.indexOf(t, n); - 1 != a && (r = Math.min(s(0, a), r), a = e.lastIndexOf(t, n + t.length), -1 != a && (r = Math.min(s(0, a), r)));
    var c = 1 << t.length - 1;
    a = -1;
    for (var l, u, h, d = t.length + e.length, p = 0; p < t.length; p++) {
        for (l = 0, u = d; u > l;) s(p, n + u) <= r ? l = u : d = u, u = Math.floor((d - l) / 2 + l);
        d = u;
        var _ = Math.max(1, n - u + 1),
            f = Math.min(n + u, e.length) + t.length,
            g = Array(f + 2);
        g[f + 1] = (1 << p) - 1;
        for (var m = f; m >= _; m--) {
            var v = i[e.charAt(m - 1)];
            if (g[m] = 0 === p ? (g[m + 1] << 1 | 1) & v : (g[m + 1] << 1 | 1) & v | ((h[m + 1] | h[m]) << 1 | 1) | h[m + 1], g[m] & c) {
                var b = s(p, m - 1);
                if (r >= b) {
                    if (r = b, a = m - 1, !(a > n)) break;
                    _ = Math.max(1, 2 * n - a)
                }
            }
        }
        if (s(p + 1, n) > r) break;
        h = g
    }
    return a
}, diff_match_patch.prototype.match_alphabet_ = function(e) {
    for (var t = {}, n = 0; n < e.length; n++) t[e.charAt(n)] = 0;
    for (var n = 0; n < e.length; n++) t[e.charAt(n)] |= 1 << e.length - n - 1;
    return t
}, diff_match_patch.prototype.patch_addContext_ = function(e, t) {
    if (0 != t.length) {
        for (var n = t.substring(e.start2, e.start2 + e.length1), s = 0; t.indexOf(n) != t.lastIndexOf(n) && n.length < this.Match_MaxBits - this.Patch_Margin - this.Patch_Margin;) s += this.Patch_Margin, n = t.substring(e.start2 - s, e.start2 + e.length1 + s);
        s += this.Patch_Margin;
        var i = t.substring(e.start2 - s, e.start2);
        i && e.diffs.unshift([DIFF_EQUAL, i]);
        var o = t.substring(e.start2 + e.length1, e.start2 + e.length1 + s);
        o && e.diffs.push([DIFF_EQUAL, o]), e.start1 -= i.length, e.start2 -= i.length, e.length1 += i.length + o.length, e.length2 += i.length + o.length
    }
}, diff_match_patch.prototype.patch_make = function(e, t, n) {
    var s, i;
    if ("string" == typeof e && "string" == typeof t && "undefined" == typeof n) s = e, i = this.diff_main(s, t, !0), i.length > 2 && (this.diff_cleanupSemantic(i), this.diff_cleanupEfficiency(i));
    else if (e && "object" == typeof e && "undefined" == typeof t && "undefined" == typeof n) i = e, s = this.diff_text1(i);
    else if ("string" == typeof e && t && "object" == typeof t && "undefined" == typeof n) s = e, i = t;
    else {
        if ("string" != typeof e || "string" != typeof t || !n || "object" != typeof n) throw new Error("Unknown call format to patch_make.");
        s = e, i = n
    }
    if (0 === i.length) return [];
    for (var o = [], r = new diff_match_patch.patch_obj, a = 0, c = 0, l = 0, u = s, h = s, d = 0; d < i.length; d++) {
        var p = i[d][0],
            _ = i[d][1];
        switch (a || p === DIFF_EQUAL || (r.start1 = c, r.start2 = l), p) {
            case DIFF_INSERT:
                r.diffs[a++] = i[d], r.length2 += _.length, h = h.substring(0, l) + _ + h.substring(l);
                break;
            case DIFF_DELETE:
                r.length1 += _.length, r.diffs[a++] = i[d], h = h.substring(0, l) + h.substring(l + _.length);
                break;
            case DIFF_EQUAL:
                _.length <= 2 * this.Patch_Margin && a && i.length != d + 1 ? (r.diffs[a++] = i[d], r.length1 += _.length, r.length2 += _.length) : _.length >= 2 * this.Patch_Margin && a && (this.patch_addContext_(r, u), o.push(r), r = new diff_match_patch.patch_obj, a = 0, u = h, c = l)
        }
        p !== DIFF_INSERT && (c += _.length), p !== DIFF_DELETE && (l += _.length)
    }
    return a && (this.patch_addContext_(r, u), o.push(r)), o
}, diff_match_patch.prototype.patch_deepCopy = function(e) {
    for (var t = [], n = 0; n < e.length; n++) {
        var s = e[n],
            i = new diff_match_patch.patch_obj;
        i.diffs = [];
        for (var o = 0; o < s.diffs.length; o++) i.diffs[o] = s.diffs[o].slice();
        i.start1 = s.start1, i.start2 = s.start2, i.length1 = s.length1, i.length2 = s.length2, t[n] = i
    }
    return t
}, diff_match_patch.prototype.patch_apply = function(e, t) {
    if (0 == e.length) return [t, []];
    e = this.patch_deepCopy(e);
    var n = this.patch_addPadding(e);
    t = n + t + n, this.patch_splitMax(e);
    for (var s = 0, i = [], o = 0; o < e.length; o++) {
        var r, a = e[o].start2 + s,
            c = this.diff_text1(e[o].diffs),
            l = -1;
        if (c.length > this.Match_MaxBits ? (r = this.match_main(t, c.substring(0, this.Match_MaxBits), a), -1 != r && (l = this.match_main(t, c.substring(c.length - this.Match_MaxBits), a + c.length - this.Match_MaxBits), (-1 == l || r >= l) && (r = -1))) : r = this.match_main(t, c, a), -1 == r) i[o] = !1, s -= e[o].length2 - e[o].length1;
        else {
            i[o] = !0, s = r - a;
            var u;
            if (u = -1 == l ? t.substring(r, r + c.length) : t.substring(r, l + this.Match_MaxBits), c == u) t = t.substring(0, r) + this.diff_text2(e[o].diffs) + t.substring(r + c.length);
            else {
                var h = this.diff_main(c, u, !1);
                if (c.length > this.Match_MaxBits && this.diff_levenshtein(h) / c.length > this.Patch_DeleteThreshold) i[o] = !1;
                else {
                    this.diff_cleanupSemanticLossless(h);
                    for (var d, p = 0, _ = 0; _ < e[o].diffs.length; _++) {
                        var f = e[o].diffs[_];
                        f[0] !== DIFF_EQUAL && (d = this.diff_xIndex(h, p)), f[0] === DIFF_INSERT ? t = t.substring(0, r + d) + f[1] + t.substring(r + d) : f[0] === DIFF_DELETE && (t = t.substring(0, r + d) + t.substring(r + this.diff_xIndex(h, p + f[1].length))), f[0] !== DIFF_DELETE && (p += f[1].length)
                    }
                }
            }
        }
    }
    return t = t.substring(n.length, t.length - n.length), [t, i]
}, diff_match_patch.prototype.patch_addPadding = function(e) {
    for (var t = this.Patch_Margin, n = "", s = 1; t >= s; s++) n += String.fromCharCode(s);
    for (var s = 0; s < e.length; s++) e[s].start1 += t, e[s].start2 += t;
    var i = e[0],
        o = i.diffs;
    if (0 == o.length || o[0][0] != DIFF_EQUAL) o.unshift([DIFF_EQUAL, n]), i.start1 -= t, i.start2 -= t, i.length1 += t, i.length2 += t;
    else if (t > o[0][1].length) {
        var r = t - o[0][1].length;
        o[0][1] = n.substring(o[0][1].length) + o[0][1], i.start1 -= r, i.start2 -= r, i.length1 += r, i.length2 += r
    }
    if (i = e[e.length - 1], o = i.diffs, 0 == o.length || o[o.length - 1][0] != DIFF_EQUAL) o.push([DIFF_EQUAL, n]), i.length1 += t, i.length2 += t;
    else if (t > o[o.length - 1][1].length) {
        var r = t - o[o.length - 1][1].length;
        o[o.length - 1][1] += n.substring(0, r), i.length1 += r, i.length2 += r
    }
    return n
}, diff_match_patch.prototype.patch_splitMax = function(e) {
    for (var t = this.Match_MaxBits, n = 0; n < e.length; n++)
        if (!(e[n].length1 <= t)) {
            var s = e[n];
            e.splice(n--, 1);
            for (var i = s.start1, o = s.start2, r = ""; 0 !== s.diffs.length;) {
                var a = new diff_match_patch.patch_obj,
                    c = !0;
                for (a.start1 = i - r.length, a.start2 = o - r.length, "" !== r && (a.length1 = a.length2 = r.length, a.diffs.push([DIFF_EQUAL, r])); 0 !== s.diffs.length && a.length1 < t - this.Patch_Margin;) {
                    var l = s.diffs[0][0],
                        u = s.diffs[0][1];
                    l === DIFF_INSERT ? (a.length2 += u.length, o += u.length, a.diffs.push(s.diffs.shift()), c = !1) : l === DIFF_DELETE && 1 == a.diffs.length && a.diffs[0][0] == DIFF_EQUAL && u.length > 2 * t ? (a.length1 += u.length, i += u.length, c = !1, a.diffs.push([l, u]), s.diffs.shift()) : (u = u.substring(0, t - a.length1 - this.Patch_Margin), a.length1 += u.length, i += u.length, l === DIFF_EQUAL ? (a.length2 += u.length, o += u.length) : c = !1, a.diffs.push([l, u]), u == s.diffs[0][1] ? s.diffs.shift() : s.diffs[0][1] = s.diffs[0][1].substring(u.length))
                }
                r = this.diff_text2(a.diffs), r = r.substring(r.length - this.Patch_Margin);
                var h = this.diff_text1(s.diffs).substring(0, this.Patch_Margin);
                "" !== h && (a.length1 += h.length, a.length2 += h.length, 0 !== a.diffs.length && a.diffs[a.diffs.length - 1][0] === DIFF_EQUAL ? a.diffs[a.diffs.length - 1][1] += h : a.diffs.push([DIFF_EQUAL, h])), c || e.splice(++n, 0, a)
            }
        }
}, diff_match_patch.prototype.patch_toText = function(e) {
    for (var t = [], n = 0; n < e.length; n++) t[n] = e[n];
    return t.join("")
}, diff_match_patch.prototype.patch_fromText = function(e) {
    var t = [];
    if (!e) return t;
    for (var n = e.split("\n"), s = 0, i = /^@@ -(\d+),?(\d*) \+(\d+),?(\d*) @@$/; s < n.length;) {
        var o = n[s].match(i);
        if (!o) throw new Error("Invalid patch string: " + n[s]);
        var r = new diff_match_patch.patch_obj;
        for (t.push(r), r.start1 = parseInt(o[1], 10), "" === o[2] ? (r.start1--, r.length1 = 1) : "0" == o[2] ? r.length1 = 0 : (r.start1--, r.length1 = parseInt(o[2], 10)), r.start2 = parseInt(o[3], 10), "" === o[4] ? (r.start2--, r.length2 = 1) : "0" == o[4] ? r.length2 = 0 : (r.start2--, r.length2 = parseInt(o[4], 10)), s++; s < n.length;) {
            var a = n[s].charAt(0);
            try {
                var c = decodeURI(n[s].substring(1))
            } catch (l) {
                throw new Error("Illegal escape in patch_fromText: " + c)
            }
            if ("-" == a) r.diffs.push([DIFF_DELETE, c]);
            else if ("+" == a) r.diffs.push([DIFF_INSERT, c]);
            else if (" " == a) r.diffs.push([DIFF_EQUAL, c]);
            else {
                if ("@" == a) break;
                if ("" !== a) throw new Error('Invalid patch mode "' + a + '" in: ' + c)
            }
            s++
        }
    }
    return t
}, diff_match_patch.patch_obj = function() {
    this.diffs = [], this.start1 = null, this.start2 = null, this.length1 = 0, this.length2 = 0
}, diff_match_patch.patch_obj.prototype.toString = function() {
    var e, t;
    e = 0 === this.length1 ? this.start1 + ",0" : 1 == this.length1 ? this.start1 + 1 : this.start1 + 1 + "," + this.length1, t = 0 === this.length2 ? this.start2 + ",0" : 1 == this.length2 ? this.start2 + 1 : this.start2 + 1 + "," + this.length2;
    for (var n, s = ["@@ -" + e + " +" + t + " @@\n"], i = 0; i < this.diffs.length; i++) {
        switch (this.diffs[i][0]) {
            case DIFF_INSERT:
                n = "+";
                break;
            case DIFF_DELETE:
                n = "-";
                break;
            case DIFF_EQUAL:
                n = " "
        }
        s[i + 1] = n + encodeURI(this.diffs[i][1]) + "\n"
    }
    return s.join("").replace(/%20/g, " ")
}, this.diff_match_patch = diff_match_patch, this.DIFF_DELETE = DIFF_DELETE, this.DIFF_INSERT = DIFF_INSERT, this.DIFF_EQUAL = DIFF_EQUAL;
var CMEditorSettings = {
        getDefaultEditorConfig: function(e, t, n) {
            return {
                value: e,
                showCursorWhenSelecting: !0,
                cursorScrollMargin: 30,
                scrollbarStyle: this._getScrollbars(n),
                tabSize: this.getTabSize(t),
                indentUnit: this.getTabSize(t),
                indentWithTabs: this.getIndentWithTabs(t),
                lineNumbers: t.line_numbers,
                matchBrackets: t.match_brackets,
                autoCloseBrackets: t.match_brackets,
                lineWrapping: t.line_wrapping,
                gutters: this._getGutters(t),
                foldGutter: t.code_folding
            }
        },
        getPostEditorConfig: function(e) {
            return {
                showCursorWhenSelecting: !0,
                tabSize: this.getTabSize(e),
                indentUnit: this.getTabSize(e),
                indentWithTabs: this.getIndentWithTabs(e),
                matchBrackets: e.match_brackets,
                autoCloseBrackets: e.match_brackets,
                lineWrapping: !0
            }
        },
        _getScrollbars: function(e) {
            return e ? null : "simple"
        },
        getTabSize: function(e) {
            return parseInt(e.tab_size, 10)
        },
        getIndentWithTabs: function(e) {
            return "tabs" === e.indent_with
        },
        _getGutters: function(e) {
            return e.code_folding === !0 ? ["CodeMirror-linenumbers", "CodeMirror-foldgutter"] : [""]
        }
    },
    BaseEditor = Class.extend({
        editor: "",
        _viewingSource: !1,
        _canDrive: !0,
        type: "",
        value: "",
        init: function(e, t) {
            this.type = e, this.value = t, this.pageType = __pageType, this.mobile = __mobile, this.dmp = new diff_match_patch, this._onEditorChangeFunc = $.proxy(this._onEditorChange, this), _.extend(this, BaseEditorCommon), _.extend(this, BaseEditorSetValueMixin), _.extend(this, BaseEditorScrollingMixin), _.extend(this, BaseEditorViewSourceMixin), _.extend(this, BaseEditorCursorMixin), this._baseBindToHub(), this._loadTabSnippets(this.type), this._buildEditor()
        },
        _baseBindToHub: function() {
            Hub.sub("ui-disable", $.proxy(this._disableUserFromDriving, this)), Hub.sub("ui-enable", $.proxy(this._enableUserToDrive, this)), Hub.sub("page-loading-done", $.proxy(this._onPageLoadingDone, this)), Hub.sub("editor-refresh", $.proxy(this.refresh, this)), Hub.sub("editor-lose-focus", $.proxy(this._onEditorLoseFocus, this)), Hub.sub("key", $.proxy(this._onKey, this)), Hub.sub("sync-other-cursor", $.proxy(this._onSyncOtherCursor, this)), Hub.sub("cm-update-keybindings", $.proxy(this._onCMUpdateKeybindingsEvent, this)), Hub.sub("server-pen-change", $.proxy(this._onServerPenChange, this)), Hub.sub("server-ui-change", $.proxy(this._onServerUIChange, this)), Hub.sub("pen-change", $.proxy(this._onBasePenChange, this))
        },
        _onCMUpdateKeybindingsEvent: function() {
            this._onCmUpdateKeyBindings(window.__pen.editor_settings)
        },
        _onKey: function(e, t) {
            "esc" === t.key && (this.editor.execCommand("clearSearch"), this.runRefresh(200))
        },
        _onServerPenChange: function(e, t) {
            "professor" === this.pageType && this.type in t.pen && this.setEditorValueInProfessor(t.pen[this.type])
        },
        _onServerUIChange: function(e, t) {
            var n = "";
            if ("textSelection" in t.ui)
                for (n in t.ui.textSelection) n === this.type && this._setEditorSelection(t.ui.textSelection[n]);
            if ("scrollTopLine" in t.ui)
                for (n in t.ui.scrollTopLine) n === this.type && this._scrollToLine(t.ui.scrollTopLine[n])
        },
        _onBasePenChange: function(e, t) {
            ObjectUtil.hasNestedValue(t, "pen.editor_settings.indent_with") && this.editor.setOption("indentWithTabs", CMEditorSettings.getIndentWithTabs(t.pen.editor_settings)), ObjectUtil.hasNestedValue(t, "pen.editor_settings.tab_size") && (this.editor.setOption("tabSize", CMEditorSettings.getTabSize(t.pen.editor_settings)), this.editor.setOption("indentUnit", CMEditorSettings.getTabSize(t.pen.editor_settings)))
        },
        _onPageLoadingDone: function() {
            this._indentWrappedLines(), this.runRefresh(200)
        },
        _buildEditor: function() {
            this.editor = this._buildCMEditor(this._getEditorConfig()), this._setMode(), this._bindToHub(), this._setEditorTypeSpecificOptions(), this._setEmmetOrNot(), this.bindToOnChange(), this._bindToRealtimeEditorEvents()
        },
        _setEmmetOrNot: function() {
            "js" !== this.type && _.isObject(window.emmetCodeMirror) && emmetCodeMirror(this.editor, this._getCustomEmmetKeymap())
        },
        _getCustomEmmetKeymap: function() {
            var e = _.cloneDeep(window.emmetCodeMirror.defaultKeymap),
                t = ["Cmd-D", "Cmd-Alt-Right", "Cmd-Alt-Left", "Cmd-Shift-M", "Cmd-Alt-Up", "Cmd-Alt-Down", "Shift-Cmd-Up", "Shift-Cmd-Down"];
            return "normal" !== CP.pen.editor_settings.key_bindings && _.forEach(t, function(t) {
                delete e[t], delete e[t.replace("Cmd", "Ctrl")]
            }), e
        },
        _getEditorConfig: function() {
            return _.extend(CMEditorSettings.getDefaultEditorConfig(this.value, CP.pen.editor_settings, window.__mobile), this._getEditorTypeSpecificConfig())
        },
        _buildCMEditor: function(e) {
            var t = this._getTextAreaElementToReplaceWithCodeMirror();
            return CodeMirror(function(e) {
                t.parentNode.replaceChild(e, t)
            }, e)
        },
        _getTextAreaElementToReplaceWithCodeMirror: function() {
            return $("#" + this.type)[0]
        },
        _bindToRealtimeEditorEvents: function() {
            "professor" === this.pageType ? (this.editor.on("cursorActivity", $.proxy(this._onCursorActivity, this)), this.editor.on("scroll", $.proxy(this._onScroll, this))) : "collab" === this.pageType && this.editor.on("cursorActivity", $.proxy(this._onCursorActivity, this))
        },
        _disableUserFromDriving: function() {
            this._canDrive = !1, this.editor.setOption("readOnly", !0)
        },
        _enableUserToDrive: function() {
            this._canDrive = !0, this.editor.setOption("readOnly", !1)
        },
        _preProcessorChanged: function(e) {
            this._turnOffReadOnlyView(), this._changeMode(e), this._loadTabSnippets(this.type)
        },
        _turnOffReadOnlyView: function() {
            this._viewingSource && this.showOriginalCode()
        },
        LOAD_TAB_SNIPPETS_WAIT_TIME: 500,
        _loadTabSnippets: function(e) {
            _.isUndefined(window.TabSnippets) || setTimeout(function() {
                TabSnippets.loadSnippet(e)
            }, this.LOAD_TAB_SNIPPETS_WAIT_TIME)
        },
        unbindOnChange: function() {
            this.editor.off("change", this._onEditorChangeFunc)
        },
        bindToOnChange: function() {
            this.editor.on("change", this._onEditorChangeFunc)
        },
        _onEditorChange: function(e) {
            var t = this.editor.getOption("readOnly");
            if (t === !1) {
                var n = {
                    origin: "client",
                    pen: {}
                };
                n.pen[this.type] = e.getValue(), CP.pen.setPenValue(n)
            }
        },
        getValue: function() {
            return this.editor.getValue()
        },
        _setMode: function() {
            var e = this._getBasicType(),
                t = CP.pen[e + "_pre_processor"];
            this._changeMode(t)
        },
        getMode: function() {
            var e = this._getBasicType(),
                t = CP.pen[e + "_pre_processor"];
            return EditorModes.getCMMode(t, e)
        },
        _changeMode: function(e) {
            var t = this,
                n = EditorModes.getLoaderMode(e, this._getBasicType()),
                s = EditorModes.getCMMode(e, this._getBasicType());
            Loader.run(n, function() {
                t.editor && t.editor.setOption("mode", s)
            })
        },
        _getBasicType: function() {
            throw "Implement in subclass"
        },
        hasFocus: function() {
            return this.editor.hasFocus()
        },
        refresh: function(e, t) {
            this.runRefresh(t.delay)
        },
        runRefresh: function(e) {
            e > 0 ? setTimeout($.proxy(function() {
                this.runRefresh()
            }, this), e) : this.editor.refresh()
        }
    }),
    BaseEditorCommon = {
        _onCmUpdateKeyBindings: function(e) {
            switch (e.key_bindings) {
                case "vim":
                    this.editor.setOption("vimMode", !0);
                    break;
                case "subl":
                    this.editor.setOption("keyMap", "sublime");
                    break;
                default:
                    this.editor.setOption("keyMap", "extended_base")
            }
        },
        _indentWrappedLines: function() {
            var e = this.editor.defaultCharWidth(),
                t = 2,
                n = this;
            this.editor.on("renderLine", function(s, i, o) {
                if (n._canAdjustRenderedLine(s)) {
                    var r = s.getOption("tabSize"),
                        a = CodeMirror.countColumn(i.text, null, r),
                        c = a * e;
                    o.style.textIndent = "-" + c + "px", o.style.paddingLeft = t + c + "px"
                }
            })
        },
        _canAdjustRenderedLine: function(e) {
            return "undefined" != typeof TypesUtil && "html" !== TypesUtil.cmModeToType(e.getOption("mode")) ? !1 : "undefined" == typeof CP.pen ? !1 : "tabs" === CP.pen.editor_settings.indent_with ? !1 : !0
        }
    },
    BaseEditorCursorMixin = {
        _setEditorSelection: function(e) {
            Hub.pub("editor-lose-focus", {}), this._onEditorGainFocus(), this._setEditorCursorOrSelection(e)
        },
        _setEditorCursorOrSelection: function(e) {
            var t = e.start,
                n = e.end;
            t.ch !== n.ch || t.line !== n.line ? this.editor.doc.setSelection(e.start, e.end) : this._setCursor(t)
        },
        _onEditorGainFocus: function() {
            $("#box-" + this.type).addClass("student"), this._giveEditorFocus()
        },
        _onEditorLoseFocus: function() {
            $("#box-" + this.type).removeClass("student")
        },
        _throttledHandleCollabCursorActivity: !1,
        _THROTTLE: 200,
        _onCursorActivity: function(e) {
            if ("professor" === this.pageType) this._handleProfessorOnCursorActivity(e);
            else if ("collab" === this.pageType) {
                if (!this._throttledHandleCollabCursorActivity) {
                    var t = this;
                    this._throttledHandleCollabCursorActivity = _.throttle(function(e) {
                        t._handleCollabOnCursorActivity(e)
                    }, this._THROTTLE, {
                        leading: !0,
                        trailing: !1
                    })
                }
                this._throttledHandleCollabCursorActivity(e)
            }
        },
        _pubCursorActivityTimeout: 0,
        _PUB_CURSOR_THROTTLE: 250,
        _handleProfessorOnCursorActivity: function(e) {
            var t = this._getOnCursorActivityData(e);
            CP.ui.textSelection[this.type] = t.ui.textSelection[this.type], clearTimeout(this._pubCursorActivityTimeout), this._pubCursorActivityTimeout = setTimeout(function() {
                Hub.pub("ui-change", t)
            }, this._PUB_CURSOR_THROTTLE)
        },
        _getOnCursorActivityData: function(e) {
            var t = {
                ui: {
                    textSelection: {}
                }
            };
            return t.ui.textSelection[this.type] = this._getCursorsHash(e), t
        },
        _handleCollabOnCursorActivity: function(e) {
            this._updateCursorsMap(e)
        },
        $newComment: $("#new-comment"),
        _giveEditorFocus: function() {
            var e = this;
            this._returnNewCommentsFocus(function() {
                e.editor.focus()
            })
        },
        _setCursor: function(e) {
            var t = this.editor.getCursor();
            if (t.ch !== e.ch || t.line !== e.line) {
                var n = this;
                this._returnNewCommentsFocus(function() {
                    n.editor.setCursor(e)
                })
            }
        },
        _setSelection: function(e) {
            var t = this;
            this._returnNewCommentsFocus(function() {
                t.editor.doc.setSelection(e.start, e.end)
            })
        },
        _returnNewCommentsFocus: function(e) {
            var t = this.$newComment.is(":focus");
            if (e(), t) {
                var n = this;
                setTimeout(function() {
                    n.$newComment.focus()
                }, 10)
            }
        },
        _cursors: {},
        _clientID: {},
        _prevOtherCursors: {},
        _onSyncOtherCursor: function(e, t) {
            this._clientID = t.clientID, this._cursors = t.cursors, this._initClientCursorState()
        },
        _initClientCursorState: function() {
            this._cursors.get(this._clientID) || this._cursors.set(this._clientID, {}), this._updateCursorsMap(this.editor)
        },
        _CLEAR_UNUSED_CURSOR_TIMEOUT: 1e4,
        showOtherCursor: function(e, t) {
            this._cleanUpPrevCursors(e);
            var n = t[this.type],
                s = this._getOtherClientColor(e),
                i = this._setSimpleCurosr(s, e, n);
            this._prevOtherCursors[e] = i, setTimeout(function() {
                i.clear()
            }, this._CLEAR_UNUSED_CURSOR_TIMEOUT)
        },
        _cleanUpPrevCursors: function(e) {
            this._prevOtherCursors[e] && this._prevOtherCursors[e].clear()
        },
        _otherClientColors: {},
        _colors: ["#1abc9c", "#e67e22", "#3498db", "#f39c12", "#9b59b6", "#f1c40f"],
        _getOtherClientColor: function(e) {
            return this._otherClientColors[e] || (this._otherClientColors[e] = this._colors.pop()), this._otherClientColors[e]
        },
        _setSimpleCurosr: function(e, t, n) {
            var s = this._buildPseudoCursorEl(e, t, n);
            return this.editor.addWidget(n.start, s, !1), {
                clear: function() {
                    var e = s.parentNode;
                    e && e.removeChild(s)
                }
            }
        },
        _buildPseudoCursorEl: function(e, t, n) {
            var s = this.editor.charCoords(n.start),
                i = document.createElement("pre");
            return i.className = "other-client", i.style.borderLeftWidth = "2px", i.style.borderLeftStyle = "solid", i.innerHTML = "&nbsp;", i.style.borderLeftColor = e, i.style.height = .9 * (s.bottom - s.top) + "px", i.style.marginTop = s.top - s.bottom + "px", i.style.zIndex = 0, i
        },
        _updateCursorsMap: function(e) {
            var t = {};
            t[this.type] = this._getCursorsHash(e), this._shouldUpdateCursors(t[this.type]) && this._cursors.set(this._clientID, t)
        },
        _shouldUpdateCursors: function(e) {
            return 0 === e.start.line && 0 === e.start.ch && 0 === e.end.line && 0 === e.start.ch ? !1 : !0
        },
        _getCursorsHash: function(e) {
            return {
                start: e.doc.getCursor(!0),
                end: e.doc.getCursor(!1)
            }
        }
    },
    BaseEditorScrollingMixin = {
        SHOW_PREVIOUS_LINES: 1,
        $scrollableElement: !1,
        getScrollTopLine: function() {
            return Math.floor(this._getScrollTop() / this._getLineHeight())
        },
        _getScrollTop: function() {
            return this._getScrollableElement().scrollTop()
        },
        _setScrollTop: function(e) {
            this._getScrollableElement().scrollTop(e)
        },
        _scrollToLine: function(e) {
            var t;
            t = e > this.SHOW_PREVIOUS_LINES ? e - this.SHOW_PREVIOUS_LINES : e;
            var n = Math.floor(this._getLineHeight() * t);
            this._setScrollTop(n)
        },
        _getLineHeight: function() {
            var e = this._getScrollableElement()[0].scrollHeight;
            return e / this.editor.lineCount()
        },
        _getScrollableElement: function() {
            if (!this.$scrollableElement && (this.$scrollableElement = $("#box-" + this.type + " .CodeMirror-scroll"), this.$scrollableElement.length < 0)) throw new Error("Unable to sync scroll. Please contact support@codepen.io.");
            return this.$scrollableElement
        },
        _onScroll: function() {
            var e = {
                ui: {
                    scrollTopLine: {}
                }
            };
            e.ui.scrollTopLine[this.type] = this.getScrollTopLine(), Hub.pub("ui-change", e)
        }
    },
    BaseEditorSetValueMixin = {
        setValue: function(e) {
            this.editor.setValue(e)
        },
        SCROLL_PAST_LINES: 5,
        setEditorValueInProfessor: function(e) {
            var t = this.editor.getCursor();
            this.setValue(e), this._setCursor(t), this._setPenDataValue(e)
        },
        setEditorValueInCollab: function(e) {
            var t = this.editor.lineCount(),
                n = this.editor.getCursor(),
                s = this.editor.getLine(n.line) || "",
                i = this._getScrollTop(),
                o = s.substring(0, n.ch),
                r = n.ch;
            this._setEditorValue(e), n.line = this._calculateCursorLineNumber(s, n.line, t, r), n.ch = this._calculateCursorChPosition(n.line, n.ch, o, s), this._setCursor(n), this._setScrollTop(i), this._setPenDataValue(e)
        },
        _setPenDataValue: function(e) {
            var t = {
                origin: "server",
                pen: {}
            };
            t.pen[this.type] = e, setTimeout(function() {
                CP.pen.setPenValue(t)
            }, 50)
        },
        _setEditorValue: function(e) {
            this.unbindOnChange(), this.editor.setValue(e), this.bindToOnChange()
        },
        _calculateCursorLineNumber: function(e, t, n, s) {
            e = e || "";
            var i = this.editor.lineCount(),
                o = Math.abs(n - i);
            if (0 === o) return t;
            for (var r = "", a = 0, c = 0, l = 0; o + 1 > l; l++)
                if (0 === l) {
                    if (r = this.editor.getLine(t) || "", this._calcLineMatchScore(r, e, s) > -1) return t
                } else {
                    if (t - l > -1) {
                        a = t - l, r = this.editor.getLine(a) || "";
                        var u = this._calcLineMatchScore(r, e, s);
                        if (u > -1) return a
                    }
                    if (i > t + l) {
                        c = t + l, r = this.editor.getLine(c) || "";
                        var h = this._calcLineMatchScore(r, e, s);
                        if (h > -1) return c
                    }
                }
            return t
        },
        MAX_OLD_LINE_LENGTH: 30,
        _calcLineMatchScore: function(e, t, n) {
            return n = n > 0 ? n : 1, this.dmp.Match_Distance = e.length, t = t.substring(0, this.MAX_OLD_LINE_LENGTH), this.dmp.Match_Threshold = .4, this.dmp.match_main(e, t, n)
        },
        _calculateCursorChPosition: function(e, t, n, s) {
            var i = this.editor.getLine(e) || "",
                o = i.substring(0, t);
            return n !== o && (t += i.length - s.length, t = 0 > t ? 0 : t), t
        }
    },
    BaseEditorViewSourceMixin = {
        showSource: function() {
            this.unbindOnChange(), this._makeEditorReadOnly(), this._changeModeOnShowSource(), this._showSource(), this._removeEventFromEditorUndoHistory()
        },
        _changeModeOnShowSource: function() {
            this._changeMode("none")
        },
        _showSource: function() {
            CP.penErrorHandler.clearPreprocWidgets(this.type), this._setEditorValue(CP.penProcessor.getProcessed(this.type))
        },
        _makeEditorReadOnly: function() {
            $("#box-" + this.type).addClass("view-compiled"), $("#viewsource-" + this.type).attr("title", Copy.returnToSource), this.editor.setOption("readOnly", !0)
        },
        showOriginalCode: function() {
            this._showOriginalCode(), this._changeModeOnShowOriginalCode(), this._makeEditable(), this.bindToOnChange(), this._removeEventFromEditorUndoHistory()
        },
        _changeModeOnShowOriginalCode: function() {
            this._changeMode(CP.pen.getAttribute(this.type + "_pre_processor"))
        },
        _removeEventFromEditorUndoHistory: function() {
            var e = this.editor.getHistory();
            e.done.pop(), e.done.pop(), this.editor.setHistory(e)
        },
        _showOriginalCode: function() {
            this._setEditorValue(CP.pen[this.type])
        },
        _makeEditable: function() {
            $("#box-" + this.type).removeClass("view-compiled view-preproc-errors"), $("#viewsource-" + this.type).attr("title", Copy.viewSource), this._canDrive && this.editor.setOption("readOnly", !1)
        }
    };
! function() {
    function e() {
        window.addEventListener("message", h, !0)
    }

    function t() {
        x = $(".console-entries"), A = $(".console-command-line-input"), M = $(".console-clear-button"), L = A.get(0)
    }

    function n() {
        A.on("keydown", i), A.on("keyup propertychange input", C), M.on("click", v), A.one("focus", b)
    }

    function s() {
        Hub.sub("ui-disable", S), Hub.sub("ui-enable", P), Hub.sub("ui-console-opened", w), Hub.sub("console-opened", T), Hub.sub("console-closed", y), Hub.sub("server-console-change", E)
    }

    function i(e) {
        if (C(), e.keyCode && H !== !0) {
            switch (e.keyCode) {
                case 13:
                    if (!e.shiftKey) return e.preventDefault(), void r();
                    break;
                case 38:
                    a(1);
                    break;
                case 40:
                    a(-1)
            }
            "professor" === Q && (clearTimeout(G), G = setTimeout(function() {
                o()
            }, X))
        }
    }

    function o(e) {
        var t = {
            console: {
                consoleData: A.val()
            }
        };
        e ? (t.console.command = e, Hub.pub("console-change", t)) : Hub.pub("console-change", t)
    }

    function r() {
        var e = A.val();
        if ("" !== e) {
            if ("clear()" === e || "clear();" === e) return void g();
            l(e), A.val(""), f(e), d(e), "professor" === Q && (clearTimeout(G), o(e)), C()
        }
    }

    function a(e) {
        1 === e && 0 === U && (F = A.val()), U += e, 0 > U && (U = 0), U > R.length && (U = R.length), A.val(0 === U ? F : R[U - 1]), setTimeout(c, 0)
    }

    function c() {
        if (L.setSelectionRange) {
            var e = 2 * A.val().length;
            L.setSelectionRange(e, e)
        }
    }

    function l(e) {
        U = 0, R.unshift(e), R.length > O && R.pop()
    }

    function u() {
        var e = $(".console-message");
        e.length > O && e.slice(0, e.length - O).remove(), x.scrollTop(x.get(0).scrollHeight)
    }

    function h(e) {
        var t = e.data;
        t.length && "console" === t[0] && p(t[1])
    }

    function d(e) {
        D = $(".result-iframe").get(0).contentWindow;
        var t = {
            type: "command",
            command: e
        };
        D.postMessage(t, "*")
    }

    function p(e) {
        if (e.arguments) {
            var t = e.arguments.join(" ");
            t.length > z && (e = W), V === !1 ? (j.push(e), j.length > N && (j.shift(), B = !0)) : _(e)
        }
    }

    function _(e) {
        var t = $(I);
        e.function && t.addClass(e.function);
        var n = e.arguments,
            s = e.complexity,
            i = n.join(" ");
        if (s > 1) {
            x.append(t);
            var o = CodeMirror(t.get(0), {
                value: i,
                foldGutter: !0,
                readOnly: "nocursor",
                gutters: ["CodeMirror-foldgutter"],
                mode: "javascript"
            });
            if (-1 !== i.indexOf(": function"))
                for (var r = o.firstLine(), a = o.lastLine(); a >= r; r++) o.foldCode(CodeMirror.Pos(r, 0), null, "fold")
        } else CodeMirror.runMode(i, {
            name: "javascript",
            json: !0
        }, t.get(0)), x.append(t);
        u()
    }

    function f(e) {
        var t = $(I);
        t.addClass("echo"), t.text(e), x.append(t), u()
    }

    function g() {
        v(), A.val("")
    }

    function m() {
        $(".console-message .CodeMirror").each(function(e, t) {
            t.CodeMirror.refresh()
        }), u()
    }

    function v() {
        $(".console-message").remove()
    }

    function b() {
        var e = L.value;
        L.value = "", k = L.scrollHeight, L.value = e
    }

    function C() {
        var e, t = 0 | L.getAttribute("data-min-rows");
        L.rows = t, e = Math.ceil((L.scrollHeight - k) / 15), L.rows = t + e
    }

    function T() {
        V = !0, B === !0 && (_(J), B = !1);
        for (var e = 0; e < j.length; e++) _(j[e]);
        j = [], setTimeout(m, 1)
    }

    function y() {
        V = !1
    }

    function S() {
        A.addClass("disabled"), H = !0
    }

    function P() {
        A.removeClass("disabled"), H = !1
    }

    function w() {
        A.focus()
    }

    function E(e, t) {
        A.val(t.console.consoleData), t.console.command && (f(t.console.command), d(t.console.command))
    }
    CP.ConsoleEditor = {};
    var x, A, M, L, D, I = "<pre class='console-message CodeMirror-line'></pre>",
        R = [],
        O = 100,
        U = -1,
        F = "",
        H = !1,
        k = 15,
        V = !1,
        j = [],
        N = 11,
        B = !1,
        z = 5e3,
        W = {
            "function": "error",
            arguments: ["Log Skipped: Sorry, this log was too large for our console. You might need to use the browser console instead."],
            complexity: 1
        },
        J = {
            "function": "error",
            arguments: ["Logs Trimmed: To keep things fast we only stored the last " + (N - 1) + " messages while the CodePen console was closed, the others will be in the browser console."],
            complexity: 1
        },
        Q = __pageType,
        G = null,
        X = 250;
    CP.ConsoleEditor.init = function() {
        t(), n(), s(), e()
    }
}();
var CSSEditor = BaseEditor.extend({
        _getBasicType: function() {
            return "css"
        },
        _bindToHub: function() {
            Hub.sub("pen-change", $.proxy(this._onPenChange, this)), Hub.sub("page-loading-done", $.proxy(this._onPageLoadingDone, this))
        },
        _onPenChange: function(e, t) {
            ObjectUtil.hasNestedValue(t, "pen.css_pre_processor") && this._preProcessorChanged(t.pen.css_pre_processor)
        },
        _onPageLoadingDone: function() {
            this.mobile && setTimeout($.proxy(function() {
                this.editor.focus()
            }, this), 400)
        },
        _getEditorTypeSpecificConfig: function() {
            return {
                mode: this.getMode()
            }
        },
        _setEditorTypeSpecificOptions: function() {
            _.isObject(window.emmetCodeMirror) && this._turnOffAllVendorPrefixingInEmmet()
        },
        _turnOffAllVendorPrefixingInEmmet: function() {
            _.forEach(this._emmetSupportedSyntaxes(), function(e) {
                window.emmetCodeMirror.emmet.preferences.set(e + ".autoInsertVendorPrefixes", !1)
            })
        },
        _emmetSupportedSyntaxes: function() {
            return _.difference(__preprocessors.css.syntaxes, __preprocessors.css.exclude_emmet_syntaxes)
        }
    }),
    EditorModes = {
        htmlModes: {
            text: "text",
            none: {
                name: "xml",
                htmlMode: !0
            },
            html: {
                name: "xml",
                htmlMode: !0
            },
            haml: "haml",
            slim: "application/x-slim",
            markdown: "markdown",
            jade: "jade"
        },
        htmlLoaderModes: {
            text: "text",
            none: "xml",
            html: "xml",
            haml: "haml",
            slim: "application/x-slim",
            markdown: "markdown",
            jade: "jade"
        },
        cssModes: {
            none: "text/css",
            css: "text/css",
            postcss: "text/css",
            scss: "text/x-scss",
            stylus: "text/x-styl",
            less: "text/x-less",
            sass: "text/x-sass"
        },
        jsModes: {
            none: "text/javascript",
            js: "text/javascript",
            coffeescript: "text/x-coffeescript",
            livescript: "text/x-livescript",
            typescript: "text/typescript",
            babel: "text/javascript"
        },
        getLoaderMode: function(e, t) {
            return "html" === t ? e in this.htmlLoaderModes ? "mode_" + this.htmlLoaderModes[e] : "mode_text" : "css" === t ? e in this.cssModes ? "mode_" + this.cssModes[e] : "mode_text" : "js" === t ? e in this.jsModes ? "mode_" + this.jsModes[e] : "mode_text" : void 0
        },
        getCMMode: function(e, t) {
            return "html" === t ? e in this.htmlModes ? this.htmlModes[e] : "text" : "css" === t ? e in this.cssModes ? this.cssModes[e] : "text" : "js" === t ? e in this.jsModes ? this.jsModes[e] : "text" : void 0
        }
    },
    HTMLEditor = BaseEditor.extend({
        _getBasicType: function() {
            return "html"
        },
        _bindToHub: function() {
            Hub.sub("pen-change", $.proxy(this._onPenChange, this))
        },
        _onPenChange: function(e, t) {
            ObjectUtil.hasNestedValue(t, "pen.html_pre_processor") && this._preProcessorChanged(t.pen.html_pre_processor)
        },
        _getEditorTypeSpecificConfig: function() {
            return {
                mode: this.getMode(),
                syntax: "html",
                profile: "xhtml",
                autofocus: !0
            }
        },
        _setEditorTypeSpecificOptions: function() {}
    }),
    JSEditor = BaseEditor.extend({
        _getBasicType: function() {
            return "js"
        },
        _bindToHub: function() {
            Hub.sub("pen-change", $.proxy(this._onPenChange, this))
        },
        _onPenChange: function(e, t) {
            ObjectUtil.hasNestedValue(t, "pen.js_pre_processor") && this._preProcessorChanged(t.pen.js_pre_processor)
        },
        _getEditorTypeSpecificConfig: function() {
            return {
                mode: this.getMode()
            }
        },
        _setEditorTypeSpecificOptions: function() {
            this.editor.setOption("extraKeys", CodeMirror.normalizeKeyMap({
                Tab: function(e) {
                    CMEditorSettings.getIndentWithTabs(CP.pen.editor_settings) ? e.execCommand("defaultTab") : e.somethingSelected() ? e.indentSelection("add") : e.execCommand("insertSoftTab")
                }
            }))
        }
    });
CP.codeEditorResizeController = {
    init: function() {
        this.model = CP.CodeEditorResizeModel, this.events = CP.CodeEditorsResizeEvents, this.view = CP.CodeEditorsResizeView, this.model.init(), this.events.init(this), this.view.init(this.model)
    },
    toggle: function(e) {
        this.model.toggle(e)
    },
    open: function(e) {
        this.model.open(e)
    },
    close: function(e) {
        this.model.close(e)
    },
    expand: function(e) {
        this.model.expand(e)
    },
    resetSizes: function() {
        this.model.resetSizes()
    },
    syncWithServer: function(e) {
        this.model.syncWithServer(e)
    },
    updateEditorSizes: function(e) {
        this.model.updateEditorSizes(e)
    },
    getOpenEditorCount: function() {
        return this.model.getOpenEditorCount()
    },
    getEditorPositions: function() {
        return this.model.getEditorPositions()
    },
    onWindowResize: function() {
        this.view.onWindowResize()
    }
};
var EnableDisableDriver = {
    _canDrive: !0,
    bindToEnableDisableHubEvents: function() {
        Hub.sub("ui-disable", $.proxy(this._disableUserFromDriving, this)), Hub.sub("ui-enable", $.proxy(this._enableUserToDrive, this))
    },
    _disableUserFromDriving: function() {
        this._canDrive = !1, this._disableUIElements()
    },
    _disableUIElements: function() {
        this._disableAllElements(this._getAllUIElements())
    },
    _disableAllElements: function(e) {
        _.forEach(e, function(e) {
            e && e.attr("disabled", !0)
        })
    },
    _enableUserToDrive: function() {
        this._canDrive = !0, this._enableUIElements()
    },
    _enableUIElements: function() {
        this._enableAllElements(this._getAllUIElements())
    },
    _enableAllElements: function(e) {
        _.forEach(e, function(e) {
            e && e.attr("disabled", !1)
        })
    }
};
! function() {
    function e() {
        Hub.sub("server-ui-change", t), Hub.sub("ui-change", n), Hub.sub("editor-sizes-change", o), Hub.sub("editor-expand", i), Hub.sub("editor-reset-sizes", r)
    }

    function t(e, t) {
        "editorSizes" in t.ui && h.syncWithServer(t)
    }

    function n(e, t) {
        t.ui && t.ui.editorSizes && s()
    }

    function s() {
        CP.CodeEditorsResizeEvents._canDrive && h.model.TOP_TYPES.forEach(function(e) {
            var t = $("#box-" + e),
                n = CP.ui.editorSizes[e],
                s = 0 === n;
            t.find(".editor-actions-right button").not(".close-editor-button").attr("disabled", s), s = 0 === n || 1 === n, t.find(".close-editor-button").attr("disabled", s)
        })
    }

    function i(e, t) {
        CP.CodeEditorsResizeEvents._canDrive && h.expand(t)
    }

    function o(e, t) {
        h.updateEditorSizes(t)
    }

    function r() {
        CP.CodeEditorsResizeEvents._canDrive && h.resetSizes()
    }

    function a() {
        p.on("click", c), $(window).on("resize", l)
    }

    function c(e) {
        if (CP.CodeEditorsResizeEvents._canDrive) {
            var t = $(e.currentTarget),
                n = t.data("type").toLowerCase();
            h.close(n)
        }
    }

    function l() {
        clearTimeout(d), d = setTimeout(u, 100)
    }

    function u() {
        h.onWindowResize()
    }
    CP.CodeEditorsResizeEvents = {
        _canDrive: !0
    };
    var h, d, p = $(".top-boxes .close-editor-button");
    _.extend(CP.CodeEditorsResizeEvents, EnableDisableDriver), CP.CodeEditorsResizeEvents._getAllUIElements = function() {
        return [p]
    }, CP.CodeEditorsResizeEvents.init = function(t) {
        h = t, this.bindToEnableDisableHubEvents(), a(), e(), s()
    }
}(),
function() {
    function e(e) {
        if (-1 === CP.CodeEditorResizeModel.TOP_TYPES.indexOf(e)) throw "Bad editor type: '" + e + "'"
    }

    function t() {
        var e = {
            ui: {
                editorSizes: CP.ui.editorSizes
            }
        };
        Hub.pub("ui-change", e)
    }

    function n() {
        var e = 0;
        return this.TOP_TYPES.forEach(function(t) {
            var n = CP.ui.editorSizes[t];
            e += 0 !== n ? 1 : 0
        }), e
    }
    CP.CodeEditorResizeModel = {
        TOP_TYPES: ["html", "css", "js"],
        INITIAL_CONSOLE_SIZES: {
            0: "closed",
            1: 1 / 3,
            2: 1
        },
        init: function() {
            var e = _getQueryString("editors");
            if (e && "111" !== e && "1110" !== e) {
                "000" === e.substring(0, 3) && (e = "111" + e.charAt(3));
                var t = e.substring(0, 3).split(""),
                    n = 0;
                t.forEach(function(e) {
                    n += parseInt(e, 10)
                }), this.TOP_TYPES.forEach(function(t, s) {
                    CP.ui.editorSizes[t] = e[s] / n
                });
                var s = e.slice(3, 4),
                    i = this.INITIAL_CONSOLE_SIZES[s] || "closed";
                CP.ui.editorSizes.console = i
            }
        },
        toggle: function(t) {
            e(t);
            var n = 0 === CP.ui.editorSizes[t];
            this[n ? "open" : "close"](t)
        },
        close: function(n) {
            e(n);
            var s = CP.ui.editorSizes[n];
            if (0 !== s && 1 !== s) {
                CP.ui.editorSizes[n] = 0;
                var i = 0;
                this.TOP_TYPES.forEach(function(e) {
                    var t = CP.ui.editorSizes[e];
                    i += t
                }), this.TOP_TYPES.forEach(function(e) {
                    CP.ui.editorSizes[e] = CP.ui.editorSizes[e] / i
                }), t()
            }
        },
        open: function(s) {
            if (e(s), 0 === CP.ui.editorSizes[s]) {
                var i = n(),
                    o = 1 / (i + 1);
                this.TOP_TYPES.forEach(function(e) {
                    var t = e === s;
                    CP.ui.editorSizes[e] = t ? o : CP.ui.editorSizes[e] * (1 - o)
                }), t()
            }
        },
        expand: function(n) {
            e(n), this.TOP_TYPES.forEach(function(e) {
                CP.ui.editorSizes[e] = e === n ? 1 : 0
            }), t()
        },
        syncWithServer: function(e) {
            this.updateEditorSizes(e.ui.editorSizes)
        },
        updateEditorSizes: function(e) {
            for (var n in e) CP.ui.editorSizes[n] = e[n];
            t()
        },
        getEditorPositions: function() {
            var e = [],
                t = 0;
            return this.TOP_TYPES.forEach(function(n) {
                e.push(t);
                var s = CP.ui.editorSizes[n];
                t += s
            }), e
        },
        resetSizes: function() {
            var e = {},
                t = this.TOP_TYPES.length;
            this.TOP_TYPES.forEach(function(n) {
                e[n] = 1 / t
            }), this.updateEditorSizes(e)
        }
    }
}(), BarDragger.prototype = Object.create(Unidragger.prototype), BarDragger.prototype.staticClick = function(e, t) {
        this.emitEvent("staticClick", [e, t]), this.didFirstClick ? (this.emitEvent("doubleClick", [e, t]), delete this.didFirstClick, clearTimeout(this.doubleClickTimeout)) : (this.didFirstClick = !0, this.doubleClickTimeout = setTimeout(function() {
            delete this.didFirstClick
        }.bind(this), BarDragger.DOUBLE_CLICK_TIME))
    }, BarDragger.DOUBLE_CLICK_TIME = 350,
    function(e) {
        "use strict";

        function t(e) {
            if (e) {
                if ("string" == typeof s[e]) return e;
                e = e.charAt(0).toUpperCase() + e.slice(1);
                for (var t, i = 0, o = n.length; o > i; i++)
                    if (t = n[i] + e, "string" == typeof s[t]) return t
            }
        }
        var n = "Webkit Moz ms Ms O".split(" "),
            s = document.documentElement.style;
        "function" == typeof define && define.amd ? define(function() {
            return t
        }) : "object" == typeof exports ? module.exports = t : e.getStyleProperty = t
    }(window),
    function() {
        function e(e, r, a) {
            var c = !1;
            for (var l in r)
                if (o.style[l] = r[l], c = e.style[l] == o.style[l], !c) break;
            if (!c) {
                var u = [];
                for (l in r) u.push(l);
                e.style[n] = u.join(""), e.style[s] = a || "0.4s", e.addEventListener(i, t, !1); {
                    e.offsetHeight
                }
                for (l in r) e.style[l] = r[l]
            }
        }

        function t(e) {
            e.target.style[n] = null, e.target.style[s] = null, e.target.removeEventListener(i, t, !1)
        }
        var n = getStyleProperty("transitionProperty"),
            s = getStyleProperty("transitionDuration"),
            i = {
                WebkitTransitionProperty: "webkitTransitionEnd",
                MozTransitionProperty: "transitionend",
                OTransitionProperty: "otransitionend",
                transitionProperty: "transitionend"
            }[n],
            o = document.createElement("div");
        window.triggerTransition = e
    }(),
    function() {
        function e() {
            t(), E.each(n), w.find(".powers-drag-handle").each(n), w.each(function(e, t) {
                var n = $(t).find(".box-title").clone();
                n.addClass("box-title--resizer"), E.eq(e).append(n)
            })
        }

        function t() {
            T = E.width(), y = E.outerHeight(), S = x.outerHeight()
        }

        function n(e, t) {
            var n = new BarDragger(t);
            n.index = e, n.on("doubleClick", r), e > 0 && (n.on("dragStart", s), n.on("dragMove", i), n.on("dragEnd", o))
        }

        function s() {
            h(this)
        }

        function i(e, t, n) {
            p(this, n)
        }

        function o() {
            _(this)
        }

        function r() {
            f(this)
        }

        function a() {
            Hub.sub("ui-change", c)
        }

        function c(e, t) {
            t.ui && (t.ui.editorSizes && l(e, t), t.ui.layout && u(e, t))
        }

        function l(e, t) {
            g(t.ui.editorSizes, !0), b(), CP.codeEditorsCSSTransitionHandler._refreshEditorAtEndOfTransition()
        }

        function u() {
            w.width("").height(""), P.width("").height(""), t(), g(CP.ui.editorSizes, !1)
        }

        function h(e) {
            var t = CP.codeEditorResizeController.events._canDrive;
            t && !D && (M = C.getEditorPositions(), L = M[e.index], D = e, d())
        }

        function d() {
            R = "top" === CP.ui.layout ? P.innerWidth() - T * A : P.innerHeight() - (y + S) * A
        }

        function p(e, t) {
            var n = CP.codeEditorResizeController.events._canDrive;
            if (n && e == D) {
                var s = "top" === CP.ui.layout ? "x" : "y",
                    i = L + t[s] / R;
                i = Math.max(0, Math.min(1, i)), M[e.index] = i, M.forEach(function(t, n) {
                    n < e.index ? M[n] = Math.min(t, i) : n > e.index && (M[n] = Math.max(t, i))
                });
                var o = {};
                M.forEach(function(e, t) {
                    var n = M[t + 1];
                    n = void 0 === n ? 1 : n;
                    var s = n - e,
                        i = C.TOP_TYPES[t];
                    o[i] = s
                }), I = o, g(o, !1)
            }
        }

        function _(e) {
            var t = CP.codeEditorResizeController.events._canDrive;
            t && e == D && (Hub.pub("editor-sizes-change", I), Hub.pub("editor-refresh", {
                delay: 0
            }), D = null, I = null)
        }

        function f(e) {
            var t = C.TOP_TYPES[e.index],
                n = 1 === CP.ui.editorSizes[t];
            n ? Hub.pub("editor-reset-sizes") : Hub.pub("editor-expand", t)
        }

        function g(e, t) {
            "top" === CP.ui.layout ? m(e, t) : v(e, t)
        }

        function m(e, t) {
            var n = P.innerWidth(),
                s = 1 - T * A / n;
            C.TOP_TYPES.forEach(function(i, o) {
                var r = e[i],
                    a = w[o];
                r *= s;
                var c = {
                    width: 100 * r + "%"
                };
                t ? triggerTransition(a, c) : $(a).css(c);
                var l = E[o],
                    u = r * n,
                    h = 230 > u;
                $(l)[h ? "addClass" : "removeClass"]("is-horiz-skinny")
            })
        }

        function v(e, t) {
            var n = P.innerHeight(),
                s = n - y * A,
                i = S / s,
                o = s / n;
            C.TOP_TYPES.forEach(function(n, s) {
                var r = e[n],
                    a = w[s];
                r = r * (1 - i * A) + i, r *= o;
                var c = {
                    height: 100 * r + "%"
                };
                t ? triggerTransition(a, c) : $(a).css(c)
            })
        }

        function b() {
            var e = C.TOP_TYPES.map(function(e) {
                var t = CP.ui.editorSizes[e];
                return t > 0 ? "1" : "0"
            });
            e = e.join("");
            var t = O[CP.ui.editorSizes.console];
            void 0 === t && (t = "1"), e += t;
            var n = window.location,
                s = n.protocol + "//" + n.host + n.pathname,
                i = "1110" === e ? "" : "?editors=" + e,
                o = s + i;
            history.replaceState("", "", o)
        }
        CP.CodeEditorsResizeView = {};
        var C, T, y, S, P = $(".top-boxes"),
            w = P.find(".box"),
            E = $(".editor-resizer"),
            x = $(".box .powers"),
            A = w.length;
        CP.CodeEditorsResizeView.init = function(t) {
            C = t, e(), g(CP.ui.editorSizes, !1), a()
        };
        var M, L, D, I, R, O = {
            closed: "0",
            1: "2"
        };
        CP.CodeEditorsResizeView.onWindowResize = function() {
            "top" === CP.ui.layout && g(CP.ui.editorSizes, !1)
        }
    }();
var CodeEditorsTidyController = Class.extend({
        init: function() {
            this.model = new CodeEditorTidyModel, this.events = new CodeEditorsTidyEvents(this), this.view = new CodeEditorsTidyView(this.model)
        },
        beautify: function(e) {
            this.model.beautify(e)
        }
    }),
    CodeEditorsTidyEvents = Class.extend({
        $tidyCodeButtons: $(".tidy-code-button"),
        init: function(e) {
            this.controller = e, this._bindToDOM()
        },
        _bindToDOM: function() {
            this.$tidyCodeButtons._on("click", this._onTidyClick, this, !0)
        },
        _onTidyClick: function(e, t) {
            this.controller.beautify(t.data("type"))
        }
    }),
    CodeEditorTidyModel = Class.extend({
        init: function() {},
        beautify: function(e) {
            var t = this;
            _getCachedScript("/assets/libs/beautify-" + e + ".js", function() {
                var n = CP[e + "Editor"].editor,
                    s = n.getSelection();
                "" === s ? n.setValue(window[e + "_beautify"](CP.pen[e], t._getPrettifyOptions())) : n.replaceSelection(window[e + "_beautify"](s, t._getPrettifyOptions()), "around")
            })
        },
        _getPrettifyOptions: function() {
            return {
                indent_size: this._getIndentWidth(),
                indent_char: this._getIndentChar(),
                preserve_newlines: !0,
                max_preserve_newlines: 2
            }
        },
        _getIndentWidth: function() {
            return "tabs" === CP.pen.editor_settings.indent_with ? 1 : parseInt(CP.pen.editor_settings.tab_size, 10)
        },
        _getIndentChar: function() {
            return "tabs" === CP.pen.editor_settings.indent_with ? "	" : " "
        }
    }),
    CodeEditorsTidyView = Class.extend({
        $htmlTidyButton: $("#html-tidy-code-button"),
        $cssTidyButton: $("#css-tidy-code-button"),
        $jsTidyButton: $("#js-tidy-code-button"),
        init: function(e) {
            this.data = e, _.extend(this, EnableDisableDriver), this.bindToEnableDisableHubEvents(), this._bindToHub(), this._syncStateOfTidyButtons(CP.pen)
        },
        _bindToHub: function() {
            var e = this;
            Hub.sub("pen-change", function(t, n) {
                e._syncStateOfTidyButtons(n.pen)
            })
        },
        _syncStateOfTidyButtons: function(e) {
            ObjectUtil.hasNestedValue(e, "html_pre_processor") && this._hideShowTidyButton(e.html_pre_processor, ["none"], this.$htmlTidyButton), ObjectUtil.hasNestedValue(e, "css_pre_processor") && this._hideShowTidyButton(e.css_pre_processor, ["none"], this.$cssTidyButton), ObjectUtil.hasNestedValue(e, "js_pre_processor") && this._hideShowTidyButton(e.js_pre_processor, ["none", "babel"], this.$jsTidyButton)
        },
        _hideShowTidyButton: function(e, t, n) {
            _.include(t, e) ? n.removeClass("hide") : n.addClass("hide")
        },
        _getAllUIElements: function() {
            return [this.$htmlTidyButton, this.$cssTidyButton, this.$jsTidyButton]
        }
    }),
    TransitionsUtil = Class.extend({
        _transitionEl: document.createElement("fakeelement"),
        _transitions: {
            transition: "transitionend",
            OTransition: "oTransitionEnd",
            MozTransition: "transitionend",
            WebkitTransition: "webkitTransitionEnd"
        },
        getBrowserTransitionEventName: function() {
            for (var e in this._transitions)
                if (void 0 !== this._transitionEl.style[e]) return this._transitions[e]
        }
    }),
    CodeEditorsCSSTransitionHandler = Class.extend({
        init: function() {
            this._bindToDOM()
        },
        _bindToDOM: function() {
            $(".box")._on(this._getBrowserTransitionEventName(), this._refreshEditorAtEndOfTransition, this)
        },
        _getBrowserTransitionEventName: function() {
            var e = new TransitionsUtil;
            return e.getBrowserTransitionEventName()
        },
        _refreshEditorAtEndOfTransition: function() {
            Hub.pub("editor-refresh", {
                delay: 10
            })
        }
    }),
    CodeEditorsUtil = {
        getEditorByType: function(e) {
            return "html" === e ? CP.htmlEditor : "css" === e ? CP.cssEditor : CP.jsEditor
        }
    },
    CodeEditorsViewSourceController = Class.extend({
        init: function() {
            this.model = new CodeEditorsViewSourceModel, this.events = new CodeEditorsViewSourceEvents(this), this.view = new CodeEditorsViewSourceView
        },
        toggleViewSource: function(e) {
            this.model.toggleViewSource(e)
        },
        setViewSourceToFalse: function(e) {
            this.model.setViewSourceToFalse(e)
        },
        syncWithServer: function(e) {
            this.model.syncWithServer(e)
        }
    }),
    CodeEditorsViewSourceEvents = Class.extend({
        _canDrive: !0,
        init: function(e) {
            this.controller = e, this._bindToDOM(), this._bindToHub()
        },
        _bindToDOM: function() {
            $(".view-compiled-button")._on("click", this._toggleViewSource, this)
        },
        _bindToHub: function() {
            Hub.sub("ui-disable", $.proxy(this._disableUserFromDriving, this)), Hub.sub("ui-enable", $.proxy(this._enableUserToDrive, this)), Hub.sub("pen-change", $.proxy(this._onPenChange, this)), Hub.sub("server-ui-change", $.proxy(this._onServerUIChange, this))
        },
        _disableUserFromDriving: function() {
            this._canDrive = !1
        },
        _enableUserToDrive: function() {
            this._canDrive = !0
        },
        _onServerUIChange: function(e, t) {
            "editorViewSource" in t.ui && this.controller.syncWithServer(t)
        },
        _toggleViewSource: function(e, t) {
            this._canDrive && this.controller.toggleViewSource({
                type: this._getType(t)
            })
        },
        _getType: function(e) {
            return $(e).closest("button").data("type").toLowerCase()
        },
        _onPenChange: function(e, t) {
            ObjectUtil.hasNestedValue(t, "pen.html_pre_processor") && this.controller.setViewSourceToFalse({
                type: "html"
            }), ObjectUtil.hasNestedValue(t, "pen.css_pre_processor") && this.controller.setViewSourceToFalse({
                type: "css"
            }), ObjectUtil.hasNestedValue(t, "pen.js_pre_processor") && this.controller.setViewSourceToFalse({
                type: "js"
            })
        }
    }),
    CodeEditorsViewSourceModel = Class.extend({
        init: function() {},
        toggleViewSource: function(e) {
            var t = this._getSource(e.type) ? !1 : !0;
            this._setSource(e.type, t), this._publishChangeEvent(e)
        },
        setViewSourceToFalse: function(e) {
            this._setSource(e.type, !1), this._publishChangeEvent(e)
        },
        _getSource: function(e) {
            return CP.ui.editorViewSource[e]
        },
        _setSource: function(e, t) {
            CP.ui.editorViewSource[e] = t
        },
        syncWithServer: function(e) {
            for (var t in e.ui.editorViewSource) CP.ui.editorViewSource[t] = e.ui.editorViewSource[t], this._publishChangeEvent({
                type: t
            })
        },
        _publishChangeEvent: function(e) {
            var t = {
                ui: {
                    editorViewSource: {}
                }
            };
            t.ui.editorViewSource[e.type] = this._getSource(e.type), Hub.pub("ui-change", t)
        }
    }),
    CodeEditorsViewSourceView = Class.extend({
        init: function() {
            this._bindToHub(), _.extend(this, EnableDisableDriver), this.bindToEnableDisableHubEvents()
        },
        _bindToHub: function() {
            Hub.sub("ui-change", $.proxy(this._onUIChange, this))
        },
        _onUIChange: function(e, t) {
            if (t.ui && t.ui.editorViewSource)
                for (var n in t.ui.editorViewSource) this._toggleViewSource(n, t.ui.editorViewSource[n])
        },
        _toggleViewSource: function(e, t) {
            var n = CodeEditorsUtil.getEditorByType(e);
            t ? (n.showSource(), $(".view-compiled-button[data-type='" + e + "']").addClass("active")) : (n.showOriginalCode(), $(".view-compiled-button[data-type='" + e + "']").removeClass("active"))
        },
        _getAllUIElements: function() {
            return [$("button.view-compiled-button")]
        }
    }),
    Pen = Class.extend({
        id: "",
        title: "",
        description: "",
        slug_hash: "",
        html: "",
        css: "",
        js: "",
        parent: 0,
        "private": !1,
        template: !1,
        html_pre_processor: "none",
        html_classes: "",
        head: "",
        css_pre_processor: "none",
        css_prefix: "neither",
        css_starter: "neither",
        js_pre_processor: "none",
        tags: [],
        newTags: [],
        editor_settings: {},
        resources: [],
        save_disabled: !1,
        autosavingNow: !1,
        last_updated: "",
        errorCode: "",
        saveAttempts: 0,
        MAX_SAVE_ATTEMPTS: 6,
        SAVE_ATTEMPT_TIMEOUT: 1e4,
        fork: !1,
        lastSavedPen: {},
        redirectingToSavedURL: !1,
        init: function() {
            _.extend(this, AJAXUtil), _.extend(this, PenResourcesData), this._loadStoredData(), this._ensureDataIsValid()
        },
        _loadStoredData: function() {
            _.extend(this, __pen, !0), this._ensureResourcesValid(), this.lastSavedPen = this._getSaveableCopyOfPen()
        },
        _ensureDataIsValid: function() {
            var e = new PenValidator;
            e.makePenValid(this), e.makePenValid(this.lastSavedPen)
        },
        setPenValue: function(e) {
            for (var t in e.pen) this._setValue(t, e.pen[t]);
            Hub.pub("pen-change", e)
        },
        _setValue: function(e, t) {
            if (_.isObject(t) && !_.isArray(t))
                for (var n in t) this[e][n] = t[n];
            else this[e] = t;
            this._updateLastUpdated()
        },
        _updateLastUpdated: function() {
            this.last_updated = (new Date).getTime()
        },
        getLastUpdatedAt: function() {
            return this.last_updated
        },
        getActiveSlugHash: function() {
            return this.private ? this.slug_hash_private : this.slug_hash
        },
        getTags: function() {
            return _.uniq(_.clone(this.tags).concat(_.clone(this.newTags)))
        },
        getAttribute: function(e) {
            return this[e]
        },
        newPen: function() {
            window.location = "/pen"
        },
        save: function() {
            this.save_disabled || (this._canSave() ? this._shouldForkPen() ? this.forkPenInCurrentState() : this._savePenToDB() : Hub.pub("pen-errors", this.errorCode))
        },
        _shouldForkPen: function() {
            return this._isPenOwnedByAnotherUser()
        },
        saveAsPrivate: function() {
            this._canSave() ? (this.private = !0, this._savePenToDB()) : Hub.pub("pen-errors", this.errorCode)
        },
        MAX_PEN_SIZE: 1e6,
        _canSave: function() {
            return !CP.user.isUserLoggedIn() && this._isPenConsideredEmpty() ? (this.errorCode = "anon-cannot-save-empty-pen", !1) : !CP.user.isUserLoggedIn() && this._isProfessorOrCollabSession() ? (this.errorCode = "anon-cannot-save-during-rt-session", !1) : _lengthInUtf8Bytes(JSON.stringify(CP.pen)) > this.MAX_PEN_SIZE ? (this.errorCode = "pen-too-large", !1) : !0
        },
        _isProfessorOrCollabSession: function() {
            return "professor" === __pageType || "collab" === __pageType
        },
        forkPenInCurrentState: function() {
            this.fork = !0, this._savePenToDB()
        },
        _savePenToDB: function() {
            this._shouldSavePenToDB() ? this.post("/pen/save", {
                pen: this._getSaveablePen()
            }, this.doneSave, this.failedSave, this.erroredSave) : this.sendPseudoSavedSignal()
        },
        _getSaveablePen: function() {
            return this._updateSaveableTagsPriorToSave(), JSON.stringify(this._getSaveableCopyOfPen())
        },
        _shouldSavePenToDB: function() {
            return this.hasPenChanged() || this._isBlankNewPen() || this._isPenOwnedByAnotherUser()
        },
        _isBlankNewPen: function() {
            return "" === this.slug_hash
        },
        _updateSaveableTagsPriorToSave: function() {
            this.tags = this.getTags(), this.newTags = []
        },
        sendPseudoSavedSignal: function() {
            Hub.pub("pen-saved", {})
        },
        doneSave: function(e) {
            this.saveAttempts = 0;
            var t = this._getDiffPen(this, this.lastSavedPen);
            if (this.lastSavedPen = this._getSaveableCopyOfPen(), e.new_pen_saved)
                if (this._isProfessorOrCollabSession()) {
                    var n = {
                        newPen: !0,
                        url: e.redirect_url,
                        pen: t
                    };
                    Hub.pub("pen-saved", n)
                } else CPLocalStorage.setItem(e.slug_hash, "new-pen"), this.redirectingToSavedURL = !0, window.location = this._getFullRedirectURL(e);
            else Hub.pub("pen-saved", {
                pen: t,
                last_saved_time_ago: e.last_saved_time_ago
            })
        },
        _getFullRedirectURL: function(e) {
            var t = document.location.href.split("?");
            return t.length > 1 ? this._stripQuestionMarkInURL(e.redirect_url + "?" + this._stripTemplateQueryPart(t[1])) : e.redirect_url
        },
        _stripTemplateQueryPart: function(e) {
            return (e || "").replace(/template=\w+/, "")
        },
        _stripQuestionMarkInURL: function(e) {
            return e.replace(/\?$/, "")
        },
        failedSave: function(e) {
            this.showStandardErrorMessage(e)
        },
        erroredSave: function() {
            if (this.saveAttempts += 1, this.saveAttempts < this.MAX_SAVE_ATTEMPTS) {
                var e = _.template(Copy.errors["unable-to-save-try-again"], {
                    time: TimeUtil.countToString(this.saveAttempts)
                });
                $.showMessage(e, "super-slow"), setTimeout($.proxy(this._savePenToDB, this), this.SAVE_ATTEMPT_TIMEOUT)
            } else this.saveAttempts = 0, $.showMessage(Copy.errors["unable-to-save-ever"], "super-slow")
        },
        isUserPenOwner: function() {
            return CP.profiled.is_team ? CP.profiled.id === CP.user.current_team_id : CP.profiled.id === CP.user.id
        },
        _isPenOwnedByAnotherUser: function() {
            return !this.isUserPenOwner()
        },
        _isPenConsideredEmpty: function() {
            return "" === this.html && "" === this.css && "" === this.js
        },
        hasPenChanged: function() {
            return _.size(this._getDiffPen(this, this.lastSavedPen)) > 0
        },
        _getDiffPen: function(e, t) {
            return _diffObjects(t, e)
        },
        _getSaveableCopyOfPen: function() {
            return _.reduce(this._getDataRelevantAttributes(), function(e, t) {
                return e[t] = _.cloneDeep(this[t]), e
            }, {}, this)
        },
        _getDataRelevantAttributes: function() {
            return ["id", "user_id", "team_id", "slug_hash", "slug_hash_private", "title", "description", "tags", "newTags", "resources", "editor_settings", "fork", "private", "parent", "template", "html", "html_pre_processor", "html_classes", "head", "css", "css_pre_processor", "css_prefix", "css_starter", "js", "js_pre_processor"]
        },
        getAttributesThatAffectPenPreview: function() {
            return ["html", "css", "js", "html_pre_processor", "html_classes", "head", "css_pre_processor", "css_prefix", "css_starter", "js_pre_processor", "resources"]
        }
    }),
    PenAutosave = Class.extend({
        autoSaveFunc: null,
        AUTOSAVE_TIMER: 2e4,
        _showedUserAutoSaveOnMessage: !1,
        _hasUserEverSaved: !1,
        _mobile: !1,
        liveChangesWOSave: 0,
        saveButton: $("#save, #update"),
        init: function() {
            this._mobile = window.__mobile, this.autoSaveFunc = _.debounce(this._saveViaAutoSave, this.AUTOSAVE_TIMER), this._bindToHub(), this._startAutoSave()
        },
        _bindToHub: function() {
            Hub.sub("live_change", $.proxy(this._onLiveChange, this)), Hub.sub("pen-saved", $.proxy(this._onSaved, this))
        },
        _startAutoSave: function() {
            this._penCanBeAutosaved() && this._conditionallyShowAutosavingNowMessage()
        },
        _onLiveChange: function() {
            this._penCanBeAutosaved() ? this._handleAutoSave() : this._handleNonAutoSave()
        },
        _handleAutoSave: function() {
            this.autoSaveFunc()
        },
        _saveViaAutoSave: function() {
            this._autoSavePenRightNow() && (CP.pen.autosavingNow = !0, CP.pen.save())
        },
        _autoSavePenRightNow: function() {
            return !CP.settingsController.settingsPaneVisible()
        },
        _handleNonAutoSave: function() {
            return !CP.pen.isUserPenOwner() || CP.pen.save_disabled ? !1 : (this.liveChangesWOSave += 1, this.saveButton.removeClass("unsaved-wobble unsaved-grow"), 6 === this.liveChangesWOSave && this.saveButton.addClass("unsaved-wobble"), 11 === this.liveChangesWOSave && this.saveButton.addClass("unsaved-grow"), 16 === this.liveChangesWOSave && $.showMessage("There have been 15 changes without a save. Remember to save your work!", "slow"), void(21 === this.liveChangesWOSave && this.saveButton.addClass("unsaved-wobble")))
        },
        _onSaved: function() {
            this._hasUserEverSaved = !0, this._showPenSavedMessage(), this._conditionallyShowAutosavingNowMessage()
        },
        _showPenSavedMessage: function() {
            CP.pen.autosavingNow || $.showMessage(Copy.penUpdated), CP.pen.autosavingNow = !1
        },
        _conditionallyShowAutosavingNowMessage: function() {
            this._showedUserAutoSaveOnMessage || this._penCanBeAutosaved() && this._showAutoSaveOnMessage()
        },
        _showAutoSaveOnMessage: function() {
            this._showedUserAutoSaveOnMessage = !0, setTimeout(function() {
                $.showMessage(Copy.autoSavingNow, "slow")
            }, 1500)
        },
        _penCanBeAutosaved: function() {
            return this._userInitiatedSavePreviously() ? CP.user.isUserLoggedIn() && CP.pen.editor_settings.auto_save && CP.pen.getActiveSlugHash().length > 0 && !this._mobile : !1
        },
        _userInitiatedSavePreviously: function() {
            return this._referredFromNewPen() || this._hasUserEverSaved
        },
        _referredFromNewPen: function() {
            return document.referrer.match(/\/pen(\/)?$/) ? !0 : !1
        }
    }),
    PenDelete = Class.extend({
        init: function() {
            _.extend(this, AJAXUtil), this._bindToDOM()
        },
        _bindToDOM: function() {
            $(".delete-button")._on("click", this._deletePen, this)
        },
        _deletePen: function() {
            $.showModal("/ajax/confirm_pen_delete", "modal-warning", $.proxy(this._deletePenModalCallback, this))
        },
        _deletePenModalCallback: function() {
            $("#confirm-delete")._on("click", this._confirmDeletePen, this)
        },
        _confirmDeletePen: function() {
            this.del("/pen/" + CP.pen.slug_hash, {}, this._doneDelete), $.showMessage(Copy.deletingPen, "super-slow")
        },
        _doneDelete: function() {
            window.location = this._getURLToReturnTo()
        },
        _getURLToReturnTo: function() {
            return CP.profiled.base_url + "/pens/" + this._getProfilePageToReturnTo() + "/"
        },
        _getProfilePageToReturnTo: function() {
            var e = "public",
                t = document.referrer.match(/(?:\/([^\/]+)\/?)$/);
            if (t) {
                var n = t[1];
                _.contains(this._possibleProfilePagesToReturnTo(), n) && (e = n)
            }
            return e
        },
        _possibleProfilePagesToReturnTo: function() {
            return ["popular", "public", "private", "forked", "tags"]
        }
    }),
    PenResourcesData = {
        MIN_RESOURCES: 2,
        setResource: function(e, t) {
            this._setResourceURL(_.find(this.resources, {
                view_id: e
            }), t), this._postResourceChange()
        },
        updateResourcesOrder: function(e, t) {
            this._updateResourcesOrder(e, t), this._postResourceChange()
        },
        addEmptyResource: function(e) {
            this._addNewResource(e, ""), this._postResourceChange()
        },
        quickAddResource: function(e, t) {
            this._quickAddResource(e, t), this._postResourceChange()
        },
        deleteResource: function(e) {
            this._deleteResource(e), this._postResourceChange()
        },
        getResourcesByType: function(e) {
            return _.select(this.resources, {
                resource_type: e
            })
        },
        setPenResources: function(e) {
            this.resources = e.pen.resources, this._postResourceChange()
        },
        _ensureResourcesValid: function() {
            this._ensureMinNumberOfResourcesForEachType(), this._ensureResourcesOrdersCorrect(), this._ensureResourcesHaveViewIDs(), this._ensureResourcesHaveActions()
        },
        _ensureMinNumberOfResourcesForEachType: function() {
            this._ensureMinNumberOfResourcesForType("css"), this._ensureMinNumberOfResourcesForType("js")
        },
        _ensureMinNumberOfResourcesForType: function(e) {
            _.times(this.MIN_RESOURCES - this.getResourcesByType(e).length, function() {
                this.resources.push({
                    resource_type: e,
                    order: 0,
                    url: ""
                })
            }, this)
        },
        _ensureResourcesOrdersCorrect: function() {
            var e = {};
            _.forEach(this.resources, function(t) {
                t.order = e[t.resource_type] || 0, e[t.resource_type] = t.order + 1
            }), this._storeResourcesByOrder()
        },
        _ensureResourcesHaveViewIDs: function() {
            _.forEach(this.resources, function(e) {
                _.isUndefined(e.view_id) && (e.view_id = IDGenerator.generate())
            })
        },
        _ensureResourcesHaveActions: function() {
            _.forEach(this.resources, function(e) {
                _.isUndefined(e.action) && (e.action = "include_" + e.resource_type + "_url")
            })
        },
        _postResourceChange: function() {
            this._updateLastUpdated(), this._ensureResourcesValid(), this._publishResourcePenChange()
        },
        _quickAddResource: function(e, t) {
            var n = _.find(this.getResourcesByType(e), {
                url: ""
            });
            n ? this._setResourceURL(n, t) : this._addNewResource(e, t)
        },
        _setResourceURL: function(e, t) {
            e.url = t
        },
        _updateResourcesOrder: function(e, t) {
            for (var n = 0, s = this.resources.length; s > n; n++) this.resources[n].resource_type === e && (this.resources[n].order = t[this.resources[n].view_id]);
            this._storeResourcesByOrder()
        },
        _storeResourcesByOrder: function() {
            this.resources = _.sortBy(this.resources, "order")
        },
        _addNewResource: function(e, t, n) {
            this.resources.push({
                resource_type: e,
                order: n || 0,
                url: t || "",
                view_id: IDGenerator.generate(),
                action: "include_" + e + "_url"
            })
        },
        _deleteResource: function(e) {
            _removeFromArrayByIndex(this.resources, _.findIndex(this.resources, {
                view_id: e
            }))
        },
        _publishResourcePenChange: function() {
            Hub.pub("pen-change", {
                origin: "client",
                pen: {
                    resources: _.clone(this.resources)
                }
            })
        }
    },
    PenSaver = Class.extend({
        init: function() {
            this.pageType = __pageType, this._warnAboutLostChanges()
        },
        _warnAboutLostChanges: function() {
            window.onbeforeunload = $.proxy(function() {
                return this._shouldWarnAboutLostWork() ? Copy.youHaveUnsavedChanges : void 0
            }, this)
        },
        _shouldWarnAboutLostWork: function() {
            var e = CP.pen.hasPenChanged();
            return "professor" === this.pageType ? e && this._isProfessorInProfessorRoom() : "collab" === this.pageType ? e && this._isPenOwnerInCollabRoom() : e && !CP.pen.redirectingToSavedURL && !CP.pen.save_disabled
        },
        _isProfessorInProfessorRoom: function() {
            var e = !1;
            return "professor" === this.pageType && "undefined" != typeof CP.professor && (e = !0), e
        },
        _isPenOwnerInCollabRoom: function() {
            return "collab" === this.pageType ? CP.pen.isUserPenOwner() : !1
        }
    }),
    LocalDataValidator = {
        makeObjValid: function(e, t) {
            for (var n in e) t[n] && (e[n] = this._getValidAttributeValue(t, n, e[n]))
        },
        _getValidAttributeValue: function(e, t, n) {
            var s = e[t];
            return "array" === s["typeof"] ? this._getValidArrayType(n, s) : _.isArray(s["typeof"]) ? this._getValidArrayAttributeValue(n, s) : this._getValidSimpleAttributeValue(n, s)
        },
        _getValidArrayType: function(e, t) {
            return _.isArray(e) ? e : t["default"]
        },
        _getValidArrayAttributeValue: function(e, t) {
            return _.contains(t["typeof"], e) ? e : t["default"]
        },
        _getValidSimpleAttributeValue: function(e, t) {
            return typeof e === t["typeof"] ? e : t["default"]
        }
    },
    PenValidator = Class.extend({
        dataAttributes: {
            title: {
                "typeof": "string",
                "default": ""
            },
            description: {
                "typeof": "string",
                "default": ""
            },
            slug_hash: {
                "typeof": "string",
                "default": ""
            },
            html: {
                "typeof": "string",
                "default": ""
            },
            css: {
                "typeof": "string",
                "default": ""
            },
            js: {
                "typeof": "string",
                "default": ""
            },
            parent: {
                "typeof": "number",
                "default": 0
            },
            "private": {
                "typeof": "boolean",
                "default": !1
            },
            template: {
                "typeof": "boolean",
                "default": !1
            },
            html_pre_processor: {
                "typeof": __preprocessors.html.syntaxes,
                "default": __preprocessors.html.default
            },
            html_classes: {
                "typeof": "string",
                "default": ""
            },
            head: {
                "typeof": "string",
                "default": ""
            },
            css_pre_processor: {
                "typeof": __preprocessors.css.syntaxes,
                "default": __preprocessors.css.default
            },
            css_prefix: {
                "typeof": __preprocessors.css.prefixes,
                "default": __preprocessors.css.default_prefix
            },
            css_starter: {
                "typeof": __preprocessors.css.bases,
                "default": __preprocessors.css.default_base
            },
            styles: {
                "typeof": "array",
                "default": []
            },
            js_pre_processor: {
                "typeof": __preprocessors.js.syntaxes,
                "default": __preprocessors.js.default
            },
            scripts: {
                "typeof": "array",
                "default": []
            }
        },
        makePenValid: function(e) {
            LocalDataValidator.makeObjValid(e, this.dataAttributes)
        }
    }),
    Profiled = Class.extend({
        init: function() {
            _.extend(this, __profiled)
        },
        isUserProfiled: function(e) {
            return this.is_team ? !1 : e.username === this.username
        }
    }),
    UI = {
        buildDefaultUIData: function() {
            return {
                info: "closed",
                layout: window.__layoutType || "top",
                editorViewSource: {
                    html: !1,
                    css: !1,
                    js: !1
                },
                scrollTopLine: {
                    html: {},
                    css: {},
                    js: {}
                },
                textSelection: {
                    html: {
                        start: {
                            line: 0,
                            ch: 0,
                            xRel: 0
                        },
                        end: {
                            line: 0,
                            ch: 0,
                            xRel: 0
                        }
                    },
                    css: {
                        start: {
                            line: 0,
                            ch: 0,
                            xRel: 0
                        },
                        end: {
                            line: 0,
                            ch: 0,
                            xRel: 0
                        }
                    },
                    js: {
                        start: {
                            line: 0,
                            ch: 0,
                            xRel: 0
                        },
                        end: {
                            line: 0,
                            ch: 0,
                            xRel: 0
                        }
                    }
                },
                editorSizes: {
                    html: 1 / 3,
                    css: 1 / 3,
                    js: 1 / 3,
                    console: "closed"
                },
                settings: {
                    pane: "closed",
                    tab: "html",
                    css: {
                        addons: "closed"
                    }
                }
            }
        }
    },
    User = Class.extend({
        init: function() {
            _.extend(this, __user)
        },
        isUserLoggedIn: function() {
            return +this.id > 1
        },
        saveAccomplishment: function(e) {
            AJAXUtil.post("/accomplishments", {
                name: e
            })
        }
    });
! function() {
    function e() {
        "vim" === CP.pen.editor_settings.key_bindings && (CodeMirror.commands.save = function() {
            CP.pen.save()
        })
    }

    function t() {
        u.on("click", n), h.on("click", i)
    }

    function n() {
        d ? i() : s()
    }

    function s() {
        !d && l.length && (l.show(), CP.showPopupOverlay(), d = !0, Hub.pub("popup-open", p))
    }

    function i() {
        d && l.length && (l.hide(), CP.hidePopupOverlay(), d = !1)
    }

    function o() {
        Hub.sub("key", r), Hub.sub("popup-open", a)
    }

    function r(e, t) {
        "esc" === t.key && i()
    }

    function a(e, t) {
        t !== p && i()
    }

    function c() {
        Keytrap.bind("comctrl+e", function() {
            $("#new-comment").focus()
        }, !0), Keytrap.bind("comctrl+s", function() {
            ("collab" !== window.__pageType && "professor" != window.__pageType || CP.pen.isUserPenOwner()) && CP.pen.save()
        }, !0), Keytrap.bind("comctrl+shift+s", function() {
            CP.pen.saveAsPrivate()
        }, !0), Keytrap.bind("comctrl+p", function() {
            CP.pen.newPen()
        }, !0), Keytrap.bind("comctrl+shift+5", function() {
            CP.penRenderer.processAndRender(!0)
        }, !0), Keytrap.bind("comctrl+shift+0", function() {
            if (CP.pen.slug_hash) {
                var e = document.location.href.replace("/pen/", "/full/");
                window.open(e)
            }
        }, !0), Keytrap.bind("comctrl+shift+9", $.proxy(function() {
            n()
        }, this), !0), Keytrap.bind("comctrl+i", function() {
            CP.settingsController.toggleSettingsPane()
        }, !0), Keytrap.bind("comctrl+shift+.", function() {
            CP.htmlEditor.hasFocus() && CP.htmlEditor.editor.execCommand("closeTag")
        }, !0)
    }
    CP.keyBindings = {}, CP.keyBindings.init = function() {
        e(), t(), o(), c()
    };
    var l = $("#keycommands"),
        u = $(".keyboard-commands-button"),
        h = $("#popup-overlay"),
        d = !1,
        p = "keyCommands"
}();
var __snippet_html = {
        mode: "html",
        type: "html",
        snippets: {
            lorem: "<p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.</p>",
            nav: '<nav role=\'navigation\'>\n  <ul>\n    <li><a href="#">Home</a></li>\n    <li><a href="#">About</a></li>\n    <li><a href="#">Clients</a></li>\n    <li><a href="#">Contact Us</a></li>\n  </ul>\n</nav>',
            ul: "<ul>\n  <li>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</li>\n  <li>Aliquam tincidunt mauris eu risus.</li>\n  <li>Vestibulum auctor dapibus neque.</li>\n</ul>",
            ol: "<ol>\n  <li>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</li>\n  <li>Aliquam tincidunt mauris eu risus.</li>\n  <li>Vestibulum auctor dapibus neque.</li>\n</ol>",
            form: '<form action="#">\n  <div>\n    <label for="name">Text Input:</label>\n    <input type="text" name="name" id="name" placeholder="John Smith" />\n  </div>\n\n  <fieldset>\n    <legend>Radio Button Choice</legend>\n\n    <label for="radio-choice-1">Choice 1</label>\n    <input type="radio" name="radio-choice" id="radio-choice-1" value="choice-1" />\n\n    <label for="radio-choice-2">Choice 2</label>\n    <input type="radio" name="radio-choice" id="radio-choice-2" value="choice-2" />\n  </fieldset>\n\n  <div>\n    <label for="select-choice">Select Dropdown Choice:</label>\n    <select name="select-choice" id="select-choice">\n      <option value="Choice 1">Choice 1</option>\n      <option value="Choice 2">Choice 2</option>\n      <option value="Choice 3">Choice 3</option>\n    </select>\n  </div>\n\n  <div>\n    <label for="textarea">Textarea:</label>\n    <textarea cols="40" rows="8" name="textarea" id="textarea"></textarea>\n  </div>\n\n  <div>\n    <label for="checkbox">Checkbox:</label>\n    <input type="checkbox" name="checkbox" id="checkbox" />\n  </div>\n\n  <div>\n    <input type="submit" value="Submit" />\n  </div>\n</form>',
            select: "<select name='options'>\n  <option value='option-1'>Option 1</option>\n  <option value='option-2'>Option 2</option>\n  <option value='option-3'>Option 3</option>\n</select>"
        }
    },
    __snippet_css = {
        mode: "css",
        type: "css",
        snippets: {
            phark: ".element {\n  text-indent: -9999px;\n  display: block;\n  width: px;\n  height: px;\n  background: url() no-repeat;\n}\n",
            "box-sizing-ftw": "html {\n  box-sizing: border-box;\n}\n*,*:before,*:after {\n  box-sizing: inherit;\n}"
        }
    },
    __snippet_js = {
        mode: "js",
        type: "js",
        snippets: {
            "for": "for (var i = 0; i < Things.length; i++) {\n  Things[i];\n}"
        }
    },
    TabSnippets = {
        snippets: {
            html: {},
            css: {},
            js: {}
        },
        loadSnippet: function(e) {
            var t = this.getPreProcessorType(e);
            if ("undefined" == typeof this.snippets[e][t] && t) {
                var n = "/assets/editor/other/snippets/" + t + ".js";
                _getCachedScript(n, function() {
                    TabSnippets.snippets[e][t] = window["__snippet_" + t].snippets
                })
            }
        },
        findSnippet: function(e) {
            var t = this.getMode(e),
                n = this.getPreProcessorType(t),
                s = e.getCursor(),
                i = e.getLine(s.line),
                o = $.trim(i.substring(0, s.ch));
            if ("undefined" != typeof this.snippets[t][n])
                for (var r in this.snippets[t][n])
                    if ($.trim(o) === r) return this.snippets[t][n][r];
            return !1
        },
        getMode: function(e) {
            return TypesUtil.cmModeToType(e.getOption("mode"))
        },
        getPreProcessorType: function(e) {
            var t = CP.pen[e + "_pre_processor"];
            return "none" === t ? e : t
        }
    },
    PenActions = Class.extend({
        init: function() {
            this._bindToDOM()
        },
        _bindToDOM: function() {
            $("#save, #update,#save-details")._on("click", this._savePen, this), $("#pen-details-form")._on("submit", this._savePen, this), $("#save-as-private")._on("click", this._savePenAsPrivate, this), $("#fork")._on("click", this._fork, this), $("#run")._on("click", this._runPen, this)
        },
        _savePen: function() {
            CP.pen.save()
        },
        _savePenAsPrivate: function() {
            CP.pen.saveAsPrivate()
        },
        _fork: function() {
            CP.pen.forkPenInCurrentState()
        },
        _runPen: function() {
            CP.penRenderer.processAndRender(!0)
        }
    }),
    ClientSidePenValidations = {
        validatePen: function(e) {
            var t = {};
            return this._validateHTML(e, t), this.validateCSS(e, t), t
        },
        _validateHTML: function(e, t) {
            var n = /^(\s+)?<!doctype/i;
            n.test(e.html) && (t.html = {
                line: 1,
                type: "html",
                message: "You don't need a DOCTYPE on CodePen. Just put here what you would normally put in the <body>.",
                level: "warn",
                pretty_name: "HTML"
            })
        },
        validateCSS: function(e, t) {
            if (_.contains(["scss", "sass"], e.css_pre_processor)) {
                var n = /inline-image/i;
                n.test(e.css) && (t.css = {
                    line: this._findErrorLineNumber(e.css, n),
                    type: "css",
                    message: "The function inline-image can not be used on CodePen since it depends on reading images from disk. We've removed it.",
                    level: "warn",
                    pretty_name: "SCSS"
                });
                var s = /image-width\(/i;
                s.test(e.css) && (t.css = {
                    line: this._findErrorLineNumber(e.css, s),
                    type: "css",
                    message: 'The function image-width can not be used on CodePen since it depends on reading images from disk. We"ve removed it.',
                    level: "warn",
                    pretty_name: "SCSS"
                });
                var i = /image-height\(/i;
                i.test(e.css) && (t.css = {
                    line: this._findErrorLineNumber(e.css, i),
                    type: "css",
                    message: 'The function image-height can not be used on CodePen since it depends on reading images from disk. We"ve removed it.',
                    level: "warn",
                    pretty_name: "SCSS"
                })
            }
            if ("less" === e.css_pre_processor) {
                var o = /data-uri/i;
                o.test(e.css) && (t.css = {
                    line: this._findErrorLineNumber(e.css, o),
                    type: "css",
                    message: 'The function data-uri can not be used because it"s insecure. We"ve removed it from your LESS code.',
                    level: "warn",
                    pretty_name: "LESS"
                })
            }
            return t
        },
        _findErrorLineNumber: function(e, t) {
            for (var n = e.split("\n"), s = 0, i = n.length; i > s; s++)
                if (t.test(n[s])) return s + 1;
            return 1
        }
    },
    HTMLTemplating = {
        findHTMLTemplatesInPenHTML: function(e) {
            var t = (e || "").match(/(\[\[\[\S+\]\]\])/gm);
            return t || []
        },
        regexReplaceHTMLBeforeProcessing: function(e, t) {
            return this._regexReplaceHTML(e, "regex_replace_before_processing", t)
        },
        regexReplaceHTMLAfterProcessing: function(e, t) {
            return this._regexReplaceHTML(e, "regex_replace", t)
        },
        _regexReplaceHTML: function(e, t, n) {
            for (var s = 0; s < n.length; s++)
                if (n[s].action === t) {
                    var i = n[s].text_to_replace;
                    i = i.replace(/\//g, "\\/"), i = i.replace(/\[/g, "\\["), i = i.replace(/\]/g, "\\]");
                    var o = new RegExp(i, "g");
                    e = e.replace(o, n[s].content)
                }
            return e
        }
    },
    Instrument = {
        _loopPrependAST: null,
        _exitedAppendAST: null,
        instrumentCode: function(e, t) {
            try {
                if (this._shouldInstrumentJS(e)) {
                    var n = {
                            id: 0
                        },
                        s = {
                            tolerant: !0
                        },
                        i = esprima.parse(e.getProcessed("js"), s),
                        o = this._insertStopExecutionOnTimeoutCallsToAST(i, n);
                    return escodegen.generate(o)
                }
                return e.getProcessed("js")
            } catch (r) {
                return t.js = {
                    line: r.lineNumber || 1,
                    column: r.column || 1,
                    index: r.index || 1,
                    type: "js",
                    message: r.description || r.message,
                    level: "error",
                    pretty_name: "JavaScript"
                }, e.getProcessed("js")
            }
        },
        _shouldInstrumentJS: function(e) {
            return e.getProcessed("js") ? !this._hasJSWeCannotInstrument(e) : !1
        },
        _usingJSPreprocessor: function() {
            return _.contains(__preprocessors.js.preprocessors, CP.pen.js_pre_processor)
        },
        _hasJSWeCannotInstrument: function(e) {
            return new RegExp(this._getInstrumentJSRegex(), "i").exec(e.getProcessed("js"))
        },
        _getInstrumentJSRegex: function() {
            return "(" + window.__preprocessors.js.words_we_cannot_instrument.join("|") + ")"
        },
        _insertStopExecutionOnTimeoutCallsToAST: function(e, t) {
            var n, s;
            if (null === e) return !1;
            for (var i in e)
                if ("object" == typeof e[i])
                    if (_.isArray(e[i]))
                        for (n = 0, s = e[i].length; s > n; n++) e[i][n] && (this._insertStopExecutionOnTimeoutCallsToAST(e[i][n], t), this._isLoopType(e[i][n].type) && this._appendExitedLoop(e, t, n));
                    else this._insertStopExecutionOnTimeoutCallsToAST(e[i], t), e[i] && this._isLoopType(e[i].type) && this._appendExitedLoop(e, t, 0);
            if (this._hasLoopToInstrument(e) && ("BlockStatement" === e.body.type && this._prependStopExecutionTimeoutToBlockStatement(e, t), "ExpressionStatement" === e.body.type)) {
                var o = this._clone(e.body);
                e.body = {
                    type: "BlockStatement",
                    body: [o]
                }, this._prependStopExecutionTimeoutToBlockStatement(e, t)
            }
            return e
        },
        _hasLoopToInstrument: function(e) {
            return this._isLoopType(e.type) && e.body ? !0 : !1
        },
        _prependStopExecutionTimeoutToBlockStatement: function(e, t) {
            if (e.body && e.body.body) {
                var n = this._clone(this._getLoopPrependAST());
                this._updateArgumentsWithLoopID(e, n, t), e.body.body.unshift(n)
            }
        },
        _updateArgumentsWithLoopID: function(e, t, n) {
            n.id += 1, this._isLoopType(e.type) ? t.test.arguments = [{
                type: "Literal",
                value: n.id,
                raw: n.id
            }] : t.expression.arguments = [{
                type: "Literal",
                value: n.id,
                raw: n.id
            }]
        },
        _appendExitedLoop: function(e, t, n) {
            if (_.isArray(e.body)) {
                var s = this._clone(this._getExitedAppendAST());
                s.expression.arguments = [{
                    type: "Literal",
                    value: t.id,
                    raw: t.id
                }], 0 === n ? e.body.push(s) : e.body.splice(n + 1, 0, s)
            }
        },
        _isLoopType: function(e) {
            var t = ["WhileStatement", "DoWhileStatement", "ForStatement", "ForInStatement", "ForOfStatement"];
            return t.indexOf(e) > -1
        },
        _clone: function(e) {
            return JSON.parse(JSON.stringify(e))
        },
        _getLoopPrependAST: function() {
            if (!this._loopPrependAST) {
                var e = "while (true) { if (window.CP.shouldStopExecution(1)) { break; }}",
                    t = esprima.parse(e);
                this._loopPrependAST = t.body[0].body.body[0]
            }
            return this._loopPrependAST
        },
        _getExitedAppendAST: function() {
            if (!this._exitedAppendAST) {
                var e = "window.CP.exitedLoop(1);",
                    t = esprima.parse(e);
                this._exitedAppendAST = t.body[0]
            }
            return this._exitedAppendAST
        }
    },
    PenErrorHandler = Class.extend({
        editorErrorData: {},
        init: function() {
            this.initEditorErrorData(), this.bindToElements(), this._bindToHub()
        },
        initEditorErrorData: function() {
            _.each(["html", "css", "js"], function(e) {
                this.editorErrorData[e] = {
                    preprocErrors: [],
                    preprocErrorLineNums: []
                }
            }, this)
        },
        bindToElements: function() {
            $(".error-icon").on("click", $.proxy(this.toggleSingleInlineError, this))
        },
        _bindToHub: function() {
            Hub.sub("error-in-code", $.proxy(this._onErrorInCode, this))
        },
        toggleSingleInlineError: function(e) {
            var t = $(e.target).closest("div.box").data("type");
            $("#box-" + t + " .inline-editor-error").removeClass("inline-error-hidden"), t = $(e.target).data("type"), this.jumpToFirstError(t), this.hideErrorBar(t), Hub.pub("editor-refresh", {
                delay: 0
            })
        },
        _onErrorInCode: function(e, t) {
            this.handleErrorsInEditor(t)
        },
        canRenderPen: function(e) {
            return !_.find(e, {
                level: "error"
            })
        },
        previousShowErrorsInEditorTimeoutID: 0,
        handleErrorsInEditor: function(e) {
            this.clearPreviousCallToEditorErrors(), this.clearPreprocWidgets("all"), _.size(e) && this.showErrorsInEditor(e)
        },
        clearPreviousCallToEditorErrors: function() {
            clearTimeout(this.previousShowErrorsInEditorTimeoutID)
        },
        clearPreprocWidgets: function(e) {
            "all" === e ? _.each(["html", "css", "js"], function(e) {
                this.clearPreprocWidgetsOfType(e)
            }, this) : this.clearPreprocWidgetsOfType(e), this.hideErrorBar()
        },
        clearPreprocWidgetsOfType: function(e) {
            for (var t = CodeEditorsUtil.getEditorByType(e), n = this.editorErrorData[e].preprocErrors, s = this.editorErrorData[e].preprocErrorLineNums, i = 0, o = n.length; o > i; i++) {
                n[i].clear();
                var r = s[i] - 1;
                t.editor.removeLineClass(r, "background", "line-highlight")
            }
            this.editorErrorData[e].preprocErrors = [], this.editorErrorData[e].preprocErrorLineNums = []
        },
        showErrorsInEditor: function(e) {
            this.previousShowErrorsInEditorTimeoutID = setTimeout($.proxy(function() {
                this.showPreprocessorErrors(e)
            }, this), this.inlineErrorTimeout)
        },
        showPreprocessorErrors: function(e) {
            for (var t in e) {
                var n = e[t];
                if (!_.isUndefined(n.line) && !_.isUndefined(n.message)) {
                    var s = CodeEditorsUtil.getEditorByType(n.type),
                        i = this.addInlineEditorWidget(s.editor, n.line, n.message);
                    this.editorErrorData[n.type].preprocErrors.push(i), this.editorErrorData[n.type].preprocErrorLineNums.push(n.line), this.showErrorBar(n.type)
                }
            }
        },
        addInlineEditorWidget: function(e, t, n) {
            var s = $(this._getInlineErrorWidgetHTML(n))[0],
                i = parseInt(t - 1, 10);
            return e.addLineClass(i, "background", "line-highlight"), e.addLineWidget(i, s, {
                coverGutter: !0,
                noHScroll: !0
            })
        },
        _getInlineErrorWidgetHTML: function(e) {
            var t = "<div class='inline-editor-error inline-error-hidden'><div class='inline-error-message'><%= message %></div></div>";
            return _.template(t, {
                message: this._makeMessageSafe(e)
            })
        },
        _makeMessageSafe: function(e) {
            return _htmlEntities(e).replace(/&lt;br \/&gt;/g, "<br />").replace(/-&gt;/g, "->")
        },
        jumpToFirstError: function(e) {
            var t = this.editorErrorData[e].preprocErrorLineNums,
                n = this.getErrorLineNumberToScrollTo(t[0]);
            CodeEditorsUtil.getEditorByType(e).editor.scrollIntoView(n)
        },
        getErrorLineNumberToScrollTo: function(e) {
            return e - 2 > 0 ? e - 2 : 0
        },
        showErrorBar: function(e) {
            $("#error-bar-" + e).show()
        },
        hideErrorBar: function(e) {
            e ? $("#error-bar-" + e).hide() : $(".error-bar").hide()
        },
        editorHasErrors: function(e) {
            return this.editorErrorData[e].preprocErrors.length
        }
    }),
    PenProcessor = Class.extend({
        errors: {},
        processedPen: null,
        init: function() {
            _.extend(this, AJAXUtil)
        },
        process: function(e, t) {
            async.waterfall([function(e) {
                e(null, {
                    processedPen: new ProcessedPen(t)
                })
            }, $.proxy(this._processResources, this), $.proxy(this._processPen, this), $.proxy(this._handleProcessingErrors, this), $.proxy(this._instrumentCode, this), $.proxy(this._cacheResult, this)], function(t, n) {
                e(n)
            })
        },
        _processResources: function(e, t) {
            CP.penResources.processResourcesAndCallback(CP.pen, function(n) {
                e.processedPen.setProcessedValue("resources", n), t(null, e)
            })
        },
        _processPen: function(e, t) {
            e.processingErrors = {};
            var n = e.processedPen.buildPenToSendToPreprocessors();
            this._penNeedsProcessing(n) ? this.post("/preprocessors", n, function(s) {
                this._updatePenToProcessAfterProcessing(s, n), this._setProcessedValues(e, n), e.processingErrors = s.errors, t(null, e)
            }) : (this._setProcessedValues(e, n), t(null, e))
        },
        _updatePenToProcessAfterProcessing: function(e, t) {
            0 === _.size(e.errors) && (e.results.html && (t.html = e.results.html), e.results.css && (t.css = e.results.css), e.results.js && (t.js = e.results.js))
        },
        _setProcessedValues: function(e, t) {
            _.forEach(["html", "css", "js"], function(n) {
                e.processedPen.setProcessedValue(n, t[n])
            })
        },
        _penNeedsProcessing: function(e) {
            return this._htmlNeedsToBeProcessed(e) || this._cssNeedsToBeProcessed(e) || this._jsNeedsToBeProcessed(e)
        },
        _htmlNeedsToBeProcessed: function(e) {
            return "" === $.trim(e.html) ? !1 : _.contains(__preprocessors.html.preprocessors, e.html_pre_processor)
        },
        _cssNeedsToBeProcessed: function(e) {
            return "" === $.trim(e.css) ? !1 : "autoprefixer" === e.css_prefix ? !0 : _.contains(__preprocessors.css.preprocessors, e.css_pre_processor)
        },
        _jsNeedsToBeProcessed: function(e) {
            return "" === $.trim(e.js) ? !1 : _.contains(__preprocessors.js.preprocessors, e.js_pre_processor)
        },
        _handleProcessingErrors: function(e, t) {
            e.errors = _.assign(e.processingErrors, ClientSidePenValidations.validatePen(CP.pen)), t(null, e)
        },
        _instrumentCode: function(e, t) {
            e.processedPen.setProcessedValue("js", Instrument.instrumentCode(e.processedPen, e.errors)), t(null, e)
        },
        _cacheResult: function(e, t) {
            this.processedPen = e.processedPen, t(null, e)
        },
        getProcessed: function(e) {
            return this.processedPen.getProcessed(e)
        }
    }),
    BunkerBox = {
        makeHeadSafe: function(e, t) {
            return e = e || "", t = this._getSafeSandboxType(t), "public" === t && (e = e.replace(/<script.+/gim, "")), e = this.makeHTMLSafe(e, t)
        },
        makeHTMLSafe: function(e, t) {
            return e = e || "", t = this._getSafeSandboxType(t), e = e.replace(/(<.*?\s)(autofocus=("|')autofocus("|')|autofocus)/g, "$1"), e = e.replace(/iframe.+src=.+(&#)/gim, ""), e = e.replace(/autoPlay=true/gim, "autoPlay=false"), e = e.replace(/http-equiv="refresh"/gim, ""), "public" === t && (e = this._makeHTMLSafeForPublic(e)), e = this.makeJSSafe(e, t)
        },
        _makeHTMLSafeForPublic: function(e) {
            var t = e.replace(/(\s+)(action=)("|")([\S]+)("|")/gim, "$1$2$3#$5");
            return t
        },
        makeJSSafe: function(e, t) {
            return e = e || "", t = this._getSafeSandboxType(t), e = e.replace(/location\.replace/gim, ""), e = e.replace(/location\.reload/gim, ""), "public" === t && (e = e.replace("beforeunloadreplacedbycodepen"), e = e.replace(/debugger(\s+)?;/gim, ""), e = e.replace(/alert/gim, ""), e = e.replace(/geolocation/gim, ""), e = e.replace(/audiocontext/gim, ""), e = e.replace(/getusermedia/gim, "")), this._isSandboxSupported() || (e = e.replace(/window(\s+)?\[(\s+)?("|")l/gim, ""), e = e.replace(/self(\s+)?\[(\s+)?("|")loc/gim, ""), e = e.replace(/\.submit\(\)/gim, ""), e = e.replace(/fromCharCode/gim, ""), e = e.replace(/\blocation(\s+)?=/gim, "")), e
        },
        _getSafeSandboxType: function(e) {
            return "undefined" == typeof e ? "public" : "public" === e ? "public" : "personal"
        },
        _sandboxSupported: null,
        _isSandboxSupported: function() {
            return null === this._sandboxSupported && (this._sandboxSupported = this._determineIfSanboxIsSupported()), this._sandboxSupported
        },
        _determineIfSanboxIsSupported: function() {
            try {
                return "sandbox" in document.createElement("iframe")
            } catch (e) {
                return !1
            }
        }
    },
    URLUtil = {
        httpsURL: function(e) {
            return this._buildURL("https:", e)
        },
        protocolessURL: function(e) {
            return this._buildURL("", e)
        },
        _buildURL: function(e, t) {
            return e + "//" + document.location.host + t
        }
    },
    IFramePenToHTML = {
        renderPenAsHTML: function(e) {
            var t = [];
            return t.push(this._getHTMLStart(e)), t.push(this._getHeadAndCSS(e)), t.push(this._getHTML(e)), t.push(this._getJS(e)), t.push(this._getCSSLiveReloadJS()), t.push(this._getHTMLEnd()), t.join("\n")
        },
        _getHTMLStart: function(e) {
            return "<!DOCTYPE html><html class='" + e.html_classes + "'>"
        },
        _getHTMLEnd: function() {
            return "</body></html>"
        },
        _getHeadAndCSS: function(e) {
            var t = "";
            return t += "<head>", t += "<script src='" + __path_to_console_runner_js + "'></script>", t += "<meta charset='UTF-8'>", t += '<meta name="robots" content="noindex">', t += '<link rel="canonical" href="' + document.location.href + '" />', t += "\n" + e.head + "\n", t += this._getCSSStarterStyles(e), t += this._getPrefixesStyles(e), t += this._getStylesToAddToHead(e), t += '\n<style class="cp-pen-styles">' + e.css + "</style>", t += "</head><body>"
        },
        _getHTML: function(e) {
            return BunkerBox.makeHTMLSafe(e.html, "personal")
        },
        _getCSSStarterStyles: function(e) {
            return "normalize" === e.css_starter ? this._buildCSSLink(URLUtil.protocolessURL("/assets/reset/normalize.css")) : "reset" === e.css_starter ? this._buildCSSLink(URLUtil.protocolessURL("/assets/reset/reset.css")) : ""
        },
        _getPrefixesStyles: function(e) {
            return "prefixfree" === e.css_prefix ? this._buildScriptLink("/assets/libs/prefixfree.min.js") : ""
        },
        _buildScriptLink: function(e) {
            return "<script src='" + URLUtil.protocolessURL(e) + "'></script>"
        },
        _getStylesToAddToHead: function(e) {
            return _.reduce(e.styles, function(e, t) {
                return "include_css_url" === t.action ? e += this._getIncludeCSSURL(t) : "prepend_as_css" === t.action && (e += "\n<style>\n" + t.content + "\n</style>"), e
            }, "", this)
        },
        _getIncludeCSSURL: function(e) {
            return this._buildCSSLink(this._getIncludeCSSURLHref(e))
        },
        _buildCSSLink: function(e) {
            return "<link rel='stylesheet prefetch' href='" + e + "'>"
        },
        _getIncludeCSSURLHref: function(e) {
            return this._urlRefersToPenURL(e.url) ? this._ensureEndsInDotType(e.url, "css") : e.url
        },
        _getCSSLiveReloadJS: function() {
            return "<script src='" + URLUtil.protocolessURL("/assets/editor/live/css_live_reload_init.js") + "'></script>"
        },
        _getJS: function(e) {
            return this._isIE9() ? this._getJSScripts(e) + "\n<script>setTimeout(function() {" + this._getSafeJS(e.js) + "}, 0);</script>" : this._getJSScripts(e) + this._getPenJS(e)
        },
        _getPenJS: function(e) {
            var t = this._getSafeJS(e.js);
            return t ? "\n<script>\n" + t + "\n//# sourceURL=pen.js\n</script>" : ""
        },
        _getJSScripts: function(e) {
            var t = "";
            return this._includeStopExecutionScript(e) && (t += "<script src='//" + window.__CPDATA.asset_subdomain + document.location.host + "/assets/common/stopExecutionOnTimeout.js?t=1'></script>"), t + this._getPenResourcesAsScripts(e.scripts)
        },
        _includeStopExecutionScript: function(e) {
            return e.js
        },
        _getPenResourcesAsScripts: function(e) {
            return _.reduce(e, function(e, t) {
                return "include_js_url" === t.action ? e += "<script src='" + this._getIncludeJSURLHref(t) + "'></script>" : "prepend_as_js" === t.action && (e += "\n<script>" + t.content + "</script>"), e
            }, "", this)
        },
        _getIncludeJSURLHref: function(e) {
            return this._urlRefersToPenURL(e.url) ? this._ensureEndsInDotType(e.url, "js") : e.url
        },
        _urlRefersToPenURL: function(e) {
            return /\S+\/pen\/(\w{5,})/i.test(e)
        },
        _ensureEndsInDotType: function(e, t) {
            var n = (e || "").split("?"),
                s = new RegExp("." + t, "i");
            return s.exec(n[0]) ? e : (n[0] = this._removeTraingForwardSlash(n[0]) + "." + t, n.join("?"))
        },
        _removeTraingForwardSlash: function(e) {
            return e.replace(/\/$/, "")
        },
        _isIE9: function() {
            var e = function() {
                for (var e, t = 3, n = document.createElement("div"), s = n.getElementsByTagName("i"); n.innerHTML = "<!--[if gt IE " + ++t + "]><i></i><![endif]-->", s[0];);
                return t > 4 ? t : e
            }();
            return 9 === e
        },
        _getSafeJS: function(e) {
            return BunkerBox.makeJSSafe(e, "personal")
        }
    },
    IFrameRenderer = {
        penHTMLKey: "",
        activeIFrameID: "",
        penHTML: "",
        resultDiv: $("#result_div"),
        init: function() {
            _.extend(this, AJAXUtil), this.penHTMLPrefix = window.__phkPrefix, this.sandboxVal = window.__CPDATA.iframe_sandbox, this._listenToPostMessages()
        },
        _listenToPostMessages: function() {
            var e = this;
            window[this._eventMethod()](this._messageEvent(), function(t) {
                try {
                    var n = JSON.parse(t.data),
                        s = e._findRealLineNumber(n.line);
                    Hub.pub("error-in-code", {
                        js: {
                            line: s,
                            type: "js",
                            message: e._getNiceMessageAboutInfiniteLoop(s),
                            level: "error",
                            pretty_name: "JavaScript"
                        }
                    })
                } catch (i) {}
            }, !1)
        },
        _messageEvent: function() {
            return "attachEvent" === this._eventMethod() ? "onmessage" : "message"
        },
        _eventMethod: function() {
            return window.addEventListener ? "addEventListener" : "attachEvent"
        },
        _findRealLineNumber: function(e) {
            var t = this._findLineInRenderedPenHTML(e);
            t = t.replace(/\s+/g, "");
            var n = _.map(CP.pen.js.split(/\r\n?|\n/), function(e) {
                return e.replace(/\s+/g, "")
            });
            return _.indexOf(n, t) + 1
        },
        _findLineInRenderedPenHTML: function(e) {
            for (var t = this.penHTML.split(/\r\n?|\n/), n = e; n > -1 && t[n].match(/(break;|shouldStopExecution)/);) n -= 1;
            return t[n]
        },
        _getNiceMessageAboutInfiniteLoop: function(e) {
            return "Infinite loop found on line " + e + ". The line number is approximated so look carefully."
        },
        UPDATE_LIVE_IFRAME_TIMEOUT: 400,
        ACTIVE_LIVE_IFRAME_TIMEOUT: 5,
        lastUpdateLiveIFrameSetTimeoutID: 0,
        updateLiveIFrame: function(e) {
            if (navigator.cookieEnabled)
                if (this._updateCSSOnly(e)) try {
                    this._sendUpdateCSSOnlyMessage(e)
                } catch (t) {
                    this._standardUpdateLiveIFrame(e)
                } else this._standardUpdateLiveIFrame(e);
                else this._disabledCookiesUpdateIFrame()
        },
        prevPen: null,
        _updateCSSOnly: function(e) {
            if (this._hasCSSThatNeedsAFullRefresh(e)) return !1;
            if (e.fullRefresh) return !1;
            var t = this._hasOnlyCSSChanges(e, this.prevPen);
            return this.prevPen = _.clone(e, !0), t
        },
        _hasCSSThatNeedsAFullRefresh: function(e) {
            return (e.css || "").match(/(keyframes|:target|translate|animation)/gi)
        },
        _hasOnlyCSSChanges: function(e, t) {
            if (null === t) return !1;
            var n = _diffObjects(e, t);
            return delete n.css, 0 === _.size(n)
        },
        _sendUpdateCSSOnlyMessage: function(e) {
            var t = document.getElementById("result" + this.penHTMLKey);
            t.contentWindow.postMessage(JSON.stringify(e), "*")
        },
        _standardUpdateLiveIFrame: function(e) {
            clearTimeout(this.lastUpdateLiveIFrameSetTimeoutID), this.lastUpdateLiveIFrameSetTimeoutID = setTimeout($.proxy(function() {
                this._runLiveUpdate(e), this.ACTIVE_LIVE_IFRAME_TIMEOUT = this.UPDATE_LIVE_IFRAME_TIMEOUT
            }, this), this.ACTIVE_LIVE_IFRAME_TIMEOUT)
        },
        _runLiveUpdate: function(e) {
            this.penHTMLKey = this._getStorePenHTMLKey(), this.penHTML = IFramePenToHTML.renderPenAsHTML(e), this._storePenHTMLOnBoomerang(this.penHTMLKey, this.penHTML)
        },
        _disabledCookiesUpdateIFrame: function() {
            $.showMessage(Copy.errors["disabled-cookies"], "slow");
            var e = URLBuilder.getViewURL("fullpage", CP.profiled, CP.pen, !0);
            this.resultDiv.html(this._getIFrameHTML("0", e))
        },
        _storePenHTMLOnBoomerang: function(e, t) {
            var n = {
                html: t,
                key: e
            };
            this.post("/boomerang", n, this._doneStorePenHTMLOnBoomerang)
        },
        _doneStorePenHTMLOnBoomerang: function() {
            this._replaceOldIFrameWithNew()
        },
        _getStorePenHTMLKey: function() {
            return this.penHTMLPrefix + (new Date).getTime()
        },
        IFRAME_LOAD_WAIT_TIME: 300,
        updateIFrameTimeoutID: 0,
        _replaceOldIFrameWithNew: function() {
            var e = this._getIFrameHTML(this.penHTMLKey, this._getIFrameURL(this.penHTMLKey));
            this.resultDiv.prepend(e), this._showNewIFrameOnload()
        },
        _showNewIFrameOnload: function() {
            $("#result" + this.penHTMLKey).load($.proxy(function() {
                clearTimeout(this.updateIFrameTimeoutID), this._removeOldIFrameShowNewIFrameClass()
            }, this)), this.updateIFrameTimeoutID = setTimeout($.proxy(function() {
                this._removeOldIFrameShowNewIFrameClass()
            }, this), this.IFRAME_LOAD_WAIT_TIME)
        },
        _removeOldIFrameShowNewIFrameClass: function() {
            for (var e = this.resultDiv.children("iframe"), t = 0, n = e.length; n > t; t++) e[t].id !== this.activeIFrameID && $(e[t]).remove();
            $("#" + this.activeIFrameID).removeClass("iframe-visual-update")
        },
        _getIFrameHTML: function(e, t) {
            return "<iframe id='" + this._buildActiveIFrameID(e) + "' src='" + t + "' name='CodePen' allowfullscreen='true' sandbox='" + this.sandboxVal + "' allowTransparency='true' class='result-iframe iframe-visual-update' ></iframe>"
        },
        _buildActiveIFrameID: function(e) {
            return this.activeIFrameID = "result" + e, this.activeIFrameID
        },
        _getIFrameURL: function(e) {
            return _.template(this._getIFrameURLTemplate(), {
                key: e,
                protocol: document.location.protocol,
                subdomain: window.__CPDATA.host_secure_subdomain,
                host: window.__CPDATA.host,
                port: window.__CPDATA.host_port,
                search: document.location.search,
                hash: document.location.hash
            })
        },
        _getIFrameURLTemplate: function() {
            return "<%= protocol %>//<%= subdomain %><%= host %><%= port %>/boomerang/<%= key %>/index.html<%= search %><%= hash %>"
        }
    },
    PenRenderer = Class.extend({
        DEFAULT_TIMEOUT: 900,
        SHORT_TIMEOUT: 400,
        MAX_TIMEOUT: 3500,
        _lastProcessAndRender: 0,
        _processedPen: null,
        init: function() {
            this._bindToHub(), "test" !== window.__env && (IFrameRenderer.init(), this.processAndRender(!0))
        },
        _bindToHub: function() {
            Hub.sub("pen-change", $.proxy(this._onPenChange, this))
        },
        _onPenChange: function(e, t) {
            CP.pen.getAttribute("editor_settings").auto_run && this._penPreviewAttributeChanged(t.pen) && this._processPenOnNextTick()
        },
        _penPreviewAttributeChanged: function(e) {
            var t = CP.pen.getAttributesThatAffectPenPreview();
            return _.intersection(t, _.keys(e)).length > 0
        },
        _processPenOnNextTick: function() {
            clearTimeout(this._prevNextTickTimeoutID), this._prevNextTickTimeoutID = setTimeout($.proxy(this.processAndRender, this), this._getNextTickTimeout())
        },
        _getNextTickTimeout: function() {
            var e = _getTimeInMilliseconds() - this._lastProcessAndRender;
            return e > this.MAX_TIMEOUT ? this.SHORT_TIMEOUT : this.DEFAULT_TIMEOUT
        },
        processAndRender: function(e) {
            clearTimeout(this._prevNextTickTimeoutID), this._lastProcessAndRender = _getTimeInMilliseconds(), CP.penProcessor.process($.proxy(this._renderProcessedPen, this), {
                fullRefresh: e || !1
            })
        },
        _renderProcessedPen: function(e) {
            CP.penErrorHandler.canRenderPen(e.errors) && (this.renderablePen = e.processedPen.buildRenderableHash(), Hub.pub("live_change", this.renderablePen), IFrameRenderer.updateLiveIFrame(this.renderablePen)), CP.penErrorHandler.handleErrorsInEditor(e.errors)
        },
        getLastRenderableHash: function() {
            return this.renderablePen
        }
    }),
    PenResources = Class.extend({
        _cachedResources: {},
        init: function() {
            _.extend(this, AJAXUtil)
        },
        processResourcesAndCallback: function(e, t) {
            var n = this._findResourcesNeedingToBeProcess(e);
            this._canProcessResources() && n.length > 0 ? this._processResourcesAndRunCallback(e, n, t) : t(e.resources)
        },
        _findResourcesNeedingToBeProcess: function(e) {
            return HTMLTemplating.findHTMLTemplatesInPenHTML(e.html).concat(this._findResourcesThatNeedToBeProcessed(e.resources))
        },
        _findResourcesThatNeedToBeProcessed: function(e) {
            return _.filter(_.pluck(e, "url"), function(e) {
                return this._isURLResourceNeedingProcessing(e)
            }, this)
        },
        _isURLResourceNeedingProcessing: function(e) {
            return this._urlRefersToPenURL(e) || this._urlRefersToCSSNeedingToBePreprocessed(e) || this._urlRefersToJSNeedingToBePreprocessed(e)
        },
        _urlRefersToPenURL: function(e) {
            return /\S+\/pen\/(\w{5,})/i.test(e)
        },
        _urlRefersToCSSNeedingToBePreprocessed: function(e) {
            return _.contains(__preprocessors.css.preprocessors, this._getExtension(e))
        },
        _urlRefersToJSNeedingToBePreprocessed: function(e) {
            return _.contains(__preprocessors.js.preprocessors, this._getExtension(e))
        },
        _getExtension: function(e) {
            return _.last((e || "").split("."))
        },
        _canProcessResources: function() {
            return navigator.cookieEnabled
        },
        _processResourcesAndRunCallback: function(e, t, n) {
            this._useCachedResources(t) ? n(_.values(this._cachedResources)) : this._postPenResources(e, n)
        },
        _postPenResources: function(e, t) {
            var n = "/process_resources",
                s = {
                    pen: JSON.stringify(this._getProcessResourcesParams(e))
                };
            this.post(n, s, $.proxy(function(e) {
                var n = JSON.parse(e.resources);
                this._cacheResources(n), t(n)
            }, this))
        },
        _getProcessResourcesParams: function(e) {
            return _.pick(e, ["html", "html_pre_processor", "css", "css_pre_processor", "css_prefix", "js_pre_processor", "resources"])
        },
        _cacheResources: function(e) {
            this._cachedResources = {};
            for (var t = 0, n = e.length; n > t; t++) this._cachedResources[this._getCacheKey(e[t])] = e[t]
        },
        _getCacheKey: function(e) {
            return e.url ? e.url : e.text_to_replace
        },
        _useCachedResources: function(e) {
            return !1
        },
        _hasAllResourcesNeedingToBeProcessedCached: function(e) {
            var t = _.keys(this._cachedResources),
                n = _.difference(e, t);
            return 0 === n.length
        }
    }),
    ProcessedPen = Class.extend({
        fullRefresh: !1,
        processed: {},
        resources: [],
        init: function(e) {
            _.assign(this, e)
        },
        setValue: function(e, t) {
            this[e] = t
        },
        setProcessedValue: function(e, t) {
            this.processed[e] = t
        },
        getProcessed: function(e) {
            return this.processed[e]
        },
        buildPenToSendToPreprocessors: function() {
            return {
                html: this._mergeHTMLWithProcessedResources(CP.pen.html),
                html_pre_processor: CP.pen.html_pre_processor,
                css: this._mergeCSSWithProcessedResources(CP.pen.css, this.processed.resources),
                css_pre_processor: CP.pen.css_pre_processor,
                css_prefix: CP.pen.css_prefix,
                js: this._mergeJSWithProcessedResources(CP.pen.js, this.processed.resources),
                js_pre_processor: CP.pen.js_pre_processor
            }
        },
        _mergeHTMLWithProcessedResources: function(e) {
            return e ? HTMLTemplating.regexReplaceHTMLBeforeProcessing(e, this.processed.resources) : e
        },
        _mergeCSSWithProcessedResources: function(e, t) {
            return this._getPrependFromResources("css", t) + e
        },
        _mergeJSWithProcessedResources: function(e, t) {
            return this._getPrependFromResources("js", t) + e
        },
        _getPrependFromResources: function(e, t) {
            return _.reduce(t, function(t, n) {
                return n.action === "prepend_to_" + e ? "js" === e ? t + n.content + ";\n" : t + n.content + "\n" : t
            }, "")
        },
        buildRenderableHash: function() {
            return {
                html: this._getProcessedHTML(),
                html_classes: CP.pen.html_classes,
                head: CP.pen.head,
                css: this.processed.css,
                css_prefix: CP.pen.css_prefix,
                css_starter: CP.pen.css_starter,
                styles: this._getStyles(),
                js: this._getProcessedJS(),
                js_pre_processor: CP.pen.js_pre_processor,
                scripts: this._getScripts(),
                fullRefresh: this.fullRefresh,
                location_hash: window.location.hash
            }
        },
        _getProcessedHTML: function() {
            return HTMLTemplating.regexReplaceHTMLAfterProcessing(this.processed.html, this.processed.resources)
        },
        _getProcessedJS: function() {
            return this.processed.js
        },
        _getStyles: function() {
            return this._getIncludesAndPrependToResources(this.processed.resources, "css")
        },
        _getScripts: function() {
            return this._getIncludesAndPrependToResources(this.processed.resources, "js")
        },
        _getIncludesAndPrependToResources: function(e, t) {
            return _.sortBy(_.select(this._matchByURLAndMixin(e, t), function(e) {
                return _isValidURL(e.url) && (e.action === "include_" + t + "_url" || e.action === "prepend_as_" + t)
            }), "order")
        },
        _matchByURLAndMixin: function(e, t) {
            return _.map(this._selectRenderableResources(t), function(n) {
                var s = this._findMatchByURLAndResourceType(e, n);
                return s ? _.assign({}, s, n, {
                    action: s.action,
                    content: s.content
                }) : (n.action = "include_" + t + "_url", n)
            }, this)
        },
        _selectRenderableResources: function(e) {
            return _.select(CP.pen.getResourcesByType(e), function(e) {
                return "" !== e.url
            })
        },
        _findMatchByURLAndResourceType: function(e, t) {
            return _.find(e, function(e) {
                return e.url === t.url && e.resource_type === t.resource_type
            })
        }
    }),
    RTClient = Class.extend({
        connect: function(e, t, n) {
            this._connect(e, t, n), this._handleUnload(e)
        },
        _HEART_BEAT: 60,
        _connect: function(e, t, n) {
            this.pubnub = PUBNUB.init({
                publish_key: "pub-c-2dc172d2-d77c-4ab0-aa37-13d5b7c7c63e",
                subscribe_key: "sub-c-e10c7f7e-3cfb-11e4-949a-02ee2ddab7fe",
                uuid: e.rtClientID
            });
            var s = this;
            this.pubnub.subscribe({
                channel: e.roomID,
                message: $.proxy(this._onMessage, this),
                connect: function() {
                    s._setState(e), t()
                },
                error: n,
                presence: function() {
                    s._onPresence(e)
                },
                heartbeat: this._HEART_BEAT
            })
        },
        _setState: function(e) {
            this.pubnub.state({
                channel: e.roomID,
                state: e.user
            })
        },
        _handleUnload: function(e) {
            var t = this;
            $(window).unload(function() {
                t.unsubscribe(e)
            })
        },
        showStandardUnableToConnectWarning: function() {
            $.showModal("/ajax/realtime/unable_to_connect", "modal-warning modal-single-message")
        },
        publish: function(e, t, n) {
            var s = this;
            _.forEach(this._getMessagesToPublish(e, t, n), function(e) {
                s.pubnub.publish({
                    channel: t.roomID,
                    message: e
                })
            })
        },
        MAX_MESSAGE_LENGTH: 12e3,
        _getMessagesToPublish: function(e, t, n) {
            var s = this._buildEvent(e, t, n),
                i = JSON.stringify(s),
                o = i.length;
            if (o < this.MAX_MESSAGE_LENGTH) return s.part = !1, [s];
            for (var r = [], a = _getTimeInMilliseconds(), c = 0; o > c;) r.push({
                id: a,
                index: r.length,
                part: i.substring(c, c + this.MAX_MESSAGE_LENGTH)
            }), c += this.MAX_MESSAGE_LENGTH;
            return _.forEach(r, function(e) {
                e.length = r.length
            }), r
        },
        calculatePayloadSize: function(e, t) {
            return encodeURIComponent(e + JSON.stringify(t)).length + 100
        },
        _buildEvent: function(e, t, n) {
            return {
                type: e,
                data: n,
                rtData: t
            }
        },
        _onEvents: {},
        _messages: {},
        _onMessage: function(e) {
            e.part ? this._handleReconstituingMessage(e) : this._handleFullMessage(e)
        },
        _handleReconstituingMessage: function(e) {
            var t = this._getMsgArray(e);
            if (t[e.index] = e.part, t.length === e.length) {
                delete this._messages[e.id];
                var n = t.join("");
                try {
                    var s = JSON.parse(n);
                    this._handleFullMessage(s)
                } catch (i) {
                    console.log(i)
                }
            }
        },
        _getMsgArray: function(e) {
            return "undefined" == typeof this._messages[e.id] && (this._messages[e.id] = []), this._messages[e.id]
        },
        _handleFullMessage: function(e) {
            this._onEvents[e.type] && this._onEvents[e.type](e)
        },
        subscribe: function(e, t, n, s) {
            var i = this;
            "boolean" != typeof s && (s = !1), this._onEvents[e] = function(e) {
                (s || i._shouldHandleEvent(t, e)) && n(e)
            }
        },
        _shouldHandleEvent: function(e, t) {
            return e.rtClientID !== t.rtData.rtClientID
        },
        unsubscribe: function(e) {
            this.pubnub.unsubscribe({
                channel: e.roomID
            })
        },
        republishRoomCounts: function(e) {
            this._onPresence(e)
        },
        _onPresence: function(e) {
            this.pubnub.here_now({
                channel: e.roomID,
                state: !0,
                callback: function(e) {
                    var t = _.map(e.uuids, function(e) {
                        return e.state
                    });
                    Hub.pub("room-count-change", {
                        users: t
                    })
                }
            })
        }
    }),
    BaseSettingsController = Class.extend({
        setPenValue: function(e) {
            this.pen.setPenValue(e)
        },
        syncWithServer: function(e) {
            this.model.syncWithServer(e)
        }
    }),
    BaseSettingsEvents = Class.extend({
        type: "",
        _canDrive: !0,
        init: function(e) {
            this.controller = e, _.extend(this, EnableDisableDriver), this.bindToEnableDisableHubEvents()
        },
        _setPenValue: function(e) {
            this.controller.setPenValue(this._buildBasicData(e))
        },
        _setPenValueFromServer: function(e) {
            this.controller.setPenValue(e)
        },
        _onServerPenChange: function(e, t) {
            this.controller.setPenValue(t)
        },
        _buildBasicData: function(e) {
            return {
                origin: "client",
                pen: e
            }
        }
    }),
    BaseSettingsModel = Class.extend({
        init: function() {}
    }),
    BaseSettingsView = Class.extend({
        type: "",
        _canDrive: !0,
        init: function() {}
    }),
    BehaviorController = BaseSettingsController.extend({
        init: function(e) {
            this.pen = e, this.events = new BehaviorEvents(this), this.view = new BehaviorView(e)
        }
    }),
    BehaviorEvents = BaseSettingsEvents.extend({
        $autoSave: $("#auto-save"),
        $autoRun: $("#auto-run"),
        $tabSize: $("#tab-size"),
        $indentWith: $("input[name='indent-with']"),
        init: function(e) {
            this._super(e), _.extend(this, EnableDisableDriver), this.bindToEnableDisableHubEvents(), this._bindToDOM(), this._bindToHub()
        },
        _bindToDOM: function() {
            this.$autoSave._on("click", this._setAutoSave, this, !0), this.$autoRun._on("click", this._setAutoRun, this, !0), this.$tabSize._on("change", this._onTabSizeChange, this), this.$indentWith._on("click", this._setIndentWith, this, !0)
        },
        _bindToHub: function() {
            Hub.sub("server-pen-change", $.proxy(this._onServerPenChange, this))
        },
        _onServerPenChange: function(e, t) {
            ObjectUtil.hasNestedValue(t, "pen.editor_settings") && this._setPenValueFromServer(t)
        },
        _setAutoSave: function(e, t) {
            this._canDrive && this._setPenValue(this._buildSettingsPenData("auto_save", t.is(":checked")))
        },
        _setAutoRun: function(e, t) {
            this._canDrive && this._setPenValue(this._buildSettingsPenData("auto_run", t.is(":checked")))
        },
        _setIndentWith: function() {
            this._canDrive && this._setPenValue(this._buildSettingsPenData("indent_with", $("input[name='indent-with']:checked").val()))
        },
        _onTabSizeChange: function(e, t) {
            this._canDrive && this._setPenValue(this._buildSettingsPenData("tab_size", this._validTabSize(t.val())))
        },
        _validTabSize: function(e) {
            var t = 1 * e;
            return 1 > t || t > 6 ? "1" : e
        },
        _buildSettingsPenData: function(e, t) {
            var n = {
                editor_settings: {}
            };
            return n.editor_settings[e] = t, n
        },
        _getAllUIElements: function() {
            return [this.$autoSave, this.$autoRun, this.$tabSize, this.$indentWith]
        }
    }),
    BehaviorView = Class.extend({
        $body: $("body"),
        $autoSave: $("#auto-save"),
        $autoRun: $("#auto-run"),
        $tabSize: $("#tab-size"),
        $indentWithSpaces: $("#indent-with-spaces"),
        $indentWithTabs: $("#indent-with-tabs"),
        init: function(e) {
            this._bindToHub(), this._handlePenChange(e)
        },
        _bindToHub: function() {
            Hub.sub("pen-change", $.proxy(this._onPenChange, this))
        },
        _onPenChange: function(e, t) {
            this._handlePenChange(t.pen)
        },
        _handlePenChange: function(e) {
            ObjectUtil.hasNestedValue(e, "editor_settings.auto_run") && this._setAutoRun(e.editor_settings.auto_run), ObjectUtil.hasNestedValue(e, "editor_settings.auto_save") && this._setAutoSave(e.editor_settings.auto_save), ObjectUtil.hasNestedValue(e, "editor_settings.indent_with") && this._setIndentWith(e.editor_settings.indent_with), ObjectUtil.hasNestedValue(e, "editor_settings.tab_size") && this._setTabSize(e.editor_settings.tab_size)
        },
        _setAutoRun: function(e) {
            e ? (this.$autoRun.prop("checked", !0), this.$body.removeClass("show-run-button")) : (this.$autoRun.prop("checked", !1), this.$body.addClass("show-run-button"))
        },
        _setAutoSave: function(e) {
            this.$autoSave.prop("checked", e)
        },
        _setIndentWith: function(e) {
            "tabs" === e ? (this.$indentWithTabs.prop("checked", !0), this.$indentWithSpaces.prop("checked", !1)) : (this.$indentWithTabs.prop("checked", !1), this.$indentWithSpaces.prop("checked", !0))
        },
        _setTabSize: function(e) {
            this.$tabSize.val(e)
        }
    }),
    CSSSettingsController = BaseSettingsController.extend({
        init: function(e) {
            this.pen = e, this.events = new CSSSettingsEvents(this), this.model = new CSSSettingsModel, this.view = new CSSSettingsView(e), this.resourcesController = new ResourcesController("css")
        },
        showAddons: function(e) {
            this.model.showAddons(e)
        },
        hideAddons: function(e) {
            this.model.hideAddons(e)
        },
        syncWithServer: function(e) {
            this.model.syncWithServer(e)
        }
    }),
    CSSSettingsEvents = BaseSettingsEvents.extend({
        type: "css",
        $cssPreProcessor: $("#css-preprocessor"),
        $starterCSS: $("input[name='startercss']"),
        $cssPrefix: $("input[name='prefix']"),
        $cssNeedAnAddon: $("#css-need-an-addon-button"),
        init: function(e) {
            this._super(e), _.extend(this, EnableDisableDriver), this.bindToEnableDisableHubEvents(), this._bindToDOM(), this._bindToHub()
        },
        _bindToDOM: function() {
            this.$cssPreProcessor._on("change", this._selectPreProcessor, this, !0), this.$starterCSS._on("click", this._selectStartCSS, this, !0), this.$cssPrefix._on("click", this._selectCSSPrefix, this, !0), this.$cssNeedAnAddon._on("click", this._onClickNeedAnAddonButton, this)
        },
        _bindToHub: function() {
            Hub.sub("server-ui-change", $.proxy(this._onServerUIChange, this)), Hub.sub("server-pen-change", $.proxy(this._onServerPenChange, this))
        },
        _onServerUIChange: function(e, t) {
            ObjectUtil.hasNestedValue(t, "ui.settings.css.addons") && this.controller.syncWithServer(t)
        },
        _onServerPenChange: function(e, t) {
            (ObjectUtil.hasNestedValue(t, "pen.css_pre_processor") || ObjectUtil.hasNestedValue(t, "pen.css_prefix") || ObjectUtil.hasNestedValue(t, "pen.css_starter")) && this._setPenValueFromServer(t)
        },
        _selectPreProcessor: function(e, t) {
            this._canDrive && (this._setPenValue({
                css_pre_processor: t.val()
            }), this.controller.hideAddons({
                origin: "client"
            }))
        },
        _selectStartCSS: function(e, t) {
            this._canDrive && this._setPenValue({
                css_starter: t.val()
            })
        },
        _selectCSSPrefix: function(e, t) {
            this._canDrive && this._setPenValue({
                css_prefix: t.val()
            })
        },
        _getAllUIElements: function() {
            return [this.$cssPreProcessor, this.$starterCSS, this.$cssPrefix, this.$cssNeedAnAddon]
        },
        _onClickNeedAnAddonButton: function() {
            this._canDrive && ("open" == CP.ui.settings.css.addons ? this.controller.hideAddons({
                origin: "client"
            }) : this.controller.showAddons({
                origin: "client"
            }))
        },
        rebindAddOnsUI: function() {
            this.$addOnFilter = $("#css-add-ons-filter"), this.$addOnFilterClear = $("#css-clear-addon-filter"), this.$addOnItems = $("#css-add-ons-list").find("li"), this.$addOnFilter._on("keyup", this.controller.view._filterAddOns, this), this.$addOnFilterClear._on("click", this.controller.view._clearAddOnsFilter, this), this.$addOnItems.find(".add-add-on")._on("click", this._insertAddOnCode, this)
        },
        _insertAddOnCode: function(e, t) {
            e.preventDefault();
            var n = CP.cssEditor.editor.getValue(),
                s = t.parent().find(".add-on-code").html() + "\n" + n;
            CP.cssEditor.editor.setValue(s), $.showMessage("Preprocessor Add-On Added!")
        }
    }),
    CSSSettingsModel = BaseSettingsModel.extend({
        type: "css",
        init: function() {
            this._super()
        },
        showAddons: function(e) {
            CP.ui.settings.css.addons = "open", this._pubUIChange(e)
        },
        hideAddons: function(e) {
            CP.ui.settings.css.addons = "closed", this._pubUIChange(e)
        },
        syncWithServer: function(e) {
            CP.ui.settings.css.addons = e.ui.settings.css.addons, this._pubUIChange(e)
        },
        _pubUIChange: function(e) {
            Hub.pub("ui-change", {
                origin: e.origin,
                ui: {
                    settings: {
                        css: {
                            addons: CP.ui.settings.css.addons
                        }
                    }
                }
            })
        }
    }),
    CSSSettingsView = BaseSettingsView.extend({
        $boxCSSEl: $("#box-css"),
        $cssPreprocessor: $("#css-preprocessor"),
        $needAnAddon: $("#need-an-addon"),
        $addOns: $("#add-ons"),
        type: "css",
        init: function(e) {
            this._super(), this._bindToHub(), this._updateUI(e)
        },
        _bindToHub: function() {
            Hub.sub("pen-change", $.proxy(this._onPenChange, this)), Hub.sub("ui-change", $.proxy(this._onUIChange, this))
        },
        _onPenChange: function(e, t) {
            this._updateUI(t.pen)
        },
        _updateUI: function(e) {
            ObjectUtil.hasNestedValue(e, "css_pre_processor") && this._setPreProcessor(e), ObjectUtil.hasNestedValue(e, "css_starter") && this._selectCSSStarter(e), ObjectUtil.hasNestedValue(e, "css_prefix") && this._selectCSSPrefix(e)
        },
        _onUIChange: function(e, t) {
            ObjectUtil.hasNestedValue(t, "ui.settings.css.addons") && this._updateAddons(t.ui.settings.css.addons)
        },
        _setPreProcessor: function(e) {
            this._selectPreProcessor(e), this._addClassesToBoxCSS(e), this._toggleNeedAddons(e)
        },
        _selectPreProcessor: function(e) {
            this.$cssPreprocessor.val(e.css_pre_processor)
        },
        _addClassesToBoxCSS: function(e) {
            this.$boxCSSEl.removeClass(__preprocessors.css.syntaxes.join(" ")).removeClass(__preprocessors.css.prefixes.join(" ")).addClass(e.css_pre_processor)
        },
        _toggleNeedAddons: function(e) {
            if (_.contains(__preprocessors.css.preprocessors, e.css_pre_processor)) {
                var t = this;
                CacheGet.findInMemory({
                    key: "/editor/constants/addons/" + e.css_pre_processor,
                    url: "/editor/constants/addons/" + e.css_pre_processor,
                    dataType: "json",
                    cb: function(e) {
                        t.$addOns.html(e.html), t.$needAnAddon.removeClass("hide"), CP.cssSettingsController.events.rebindAddOnsUI()
                    }
                })
            } else this.$needAnAddon.addClass("hide")
        },
        _updateAddons: function(e) {
            "open" === e ? this.$addOns.removeClass("hide") : this.$addOns.addClass("hide")
        },
        _selectCSSStarter: function(e) {
            $("#startercss-options-form input[value='" + e.css_starter + "']").prop("checked", !0)
        },
        _selectCSSPrefix: function(e) {
            $("#prefix-options-form input[value='" + e.css_prefix + "']").prop("checked", !0), this._addCSSPrefixClassToBoxCSS(e)
        },
        _addCSSPrefixClassToBoxCSS: function(e) {
            this.$boxCSSEl.removeClass(__preprocessors.css.prefixes.join(" ")).addClass(e.css_prefix)
        },
        _filterAddOns: function() {
            var e = this.$addOnFilter.val();
            if ("" !== e) {
                this.$addOnItems.hide(), this.$addOnFilterClear.show();
                for (var t = 0; t < this.$addOnItems.length; t++)
                    if (this.$addOnItems[t].innerHTML.indexOf(e) > -1 && ($(this.$addOnItems[t]).show(), $(this.$addOnItems[t]).hasClass("depends-on")))
                        for (var n = t; n >= 0; n--)
                            if (!$(this.$addOnItems[n]).hasClass("depends-on")) {
                                $(this.$addOnItems[n]).show();
                                break
                            }
            } else this.$addOnFilterClear.hide(), this.$addOnItems.show()
        },
        _clearAddOnsFilter: function() {
            this.$addOnFilter.val(""), this.$addOnItems.show(), this.$addOnFilterClear.hide()
        }
    }),
    HTMLSettingsController = BaseSettingsController.extend({
        init: function(e) {
            this.pen = e, this.events = new HTMLSettingsEvents(this), this.model = new HTMLSettingsModel(this), this.view = new HTMLSettingsView(e)
        }
    }),
    HTMLSettingsEvents = BaseSettingsEvents.extend({
        type: "html",
        $htmlPreProcessor: $("#html-preprocessor"),
        $headContent: $("#head-content"),
        $htmlClasses: $("#html-classes"),
        $metaTagInsert: $("#meta-tag-insert"),
        init: function(e) {
            this._super(e), _.extend(this, EnableDisableDriver), this.bindToEnableDisableHubEvents(), this._bindToDOM(), this._bindToHub()
        },
        _bindToDOM: function() {
            this.$htmlPreProcessor._on("change", this._selectPreProcessor, this, !0), this.$headContent._on("keyup change", this._setHead, this, !0), this.$htmlClasses._on("keyup change", this._setHTMLClasses, this, !0), this.$metaTagInsert._on("click", this._addCommonMetaTag, this, !1)
        },
        _bindToHub: function() {
            Hub.sub("server-pen-change", $.proxy(this._onServerPenChange, this))
        },
        _onServerPenChange: function(e, t) {
            (ObjectUtil.hasNestedValue(t, "pen.html_pre_processor") || ObjectUtil.hasNestedValue(t, "pen.head") || ObjectUtil.hasNestedValue(t, "pen.html_classes")) && this._setPenValueFromServer(t)
        },
        _selectPreProcessor: function(e, t) {
            this._canDrive && this._setPenValue({
                html_pre_processor: t.val()
            })
        },
        _setHead: function(e, t) {
            this._canDrive && this._setPenValue({
                head: t.val()
            })
        },
        _setHTMLClasses: function(e, t) {
            this._canDrive && this._setPenValue({
                html_classes: t.val()
            })
        },
        _addCommonMetaTag: function() {
            this._canDrive && this._setPenValue({
                head: this._getHeadWithMetaTag()
            })
        },
        _getHeadWithMetaTag: function() {
            return $.trim($("#head-content").val() + '\n<meta name="viewport" content="width=device-width, initial-scale=1">')
        },
        _getAllUIElements: function() {
            return [this.$htmlPreProcessor, this.$headContent, this.$htmlClasses, this.$metaTagInsert]
        }
    }),
    HTMLSettingsModel = BaseSettingsModel.extend({
        type: "html",
        init: function() {
            this._super()
        }
    }),
    HTMLSettingsView = BaseSettingsView.extend({
        $boxHTML: $("#box-html"),
        $htmlPreprocessor: $("#html-preprocessor"),
        $htmlClasses: $("#html-classes"),
        $head: $("#head-content"),
        type: "html",
        init: function(e) {
            this._super(), this._bindToHub(), this._updateUI(e)
        },
        _bindToHub: function() {
            Hub.sub("pen-change", $.proxy(this._onPenChange, this))
        },
        _onPenChange: function(e, t) {
            this._updateUI(t.pen)
        },
        _updateUI: function(e) {
            ObjectUtil.hasNestedValue(e, "html_pre_processor") && this._setPreProcessor(e.html_pre_processor), ObjectUtil.hasNestedValue(e, "head") && this._setHead(e.head), ObjectUtil.hasNestedValue(e, "html_classes") && this._setHTMLClasses(e.html_classes)
        },
        _setHead: function(e) {
            this.$head.val() !== e && this.$head.val(e)
        },
        _setHTMLClasses: function(e) {
            this.$htmlClasses.val() !== e && this.$htmlClasses.val(e)
        },
        _setPreProcessor: function(e) {
            this._addClassBoxHTML(e), this._selectPreProcessor(e)
        },
        _selectPreProcessor: function(e) {
            this.$htmlPreprocessor.val(e)
        },
        _addClassBoxHTML: function(e) {
            this.$boxHTML.removeClass(__preprocessors.html.syntaxes.join(" ")).addClass(e)
        }
    }),
    InfoController = Class.extend({
        init: function() {
            this.events = new InfoEvents, this.view = new InfoView
        }
    }),
    InfoEvents = Class.extend({
        $title: $("#pen-details-title"),
        $description: $("#pen-details-description"),
        $privateCkbx: $("#pen-details-private"),
        $templateCkbx: $("#pen-details-template"),
        init: function(e) {
            this.controller = e, this._bindToDOM()
        },
        _bindToDOM: function() {
            this.$title.on("keyup", $.proxy(this._setTitle, this)), this.$description.on("keyup", $.proxy(this._setDescription, this)), this.$privateCkbx._on("click", this._setPenPrivacy, this, !0), this.$templateCkbx._on("click", this._setTemplate, this, !0)
        },
        _setTitle: function() {
            CP.pen.setPenValue({
                origin: "client",
                pen: {
                    title: this.$title.val()
                }
            })
        },
        _setDescription: function() {
            CP.pen.setPenValue({
                origin: "client",
                pen: {
                    description: this.$description.val()
                }
            })
        },
        _setPenPrivacy: function() {
            CP.pen.setPenValue({
                origin: "client",
                pen: {
                    "private": this.$privateCkbx.is(":checked")
                }
            })
        },
        _setTemplate: function() {
            CP.pen.setPenValue({
                origin: "client",
                pen: {
                    template: this.$templateCkbx.is(":checked")
                }
            })
        }
    }),
    InfoView = Class.extend({
        $body: $("body"),
        $lastSavedTimeAgo: $("#last-saved-time-ago"),
        $detailsTitle: $("#details-title"),
        $penTitle: $("#pen-title"),
        $templateCkbx: $("#pen-details-template"),
        init: function() {
            this.pageType = __pageType, this._bindToHub(), this._hidePenHasUnsavedChanges()
        },
        _bindToHub: function() {
            Hub.sub("pen-change", $.proxy(this._onPenChange, this)), Hub.sub("pen-errors", $.proxy(this._onPenErrors, this)), Hub.sub("pen-saved", $.proxy(this._onPenSaved, this))
        },
        _onPenChange: function(e, t) {
            this._showPenHasUnsavedChanges(), ObjectUtil.hasNestedValue(t, "pen.title") && this._updatePenTitle(t), ObjectUtil.hasNestedValue(t, "pen.private") && this._updateBrowserURL(), ObjectUtil.hasNestedValue(t, "pen.template") && this._updateTemplate(t)
        },
        _updatePenTitle: function(e) {
            document.title = e.pen.title, this.$penTitle.html(e.pen.title), this.$detailsTitle.html(e.pen.title)
        },
        _updateBrowserURL: function() {
            if (window.history.replaceState && CP.pen.getActiveSlugHash()) {
                var e = URLBuilder.getViewURL(this.pageType, CP.profiled, CP.pen, !1);
                window.history.replaceState(e, "", e)
            }
        },
        _updateTemplate: function(e) {
            this.$templateCkbx.is(":checked") !== e.pen.template && this.$templateCkbx.attr("checked", e.pen.template)
        },
        _onPenErrors: function(e, t) {
            $.showMessage(Copy.errors[t], "slow")
        },
        _onPenSaved: function(e, t) {
            this._isNewPenInProfessorOrCollab(t) ? $.showMessage(_.template(Copy.penForked, t), 8e3) : (this._hidePenHasUnsavedChanges(), this._updateSavedTimeAgoFooter(t), this._updateTitleAndDescriptionOnDetailsPage())
        },
        _isNewPenInProfessorOrCollab: function(e) {
            return _.contains(["professor", "collab"], this.pageType) && e.newPen
        },
        _updateSavedTimeAgoFooter: function(e) {
            this.$lastSavedTimeAgo.html(e.last_saved_time_ago)
        },
        _updateTitleAndDescriptionOnDetailsPage: function() {
            "details" === this.pageType && window.location.reload()
        },
        _showPenHasUnsavedChanges: function() {
            CP.pen.save_disabled || this.$body.addClass("unsaved")
        },
        _hidePenHasUnsavedChanges: function() {
            this.$body.removeClass("unsaved")
        }
    }),
    JSSettingsController = BaseSettingsController.extend({
        type: "js",
        init: function(e) {
            this.pen = e, this.events = new JSSettingsEvents(this), this.model = new JSSettingsModel(this), this.view = new JSSettingsView(e), this.resourcesController = new ResourcesController("js")
        }
    }),
    JSSettingsEvents = BaseSettingsEvents.extend({
        type: "js",
        $jsPreProcessor: $("#js-preprocessor"),
        init: function(e) {
            this._super(e), _.extend(this, EnableDisableDriver), this.bindToEnableDisableHubEvents(), this._bindToDOM(), this._bindToHub()
        },
        _bindToDOM: function() {
            this.$jsPreProcessor._on("change", this._selectPreProcessor, this, !0)
        },
        _bindToHub: function() {
            Hub.sub("server-pen-change", $.proxy(this._onServerPenChange, this))
        },
        _onServerPenChange: function(e, t) {
            ObjectUtil.hasNestedValue(t, "pen.js_pre_processor") && this._setPenValueFromServer(t)
        },
        _selectPreProcessor: function(e, t) {
            this._canDrive && this._setPenValue({
                js_pre_processor: t.val()
            })
        },
        _getAllUIElements: function() {
            return [this.$jsPreProcessor]
        }
    }),
    JSSettingsModel = BaseSettingsModel.extend({
        type: "js",
        init: function() {
            this._super()
        }
    }),
    JSSettingsView = BaseSettingsView.extend({
        $boxJS: $("#box-js"),
        $jsPreprocessor: $("#js-preprocessor"),
        type: "js",
        init: function(e) {
            this._super(), this._bindToHub(), this._updateUI(e)
        },
        _bindToHub: function() {
            Hub.sub("pen-change", $.proxy(this._onPenChange, this))
        },
        _onPenChange: function(e, t) {
            this._updateUI(t.pen)
        },
        _updateUI: function(e) {
            ObjectUtil.hasNestedValue(e, "js_pre_processor") && this._setPreProcessor(e.js_pre_processor)
        },
        _setPreProcessor: function(e) {
            this._addClassBoxJS(e), this._selectPreProcessor(e)
        },
        _selectPreProcessor: function(e) {
            this.$jsPreprocessor.val(e)
        },
        _addClassBoxJS: function(e) {
            this.$boxJS.removeClass(__preprocessors.js.syntaxes.join(" ")).addClass(e)
        }
    }),
    ResourcesController = Class.extend({
        init: function(e) {
            this.type = e, this.events = new ResourcesEvents(this, e), this.view = new ResourcesView(e)
        },
        setPenValueFromServer: function(e) {
            CP.pen.setPenResources(e)
        },
        addEmptyResource: function(e) {
            CP.pen.addEmptyResource(e)
        },
        quickAddResource: function(e, t) {
            CP.pen.quickAddResource(e, t)
        },
        deleteResource: function(e) {
            CP.pen.deleteResource(e)
        },
        setResource: function(e, t) {
            CP.pen.setResource(e, t)
        },
        updateResourcesOrder: function(e, t) {
            CP.pen.updateResourcesOrder(e, t)
        }
    }),
    ResourcesEvents = Class.extend({
        init: function(e, t) {
            this.controller = e, this.type = t, _.extend(this, EnableDisableDriver), this.bindToEnableDisableHubEvents(), this._bindToDOM(), this._bindToHub()
        },
        _bindToDOM: function() {
            $("#add-" + this.type + "-resource")._on("click", this._onAddResourceClick, this), $("#" + this.type + "-quick-add")._on("change", this._onQuickAddChange, this), $("#" + this.type + "-external-resources").on("click", "span.remove-external-url", $.proxy(this._onDeleteResource, this)).on("keydown", this._getResourcesSelector(), $.proxy(this._onChangeResource, this)).on("change", this._getResourcesSelector(), $.proxy(this._onChangeResource, this)), window.__mobile || this._makeResourcesSortable()
        },
        _getResourcesSelector: function() {
            return "input." + this.type + "-resource[name='external-" + this.type + "']"
        },
        _bindToHub: function() {
            Hub.sub("server-pen-change", $.proxy(this._onServerPenChange, this))
        },
        _onServerPenChange: function(e, t) {
            ObjectUtil.hasNestedValue(t, "pen.resources") && this.controller.setPenValueFromServer(t)
        },
        _makeResourcesSortable: function() {
            var e = this;
            $("#" + this.type + "-external-resources").sortable({
                handle: ".move-external-url",
                axis: "y",
                update: function() {
                    e._updateResourcesOrder()
                }
            })
        },
        _updateResourcesOrder: function() {
            this._canDrive && this.controller.updateResourcesOrder(this.type, this._getViewIDsToOrders())
        },
        _getViewIDsToOrders: function() {
            return _.reduce(this._getInputsByType(), function(e, t, n) {
                return e[this._getElementViewID(t)] = n, e
            }, {}, this)
        },
        _getInputsByType: function() {
            return _.select($("#" + this.type + "-external-resources input"), function(e) {
                return $(e).attr("id")
            })
        },
        _onChangeResource: function(e) {
            this._canDrive && this.controller.setResource(this._getElementViewID(e.target), $(e.target).val())
        },
        _onAddResourceClick: function() {
            this._canDrive && this.controller.addEmptyResource(this.type)
        },
        _onQuickAddChange: function(e, t) {
            this._canDrive && this.controller.quickAddResource(this.type, t.val())
        },
        _onDeleteResource: function(e) {
            return e.preventDefault(), this._canDrive && this.controller.deleteResource(this._getElementViewID(e.target)), !1
        },
        _getElementViewID: function(e) {
            return $(e).attr("data-view-id")
        },
        _getAllUIElements: function() {
            return [$("#add-" + this.type + "-resource"), $("#" + this.type + "-quick-add"), $(this._getResourcesSelector())]
        }
    }),
    ResourcesView = Class.extend({
        $resources: null,
        $quickAdd: null,
        init: function(e) {
            this.type = e, this._initDOM(), this._bindToHub()
        },
        _initDOM: function() {
            this.$resources = $("#" + this.type + "-external-resources"), this.$quickAdd = $("#" + this.type + "-quick-add"), this._syncExternalInputs(CP.pen.getResourcesByType(this.type))
        },
        _bindToHub: function() {
            Hub.sub("pen-change", $.proxy(this._onPenChange, this))
        },
        _onPenChange: function(e, t) {
            ObjectUtil.hasNestedValue(t, "pen.resources") && this._syncExternalInputs(CP.pen.getResourcesByType(this.type))
        },
        _syncExternalInputs: function(e) {
            this._syncNumberOfDOMElementsWithResources(e), this._syncTheDOMValuesWithResources(e), this._bindInputsToTypeahead(), this._resetQuickAdd()
        },
        _syncNumberOfDOMElementsWithResources: function(e) {
            var t = this._getExistingExternalsDivs(),
                n = e.length - t.length;
            if (n > 0)
                for (; n--;) {
                    var s = e.length - 1 - n;
                    this._appendResourcesToUI(e[s], s)
                } else if (0 > n)
                    for (n = -1 * n; n--;) $(t.last()).remove()
        },
        _syncTheDOMValuesWithResources: function(e) {
            _.forEach(this._getExistingExternalsDivs(), function(t, n) {
                t = $(t);
                var s = e[n];
                if (s.view_id === t.attr("data-view-id")) {
                    var i = $("#external-resource-input-" + s.view_id);
                    s.url !== i.val() && i.val(s.url)
                } else t.replaceWith(this._divHTML(s)), this._needToRebindTypeahead = !0
            }, this)
        },
        _getExistingExternalsDivs: function() {
            return $("#" + this.type + "-external-resources > div")
        },
        _appendResourcesToUI: function(e, t) {
            this.$resources.append(this._divHTML(e, t)), this._needToRebindTypeahead = !0
        },
        _divHTML: function(e, t) {
            return _.template(this._getTemplate(), {
                url: e.url,
                view_id: e.view_id,
                placeholder: this._getPlaceholderForInput(e.resource_type, t)
            })
        },
        _template: "",
        _getTemplate: function() {
            return "" === this._template && (this._template = $("#" + this.type + "-external-resources-template").html()), this._template
        },
        _getPlaceholderForInput: function(e, t) {
            return t % 2 === 0 ? "css" === e ? "https://yourwebsite.com/style.css" : "https://yourwebsite.com/script.js" : "http://codepen.io/username/pen/aBcDef"
        },
        _resetQuickAdd: function() {
            this.$quickAdd.prop("selectedIndex", 0)
        },
        _boundInputs: {},
        _needToRebindTypeahead: !1,
        _bindInputsToTypeahead: function() {
            window.__mobile || this._needToRebindTypeahead && _.forEach(CP.pen.getResourcesByType(this.type), function(e) {
                this._boundInputs[e.view_id] || this._bindToTypeahead(e)
            }, this), this._needToRebindTypeahead = !1
        },
        _bindToTypeahead: function(e) {
            var t = $("#external-resource-input-" + e.view_id);
            t.typeahead("destroy"), t.typeahead(this._getTypeaheadConfiguration(), this._getTypeaheadDatasource()), t.on("typeahead:selected", function() {
                $(this).trigger("change")
            })
        },
        _getTypeaheadConfiguration: function() {
            return {
                hint: !0,
                minLength: 1,
                highlight: !0
            }
        },
        _getTypeaheadDatasource: function() {
            var e = this;
            return {
                name: this.type + "-resources",
                source: function(t, n) {
                    TypeaheadData.fetchDataSet(e.type, function(e) {
                        n(TypeaheadSource.sortedMatches(t, e))
                    })
                },
                templates: {
                    empty: function(t) {
                        return e._hideTypeahead(t.query) ? null : e._emptyTypeaheadTemplate()
                    },
                    suggestion: this.typeaheadTemplate
                }
            }
        },
        _hideTypeahead: function(e) {
            return _isValidURL(e) || this._inputShowsUserNoLongerNeedsTypeahead(e)
        },
        _inputShowsUserNoLongerNeedsTypeahead: function(e) {
            return (e || "").match(/^htt/i)
        },
        _emptyTypeaheadTemplate: function() {
            return ["<div class='empty-typeahead-message'>", "Your search didn't return any results. Please try a different keyword.", "</div>"].join("\n")
        },
        typeaheadTemplate: _.template("<p><%= name %><small><%= value %></small></p>")
    }),
    TypeaheadData = {
        CACHE_TIMEOUT: 4320,
        fetchDataSet: function(e, t) {
            CacheGet.findInLocalStorage({
                key: e + "-resources",
                url: this._getCDNDataURL(e),
                dataType: "json",
                expire: this.CACHE_TIMEOUT,
                cb: function(e) {
                    t(e)
                }
            })
        },
        _getCDNDataURL: function(e) {
            return "/assets/editor/other/cdn/cdn" + e + "_data.json"
        }
    },
    TypeaheadSource = {
        MAX_RESULTS: 50,
        sortedMatches: function(e, t) {
            return this._sort(e, this._findMatches(e.toLowerCase(), t)).splice(0, this.MAX_RESULTS)
        },
        _findMatches: function(e, t) {
            return _.filter(t, function(t) {
                return t.name.toLowerCase().indexOf(e) > -1 ? !0 : t.tokens.indexOf(e) > -1 ? !0 : !1
            })
        },
        _sort: function(e, t) {
            return t.sort(function(t, n) {
                var s = t.name.toLowerCase(),
                    i = n.name.toLowerCase();
                if (s === e && i !== e) return -1;
                if (s !== e && i === e) return 1;
                var o = t.name.indexOf(e),
                    r = n.name.indexOf(e);
                if (o > -1 && -1 === r) return -1;
                if (-1 === o && r > -1) return 1;
                if (o > -1 && r > -1) return s.length - e.length < i.length - e.length ? -1 : 1;
                var a = t.tokens.indexOf(e),
                    c = n.tokens.indexOf(e);
                return a > -1 && -1 === c ? -1 : -1 === a && c > -1 ? 1 : 0
            })
        }
    },
    SettingsController = Class.extend({
        popupName: "penSettings",
        init: function() {
            CP.SettingsEvents.init(this), this.model = CP.SettingsModel, this.model.init(this), CP.SettingsView.init(this.model)
        },
        syncWithServer: function(e) {
            this.model.syncWithServer(e)
        },
        toggleSettingsPane: function() {
            this.model.toggleSettingsPane()
        },
        hideSettingsPane: function() {
            this.model.hideSettingsPane()
        },
        selectSettingsTab: function(e) {
            this.model.selectSettingsTab(e)
        },
        settingsPaneVisible: function() {
            return this.model.settingsPaneVisible()
        }
    });
! function() {
    function e() {
        d._on("click", t, window), p._on("click", n, window, !0), b._on("click", n, window), $("#pen-settings-modal .tabs > nav a").unbind(), f._on("click", s, window), $("body")._on("click", i, window, !0), g._on("click", o, window)
    }

    function t(e, t) {
        CP.SettingsEvents._canDrive && (n(), h.selectSettingsTab(t.data("type")))
    }

    function n() {
        CP.SettingsEvents._canDrive && h.toggleSettingsPane()
    }

    function s(e) {
        if (CP.SettingsEvents._canDrive) {
            var t = $(e.target).data("type");
            t && h.selectSettingsTab(t)
        }
    }

    function i(e) {
        var t = v[0].contains(e.target);
        p.length & !t && (t = p[0].contains(e.target)), t || h.hideSettingsPane()
    }

    function o() {
        CP.SettingsEvents._canDrive && h.hideSettingsPane()
    }

    function r() {
        Hub.sub("key", l), Hub.sub("pen-saved", c), Hub.sub("server-ui-change", a), Hub.sub("popup-open", u)
    }

    function a(e, t) {
        (ObjectUtil.hasNestedValue(t, "ui.settings.pane") || ObjectUtil.hasNestedValue(t, "ui.settings.tab")) && h.syncWithServer(t)
    }

    function c() {
        h.hideSettingsPane()
    }

    function l(e, t) {
        "esc" === t.key && h.hideSettingsPane()
    }

    function u(e, t) {
        t !== h.popupName && h.hideSettingsPane()
    }
    var h, d = $("button.settings-nub"),
        p = $("#edit-settings"),
        f = $("#settings-tabs"),
        g = $("#close-settings"),
        m = $("#popup-overlay"),
        v = $("#pen-settings-modal"),
        b = $(".edit-details-reminder");
    CP.SettingsEvents = {}, _.extend(CP.SettingsEvents, EnableDisableDriver), CP.SettingsEvents._getAllUIElements = function() {
        return [d, p, f, m, g]
    }, CP.SettingsEvents.init = function(t) {
        h = t, this.bindToEnableDisableHubEvents(), e(), r()
    }
}(),
function() {
    function e() {
        Hub.pub("ui-change", CP.SettingsModel.getState())
    }

    function t(t) {
        CP.ui.settings.pane !== t && (CP.ui.settings.pane = t, e(), "open" === t && Hub.pub("popup-open", n.popupName))
    }
    var n;
    CP.SettingsModel = {
        init: function(e) {
            n = e
        },
        syncWithServer: function(t) {
            CP.ui.settings.tab = t.ui.settings.tab, CP.ui.settings.pane = t.ui.settings.pane, e()
        },
        toggleSettingsPane: function() {
            var e = this.settingsPaneVisible() ? "closed" : "open";
            t(e)
        },
        hideSettingsPane: function() {
            t("closed")
        },
        openSettingsPane: function() {
            t("open")
        },
        selectSettingsTab: function(t) {
            CP.ui.settings.tab = t, e()
        },
        getState: function() {
            return {
                ui: {
                    settings: {
                        pane: CP.ui.settings.pane,
                        tab: CP.ui.settings.tab
                    }
                }
            }
        },
        settingsPaneVisible: function() {
            return "open" === CP.ui.settings.pane
        }
    }
}(),
function() {
    "use strict";

    function e() {
        Hub.sub("ui-change", t)
    }

    function t(e, t) {
        ObjectUtil.hasNestedValue(t, "ui.settings.pane") && n(t.ui.settings.pane), ObjectUtil.hasNestedValue(t, "ui.settings.tab") && r(t.ui.settings)
    }

    function n(e) {
        "open" === e ? s() : i()
    }

    function s() {
        a || (c.addClass("open"), CP.showPopupOverlay(), o(), a = !0)
    }

    function i() {
        a && (c.removeClass("open"), CP.hidePopupOverlay(), a = !1)
    }

    function o() {
        window.__mobile || setTimeout(function() {
            h.focus()
        }, 500)
    }

    function r(e) {
        l.removeClass("active"), u.removeClass("active"), $("#settings-" + e.tab + "-tab").addClass("active"), $("#settings-" + e.tab).addClass("active")
    }
    var a = !1,
        c = $("#pen-settings-modal"),
        l = $("#settings-tabs a"),
        u = $("div.settings"),
        h = $("#pen-details-title");
    CP.SettingsView = {}, CP.SettingsView.init = function(n) {
        t(null, n.getState()), e()
    }
}();
var TagsController = Class.extend({
        init: function() {
            this.model = new TagsModel, this.events = new TagsEvents(this), this.view = new TagsView(this.model)
        },
        addNewTags: function(e) {
            this.model.addNewTags(e)
        },
        deleteTag: function(e) {
            this.model.deleteTag(e)
        }
    }),
    TagsEvents = Class.extend({
        $body: $("body"),
        $penTags: $("#pen-tags"),
        init: function(e) {
            this.controller = e, this._bindToDOM()
        },
        _bindToDOM: function() {
            this.$body.on("click", "#active-tags span span.tag-x", $.proxy(this._handleTagDelete, this)), this.$penTags._on("keyup", this._onTagChange, this)
        },
        _onTagChange: function() {
            this.controller.addNewTags(this.$penTags.val())
        },
        _handleTagDelete: function(e) {
            return e.preventDefault(), this.controller.deleteTag(this._getTagToDelete(e)), !1
        },
        _getTagToDelete: function(e) {
            var t = $(e.target);
            return $.trim(t.next().html())
        }
    }),
    TagsModel = Class.extend({
        init: function() {},
        getTags: function() {
            return CP.pen.getTags()
        },
        addNewTags: function(e) {
            CP.pen.setPenValue({
                origin: "client",
                pen: {
                    newTags: this._validNewTags(e)
                }
            })
        },
        _validNewTags: function(e) {
            return _.uniq(_.map(e.split(","), function(e) {
                return _stripHTMLTags($.trim(e).toLowerCase())
            }))
        },
        deleteTag: function(e) {
            CP.pen.setPenValue({
                origin: "client",
                pen: {
                    tags: this._tagsWithoutTag(e)
                }
            })
        },
        _tagsWithoutTag: function(e) {
            return _.without(CP.pen.tags, e)
        }
    }),
    TagsView = Class.extend({
        MAX_TAGS: 5,
        $activeTags: $("#active-tags"),
        $maxTagsLabel: $("#max-tags-label"),
        $penTags: $("#pen-tags"),
        init: function(e) {
            this.model = e, this._initiateView(), this._bindToHub()
        },
        _initiateView: function() {
            this._updateActiveTagsHTML(this.model.getTags())
        },
        _bindToHub: function() {
            Hub.sub("pen-change", $.proxy(this._onPenChange, this)), Hub.sub("pen-saved", $.proxy(this._onPenSaved, this))
        },
        _onPenSaved: function() {
            this.$penTags.val("")
        },
        _onPenChange: function(e, t) {
            "pen" in t && ("tags" in t.pen && this._updateActiveTagsHTML(this.model.getTags()), "newTags" in t.pen && this._updateActiveTagsHTML(this.model.getTags()))
        },
        _updateActiveTagsHTML: function(e) {
            this.$activeTags.html(this._getTagsHTML(e)), this._warnAboutTooManyTags(e)
        },
        _getTagsHTML: function(e) {
            for (var t = "", n = 0; n < e.length; n++) e[n] && (t += "<span class='tag'>", t += "<span class='tag-x' style='cursor:pointer;'>", t += "<span class='tag-x'>\xd7</span>&nbsp;", t += "<span class='tag-name'>" + e[n] + "</span> ", t += "</span> ", t += "</span>");
            return t
        },
        _warnAboutTooManyTags: function(e) {
            e.length >= this.MAX_TAGS ? this.$maxTagsLabel.addClass("at-capacity") : this.$maxTagsLabel.removeClass("at-capacity")
        }
    }),
    ShareGist = Class.extend({
        WAITING_MSG_TIMEOUT: 1e4,
        GIST_MSG_TIMEOUT: 7e3,
        init: function(e) {
            _.extend(this, AJAXUtil), this._shareView = e, this._bindToDOM()
        },
        _bindToDOM: function() {
            $("#share-gist")._on("click", $.proxy(this._createGist, this))
        },
        _createGist: function() {
            $.showMessage(Copy.waitingForGist, this.WAITING_MSG_TIMEOUT);
            var e = CP.profiled.base_url + "/share/gist.json";
            this.post(e, {
                data: JSON.stringify(CP.pen)
            }, this._doneCreateGist)
        },
        _doneCreateGist: function(e) {
            var t = _.template(Copy.gistCreated, {
                url: e.url
            });
            $.showMessage(t, this.GIST_MSG_TIMEOUT), window.open(e.url)
        }
    }),
    ShareSMS = Class.extend({
        $sendToPhone: $("#send-to-phone"),
        $sendToPhoneForm: $("#send-to-phone-form"),
        $sendButton: $("#sms-send-button"),
        $smsPhone: $("#sms-phone"),
        $errorMessage: $(".error-message"),
        $textsLeft: $("#texts-left"),
        init: function(e) {
            _.extend(this, AJAXUtil), this._shareView = e, this._bindToDOM(), this._loadSMSPhoneNumberFromCookie()
        },
        _bindToDOM: function() {
            this.$sendToPhoneForm._on("submit", this.sendSMS, this)
        },
        _loadSMSPhoneNumberFromCookie: function() {
            $.cookie("sms_phone_number") && this.$sendToPhone.val($.cookie("sms_phone_number"))
        },
        sendSMS: function() {
            this.$sendButton.prop("disabled", !0);
            var e = CP.profiled.base_url + "/share/sms/" + CP.pen.slug_hash,
                t = {
                    phone_number: this.$sendToPhone.val()
                };
            this.post(e, t, this._doneSendSMS, this._failedSendSMS)
        },
        _doneSendSMS: function(e) {
            this._clearSMSErrors(), this._setSMSPhoneNumberCookie(e), this.$sendButton.prop("disabled", !1), this.$textsLeft.html(e.sms_left), $.showMessage(_.template(Copy.smsSentTo, {
                phone_number: e.phone_number
            }), "slow")
        },
        _setSMSPhoneNumberCookie: function(e) {
            var t = {
                expires: 30,
                domain: window._getCPWildcardDomain(),
                path: "/"
            };
            $.cookie("sms_phone_number", e.phone_number, t)
        },
        _failedSendSMS: function(e) {
            this._clearSMSErrors(), this.$sendButton.prop("disabled", !1), this.$smsPhone.addClass("error"), this.$smsPhone.append(this._getErrorsHTML(e))
        },
        _getErrorsHTML: function(e) {
            var t = "";
            for (var n in e.errors) t += "<div class='error-message'>" + e.errors[n] + "</div>";
            return t
        },
        _clearSMSErrors: function() {
            this.$smsPhone.removeClass("error"), this.$errorMessage.remove()
        }
    }),
    ShareView = Class.extend({
        $downloadExportIFrame: null,
        init: function() {
            _.extend(this, AJAXUtil), this.shareSMS = new ShareSMS(this), this.shareGist = new ShareGist(this), this._bindToDOM(), this._bindToHub(), this._updateRoomLinks()
        },
        _bindToHub: function() {
            Hub.sub("pen-change", $.proxy(this._onPenChange, this))
        },
        _bindToDOM: function() {
            $("#share-zip").on("click", $.proxy(this._onShareZipClick, this))
        },
        _onPenChange: function(e, t) {
            ObjectUtil.hasNestedValue(t, "pen.private") && this._updateRoomLinks()
        },
        _updateRoomLinks: function() {
            $("#editor-link").attr("href", this._getViewURL("pen")), $("#details-link").attr("href", this._getViewURL("details")), $("#full-page-link").attr("href", this._getViewURL("full")), $("#full-page-url").val(URLBuilder.getShortViewURL("", CP.pen)), $("#live-view-link").attr("href", this._getViewURL("live")), $("#live-view-url").val(URLBuilder.getShortViewURL("v", CP.pen));
            var e = this._getViewURL("collab");
            $("#collab-view-link").attr("href", e), $("#collab-link").attr("href", e), $("#collab-view-url").val(URLBuilder.getShortViewURL("c", CP.pen));
            var t = this._getViewURL("professor");
            $("#professor-view-link").attr("href", t), $("#professor-link").attr("href", t), $("#professor-view-url").val(URLBuilder.getShortViewURL("p", CP.pen)), $("#share-zip").attr("href", this._getViewURL("share/zip"))
        },
        _onShareZipClick: function(e) {
            e.stopPropagation();
            var t = $(e.target).attr("href");
            return this.$downloadExportIFrame ? this.$downloadExportIFrame.attr("src", t) : this.$downloadExportIFrame = $("<iframe>", {
                id: "downloadExportIFrame",
                src: t
            }).hide().appendTo("body"), !1
        },
        _getViewURL: function(e) {
            return URLBuilder.getViewURL(e, CP.profiled, CP.pen, !1)
        }
    }),
    Copy = {
        autoSavingNow: "Autosave enabled. <a href='http://blog.codepen.io/documentation/editor/autosave/' target='_blank'>?</a>",
        penUpdated: "Pen saved.",
        penForked: "We forked this Pen. It's saved to your account, but you can <a href='<%= url %>' target='_blank'>view it here.</a>",
        waitingForGist: "Creating GitHub Gist. Please be patient and stay awesome.",
        gistCreated: "Thanks for staying awesome. <a href='<%= url %>' target='_blank'> Here's a link to your Gist.</a>",
        youHaveUnsavedChanges: "You have NOT saved your Pen. Stop and save if you want to keep your Pen.",
        collectionSavedPenAdded: "Your Collection '<%= name %>' was created and this Pen was added to it. <a href='<%= url %>'>View Collection</a>.",
        penAddToCollection: "This Pen was added to the '<%= name %>' collection. <a href='<%= url %>'>View collection</a>.",
        smsSentTo: "Text sent to phone <%= phone_number %>.",
        pauseAndPlay: "Pause and Play",
        catchUpToClass: "Catch Up to Class",
        studentWatching: "Student Watching",
        studentsWatching: "Students Watching",
        unsubcribedFromCommentNotifications: "You've been unsubscribed from comments for this Pen",
        subscribedToCommentNotifications: "You've been subscribed to comments for this Pen",
        deletingPen: "Deleting this Pen. Buckle up!",
        viewSource: "View Source",
        returnToSource: "Return to Source",
        errors: {
            "anon-cannot-save-empty-pen": "You cannot save an empty Pen. Make something&nbsp;beautiful.",
            "anon-cannot-save-during-rt-session": "Please login to save this Pen.",
            "unable-to-save-try-again": "Unable to save Pen. Trying again for the <%= time %> time. Please be patient.",
            "unable-to-save-ever": "Unable to save pen. Please contact support@codepen.io.",
            "disabled-cookies": "You will not be able to see live changes to a Pen while cookies are disabled",
            "pen-too-large": "This Pen is larger than the 1 megabyte limit. Try removing data from this Pen and trying again."
        }
    },
    CPFactory = {
        buildDataObjects: function() {
            CP.profiled = new Profiled, CP.user = new User, CP.pen = new Pen, CP.penSaver = new PenSaver, CP.penAutosave = new PenAutosave, CP.ui = UI.buildDefaultUIData()
        },
        buildEditorObjects: function(e) {
            CP.penErrorHandler = new PenErrorHandler, CP.penResources = new PenResources, CP.penProcessor = new PenProcessor, CP.penRenderer = new PenRenderer, CP.codeEditorAnalayze = new CodeEditorAnalyze, CP.htmlEditor = new HTMLEditor("html", CP.pen.html), CP.cssEditor = new CSSEditor("css", CP.pen.css), CP.jsEditor = new JSEditor("js", CP.pen.js), e || CP.ConsoleEditor.init(), this.buildCommonEditorSettingsObjects(), this._buildSettingsObjects()
        },
        buildCommonEditorSettingsObjects: function() {
            CP.shareView = new ShareView, CP.settingsController = new SettingsController, CP.penActions = new PenActions, CP.infoController = new InfoController, CP.tagsController = new TagsController
        },
        _buildSettingsObjects: function() {
            CP.htmlSettingsController = new HTMLSettingsController(CP.pen), CP.cssSettingsController = new CSSSettingsController(CP.pen), CP.jsSettingsController = new JSSettingsController(CP.pen), CP.behaviorController = new BehaviorController(CP.pen)
        },
        buildDesktopViewEditorObjects: function() {
            CP.codeEditorResizeController.init(), CP.codeEditorTidyController = new CodeEditorsTidyController, CP.codeEditorsCSSTransitionHandler = new CodeEditorsCSSTransitionHandler, CP.codeEditorsViewSourceController = new CodeEditorsViewSourceController, CP.keyBindings.init()
        }
    },
    HandleIFrameClicks = {
        init: function(e) {
            this.pen = e, this._bindToDOM()
        },
        _bindToDOM: function() {
            window.addEventListener ? window.addEventListener("message", $.proxy(this.handleIFrameClickEvent, this), !1) : window.attachEvent("onmessage", $.proxy(this.handleIFrameClickEvent, this))
        },
        handleIFrameClickEvent: function(e) {
            if (this._allowedToOpenWindows()) {
                var t = this._cleanURL(this._getURLFromEvent(e));
                t.match(/^https?:\/\/\S+$/) && window.open(t)
            }
        },
        _allowedToOpenWindows: function() {
            return this.pen.user_id > 1
        },
        _getURLFromEvent: function(e) {
            return "string" == typeof e.data ? e.data : ""
        },
        _cleanURL: function(e) {
            var t = this._getIFrameURLRemoved(e);
            return t = this._sanitizeURL(t), t = t.replace(/(java|vb)?script/gim, ""), t = t.replace(/eval/gim, ""), t = t.split("?")[0]
        },
        _getIFrameURLRemoved: function(e) {
            return e.replace(/http(s)?:\/\/(s\.)?codepen\.(dev|io)\/(boomerang\/\S+|\S+\/fullpage)\/\w+(\.html)?/m, "")
        },
        _sanitizeURL: function(e) {
            return e.replace(/[^-A-Za-z0-9+&@#/%?=~_|!:,.;\(\)]/, "")
        }
    },
    Loader = {
        loaded: [],
        files: {
            "analyze-js": "/assets/libs/jshint.js;/assets/editor/other/analyze.js",
            "analyze-html": "/assets/libs/html-inspector.js;/assets/editor/other/analyze.js",
            "analyze-css": "/assets/libs/csslint.js;/assets/editor/other/analyze.js",
            htmlparser: "/assets/libs/htmlparser.js",
            mode_text: "",
            mode_xml: "",
            mode_markdown: "/assets/libs/codemirror/mode/markdown/markdown.js",
            mode_haml: "/assets/libs/codemirror/mode/htmlmixed/htmlmixed.js;/assets/libs/codemirror/mode/ruby/ruby.js;/assets/libs/codemirror/mode/haml/haml.js",
            mode_python: "/assets/libs/codemirror/mode/python/python.js",
            "mode_application/x-slim": "/assets/libs/codemirror/mode/htmlmixed/htmlmixed.js;/assets/libs/codemirror/mode/ruby/ruby.js;/assets/libs/codemirror/mode/slim/slim.js",
            mode_jade: "/assets/libs/codemirror/mode/jade/jade.js",
            "mode_text/css": "",
            "mode_text/x-scss": "",
            "mode_text/x-less": "",
            "mode_text/x-sass": "/assets/libs/codemirror/mode/sass/sass.js",
            "mode_text/x-styl": "/assets/libs/codemirror/mode/stylus/stylus.js",
            "mode_text/javascript": "",
            "mode_text/x-coffeescript": "/assets/libs/codemirror/mode/coffeescript/coffeescript.js",
            "mode_text/x-livescript": "/assets/libs/codemirror/mode/livescript/livescript.js",
            "mode_text/typescript": "",
            mode_babel: ""
        },
        run: function(e, t) {
            if (this.loaded.indexOf(e) > -1) return t();
            var n = _.compact(this.files[e].split(";"));
            return this.loaded.push(e), this.loadJSLibraries(n, t)
        },
        loadJSLibraries: function(e, t) {
            if (!(e.length > 0)) return t();
            var n = e.shift(),
                s = this;
            _getCachedScript(n, function() {
                s.loadJSLibraries(e, t)
            })
        }
    },
    TimeUtil = {
        countToString: function(e) {
            var t = {
                1: "first",
                2: "second",
                3: "third",
                4: "fourth",
                5: "fifth"
            };
            return e in t ? t[e] : e
        }
    },
    TypesUtil = {
        _HTML_TYPES: ["html", "xml", "haml", "markdown", "slim", "jade", "application/x-slim"],
        _CSS_TYPES: ["css", "less", "scss", "sass", "stylus", "text/css", "text/x-sass", "text/x-scss", "text/x-less", "text/x-styl"],
        _JS_TYPES: ["javascript", "coffeescript", "livescript", "typescript", "text/javascript", "text/x-coffeescript", "text/x-livescript", "text/typescript"],
        cmModeToType: function(e) {
            var t = this._getSafeInputMode(e);
            return this._getType(t)
        },
        _getSafeInputMode: function(e) {
            var t = "string" == typeof e ? e : e.name;
            return t.toLowerCase()
        },
        syntaxToType: function(e) {
            return this._getType(e)
        },
        _getType: function(e) {
            return this._isHTMLType(e) ? "html" : this._isCSSType(e) ? "css" : this._isJSType(e) ? "js" : "unknown"
        },
        _isHTMLType: function(e) {
            return _.contains(this._HTML_TYPES, e)
        },
        _isCSSType: function(e) {
            return _.contains(this._CSS_TYPES, e)
        },
        _isJSType: function(e) {
            return _.contains(this._JS_TYPES, e)
        }
    };
NastyBrowserSniffing.ie() < 10 && (window.location = "/unsupported/"),
    function() {
        function e() {
            tt = $(window), nt = $("body"), I = $("#result_div"), R = $("#resizer"), O = $("#editor-drag-cover"), U = $("#width-readout"), F = $(".boxes"), H = $(".top-boxes"), V = $(".output-sizer"), k = $(".box-console"), j = k.find(".close-editor-button"), N = $(".console-toggle-button")
        }

        function t() {
            tt.on("resize", s);
            var e = new BarDragger(R[0]);
            e.on("pointerDown", p), e.on("pointerUp", f), e.on("dragStart", g), e.on("dragMove", C), e.on("dragEnd", P), n($(".editor-resizer-console")[0]), n($(".box-console .powers")[0]), N.on("click", i), j.on("click", o)
        }

        function n(e) {
            if (e) {
                var t = new BarDragger(e);
                t.on("pointerDown", p), t.on("pointerUp", f), t.on("dragStart", w), t.on("dragMove", E), t.on("dragEnd", A), t.on("doubleClick", M)
            }
        }

        function s() {
            L()
        }

        function i(e) {
            e.preventDefault(), CP.EditorLayout.toggleConsole()
        }

        function o(e) {
            e.preventDefault(), CP.EditorLayout.closeConsole()
        }

        function r() {
            Hub.sub("ui-change", a)
        }

        function a(e, t) {
            var n = t.ui && t.ui.editorSizes && t.ui.editorSizes.console;
            void 0 !== n && c(n)
        }

        function c(e) {
            if ("closed" === e) return void u();
            l();
            var t = q / X,
                n = e * (1 - t) + t;
            k.height(100 * n + "%"), rt = e
        }

        function l() {
            it || (Hub.pub("console-opened"), k.show(), b(), it = !0)
        }

        function u() {
            it && (Hub.pub("console-closed"), k.hide(), it = !1)
        }

        function h(e) {
            Hub.pub("editor-sizes-change", {
                console: e
            })
        }

        function d() {
            var e = CP.ui.editorSizes.console;
            "closed" !== e && (l(), c(e))
        }

        function p() {
            O.show()
        }

        function f() {
            O.hide()
        }

        function g() {
            var e = "top" === CP.ui.layout ? m : v;
            e.apply(this, arguments)
        }

        function m() {
            W = H.height(), B = F.height(), z = R.outerHeight(), it && b()
        }

        function v() {
            G = H.width(), J = F.width(), Q = R.outerWidth()
        }

        function b() {
            X = et = V.height(), Y = k.height(), Z = W = H.height(), K = Y, q || (q = k.find(".editor-resizer").outerHeight() + k.find(".powers").outerHeight())
        }

        function C() {
            var e = "top" === CP.ui.layout ? T : S;
            e.apply(this, arguments)
        }

        function T(e, t, n) {
            var s = W + n.y;
            s = Math.max(0, s);
            var i = B - z;
            i -= it ? q : 0, s = Math.min(i, s), H.height(s), X = B - s - z, y()
        }

        function y() {
            if (it) {
                var e = (Y - q) / (X - q);
                e = Math.min(1, e), Y = Math.min(X, Y), c(e)
            }
        }

        function S(e, t, n) {
            var s = n.x * ("right" === CP.ui.layout ? -1 : 1),
                i = G + s;
            i = Math.max(0, i);
            var o = J - Q;
            i = Math.min(o, i), H.width(i), L()
        }

        function P() {
            "function" == typeof Comment.tweakCommentsSize && Comment.tweakCommentsSize(), Hub.pub("editor-refresh", {
                delay: 0
            }), it && Hub.pub("editor-sizes-change", {
                console: rt
            })
        }

        function w() {
            CP.EditorLayout._canDrive && b()
        }

        function E(e, t, n) {
            if (CP.EditorLayout._canDrive) {
                var s = K - n.y;
                s = Math.max(q, s), s = Math.min(X, s);
                var i = X - q,
                    o = (s - q) / i;
                c(o), x(n)
            }
        }

        function x(e) {
            if ("top" === CP.ui.layout) {
                var t = et + e.y - Y;
                t >= 0 || (Z = Math.min(W + t, Z), H.height(Z), X = Math.max(X, et - t))
            }
        }

        function A() {
            CP.EditorLayout._canDrive && Hub.pub("editor-sizes-change", {
                console: rt
            })
        }

        function M() {
            if (CP.EditorLayout._canDrive) {
                var e = 1 === rt ? ot : 1;
                h(e)
            }
        }

        function L() {
            clearTimeout(st), U.addClass("visible"), U.text(I.width() + "px"), st = setTimeout(function() {
                U.removeClass("visible")
            }, 1e3)
        }

        function D() {
            if ("top" === CP.ui.layout) {
                var e = navigator.userAgent.match(/(iPad)/g) ? !0 : !1;
                e && $("head").append("<meta name='viewport' content='width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no'>")
            }
        }
        CP.EditorLayout = {};
        var I, R, O, U, F, H, k, V, j, N, B, z, W, J, Q, G, X, K, Y, q, Z, et, tt = $(window),
            nt = $("body"),
            st = 0,
            it = !1,
            ot = 1 / 3,
            rt = ot;
        CP.EditorLayout.init = function() {
            e(), t(), r(), this.bindToEnableDisableHubEvents(), d(), D()
        }, CP.EditorLayout.setConsoleSize = c, CP.EditorLayout.openConsole = function() {
            h(rt)
        }, CP.EditorLayout.closeConsole = function() {
            h("closed")
        }, CP.EditorLayout.toggleConsole = function() {
            "closed" === CP.ui.editorSizes.console ? (Hub.pub("ui-console-opened"), this.openConsole()) : this.closeConsole()
        }, CP.EditorLayout.doneLoading = function() {
            nt.removeClass("prelayout"), tt.load(function() {
                nt.removeClass("preload")
            })
        }, _.extend(CP.EditorLayout, EnableDisableDriver), CP.EditorLayout._getAllUIElements = function() {
            return [j, N]
        }
    }();
var ViewSwitcher = {
    TYPES: ["top", "left", "right"],
    $body: $("body"),
    $viewSwitcher: $(".view-switcher"),
    $mainHeader: $("#main-header"),
    init: function() {
        this._bindToDOM(), this._bindToHub()
    },
    _bindToDOM: function() {
        this.$viewSwitcher.length && (this.$viewSwitcher.find(".pres-link:not('.upsell')")._on("click", this.slideHeaderAway, this, !0), this.$viewSwitcher.find(".learn-more")._on("click", this.openLearnMoreLink, this)), $("[data-layout-type]")._on("click", this.onLayoutTypeButtonClick, this)
    },
    slideHeaderAway: function() {
        this.$viewSwitcher.removeClass("open"), this.$mainHeader.addClass("up-and-away")
    },
    openLearnMoreLink: function(e, t) {
        window.open(t.data("href"), "_blank")
    },
    onLayoutTypeButtonClick: function(e) {
        var t = $(e.currentTarget),
            n = t.attr("data-layout-type");
        this.changeLayout(n), ga("set", "dimension3", n), ga("send", "event", {
            eventCategory: "Layout Type",
            eventAction: "Change",
            eventLabel: n
        })
    },
    _bindToHub: function() {
        Hub.sub("server-ui-change", $.proxy(this._onServerUIChange, this))
    },
    _onServerUIChange: function(e, t) {
        t.ui && t.ui.layout && this.changeUILayout(t.ui.layout)
    },
    changeLayout: function(e) {
        this.changeUILayout(e), $.cookie("__cp_layout", e, {
            expires: 30,
            path: "/"
        })
    },
    changeUILayout: function(e) {
        this.getIsValidLayoutType(e), this.$body.removeClass("layout-" + CP.ui.layout);
        var t = "left" === e || "right" === e;
        this.$body[t ? "addClass" : "removeClass"]("layout-side"), this.$body.addClass("layout-" + e), CP.ui.layout = e, Hub.pub("ui-change", {
            ui: {
                layout: e
            }
        }), Hub.pub("editor-refresh", {
            delay: 0
        })
    },
    getIsValidLayoutType: function(e) {
        var t = _.contains(this.TYPES, e);
        if (!t) throw "Invalid layout type: " + e;
        return t
    }
};
ViewSwitcher.init();
var Upsell = Class.extend({
        init: function() {
            this._bindToDOM()
        },
        _bindToDOM: function() {
            $(".upsell")._on("click", this.showDialog)
        },
        showDialog: function(e, t) {
            var n, s = $(t);
            n = s.hasClass(".upsell") ? s : s.closest(".upsell"), $.showModal(n.data("url"), "modal-pro")
        },
        showDialogFromURL: function(e) {
            $.showModal(e, "modal-pro")
        }
    }),
    Follow = {
        init: function() {
            _.extend(this, AJAXUtil), this.profiled = __profiled, this._bindToDOM()
        },
        _bindToDOM: function() {
            this._addOnHoverChangeToFollowButton(), $("#follow-this-user, #following-this-user")._on("click", this.followThisUser, this)
        },
        _addOnHoverChangeToFollowButton: function() {
            $("#following-this-user").hover(function() {
                $(this).addClass("red").data("text-value", $(this).html()).html("<svg class='icon-x'><use xlink:href='#x'></use></svg> Following")
            }, function() {
                $(this).removeClass("red").html($(this).data("text-value"))
            })
        },
        followThisUser: function() {
            var e = this._getActionTypeTaken();
            this._updateFollowButtonImmediately(e), this.post(this._getFollowUnfollowURL(e), {}, this._doneFollowThisUser)
        },
        _getActionTypeTaken: function() {
            return $("#follow-this-user").is(":visible") ? "follow" : "unfollow"
        },
        _getFollowUnfollowURL: function(e) {
            var t = "/follow/<%= type %>/<%= username %>/<%= action %>";
            return _.template(t, {
                type: this.profiled.type,
                username: this.profiled.username,
                action: e
            })
        },
        _updateFollowButtonImmediately: function(e) {
            "follow" === e ? ($("#follow-this-user").hide(), $("#following-this-user").show()) : ($("#follow-this-user").show(), $("#following-this-user").hide())
        },
        _doneFollowThisUser: function(e) {
            $("#followers-tab").hasClass("active") && $("#followers").replaceWith(e.html)
        }
    },
    Drawer = {
        drawer: $("#drawer"),
        drawerOpen: !1,
        drawerHasBeenOpened: !1,
        popupName: "drawer",
        init: function() {
            this.bindUIEvents(), this.bindToHub()
        },
        bindUIEvents: function() {
            $("#view-details-button")._on("click", this.toggleDrawer, this), $("#drawer").on("click", "#drawer-close-button", this.closeDrawer), Keytrap.bind("esc", function() {
                Drawer.closeDrawer()
            })
        },
        bindToHub: function() {
            Hub.sub("key", $.proxy(this.onKey, this)), Hub.sub("popup-open", $.proxy(this.onPopupOpen, this))
        },
        toggleDrawer: function() {
            Drawer.drawerOpen ? Drawer.closeDrawer() : Drawer.drawerHasBeenOpened ? Drawer.openDrawer() : Drawer.setUpDrawer()
        },
        openDrawer: function() {
            Drawer.drawer.addClass("open"), Drawer.drawerOpen = !0, Drawer.drawerHasBeenOpened = !0, Hub.pub("popup-open", this.popupName)
        },
        closeDrawer: function() {
            Drawer.drawer.removeClass("open"), Drawer.drawerOpen = !1
        },
        setUpDrawer: function() {
            Drawer.drawerHasBeenOpened = !0;
            var e = window.location.href,
                t = e.replace("/pen/", "/drawer/");
            $.when($.get(t, function(e) {
                Drawer.drawerContent = e
            }), $.ajax({
                url: "/assets/details/drawer.css",
                cache: !1,
                success: function(e) {
                    $("<style></style>").appendTo("head").html(e)
                }
            }), $.getScript("/assets/details/comment.js")).then(function() {
                Drawer.drawer.append(Drawer.drawerContent), Comment.init(), Follow.init(), Drawer.openDrawer()
            })
        },
        onKey: function(e, t) {
            "esc" === t.key && this.closeDrawer()
        },
        onPopupOpen: function(e, t) {
            t !== this.popupName && this.closeDrawer()
        }
    };
Drawer.init(),
    function() {
        function e() {
            h.on("click", t), $("#popup-overlay").on("click", r)
        }

        function t(e) {
            e.preventDefault(), p ? (n(), o()) : s()
        }

        function n() {
            Hub.pub("embed-reshown", {})
        }

        function s() {
            if (!f) {
                var e = _.template("<%= username %>/embed/mini/builder/<%= slugHash %>/", {
                    username: CP.profiled.base_url,
                    slugHash: CP.pen.getActiveSlugHash()
                });
                $.when(AJAXUtil.get(e, {}, $.noop), $.ajax({
                    url: "/assets/embed/embed-modal.css",
                    cache: !1
                })).done(i).fail(AJAXUtil.showStandardErrorMessage).always(function() {
                    f = !1
                }), f = !0
            }
        }

        function i(e, t) {
            l = $("<div />", {
                id: "embed-modal",
                "class": "modal embed-modal loading",
                html: e[0].html
            }), l.appendTo(u), $("<style></style>").html(t[0]).appendTo("head"), $.getScript("/assets/embed/modal/embed_modal.js"), $("#embed-modal-close-button").on("click", r), Keytrap.bind("esc", r), p = !0, o()
        }

        function o() {
            d || (l.addClass("open"), CP.showPopupOverlay(), d = !0, Hub.pub("popup-open", g))
        }

        function r() {
            d && (l && l.removeClass("open"), CP.hidePopupOverlay(), d = !1)
        }

        function a() {
            Hub.sub("popup-open", c)
        }

        function c(e, t) {
            t !== g && r()
        }
        CP.EmbedModal = {};
        var l, u = $("body"),
            h = $(".embed-builder-button"),
            d = !1,
            p = !1,
            f = !1,
            g = "embedModal";
        CP.EmbedModal.init = function() {
            e(), a()
        }, CP.EmbedModal.init()
    }();
var LiveRoom = Class.extend({
    WAIT_TO_RUN_FIRST_LIVE_UPDATE: 1e3,
    liveListeners: !1,
    init: function(e, t) {
        this.rtClient = e, this.rtData = t, _.extend(this, AJAXUtil), this._shouldJoinRoom(t) && this.rtClient.connect(t, $.proxy(this._onConnect, this), _.noop)
    },
    _shouldJoinRoom: function(e) {
        return "editor" === e.role && e.pen.slugHash
    },
    _onConnect: function() {
        this._subscribeToLocalEvents(), this._subscribeToServerEvents(), this._publishFirstLiveUpdate(), this._publishRegisterWithLiveRoomPublisher()
    },
    _subscribeToLocalEvents: function() {
        Hub.sub("live_change", $.proxy(this._publishLiveUpdate, this))
    },
    _subscribeToServerEvents: function() {
        this.rtClient.subscribe("publishToNewClients", this.rtData, $.proxy(this._publishToNewClients, this), !0)
    },
    _publishToNewClients: function() {
        this.liveListeners = !0;
        var e = this;
        setTimeout(function() {
            e._publishFirstLiveUpdate()
        }, e.WAIT_TO_RUN_FIRST_LIVE_UPDATE)
    },
    _publishFirstLiveUpdate: function() {
        this._publishLiveUpdate(null, CP.penRenderer.getLastRenderableHash())
    },
    _publishRegisterWithLiveRoomPublisher: function() {
        this.rtClient.publish("registerWithLiveRoomPublisher", this.rtData, this.data)
    },
    _publishLiveUpdate: function(e, t) {
        this.liveListeners && this.rtClient.publish("liveUpdate", this.rtData, {
            pen: t
        })
    }
});
$.event.props.push("dataTransfer");
var Assets = {
        s: {
            assetsArea: $("#assets-area"),
            manualInput: $("#manual-file-upload"),
            dragPrevent: !1,
            files: []
        },
        _bindToDragAndDrop: function() {
            var e, t = this;
            this.s.assetsArea._on("dragenter dragover", function(n) {
                clearTimeout(e), !t.s.dragPrevent && t._testIfContainsFiles(n) && t.makeLookDroppable()
            }), this.s.assetsArea._on("dragleave dragout", function() {
                e = setTimeout(function() {
                    t.unmakeLookDroppable()
                }, 200)
            }), this.s.assetsArea._on("drop", function(e) {
                e.preventDefault(), t._testIfContainsFiles(e) && t.handleFileDrop(e)
            }), this.s.manualInput._on("change", this.handleFileSelect, this)
        },
        _testIfContainsFiles: function(e) {
            return e.dataTransfer.types ? _.contains(e.dataTransfer.types, "Files") : !1
        },
        makeLookDroppable: function() {
            this.s.assetsArea.addClass("draggedOn")
        },
        unmakeLookDroppable: function() {
            this.s.assetsArea.removeClass("draggedOn")
        },
        handleFileDrop: function(e) {
            this.processFile(e.dataTransfer.files), this.unmakeLookDroppable()
        },
        handleFileSelect: function(e) {
            this.processFile(e.target.files)
        },
        MAX_FILES: 10,
        MAX_FILE_SIZE: 2097152,
        processFile: function(e) {
            this.numFiles = e.length, this.errors = [], e.length > this.MAX_FILES ? this._showTooManyFilesMessage() : this._filesTooBig(e) ? this._showFileTooBigMessage() : this._filesHaveBadFileExtension(e) ? this._showBadFileExtensionMessage() : AssetsData.anyDuplicates(e) ? this._askUserIfTheyWantToOverwriteFiles(e, __assets) : this._signAssetsAndUpload(e, __assets, !1)
        },
        _askUserIfTheyWantToOverwriteFiles: function(e, t) {
            var n = this;
            $.showModal("/ajax/assets/overwrite_or_update_assets", "modal-error", function() {
                n._updateFilesToBeOverwrittenModal(e), $("#confirm-overwrite")._on("click", function() {
                    n._onConfirmOverwrite(e, t)
                }), $("#confirm-create-new")._on("click", function() {
                    n._onConfirmCreateNew(e, t)
                })
            })
        },
        _updateFilesToBeOverwrittenModal: function(e) {
            var t = AssetsData.duplicateNames(e),
                n = this._filesToBeOverwrittenHTML(t);
            $("#list-of-files").html(n)
        },
        _filesToBeOverwrittenHTML: function(e) {
            var t = "";
            return _.forEach(e, function(e) {
                t += "<p>" + e + "</p>"
            }), t
        },
        _onConfirmOverwrite: function(e, t) {
            $.hideMessage(), this._signAssetsAndUpload(e, t, !0)
        },
        _onConfirmCreateNew: function(e, t) {
            $.hideMessage(), this._signAssetsAndUpload(e, t, !1)
        },
        _signAssetsAndUpload: function(e, t, n) {
            $("#assets-wrap .uploading-message").addClass("active");
            for (var s = 0; s < this.numFiles; s++) {
                var i = FileUtil.makeNameSafeToSave(e[s].name);
                if (this.s.files[i] = e[s], n) {
                    var o = AssetsData.findAssetByName(e[s].name);
                    e[s].id = o ? o.id : 0
                }
                AssetsSign.signAsset(e[s], $.proxy(this._uploadComplete, this), $.proxy(this._assetUploadFailed, this))
            }
        },
        _filesTooBig: function(e) {
            var t = this;
            return _.some(e, function(e) {
                return e.size > t.MAX_FILE_SIZE
            })
        },
        _filesHaveBadFileExtension: function(e) {
            return _.some(e, function(e) {
                return e.name.match(/^.+\.(exe)$/) ? !0 : e.name.match(/^.+\..+$/) ? !1 : !0
            })
        },
        _showTooManyFilesMessage: function() {
            $.showModal("/ajax/assets/too_many_files", "modal-error")
        },
        _showFileTooBigMessage: function() {
            $.showModal("/ajax/assets/file_too_big", "modal-error")
        },
        _showBadFileExtensionMessage: function() {
            $.showModal("/ajax/assets/bad_extension", "modal-error")
        },
        _assetUploadFailed: function(e) {
            this._decrementFileCount(), this.deleteFileAjax(e.rslt.id);
            var t = /<Code>(.+)<\/Code>/i.exec(e.responseText)[1];
            this.errors.push({
                code: t,
                file: e.rslt.base_name
            }), 0 === this.numFiles && this.uploadFinalize()
        },
        uploadFinalize: function() {
            if (this.errors.length > 0) {
                var e = "/ajax/assets/upload_errors?errors=" + JSON.stringify(this.errors);
                $.showModal(e, "modal-error")
            }
        },
        deleteFileAjax: function(e) {
            this.del("/static/assets/" + e, {}, this.doneDeleteFileAjax)
        },
        _decrementFileCount: function() {
            --this.numFiles
        }
    },
    AssetsSign = {
        init: function() {
            _.extend(this, AJAXUtil)
        },
        signAsset: function(e, t, n) {
            var s = this._buildParams(e);
            this.post("/static/sign_asset", s, function(s) {
                AssetsSign.doneSign(s, e, t, n)
            })
        },
        _buildParams: function(e) {
            var t = e.id ? e.id : 0;
            return {
                id: t,
                contentType: e.type,
                fileName: FileUtil.makeNameSafeToSave(e.name),
                fileKB: FileUtil.fileSizeInKb(e),
                template: this._findTemplate()
            }
        },
        _findTemplate: function() {
            return "assets_fullpage" === __pageType ? "asset_fullpage" : "asset"
        },
        signProfileNew: function(e, t) {
            for (var n = {}, s = 0; s < e.length; s++)
                if ("string" == typeof e[s].data) {
                    var i = AssetsSign.dataURItoBlob(e[s].data),
                        o = Math.round(i.size / 1e3);
                    0 === o && (o = 1), e[s] = {
                        dimension: e[s].dimension,
                        size: o,
                        data: i
                    }, n["sizes[" + e[s].dimension + "]"] = o
                }
            this.post("/static/sign_profile/" + t, n, function(t) {
                AssetsSign.doneSignProfile(t, e)
            })
        },
        doneSignProfile: function(e, t) {
            for (var n = 0; n < t.length; n++) AssetsSign.doneSign(e[t[n].dimension], t[n].data, AssetsSign.profileReallyDone)
        },
        profileReallyDone: function() {},
        dataURItoBlob: function(e) {
            for (var t = atob(e.split(",")[1]), n = new ArrayBuffer(t.length), s = new Uint8Array(n), i = 0; i < t.length; i++) s[i] = t.charCodeAt(i);
            return new Blob([n], {
                type: "image/jpeg"
            })
        },
        doneSign: function(e, t, n, s) {
            var i = AssetsSign.getXHRObject(e, n, s),
                o = new FormData;
            for (var r in e.form_data) o.append(r, e.form_data[r]);
            o.append("file", t), i.open("POST", e.url, !0), i.send(o)
        },
        getXHRObject: function(e, t, n) {
            var s = new XMLHttpRequest;
            return s.rslt = e, "withCredentials" in s || (s = null), s.onreadystatechange = function() {
                4 === s.readyState && (201 === s.status ? t(s.rslt) : "undefined" != typeof n && n(s))
            }, s
        }
    };
AssetsSign.init(), "undefined" == typeof window.Copy && (window.Copy = {}), _.extend(window.Copy, {
    assetRenamed: 'Asset "<%= name %>" renamed successfully!',
    assetUploaded: 'Asset "<%= name %>" uploaded successfully!'
});
var Asset = Class.extend({
        init: function(e) {
            _.extend(this, AJAXUtil), _.extend(this, e)
        },
        save: function(e) {
            var t = "/static/assets/update/" + this.id,
                n = {
                    content: e
                };
            this.post(t, n, this._doneSave)
        },
        _doneSave: function(e) {
            Hub.pub("asset-updated", e)
        },
        "delete": function(e) {
            var t = "/static/assets/" + this.id,
                n = this;
            this.del(t, {}, function(t) {
                n._doneDelete(t, e)
            })
        },
        _doneDelete: function(e, t) {
            Hub.pub("asset-deleted", e), "function" == typeof t && t(e)
        }
    }),
    AssetsData = {
        assets: {},
        selectedAsset: null,
        boundToHub: !1,
        init: function() {
            this._bindToHub(), this._buildAssetObjectsFromDBAssets()
        },
        _bindToHub: function() {
            this.boundToHub || (this.boundToHub = !0, Hub.sub("asset-added", $.proxy(this._onAssetAdded, this)), Hub.sub("asset-deleted", $.proxy(this._onAssetDeleted, this)), Hub.sub("asset-selected", $.proxy(this._onAssetSelected, this)), Hub.sub("asset-deselected", $.proxy(this._onAssetDeselected, this)))
        },
        _onAssetAdded: function(e, t) {
            this.add(t.asset)
        },
        _onAssetSelected: function(e, t) {
            this.selectedAsset = this.find(t.id)
        },
        _onAssetDeleted: function(e, t) {
            this.del(t.id), this.selectedAsset = null
        },
        _onAssetDeselected: function() {
            this.selectedAsset = null
        },
        getSelectedAsset: function() {
            return this.selectedAsset
        },
        _buildAssetObjectsFromDBAssets: function() {
            var e = this;
            _.forEach(__assets, function(t) {
                e.assets[t.id] = new Asset(t)
            })
        },
        find: function(e) {
            return this.assets[e]
        },
        add: function(e) {
            __assets[e.id] = e, this.assets[e.id] = new Asset(e)
        },
        del: function(e) {
            delete __assets[e], delete this.assets[e]
        },
        anyDuplicates: function(e) {
            return this.duplicateNames(e).length > 0
        },
        duplicateNames: function(e) {
            var t = this._safeNames(this.assets),
                n = this._safeNames(e);
            return _.intersection(t, n)
        },
        _safeNames: function(e) {
            return _.map(e, function(e) {
                return FileUtil.makeNameSafeToSave(e.name)
            })
        },
        findAssetByName: function(e) {
            return _.find(this.assets, function(t) {
                return t.name === FileUtil.makeNameSafeToSave(e)
            })
        },
        buildUniqueName: function(e) {
            for (var t = e, n = this.findAssetByName(t); n;) t = this._addUnderscoreOneToExistingName(t), n = this.findAssetByName(t);
            return t
        },
        _addUnderscoreOneToExistingName: function(e) {
            var t = e.split("."),
                n = t.pop();
            return t.join(".") + "_copy." + n
        }
    },
    FileUtil = {
        makeNameSafeToSave: function(e) {
            return e.split(" ").join("_")
        },
        fileSizeInKb: function(e) {
            var t = Math.round(e.size / 1e3);
            return t = 0 === t ? 1 : t
        }
    },
    SearchFilter = {
        searchField: $("#assets-search"),
        init: function() {
            this._bindToDOM()
        },
        _bindToDOM: function() {
            this.searchField._on("keyup click search", this._onSearchChange, this, !0)
        },
        _onSearchChange: function(e, t) {
            $(".single-asset").hide(), $(".single-asset .file-name:contains('" + t.val() + "')").closest(".single-asset").show()
        }
    },
    MinipageAssets = {
        openingLock: !1,
        assetsWrap: $("#assets-wrap"),
        allFiles: $("#assets-all-files"),
        assetsLink: $("#assets-link"),
        popupName: "assets",
        init: function() {
            this.user = __user, this.pageType = "assets_mini", _.extend(this, AJAXUtil), _.extend(this, AssetsSign), _.extend(this, Assets), SearchFilter.init(), this._bindToDOM(), this._bindToHub(), this._bindToDragAndDrop()
        },
        _bindToHub: function() {
            Hub.sub("asset-added", $.proxy(this._onAssetAdded, this)), Hub.sub("key", $.proxy(this._onKey, this)), Hub.sub("popup-open", $.proxy(this._onPopupOpen, this))
        },
        _bindToDOM: function() {
            var e = this;
            this.assetsLink._on("click", this._toggleMiniAssetsView, this), $("#assets-area-close-button")._on("click", this._closeAssetsArea, this), this.allFiles.on("click", ".single-asset", function(t) {
                e._selectAssetInMiniView(t, this)
            }), this.allFiles.on("mouseleave mouseout", ".file-input", this._hideFilePathOnMouseOut), this.allFiles.on("click", ".file-delete", function(t) {
                e.deleteFile(t, this)
            })
        },
        _toggleMiniAssetsView: function() {
            this._isMiniAssetsViewOpen() ? this._closeAssetsArea() : (this._openAssetsArea(), ga("send", "event", {
                eventCategory: "Mini Assets",
                eventAction: "Opened Pane"
            }))
        },
        _isMiniAssetsViewOpen: function() {
            return this.assetsWrap.hasClass("open")
        },
        _closeAssetsArea: function() {
            this.assetsWrap.removeClass("open"), setTimeout(function() {
                MinipageAssets.assetsWrap.hide()
            }, 301)
        },
        _openAssetsArea: function() {
            var e = this;
            this.openingLock = !0, this._getAssets(), this.assetsWrap.show(), setTimeout(function() {
                e.assetsWrap.addClass("open")
            }, 10), setTimeout(function() {
                e.openingLock = !1
            }, 1e3), Hub.pub("popup-open", this.popupName)
        },
        _getAssets: function() {
            this.post("/static/assets", {}, this._doneGetAssets)
        },
        _doneGetAssets: function(e) {
            window.__assets = e.assets, AssetsData.init(), $("#assets-all-files").html(e.asset_list), $("#progress").replaceWith(e.progress_markup)
        },
        _onKey: function(e, t) {
            "esc" === t.key && this._closeAssetsArea()
        },
        _onPopupOpen: function(e, t) {
            t !== this.popupName && this._closeAssetsArea()
        },
        _selectAssetInMiniView: function(e, t) {
            e.preventDefault(), this._showFilePath(e, t), this.s.dragPrevent = !0;
            var n = $(e.target),
                s = this.user.current_team_id > 0 ? "t-" + this.user.id : this.user.id,
                i = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/" + s + "/" + n.data("file-name");
            n.val(i), ga("send", "event", {
                eventCategory: "Mini Assets",
                eventAction: "Selected Asset",
                eventLabel: n.data("file-name")
            })
        },
        _showFilePath: function(e, t) {
            var n = $(t).find(".file-input");
            "none" === n.css("display") ? n.show().select() : setTimeout(function() {
                n.select()
            }, 40)
        },
        _hideFilePathOnMouseOut: function() {
            var e = this;
            setTimeout(function() {
                $(e).hide(), MinipageAssets.s.dragPrevent = !1
            }, 300)
        },
        deleteFile: function(e, t) {
            e.preventDefault();
            var n = this,
                s = $(t).data("asset-id");
            $.showModal("/ajax/assets/confirm_asset_delete", "modal-warning", function() {
                n._doneConfirmDeleteAsset(s)
            })
        },
        _doneConfirmDeleteAsset: function(e) {
            $("#confirm-delete")._on("click", function() {
                this.finishDeletingAsset(e)
            }, this)
        },
        finishDeletingAsset: function(e) {
            $.hideMessage(), this.deleteFileAjax(e), ga("send", "event", {
                eventCategory: "Mini Assets",
                eventAction: "Deleted Asset"
            })
        },
        _uploadComplete: function(e) {
            $("#assets-wrap .uploading-message").removeClass("active"), this._decrementFileCount(), Hub.pub("asset-added", e), ga("send", "event", {
                eventCategory: "Mini Assets",
                eventAction: "Asset Uploaded"
            })
        },
        _onAssetAdded: function(e, t) {
            $("#progress").replaceWith(t.progress_markup), this._addNewAssetHTML(t), this._resetFileInput($("#manual-file-upload"))
        },
        _addNewAssetHTML: function(e) {
            var t, n = this;
            this._assetElExist(e) ? $("#asset-" + e.asset.id).slideUp(function() {
                $("#asset-" + e.asset.id).remove(), t = $(e.markup), t.addClass("newly-added"), n._addAssetToCategory(t, e.asset.category), setTimeout(function() {
                    t.removeClass("newly-added")
                }, 50)
            }) : (t = $(e.markup), t.addClass("newly-added"), n._addAssetToCategory(t, e.asset.category), setTimeout(function() {
                t.removeClass("newly-added")
            }, 50))
        },
        _assetElExist: function(e) {
            return $("#asset-" + e.asset.id).length > 0
        },
        _addAssetToCategory: function(e, t) {
            e.prependTo("#file-list-" + t), $("#file-list-" + t).find(".no-files").remove()
        },
        _resetFileInput: function(e) {
            e.wrap("<form />").closest("form").get(0).reset(), e.unwrap()
        },
        doneDeleteFileAjax: function(e) {
            AssetsData.del(e.id), this._removeListItem(e.id)
        },
        _removeListItem: function(e) {
            var t = $("#asset-" + e);
            0 === t.siblings().length && t.parent().append("<li class='no-files'>There are no files of this type&nbsp;yet.</li>"), t.addClass("deleting").slideUp(250, function() {
                t.remove()
            })
        }
    };
MinipageAssets.init();
var TeamRoomNotifications = Class.extend({
    init: function(e, t) {
        this.rtClient = e, this.rtData = t, this.user = __user, this._debouncedCanCollabOnTeam = _.debounce(this._showCanCollabOnTeamPenMessage, 2500), this._shouldJoinRoom(t) && this.rtClient.connect(t, $.proxy(this._onConnect, this), _.noop)
    },
    _shouldJoinRoom: function(e) {
        return "editor" === e.role && e.pen.slugHash && this.user.current_team_id > 0
    },
    _onConnect: function() {
        this._subscribeToServerEvents(), this._publishCanCollabOnTeamPen()
    },
    _subscribeToServerEvents: function() {
        this.rtClient.subscribe("can-collab-on-team-pen", this.rtData, $.proxy(this._onCanCollabOnTeamPen, this), !0)
    },
    _onCanCollabOnTeamPen: function(e) {
        this.user.id !== e.data.user.id && this._debouncedCanCollabOnTeam(e)
    },
    _showCanCollabOnTeamPenMessage: function(e) {
        var t = "<%= name %> is also working on this pen. Try Collab Mode with your team member <a href='<%= url %>' target='_blank'>here</a>.",
            n = document.location.href.replace(/\/pen\//, "/collab/"),
            s = _.template(t, {
                name: e.data.user.name,
                url: n
            });
        $.showMessage(s, "slow")
    },
    _publishCanCollabOnTeamPen: function() {
        this.rtClient.publish("can-collab-on-team-pen", this.rtData, {
            user: this.user
        })
    }
});
"undefined" == typeof window.Copy && (window.Copy = {}), _.extend(window.Copy, {
        penRemovedFromCollection: "Pen removed from Collection.",
        collectionSavedPenAdded: "Your collection '<%= name %>' was created and this pen was added to it. <a href='<%= url %>'>View collection</a>.",
        collectionCreated: "Your collection '<%= name %>' was created. <a href='<%= url %>'>View collection</a>.",
        collectionUpdated: "Your collection '<%= name %>' has been updated.",
        penAddToCollection: "This pen was added to the '<%= name %>' collection. <a href='<%= url %>'>View collection</a>.",
        collectionDeleted: "Your collection was deleted!"
    }),
    function() {
        function e() {
            $("body").on("change", ".collection-choice", t)
        }

        function t(e) {
            var t = s(e); - 1 === [c, l].indexOf(t) && a(t, i(e))
        }

        function n(e) {
            $.showMessage(r(e), "slow"), $(".collections-mini-modal").remove(), h.val(l)
        }

        function s(e) {
            return $(e.target).find("option:selected").val()
        }

        function i(e) {
            return "pen" === u ? CP.pen.slug_hash : $(e.target).closest(".single-pen").data("slug-hash")
        }

        function o(e, t) {
            return "/collections/add/" + e + "/" + t
        }

        function r(e) {
            var t = e.collection.slug_hash;
            return e.collection.private && (t = e.collection.slug_hash_private), _.template(Copy.penAddToCollection, {
                name: e.collection.name,
                url: "/collection/" + t
            })
        }

        function a(e, t) {
            AJAXUtil.post(o(e, t), {}, n)
        }
        CP.collectionAddPen = {};
        var c = "__add__",
            l = "__choose__",
            u = window.__pageType,
            h = $("#collection-choice");
        CP.collectionAddPen.init = function() {
            e()
        }
    }(),
    function() {
        function e(e, t) {
            AJAXUtil.put("/collections/" + e.slug_hash, e, t)
        }

        function t(e, t) {
            AJAXUtil.post("/collections", e, t)
        }

        function n(e) {
            return _.extend(e, {
                slug_hash: CP.collection.selectedPenSlugHash
            })
        }

        function s() {
            a({
                "private": h()
            })
        }

        function i() {
            e(CP.collection.VM, function() {
                u()
            })
        }

        function o() {
            return {
                id: "",
                name: "",
                description: "",
                slug_hash: "",
                slug_hash_private: "",
                "private": !1
            }
        }

        function r() {
            CP.collection.VM = o(), CP.collection._VM = [];
            for (var e in CP.collection.VM) CP.collection._VM.push(e)
        }

        function a(e) {
            for (var t in e) - 1 !== CP.collection._VM.indexOf(t) && (CP.collection.VM[t] = e[t])
        }

        function c() {
            a(d)
        }

        function l() {
            var e = CP.collection.VM;
            return e.private ? e.slug_hash_private : e.slug_hash
        }

        function u() {
            if (window.history.replaceState && l()) {
                var e = URLBuilder.getViewURLSimple("collection", "", l(), !1);
                window.history.replaceState(e, "", e)
            }
        }

        function h() {
            return $("#collection-details-private").is(":checked") ? !0 : !1
        }
        var d = window.__collection;
        CP.collection = {}, CP.collection.init = function() {
            r(), c()
        }, CP.collection.updateViewModel = function(e) {
            a(e)
        }, CP.collection.getActiveSlugHash = l, CP.collection.onPrivacyChange = s, CP.collection.onEditPrivacyChange = i, CP.collection.loadBlankViewModel = r, CP.collection.loadInitialViewModel = c, CP.collection.selectedPenSlugHash = "", CP.collection.save = function(s) {
            CP.collection.VM.slug_hash.length > 0 ? e(CP.collection.VM, s) : t(n(CP.collection.VM), s)
        }
    }(),
    function() {
        function e(e, t) {
            CP.TextFormatter.put("/text_formatter/text", {
                text: e
            }, t)
        }
        CP.TextFormatter = {}, CP.TextFormatter.init = function() {
            _.extend(CP.TextFormatter, AJAXUtil), CP.TextFormatter.formatText = e
        }
    }(),
    function() {
        function e() {
            I.on("click", ".edit-collection", s).on("click", "#add-new-collection-button", n).on("change", ".collection-choice", t).on("submit", ".collection-settings-form", a).on("click", "#add-new-collection-form .ios-toggle", o).on("click", "#edit-collection-form .ios-toggle", r), R.on("click", m)
        }

        function t(e) {
            v(e) === V && (L = !0, i(b(e)))
        }

        function n(e) {
            e.preventDefault(), i("")
        }

        function s(e) {
            M = !0, D = !0, e.preventDefault(), y($(e.target).data("slug-hash"), "")
        }

        function i(e) {
            M = !1, D = !1, CP.collection.loadBlankViewModel(), y(0, e)
        }

        function o() {
            CP.collection.onPrivacyChange()
        }

        function r() {
            o(), CP.collection.onEditPrivacyChange(), E()
        }

        function a(e) {
            e.preventDefault(), u()
        }

        function c(e) {
            f(e), g()
        }

        function l(e, t) {
            CP.collection.updateViewModel(t), S(e, t), P(t), Hub.pub("collection-saved")
        }

        function u() {
            C(), CP.collection.save(function(e) {
                l(CP.collection.VM.id, e.collection)
            })
        }

        function h() {
            Hub.sub("key", d), Hub.sub("popup-open", p)
        }

        function d(e, t) {
            "esc" === t.key && m()
        }

        function p(e, t) {
            t !== j && m()
        }

        function f(e) {
            A = $("<div />", {
                "class": "modal modal-neutral group ",
                html: e.html
            }), A.appendTo(I)
        }

        function g() {
            CP.showPopupOverlay(), A.find("#name").focus(), N = !0, A.find(".close-button").on("click", m), Hub.pub("popup-open", j)
        }

        function m(e) {
            e && e.preventDefault(), N && (CP.hidePopupOverlay(), A.remove(), N = !1)
        }

        function v(e) {
            return $(e.target).find("option:selected").val()
        }

        function b(e) {
            return "pen" === B ? CP.pen.slug_hash : $(e.target).closest(".single-pen").data("slug-hash")
        }

        function C() {
            var e = $(".collection-settings-form").serializeObject();
            CP.collection.updateViewModel(e)
        }

        function T(e, t) {
            var n = Copy.collectionUpdated;
            return D || (n = L ? Copy.collectionSavedPenAdded : Copy.collectionCreated), _.template(n, {
                originalId: e,
                name: t.name,
                url: "/collection/" + CP.collection.getActiveSlugHash()
            })
        }

        function y(e, t) {
            CP.collection.selectedPenSlugHash = t;
            var n;
            n = e ? "/collections/" + e + "/edit?slug_hash=" + t : "/collections/new", $.ajax({
                url: n,
                success: c
            })
        }

        function S(e, t) {
            $.showMessage(T(e, t), "slow")
        }

        function P(e) {
            m(), M && (F.html(e.name), CP.TextFormatter.formatText(e.description, function(e) {
                H.html(e.text), x()
            })), w(e)
        }

        function w(e) {
            var t;
            t = e.private === !0 ? O : U, t.append($("<option></option>").attr("value", e.slug_hash).text(e.name)), k.val("__choose__")
        }

        function E() {
            var e = H.find(".private-icon");
            e.length ? e.toggle() : x()
        }

        function x() {
            CP.collection.VM.private && H.prepend("<span class='private-icon left'><svg class='icon-lock'><use xlink:href='#lock'></use></svg></span>")
        }
        CP.createEditCollection = {};
        var A, M, L, D, I = $("body"),
            R = $("#popup-overlay"),
            O = $(".collection-options-public"),
            U = $(".collection-options-private"),
            F = $("#collection-name"),
            H = $("#collection-desc"),
            k = $(".collection-choice"),
            V = "__add__",
            j = "createEditCollection",
            N = !1,
            B = window.__pageType;
        CP.createEditCollection.init = function() {
            CP.collection.init(), CP.TextFormatter.init(), e(), h()
        }
    }(), CPFactory.buildDataObjects(), CPFactory.buildEditorObjects(), CPFactory.buildDesktopViewEditorObjects(), CP.penDelete = new PenDelete, CP.upsell = new Upsell, CP.EditorLayout.init();
var rtClient = new RTClient;
CP.liveRoom = new LiveRoom(rtClient, _.clone(__rtData)), CP.teamRoomNotifications = new TeamRoomNotifications(rtClient, _.clone(__rtData)), Hub.pub("page-loading-done"), CP.EditorLayout.doneLoading(), ErrorReporter.init(), CP.createEditCollection.init(), CP.collectionAddPen.init();