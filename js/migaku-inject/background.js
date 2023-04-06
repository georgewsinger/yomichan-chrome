function InjectMigaku() {
    function t(r) {
        var e = i[r];
        if (void 0 !== e) return e.exports;
        var o = i[r] = {
            id: r,
            loaded: !1,
            exports: {}
        };
        return n[r].call(o.exports, o, o.exports, t), o.loaded = !0, o.exports
    }

    var n = {
        3297: (t, n, i) => {
            "use strict";
            var r = i(4249);
            var e = i(2911);
            var o = {
                builder: function(t) {
                    return new r(t)
                },
                dictionaryBuilder: function() {
                    return new e
                }
            };
            t.exports = o
        },
        4249: (t, n, i) => {
            "use strict";
    
            function r(t) {
                null == t.dicPath ? this.dic_path = "dict/" : this.dic_path = t.dicPath
            }
            var e = i(8967);
            var o = i(4110);
            r.prototype.build = function(t) {
                new o(this.dic_path).load((function(n, i) {
                    t(n, new e(i))
                }))
            }, t.exports = r
        },
        8967: (t, n, i) => {
            "use strict";
    
            function r(t) {
                this.token_info_dictionary = t.token_info_dictionary, this.unknown_dictionary = t.unknown_dictionary, this.viterbi_builder = new e(t), this.viterbi_searcher = new o(t.connection_costs), this.formatter = new s
            }
            var e = i(8717);
            var o = i(393);
            var s = i(7682);
            var a = /、|。/;
            r.splitByPunctuation = function(t) {
                var n = [];
                var i = t;
                for (;
                    "" !== i;) {
                    var r = i.search(a);
                    if (r < 0) {
                        n.push(i);
                        break
                    }
                    n.push(i.substring(0, r + 1)), i = i.substring(r + 1)
                }
                return n
            }, r.prototype.tokenize = function(t) {
                var n = r.splitByPunctuation(t);
                var i = [];
                for (var e = 0; e < n.length; e++) {
                    var o = n[e];
                    this.tokenizeForSentence(o, i)
                }
                return i
            }, r.prototype.tokenizeForSentence = function(t, n) {
                null == n && (n = []);
                var i = this.getLattice(t);
                var r = this.viterbi_searcher.search(i);
                var e = 0;
                n.length > 0 && (e = n[n.length - 1].word_position);
                for (var o = 0; o < r.length; o++) {
                    var s = r[o];
                    var a, u, c;
                    "KNOWN" === s.type ? (u = null == (c = this.token_info_dictionary.getFeatures(s.name)) ? [] : c.split(","), a = this.formatter.formatEntry(s.name, e + s.start_pos, s.type, u)) : "UNKNOWN" === s.type ? (u = null == (c = this.unknown_dictionary.getFeatures(s.name)) ? [] : c.split(","), a = this.formatter.formatUnknownEntry(s.name, e + s.start_pos, s.type, u, s.surface_form)) : a = this.formatter.formatEntry(s.name, e + s.start_pos, s.type, []), n.push(a)
                }
                return n
            }, r.prototype.getLattice = function(t) {
                return this.viterbi_builder.build(t)
            }, t.exports = r
        },
        8717: (t, n, i) => {
            "use strict";
    
            function r(t) {
                this.trie = t.trie, this.token_info_dictionary = t.token_info_dictionary, this.unknown_dictionary = t.unknown_dictionary
            }
            var e = i(8098);
            var o = i(1391);
            var s = i(4152);
            r.prototype.build = function(t) {
                var n = new o;
                var i = new s(t);
                var r, a, u, c, h;
                for (var f = 0; f < i.length; f++) {
                    var l = i.slice(f);
                    var d = this.trie.commonPrefixSearch(l);
                    for (var v = 0; v < d.length; v++) {
                        a = d[v].v, r = d[v].k;
                        var p = this.token_info_dictionary.target_map[a];
                        for (var w = 0; w < p.length; w++) {
                            var g = parseInt(p[w]);
                            u = this.token_info_dictionary.dictionary.getShort(g), c = this.token_info_dictionary.dictionary.getShort(g + 2), h = this.token_info_dictionary.dictionary.getShort(g + 4), n.append(new e(g, h, f + 1, r.length, "KNOWN", u, c, r))
                        }
                    }
                    var m = new s(l);
                    var y = new s(m.charAt(0));
                    var b = this.unknown_dictionary.lookup(y.toString());
                    if (null == d || 0 === d.length || 1 === b.is_always_invoke) {
                        if (r = y, 1 === b.is_grouping && 1 < m.length)
                            for (var k = 1; k < m.length; k++) {
                                var S = m.charAt(k);
                                var T = this.unknown_dictionary.lookup(S);
                                if (b.class_name !== T.class_name) break;
                                r += S
                            }
                        var A = this.unknown_dictionary.target_map[b.class_id];
                        for (var I = 0; I < A.length; I++) {
                            var C = parseInt(A[I]);
                            u = this.unknown_dictionary.dictionary.getShort(C), c = this.unknown_dictionary.dictionary.getShort(C + 2), h = this.unknown_dictionary.dictionary.getShort(C + 4), n.append(new e(C, h, f + 1, r.length, "UNKNOWN", u, c, r.toString()))
                        }
                    }
                }
                return n.appendEos(), n
            }, t.exports = r
        },
        8098: t => {
            "use strict";
    
            function n(t, n, i, r, e, o, s, a) {
                this.name = t, this.cost = n, this.start_pos = i, this.length = r, this.left_id = o, this.right_id = s, this.prev = null, this.surface_form = a, this.shortest_cost = "BOS" === e ? 0 : Number.MAX_VALUE, this.type = e
            }
            t.exports = n
        },
        1391: (t, n, i) => {
            "use strict";
    
            function r() {
                this.nodes_end_at = [], this.nodes_end_at[0] = [new e(-1, 0, 0, 0, "BOS", 0, 0, "")], this.eos_pos = 1
            }
            var e = i(8098);
            r.prototype.append = function(t) {
                var n = t.start_pos + t.length - 1;
                this.eos_pos < n && (this.eos_pos = n);
                var i = this.nodes_end_at[n];
                null == i && (i = []), i.push(t), this.nodes_end_at[n] = i
            }, r.prototype.appendEos = function() {
                var t = this.nodes_end_at.length;
                this.eos_pos++, this.nodes_end_at[t] = [new e(-1, 0, this.eos_pos, 0, "EOS", 0, 0, "")]
            }, t.exports = r
        },
        8098: t => {
            "use strict";
    
            function n(t, n, i, r, e, o, s, a) {
                this.name = t, this.cost = n, this.start_pos = i, this.length = r, this.left_id = o, this.right_id = s, this.prev = null, this.surface_form = a, this.shortest_cost = "BOS" === e ? 0 : Number.MAX_VALUE, this.type = e
            }
            t.exports = n
        },
        4152: t => {
            "use strict";
    
            function n(t) {
                this.str = t, this.index_mapping = [];
                for (var i = 0; i < t.length; i++) {
                    var r = t.charAt(i);
                    this.index_mapping.push(i), n.isSurrogatePair(r) && i++
                }
                this.length = this.index_mapping.length
            }
            n.prototype.slice = function(t) {
                if (this.index_mapping.length <= t) return "";
                var n = this.index_mapping[t];
                return this.str.slice(n)
            }, n.prototype.charAt = function(t) {
                if (this.str.length <= t) return "";
                var n = this.index_mapping[t];
                var i = this.index_mapping[t + 1];
                return null == i ? this.str.slice(n) : this.str.slice(n, i)
            }, n.prototype.charCodeAt = function(t) {
                if (this.index_mapping.length <= t) return NaN;
                var n = this.index_mapping[t];
                var i = this.str.charCodeAt(n);
                var r;
                return i >= 55296 && i <= 56319 && n < this.str.length && (r = this.str.charCodeAt(n + 1)) >= 56320 && r <= 57343 ? 1024 * (i - 55296) + r - 56320 + 65536 : i
            }, n.prototype.toString = function() {
                return this.str
            }, n.isSurrogatePair = function(t) {
                var n = t.charCodeAt(0);
                return n >= 55296 && n <= 56319
            }, t.exports = n
        },
        393: t => {
            "use strict";
    
            function n(t) {
                this.connection_costs = t
            }
            n.prototype.search = function(t) {
                return t = this.forward(t), this.backward(t)
            }, n.prototype.forward = function(t) {
                var n, i, r;
                for (n = 1; n <= t.eos_pos; n++) {
                    var e = t.nodes_end_at[n];
                    if (null != e)
                        for (i = 0; i < e.length; i++) {
                            var o = e[i];
                            var s = Number.MAX_VALUE;
                            var a;
                            var u = t.nodes_end_at[o.start_pos - 1];
                            if (null != u) {
                                for (r = 0; r < u.length; r++) {
                                    var c = u[r];
                                    var h;
                                    h = null == o.left_id || null == c.right_id ? 0 : this.connection_costs.get(c.right_id, o.left_id);
                                    var f = c.shortest_cost + h + o.cost;
                                    f < s && (a = c, s = f)
                                }
                                o.prev = a, o.shortest_cost = s
                            }
                        }
                }
                return t
            }, n.prototype.backward = function(t) {
                var n = [];
                var i = t.nodes_end_at[t.nodes_end_at.length - 1][0].prev;
                if (null == i) return [];
                for (;
                    "BOS" !== i.type;) {
                    if (n.push(i), null == i.prev) return [];
                    i = i.prev
                }
                return n.reverse()
            }, t.exports = n
        },
        7682: t => {
            "use strict";
    
            function n() {}
            n.prototype.formatEntry = function(t, n, i, r) {
                var e = {};
                return e.word_id = t, e.word_type = i, e.word_position = n, e.surface_form = r[0], e.pos = r[1], e.pos_detail_1 = r[2], e.pos_detail_2 = r[3], e.pos_detail_3 = r[4], e.conjugated_type = r[5], e.conjugated_form = r[6], e.basic_form = r[7], e.reading = r[8], e.pronunciation = r[9], e
            }, n.prototype.formatUnknownEntry = function(t, n, i, r, e) {
                var o = {};
                return o.word_id = t, o.word_type = i, o.word_position = n, o.surface_form = e, o.pos = r[1], o.pos_detail_1 = r[2], o.pos_detail_2 = r[3], o.pos_detail_3 = r[4], o.conjugated_type = r[5], o.conjugated_form = r[6], o.basic_form = r[7], o
            }, t.exports = n
        },
        4110: (t, n, i) => {
            "use strict";
    
            function r(t) {
                o.apply(this, [t])
            }
            var e = i(382);
            var o = i(5307);
            r.prototype = Object.create(o.prototype), r.prototype.loadArrayBuffer = function(t, n) {
                var i = new XMLHttpRequest;
                i.open("GET", t, !0), i.responseType = "arraybuffer", i.onload = function() {
                    if (this.status > 0 && 200 !== this.status) n(i.statusText, null);
                    else {
                        var t = this.response;
                        var r = new e.Zlib.Gunzip(new Uint8Array(t)).decompress();
                        n(null, r.buffer)
                    }
                }, i.onerror = function(t) {
                    n(t, null)
                }, i.send()
            }, t.exports = r
        },
        382: function() {
            (function() {
                "use strict";
    
                function t(t) {
                    throw t
                }
    
                function n(t, n) {
                    var i = t.split("."),
                        r = h;
                    !(i[0] in r) && r.execScript && r.execScript("var " + i[0]);
                    for (var e; i.length && (e = i.shift());) i.length || n === c ? r = r[e] ? r[e] : r[e] = {} : r[e] = n
                }
    
                function i(t, n, i) {
                    var r, e = "number" == typeof n ? n : n = 0,
                        o = "number" == typeof i ? i : t.length;
                    for (r = -1, e = 7 & o; e--; ++n) r = r >>> 8 ^ p[255 & (r ^ t[n])];
                    for (e = o >> 3; e--; n += 8) r = (r = (r = (r = (r = (r = (r = (r = r >>> 8 ^ p[255 & (r ^ t[n])]) >>> 8 ^ p[255 & (r ^ t[n + 1])]) >>> 8 ^ p[255 & (r ^ t[n + 2])]) >>> 8 ^ p[255 & (r ^ t[n + 3])]) >>> 8 ^ p[255 & (r ^ t[n + 4])]) >>> 8 ^ p[255 & (r ^ t[n + 5])]) >>> 8 ^ p[255 & (r ^ t[n + 6])]) >>> 8 ^ p[255 & (r ^ t[n + 7])];
                    return (4294967295 ^ r) >>> 0
                }
    
                function r() {}
    
                function e(t) {
                    var n, i, r, e, o, s, a, u, c, h, l = t.length,
                        d = 0,
                        v = Number.POSITIVE_INFINITY;
                    for (u = 0; u < l; ++u) t[u] > d && (d = t[u]), t[u] < v && (v = t[u]);
                    for (n = 1 << d, i = new(f ? Uint32Array : Array)(n), r = 1, e = 0, o = 2; r <= d;) {
                        for (u = 0; u < l; ++u)
                            if (t[u] === r) {
                                for (s = 0, a = e, c = 0; c < r; ++c) s = s << 1 | 1 & a, a >>= 1;
                                for (h = r << 16 | u, c = s; c < n; c += o) i[c] = h;
                                ++e
                            }++ r, e <<= 1, o <<= 1
                    }
                    return [i, d, v]
                }
    
                function o(n, i) {
                    switch (this.i = [], this.j = 32768, this.d = this.f = this.c = this.n = 0, this.input = f ? new Uint8Array(n) : n, this.o = !1, this.k = b, this.w = !1, !i && (i = {}) || (i.index && (this.c = i.index), i.bufferSize && (this.j = i.bufferSize), i.bufferType && (this.k = i.bufferType), i.resize && (this.w = i.resize)), this.k) {
                        case y:
                            this.a = 32768, this.b = new(f ? Uint8Array : Array)(32768 + this.j + 258);
                            break;
                        case b:
                            this.a = 0, this.b = new(f ? Uint8Array : Array)(this.j), this.e = this.D, this.q = this.A, this.l = this.C;
                            break;
                        default:
                            t(Error("invalid inflate mode"))
                    }
                }
    
                function s(n, i) {
                    for (var r, e = n.f, o = n.d, s = n.input, a = n.c, u = s.length; o < i;) a >= u && t(Error("input buffer is broken")), e |= s[a++] << o, o += 8;
                    return r = e & (1 << i) - 1, n.f = e >>> i, n.d = o - i, n.c = a, r
                }
    
                function a(n, i) {
                    for (var r, e, o = n.f, s = n.d, a = n.input, u = n.c, c = a.length, h = i[0], f = i[1]; s < f && !(u >= c);) o |= a[u++] << s, s += 8;
                    return (e = (r = h[o & (1 << f) - 1]) >>> 16) > s && t(Error("invalid code length: " + e)), n.f = o >> e, n.d = s - e, n.c = u, 65535 & r
                }
    
                function u(t) {
                    this.input = t, this.c = 0, this.m = [], this.s = !1
                }
                var c = void 0,
                    h = this;
                var f = "undefined" != typeof Uint8Array && "undefined" != typeof Uint16Array && "undefined" != typeof Uint32Array && "undefined" != typeof DataView;
                var l;
                for (new(f ? Uint8Array : Array)(256), l = 0; 256 > l; ++l)
                    for (var d = (d = l) >>> 1; d; d >>>= 1);
                var v = [0, 1996959894, 3993919788, 2567524794, 124634137, 1886057615, 3915621685, 2657392035, 249268274, 2044508324, 3772115230, 2547177864, 162941995, 2125561021, 3887607047, 2428444049, 498536548, 1789927666, 4089016648, 2227061214, 450548861, 1843258603, 4107580753, 2211677639, 325883990, 1684777152, 4251122042, 2321926636, 335633487, 1661365465, 4195302755, 2366115317, 997073096, 1281953886, 3579855332, 2724688242, 1006888145, 1258607687, 3524101629, 2768942443, 901097722, 1119000684, 3686517206, 2898065728, 853044451, 1172266101, 3705015759, 2882616665, 651767980, 1373503546, 3369554304, 3218104598, 565507253, 1454621731, 3485111705, 3099436303, 671266974, 1594198024, 3322730930, 2970347812, 795835527, 1483230225, 3244367275, 3060149565, 1994146192, 31158534, 2563907772, 4023717930, 1907459465, 112637215, 2680153253, 3904427059, 2013776290, 251722036, 2517215374, 3775830040, 2137656763, 141376813, 2439277719, 3865271297, 1802195444, 476864866, 2238001368, 4066508878, 1812370925, 453092731, 2181625025, 4111451223, 1706088902, 314042704, 2344532202, 4240017532, 1658658271, 366619977, 2362670323, 4224994405, 1303535960, 984961486, 2747007092, 3569037538, 1256170817, 1037604311, 2765210733, 3554079995, 1131014506, 879679996, 2909243462, 3663771856, 1141124467, 855842277, 2852801631, 3708648649, 1342533948, 654459306, 3188396048, 3373015174, 1466479909, 544179635, 3110523913, 3462522015, 1591671054, 702138776, 2966460450, 3352799412, 1504918807, 783551873, 3082640443, 3233442989, 3988292384, 2596254646, 62317068, 1957810842, 3939845945, 2647816111, 81470997, 1943803523, 3814918930, 2489596804, 225274430, 2053790376, 3826175755, 2466906013, 167816743, 2097651377, 4027552580, 2265490386, 503444072, 1762050814, 4150417245, 2154129355, 426522225, 1852507879, 4275313526, 2312317920, 282753626, 1742555852, 4189708143, 2394877945, 397917763, 1622183637, 3604390888, 2714866558, 953729732, 1340076626, 3518719985, 2797360999, 1068828381, 1219638859, 3624741850, 2936675148, 906185462, 1090812512, 3747672003, 2825379669, 829329135, 1181335161, 3412177804, 3160834842, 628085408, 1382605366, 3423369109, 3138078467, 570562233, 1426400815, 3317316542, 2998733608, 733239954, 1555261956, 3268935591, 3050360625, 752459403, 1541320221, 2607071920, 3965973030, 1969922972, 40735498, 2617837225, 3943577151, 1913087877, 83908371, 2512341634, 3803740692, 2075208622, 213261112, 2463272603, 3855990285, 2094854071, 198958881, 2262029012, 4057260610, 1759359992, 534414190, 2176718541, 4139329115, 1873836001, 414664567, 2282248934, 4279200368, 1711684554, 285281116, 2405801727, 4167216745, 1634467795, 376229701, 2685067896, 3608007406, 1308918612, 956543938, 2808555105, 3495958263, 1231636301, 1047427035, 2932959818, 3654703836, 1088359270, 936918e3, 2847714899, 3736837829, 1202900863, 817233897, 3183342108, 3401237130, 1404277552, 615818150, 3134207493, 3453421203, 1423857449, 601450431, 3009837614, 3294710456, 1567103746, 711928724, 3020668471, 3272380065, 1510334235, 755167117],
                    p = f ? new Uint32Array(v) : v;
                r.prototype.getName = function() {
                    return this.name
                }, r.prototype.getData = function() {
                    return this.data
                }, r.prototype.G = function() {
                    return this.H
                };
                var w, g = [];
                for (w = 0; 288 > w; w++) switch (!0) {
                    case 143 >= w:
                        g.push([w + 48, 8]);
                        break;
                    case 255 >= w:
                        g.push([w - 144 + 400, 9]);
                        break;
                    case 279 >= w:
                        g.push([w - 256 + 0, 7]);
                        break;
                    case 287 >= w:
                        g.push([w - 280 + 192, 8]);
                        break;
                    default:
                        t("invalid literal: " + w)
                }
                var m = function() {
                    function n(n) {
                        switch (!0) {
                            case 3 === n:
                                return [257, n - 3, 0];
                            case 4 === n:
                                return [258, n - 4, 0];
                            case 5 === n:
                                return [259, n - 5, 0];
                            case 6 === n:
                                return [260, n - 6, 0];
                            case 7 === n:
                                return [261, n - 7, 0];
                            case 8 === n:
                                return [262, n - 8, 0];
                            case 9 === n:
                                return [263, n - 9, 0];
                            case 10 === n:
                                return [264, n - 10, 0];
                            case 12 >= n:
                                return [265, n - 11, 1];
                            case 14 >= n:
                                return [266, n - 13, 1];
                            case 16 >= n:
                                return [267, n - 15, 1];
                            case 18 >= n:
                                return [268, n - 17, 1];
                            case 22 >= n:
                                return [269, n - 19, 2];
                            case 26 >= n:
                                return [270, n - 23, 2];
                            case 30 >= n:
                                return [271, n - 27, 2];
                            case 34 >= n:
                                return [272, n - 31, 2];
                            case 42 >= n:
                                return [273, n - 35, 3];
                            case 50 >= n:
                                return [274, n - 43, 3];
                            case 58 >= n:
                                return [275, n - 51, 3];
                            case 66 >= n:
                                return [276, n - 59, 3];
                            case 82 >= n:
                                return [277, n - 67, 4];
                            case 98 >= n:
                                return [278, n - 83, 4];
                            case 114 >= n:
                                return [279, n - 99, 4];
                            case 130 >= n:
                                return [280, n - 115, 4];
                            case 162 >= n:
                                return [281, n - 131, 5];
                            case 194 >= n:
                                return [282, n - 163, 5];
                            case 226 >= n:
                                return [283, n - 195, 5];
                            case 257 >= n:
                                return [284, n - 227, 5];
                            case 258 === n:
                                return [285, n - 258, 0];
                            default:
                                t("invalid length: " + n)
                        }
                    }
                    var i, r, e = [];
                    for (i = 3; 258 >= i; i++) r = n(i), e[i] = r[2] << 24 | r[1] << 16 | r[0];
                    return e
                }();
                f && new Uint32Array(m);
                var y = 0,
                    b = 1;
                o.prototype.g = function() {
                    for (; !this.o;) {
                        var n = s(this, 3);
                        switch (1 & n && (this.o = !0), n >>>= 1) {
                            case 0:
                                var i = this.input,
                                    r = this.c,
                                    o = this.b,
                                    u = this.a,
                                    h = i.length,
                                    l = c,
                                    d = o.length,
                                    v = c;
                                switch (this.d = this.f = 0, r + 1 >= h && t(Error("invalid uncompressed block header: LEN")), l = i[r++] | i[r++] << 8, r + 1 >= h && t(Error("invalid uncompressed block header: NLEN")), l === ~(i[r++] | i[r++] << 8) && t(Error("invalid uncompressed block header: length verify")), r + l > i.length && t(Error("input buffer is broken")), this.k) {
                                    case y:
                                        for (; u + l > o.length;) {
                                            if (l -= v = d - u, f) o.set(i.subarray(r, r + v), u), u += v, r += v;
                                            else
                                                for (; v--;) o[u++] = i[r++];
                                            this.a = u, o = this.e(), u = this.a
                                        }
                                        break;
                                    case b:
                                        for (; u + l > o.length;) o = this.e({
                                            t: 2
                                        });
                                        break;
                                    default:
                                        t(Error("invalid inflate mode"))
                                }
                                if (f) o.set(i.subarray(r, r + l), u), u += l, r += l;
                                else
                                    for (; l--;) o[u++] = i[r++];
                                this.c = r, this.a = u, this.b = o;
                                break;
                            case 1:
                                this.l(F, U);
                                break;
                            case 2:
                                var p = s(this, 5) + 257,
                                    w = s(this, 5) + 1,
                                    g = s(this, 4) + 4,
                                    m = new(f ? Uint8Array : Array)(A.length),
                                    k = c,
                                    S = c,
                                    T = c,
                                    I = c,
                                    C = c,
                                    E = c,
                                    O = c,
                                    D = c,
                                    R = c;
                                for (D = 0; D < g; ++D) m[A[D]] = s(this, 3);
                                if (!f)
                                    for (D = g, g = m.length; D < g; ++D) m[A[D]] = 0;
                                for (k = e(m), I = new(f ? Uint8Array : Array)(p + w), D = 0, R = p + w; D < R;) switch (C = a(this, k), C) {
                                    case 16:
                                        for (O = 3 + s(this, 2); O--;) I[D++] = E;
                                        break;
                                    case 17:
                                        for (O = 3 + s(this, 3); O--;) I[D++] = 0;
                                        E = 0;
                                        break;
                                    case 18:
                                        for (O = 11 + s(this, 7); O--;) I[D++] = 0;
                                        E = 0;
                                        break;
                                    default:
                                        E = I[D++] = C
                                }
                                S = e(f ? I.subarray(0, p) : I.slice(0, p)), T = e(f ? I.subarray(p) : I.slice(p)), this.l(S, T);
                                break;
                            default:
                                t(Error("unknown BTYPE: " + n))
                        }
                    }
                    return this.q()
                };
                var k, S, T = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15],
                    A = f ? new Uint16Array(T) : T,
                    I = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 258, 258],
                    C = f ? new Uint16Array(I) : I,
                    E = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, 0, 0],
                    O = f ? new Uint8Array(E) : E,
                    D = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577],
                    R = f ? new Uint16Array(D) : D,
                    P = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13],
                    j = f ? new Uint8Array(P) : P,
                    x = new(f ? Uint8Array : Array)(288);
                for (k = 0, S = x.length; k < S; ++k) x[k] = 143 >= k ? 8 : 255 >= k ? 9 : 279 >= k ? 7 : 8;
                var N, M, F = e(x),
                    L = new(f ? Uint8Array : Array)(30);
                for (N = 0, M = L.length; N < M; ++N) L[N] = 5;
                var U = e(L);
                o.prototype.l = function(t, n) {
                    var i = this.b,
                        r = this.a;
                    this.r = t;
                    for (var e, o, u, c, h = i.length - 258; 256 !== (e = a(this, t));)
                        if (256 > e) r >= h && (this.a = r, i = this.e(), r = this.a), i[r++] = e;
                        else
                            for (c = C[o = e - 257], 0 < O[o] && (c += s(this, O[o])), e = a(this, n), u = R[e], 0 < j[e] && (u += s(this, j[e])), r >= h && (this.a = r, i = this.e(), r = this.a); c--;) i[r] = i[r++ - u];
                    for (; 8 <= this.d;) this.d -= 8, this.c--;
                    this.a = r
                }, o.prototype.C = function(t, n) {
                    var i = this.b,
                        r = this.a;
                    this.r = t;
                    for (var e, o, u, c, h = i.length; 256 !== (e = a(this, t));)
                        if (256 > e) r >= h && (h = (i = this.e()).length), i[r++] = e;
                        else
                            for (c = C[o = e - 257], 0 < O[o] && (c += s(this, O[o])), e = a(this, n), u = R[e], 0 < j[e] && (u += s(this, j[e])), r + c > h && (h = (i = this.e()).length); c--;) i[r] = i[r++ - u];
                    for (; 8 <= this.d;) this.d -= 8, this.c--;
                    this.a = r
                }, o.prototype.e = function() {
                    var t, n, i = new(f ? Uint8Array : Array)(this.a - 32768),
                        r = this.a - 32768,
                        e = this.b;
                    if (f) i.set(e.subarray(32768, i.length));
                    else
                        for (t = 0, n = i.length; t < n; ++t) i[t] = e[t + 32768];
                    if (this.i.push(i), this.n += i.length, f) e.set(e.subarray(r, r + 32768));
                    else
                        for (t = 0; 32768 > t; ++t) e[t] = e[r + t];
                    return this.a = 32768, e
                }, o.prototype.D = function(t) {
                    var n, i, r, e = this.input.length / this.c + 1 | 0,
                        o = this.input,
                        s = this.b;
                    return t && ("number" == typeof t.t && (e = t.t), "number" == typeof t.z && (e += t.z)), i = 2 > e ? (r = (o.length - this.c) / this.r[2] / 2 * 258 | 0) < s.length ? s.length + r : s.length << 1 : s.length * e, f ? (n = new Uint8Array(i)).set(s) : n = s, this.b = n
                }, o.prototype.q = function() {
                    var t, n, i, r, e, o = 0,
                        s = this.b,
                        a = this.i,
                        u = new(f ? Uint8Array : Array)(this.n + (this.a - 32768));
                    if (0 === a.length) return f ? this.b.subarray(32768, this.a) : this.b.slice(32768, this.a);
                    for (n = 0, i = a.length; n < i; ++n)
                        for (r = 0, e = (t = a[n]).length; r < e; ++r) u[o++] = t[r];
                    for (n = 32768, i = this.a; n < i; ++n) u[o++] = s[n];
                    return this.i = [], this.buffer = u
                }, o.prototype.A = function() {
                    var t, n = this.a;
                    return f ? this.w ? (t = new Uint8Array(n)).set(this.b.subarray(0, n)) : t = this.b.subarray(0, n) : (this.b.length > n && (this.b.length = n), t = this.b), this.buffer = t
                }, u.prototype.F = function() {
                    return this.s || this.g(), this.m.slice()
                }, u.prototype.g = function() {
                    for (var n = this.input.length; this.c < n;) {
                        var e = new r,
                            s = c,
                            a = c,
                            u = c,
                            h = c,
                            l = c,
                            d = c,
                            v = c,
                            p = c,
                            w = c,
                            g = this.input,
                            m = this.c;
                        if (e.u = g[m++], e.v = g[m++], (31 !== e.u || 139 !== e.v) && t(Error("invalid file signature:" + e.u + "," + e.v)), e.p = g[m++], 8 === e.p || t(Error("unknown compression method: " + e.p)), e.h = g[m++], p = g[m++] | g[m++] << 8 | g[m++] << 16 | g[m++] << 24, e.H = new Date(1e3 * p), e.N = g[m++], e.M = g[m++], 0 < (4 & e.h) && (e.I = g[m++] | g[m++] << 8, m += e.I), 0 < (8 & e.h)) {
                            for (v = [], d = 0; 0 < (l = g[m++]);) v[d++] = String.fromCharCode(l);
                            e.name = v.join("")
                        }
                        if (0 < (16 & e.h)) {
                            for (v = [], d = 0; 0 < (l = g[m++]);) v[d++] = String.fromCharCode(l);
                            e.J = v.join("")
                        }
                        0 < (2 & e.h) && (e.B = 65535 & i(g, 0, m), e.B !== (g[m++] | g[m++] << 8) && t(Error("invalid header crc16"))), s = g[g.length - 4] | g[g.length - 3] << 8 | g[g.length - 2] << 16 | g[g.length - 1] << 24, g.length - m - 4 - 4 < 512 * s && (h = s), a = new o(g, {
                            index: m,
                            bufferSize: h
                        }), e.data = u = a.g(), m = a.c, e.K = w = (g[m++] | g[m++] << 8 | g[m++] << 16 | g[m++] << 24) >>> 0, i(u, c, c) !== w && t(Error("invalid CRC-32 checksum: 0x" + i(u, c, c).toString(16) + " / 0x" + w.toString(16))), e.L = s = (g[m++] | g[m++] << 8 | g[m++] << 16 | g[m++] << 24) >>> 0, (4294967295 & u.length) !== s && t(Error("invalid input size: " + (4294967295 & u.length) + " / " + s)), this.m.push(e), this.c = m
                    }
                    this.s = !0;
                    var y, b, k, S = this.m,
                        T = 0,
                        A = 0;
                    for (y = 0, b = S.length; y < b; ++y) A += S[y].data.length;
                    if (f)
                        for (k = new Uint8Array(A), y = 0; y < b; ++y) k.set(S[y].data, T), T += S[y].data.length;
                    else {
                        for (k = [], y = 0; y < b; ++y) k[y] = S[y].data;
                        k = Array.prototype.concat.apply([], k)
                    }
                    return k
                }, n("Zlib.Gunzip", u), n("Zlib.Gunzip.prototype.decompress", u.prototype.g), n("Zlib.Gunzip.prototype.getMembers", u.prototype.F), n("Zlib.GunzipMember", r), n("Zlib.GunzipMember.prototype.getName", r.prototype.getName), n("Zlib.GunzipMember.prototype.getData", r.prototype.getData), n("Zlib.GunzipMember.prototype.getMtime", r.prototype.G)
            }).call(this)
        },
        5307: (t, n, i) => {
            "use strict";
    
            function r(t) {
                this.dic = new s, this.dic_path = t
            }
            var e = i(2520);
            var o = i(1195);
            var s = i(4907);
            r.prototype.loadArrayBuffer = function(t, n) {
                throw new Error("DictionaryLoader#loadArrayBuffer should be overwrite")
            }, r.prototype.load = function(t) {
                var n = this.dic;
                var i = this.dic_path;
                var r = this.loadArrayBuffer;
                o.parallel([function(t) {
                    o.map(["base.dat.gz", "check.dat.gz"], (function(t, n) {
                        r(e.join(i, t), (function(t, i) {
                            if (t) return n(t);
                            n(null, i)
                        }))
                    }), (function(i, r) {
                        if (i) return t(i);
                        var e = new Int32Array(r[0]);
                        var o = new Int32Array(r[1]);
                        n.loadTrie(e, o), t(null)
                    }))
                }, function(t) {
                    o.map(["tid.dat.gz", "tid_pos.dat.gz", "tid_map.dat.gz"], (function(t, n) {
                        r(e.join(i, t), (function(t, i) {
                            if (t) return n(t);
                            n(null, i)
                        }))
                    }), (function(i, r) {
                        if (i) return t(i);
                        var e = new Uint8Array(r[0]);
                        var o = new Uint8Array(r[1]);
                        var s = new Uint8Array(r[2]);
                        n.loadTokenInfoDictionaries(e, o, s), t(null)
                    }))
                }, function(t) {
                    r(e.join(i, "cc.dat.gz"), (function(i, r) {
                        if (i) return t(i);
                        var e = new Int16Array(r);
                        n.loadConnectionCosts(e), t(null)
                    }))
                }, function(t) {
                    o.map(["unk.dat.gz", "unk_pos.dat.gz", "unk_map.dat.gz", "unk_char.dat.gz", "unk_compat.dat.gz", "unk_invoke.dat.gz"], (function(t, n) {
                        r(e.join(i, t), (function(t, i) {
                            if (t) return n(t);
                            n(null, i)
                        }))
                    }), (function(i, r) {
                        if (i) return t(i);
                        var e = new Uint8Array(r[0]);
                        var o = new Uint8Array(r[1]);
                        var s = new Uint8Array(r[2]);
                        var a = new Uint8Array(r[3]);
                        var u = new Uint32Array(r[4]);
                        var c = new Uint8Array(r[5]);
                        n.loadUnknownDictionaries(e, o, s, a, u, c), t(null)
                    }))
                }], (function(i) {
                    t(i, n)
                }))
            }, t.exports = r
        },
        2520: (t, n, i) => {
            "use strict";
    
            function r(t, n) {
                var i = [];
                for (var r = 0; r < t.length; r++) {
                    var e = t[r];
                    e && "." !== e && (".." === e ? i.length && ".." !== i[i.length - 1] ? i.pop() : n && i.push("..") : i.push(e))
                }
                return i
            }
    
            function e(t) {
                var n = t.length - 1;
                var i = 0;
                for (; i <= n && !t[i]; i++);
                var r = n;
                for (; r >= 0 && !t[r]; r--);
                return 0 === i && r === n ? t : i > r ? [] : t.slice(i, r + 1)
            }
    
            function o(t) {
                var n = l.exec(t),
                    i = (n[1] || "") + (n[2] || ""),
                    r = n[3] || "";
                var e = d.exec(r);
                return [i, e[1], e[2], e[3]]
            }
    
            function s(t) {
                var n = l.exec(t),
                    i = n[1] || "",
                    r = !!i && ":" !== i[1];
                return {
                    device: i,
                    isUnc: r,
                    isAbsolute: r || !!n[2],
                    tail: n[3]
                }
            }
    
            function a(t) {
                return "\\\\" + t.replace(/^[\\\/]+/, "").replace(/[\\\/]+/g, "\\")
            }
    
            function u(t) {
                return p.exec(t).slice(1)
            }
            var c = i(4155);
            var h = "win32" === c.platform;
            var f = i(8059);
            var l = /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/;
            var d = /^([\s\S]*?)((?:\.{1,2}|[^\\\/]+?|)(\.[^.\/\\]*|))(?:[\\\/]*)$/;
            var v = {};
            v.resolve = function() {
                var t = "",
                    n = "",
                    i = !1;
                for (var e = arguments.length - 1; e >= -1; e--) {
                    var o;
                    if (e >= 0 ? o = arguments[e] : t ? (o = c.env["=" + t]) && o.substr(0, 3).toLowerCase() === t.toLowerCase() + "\\" || (o = t + "\\") : o = c.cwd(), !f.isString(o)) throw new TypeError("Arguments to path.resolve must be strings");
                    if (o) {
                        var u = s(o),
                            h = u.device,
                            l = u.isUnc,
                            d = u.isAbsolute,
                            v = u.tail;
                        if ((!h || !t || h.toLowerCase() === t.toLowerCase()) && (t || (t = h), i || (n = v + "\\" + n, i = d), t && i)) break
                    }
                }
                return l && (t = a(t)), t + (i ? "\\" : "") + (n = r(n.split(/[\\\/]+/), !i).join("\\")) || "."
            }, v.normalize = function(t) {
                var n = s(t),
                    i = n.device,
                    e = n.isUnc,
                    o = n.isAbsolute,
                    u = n.tail,
                    c = /[\\\/]$/.test(u);
                return (u = r(u.split(/[\\\/]+/), !o).join("\\")) || o || (u = "."), u && c && (u += "\\"), e && (i = a(i)), i + (o ? "\\" : "") + u
            }, v.isAbsolute = function(t) {
                return s(t).isAbsolute
            }, v.join = function() {
                var t = [];
                for (var n = 0; n < arguments.length; n++) {
                    var i = arguments[n];
                    if (!f.isString(i)) throw new TypeError("Arguments to path.join must be strings");
                    i && t.push(i)
                }
                var r = t.join("\\");
                return /^[\\\/]{2}[^\\\/]/.test(t[0]) || (r = r.replace(/^[\\\/]{2,}/, "\\")), v.normalize(r)
            }, v.relative = function(t, n) {
                t = v.resolve(t), n = v.resolve(n);
                var i = t.toLowerCase();
                var r = n.toLowerCase();
                var o = e(n.split("\\"));
                var s = e(i.split("\\"));
                var a = e(r.split("\\"));
                var u = Math.min(s.length, a.length);
                var c = u;
                for (var h = 0; h < u; h++)
                    if (s[h] !== a[h]) {
                        c = h;
                        break
                    } if (0 == c) return n;
                var f = [];
                for (h = c; h < s.length; h++) f.push("..");
                return (f = f.concat(o.slice(c))).join("\\")
            }, v._makeLong = function(t) {
                if (!f.isString(t)) return t;
                if (!t) return "";
                var n = v.resolve(t);
                return /^[a-zA-Z]\:\\/.test(n) ? "\\\\?\\" + n : /^\\\\[^?.]/.test(n) ? "\\\\?\\UNC\\" + n.substring(2) : t
            }, v.dirname = function(t) {
                var n = o(t),
                    i = n[0],
                    r = n[1];
                return i || r ? (r && (r = r.substr(0, r.length - 1)), i + r) : "."
            }, v.basename = function(t, n) {
                var i = o(t)[2];
                return n && i.substr(-1 * n.length) === n && (i = i.substr(0, i.length - n.length)), i
            }, v.extname = function(t) {
                return o(t)[3]
            }, v.format = function(t) {
                if (!f.isObject(t)) throw new TypeError("Parameter 'pathObject' must be an object, not " + typeof t);
                var n = t.root || "";
                if (!f.isString(n)) throw new TypeError("'pathObject.root' must be a string or undefined, not " + typeof t.root);
                var i = t.dir;
                var r = t.base || "";
                return i ? i[i.length - 1] === v.sep ? i + r : i + v.sep + r : r
            }, v.parse = function(t) {
                if (!f.isString(t)) throw new TypeError("Parameter 'pathString' must be a string, not " + typeof t);
                var n = o(t);
                if (!n || 4 !== n.length) throw new TypeError("Invalid path '" + t + "'");
                return {
                    root: n[0],
                    dir: n[0] + n[1].slice(0, -1),
                    base: n[2],
                    ext: n[3],
                    name: n[2].slice(0, n[2].length - n[3].length)
                }
            }, v.sep = "\\", v.delimiter = ";";
            var p = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
            var w = {};
            w.resolve = function() {
                var t = "",
                    n = !1;
                for (var i = arguments.length - 1; i >= -1 && !n; i--) {
                    var e = i >= 0 ? arguments[i] : c.cwd();
                    if (!f.isString(e)) throw new TypeError("Arguments to path.resolve must be strings");
                    e && (t = e + "/" + t, n = "/" === e[0])
                }
                return (n ? "/" : "") + (t = r(t.split("/"), !n).join("/")) || "."
            }, w.normalize = function(t) {
                var n = w.isAbsolute(t),
                    i = t && "/" === t[t.length - 1];
                return (t = r(t.split("/"), !n).join("/")) || n || (t = "."), t && i && (t += "/"), (n ? "/" : "") + t
            }, w.isAbsolute = function(t) {
                return "/" === t.charAt(0)
            }, w.join = function() {
                var t = "";
                for (var n = 0; n < arguments.length; n++) {
                    var i = arguments[n];
                    if (!f.isString(i)) throw new TypeError("Arguments to path.join must be strings");
                    i && (t += t ? "/" + i : i)
                }
                return w.normalize(t)
            }, w.relative = function(t, n) {
                t = w.resolve(t).substr(1), n = w.resolve(n).substr(1);
                var i = e(t.split("/"));
                var r = e(n.split("/"));
                var o = Math.min(i.length, r.length);
                var s = o;
                for (var a = 0; a < o; a++)
                    if (i[a] !== r[a]) {
                        s = a;
                        break
                    } var u = [];
                for (a = s; a < i.length; a++) u.push("..");
                return (u = u.concat(r.slice(s))).join("/")
            }, w._makeLong = function(t) {
                return t
            }, w.dirname = function(t) {
                var n = u(t),
                    i = n[0],
                    r = n[1];
                return i || r ? (r && (r = r.substr(0, r.length - 1)), i + r) : "."
            }, w.basename = function(t, n) {
                var i = u(t)[2];
                return n && i.substr(-1 * n.length) === n && (i = i.substr(0, i.length - n.length)), i
            }, w.extname = function(t) {
                return u(t)[3]
            }, w.format = function(t) {
                if (!f.isObject(t)) throw new TypeError("Parameter 'pathObject' must be an object, not " + typeof t);
                var n = t.root || "";
                if (!f.isString(n)) throw new TypeError("'pathObject.root' must be a string or undefined, not " + typeof t.root);
                return (t.dir ? t.dir + w.sep : "") + (t.base || "")
            }, w.parse = function(t) {
                if (!f.isString(t)) throw new TypeError("Parameter 'pathString' must be a string, not " + typeof t);
                var n = u(t);
                if (!n || 4 !== n.length) throw new TypeError("Invalid path '" + t + "'");
                return n[1] = n[1] || "", n[2] = n[2] || "", n[3] = n[3] || "", {
                    root: n[0],
                    dir: n[0] + n[1].slice(0, -1),
                    base: n[2],
                    ext: n[3],
                    name: n[2].slice(0, n[2].length - n[3].length)
                }
            }, w.sep = "/", w.delimiter = ":", t.exports = h ? v : w, t.exports.posix = w, t.exports.win32 = v
        },
        4155: t => {
            function n() {
                throw new Error("setTimeout has not been defined")
            }
    
            function i() {
                throw new Error("clearTimeout has not been defined")
            }
    
            function r(t) {
                if (h === setTimeout) return setTimeout(t, 0);
                if ((h === n || !h) && setTimeout) return h = setTimeout, setTimeout(t, 0);
                try {
                    return h(t, 0)
                } catch (n) {
                    try {
                        return h.call(null, t, 0)
                    } catch (n) {
                        return h.call(this, t, 0)
                    }
                }
            }
    
            function e(t) {
                if (f === clearTimeout) return clearTimeout(t);
                if ((f === i || !f) && clearTimeout) return f = clearTimeout, clearTimeout(t);
                try {
                    return f(t)
                } catch (n) {
                    try {
                        return f.call(null, t)
                    } catch (n) {
                        return f.call(this, t)
                    }
                }
            }
    
            function o() {
                d && v && (d = !1, v.length ? l = v.concat(l) : p = -1, l.length && s())
            }
    
            function s() {
                if (!d) {
                    var t = r(o);
                    d = !0;
                    var n = l.length;
                    for (; n;) {
                        for (v = l, l = []; ++p < n;) v && v[p].run();
                        p = -1, n = l.length
                    }
                    v = null, d = !1, e(t)
                }
            }
    
            function a(t, n) {
                this.fun = t, this.array = n
            }
    
            function u() {}
            var c = t.exports = {};
            var h;
            var f;
            ! function() {
                try {
                    h = "function" == typeof setTimeout ? setTimeout : n
                } catch (t) {
                    h = n
                }
                try {
                    f = "function" == typeof clearTimeout ? clearTimeout : i
                } catch (t) {
                    f = i
                }
            }();
            var l = [];
            var d = !1;
            var v;
            var p = -1;
            c.nextTick = function(t) {
                var n = new Array(arguments.length - 1);
                if (arguments.length > 1)
                    for (var i = 1; i < arguments.length; i++) n[i - 1] = arguments[i];
                l.push(new a(t, n)), 1 !== l.length || d || r(s)
            }, a.prototype.run = function() {
                this.fun.apply(null, this.array)
            }, c.title = "browser", c.browser = !0, c.env = {}, c.argv = [], c.version = "", c.versions = {}, c.on = u, c.addListener = u, c.once = u, c.off = u, c.removeListener = u, c.removeAllListeners = u, c.emit = u, c.prependListener = u, c.prependOnceListener = u, c.listeners = function(t) {
                return []
            }, c.binding = function(t) {
                throw new Error("process.binding is not supported")
            }, c.cwd = function() {
                return "/"
            }, c.chdir = function(t) {
                throw new Error("process.chdir is not supported")
            }, c.umask = function() {
                return 0
            }
        },
        8059: (t, n, i) => {
            function r(t, i) {
                var r = {
                    seen: [],
                    stylize: o
                };
                return arguments.length >= 3 && (r.depth = arguments[2]), arguments.length >= 4 && (r.colors = arguments[3]), v(i) ? r.showHidden = i : i && n._extend(r, i), b(r.showHidden) && (r.showHidden = !1), b(r.depth) && (r.depth = 2), b(r.colors) && (r.colors = !1), b(r.customInspect) && (r.customInspect = !0), r.colors && (r.stylize = e), a(r, t, r.depth)
            }
    
            function e(t, n) {
                var i = r.styles[n];
                return i ? "[" + r.colors[i][0] + "m" + t + "[" + r.colors[i][1] + "m" : t
            }
    
            function o(t, n) {
                return t
            }
    
            function s(t) {
                var n = {};
                return t.forEach((function(t, i) {
                    n[t] = !0
                })), n
            }
    
            function a(t, i, r) {
                if (t.customInspect && i && I(i.inspect) && i.inspect !== n.inspect && (!i.constructor || i.constructor.prototype !== i)) {
                    var e = i.inspect(r, t);
                    return m(e) || (e = a(t, e, r)), e
                }
                var o = u(t, i);
                if (o) return o;
                var v = Object.keys(i);
                var p = s(v);
                if (t.showHidden && (v = Object.getOwnPropertyNames(i)), A(i) && (v.indexOf("message") >= 0 || v.indexOf("description") >= 0)) return c(i);
                if (0 === v.length) {
                    if (I(i)) {
                        var w = i.name ? ": " + i.name : "";
                        return t.stylize("[Function" + w + "]", "special")
                    }
                    if (k(i)) return t.stylize(RegExp.prototype.toString.call(i), "regexp");
                    if (T(i)) return t.stylize(Date.prototype.toString.call(i), "date");
                    if (A(i)) return c(i)
                }
                var g = "",
                    y = !1,
                    b = ["{", "}"];
                return d(i) && (y = !0, b = ["[", "]"]), I(i) && (g = " [Function" + (i.name ? ": " + i.name : "") + "]"), k(i) && (g = " " + RegExp.prototype.toString.call(i)), T(i) && (g = " " + Date.prototype.toUTCString.call(i)), A(i) && (g = " " + c(i)), 0 !== v.length || y && 0 != i.length ? r < 0 ? k(i) ? t.stylize(RegExp.prototype.toString.call(i), "regexp") : t.stylize("[Object]", "special") : (t.seen.push(i), S = y ? h(t, i, r, p, v) : v.map((function(n) {
                    return f(t, i, r, p, n, y)
                })), t.seen.pop(), l(S, g, b)) : b[0] + g + b[1];
                var S
            }
    
            function u(t, n) {
                if (b(n)) return t.stylize("undefined", "undefined");
                if (m(n)) {
                    var i = "'" + JSON.stringify(n).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, '"') + "'";
                    return t.stylize(i, "string")
                }
                return g(n) ? t.stylize("" + n, "number") : v(n) ? t.stylize("" + n, "boolean") : p(n) ? t.stylize("null", "null") : void 0
            }
    
            function c(t) {
                return "[" + Error.prototype.toString.call(t) + "]"
            }
    
            function h(t, n, i, r, e) {
                var o = [];
                for (var s = 0, a = n.length; s < a; ++s) O(n, String(s)) ? o.push(f(t, n, i, r, String(s), !0)) : o.push("");
                return e.forEach((function(e) {
                    e.match(/^\d+$/) || o.push(f(t, n, i, r, e, !0))
                })), o
            }
    
            function f(t, n, i, r, e, o) {
                var s, u, c;
                if ((c = Object.getOwnPropertyDescriptor(n, e) || {
                        value: n[e]
                    }).get ? u = c.set ? t.stylize("[Getter/Setter]", "special") : t.stylize("[Getter]", "special") : c.set && (u = t.stylize("[Setter]", "special")), O(r, e) || (s = "[" + e + "]"), u || (t.seen.indexOf(c.value) < 0 ? (u = p(i) ? a(t, c.value, null) : a(t, c.value, i - 1)).indexOf("\n") > -1 && (u = o ? u.split("\n").map((function(t) {
                        return "  " + t
                    })).join("\n").substr(2) : "\n" + u.split("\n").map((function(t) {
                        return "   " + t
                    })).join("\n")) : u = t.stylize("[Circular]", "special")), b(s)) {
                    if (o && e.match(/^\d+$/)) return u;
                    (s = JSON.stringify("" + e)).match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/) ? (s = s.substr(1, s.length - 2), s = t.stylize(s, "name")) : (s = s.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'"), s = t.stylize(s, "string"))
                }
                return s + ": " + u
            }
    
            function l(t, n, i) {
                return t.reduce((function(t, n) {
                    return n.indexOf("\n"), t + n.replace(/\u001b\[\d\d?m/g, "").length + 1
                }), 0) > 60 ? i[0] + ("" === n ? "" : n + "\n ") + " " + t.join(",\n  ") + " " + i[1] : i[0] + n + " " + t.join(", ") + " " + i[1]
            }
    
            function d(t) {
                return Array.isArray(t)
            }
    
            function v(t) {
                return "boolean" == typeof t
            }
    
            function p(t) {
                return null === t
            }
    
            function w(t) {
                return null == t
            }
    
            function g(t) {
                return "number" == typeof t
            }
    
            function m(t) {
                return "string" == typeof t
            }
    
            function y(t) {
                return "symbol" == typeof t
            }
    
            function b(t) {
                return void 0 === t
            }
    
            function k(t) {
                return S(t) && "[object RegExp]" === E(t)
            }
    
            function S(t) {
                return "object" == typeof t && null !== t
            }
    
            function T(t) {
                return S(t) && "[object Date]" === E(t)
            }
    
            function A(t) {
                return S(t) && ("[object Error]" === E(t) || t instanceof Error)
            }
    
            function I(t) {
                return "function" == typeof t
            }
    
            function C(t) {
                return null === t || "boolean" == typeof t || "number" == typeof t || "string" == typeof t || "symbol" == typeof t || void 0 === t
            }
    
            function E(t) {
                return Object.prototype.toString.call(t)
            }
    
            function O(t, n) {
                return Object.prototype.hasOwnProperty.call(t, n)
            }
            var D = i(4155);
            var R = /%[sdj%]/g;
            n.format = function(t) {
                if (!m(t)) {
                    var n = [];
                    for (var i = 0; i < arguments.length; i++) n.push(r(arguments[i]));
                    return n.join(" ")
                }
                i = 1;
                var e = arguments;
                var o = e.length;
                var s = String(t).replace(R, (function(t) {
                    if ("%%" === t) return "%";
                    if (i >= o) return t;
                    switch (t) {
                        case "%s":
                            return String(e[i++]);
                        case "%d":
                            return Number(e[i++]);
                        case "%j":
                            try {
                                return JSON.stringify(e[i++])
                            } catch (t) {
                                return "[Circular]"
                            }
                        default:
                            return t
                    }
                }));
                for (var a = e[i]; i < o; a = e[++i]) p(a) || !S(a) ? s += " " + a : s += " " + r(a);
                return s
            }, n.deprecate = function(t, r) {
                function e() {
                    if (!o) {
                        if (D.throwDeprecation) throw new Error(r);
                        D.traceDeprecation, o = !0
                    }
                    return t.apply(this, arguments)
                }
                if (b(i.g.process)) return function() {
                    return n.deprecate(t, r).apply(this, arguments)
                };
                if (!0 === D.noDeprecation) return t;
                var o = !1;
                return e
            };
            var P = {};
            var j;
            n.debuglog = function(t) {
                return b(j) && (j = D.env.NODE_DEBUG || ""), t = t.toUpperCase(), P[t] || (new RegExp("\\b" + t + "\\b", "i").test(j) ? (D.pid, P[t] = function() {
                    n.format.apply(n, arguments)
                }) : P[t] = function() {}), P[t]
            }, n.inspect = r, r.colors = {
                bold: [1, 22],
                italic: [3, 23],
                underline: [4, 24],
                inverse: [7, 27],
                white: [37, 39],
                grey: [90, 39],
                black: [30, 39],
                blue: [34, 39],
                cyan: [36, 39],
                green: [32, 39],
                magenta: [35, 39],
                red: [31, 39],
                yellow: [33, 39]
            }, r.styles = {
                special: "cyan",
                number: "yellow",
                boolean: "yellow",
                undefined: "grey",
                null: "bold",
                string: "green",
                date: "magenta",
                regexp: "red"
            }, n.isArray = d, n.isBoolean = v, n.isNull = p, n.isNullOrUndefined = w, n.isNumber = g, n.isString = m, n.isSymbol = y, n.isUndefined = b, n.isRegExp = k, n.isObject = S, n.isDate = T, n.isError = A, n.isFunction = I, n.isPrimitive = C, n.isBuffer = i(2974), n.log = function() {}, n.inherits = i(1725), n._extend = function(t, n) {
                if (!n || !S(n)) return t;
                var i = Object.keys(n);
                var r = i.length;
                for (; r--;) t[i[r]] = n[i[r]];
                return t
            }
        },
        4155: t => {
            function n() {
                throw new Error("setTimeout has not been defined")
            }
    
            function i() {
                throw new Error("clearTimeout has not been defined")
            }
    
            function r(t) {
                if (h === setTimeout) return setTimeout(t, 0);
                if ((h === n || !h) && setTimeout) return h = setTimeout, setTimeout(t, 0);
                try {
                    return h(t, 0)
                } catch (n) {
                    try {
                        return h.call(null, t, 0)
                    } catch (n) {
                        return h.call(this, t, 0)
                    }
                }
            }
    
            function e(t) {
                if (f === clearTimeout) return clearTimeout(t);
                if ((f === i || !f) && clearTimeout) return f = clearTimeout, clearTimeout(t);
                try {
                    return f(t)
                } catch (n) {
                    try {
                        return f.call(null, t)
                    } catch (n) {
                        return f.call(this, t)
                    }
                }
            }
    
            function o() {
                d && v && (d = !1, v.length ? l = v.concat(l) : p = -1, l.length && s())
            }
    
            function s() {
                if (!d) {
                    var t = r(o);
                    d = !0;
                    var n = l.length;
                    for (; n;) {
                        for (v = l, l = []; ++p < n;) v && v[p].run();
                        p = -1, n = l.length
                    }
                    v = null, d = !1, e(t)
                }
            }
    
            function a(t, n) {
                this.fun = t, this.array = n
            }
    
            function u() {}
            var c = t.exports = {};
            var h;
            var f;
            ! function() {
                try {
                    h = "function" == typeof setTimeout ? setTimeout : n
                } catch (t) {
                    h = n
                }
                try {
                    f = "function" == typeof clearTimeout ? clearTimeout : i
                } catch (t) {
                    f = i
                }
            }();
            var l = [];
            var d = !1;
            var v;
            var p = -1;
            c.nextTick = function(t) {
                var n = new Array(arguments.length - 1);
                if (arguments.length > 1)
                    for (var i = 1; i < arguments.length; i++) n[i - 1] = arguments[i];
                l.push(new a(t, n)), 1 !== l.length || d || r(s)
            }, a.prototype.run = function() {
                this.fun.apply(null, this.array)
            }, c.title = "browser", c.browser = !0, c.env = {}, c.argv = [], c.version = "", c.versions = {}, c.on = u, c.addListener = u, c.once = u, c.off = u, c.removeListener = u, c.removeAllListeners = u, c.emit = u, c.prependListener = u, c.prependOnceListener = u, c.listeners = function(t) {
                return []
            }, c.binding = function(t) {
                throw new Error("process.binding is not supported")
            }, c.cwd = function() {
                return "/"
            }, c.chdir = function(t) {
                throw new Error("process.chdir is not supported")
            }, c.umask = function() {
                return 0
            }
        },
        2974: t => {
            t.exports = function(t) {
                return t && "object" == typeof t && "function" == typeof t.copy && "function" == typeof t.fill && "function" == typeof t.readUInt8
            }
        },
        1725: t => {
            "function" == typeof Object.create ? t.exports = function(t, n) {
                t.super_ = n, t.prototype = Object.create(n.prototype, {
                    constructor: {
                        value: t,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                })
            } : t.exports = function(t, n) {
                t.super_ = n;
                var i = function() {};
                i.prototype = n.prototype, t.prototype = new i, t.prototype.constructor = t
            }
        },
        1195: function(t, n, i) {
            t = i.nmd(t);
            var r = i(4155);
            var e;
            e = function(n) {
                "use strict";
    
                function e(t, n) {
                    n |= 0;
                    var i = Math.max(t.length - n, 0);
                    var r = Array(i);
                    for (var e = 0; e < i; e++) r[e] = t[n + e];
                    return r
                }
    
                function o(t) {
                    var n = typeof t;
                    return null != t && ("object" == n || "function" == n)
                }
    
                function s(t) {
                    setTimeout(t, 0)
                }
    
                function a(t) {
                    return function(n) {
                        var i = e(arguments, 1);
                        t((function() {
                            n.apply(null, i)
                        }))
                    }
                }
    
                function u(t) {
                    return dn((function(n, i) {
                        var r;
                        try {
                            r = t.apply(this, n)
                        } catch (t) {
                            return i(t)
                        }
                        o(r) && "function" == typeof r.then ? r.then((function(t) {
                            c(i, null, t)
                        }), (function(t) {
                            c(i, t.message ? t : new Error(t))
                        })) : i(null, r)
                    }))
                }
    
                function c(t, n, i) {
                    try {
                        t(n, i)
                    } catch (t) {
                        wn(h, t)
                    }
                }
    
                function h(t) {
                    throw t
                }
    
                function f(t) {
                    return gn && "AsyncFunction" === t[Symbol.toStringTag]
                }
    
                function l(t) {
                    return f(t) ? u(t) : t
                }
    
                function d(t) {
                    return function(n) {
                        var i = e(arguments, 1);
                        var r = dn((function(i, r) {
                            var e = this;
                            return t(n, (function(t, n) {
                                l(t).apply(e, i.concat(n))
                            }), r)
                        }));
                        return i.length ? r.apply(this, i) : r
                    }
                }
    
                function v(t) {
                    var n = Tn.call(t, In),
                        i = t[In];
                    try {
                        t[In] = void 0;
                        var r = !0
                    } catch (t) {}
                    var e = An.call(t);
                    return r && (n ? t[In] = i : delete t[In]), e
                }
    
                function p(t) {
                    return Cn.call(t)
                }
    
                function w(t) {
                    return null == t ? void 0 === t ? On : En : Dn && Dn in Object(t) ? v(t) : p(t)
                }
    
                function g(t) {
                    if (!o(t)) return !1;
                    var n = w(t);
                    return n == Pn || n == jn || n == Rn || n == xn
                }
    
                function m(t) {
                    return "number" == typeof t && t > -1 && t % 1 == 0 && t <= Nn
                }
    
                function y(t) {
                    return null != t && m(t.length) && !g(t)
                }
    
                function b() {}
    
                function k(t) {
                    return function() {
                        if (null !== t) {
                            var n = t;
                            t = null, n.apply(this, arguments)
                        }
                    }
                }
    
                function S(t, n) {
                    var i = -1,
                        r = Array(t);
                    for (; ++i < t;) r[i] = n(i);
                    return r
                }
    
                function T(t) {
                    return null != t && "object" == typeof t
                }
    
                function A(t) {
                    return T(t) && w(t) == Un
                }
    
                function I() {
                    return !1
                }
    
                function C(t, n) {
                    var i = typeof t;
                    return !!(n = null == n ? Yn : n) && ("number" == i || "symbol" != i && Xn.test(t)) && t > -1 && t % 1 == 0 && t < n
                }
    
                function E(t) {
                    return T(t) && m(t.length) && !!ki[w(t)]
                }
    
                function O(t) {
                    return function(n) {
                        return t(n)
                    }
                }
    
                function D(t, n) {
                    var i = Gn(t),
                        r = !i && qn(t),
                        e = !i && !r && Jn(t),
                        o = !i && !r && !e && Ei(t),
                        s = i || r || e || o,
                        a = s ? S(t.length, String) : [],
                        u = a.length;
                    for (var c in t) !n && !Oi.call(t, c) || s && ("length" == c || e && ("offset" == c || "parent" == c) || o && ("buffer" == c || "byteLength" == c || "byteOffset" == c) || C(c, u)) || a.push(c);
                    return a
                }
    
                function R(t) {
                    var n = t && t.constructor;
                    return t === ("function" == typeof n && n.prototype || Di)
                }
    
                function P(t, n) {
                    return function(i) {
                        return t(n(i))
                    }
                }
    
                function j(t) {
                    if (!R(t)) return Ri(t);
                    var n = [];
                    for (var i in Object(t)) Pi.call(t, i) && "constructor" != i && n.push(i);
                    return n
                }
    
                function x(t) {
                    return y(t) ? D(t) : j(t)
                }
    
                function N(t) {
                    var n = -1;
                    var i = t.length;
                    return function() {
                        return ++n < i ? {
                            value: t[n],
                            key: n
                        } : null
                    }
                }
    
                function M(t) {
                    var n = -1;
                    return function() {
                        var i = t.next();
                        return i.done ? null : (n++, {
                            value: i.value,
                            key: n
                        })
                    }
                }
    
                function F(t) {
                    var n = x(t);
                    var i = -1;
                    var r = n.length;
                    return function() {
                        var e = n[++i];
                        return i < r ? {
                            value: t[e],
                            key: e
                        } : null
                    }
                }
    
                function L(t) {
                    if (y(t)) return N(t);
                    var n = Ln(t);
                    return n ? M(n) : F(t)
                }
    
                function U(t) {
                    return function() {
                        if (null === t) throw new Error("Callback was already called.");
                        var n = t;
                        t = null, n.apply(this, arguments)
                    }
                }
    
                function B(t) {
                    return function(n, i, r) {
                        function e(t, n) {
                            if (u -= 1, t) a = !0, r(t);
                            else {
                                if (n === Mn || a && u <= 0) return a = !0, r(null);
                                c || o()
                            }
                        }
    
                        function o() {
                            for (c = !0; u < t && !a;) {
                                var n = s();
                                if (null === n) return a = !0, void(u <= 0 && r(null));
                                u += 1, i(n.value, n.key, U(e))
                            }
                            c = !1
                        }
                        if (r = k(r || b), t <= 0 || !n) return r(null);
                        var s = L(n);
                        var a = !1;
                        var u = 0;
                        var c = !1;
                        o()
                    }
                }
    
                function W(t, n, i, r) {
                    B(n)(t, l(i), r)
                }
    
                function V(t, n) {
                    return function(i, r, e) {
                        return t(i, n, r, e)
                    }
                }
    
                function q(t, n, i) {
                    function r(t, n) {
                        t ? i(t) : ++o !== s && n !== Mn || i(null)
                    }
                    i = k(i || b);
                    var e = 0,
                        o = 0,
                        s = t.length;
                    for (0 === s && i(null); e < s; e++) n(t[e], e, U(r))
                }
    
                function G(t) {
                    return function(n, i, r) {
                        return t(xi, n, l(i), r)
                    }
                }
    
                function H(t, n, i, r) {
                    r = r || b, n = n || [];
                    var e = [];
                    var o = 0;
                    var s = l(i);
                    t(n, (function(t, n, i) {
                        var r = o++;
                        s(t, (function(t, n) {
                            e[r] = n, i(t)
                        }))
                    }), (function(t) {
                        r(t, e)
                    }))
                }
    
                function z(t) {
                    return function(n, i, r, e) {
                        return t(B(i), n, l(r), e)
                    }
                }
    
                function K(t, n) {
                    var i = -1,
                        r = null == t ? 0 : t.length;
                    for (; ++i < r && !1 !== n(t[i], i, t););
                    return t
                }
    
                function J(t) {
                    return function(n, i, r) {
                        var e = -1,
                            o = Object(n),
                            s = r(n),
                            a = s.length;
                        for (; a--;) {
                            var u = s[t ? a : ++e];
                            if (!1 === i(o[u], u, o)) break
                        }
                        return n
                    }
                }
    
                function Y(t, n) {
                    return t && Bi(t, n, x)
                }
    
                function X(t, n, i, r) {
                    var e = t.length,
                        o = i + (r ? 1 : -1);
                    for (; r ? o-- : ++o < e;)
                        if (n(t[o], o, t)) return o;
                    return -1
                }
    
                function Z(t) {
                    return t != t
                }
    
                function Q(t, n, i) {
                    var r = i - 1,
                        e = t.length;
                    for (; ++r < e;)
                        if (t[r] === n) return r;
                    return -1
                }
    
                function tt(t, n, i) {
                    return n == n ? Q(t, n, i) : X(t, Z, i)
                }
    
                function nt(t, n) {
                    var i = -1,
                        r = null == t ? 0 : t.length,
                        e = Array(r);
                    for (; ++i < r;) e[i] = n(t[i], i, t);
                    return e
                }
    
                function it(t) {
                    return "symbol" == typeof t || T(t) && w(t) == Vi
                }
    
                function rt(t) {
                    if ("string" == typeof t) return t;
                    if (Gn(t)) return nt(t, rt) + "";
                    if (it(t)) return Hi ? Hi.call(t) : "";
                    var n = t + "";
                    return "0" == n && 1 / t == -qi ? "-0" : n
                }
    
                function et(t, n, i) {
                    var r = -1,
                        e = t.length;
                    n < 0 && (n = -n > e ? 0 : e + n), (i = i > e ? e : i) < 0 && (i += e), e = n > i ? 0 : i - n >>> 0, n >>>= 0;
                    var o = Array(e);
                    for (; ++r < e;) o[r] = t[r + n];
                    return o
                }
    
                function ot(t, n, i) {
                    var r = t.length;
                    return i = void 0 === i ? r : i, !n && i >= r ? t : et(t, n, i)
                }
    
                function st(t, n) {
                    var i = t.length;
                    for (; i-- && tt(n, t[i], 0) > -1;);
                    return i
                }
    
                function at(t, n) {
                    var i = -1,
                        r = t.length;
                    for (; ++i < r && tt(n, t[i], 0) > -1;);
                    return i
                }
    
                function ut(t) {
                    return t.split("")
                }
    
                function ct(t) {
                    return zi.test(t)
                }
    
                function ht(t) {
                    return t.match(or) || []
                }
    
                function ft(t) {
                    return ct(t) ? ht(t) : ut(t)
                }
    
                function lt(t) {
                    return null == t ? "" : rt(t)
                }
    
                function dt(t, n, i) {
                    if ((t = lt(t)) && (i || void 0 === n)) return t.replace(sr, "");
                    if (!t || !(n = rt(n))) return t;
                    var r = ft(t),
                        e = ft(n);
                    return ot(r, at(r, e), st(r, e) + 1).join("")
                }
    
                function vt(t) {
                    return (t = (t = (t = t.toString().replace(hr, "")).match(ar)[2].replace(" ", "")) ? t.split(ur) : []).map((function(t) {
                        return dt(t.replace(cr, ""))
                    }))
                }
    
                function pt(t, n) {
                    var i = {};
                    Y(t, (function(t, n) {
                        function r(n, i) {
                            var r = nt(e, (function(t) {
                                return n[t]
                            }));
                            r.push(i), l(t).apply(null, r)
                        }
                        var e;
                        var o = f(t);
                        var s = !o && 1 === t.length || o && 0 === t.length;
                        if (Gn(t)) e = t.slice(0, -1), t = t[t.length - 1], i[n] = e.concat(e.length > 0 ? r : t);
                        else if (s) i[n] = t;
                        else {
                            if (e = vt(t), 0 === t.length && !o && 0 === e.length) throw new Error("autoInject task functions require explicit parameters.");
                            o || e.pop(), i[n] = e.concat(r)
                        }
                    })), Wi(i, n)
                }
    
                function wt() {
                    this.head = this.tail = null, this.length = 0
                }
    
                function gt(t, n) {
                    t.length = 1, t.head = t.tail = n
                }
    
                function mt(t, n, i) {
                    function r(t, n, i) {
                        if (null != i && "function" != typeof i) throw new Error("task callback must be a function");
                        if (h.started = !0, Gn(t) || (t = [t]), 0 === t.length && h.idle()) return wn((function() {
                            h.drain()
                        }));
                        for (var r = 0, e = t.length; r < e; r++) {
                            var o = {
                                data: t[r],
                                callback: i || b
                            };
                            n ? h._tasks.unshift(o) : h._tasks.push(o)
                        }
                        u || (u = !0, wn((function() {
                            u = !1, h.process()
                        })))
                    }
    
                    function e(t) {
                        return function(n) {
                            s -= 1;
                            for (var i = 0, r = t.length; i < r; i++) {
                                var e = t[i];
                                var o = tt(a, e, 0);
                                0 === o ? a.shift() : o > 0 && a.splice(o, 1), e.callback.apply(e, arguments), null != n && h.error(n, e.data)
                            }
                            s <= h.concurrency - h.buffer && h.unsaturated(), h.idle() && h.drain(), h.process()
                        }
                    }
                    if (null == n) n = 1;
                    else if (0 === n) throw new Error("Concurrency must not be zero");
                    var o = l(t);
                    var s = 0;
                    var a = [];
                    var u = !1;
                    var c = !1;
                    var h = {
                        _tasks: new wt,
                        concurrency: n,
                        payload: i,
                        saturated: b,
                        unsaturated: b,
                        buffer: n / 4,
                        empty: b,
                        drain: b,
                        error: b,
                        started: !1,
                        paused: !1,
                        push: function(t, n) {
                            r(t, !1, n)
                        },
                        kill: function() {
                            h.drain = b, h._tasks.empty()
                        },
                        unshift: function(t, n) {
                            r(t, !0, n)
                        },
                        remove: function(t) {
                            h._tasks.remove(t)
                        },
                        process: function() {
                            if (!c) {
                                for (c = !0; !h.paused && s < h.concurrency && h._tasks.length;) {
                                    var t = [],
                                        n = [];
                                    var i = h._tasks.length;
                                    h.payload && (i = Math.min(i, h.payload));
                                    for (var r = 0; r < i; r++) {
                                        var u = h._tasks.shift();
                                        t.push(u), a.push(u), n.push(u.data)
                                    }
                                    s += 1, 0 === h._tasks.length && h.empty(), s === h.concurrency && h.saturated();
                                    var f = U(e(t));
                                    o(n, f)
                                }
                                c = !1
                            }
                        },
                        length: function() {
                            return h._tasks.length
                        },
                        running: function() {
                            return s
                        },
                        workersList: function() {
                            return a
                        },
                        idle: function() {
                            return h._tasks.length + s === 0
                        },
                        pause: function() {
                            h.paused = !0
                        },
                        resume: function() {
                            !1 !== h.paused && (h.paused = !1, wn(h.process))
                        }
                    };
                    return h
                }
    
                function yt(t, n) {
                    return mt(t, 1, n)
                }
    
                function bt(t, n, i, r) {
                    r = k(r || b);
                    var e = l(i);
                    fr(t, (function(t, i, r) {
                        e(n, t, (function(t, i) {
                            n = i, r(t)
                        }))
                    }), (function(t) {
                        r(t, n)
                    }))
                }
    
                function kt() {
                    var t = nt(arguments, l);
                    return function() {
                        var n = e(arguments);
                        var i = this;
                        var r = n[n.length - 1];
                        "function" == typeof r ? n.pop() : r = b, bt(t, n, (function(t, n, r) {
                            n.apply(i, t.concat((function(t) {
                                var n = e(arguments, 1);
                                r(t, n)
                            })))
                        }), (function(t, n) {
                            r.apply(i, [t].concat(n))
                        }))
                    }
                }
    
                function St(t) {
                    return t
                }
    
                function Tt(t, n) {
                    return function(i, r, e, o) {
                        o = o || b;
                        var s = !1;
                        var a;
                        i(r, (function(i, r, o) {
                            e(i, (function(r, e) {
                                r ? o(r) : t(e) && !a ? (s = !0, a = n(!0, i), o(null, Mn)) : o()
                            }))
                        }), (function(t) {
                            t ? o(t) : o(null, s ? a : n(!1))
                        }))
                    }
                }
    
                function At(t, n) {
                    return n
                }
    
                function It(t) {
                    return function(n) {
                        var i = e(arguments, 1);
                        i.push((function(n) {
                            var i = e(arguments, 1);
                            "object" == typeof console && (n ? console.error : console[t] && K(i, (function(t) {})))
                        })), l(n).apply(null, i)
                    }
                }
    
                function Ct(t, n, i) {
                    function r(t) {
                        if (t) return i(t);
                        var n = e(arguments, 1);
                        n.push(o), a.apply(this, n)
                    }
    
                    function o(t, n) {
                        return t ? i(t) : n ? void s(r) : i(null)
                    }
                    i = U(i || b);
                    var s = l(t);
                    var a = l(n);
                    o(null, !0)
                }
    
                function Et(t, n, i) {
                    i = U(i || b);
                    var r = l(t);
                    var o = function(t) {
                        if (t) return i(t);
                        var s = e(arguments, 1);
                        if (n.apply(this, s)) return r(o);
                        i.apply(null, [null].concat(s))
                    };
                    r(o)
                }
    
                function Ot(t, n, i) {
                    Et(t, (function() {
                        return !n.apply(this, arguments)
                    }), i)
                }
    
                function Dt(t, n, i) {
                    function r(t) {
                        if (t) return i(t);
                        s(e)
                    }
    
                    function e(t, n) {
                        return t ? i(t) : n ? void o(r) : i(null)
                    }
                    i = U(i || b);
                    var o = l(n);
                    var s = l(t);
                    s(e)
                }
    
                function Rt(t) {
                    return function(n, i, r) {
                        return t(n, r)
                    }
                }
    
                function Pt(t, n, i) {
                    xi(t, Rt(l(n)), i)
                }
    
                function jt(t, n, i, r) {
                    B(n)(t, Rt(l(i)), r)
                }
    
                function xt(t) {
                    return f(t) ? t : dn((function(n, i) {
                        var r = !0;
                        n.push((function() {
                            var t = arguments;
                            r ? wn((function() {
                                i.apply(null, t)
                            })) : i.apply(null, t)
                        })), t.apply(this, n), r = !1
                    }))
                }
    
                function Nt(t) {
                    return !t
                }
    
                function Mt(t) {
                    return function(n) {
                        return null == n ? void 0 : n[t]
                    }
                }
    
                function Ft(t, n, i, r) {
                    var e = new Array(n.length);
                    t(n, (function(t, n, r) {
                        i(t, (function(t, i) {
                            e[n] = !!i, r(t)
                        }))
                    }), (function(t) {
                        if (t) return r(t);
                        var i = [];
                        for (var o = 0; o < n.length; o++) e[o] && i.push(n[o]);
                        r(null, i)
                    }))
                }
    
                function Lt(t, n, i, r) {
                    var e = [];
                    t(n, (function(t, n, r) {
                        i(t, (function(i, o) {
                            i ? r(i) : (o && e.push({
                                index: n,
                                value: t
                            }), r())
                        }))
                    }), (function(t) {
                        t ? r(t) : r(null, nt(e.sort((function(t, n) {
                            return t.index - n.index
                        })), Mt("value")))
                    }))
                }
    
                function Ut(t, n, i, r) {
                    (y(n) ? Ft : Lt)(t, n, l(i), r || b)
                }
    
                function Bt(t, n) {
                    function i(t) {
                        if (t) return r(t);
                        e(i)
                    }
                    var r = U(n || b);
                    var e = l(xt(t));
                    i()
                }
    
                function Wt(t, n, i, r) {
                    r = k(r || b);
                    var e = {};
                    var o = l(i);
                    W(t, n, (function(t, n, i) {
                        o(t, n, (function(t, r) {
                            if (t) return i(t);
                            e[n] = r, i()
                        }))
                    }), (function(t) {
                        r(t, e)
                    }))
                }
    
                function Vt(t, n) {
                    return n in t
                }
    
                function qt(t, n) {
                    var i = Object.create(null);
                    var r = Object.create(null);
                    n = n || St;
                    var o = l(t);
                    var s = dn((function(t, s) {
                        var a = n.apply(null, t);
                        Vt(i, a) ? wn((function() {
                            s.apply(null, i[a])
                        })) : Vt(r, a) ? r[a].push(s) : (r[a] = [s], o.apply(null, t.concat((function() {
                            var t = e(arguments);
                            i[a] = t;
                            var n = r[a];
                            delete r[a];
                            for (var o = 0, s = n.length; o < s; o++) n[o].apply(null, t)
                        }))))
                    }));
                    return s.memo = i, s.unmemoized = t, s
                }
    
                function Gt(t, n, i) {
                    i = i || b;
                    var r = y(n) ? [] : {};
                    t(n, (function(t, n, i) {
                        l(t)((function(t, o) {
                            arguments.length > 2 && (o = e(arguments, 1)), r[n] = o, i(t)
                        }))
                    }), (function(t) {
                        i(t, r)
                    }))
                }
    
                function Ht(t, n) {
                    Gt(xi, t, n)
                }
    
                function zt(t, n, i) {
                    Gt(B(n), t, i)
                }
    
                function Kt(t, n) {
                    if (n = k(n || b), !Gn(t)) return n(new TypeError("First argument to race must be an array of functions"));
                    if (!t.length) return n();
                    for (var i = 0, r = t.length; i < r; i++) l(t[i])(n)
                }
    
                function Jt(t, n, i, r) {
                    bt(e(t).reverse(), n, i, r)
                }
    
                function Yt(t) {
                    var n = l(t);
                    return dn((function(t, i) {
                        return t.push((function(t, n) {
                            var r;
                            t ? i(null, {
                                error: t
                            }) : (r = arguments.length <= 2 ? n : e(arguments, 1), i(null, {
                                value: r
                            }))
                        })), n.apply(this, t)
                    }))
                }
    
                function Xt(t) {
                    var n;
                    return Gn(t) ? n = nt(t, Yt) : (n = {}, Y(t, (function(t, i) {
                        n[i] = Yt.call(this, t)
                    }))), n
                }
    
                function Zt(t, n, i, r) {
                    Ut(t, n, (function(t, n) {
                        i(t, (function(t, i) {
                            n(t, !i)
                        }))
                    }), r)
                }
    
                function Qt(t) {
                    return function() {
                        return t
                    }
                }
    
                function tn(t, n, i) {
                    function r(t, n) {
                        if ("object" == typeof n) t.times = +n.times || o, t.intervalFunc = "function" == typeof n.interval ? n.interval : Qt(+n.interval || s), t.errorFilter = n.errorFilter;
                        else {
                            if ("number" != typeof n && "string" != typeof n) throw new Error("Invalid arguments for async.retry");
                            t.times = +n || o
                        }
                    }
    
                    function e() {
                        u((function(t) {
                            t && c++ < a.times && ("function" != typeof a.errorFilter || a.errorFilter(t)) ? setTimeout(e, a.intervalFunc(c)) : i.apply(null, arguments)
                        }))
                    }
                    var o = 5;
                    var s = 0;
                    var a = {
                        times: o,
                        intervalFunc: Qt(s)
                    };
                    if (arguments.length < 3 && "function" == typeof t ? (i = n || b, n = t) : (r(a, t), i = i || b), "function" != typeof n) throw new Error("Invalid arguments for async.retry");
                    var u = l(n);
                    var c = 1;
                    e()
                }
    
                function nn(t, n) {
                    Gt(fr, t, n)
                }
    
                function rn(t, n, i) {
                    function r(t, n) {
                        var i = t.criteria,
                            r = n.criteria;
                        return i < r ? -1 : i > r ? 1 : 0
                    }
                    var e = l(n);
                    Ni(t, (function(t, n) {
                        e(t, (function(i, r) {
                            if (i) return n(i);
                            n(null, {
                                value: t,
                                criteria: r
                            })
                        }))
                    }), (function(t, n) {
                        if (t) return i(t);
                        i(null, nt(n.sort(r), Mt("value")))
                    }))
                }
    
                function en(t, n, i) {
                    var r = l(t);
                    return dn((function(e, o) {
                        function s() {
                            var n = t.name || "anonymous";
                            var r = new Error('Callback function "' + n + '" timed out.');
                            r.code = "ETIMEDOUT", i && (r.info = i), a = !0, o(r)
                        }
                        var a = !1;
                        var u;
                        e.push((function() {
                            a || (o.apply(null, arguments), clearTimeout(u))
                        })), u = setTimeout(s, n), r.apply(null, e)
                    }))
                }
    
                function on(t, n, i, r) {
                    var e = -1,
                        o = Kr(zr((n - t) / (i || 1)), 0),
                        s = Array(o);
                    for (; o--;) s[r ? o : ++e] = t, t += i;
                    return s
                }
    
                function sn(t, n, i, r) {
                    var e = l(i);
                    Fi(on(0, t, 1), n, e, r)
                }
    
                function an(t, n, i, r) {
                    arguments.length <= 3 && (r = i, i = n, n = Gn(t) ? [] : {}), r = k(r || b);
                    var e = l(i);
                    xi(t, (function(t, i, r) {
                        e(n, t, i, r)
                    }), (function(t) {
                        r(t, n)
                    }))
                }
    
                function un(t, n) {
                    var i = null;
                    var r;
                    n = n || b, Sr(t, (function(t, n) {
                        l(t)((function(t, o) {
                            r = arguments.length > 2 ? e(arguments, 1) : o, i = t, n(!t)
                        }))
                    }), (function() {
                        n(i, r)
                    }))
                }
    
                function cn(t) {
                    return function() {
                        return (t.unmemoized || t).apply(null, arguments)
                    }
                }
    
                function hn(t, n, i) {
                    i = U(i || b);
                    var r = l(n);
                    if (!t()) return i(null);
                    var o = function(n) {
                        if (n) return i(n);
                        if (t()) return r(o);
                        var s = e(arguments, 1);
                        i.apply(null, [null].concat(s))
                    };
                    r(o)
                }
    
                function fn(t, n, i) {
                    hn((function() {
                        return !t.apply(this, arguments)
                    }), n, i)
                }
                var ln = function(t) {
                    var n = e(arguments, 1);
                    return function() {
                        var i = e(arguments);
                        return t.apply(null, n.concat(i))
                    }
                };
                var dn = function(t) {
                    return function() {
                        var n = e(arguments);
                        var i = n.pop();
                        t.call(this, n, i)
                    }
                };
                var vn = "function" == typeof setImmediate && setImmediate;
                var pn = "object" == typeof r && "function" == typeof r.nextTick;
                var wn = a(vn ? setImmediate : pn ? r.nextTick : s);
                var gn = "function" == typeof Symbol;
                var mn = "object" == typeof i.g && i.g && i.g.Object === Object && i.g;
                var yn = "object" == typeof self && self && self.Object === Object && self;
                var bn = mn || yn || Function("return this")();
                var kn = bn.Symbol;
                var Sn = Object.prototype;
                var Tn = Sn.hasOwnProperty;
                var An = Sn.toString;
                var In = kn ? kn.toStringTag : void 0;
                var Cn = Object.prototype.toString;
                var En = "[object Null]";
                var On = "[object Undefined]";
                var Dn = kn ? kn.toStringTag : void 0;
                var Rn = "[object AsyncFunction]";
                var Pn = "[object Function]";
                var jn = "[object GeneratorFunction]";
                var xn = "[object Proxy]";
                var Nn = 9007199254740991;
                var Mn = {};
                var Fn = "function" == typeof Symbol && Symbol.iterator;
                var Ln = function(t) {
                    return Fn && t[Fn] && t[Fn]()
                };
                var Un = "[object Arguments]";
                var Bn = Object.prototype;
                var Wn = Bn.hasOwnProperty;
                var Vn = Bn.propertyIsEnumerable;
                var qn = A(function() {
                    return arguments
                }()) ? A : function(t) {
                    return T(t) && Wn.call(t, "callee") && !Vn.call(t, "callee")
                };
                var Gn = Array.isArray;
                var Hn = "object" == typeof n && n && !n.nodeType && n;
                var zn = Hn && t && !t.nodeType && t;
                var Kn = zn && zn.exports === Hn ? bn.Buffer : void 0;
                var Jn = (Kn ? Kn.isBuffer : void 0) || I;
                var Yn = 9007199254740991;
                var Xn = /^(?:0|[1-9]\d*)$/;
                var Zn = "[object Arguments]";
                var Qn = "[object Array]";
                var ti = "[object Boolean]";
                var ni = "[object Date]";
                var ii = "[object Error]";
                var ri = "[object Function]";
                var ei = "[object Map]";
                var oi = "[object Number]";
                var si = "[object Object]";
                var ai = "[object RegExp]";
                var ui = "[object Set]";
                var ci = "[object String]";
                var hi = "[object WeakMap]";
                var fi = "[object ArrayBuffer]";
                var li = "[object DataView]";
                var di = "[object Float64Array]";
                var vi = "[object Int8Array]";
                var pi = "[object Int16Array]";
                var wi = "[object Int32Array]";
                var gi = "[object Uint8Array]";
                var mi = "[object Uint8ClampedArray]";
                var yi = "[object Uint16Array]";
                var bi = "[object Uint32Array]";
                var ki = {};
                ki["[object Float32Array]"] = ki[di] = ki[vi] = ki[pi] = ki[wi] = ki[gi] = ki[mi] = ki[yi] = ki[bi] = !0, ki[Zn] = ki[Qn] = ki[fi] = ki[ti] = ki[li] = ki[ni] = ki[ii] = ki[ri] = ki[ei] = ki[oi] = ki[si] = ki[ai] = ki[ui] = ki[ci] = ki[hi] = !1;
                var Si = "object" == typeof n && n && !n.nodeType && n;
                var Ti = Si && t && !t.nodeType && t;
                var Ai = Ti && Ti.exports === Si && mn.process;
                var Ii = function() {
                    try {
                        return Ti && Ti.require && Ti.require("util").types || Ai && Ai.binding && Ai.binding("util")
                    } catch (t) {}
                }();
                var Ci = Ii && Ii.isTypedArray;
                var Ei = Ci ? O(Ci) : E;
                var Oi = Object.prototype.hasOwnProperty;
                var Di = Object.prototype;
                var Ri = P(Object.keys, Object);
                var Pi = Object.prototype.hasOwnProperty;
                var ji = V(W, 1 / 0);
                var xi = function(t, n, i) {
                    (y(t) ? q : ji)(t, l(n), i)
                };
                var Ni = G(H);
                var Mi = d(Ni);
                var Fi = z(H);
                var Li = V(Fi, 1);
                var Ui = d(Li);
                var Bi = J();
                var Wi = function(t, n, i) {
                    function r(t, n) {
                        g.push((function() {
                            u(t, n)
                        }))
                    }
    
                    function o() {
                        if (0 === g.length && 0 === v) return i(null, d);
                        for (; g.length && v < n;) g.shift()()
                    }
    
                    function s(t, n) {
                        var i = w[t];
                        i || (i = w[t] = []), i.push(n)
                    }
    
                    function a(t) {
                        K(w[t] || [], (function(t) {
                            t()
                        })), o()
                    }
    
                    function u(t, n) {
                        if (!p) {
                            var r = U((function(n, r) {
                                if (v--, arguments.length > 2 && (r = e(arguments, 1)), n) {
                                    var o = {};
                                    Y(d, (function(t, n) {
                                        o[n] = t
                                    })), o[t] = r, p = !0, w = Object.create(null), i(n, o)
                                } else d[t] = r, a(t)
                            }));
                            v++;
                            var o = l(n[n.length - 1]);
                            n.length > 1 ? o(d, r) : o(r)
                        }
                    }
    
                    function c() {
                        var t = 0;
                        for (; m.length;) t++, K(h(m.pop()), (function(t) {
                            0 == --y[t] && m.push(t)
                        }));
                        if (t !== f) throw new Error("async.auto cannot execute tasks due to a recursive dependency")
                    }
    
                    function h(n) {
                        var i = [];
                        return Y(t, (function(t, r) {
                            Gn(t) && tt(t, n, 0) >= 0 && i.push(r)
                        })), i
                    }
                    "function" == typeof n && (i = n, n = null), i = k(i || b);
                    var f = x(t).length;
                    if (!f) return i(null);
                    n || (n = f);
                    var d = {};
                    var v = 0;
                    var p = !1;
                    var w = Object.create(null);
                    var g = [];
                    var m = [];
                    var y = {};
                    Y(t, (function(n, i) {
                        if (!Gn(n)) return r(i, [n]), void m.push(i);
                        var e = n.slice(0, n.length - 1);
                        var o = e.length;
                        if (0 === o) return r(i, n), void m.push(i);
                        y[i] = o, K(e, (function(a) {
                            if (!t[a]) throw new Error("async.auto task `" + i + "` has a non-existent dependency `" + a + "` in " + e.join(", "));
                            s(a, (function() {
                                0 == --o && r(i, n)
                            }))
                        }))
                    })), c(), o()
                };
                var Vi = "[object Symbol]";
                var qi = 1 / 0;
                var Gi = kn ? kn.prototype : void 0;
                var Hi = Gi ? Gi.toString : void 0;
                var zi = RegExp("[\\u200d\\ud800-\\udfff\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff\\ufe0e\\ufe0f]");
                var Ki = "\\ud800-\\udfff";
                var Ji = "[" + Ki + "]";
                var Yi = "[\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff]";
                var Xi = "\\ud83c[\\udffb-\\udfff]";
                var Zi = "[^" + Ki + "]";
                var Qi = "(?:\\ud83c[\\udde6-\\uddff]){2}";
                var tr = "[\\ud800-\\udbff][\\udc00-\\udfff]";
                var nr = "(?:" + Yi + "|" + Xi + ")?";
                var ir = "[\\ufe0e\\ufe0f]?";
                var rr = ir + nr + "(?:\\u200d(?:" + [Zi, Qi, tr].join("|") + ")" + ir + nr + ")*";
                var er = "(?:" + [Zi + Yi + "?", Yi, Qi, tr, Ji].join("|") + ")";
                var or = RegExp(Xi + "(?=" + Xi + ")|" + er + rr, "g");
                var sr = /^\s+|\s+$/g;
                var ar = /^(?:async\s+)?(function)?\s*[^\(]*\(\s*([^\)]*)\)/m;
                var ur = /,/;
                var cr = /(=.+)?(\s*)$/;
                var hr = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm;
                wt.prototype.removeLink = function(t) {
                    return t.prev ? t.prev.next = t.next : this.head = t.next, t.next ? t.next.prev = t.prev : this.tail = t.prev, t.prev = t.next = null, this.length -= 1, t
                }, wt.prototype.empty = function() {
                    for (; this.head;) this.shift();
                    return this
                }, wt.prototype.insertAfter = function(t, n) {
                    n.prev = t, n.next = t.next, t.next ? t.next.prev = n : this.tail = n, t.next = n, this.length += 1
                }, wt.prototype.insertBefore = function(t, n) {
                    n.prev = t.prev, n.next = t, t.prev ? t.prev.next = n : this.head = n, t.prev = n, this.length += 1
                }, wt.prototype.unshift = function(t) {
                    this.head ? this.insertBefore(this.head, t) : gt(this, t)
                }, wt.prototype.push = function(t) {
                    this.tail ? this.insertAfter(this.tail, t) : gt(this, t)
                }, wt.prototype.shift = function() {
                    return this.head && this.removeLink(this.head)
                }, wt.prototype.pop = function() {
                    return this.tail && this.removeLink(this.tail)
                }, wt.prototype.toArray = function() {
                    var t = Array(this.length);
                    var n = this.head;
                    for (var i = 0; i < this.length; i++) t[i] = n.data, n = n.next;
                    return t
                }, wt.prototype.remove = function(t) {
                    var n = this.head;
                    for (; n;) {
                        var i = n.next;
                        t(n) && this.removeLink(n), n = i
                    }
                    return this
                };
                var fr = V(W, 1);
                var lr = function() {
                    return kt.apply(null, e(arguments).reverse())
                };
                var dr = Array.prototype.concat;
                var vr = function(t, n, i, r) {
                    r = r || b;
                    var o = l(i);
                    Fi(t, n, (function(t, n) {
                        o(t, (function(t) {
                            return t ? n(t) : n(null, e(arguments, 1))
                        }))
                    }), (function(t, n) {
                        var i = [];
                        for (var e = 0; e < n.length; e++) n[e] && (i = dr.apply(i, n[e]));
                        return r(t, i)
                    }))
                };
                var pr = V(vr, 1 / 0);
                var wr = V(vr, 1);
                var gr = function() {
                    var t = e(arguments);
                    var n = [null].concat(t);
                    return function() {
                        return arguments[arguments.length - 1].apply(this, n)
                    }
                };
                var mr = G(Tt(St, At));
                var yr = z(Tt(St, At));
                var br = V(yr, 1);
                var kr = It("dir");
                var Sr = V(jt, 1);
                var Tr = G(Tt(Nt, Nt));
                var Ar = z(Tt(Nt, Nt));
                var Ir = V(Ar, 1);
                var Cr = G(Ut);
                var Er = z(Ut);
                var Or = V(Er, 1);
                var Dr = function(t, n, i, r) {
                    r = r || b;
                    var e = l(i);
                    Fi(t, n, (function(t, n) {
                        e(t, (function(i, r) {
                            return i ? n(i) : n(null, {
                                key: r,
                                val: t
                            })
                        }))
                    }), (function(t, n) {
                        var i = {};
                        var e = Object.prototype.hasOwnProperty;
                        for (var o = 0; o < n.length; o++)
                            if (n[o]) {
                                var s = n[o].key;
                                var a = n[o].val;
                                e.call(i, s) ? i[s].push(a) : i[s] = [a]
                            } return r(t, i)
                    }))
                };
                var Rr = V(Dr, 1 / 0);
                var Pr = V(Dr, 1);
                var jr = It("log");
                var xr = V(Wt, 1 / 0);
                var Nr = V(Wt, 1);
                var Mr = a(pn ? r.nextTick : vn ? setImmediate : s);
                var Fr = function(t, n) {
                    var i = l(t);
                    return mt((function(t, n) {
                        i(t[0], n)
                    }), n, 1)
                };
                var Lr = function(t, n) {
                    var i = Fr(t, n);
                    return i.push = function(t, n, r) {
                        if (null == r && (r = b), "function" != typeof r) throw new Error("task callback must be a function");
                        if (i.started = !0, Gn(t) || (t = [t]), 0 === t.length) return wn((function() {
                            i.drain()
                        }));
                        n = n || 0;
                        var e = i._tasks.head;
                        for (; e && n >= e.priority;) e = e.next;
                        for (var o = 0, s = t.length; o < s; o++) {
                            var a = {
                                data: t[o],
                                priority: n,
                                callback: r
                            };
                            e ? i._tasks.insertBefore(e, a) : i._tasks.push(a)
                        }
                        wn(i.process)
                    }, delete i.unshift, i
                };
                var Ur = G(Zt);
                var Br = z(Zt);
                var Wr = V(Br, 1);
                var Vr = function(t, n) {
                    n || (n = t, t = null);
                    var i = l(n);
                    return dn((function(n, r) {
                        function e(t) {
                            i.apply(null, n.concat(t))
                        }
                        t ? tn(t, e, r) : tn(e, r)
                    }))
                };
                var qr = G(Tt(Boolean, St));
                var Gr = z(Tt(Boolean, St));
                var Hr = V(Gr, 1);
                var zr = Math.ceil;
                var Kr = Math.max;
                var Jr = V(sn, 1 / 0);
                var Yr = V(sn, 1);
                var Xr = function(t, n) {
                    function i(n) {
                        var i = l(t[o++]);
                        n.push(U(r)), i.apply(null, n)
                    }
    
                    function r(r) {
                        if (r || o === t.length) return n.apply(null, arguments);
                        i(e(arguments, 1))
                    }
                    if (n = k(n || b), !Gn(t)) return n(new Error("First argument to waterfall must be an array of functions"));
                    if (!t.length) return n();
                    var o = 0;
                    i([])
                };
                var Zr = {
                    apply: ln,
                    applyEach: Mi,
                    applyEachSeries: Ui,
                    asyncify: u,
                    auto: Wi,
                    autoInject: pt,
                    cargo: yt,
                    compose: lr,
                    concat: pr,
                    concatLimit: vr,
                    concatSeries: wr,
                    constant: gr,
                    detect: mr,
                    detectLimit: yr,
                    detectSeries: br,
                    dir: kr,
                    doDuring: Ct,
                    doUntil: Ot,
                    doWhilst: Et,
                    during: Dt,
                    each: Pt,
                    eachLimit: jt,
                    eachOf: xi,
                    eachOfLimit: W,
                    eachOfSeries: fr,
                    eachSeries: Sr,
                    ensureAsync: xt,
                    every: Tr,
                    everyLimit: Ar,
                    everySeries: Ir,
                    filter: Cr,
                    filterLimit: Er,
                    filterSeries: Or,
                    forever: Bt,
                    groupBy: Rr,
                    groupByLimit: Dr,
                    groupBySeries: Pr,
                    log: jr,
                    map: Ni,
                    mapLimit: Fi,
                    mapSeries: Li,
                    mapValues: xr,
                    mapValuesLimit: Wt,
                    mapValuesSeries: Nr,
                    memoize: qt,
                    nextTick: Mr,
                    parallel: Ht,
                    parallelLimit: zt,
                    priorityQueue: Lr,
                    queue: Fr,
                    race: Kt,
                    reduce: bt,
                    reduceRight: Jt,
                    reflect: Yt,
                    reflectAll: Xt,
                    reject: Ur,
                    rejectLimit: Br,
                    rejectSeries: Wr,
                    retry: tn,
                    retryable: Vr,
                    seq: kt,
                    series: nn,
                    setImmediate: wn,
                    some: qr,
                    someLimit: Gr,
                    someSeries: Hr,
                    sortBy: rn,
                    timeout: en,
                    times: Jr,
                    timesLimit: sn,
                    timesSeries: Yr,
                    transform: an,
                    tryEach: un,
                    unmemoize: cn,
                    until: fn,
                    waterfall: Xr,
                    whilst: hn,
                    all: Tr,
                    allLimit: Ar,
                    allSeries: Ir,
                    any: qr,
                    anyLimit: Gr,
                    anySeries: Hr,
                    find: mr,
                    findLimit: yr,
                    findSeries: br,
                    forEach: Pt,
                    forEachSeries: Sr,
                    forEachLimit: jt,
                    forEachOf: xi,
                    forEachOfSeries: fr,
                    forEachOfLimit: W,
                    inject: bt,
                    foldl: bt,
                    foldr: Jt,
                    select: Cr,
                    selectLimit: Er,
                    selectSeries: Or,
                    wrapSync: u
                };
                n["default"] = Zr, n.apply = ln, n.applyEach = Mi, n.applyEachSeries = Ui, n.asyncify = u, n.auto = Wi, n.autoInject = pt, n.cargo = yt, n.compose = lr, n.concat = pr, n.concatLimit = vr, n.concatSeries = wr, n.constant = gr, n.detect = mr, n.detectLimit = yr, n.detectSeries = br, n.dir = kr, n.doDuring = Ct, n.doUntil = Ot, n.doWhilst = Et, n.during = Dt, n.each = Pt, n.eachLimit = jt, n.eachOf = xi, n.eachOfLimit = W, n.eachOfSeries = fr, n.eachSeries = Sr, n.ensureAsync = xt, n.every = Tr, n.everyLimit = Ar, n.everySeries = Ir, n.filter = Cr, n.filterLimit = Er, n.filterSeries = Or, n.forever = Bt, n.groupBy = Rr, n.groupByLimit = Dr, n.groupBySeries = Pr, n.log = jr, n.map = Ni, n.mapLimit = Fi, n.mapSeries = Li, n.mapValues = xr, n.mapValuesLimit = Wt, n.mapValuesSeries = Nr, n.memoize = qt, n.nextTick = Mr, n.parallel = Ht, n.parallelLimit = zt, n.priorityQueue = Lr, n.queue = Fr, n.race = Kt, n.reduce = bt, n.reduceRight = Jt, n.reflect = Yt, n.reflectAll = Xt, n.reject = Ur, n.rejectLimit = Br, n.rejectSeries = Wr, n.retry = tn, n.retryable = Vr, n.seq = kt, n.series = nn, n.setImmediate = wn, n.some = qr, n.someLimit = Gr, n.someSeries = Hr, n.sortBy = rn, n.timeout = en, n.times = Jr, n.timesLimit = sn, n.timesSeries = Yr, n.transform = an, n.tryEach = un, n.unmemoize = cn, n.until = fn, n.waterfall = Xr, n.whilst = hn, n.all = Tr, n.allLimit = Ar, n.allSeries = Ir, n.any = qr, n.anyLimit = Gr, n.anySeries = Hr, n.find = mr, n.findLimit = yr, n.findSeries = br, n.forEach = Pt, n.forEachSeries = Sr, n.forEachLimit = jt, n.forEachOf = xi, n.forEachOfSeries = fr, n.forEachOfLimit = W, n.inject = bt, n.foldl = bt, n.foldr = Jt, n.select = Cr, n.selectLimit = Er, n.selectSeries = Or, n.wrapSync = u, Object.defineProperty(n, "__esModule", {
                    value: !0
                })
            }, e(n)
        },
        4155: t => {
            function n() {
                throw new Error("setTimeout has not been defined")
            }
    
            function i() {
                throw new Error("clearTimeout has not been defined")
            }
    
            function r(t) {
                if (h === setTimeout) return setTimeout(t, 0);
                if ((h === n || !h) && setTimeout) return h = setTimeout, setTimeout(t, 0);
                try {
                    return h(t, 0)
                } catch (n) {
                    try {
                        return h.call(null, t, 0)
                    } catch (n) {
                        return h.call(this, t, 0)
                    }
                }
            }
    
            function e(t) {
                if (f === clearTimeout) return clearTimeout(t);
                if ((f === i || !f) && clearTimeout) return f = clearTimeout, clearTimeout(t);
                try {
                    return f(t)
                } catch (n) {
                    try {
                        return f.call(null, t)
                    } catch (n) {
                        return f.call(this, t)
                    }
                }
            }
    
            function o() {
                d && v && (d = !1, v.length ? l = v.concat(l) : p = -1, l.length && s())
            }
    
            function s() {
                if (!d) {
                    var t = r(o);
                    d = !0;
                    var n = l.length;
                    for (; n;) {
                        for (v = l, l = []; ++p < n;) v && v[p].run();
                        p = -1, n = l.length
                    }
                    v = null, d = !1, e(t)
                }
            }
    
            function a(t, n) {
                this.fun = t, this.array = n
            }
    
            function u() {}
            var c = t.exports = {};
            var h;
            var f;
            ! function() {
                try {
                    h = "function" == typeof setTimeout ? setTimeout : n
                } catch (t) {
                    h = n
                }
                try {
                    f = "function" == typeof clearTimeout ? clearTimeout : i
                } catch (t) {
                    f = i
                }
            }();
            var l = [];
            var d = !1;
            var v;
            var p = -1;
            c.nextTick = function(t) {
                var n = new Array(arguments.length - 1);
                if (arguments.length > 1)
                    for (var i = 1; i < arguments.length; i++) n[i - 1] = arguments[i];
                l.push(new a(t, n)), 1 !== l.length || d || r(s)
            }, a.prototype.run = function() {
                this.fun.apply(null, this.array)
            }, c.title = "browser", c.browser = !0, c.env = {}, c.argv = [], c.version = "", c.versions = {}, c.on = u, c.addListener = u, c.once = u, c.off = u, c.removeListener = u, c.removeAllListeners = u, c.emit = u, c.prependListener = u, c.prependOnceListener = u, c.listeners = function(t) {
                return []
            }, c.binding = function(t) {
                throw new Error("process.binding is not supported")
            }, c.cwd = function() {
                return "/"
            }, c.chdir = function(t) {
                throw new Error("process.chdir is not supported")
            }, c.umask = function() {
                return 0
            }
        },
        4907: (t, n, i) => {
            "use strict";
    
            function r(t, n, i, r) {
                this.trie = null != t ? t : e.builder(0).build([{
                    k: "",
                    v: 1
                }]), this.token_info_dictionary = null != n ? n : new o, this.connection_costs = null != i ? i : new s(0, 0), this.unknown_dictionary = null != r ? r : new a
            }
            var e = i(725);
            var o = i(7756);
            var s = i(5929);
            var a = i(8068);
            r.prototype.loadTrie = function(t, n) {
                return this.trie = e.load(t, n), this
            }, r.prototype.loadTokenInfoDictionaries = function(t, n, i) {
                return this.token_info_dictionary.loadDictionary(t), this.token_info_dictionary.loadPosVector(n), this.token_info_dictionary.loadTargetMap(i), this
            }, r.prototype.loadConnectionCosts = function(t) {
                return this.connection_costs.loadConnectionCosts(t), this
            }, r.prototype.loadUnknownDictionaries = function(t, n, i, r, e, o) {
                return this.unknown_dictionary.loadUnknownDictionaries(t, n, i, r, e, o), this
            }, t.exports = r
        },
        725: t => {
            ! function() {
                "use strict";
    
                function n(t) {
                    this.bc = l(t), this.keys = []
                }
    
                function i(t) {
                    this.bc = t, this.bc.shrink()
                }
                var r = "\0",
                    e = 0,
                    o = 0,
                    s = -1,
                    a = !0,
                    u = !0,
                    c = 4,
                    h = 4,
                    f = 2;
                var l = function(t) {
                    null == t && (t = 1024);
                    var n = function(t, n, i) {
                        for (var r = n; r < i; r++) t[r] = 1 - r;
                        if (0 < l.array[l.array.length - 1]) {
                            var e = l.array.length - 2;
                            for (; 0 < l.array[e];) e--;
                            t[n] = -e
                        }
                    };
                    var i = function(t, n, i) {
                        for (var r = n; r < i; r++) t[r] = -r - 1
                    };
                    var r = function(t) {
                        var r = t * f;
                        var e = d(s.signed, s.bytes, r);
                        n(e, s.array.length, r), e.set(s.array), s.array = null, s.array = e;
                        var o = d(l.signed, l.bytes, r);
                        i(o, l.array.length, r), o.set(l.array), l.array = null, l.array = o
                    };
                    var e = o + 1;
                    var s = {
                        signed: a,
                        bytes: c,
                        array: d(a, c, t)
                    };
                    var l = {
                        signed: u,
                        bytes: h,
                        array: d(u, h, t)
                    };
                    return s.array[o] = 1, l.array[o] = o, n(s.array, o + 1, s.array.length), i(l.array, o + 1, l.array.length), {
                        getBaseBuffer: function() {
                            return s.array
                        },
                        getCheckBuffer: function() {
                            return l.array
                        },
                        loadBaseBuffer: function(t) {
                            return s.array = t, this
                        },
                        loadCheckBuffer: function(t) {
                            return l.array = t, this
                        },
                        size: function() {
                            return Math.max(s.array.length, l.array.length)
                        },
                        getBase: function(t) {
                            return s.array.length - 1 < t ? 1 - t : s.array[t]
                        },
                        getCheck: function(t) {
                            return l.array.length - 1 < t ? -t - 1 : l.array[t]
                        },
                        setBase: function(t, n) {
                            s.array.length - 1 < t && r(t), s.array[t] = n
                        },
                        setCheck: function(t, n) {
                            l.array.length - 1 < t && r(t), l.array[t] = n
                        },
                        setFirstUnusedNode: function(t) {
                            e = t
                        },
                        getFirstUnusedNode: function() {
                            return e
                        },
                        shrink: function() {
                            var t = this.size() - 1;
                            for (; !(0 <= l.array[t]);) t--;
                            s.array = s.array.subarray(0, t + 2), l.array = l.array.subarray(0, t + 2)
                        },
                        calc: function() {
                            var t = 0;
                            var n = l.array.length;
                            for (var i = 0; i < n; i++) l.array[i] < 0 && t++;
                            return {
                                all: n,
                                unused: t,
                                efficiency: (n - t) / n
                            }
                        },
                        dump: function() {
                            var t = "";
                            var n = "";
                            var i;
                            for (i = 0; i < s.array.length; i++) t = t + " " + this.getBase(i);
                            for (i = 0; i < l.array.length; i++) n = n + " " + this.getCheck(i);
                            return "base:" + t + " chck:" + n
                        }
                    }
                };
                n.prototype.append = function(t, n) {
                    return this.keys.push({
                        k: t,
                        v: n
                    }), this
                }, n.prototype.build = function(t, n) {
                    if (null == t && (t = this.keys), null == t) return new i(this.bc);
                    null == n && (n = !1);
                    var e = t.map((function(t) {
                        return {
                            k: p(t.k + r),
                            v: t.v
                        }
                    }));
                    return this.keys = n ? e : e.sort((function(t, n) {
                        var i = t.k;
                        var r = n.k;
                        var e = Math.min(i.length, r.length);
                        for (var o = 0; o < e; o++)
                            if (i[o] !== r[o]) return i[o] - r[o];
                        return i.length - r.length
                    })), e = null, this._build(o, 0, 0, this.keys.length), new i(this.bc)
                }, n.prototype._build = function(t, n, i, r) {
                    var o = this.getChildrenInfo(n, i, r);
                    var s = this.findAllocatableBase(o);
                    this.setBC(t, o, s);
                    for (var a = 0; a < o.length; a += 3) {
                        var u = o[a];
                        if (u !== e) {
                            var c = o[a + 1];
                            var h = o[a + 2];
                            var f = s + u;
                            this._build(f, n + 1, c, h)
                        }
                    }
                }, n.prototype.getChildrenInfo = function(t, n, i) {
                    var r = this.keys[n].k[t];
                    var e = 0;
                    var o = new Int32Array(3 * i);
                    o[e++] = r, o[e++] = n;
                    var s = n;
                    var a = n;
                    for (; s < n + i; s++) {
                        var u = this.keys[s].k[t];
                        r !== u && (o[e++] = s - a, o[e++] = u, o[e++] = s, r = u, a = s)
                    }
                    return o[e++] = s - a, o.subarray(0, e)
                }, n.prototype.setBC = function(t, n, i) {
                    var r = this.bc;
                    var o;
                    for (r.setBase(t, i), o = 0; o < n.length; o += 3) {
                        var s = n[o];
                        var a = i + s;
                        var u = -r.getBase(a);
                        var c = -r.getCheck(a);
                        a !== r.getFirstUnusedNode() ? r.setCheck(u, -c) : r.setFirstUnusedNode(c), r.setBase(c, -u);
                        var h = t;
                        if (r.setCheck(a, h), s === e) {
                            var f = n[o + 1];
                            var l = this.keys[f].v;
                            null == l && (l = 0);
                            var d = -l - 1;
                            r.setBase(a, d)
                        }
                    }
                }, n.prototype.findAllocatableBase = function(t) {
                    var n = this.bc;
                    var i;
                    var r = n.getFirstUnusedNode();
                    for (;;)
                        if ((i = r - t[0]) < 0) r = -n.getCheck(r);
                        else {
                            var e = !0;
                            for (var o = 0; o < t.length; o += 3) {
                                var s = i + t[o];
                                if (!this.isUnusedNode(s)) {
                                    r = -n.getCheck(r), e = !1;
                                    break
                                }
                            }
                            if (e) return i
                        }
                }, n.prototype.isUnusedNode = function(t) {
                    var n = this.bc.getCheck(t);
                    return t !== o && n < 0
                }, i.prototype.contain = function(t) {
                    var n = this.bc;
                    var i = p(t += r);
                    var e = o;
                    var a = s;
                    for (var u = 0; u < i.length; u++) {
                        var c = i[u];
                        if ((a = this.traverse(e, c)) === s) return !1;
                        if (n.getBase(a) <= 0) return !0;
                        e = a
                    }
                    return !1
                }, i.prototype.lookup = function(t) {
                    var n = p(t += r);
                    var i = o;
                    var e = s;
                    for (var a = 0; a < n.length; a++) {
                        var u = n[a];
                        if ((e = this.traverse(i, u)) === s) return s;
                        i = e
                    }
                    var c = this.bc.getBase(e);
                    return c <= 0 ? -c - 1 : s
                }, i.prototype.commonPrefixSearch = function(t) {
                    var n = p(t);
                    var i = o;
                    var r = s;
                    var a = [];
                    for (var u = 0; u < n.length; u++) {
                        var c = n[u];
                        if ((r = this.traverse(i, c)) === s) break;
                        i = r;
                        var h = this.traverse(r, e);
                        if (h !== s) {
                            var f = this.bc.getBase(h);
                            var l = {};
                            f <= 0 && (l.v = -f - 1), l.k = w(v(n, 0, u + 1)), a.push(l)
                        }
                    }
                    return a
                }, i.prototype.traverse = function(t, n) {
                    var i = this.bc.getBase(t) + n;
                    return this.bc.getCheck(i) === t ? i : s
                }, i.prototype.size = function() {
                    return this.bc.size()
                }, i.prototype.calc = function() {
                    return this.bc.calc()
                }, i.prototype.dump = function() {
                    return this.bc.dump()
                };
                var d = function(t, n, i) {
                    if (t) switch (n) {
                        case 1:
                            return new Int8Array(i);
                        case 2:
                            return new Int16Array(i);
                        case 4:
                            return new Int32Array(i);
                        default:
                            throw new RangeError("Invalid newArray parameter element_bytes:" + n)
                    } else switch (n) {
                        case 1:
                            return new Uint8Array(i);
                        case 2:
                            return new Uint16Array(i);
                        case 4:
                            return new Uint32Array(i);
                        default:
                            throw new RangeError("Invalid newArray parameter element_bytes:" + n)
                    }
                };
                var v = function(t, n, i) {
                    var r = new ArrayBuffer(i);
                    var e = new Uint8Array(r, 0, i);
                    var o = t.subarray(n, i);
                    return e.set(o), e
                };
                var p = function(t) {
                    var n = new Uint8Array(new ArrayBuffer(4 * t.length));
                    var i = 0,
                        r = 0;
                    for (; i < t.length;) {
                        var e;
                        var o = t.charCodeAt(i++);
                        if (o >= 55296 && o <= 56319) {
                            var s = o;
                            var a = t.charCodeAt(i++);
                            if (!(a >= 56320 && a <= 57343)) return null;
                            e = 1024 * (s - 55296) + 65536 + (a - 56320)
                        } else e = o;
                        e < 128 ? n[r++] = e : e < 2048 ? (n[r++] = e >>> 6 | 192, n[r++] = 63 & e | 128) : e < 65536 ? (n[r++] = e >>> 12 | 224, n[r++] = e >> 6 & 63 | 128, n[r++] = 63 & e | 128) : e < 1 << 21 && (n[r++] = e >>> 18 | 240, n[r++] = e >> 12 & 63 | 128, n[r++] = e >> 6 & 63 | 128, n[r++] = 63 & e | 128)
                    }
                    return n.subarray(0, r)
                };
                var w = function(t) {
                    var n = "";
                    var i, r, e, o;
                    var s = 0;
                    for (; s < t.length;)(i = (r = t[s++]) < 128 ? r : r >> 5 == 6 ? (31 & r) << 6 | 63 & t[s++] : r >> 4 == 14 ? (15 & r) << 12 | (63 & t[s++]) << 6 | 63 & t[s++] : (7 & r) << 18 | (63 & t[s++]) << 12 | (63 & t[s++]) << 6 | 63 & t[s++]) < 65536 ? n += String.fromCharCode(i) : (e = 55296 | (i -= 65536) >> 10, o = 56320 | 1023 & i, n += String.fromCharCode(e, o));
                    return n
                };
                var g = {
                    builder: function(t) {
                        return new n(t)
                    },
                    load: function(t, n) {
                        var r = l(0);
                        return r.loadBaseBuffer(t), r.loadCheckBuffer(n), new i(r)
                    }
                };
                t.exports = g
            }()
        },
        7756: (t, n, i) => {
            "use strict";
    
            function r() {
                this.dictionary = new e(10485760), this.target_map = {}, this.pos_buffer = new e(10485760)
            }
            var e = i(3178);
            r.prototype.buildDictionary = function(t) {
                var n = {};
                for (var i = 0; i < t.length; i++) {
                    var r = t[i];
                    if (!(r.length < 4)) {
                        var e = r[0];
                        var o = r[1];
                        var s = r[2];
                        var a = r[3];
                        var u = r.slice(4).join(",");
                        !isFinite(o) || !isFinite(s) || isFinite(a), n[this.put(o, s, a, e, u)] = e
                    }
                }
                return this.dictionary.shrink(), this.pos_buffer.shrink(), n
            }, r.prototype.put = function(t, n, i, r, e) {
                var o = this.dictionary.position;
                var s = this.pos_buffer.position;
                return this.dictionary.putShort(t), this.dictionary.putShort(n), this.dictionary.putShort(i), this.dictionary.putInt(s), this.pos_buffer.putString(r + "," + e), o
            }, r.prototype.addMapping = function(t, n) {
                var i = this.target_map[t];
                null == i && (i = []), i.push(n), this.target_map[t] = i
            }, r.prototype.targetMapToBuffer = function() {
                var t = new e;
                var n = Object.keys(this.target_map).length;
                for (var i in t.putInt(n), this.target_map) {
                    var r = this.target_map[i];
                    var o = r.length;
                    t.putInt(parseInt(i)), t.putInt(o);
                    for (var s = 0; s < r.length; s++) t.putInt(r[s])
                }
                return t.shrink()
            }, r.prototype.loadDictionary = function(t) {
                return this.dictionary = new e(t), this
            }, r.prototype.loadPosVector = function(t) {
                return this.pos_buffer = new e(t), this
            }, r.prototype.loadTargetMap = function(t) {
                var n = new e(t);
                for (n.position = 0, this.target_map = {}, n.readInt(); !(n.buffer.length < n.position + 1);) {
                    var i = n.readInt();
                    var r = n.readInt();
                    for (var o = 0; o < r; o++) {
                        var s = n.readInt();
                        this.addMapping(i, s)
                    }
                }
                return this
            }, r.prototype.getFeatures = function(t) {
                var n = parseInt(t);
                if (isNaN(n)) return "";
                var i = this.dictionary.getInt(n + 6);
                return this.pos_buffer.getString(i)
            }, t.exports = r
        },
        3178: t => {
            "use strict";
    
            function n(t) {
                var n;
                if (null == t) n = 1048576;
                else {
                    if ("number" != typeof t) {
                        if (t instanceof Uint8Array) return this.buffer = t, void(this.position = 0);
                        throw typeof t + " is invalid parameter type for ByteBuffer constructor"
                    }
                    n = t
                }
                this.buffer = new Uint8Array(n), this.position = 0
            }
            var i = function(t) {
                var n = new Uint8Array(4 * t.length);
                var i = 0,
                    r = 0;
                for (; i < t.length;) {
                    var e;
                    var o = t.charCodeAt(i++);
                    if (o >= 55296 && o <= 56319) {
                        var s = o;
                        var a = t.charCodeAt(i++);
                        if (!(a >= 56320 && a <= 57343)) return null;
                        e = 1024 * (s - 55296) + 65536 + (a - 56320)
                    } else e = o;
                    e < 128 ? n[r++] = e : e < 2048 ? (n[r++] = e >>> 6 | 192, n[r++] = 63 & e | 128) : e < 65536 ? (n[r++] = e >>> 12 | 224, n[r++] = e >> 6 & 63 | 128, n[r++] = 63 & e | 128) : e < 1 << 21 && (n[r++] = e >>> 18 | 240, n[r++] = e >> 12 & 63 | 128, n[r++] = e >> 6 & 63 | 128, n[r++] = 63 & e | 128)
                }
                return n.subarray(0, r)
            };
            var r = function(t) {
                var n = "";
                var i, r, e, o;
                var s = 0;
                for (; s < t.length;)(i = (r = t[s++]) < 128 ? r : r >> 5 == 6 ? (31 & r) << 6 | 63 & t[s++] : r >> 4 == 14 ? (15 & r) << 12 | (63 & t[s++]) << 6 | 63 & t[s++] : (7 & r) << 18 | (63 & t[s++]) << 12 | (63 & t[s++]) << 6 | 63 & t[s++]) < 65536 ? n += String.fromCharCode(i) : (e = 55296 | (i -= 65536) >> 10, o = 56320 | 1023 & i, n += String.fromCharCode(e, o));
                return n
            };
            n.prototype.size = function() {
                return this.buffer.length
            }, n.prototype.reallocate = function() {
                var t = new Uint8Array(2 * this.buffer.length);
                t.set(this.buffer), this.buffer = t
            }, n.prototype.shrink = function() {
                return this.buffer = this.buffer.subarray(0, this.position), this.buffer
            }, n.prototype.put = function(t) {
                this.buffer.length < this.position + 1 && this.reallocate(), this.buffer[this.position++] = t
            }, n.prototype.get = function(t) {
                return null == t && (t = this.position, this.position += 1), this.buffer.length < t + 1 ? 0 : this.buffer[t]
            }, n.prototype.putShort = function(t) {
                if (65535 < t) throw t + " is over short value";
                var n = 255 & t;
                var i = (65280 & t) >> 8;
                this.put(n), this.put(i)
            }, n.prototype.getShort = function(t) {
                if (null == t && (t = this.position, this.position += 2), this.buffer.length < t + 2) return 0;
                var n = this.buffer[t];
                var i = (this.buffer[t + 1] << 8) + n;
                return 32768 & i && (i = -(i - 1 ^ 65535)), i
            }, n.prototype.putInt = function(t) {
                if (4294967295 < t) throw t + " is over integer value";
                var n = 255 & t;
                var i = (65280 & t) >> 8;
                var r = (16711680 & t) >> 16;
                var e = (4278190080 & t) >> 24;
                this.put(n), this.put(i), this.put(r), this.put(e)
            }, n.prototype.getInt = function(t) {
                if (null == t && (t = this.position, this.position += 4), this.buffer.length < t + 4) return 0;
                var n = this.buffer[t];
                var i = this.buffer[t + 1];
                var r = this.buffer[t + 2];
                return (this.buffer[t + 3] << 24) + (r << 16) + (i << 8) + n
            }, n.prototype.readInt = function() {
                var t = this.position;
                return this.position += 4, this.getInt(t)
            }, n.prototype.putString = function(t) {
                var n = i(t);
                for (var r = 0; r < n.length; r++) this.put(n[r]);
                this.put(0)
            }, n.prototype.getString = function(t) {
                var n, i = [];
                for (null == t && (t = this.position); !(this.buffer.length < t + 1) && 0 !== (n = this.get(t++));) i.push(n);
                return this.position = t, r(i)
            }, t.exports = n
        },
        5929: t => {
            "use strict";
    
            function n(t, n) {
                this.forward_dimension = t, this.backward_dimension = n, this.buffer = new Int16Array(t * n + 2), this.buffer[0] = t, this.buffer[1] = n
            }
            n.prototype.put = function(t, n, i) {
                var r = t * this.backward_dimension + n + 2;
                if (this.buffer.length < r + 1) throw "ConnectionCosts buffer overflow";
                this.buffer[r] = i
            }, n.prototype.get = function(t, n) {
                var i = t * this.backward_dimension + n + 2;
                if (this.buffer.length < i + 1) throw "ConnectionCosts buffer overflow";
                return this.buffer[i]
            }, n.prototype.loadConnectionCosts = function(t) {
                this.forward_dimension = t[0], this.backward_dimension = t[1], this.buffer = t
            }, t.exports = n
        },
        8068: (t, n, i) => {
            "use strict";
    
            function r() {
                this.dictionary = new s(10485760), this.target_map = {}, this.pos_buffer = new s(10485760), this.character_definition = null
            }
            var e = i(7756);
            var o = i(7982);
            var s = i(3178);
            r.prototype = Object.create(e.prototype), r.prototype.characterDefinition = function(t) {
                return this.character_definition = t, this
            }, r.prototype.lookup = function(t) {
                return this.character_definition.lookup(t)
            }, r.prototype.lookupCompatibleCategory = function(t) {
                return this.character_definition.lookupCompatibleCategory(t)
            }, r.prototype.loadUnknownDictionaries = function(t, n, i, r, e, s) {
                this.loadDictionary(t), this.loadPosVector(n), this.loadTargetMap(i), this.character_definition = o.load(r, e, s)
            }, t.exports = r
        },
        7756: (t, n, i) => {
            "use strict";
    
            function r() {
                this.dictionary = new e(10485760), this.target_map = {}, this.pos_buffer = new e(10485760)
            }
            var e = i(3178);
            r.prototype.buildDictionary = function(t) {
                var n = {};
                for (var i = 0; i < t.length; i++) {
                    var r = t[i];
                    if (!(r.length < 4)) {
                        var e = r[0];
                        var o = r[1];
                        var s = r[2];
                        var a = r[3];
                        var u = r.slice(4).join(",");
                        !isFinite(o) || !isFinite(s) || isFinite(a), n[this.put(o, s, a, e, u)] = e
                    }
                }
                return this.dictionary.shrink(), this.pos_buffer.shrink(), n
            }, r.prototype.put = function(t, n, i, r, e) {
                var o = this.dictionary.position;
                var s = this.pos_buffer.position;
                return this.dictionary.putShort(t), this.dictionary.putShort(n), this.dictionary.putShort(i), this.dictionary.putInt(s), this.pos_buffer.putString(r + "," + e), o
            }, r.prototype.addMapping = function(t, n) {
                var i = this.target_map[t];
                null == i && (i = []), i.push(n), this.target_map[t] = i
            }, r.prototype.targetMapToBuffer = function() {
                var t = new e;
                var n = Object.keys(this.target_map).length;
                for (var i in t.putInt(n), this.target_map) {
                    var r = this.target_map[i];
                    var o = r.length;
                    t.putInt(parseInt(i)), t.putInt(o);
                    for (var s = 0; s < r.length; s++) t.putInt(r[s])
                }
                return t.shrink()
            }, r.prototype.loadDictionary = function(t) {
                return this.dictionary = new e(t), this
            }, r.prototype.loadPosVector = function(t) {
                return this.pos_buffer = new e(t), this
            }, r.prototype.loadTargetMap = function(t) {
                var n = new e(t);
                for (n.position = 0, this.target_map = {}, n.readInt(); !(n.buffer.length < n.position + 1);) {
                    var i = n.readInt();
                    var r = n.readInt();
                    for (var o = 0; o < r; o++) {
                        var s = n.readInt();
                        this.addMapping(i, s)
                    }
                }
                return this
            }, r.prototype.getFeatures = function(t) {
                var n = parseInt(t);
                if (isNaN(n)) return "";
                var i = this.dictionary.getInt(n + 6);
                return this.pos_buffer.getString(i)
            }, t.exports = r
        },
        3178: t => {
            "use strict";
    
            function n(t) {
                var n;
                if (null == t) n = 1048576;
                else {
                    if ("number" != typeof t) {
                        if (t instanceof Uint8Array) return this.buffer = t, void(this.position = 0);
                        throw typeof t + " is invalid parameter type for ByteBuffer constructor"
                    }
                    n = t
                }
                this.buffer = new Uint8Array(n), this.position = 0
            }
            var i = function(t) {
                var n = new Uint8Array(4 * t.length);
                var i = 0,
                    r = 0;
                for (; i < t.length;) {
                    var e;
                    var o = t.charCodeAt(i++);
                    if (o >= 55296 && o <= 56319) {
                        var s = o;
                        var a = t.charCodeAt(i++);
                        if (!(a >= 56320 && a <= 57343)) return null;
                        e = 1024 * (s - 55296) + 65536 + (a - 56320)
                    } else e = o;
                    e < 128 ? n[r++] = e : e < 2048 ? (n[r++] = e >>> 6 | 192, n[r++] = 63 & e | 128) : e < 65536 ? (n[r++] = e >>> 12 | 224, n[r++] = e >> 6 & 63 | 128, n[r++] = 63 & e | 128) : e < 1 << 21 && (n[r++] = e >>> 18 | 240, n[r++] = e >> 12 & 63 | 128, n[r++] = e >> 6 & 63 | 128, n[r++] = 63 & e | 128)
                }
                return n.subarray(0, r)
            };
            var r = function(t) {
                var n = "";
                var i, r, e, o;
                var s = 0;
                for (; s < t.length;)(i = (r = t[s++]) < 128 ? r : r >> 5 == 6 ? (31 & r) << 6 | 63 & t[s++] : r >> 4 == 14 ? (15 & r) << 12 | (63 & t[s++]) << 6 | 63 & t[s++] : (7 & r) << 18 | (63 & t[s++]) << 12 | (63 & t[s++]) << 6 | 63 & t[s++]) < 65536 ? n += String.fromCharCode(i) : (e = 55296 | (i -= 65536) >> 10, o = 56320 | 1023 & i, n += String.fromCharCode(e, o));
                return n
            };
            n.prototype.size = function() {
                return this.buffer.length
            }, n.prototype.reallocate = function() {
                var t = new Uint8Array(2 * this.buffer.length);
                t.set(this.buffer), this.buffer = t
            }, n.prototype.shrink = function() {
                return this.buffer = this.buffer.subarray(0, this.position), this.buffer
            }, n.prototype.put = function(t) {
                this.buffer.length < this.position + 1 && this.reallocate(), this.buffer[this.position++] = t
            }, n.prototype.get = function(t) {
                return null == t && (t = this.position, this.position += 1), this.buffer.length < t + 1 ? 0 : this.buffer[t]
            }, n.prototype.putShort = function(t) {
                if (65535 < t) throw t + " is over short value";
                var n = 255 & t;
                var i = (65280 & t) >> 8;
                this.put(n), this.put(i)
            }, n.prototype.getShort = function(t) {
                if (null == t && (t = this.position, this.position += 2), this.buffer.length < t + 2) return 0;
                var n = this.buffer[t];
                var i = (this.buffer[t + 1] << 8) + n;
                return 32768 & i && (i = -(i - 1 ^ 65535)), i
            }, n.prototype.putInt = function(t) {
                if (4294967295 < t) throw t + " is over integer value";
                var n = 255 & t;
                var i = (65280 & t) >> 8;
                var r = (16711680 & t) >> 16;
                var e = (4278190080 & t) >> 24;
                this.put(n), this.put(i), this.put(r), this.put(e)
            }, n.prototype.getInt = function(t) {
                if (null == t && (t = this.position, this.position += 4), this.buffer.length < t + 4) return 0;
                var n = this.buffer[t];
                var i = this.buffer[t + 1];
                var r = this.buffer[t + 2];
                return (this.buffer[t + 3] << 24) + (r << 16) + (i << 8) + n
            }, n.prototype.readInt = function() {
                var t = this.position;
                return this.position += 4, this.getInt(t)
            }, n.prototype.putString = function(t) {
                var n = i(t);
                for (var r = 0; r < n.length; r++) this.put(n[r]);
                this.put(0)
            }, n.prototype.getString = function(t) {
                var n, i = [];
                for (null == t && (t = this.position); !(this.buffer.length < t + 1) && 0 !== (n = this.get(t++));) i.push(n);
                return this.position = t, r(i)
            }, t.exports = n
        },
        7982: (t, n, i) => {
            "use strict";
    
            function r() {
                this.character_category_map = new Uint8Array(65536), this.compatible_category_map = new Uint32Array(65536), this.invoke_definition_map = null
            }
            var e = i(9738);
            var o = i(6440);
            var s = i(4152);
            var a = "DEFAULT";
            r.load = function(t, n, i) {
                var o = new r;
                return o.character_category_map = t, o.compatible_category_map = n, o.invoke_definition_map = e.load(i), o
            }, r.parseCharCategory = function(t, n) {
                var i = n[1];
                var r = parseInt(n[2]);
                var e = parseInt(n[3]);
                var s = parseInt(n[4]);
                return !isFinite(r) || 0 !== r && 1 !== r || !isFinite(e) || 0 !== e && 1 !== e || !isFinite(s) || s < 0 ? null : new o(t, i, 1 === r, 1 === e, s)
            }, r.parseCategoryMapping = function(t) {
                var n = parseInt(t[1]);
                var i = t[2];
                var r = 3 < t.length ? t.slice(3) : [];
                return isFinite(n), {
                    start: n,
                    default: i,
                    compatible: r
                }
            }, r.parseRangeCategoryMapping = function(t) {
                var n = parseInt(t[1]);
                var i = parseInt(t[2]);
                var r = t[3];
                var e = 4 < t.length ? t.slice(4) : [];
                return isFinite(n), isFinite(i), {
                    start: n,
                    end: i,
                    default: r,
                    compatible: e
                }
            }, r.prototype.initCategoryMappings = function(t) {
                var n;
                if (null != t)
                    for (var i = 0; i < t.length; i++) {
                        var r = t[i];
                        var e = r.end || r.start;
                        for (n = r.start; n <= e; n++) {
                            this.character_category_map[n] = this.invoke_definition_map.lookup(r.default);
                            for (var o = 0; o < r.compatible.length; o++) {
                                var s = this.compatible_category_map[n];
                                var u = r.compatible[o];
                                if (null != u) {
                                    var c = this.invoke_definition_map.lookup(u);
                                    null != c && (s |= 1 << c, this.compatible_category_map[n] = s)
                                }
                            }
                        }
                    }
                var h = this.invoke_definition_map.lookup(a);
                if (null != h)
                    for (n = 0; n < this.character_category_map.length; n++) 0 === this.character_category_map[n] && (this.character_category_map[n] = 1 << h)
            }, r.prototype.lookupCompatibleCategory = function(t) {
                var n = [];
                var i = t.charCodeAt(0);
                var r;
                if (i < this.compatible_category_map.length && (r = this.compatible_category_map[i]), null == r || 0 === r) return n;
                for (var e = 0; e < 32; e++)
                    if (r << 31 - e >>> 31 == 1) {
                        var o = this.invoke_definition_map.getCharacterClass(e);
                        if (null == o) continue;
                        n.push(o)
                    } return n
            }, r.prototype.lookup = function(t) {
                var n;
                var i = t.charCodeAt(0);
                return s.isSurrogatePair(t) ? n = this.invoke_definition_map.lookup(a) : i < this.character_category_map.length && (n = this.character_category_map[i]), null == n && (n = this.invoke_definition_map.lookup(a)), this.invoke_definition_map.getCharacterClass(n)
            }, t.exports = r
        },
        9738: (t, n, i) => {
            "use strict";
    
            function r() {
                this.map = [], this.lookup_table = {}
            }
            var e = i(3178);
            var o = i(6440);
            r.load = function(t) {
                var n = new r;
                var i = [];
                var s = new e(t);
                for (; s.position + 1 < s.size();) {
                    var a = i.length;
                    var u = s.get();
                    var c = s.get();
                    var h = s.getInt();
                    var f = s.getString();
                    i.push(new o(a, f, u, c, h))
                }
                return n.init(i), n
            }, r.prototype.init = function(t) {
                if (null != t)
                    for (var n = 0; n < t.length; n++) {
                        var i = t[n];
                        this.map[n] = i, this.lookup_table[i.class_name] = n
                    }
            }, r.prototype.getCharacterClass = function(t) {
                return this.map[t]
            }, r.prototype.lookup = function(t) {
                var n = this.lookup_table[t];
                return null == n ? null : n
            }, r.prototype.toBuffer = function() {
                var t = new e;
                for (var n = 0; n < this.map.length; n++) {
                    var i = this.map[n];
                    t.put(i.is_always_invoke), t.put(i.is_grouping), t.putInt(i.max_length), t.putString(i.class_name)
                }
                return t.shrink(), t.buffer
            }, t.exports = r
        },
        3178: t => {
            "use strict";
    
            function n(t) {
                var n;
                if (null == t) n = 1048576;
                else {
                    if ("number" != typeof t) {
                        if (t instanceof Uint8Array) return this.buffer = t, void(this.position = 0);
                        throw typeof t + " is invalid parameter type for ByteBuffer constructor"
                    }
                    n = t
                }
                this.buffer = new Uint8Array(n), this.position = 0
            }
            var i = function(t) {
                var n = new Uint8Array(4 * t.length);
                var i = 0,
                    r = 0;
                for (; i < t.length;) {
                    var e;
                    var o = t.charCodeAt(i++);
                    if (o >= 55296 && o <= 56319) {
                        var s = o;
                        var a = t.charCodeAt(i++);
                        if (!(a >= 56320 && a <= 57343)) return null;
                        e = 1024 * (s - 55296) + 65536 + (a - 56320)
                    } else e = o;
                    e < 128 ? n[r++] = e : e < 2048 ? (n[r++] = e >>> 6 | 192, n[r++] = 63 & e | 128) : e < 65536 ? (n[r++] = e >>> 12 | 224, n[r++] = e >> 6 & 63 | 128, n[r++] = 63 & e | 128) : e < 1 << 21 && (n[r++] = e >>> 18 | 240, n[r++] = e >> 12 & 63 | 128, n[r++] = e >> 6 & 63 | 128, n[r++] = 63 & e | 128)
                }
                return n.subarray(0, r)
            };
            var r = function(t) {
                var n = "";
                var i, r, e, o;
                var s = 0;
                for (; s < t.length;)(i = (r = t[s++]) < 128 ? r : r >> 5 == 6 ? (31 & r) << 6 | 63 & t[s++] : r >> 4 == 14 ? (15 & r) << 12 | (63 & t[s++]) << 6 | 63 & t[s++] : (7 & r) << 18 | (63 & t[s++]) << 12 | (63 & t[s++]) << 6 | 63 & t[s++]) < 65536 ? n += String.fromCharCode(i) : (e = 55296 | (i -= 65536) >> 10, o = 56320 | 1023 & i, n += String.fromCharCode(e, o));
                return n
            };
            n.prototype.size = function() {
                return this.buffer.length
            }, n.prototype.reallocate = function() {
                var t = new Uint8Array(2 * this.buffer.length);
                t.set(this.buffer), this.buffer = t
            }, n.prototype.shrink = function() {
                return this.buffer = this.buffer.subarray(0, this.position), this.buffer
            }, n.prototype.put = function(t) {
                this.buffer.length < this.position + 1 && this.reallocate(), this.buffer[this.position++] = t
            }, n.prototype.get = function(t) {
                return null == t && (t = this.position, this.position += 1), this.buffer.length < t + 1 ? 0 : this.buffer[t]
            }, n.prototype.putShort = function(t) {
                if (65535 < t) throw t + " is over short value";
                var n = 255 & t;
                var i = (65280 & t) >> 8;
                this.put(n), this.put(i)
            }, n.prototype.getShort = function(t) {
                if (null == t && (t = this.position, this.position += 2), this.buffer.length < t + 2) return 0;
                var n = this.buffer[t];
                var i = (this.buffer[t + 1] << 8) + n;
                return 32768 & i && (i = -(i - 1 ^ 65535)), i
            }, n.prototype.putInt = function(t) {
                if (4294967295 < t) throw t + " is over integer value";
                var n = 255 & t;
                var i = (65280 & t) >> 8;
                var r = (16711680 & t) >> 16;
                var e = (4278190080 & t) >> 24;
                this.put(n), this.put(i), this.put(r), this.put(e)
            }, n.prototype.getInt = function(t) {
                if (null == t && (t = this.position, this.position += 4), this.buffer.length < t + 4) return 0;
                var n = this.buffer[t];
                var i = this.buffer[t + 1];
                var r = this.buffer[t + 2];
                return (this.buffer[t + 3] << 24) + (r << 16) + (i << 8) + n
            }, n.prototype.readInt = function() {
                var t = this.position;
                return this.position += 4, this.getInt(t)
            }, n.prototype.putString = function(t) {
                var n = i(t);
                for (var r = 0; r < n.length; r++) this.put(n[r]);
                this.put(0)
            }, n.prototype.getString = function(t) {
                var n, i = [];
                for (null == t && (t = this.position); !(this.buffer.length < t + 1) && 0 !== (n = this.get(t++));) i.push(n);
                return this.position = t, r(i)
            }, t.exports = n
        },
        6440: t => {
            "use strict";
    
            function n(t, n, i, r, e) {
                this.class_id = t, this.class_name = n, this.is_always_invoke = i, this.is_grouping = r, this.max_length = e
            }
            t.exports = n
        },
        6440: t => {
            "use strict";
    
            function n(t, n, i, r, e) {
                this.class_id = t, this.class_name = n, this.is_always_invoke = i, this.is_grouping = r, this.max_length = e
            }
            t.exports = n
        },
        4152: t => {
            "use strict";
    
            function n(t) {
                this.str = t, this.index_mapping = [];
                for (var i = 0; i < t.length; i++) {
                    var r = t.charAt(i);
                    this.index_mapping.push(i), n.isSurrogatePair(r) && i++
                }
                this.length = this.index_mapping.length
            }
            n.prototype.slice = function(t) {
                if (this.index_mapping.length <= t) return "";
                var n = this.index_mapping[t];
                return this.str.slice(n)
            }, n.prototype.charAt = function(t) {
                if (this.str.length <= t) return "";
                var n = this.index_mapping[t];
                var i = this.index_mapping[t + 1];
                return null == i ? this.str.slice(n) : this.str.slice(n, i)
            }, n.prototype.charCodeAt = function(t) {
                if (this.index_mapping.length <= t) return NaN;
                var n = this.index_mapping[t];
                var i = this.str.charCodeAt(n);
                var r;
                return i >= 55296 && i <= 56319 && n < this.str.length && (r = this.str.charCodeAt(n + 1)) >= 56320 && r <= 57343 ? 1024 * (i - 55296) + r - 56320 + 65536 : i
            }, n.prototype.toString = function() {
                return this.str
            }, n.isSurrogatePair = function(t) {
                var n = t.charCodeAt(0);
                return n >= 55296 && n <= 56319
            }, t.exports = n
        },
        3178: t => {
            "use strict";
    
            function n(t) {
                var n;
                if (null == t) n = 1048576;
                else {
                    if ("number" != typeof t) {
                        if (t instanceof Uint8Array) return this.buffer = t, void(this.position = 0);
                        throw typeof t + " is invalid parameter type for ByteBuffer constructor"
                    }
                    n = t
                }
                this.buffer = new Uint8Array(n), this.position = 0
            }
            var i = function(t) {
                var n = new Uint8Array(4 * t.length);
                var i = 0,
                    r = 0;
                for (; i < t.length;) {
                    var e;
                    var o = t.charCodeAt(i++);
                    if (o >= 55296 && o <= 56319) {
                        var s = o;
                        var a = t.charCodeAt(i++);
                        if (!(a >= 56320 && a <= 57343)) return null;
                        e = 1024 * (s - 55296) + 65536 + (a - 56320)
                    } else e = o;
                    e < 128 ? n[r++] = e : e < 2048 ? (n[r++] = e >>> 6 | 192, n[r++] = 63 & e | 128) : e < 65536 ? (n[r++] = e >>> 12 | 224, n[r++] = e >> 6 & 63 | 128, n[r++] = 63 & e | 128) : e < 1 << 21 && (n[r++] = e >>> 18 | 240, n[r++] = e >> 12 & 63 | 128, n[r++] = e >> 6 & 63 | 128, n[r++] = 63 & e | 128)
                }
                return n.subarray(0, r)
            };
            var r = function(t) {
                var n = "";
                var i, r, e, o;
                var s = 0;
                for (; s < t.length;)(i = (r = t[s++]) < 128 ? r : r >> 5 == 6 ? (31 & r) << 6 | 63 & t[s++] : r >> 4 == 14 ? (15 & r) << 12 | (63 & t[s++]) << 6 | 63 & t[s++] : (7 & r) << 18 | (63 & t[s++]) << 12 | (63 & t[s++]) << 6 | 63 & t[s++]) < 65536 ? n += String.fromCharCode(i) : (e = 55296 | (i -= 65536) >> 10, o = 56320 | 1023 & i, n += String.fromCharCode(e, o));
                return n
            };
            n.prototype.size = function() {
                return this.buffer.length
            }, n.prototype.reallocate = function() {
                var t = new Uint8Array(2 * this.buffer.length);
                t.set(this.buffer), this.buffer = t
            }, n.prototype.shrink = function() {
                return this.buffer = this.buffer.subarray(0, this.position), this.buffer
            }, n.prototype.put = function(t) {
                this.buffer.length < this.position + 1 && this.reallocate(), this.buffer[this.position++] = t
            }, n.prototype.get = function(t) {
                return null == t && (t = this.position, this.position += 1), this.buffer.length < t + 1 ? 0 : this.buffer[t]
            }, n.prototype.putShort = function(t) {
                if (65535 < t) throw t + " is over short value";
                var n = 255 & t;
                var i = (65280 & t) >> 8;
                this.put(n), this.put(i)
            }, n.prototype.getShort = function(t) {
                if (null == t && (t = this.position, this.position += 2), this.buffer.length < t + 2) return 0;
                var n = this.buffer[t];
                var i = (this.buffer[t + 1] << 8) + n;
                return 32768 & i && (i = -(i - 1 ^ 65535)), i
            }, n.prototype.putInt = function(t) {
                if (4294967295 < t) throw t + " is over integer value";
                var n = 255 & t;
                var i = (65280 & t) >> 8;
                var r = (16711680 & t) >> 16;
                var e = (4278190080 & t) >> 24;
                this.put(n), this.put(i), this.put(r), this.put(e)
            }, n.prototype.getInt = function(t) {
                if (null == t && (t = this.position, this.position += 4), this.buffer.length < t + 4) return 0;
                var n = this.buffer[t];
                var i = this.buffer[t + 1];
                var r = this.buffer[t + 2];
                return (this.buffer[t + 3] << 24) + (r << 16) + (i << 8) + n
            }, n.prototype.readInt = function() {
                var t = this.position;
                return this.position += 4, this.getInt(t)
            }, n.prototype.putString = function(t) {
                var n = i(t);
                for (var r = 0; r < n.length; r++) this.put(n[r]);
                this.put(0)
            }, n.prototype.getString = function(t) {
                var n, i = [];
                for (null == t && (t = this.position); !(this.buffer.length < t + 1) && 0 !== (n = this.get(t++));) i.push(n);
                return this.position = t, r(i)
            }, t.exports = n
        },
        2911: (t, n, i) => {
            "use strict";
    
            function r() {
                this.tid_entries = [], this.unk_entries = [], this.cc_builder = new a, this.cd_builder = new u
            }
            var e = i(725);
            var o = i(4907);
            var s = i(7756);
            var a = i(5558);
            var u = i(8150);
            var c = i(8068);
            r.prototype.addTokenInfoDictionary = function(t) {
                var n = t.split(",");
                return this.tid_entries.push(n), this
            }, r.prototype.putCostMatrixLine = function(t) {
                return this.cc_builder.putLine(t), this
            }, r.prototype.putCharDefLine = function(t) {
                return this.cd_builder.putLine(t), this
            }, r.prototype.putUnkDefLine = function(t) {
                return this.unk_entries.push(t.split(",")), this
            }, r.prototype.build = function() {
                var t = this.buildTokenInfoDictionary();
                var n = this.buildUnknownDictionary();
                return new o(t.trie, t.token_info_dictionary, this.cc_builder.build(), n)
            }, r.prototype.buildTokenInfoDictionary = function() {
                var t = new s;
                var n = t.buildDictionary(this.tid_entries);
                var i = this.buildDoubleArray();
                for (var r in n) {
                    var e = n[r];
                    var o = i.lookup(e);
                    t.addMapping(o, r)
                }
                return {
                    trie: i,
                    token_info_dictionary: t
                }
            }, r.prototype.buildUnknownDictionary = function() {
                var t = new c;
                var n = t.buildDictionary(this.unk_entries);
                var i = this.cd_builder.build();
                for (var r in t.characterDefinition(i), n) {
                    var e = n[r];
                    var o = i.invoke_definition_map.lookup(e);
                    t.addMapping(o, r)
                }
                return t
            }, r.prototype.buildDoubleArray = function() {
                var t = 0;
                var n = this.tid_entries.map((function(n) {
                    return {
                        k: n[0],
                        v: t++
                    }
                }));
                return e.builder(1048576).build(n)
            }, t.exports = r
        },
        725: t => {
            ! function() {
                "use strict";
    
                function n(t) {
                    this.bc = l(t), this.keys = []
                }
    
                function i(t) {
                    this.bc = t, this.bc.shrink()
                }
                var r = "\0",
                    e = 0,
                    o = 0,
                    s = -1,
                    a = !0,
                    u = !0,
                    c = 4,
                    h = 4,
                    f = 2;
                var l = function(t) {
                    null == t && (t = 1024);
                    var n = function(t, n, i) {
                        for (var r = n; r < i; r++) t[r] = 1 - r;
                        if (0 < l.array[l.array.length - 1]) {
                            var e = l.array.length - 2;
                            for (; 0 < l.array[e];) e--;
                            t[n] = -e
                        }
                    };
                    var i = function(t, n, i) {
                        for (var r = n; r < i; r++) t[r] = -r - 1
                    };
                    var r = function(t) {
                        var r = t * f;
                        var e = d(s.signed, s.bytes, r);
                        n(e, s.array.length, r), e.set(s.array), s.array = null, s.array = e;
                        var o = d(l.signed, l.bytes, r);
                        i(o, l.array.length, r), o.set(l.array), l.array = null, l.array = o
                    };
                    var e = o + 1;
                    var s = {
                        signed: a,
                        bytes: c,
                        array: d(a, c, t)
                    };
                    var l = {
                        signed: u,
                        bytes: h,
                        array: d(u, h, t)
                    };
                    return s.array[o] = 1, l.array[o] = o, n(s.array, o + 1, s.array.length), i(l.array, o + 1, l.array.length), {
                        getBaseBuffer: function() {
                            return s.array
                        },
                        getCheckBuffer: function() {
                            return l.array
                        },
                        loadBaseBuffer: function(t) {
                            return s.array = t, this
                        },
                        loadCheckBuffer: function(t) {
                            return l.array = t, this
                        },
                        size: function() {
                            return Math.max(s.array.length, l.array.length)
                        },
                        getBase: function(t) {
                            return s.array.length - 1 < t ? 1 - t : s.array[t]
                        },
                        getCheck: function(t) {
                            return l.array.length - 1 < t ? -t - 1 : l.array[t]
                        },
                        setBase: function(t, n) {
                            s.array.length - 1 < t && r(t), s.array[t] = n
                        },
                        setCheck: function(t, n) {
                            l.array.length - 1 < t && r(t), l.array[t] = n
                        },
                        setFirstUnusedNode: function(t) {
                            e = t
                        },
                        getFirstUnusedNode: function() {
                            return e
                        },
                        shrink: function() {
                            var t = this.size() - 1;
                            for (; !(0 <= l.array[t]);) t--;
                            s.array = s.array.subarray(0, t + 2), l.array = l.array.subarray(0, t + 2)
                        },
                        calc: function() {
                            var t = 0;
                            var n = l.array.length;
                            for (var i = 0; i < n; i++) l.array[i] < 0 && t++;
                            return {
                                all: n,
                                unused: t,
                                efficiency: (n - t) / n
                            }
                        },
                        dump: function() {
                            var t = "";
                            var n = "";
                            var i;
                            for (i = 0; i < s.array.length; i++) t = t + " " + this.getBase(i);
                            for (i = 0; i < l.array.length; i++) n = n + " " + this.getCheck(i);
                            return "base:" + t + " chck:" + n
                        }
                    }
                };
                n.prototype.append = function(t, n) {
                    return this.keys.push({
                        k: t,
                        v: n
                    }), this
                }, n.prototype.build = function(t, n) {
                    if (null == t && (t = this.keys), null == t) return new i(this.bc);
                    null == n && (n = !1);
                    var e = t.map((function(t) {
                        return {
                            k: p(t.k + r),
                            v: t.v
                        }
                    }));
                    return this.keys = n ? e : e.sort((function(t, n) {
                        var i = t.k;
                        var r = n.k;
                        var e = Math.min(i.length, r.length);
                        for (var o = 0; o < e; o++)
                            if (i[o] !== r[o]) return i[o] - r[o];
                        return i.length - r.length
                    })), e = null, this._build(o, 0, 0, this.keys.length), new i(this.bc)
                }, n.prototype._build = function(t, n, i, r) {
                    var o = this.getChildrenInfo(n, i, r);
                    var s = this.findAllocatableBase(o);
                    this.setBC(t, o, s);
                    for (var a = 0; a < o.length; a += 3) {
                        var u = o[a];
                        if (u !== e) {
                            var c = o[a + 1];
                            var h = o[a + 2];
                            var f = s + u;
                            this._build(f, n + 1, c, h)
                        }
                    }
                }, n.prototype.getChildrenInfo = function(t, n, i) {
                    var r = this.keys[n].k[t];
                    var e = 0;
                    var o = new Int32Array(3 * i);
                    o[e++] = r, o[e++] = n;
                    var s = n;
                    var a = n;
                    for (; s < n + i; s++) {
                        var u = this.keys[s].k[t];
                        r !== u && (o[e++] = s - a, o[e++] = u, o[e++] = s, r = u, a = s)
                    }
                    return o[e++] = s - a, o.subarray(0, e)
                }, n.prototype.setBC = function(t, n, i) {
                    var r = this.bc;
                    var o;
                    for (r.setBase(t, i), o = 0; o < n.length; o += 3) {
                        var s = n[o];
                        var a = i + s;
                        var u = -r.getBase(a);
                        var c = -r.getCheck(a);
                        a !== r.getFirstUnusedNode() ? r.setCheck(u, -c) : r.setFirstUnusedNode(c), r.setBase(c, -u);
                        var h = t;
                        if (r.setCheck(a, h), s === e) {
                            var f = n[o + 1];
                            var l = this.keys[f].v;
                            null == l && (l = 0);
                            var d = -l - 1;
                            r.setBase(a, d)
                        }
                    }
                }, n.prototype.findAllocatableBase = function(t) {
                    var n = this.bc;
                    var i;
                    var r = n.getFirstUnusedNode();
                    for (;;)
                        if ((i = r - t[0]) < 0) r = -n.getCheck(r);
                        else {
                            var e = !0;
                            for (var o = 0; o < t.length; o += 3) {
                                var s = i + t[o];
                                if (!this.isUnusedNode(s)) {
                                    r = -n.getCheck(r), e = !1;
                                    break
                                }
                            }
                            if (e) return i
                        }
                }, n.prototype.isUnusedNode = function(t) {
                    var n = this.bc.getCheck(t);
                    return t !== o && n < 0
                }, i.prototype.contain = function(t) {
                    var n = this.bc;
                    var i = p(t += r);
                    var e = o;
                    var a = s;
                    for (var u = 0; u < i.length; u++) {
                        var c = i[u];
                        if ((a = this.traverse(e, c)) === s) return !1;
                        if (n.getBase(a) <= 0) return !0;
                        e = a
                    }
                    return !1
                }, i.prototype.lookup = function(t) {
                    var n = p(t += r);
                    var i = o;
                    var e = s;
                    for (var a = 0; a < n.length; a++) {
                        var u = n[a];
                        if ((e = this.traverse(i, u)) === s) return s;
                        i = e
                    }
                    var c = this.bc.getBase(e);
                    return c <= 0 ? -c - 1 : s
                }, i.prototype.commonPrefixSearch = function(t) {
                    var n = p(t);
                    var i = o;
                    var r = s;
                    var a = [];
                    for (var u = 0; u < n.length; u++) {
                        var c = n[u];
                        if ((r = this.traverse(i, c)) === s) break;
                        i = r;
                        var h = this.traverse(r, e);
                        if (h !== s) {
                            var f = this.bc.getBase(h);
                            var l = {};
                            f <= 0 && (l.v = -f - 1), l.k = w(v(n, 0, u + 1)), a.push(l)
                        }
                    }
                    return a
                }, i.prototype.traverse = function(t, n) {
                    var i = this.bc.getBase(t) + n;
                    return this.bc.getCheck(i) === t ? i : s
                }, i.prototype.size = function() {
                    return this.bc.size()
                }, i.prototype.calc = function() {
                    return this.bc.calc()
                }, i.prototype.dump = function() {
                    return this.bc.dump()
                };
                var d = function(t, n, i) {
                    if (t) switch (n) {
                        case 1:
                            return new Int8Array(i);
                        case 2:
                            return new Int16Array(i);
                        case 4:
                            return new Int32Array(i);
                        default:
                            throw new RangeError("Invalid newArray parameter element_bytes:" + n)
                    } else switch (n) {
                        case 1:
                            return new Uint8Array(i);
                        case 2:
                            return new Uint16Array(i);
                        case 4:
                            return new Uint32Array(i);
                        default:
                            throw new RangeError("Invalid newArray parameter element_bytes:" + n)
                    }
                };
                var v = function(t, n, i) {
                    var r = new ArrayBuffer(i);
                    var e = new Uint8Array(r, 0, i);
                    var o = t.subarray(n, i);
                    return e.set(o), e
                };
                var p = function(t) {
                    var n = new Uint8Array(new ArrayBuffer(4 * t.length));
                    var i = 0,
                        r = 0;
                    for (; i < t.length;) {
                        var e;
                        var o = t.charCodeAt(i++);
                        if (o >= 55296 && o <= 56319) {
                            var s = o;
                            var a = t.charCodeAt(i++);
                            if (!(a >= 56320 && a <= 57343)) return null;
                            e = 1024 * (s - 55296) + 65536 + (a - 56320)
                        } else e = o;
                        e < 128 ? n[r++] = e : e < 2048 ? (n[r++] = e >>> 6 | 192, n[r++] = 63 & e | 128) : e < 65536 ? (n[r++] = e >>> 12 | 224, n[r++] = e >> 6 & 63 | 128, n[r++] = 63 & e | 128) : e < 1 << 21 && (n[r++] = e >>> 18 | 240, n[r++] = e >> 12 & 63 | 128, n[r++] = e >> 6 & 63 | 128, n[r++] = 63 & e | 128)
                    }
                    return n.subarray(0, r)
                };
                var w = function(t) {
                    var n = "";
                    var i, r, e, o;
                    var s = 0;
                    for (; s < t.length;)(i = (r = t[s++]) < 128 ? r : r >> 5 == 6 ? (31 & r) << 6 | 63 & t[s++] : r >> 4 == 14 ? (15 & r) << 12 | (63 & t[s++]) << 6 | 63 & t[s++] : (7 & r) << 18 | (63 & t[s++]) << 12 | (63 & t[s++]) << 6 | 63 & t[s++]) < 65536 ? n += String.fromCharCode(i) : (e = 55296 | (i -= 65536) >> 10, o = 56320 | 1023 & i, n += String.fromCharCode(e, o));
                    return n
                };
                var g = {
                    builder: function(t) {
                        return new n(t)
                    },
                    load: function(t, n) {
                        var r = l(0);
                        return r.loadBaseBuffer(t), r.loadCheckBuffer(n), new i(r)
                    }
                };
                t.exports = g
            }()
        },
        4907: (t, n, i) => {
            "use strict";
    
            function r(t, n, i, r) {
                this.trie = null != t ? t : e.builder(0).build([{
                    k: "",
                    v: 1
                }]), this.token_info_dictionary = null != n ? n : new o, this.connection_costs = null != i ? i : new s(0, 0), this.unknown_dictionary = null != r ? r : new a
            }
            var e = i(725);
            var o = i(7756);
            var s = i(5929);
            var a = i(8068);
            r.prototype.loadTrie = function(t, n) {
                return this.trie = e.load(t, n), this
            }, r.prototype.loadTokenInfoDictionaries = function(t, n, i) {
                return this.token_info_dictionary.loadDictionary(t), this.token_info_dictionary.loadPosVector(n), this.token_info_dictionary.loadTargetMap(i), this
            }, r.prototype.loadConnectionCosts = function(t) {
                return this.connection_costs.loadConnectionCosts(t), this
            }, r.prototype.loadUnknownDictionaries = function(t, n, i, r, e, o) {
                return this.unknown_dictionary.loadUnknownDictionaries(t, n, i, r, e, o), this
            }, t.exports = r
        },
        725: t => {
            ! function() {
                "use strict";
    
                function n(t) {
                    this.bc = l(t), this.keys = []
                }
    
                function i(t) {
                    this.bc = t, this.bc.shrink()
                }
                var r = "\0",
                    e = 0,
                    o = 0,
                    s = -1,
                    a = !0,
                    u = !0,
                    c = 4,
                    h = 4,
                    f = 2;
                var l = function(t) {
                    null == t && (t = 1024);
                    var n = function(t, n, i) {
                        for (var r = n; r < i; r++) t[r] = 1 - r;
                        if (0 < l.array[l.array.length - 1]) {
                            var e = l.array.length - 2;
                            for (; 0 < l.array[e];) e--;
                            t[n] = -e
                        }
                    };
                    var i = function(t, n, i) {
                        for (var r = n; r < i; r++) t[r] = -r - 1
                    };
                    var r = function(t) {
                        var r = t * f;
                        var e = d(s.signed, s.bytes, r);
                        n(e, s.array.length, r), e.set(s.array), s.array = null, s.array = e;
                        var o = d(l.signed, l.bytes, r);
                        i(o, l.array.length, r), o.set(l.array), l.array = null, l.array = o
                    };
                    var e = o + 1;
                    var s = {
                        signed: a,
                        bytes: c,
                        array: d(a, c, t)
                    };
                    var l = {
                        signed: u,
                        bytes: h,
                        array: d(u, h, t)
                    };
                    return s.array[o] = 1, l.array[o] = o, n(s.array, o + 1, s.array.length), i(l.array, o + 1, l.array.length), {
                        getBaseBuffer: function() {
                            return s.array
                        },
                        getCheckBuffer: function() {
                            return l.array
                        },
                        loadBaseBuffer: function(t) {
                            return s.array = t, this
                        },
                        loadCheckBuffer: function(t) {
                            return l.array = t, this
                        },
                        size: function() {
                            return Math.max(s.array.length, l.array.length)
                        },
                        getBase: function(t) {
                            return s.array.length - 1 < t ? 1 - t : s.array[t]
                        },
                        getCheck: function(t) {
                            return l.array.length - 1 < t ? -t - 1 : l.array[t]
                        },
                        setBase: function(t, n) {
                            s.array.length - 1 < t && r(t), s.array[t] = n
                        },
                        setCheck: function(t, n) {
                            l.array.length - 1 < t && r(t), l.array[t] = n
                        },
                        setFirstUnusedNode: function(t) {
                            e = t
                        },
                        getFirstUnusedNode: function() {
                            return e
                        },
                        shrink: function() {
                            var t = this.size() - 1;
                            for (; !(0 <= l.array[t]);) t--;
                            s.array = s.array.subarray(0, t + 2), l.array = l.array.subarray(0, t + 2)
                        },
                        calc: function() {
                            var t = 0;
                            var n = l.array.length;
                            for (var i = 0; i < n; i++) l.array[i] < 0 && t++;
                            return {
                                all: n,
                                unused: t,
                                efficiency: (n - t) / n
                            }
                        },
                        dump: function() {
                            var t = "";
                            var n = "";
                            var i;
                            for (i = 0; i < s.array.length; i++) t = t + " " + this.getBase(i);
                            for (i = 0; i < l.array.length; i++) n = n + " " + this.getCheck(i);
                            return "base:" + t + " chck:" + n
                        }
                    }
                };
                n.prototype.append = function(t, n) {
                    return this.keys.push({
                        k: t,
                        v: n
                    }), this
                }, n.prototype.build = function(t, n) {
                    if (null == t && (t = this.keys), null == t) return new i(this.bc);
                    null == n && (n = !1);
                    var e = t.map((function(t) {
                        return {
                            k: p(t.k + r),
                            v: t.v
                        }
                    }));
                    return this.keys = n ? e : e.sort((function(t, n) {
                        var i = t.k;
                        var r = n.k;
                        var e = Math.min(i.length, r.length);
                        for (var o = 0; o < e; o++)
                            if (i[o] !== r[o]) return i[o] - r[o];
                        return i.length - r.length
                    })), e = null, this._build(o, 0, 0, this.keys.length), new i(this.bc)
                }, n.prototype._build = function(t, n, i, r) {
                    var o = this.getChildrenInfo(n, i, r);
                    var s = this.findAllocatableBase(o);
                    this.setBC(t, o, s);
                    for (var a = 0; a < o.length; a += 3) {
                        var u = o[a];
                        if (u !== e) {
                            var c = o[a + 1];
                            var h = o[a + 2];
                            var f = s + u;
                            this._build(f, n + 1, c, h)
                        }
                    }
                }, n.prototype.getChildrenInfo = function(t, n, i) {
                    var r = this.keys[n].k[t];
                    var e = 0;
                    var o = new Int32Array(3 * i);
                    o[e++] = r, o[e++] = n;
                    var s = n;
                    var a = n;
                    for (; s < n + i; s++) {
                        var u = this.keys[s].k[t];
                        r !== u && (o[e++] = s - a, o[e++] = u, o[e++] = s, r = u, a = s)
                    }
                    return o[e++] = s - a, o.subarray(0, e)
                }, n.prototype.setBC = function(t, n, i) {
                    var r = this.bc;
                    var o;
                    for (r.setBase(t, i), o = 0; o < n.length; o += 3) {
                        var s = n[o];
                        var a = i + s;
                        var u = -r.getBase(a);
                        var c = -r.getCheck(a);
                        a !== r.getFirstUnusedNode() ? r.setCheck(u, -c) : r.setFirstUnusedNode(c), r.setBase(c, -u);
                        var h = t;
                        if (r.setCheck(a, h), s === e) {
                            var f = n[o + 1];
                            var l = this.keys[f].v;
                            null == l && (l = 0);
                            var d = -l - 1;
                            r.setBase(a, d)
                        }
                    }
                }, n.prototype.findAllocatableBase = function(t) {
                    var n = this.bc;
                    var i;
                    var r = n.getFirstUnusedNode();
                    for (;;)
                        if ((i = r - t[0]) < 0) r = -n.getCheck(r);
                        else {
                            var e = !0;
                            for (var o = 0; o < t.length; o += 3) {
                                var s = i + t[o];
                                if (!this.isUnusedNode(s)) {
                                    r = -n.getCheck(r), e = !1;
                                    break
                                }
                            }
                            if (e) return i
                        }
                }, n.prototype.isUnusedNode = function(t) {
                    var n = this.bc.getCheck(t);
                    return t !== o && n < 0
                }, i.prototype.contain = function(t) {
                    var n = this.bc;
                    var i = p(t += r);
                    var e = o;
                    var a = s;
                    for (var u = 0; u < i.length; u++) {
                        var c = i[u];
                        if ((a = this.traverse(e, c)) === s) return !1;
                        if (n.getBase(a) <= 0) return !0;
                        e = a
                    }
                    return !1
                }, i.prototype.lookup = function(t) {
                    var n = p(t += r);
                    var i = o;
                    var e = s;
                    for (var a = 0; a < n.length; a++) {
                        var u = n[a];
                        if ((e = this.traverse(i, u)) === s) return s;
                        i = e
                    }
                    var c = this.bc.getBase(e);
                    return c <= 0 ? -c - 1 : s
                }, i.prototype.commonPrefixSearch = function(t) {
                    var n = p(t);
                    var i = o;
                    var r = s;
                    var a = [];
                    for (var u = 0; u < n.length; u++) {
                        var c = n[u];
                        if ((r = this.traverse(i, c)) === s) break;
                        i = r;
                        var h = this.traverse(r, e);
                        if (h !== s) {
                            var f = this.bc.getBase(h);
                            var l = {};
                            f <= 0 && (l.v = -f - 1), l.k = w(v(n, 0, u + 1)), a.push(l)
                        }
                    }
                    return a
                }, i.prototype.traverse = function(t, n) {
                    var i = this.bc.getBase(t) + n;
                    return this.bc.getCheck(i) === t ? i : s
                }, i.prototype.size = function() {
                    return this.bc.size()
                }, i.prototype.calc = function() {
                    return this.bc.calc()
                }, i.prototype.dump = function() {
                    return this.bc.dump()
                };
                var d = function(t, n, i) {
                    if (t) switch (n) {
                        case 1:
                            return new Int8Array(i);
                        case 2:
                            return new Int16Array(i);
                        case 4:
                            return new Int32Array(i);
                        default:
                            throw new RangeError("Invalid newArray parameter element_bytes:" + n)
                    } else switch (n) {
                        case 1:
                            return new Uint8Array(i);
                        case 2:
                            return new Uint16Array(i);
                        case 4:
                            return new Uint32Array(i);
                        default:
                            throw new RangeError("Invalid newArray parameter element_bytes:" + n)
                    }
                };
                var v = function(t, n, i) {
                    var r = new ArrayBuffer(i);
                    var e = new Uint8Array(r, 0, i);
                    var o = t.subarray(n, i);
                    return e.set(o), e
                };
                var p = function(t) {
                    var n = new Uint8Array(new ArrayBuffer(4 * t.length));
                    var i = 0,
                        r = 0;
                    for (; i < t.length;) {
                        var e;
                        var o = t.charCodeAt(i++);
                        if (o >= 55296 && o <= 56319) {
                            var s = o;
                            var a = t.charCodeAt(i++);
                            if (!(a >= 56320 && a <= 57343)) return null;
                            e = 1024 * (s - 55296) + 65536 + (a - 56320)
                        } else e = o;
                        e < 128 ? n[r++] = e : e < 2048 ? (n[r++] = e >>> 6 | 192, n[r++] = 63 & e | 128) : e < 65536 ? (n[r++] = e >>> 12 | 224, n[r++] = e >> 6 & 63 | 128, n[r++] = 63 & e | 128) : e < 1 << 21 && (n[r++] = e >>> 18 | 240, n[r++] = e >> 12 & 63 | 128, n[r++] = e >> 6 & 63 | 128, n[r++] = 63 & e | 128)
                    }
                    return n.subarray(0, r)
                };
                var w = function(t) {
                    var n = "";
                    var i, r, e, o;
                    var s = 0;
                    for (; s < t.length;)(i = (r = t[s++]) < 128 ? r : r >> 5 == 6 ? (31 & r) << 6 | 63 & t[s++] : r >> 4 == 14 ? (15 & r) << 12 | (63 & t[s++]) << 6 | 63 & t[s++] : (7 & r) << 18 | (63 & t[s++]) << 12 | (63 & t[s++]) << 6 | 63 & t[s++]) < 65536 ? n += String.fromCharCode(i) : (e = 55296 | (i -= 65536) >> 10, o = 56320 | 1023 & i, n += String.fromCharCode(e, o));
                    return n
                };
                var g = {
                    builder: function(t) {
                        return new n(t)
                    },
                    load: function(t, n) {
                        var r = l(0);
                        return r.loadBaseBuffer(t), r.loadCheckBuffer(n), new i(r)
                    }
                };
                t.exports = g
            }()
        },
        7756: (t, n, i) => {
            "use strict";
    
            function r() {
                this.dictionary = new e(10485760), this.target_map = {}, this.pos_buffer = new e(10485760)
            }
            var e = i(3178);
            r.prototype.buildDictionary = function(t) {
                var n = {};
                for (var i = 0; i < t.length; i++) {
                    var r = t[i];
                    if (!(r.length < 4)) {
                        var e = r[0];
                        var o = r[1];
                        var s = r[2];
                        var a = r[3];
                        var u = r.slice(4).join(",");
                        !isFinite(o) || !isFinite(s) || isFinite(a), n[this.put(o, s, a, e, u)] = e
                    }
                }
                return this.dictionary.shrink(), this.pos_buffer.shrink(), n
            }, r.prototype.put = function(t, n, i, r, e) {
                var o = this.dictionary.position;
                var s = this.pos_buffer.position;
                return this.dictionary.putShort(t), this.dictionary.putShort(n), this.dictionary.putShort(i), this.dictionary.putInt(s), this.pos_buffer.putString(r + "," + e), o
            }, r.prototype.addMapping = function(t, n) {
                var i = this.target_map[t];
                null == i && (i = []), i.push(n), this.target_map[t] = i
            }, r.prototype.targetMapToBuffer = function() {
                var t = new e;
                var n = Object.keys(this.target_map).length;
                for (var i in t.putInt(n), this.target_map) {
                    var r = this.target_map[i];
                    var o = r.length;
                    t.putInt(parseInt(i)), t.putInt(o);
                    for (var s = 0; s < r.length; s++) t.putInt(r[s])
                }
                return t.shrink()
            }, r.prototype.loadDictionary = function(t) {
                return this.dictionary = new e(t), this
            }, r.prototype.loadPosVector = function(t) {
                return this.pos_buffer = new e(t), this
            }, r.prototype.loadTargetMap = function(t) {
                var n = new e(t);
                for (n.position = 0, this.target_map = {}, n.readInt(); !(n.buffer.length < n.position + 1);) {
                    var i = n.readInt();
                    var r = n.readInt();
                    for (var o = 0; o < r; o++) {
                        var s = n.readInt();
                        this.addMapping(i, s)
                    }
                }
                return this
            }, r.prototype.getFeatures = function(t) {
                var n = parseInt(t);
                if (isNaN(n)) return "";
                var i = this.dictionary.getInt(n + 6);
                return this.pos_buffer.getString(i)
            }, t.exports = r
        },
        3178: t => {
            "use strict";
    
            function n(t) {
                var n;
                if (null == t) n = 1048576;
                else {
                    if ("number" != typeof t) {
                        if (t instanceof Uint8Array) return this.buffer = t, void(this.position = 0);
                        throw typeof t + " is invalid parameter type for ByteBuffer constructor"
                    }
                    n = t
                }
                this.buffer = new Uint8Array(n), this.position = 0
            }
            var i = function(t) {
                var n = new Uint8Array(4 * t.length);
                var i = 0,
                    r = 0;
                for (; i < t.length;) {
                    var e;
                    var o = t.charCodeAt(i++);
                    if (o >= 55296 && o <= 56319) {
                        var s = o;
                        var a = t.charCodeAt(i++);
                        if (!(a >= 56320 && a <= 57343)) return null;
                        e = 1024 * (s - 55296) + 65536 + (a - 56320)
                    } else e = o;
                    e < 128 ? n[r++] = e : e < 2048 ? (n[r++] = e >>> 6 | 192, n[r++] = 63 & e | 128) : e < 65536 ? (n[r++] = e >>> 12 | 224, n[r++] = e >> 6 & 63 | 128, n[r++] = 63 & e | 128) : e < 1 << 21 && (n[r++] = e >>> 18 | 240, n[r++] = e >> 12 & 63 | 128, n[r++] = e >> 6 & 63 | 128, n[r++] = 63 & e | 128)
                }
                return n.subarray(0, r)
            };
            var r = function(t) {
                var n = "";
                var i, r, e, o;
                var s = 0;
                for (; s < t.length;)(i = (r = t[s++]) < 128 ? r : r >> 5 == 6 ? (31 & r) << 6 | 63 & t[s++] : r >> 4 == 14 ? (15 & r) << 12 | (63 & t[s++]) << 6 | 63 & t[s++] : (7 & r) << 18 | (63 & t[s++]) << 12 | (63 & t[s++]) << 6 | 63 & t[s++]) < 65536 ? n += String.fromCharCode(i) : (e = 55296 | (i -= 65536) >> 10, o = 56320 | 1023 & i, n += String.fromCharCode(e, o));
                return n
            };
            n.prototype.size = function() {
                return this.buffer.length
            }, n.prototype.reallocate = function() {
                var t = new Uint8Array(2 * this.buffer.length);
                t.set(this.buffer), this.buffer = t
            }, n.prototype.shrink = function() {
                return this.buffer = this.buffer.subarray(0, this.position), this.buffer
            }, n.prototype.put = function(t) {
                this.buffer.length < this.position + 1 && this.reallocate(), this.buffer[this.position++] = t
            }, n.prototype.get = function(t) {
                return null == t && (t = this.position, this.position += 1), this.buffer.length < t + 1 ? 0 : this.buffer[t]
            }, n.prototype.putShort = function(t) {
                if (65535 < t) throw t + " is over short value";
                var n = 255 & t;
                var i = (65280 & t) >> 8;
                this.put(n), this.put(i)
            }, n.prototype.getShort = function(t) {
                if (null == t && (t = this.position, this.position += 2), this.buffer.length < t + 2) return 0;
                var n = this.buffer[t];
                var i = (this.buffer[t + 1] << 8) + n;
                return 32768 & i && (i = -(i - 1 ^ 65535)), i
            }, n.prototype.putInt = function(t) {
                if (4294967295 < t) throw t + " is over integer value";
                var n = 255 & t;
                var i = (65280 & t) >> 8;
                var r = (16711680 & t) >> 16;
                var e = (4278190080 & t) >> 24;
                this.put(n), this.put(i), this.put(r), this.put(e)
            }, n.prototype.getInt = function(t) {
                if (null == t && (t = this.position, this.position += 4), this.buffer.length < t + 4) return 0;
                var n = this.buffer[t];
                var i = this.buffer[t + 1];
                var r = this.buffer[t + 2];
                return (this.buffer[t + 3] << 24) + (r << 16) + (i << 8) + n
            }, n.prototype.readInt = function() {
                var t = this.position;
                return this.position += 4, this.getInt(t)
            }, n.prototype.putString = function(t) {
                var n = i(t);
                for (var r = 0; r < n.length; r++) this.put(n[r]);
                this.put(0)
            }, n.prototype.getString = function(t) {
                var n, i = [];
                for (null == t && (t = this.position); !(this.buffer.length < t + 1) && 0 !== (n = this.get(t++));) i.push(n);
                return this.position = t, r(i)
            }, t.exports = n
        },
        5929: t => {
            "use strict";
    
            function n(t, n) {
                this.forward_dimension = t, this.backward_dimension = n, this.buffer = new Int16Array(t * n + 2), this.buffer[0] = t, this.buffer[1] = n
            }
            n.prototype.put = function(t, n, i) {
                var r = t * this.backward_dimension + n + 2;
                if (this.buffer.length < r + 1) throw "ConnectionCosts buffer overflow";
                this.buffer[r] = i
            }, n.prototype.get = function(t, n) {
                var i = t * this.backward_dimension + n + 2;
                if (this.buffer.length < i + 1) throw "ConnectionCosts buffer overflow";
                return this.buffer[i]
            }, n.prototype.loadConnectionCosts = function(t) {
                this.forward_dimension = t[0], this.backward_dimension = t[1], this.buffer = t
            }, t.exports = n
        },
        8068: (t, n, i) => {
            "use strict";
    
            function r() {
                this.dictionary = new s(10485760), this.target_map = {}, this.pos_buffer = new s(10485760), this.character_definition = null
            }
            var e = i(7756);
            var o = i(7982);
            var s = i(3178);
            r.prototype = Object.create(e.prototype), r.prototype.characterDefinition = function(t) {
                return this.character_definition = t, this
            }, r.prototype.lookup = function(t) {
                return this.character_definition.lookup(t)
            }, r.prototype.lookupCompatibleCategory = function(t) {
                return this.character_definition.lookupCompatibleCategory(t)
            }, r.prototype.loadUnknownDictionaries = function(t, n, i, r, e, s) {
                this.loadDictionary(t), this.loadPosVector(n), this.loadTargetMap(i), this.character_definition = o.load(r, e, s)
            }, t.exports = r
        },
        7756: (t, n, i) => {
            "use strict";
    
            function r() {
                this.dictionary = new e(10485760), this.target_map = {}, this.pos_buffer = new e(10485760)
            }
            var e = i(3178);
            r.prototype.buildDictionary = function(t) {
                var n = {};
                for (var i = 0; i < t.length; i++) {
                    var r = t[i];
                    if (!(r.length < 4)) {
                        var e = r[0];
                        var o = r[1];
                        var s = r[2];
                        var a = r[3];
                        var u = r.slice(4).join(",");
                        !isFinite(o) || !isFinite(s) || isFinite(a), n[this.put(o, s, a, e, u)] = e
                    }
                }
                return this.dictionary.shrink(), this.pos_buffer.shrink(), n
            }, r.prototype.put = function(t, n, i, r, e) {
                var o = this.dictionary.position;
                var s = this.pos_buffer.position;
                return this.dictionary.putShort(t), this.dictionary.putShort(n), this.dictionary.putShort(i), this.dictionary.putInt(s), this.pos_buffer.putString(r + "," + e), o
            }, r.prototype.addMapping = function(t, n) {
                var i = this.target_map[t];
                null == i && (i = []), i.push(n), this.target_map[t] = i
            }, r.prototype.targetMapToBuffer = function() {
                var t = new e;
                var n = Object.keys(this.target_map).length;
                for (var i in t.putInt(n), this.target_map) {
                    var r = this.target_map[i];
                    var o = r.length;
                    t.putInt(parseInt(i)), t.putInt(o);
                    for (var s = 0; s < r.length; s++) t.putInt(r[s])
                }
                return t.shrink()
            }, r.prototype.loadDictionary = function(t) {
                return this.dictionary = new e(t), this
            }, r.prototype.loadPosVector = function(t) {
                return this.pos_buffer = new e(t), this
            }, r.prototype.loadTargetMap = function(t) {
                var n = new e(t);
                for (n.position = 0, this.target_map = {}, n.readInt(); !(n.buffer.length < n.position + 1);) {
                    var i = n.readInt();
                    var r = n.readInt();
                    for (var o = 0; o < r; o++) {
                        var s = n.readInt();
                        this.addMapping(i, s)
                    }
                }
                return this
            }, r.prototype.getFeatures = function(t) {
                var n = parseInt(t);
                if (isNaN(n)) return "";
                var i = this.dictionary.getInt(n + 6);
                return this.pos_buffer.getString(i)
            }, t.exports = r
        },
        3178: t => {
            "use strict";
    
            function n(t) {
                var n;
                if (null == t) n = 1048576;
                else {
                    if ("number" != typeof t) {
                        if (t instanceof Uint8Array) return this.buffer = t, void(this.position = 0);
                        throw typeof t + " is invalid parameter type for ByteBuffer constructor"
                    }
                    n = t
                }
                this.buffer = new Uint8Array(n), this.position = 0
            }
            var i = function(t) {
                var n = new Uint8Array(4 * t.length);
                var i = 0,
                    r = 0;
                for (; i < t.length;) {
                    var e;
                    var o = t.charCodeAt(i++);
                    if (o >= 55296 && o <= 56319) {
                        var s = o;
                        var a = t.charCodeAt(i++);
                        if (!(a >= 56320 && a <= 57343)) return null;
                        e = 1024 * (s - 55296) + 65536 + (a - 56320)
                    } else e = o;
                    e < 128 ? n[r++] = e : e < 2048 ? (n[r++] = e >>> 6 | 192, n[r++] = 63 & e | 128) : e < 65536 ? (n[r++] = e >>> 12 | 224, n[r++] = e >> 6 & 63 | 128, n[r++] = 63 & e | 128) : e < 1 << 21 && (n[r++] = e >>> 18 | 240, n[r++] = e >> 12 & 63 | 128, n[r++] = e >> 6 & 63 | 128, n[r++] = 63 & e | 128)
                }
                return n.subarray(0, r)
            };
            var r = function(t) {
                var n = "";
                var i, r, e, o;
                var s = 0;
                for (; s < t.length;)(i = (r = t[s++]) < 128 ? r : r >> 5 == 6 ? (31 & r) << 6 | 63 & t[s++] : r >> 4 == 14 ? (15 & r) << 12 | (63 & t[s++]) << 6 | 63 & t[s++] : (7 & r) << 18 | (63 & t[s++]) << 12 | (63 & t[s++]) << 6 | 63 & t[s++]) < 65536 ? n += String.fromCharCode(i) : (e = 55296 | (i -= 65536) >> 10, o = 56320 | 1023 & i, n += String.fromCharCode(e, o));
                return n
            };
            n.prototype.size = function() {
                return this.buffer.length
            }, n.prototype.reallocate = function() {
                var t = new Uint8Array(2 * this.buffer.length);
                t.set(this.buffer), this.buffer = t
            }, n.prototype.shrink = function() {
                return this.buffer = this.buffer.subarray(0, this.position), this.buffer
            }, n.prototype.put = function(t) {
                this.buffer.length < this.position + 1 && this.reallocate(), this.buffer[this.position++] = t
            }, n.prototype.get = function(t) {
                return null == t && (t = this.position, this.position += 1), this.buffer.length < t + 1 ? 0 : this.buffer[t]
            }, n.prototype.putShort = function(t) {
                if (65535 < t) throw t + " is over short value";
                var n = 255 & t;
                var i = (65280 & t) >> 8;
                this.put(n), this.put(i)
            }, n.prototype.getShort = function(t) {
                if (null == t && (t = this.position, this.position += 2), this.buffer.length < t + 2) return 0;
                var n = this.buffer[t];
                var i = (this.buffer[t + 1] << 8) + n;
                return 32768 & i && (i = -(i - 1 ^ 65535)), i
            }, n.prototype.putInt = function(t) {
                if (4294967295 < t) throw t + " is over integer value";
                var n = 255 & t;
                var i = (65280 & t) >> 8;
                var r = (16711680 & t) >> 16;
                var e = (4278190080 & t) >> 24;
                this.put(n), this.put(i), this.put(r), this.put(e)
            }, n.prototype.getInt = function(t) {
                if (null == t && (t = this.position, this.position += 4), this.buffer.length < t + 4) return 0;
                var n = this.buffer[t];
                var i = this.buffer[t + 1];
                var r = this.buffer[t + 2];
                return (this.buffer[t + 3] << 24) + (r << 16) + (i << 8) + n
            }, n.prototype.readInt = function() {
                var t = this.position;
                return this.position += 4, this.getInt(t)
            }, n.prototype.putString = function(t) {
                var n = i(t);
                for (var r = 0; r < n.length; r++) this.put(n[r]);
                this.put(0)
            }, n.prototype.getString = function(t) {
                var n, i = [];
                for (null == t && (t = this.position); !(this.buffer.length < t + 1) && 0 !== (n = this.get(t++));) i.push(n);
                return this.position = t, r(i)
            }, t.exports = n
        },
        7982: (t, n, i) => {
            "use strict";
    
            function r() {
                this.character_category_map = new Uint8Array(65536), this.compatible_category_map = new Uint32Array(65536), this.invoke_definition_map = null
            }
            var e = i(9738);
            var o = i(6440);
            var s = i(4152);
            var a = "DEFAULT";
            r.load = function(t, n, i) {
                var o = new r;
                return o.character_category_map = t, o.compatible_category_map = n, o.invoke_definition_map = e.load(i), o
            }, r.parseCharCategory = function(t, n) {
                var i = n[1];
                var r = parseInt(n[2]);
                var e = parseInt(n[3]);
                var s = parseInt(n[4]);
                return !isFinite(r) || 0 !== r && 1 !== r || !isFinite(e) || 0 !== e && 1 !== e || !isFinite(s) || s < 0 ? null : new o(t, i, 1 === r, 1 === e, s)
            }, r.parseCategoryMapping = function(t) {
                var n = parseInt(t[1]);
                var i = t[2];
                var r = 3 < t.length ? t.slice(3) : [];
                return isFinite(n), {
                    start: n,
                    default: i,
                    compatible: r
                }
            }, r.parseRangeCategoryMapping = function(t) {
                var n = parseInt(t[1]);
                var i = parseInt(t[2]);
                var r = t[3];
                var e = 4 < t.length ? t.slice(4) : [];
                return isFinite(n), isFinite(i), {
                    start: n,
                    end: i,
                    default: r,
                    compatible: e
                }
            }, r.prototype.initCategoryMappings = function(t) {
                var n;
                if (null != t)
                    for (var i = 0; i < t.length; i++) {
                        var r = t[i];
                        var e = r.end || r.start;
                        for (n = r.start; n <= e; n++) {
                            this.character_category_map[n] = this.invoke_definition_map.lookup(r.default);
                            for (var o = 0; o < r.compatible.length; o++) {
                                var s = this.compatible_category_map[n];
                                var u = r.compatible[o];
                                if (null != u) {
                                    var c = this.invoke_definition_map.lookup(u);
                                    null != c && (s |= 1 << c, this.compatible_category_map[n] = s)
                                }
                            }
                        }
                    }
                var h = this.invoke_definition_map.lookup(a);
                if (null != h)
                    for (n = 0; n < this.character_category_map.length; n++) 0 === this.character_category_map[n] && (this.character_category_map[n] = 1 << h)
            }, r.prototype.lookupCompatibleCategory = function(t) {
                var n = [];
                var i = t.charCodeAt(0);
                var r;
                if (i < this.compatible_category_map.length && (r = this.compatible_category_map[i]), null == r || 0 === r) return n;
                for (var e = 0; e < 32; e++)
                    if (r << 31 - e >>> 31 == 1) {
                        var o = this.invoke_definition_map.getCharacterClass(e);
                        if (null == o) continue;
                        n.push(o)
                    } return n
            }, r.prototype.lookup = function(t) {
                var n;
                var i = t.charCodeAt(0);
                return s.isSurrogatePair(t) ? n = this.invoke_definition_map.lookup(a) : i < this.character_category_map.length && (n = this.character_category_map[i]), null == n && (n = this.invoke_definition_map.lookup(a)), this.invoke_definition_map.getCharacterClass(n)
            }, t.exports = r
        },
        9738: (t, n, i) => {
            "use strict";
    
            function r() {
                this.map = [], this.lookup_table = {}
            }
            var e = i(3178);
            var o = i(6440);
            r.load = function(t) {
                var n = new r;
                var i = [];
                var s = new e(t);
                for (; s.position + 1 < s.size();) {
                    var a = i.length;
                    var u = s.get();
                    var c = s.get();
                    var h = s.getInt();
                    var f = s.getString();
                    i.push(new o(a, f, u, c, h))
                }
                return n.init(i), n
            }, r.prototype.init = function(t) {
                if (null != t)
                    for (var n = 0; n < t.length; n++) {
                        var i = t[n];
                        this.map[n] = i, this.lookup_table[i.class_name] = n
                    }
            }, r.prototype.getCharacterClass = function(t) {
                return this.map[t]
            }, r.prototype.lookup = function(t) {
                var n = this.lookup_table[t];
                return null == n ? null : n
            }, r.prototype.toBuffer = function() {
                var t = new e;
                for (var n = 0; n < this.map.length; n++) {
                    var i = this.map[n];
                    t.put(i.is_always_invoke), t.put(i.is_grouping), t.putInt(i.max_length), t.putString(i.class_name)
                }
                return t.shrink(), t.buffer
            }, t.exports = r
        },
        3178: t => {
            "use strict";
    
            function n(t) {
                var n;
                if (null == t) n = 1048576;
                else {
                    if ("number" != typeof t) {
                        if (t instanceof Uint8Array) return this.buffer = t, void(this.position = 0);
                        throw typeof t + " is invalid parameter type for ByteBuffer constructor"
                    }
                    n = t
                }
                this.buffer = new Uint8Array(n), this.position = 0
            }
            var i = function(t) {
                var n = new Uint8Array(4 * t.length);
                var i = 0,
                    r = 0;
                for (; i < t.length;) {
                    var e;
                    var o = t.charCodeAt(i++);
                    if (o >= 55296 && o <= 56319) {
                        var s = o;
                        var a = t.charCodeAt(i++);
                        if (!(a >= 56320 && a <= 57343)) return null;
                        e = 1024 * (s - 55296) + 65536 + (a - 56320)
                    } else e = o;
                    e < 128 ? n[r++] = e : e < 2048 ? (n[r++] = e >>> 6 | 192, n[r++] = 63 & e | 128) : e < 65536 ? (n[r++] = e >>> 12 | 224, n[r++] = e >> 6 & 63 | 128, n[r++] = 63 & e | 128) : e < 1 << 21 && (n[r++] = e >>> 18 | 240, n[r++] = e >> 12 & 63 | 128, n[r++] = e >> 6 & 63 | 128, n[r++] = 63 & e | 128)
                }
                return n.subarray(0, r)
            };
            var r = function(t) {
                var n = "";
                var i, r, e, o;
                var s = 0;
                for (; s < t.length;)(i = (r = t[s++]) < 128 ? r : r >> 5 == 6 ? (31 & r) << 6 | 63 & t[s++] : r >> 4 == 14 ? (15 & r) << 12 | (63 & t[s++]) << 6 | 63 & t[s++] : (7 & r) << 18 | (63 & t[s++]) << 12 | (63 & t[s++]) << 6 | 63 & t[s++]) < 65536 ? n += String.fromCharCode(i) : (e = 55296 | (i -= 65536) >> 10, o = 56320 | 1023 & i, n += String.fromCharCode(e, o));
                return n
            };
            n.prototype.size = function() {
                return this.buffer.length
            }, n.prototype.reallocate = function() {
                var t = new Uint8Array(2 * this.buffer.length);
                t.set(this.buffer), this.buffer = t
            }, n.prototype.shrink = function() {
                return this.buffer = this.buffer.subarray(0, this.position), this.buffer
            }, n.prototype.put = function(t) {
                this.buffer.length < this.position + 1 && this.reallocate(), this.buffer[this.position++] = t
            }, n.prototype.get = function(t) {
                return null == t && (t = this.position, this.position += 1), this.buffer.length < t + 1 ? 0 : this.buffer[t]
            }, n.prototype.putShort = function(t) {
                if (65535 < t) throw t + " is over short value";
                var n = 255 & t;
                var i = (65280 & t) >> 8;
                this.put(n), this.put(i)
            }, n.prototype.getShort = function(t) {
                if (null == t && (t = this.position, this.position += 2), this.buffer.length < t + 2) return 0;
                var n = this.buffer[t];
                var i = (this.buffer[t + 1] << 8) + n;
                return 32768 & i && (i = -(i - 1 ^ 65535)), i
            }, n.prototype.putInt = function(t) {
                if (4294967295 < t) throw t + " is over integer value";
                var n = 255 & t;
                var i = (65280 & t) >> 8;
                var r = (16711680 & t) >> 16;
                var e = (4278190080 & t) >> 24;
                this.put(n), this.put(i), this.put(r), this.put(e)
            }, n.prototype.getInt = function(t) {
                if (null == t && (t = this.position, this.position += 4), this.buffer.length < t + 4) return 0;
                var n = this.buffer[t];
                var i = this.buffer[t + 1];
                var r = this.buffer[t + 2];
                return (this.buffer[t + 3] << 24) + (r << 16) + (i << 8) + n
            }, n.prototype.readInt = function() {
                var t = this.position;
                return this.position += 4, this.getInt(t)
            }, n.prototype.putString = function(t) {
                var n = i(t);
                for (var r = 0; r < n.length; r++) this.put(n[r]);
                this.put(0)
            }, n.prototype.getString = function(t) {
                var n, i = [];
                for (null == t && (t = this.position); !(this.buffer.length < t + 1) && 0 !== (n = this.get(t++));) i.push(n);
                return this.position = t, r(i)
            }, t.exports = n
        },
        6440: t => {
            "use strict";
    
            function n(t, n, i, r, e) {
                this.class_id = t, this.class_name = n, this.is_always_invoke = i, this.is_grouping = r, this.max_length = e
            }
            t.exports = n
        },
        6440: t => {
            "use strict";
    
            function n(t, n, i, r, e) {
                this.class_id = t, this.class_name = n, this.is_always_invoke = i, this.is_grouping = r, this.max_length = e
            }
            t.exports = n
        },
        4152: t => {
            "use strict";
    
            function n(t) {
                this.str = t, this.index_mapping = [];
                for (var i = 0; i < t.length; i++) {
                    var r = t.charAt(i);
                    this.index_mapping.push(i), n.isSurrogatePair(r) && i++
                }
                this.length = this.index_mapping.length
            }
            n.prototype.slice = function(t) {
                if (this.index_mapping.length <= t) return "";
                var n = this.index_mapping[t];
                return this.str.slice(n)
            }, n.prototype.charAt = function(t) {
                if (this.str.length <= t) return "";
                var n = this.index_mapping[t];
                var i = this.index_mapping[t + 1];
                return null == i ? this.str.slice(n) : this.str.slice(n, i)
            }, n.prototype.charCodeAt = function(t) {
                if (this.index_mapping.length <= t) return NaN;
                var n = this.index_mapping[t];
                var i = this.str.charCodeAt(n);
                var r;
                return i >= 55296 && i <= 56319 && n < this.str.length && (r = this.str.charCodeAt(n + 1)) >= 56320 && r <= 57343 ? 1024 * (i - 55296) + r - 56320 + 65536 : i
            }, n.prototype.toString = function() {
                return this.str
            }, n.isSurrogatePair = function(t) {
                var n = t.charCodeAt(0);
                return n >= 55296 && n <= 56319
            }, t.exports = n
        },
        3178: t => {
            "use strict";
    
            function n(t) {
                var n;
                if (null == t) n = 1048576;
                else {
                    if ("number" != typeof t) {
                        if (t instanceof Uint8Array) return this.buffer = t, void(this.position = 0);
                        throw typeof t + " is invalid parameter type for ByteBuffer constructor"
                    }
                    n = t
                }
                this.buffer = new Uint8Array(n), this.position = 0
            }
            var i = function(t) {
                var n = new Uint8Array(4 * t.length);
                var i = 0,
                    r = 0;
                for (; i < t.length;) {
                    var e;
                    var o = t.charCodeAt(i++);
                    if (o >= 55296 && o <= 56319) {
                        var s = o;
                        var a = t.charCodeAt(i++);
                        if (!(a >= 56320 && a <= 57343)) return null;
                        e = 1024 * (s - 55296) + 65536 + (a - 56320)
                    } else e = o;
                    e < 128 ? n[r++] = e : e < 2048 ? (n[r++] = e >>> 6 | 192, n[r++] = 63 & e | 128) : e < 65536 ? (n[r++] = e >>> 12 | 224, n[r++] = e >> 6 & 63 | 128, n[r++] = 63 & e | 128) : e < 1 << 21 && (n[r++] = e >>> 18 | 240, n[r++] = e >> 12 & 63 | 128, n[r++] = e >> 6 & 63 | 128, n[r++] = 63 & e | 128)
                }
                return n.subarray(0, r)
            };
            var r = function(t) {
                var n = "";
                var i, r, e, o;
                var s = 0;
                for (; s < t.length;)(i = (r = t[s++]) < 128 ? r : r >> 5 == 6 ? (31 & r) << 6 | 63 & t[s++] : r >> 4 == 14 ? (15 & r) << 12 | (63 & t[s++]) << 6 | 63 & t[s++] : (7 & r) << 18 | (63 & t[s++]) << 12 | (63 & t[s++]) << 6 | 63 & t[s++]) < 65536 ? n += String.fromCharCode(i) : (e = 55296 | (i -= 65536) >> 10, o = 56320 | 1023 & i, n += String.fromCharCode(e, o));
                return n
            };
            n.prototype.size = function() {
                return this.buffer.length
            }, n.prototype.reallocate = function() {
                var t = new Uint8Array(2 * this.buffer.length);
                t.set(this.buffer), this.buffer = t
            }, n.prototype.shrink = function() {
                return this.buffer = this.buffer.subarray(0, this.position), this.buffer
            }, n.prototype.put = function(t) {
                this.buffer.length < this.position + 1 && this.reallocate(), this.buffer[this.position++] = t
            }, n.prototype.get = function(t) {
                return null == t && (t = this.position, this.position += 1), this.buffer.length < t + 1 ? 0 : this.buffer[t]
            }, n.prototype.putShort = function(t) {
                if (65535 < t) throw t + " is over short value";
                var n = 255 & t;
                var i = (65280 & t) >> 8;
                this.put(n), this.put(i)
            }, n.prototype.getShort = function(t) {
                if (null == t && (t = this.position, this.position += 2), this.buffer.length < t + 2) return 0;
                var n = this.buffer[t];
                var i = (this.buffer[t + 1] << 8) + n;
                return 32768 & i && (i = -(i - 1 ^ 65535)), i
            }, n.prototype.putInt = function(t) {
                if (4294967295 < t) throw t + " is over integer value";
                var n = 255 & t;
                var i = (65280 & t) >> 8;
                var r = (16711680 & t) >> 16;
                var e = (4278190080 & t) >> 24;
                this.put(n), this.put(i), this.put(r), this.put(e)
            }, n.prototype.getInt = function(t) {
                if (null == t && (t = this.position, this.position += 4), this.buffer.length < t + 4) return 0;
                var n = this.buffer[t];
                var i = this.buffer[t + 1];
                var r = this.buffer[t + 2];
                return (this.buffer[t + 3] << 24) + (r << 16) + (i << 8) + n
            }, n.prototype.readInt = function() {
                var t = this.position;
                return this.position += 4, this.getInt(t)
            }, n.prototype.putString = function(t) {
                var n = i(t);
                for (var r = 0; r < n.length; r++) this.put(n[r]);
                this.put(0)
            }, n.prototype.getString = function(t) {
                var n, i = [];
                for (null == t && (t = this.position); !(this.buffer.length < t + 1) && 0 !== (n = this.get(t++));) i.push(n);
                return this.position = t, r(i)
            }, t.exports = n
        },
        7756: (t, n, i) => {
            "use strict";
    
            function r() {
                this.dictionary = new e(10485760), this.target_map = {}, this.pos_buffer = new e(10485760)
            }
            var e = i(3178);
            r.prototype.buildDictionary = function(t) {
                var n = {};
                for (var i = 0; i < t.length; i++) {
                    var r = t[i];
                    if (!(r.length < 4)) {
                        var e = r[0];
                        var o = r[1];
                        var s = r[2];
                        var a = r[3];
                        var u = r.slice(4).join(",");
                        !isFinite(o) || !isFinite(s) || isFinite(a), n[this.put(o, s, a, e, u)] = e
                    }
                }
                return this.dictionary.shrink(), this.pos_buffer.shrink(), n
            }, r.prototype.put = function(t, n, i, r, e) {
                var o = this.dictionary.position;
                var s = this.pos_buffer.position;
                return this.dictionary.putShort(t), this.dictionary.putShort(n), this.dictionary.putShort(i), this.dictionary.putInt(s), this.pos_buffer.putString(r + "," + e), o
            }, r.prototype.addMapping = function(t, n) {
                var i = this.target_map[t];
                null == i && (i = []), i.push(n), this.target_map[t] = i
            }, r.prototype.targetMapToBuffer = function() {
                var t = new e;
                var n = Object.keys(this.target_map).length;
                for (var i in t.putInt(n), this.target_map) {
                    var r = this.target_map[i];
                    var o = r.length;
                    t.putInt(parseInt(i)), t.putInt(o);
                    for (var s = 0; s < r.length; s++) t.putInt(r[s])
                }
                return t.shrink()
            }, r.prototype.loadDictionary = function(t) {
                return this.dictionary = new e(t), this
            }, r.prototype.loadPosVector = function(t) {
                return this.pos_buffer = new e(t), this
            }, r.prototype.loadTargetMap = function(t) {
                var n = new e(t);
                for (n.position = 0, this.target_map = {}, n.readInt(); !(n.buffer.length < n.position + 1);) {
                    var i = n.readInt();
                    var r = n.readInt();
                    for (var o = 0; o < r; o++) {
                        var s = n.readInt();
                        this.addMapping(i, s)
                    }
                }
                return this
            }, r.prototype.getFeatures = function(t) {
                var n = parseInt(t);
                if (isNaN(n)) return "";
                var i = this.dictionary.getInt(n + 6);
                return this.pos_buffer.getString(i)
            }, t.exports = r
        },
        3178: t => {
            "use strict";
    
            function n(t) {
                var n;
                if (null == t) n = 1048576;
                else {
                    if ("number" != typeof t) {
                        if (t instanceof Uint8Array) return this.buffer = t, void(this.position = 0);
                        throw typeof t + " is invalid parameter type for ByteBuffer constructor"
                    }
                    n = t
                }
                this.buffer = new Uint8Array(n), this.position = 0
            }
            var i = function(t) {
                var n = new Uint8Array(4 * t.length);
                var i = 0,
                    r = 0;
                for (; i < t.length;) {
                    var e;
                    var o = t.charCodeAt(i++);
                    if (o >= 55296 && o <= 56319) {
                        var s = o;
                        var a = t.charCodeAt(i++);
                        if (!(a >= 56320 && a <= 57343)) return null;
                        e = 1024 * (s - 55296) + 65536 + (a - 56320)
                    } else e = o;
                    e < 128 ? n[r++] = e : e < 2048 ? (n[r++] = e >>> 6 | 192, n[r++] = 63 & e | 128) : e < 65536 ? (n[r++] = e >>> 12 | 224, n[r++] = e >> 6 & 63 | 128, n[r++] = 63 & e | 128) : e < 1 << 21 && (n[r++] = e >>> 18 | 240, n[r++] = e >> 12 & 63 | 128, n[r++] = e >> 6 & 63 | 128, n[r++] = 63 & e | 128)
                }
                return n.subarray(0, r)
            };
            var r = function(t) {
                var n = "";
                var i, r, e, o;
                var s = 0;
                for (; s < t.length;)(i = (r = t[s++]) < 128 ? r : r >> 5 == 6 ? (31 & r) << 6 | 63 & t[s++] : r >> 4 == 14 ? (15 & r) << 12 | (63 & t[s++]) << 6 | 63 & t[s++] : (7 & r) << 18 | (63 & t[s++]) << 12 | (63 & t[s++]) << 6 | 63 & t[s++]) < 65536 ? n += String.fromCharCode(i) : (e = 55296 | (i -= 65536) >> 10, o = 56320 | 1023 & i, n += String.fromCharCode(e, o));
                return n
            };
            n.prototype.size = function() {
                return this.buffer.length
            }, n.prototype.reallocate = function() {
                var t = new Uint8Array(2 * this.buffer.length);
                t.set(this.buffer), this.buffer = t
            }, n.prototype.shrink = function() {
                return this.buffer = this.buffer.subarray(0, this.position), this.buffer
            }, n.prototype.put = function(t) {
                this.buffer.length < this.position + 1 && this.reallocate(), this.buffer[this.position++] = t
            }, n.prototype.get = function(t) {
                return null == t && (t = this.position, this.position += 1), this.buffer.length < t + 1 ? 0 : this.buffer[t]
            }, n.prototype.putShort = function(t) {
                if (65535 < t) throw t + " is over short value";
                var n = 255 & t;
                var i = (65280 & t) >> 8;
                this.put(n), this.put(i)
            }, n.prototype.getShort = function(t) {
                if (null == t && (t = this.position, this.position += 2), this.buffer.length < t + 2) return 0;
                var n = this.buffer[t];
                var i = (this.buffer[t + 1] << 8) + n;
                return 32768 & i && (i = -(i - 1 ^ 65535)), i
            }, n.prototype.putInt = function(t) {
                if (4294967295 < t) throw t + " is over integer value";
                var n = 255 & t;
                var i = (65280 & t) >> 8;
                var r = (16711680 & t) >> 16;
                var e = (4278190080 & t) >> 24;
                this.put(n), this.put(i), this.put(r), this.put(e)
            }, n.prototype.getInt = function(t) {
                if (null == t && (t = this.position, this.position += 4), this.buffer.length < t + 4) return 0;
                var n = this.buffer[t];
                var i = this.buffer[t + 1];
                var r = this.buffer[t + 2];
                return (this.buffer[t + 3] << 24) + (r << 16) + (i << 8) + n
            }, n.prototype.readInt = function() {
                var t = this.position;
                return this.position += 4, this.getInt(t)
            }, n.prototype.putString = function(t) {
                var n = i(t);
                for (var r = 0; r < n.length; r++) this.put(n[r]);
                this.put(0)
            }, n.prototype.getString = function(t) {
                var n, i = [];
                for (null == t && (t = this.position); !(this.buffer.length < t + 1) && 0 !== (n = this.get(t++));) i.push(n);
                return this.position = t, r(i)
            }, t.exports = n
        },
        5558: (t, n, i) => {
            "use strict";
    
            function r() {
                this.lines = 0, this.connection_cost = null
            }
            var e = i(5929);
            r.prototype.putLine = function(t) {
                if (0 === this.lines) {
                    var n = t.split(" ");
                    var i = n[0];
                    var r = n[1];
                    if (i < 0 || r < 0) throw "Parse error of matrix.def";
                    return this.connection_cost = new e(i, r), this.lines++, this
                }
                var o = t.split(" ");
                if (3 !== o.length) return this;
                var s = parseInt(o[0]);
                var a = parseInt(o[1]);
                var u = parseInt(o[2]);
                if (s < 0 || a < 0 || !isFinite(s) || !isFinite(a) || this.connection_cost.forward_dimension <= s || this.connection_cost.backward_dimension <= a) throw "Parse error of matrix.def";
                return this.connection_cost.put(s, a, u), this.lines++, this
            }, r.prototype.build = function() {
                return this.connection_cost
            }, t.exports = r
        },
        5929: t => {
            "use strict";
    
            function n(t, n) {
                this.forward_dimension = t, this.backward_dimension = n, this.buffer = new Int16Array(t * n + 2), this.buffer[0] = t, this.buffer[1] = n
            }
            n.prototype.put = function(t, n, i) {
                var r = t * this.backward_dimension + n + 2;
                if (this.buffer.length < r + 1) throw "ConnectionCosts buffer overflow";
                this.buffer[r] = i
            }, n.prototype.get = function(t, n) {
                var i = t * this.backward_dimension + n + 2;
                if (this.buffer.length < i + 1) throw "ConnectionCosts buffer overflow";
                return this.buffer[i]
            }, n.prototype.loadConnectionCosts = function(t) {
                this.forward_dimension = t[0], this.backward_dimension = t[1], this.buffer = t
            }, t.exports = n
        },
        8150: (t, n, i) => {
            "use strict";
    
            function r() {
                this.char_def = new e, this.char_def.invoke_definition_map = new o, this.character_category_definition = [], this.category_mapping = []
            }
            var e = i(7982);
            var o = i(9738);
            var s = /^(\w+)\s+(\d)\s+(\d)\s+(\d)/;
            var a = /^(0x[0-9A-F]{4})(?:\s+([^#\s]+))(?:\s+([^#\s]+))*/;
            var u = /^(0x[0-9A-F]{4})\.\.(0x[0-9A-F]{4})(?:\s+([^#\s]+))(?:\s+([^#\s]+))*/;
            r.prototype.putLine = function(t) {
                var n = s.exec(t);
                if (null == n) {
                    var i = a.exec(t);
                    if (null != i) {
                        var r = e.parseCategoryMapping(i);
                        this.category_mapping.push(r)
                    }
                    var o = u.exec(t);
                    if (null != o) {
                        var c = e.parseRangeCategoryMapping(o);
                        this.category_mapping.push(c)
                    }
                } else {
                    var h = this.character_category_definition.length;
                    var f = e.parseCharCategory(h, n);
                    if (null == f) return;
                    this.character_category_definition.push(f)
                }
            }, r.prototype.build = function() {
                return this.char_def.invoke_definition_map.init(this.character_category_definition), this.char_def.initCategoryMappings(this.category_mapping), this.char_def
            }, t.exports = r
        },
        7982: (t, n, i) => {
            "use strict";
    
            function r() {
                this.character_category_map = new Uint8Array(65536), this.compatible_category_map = new Uint32Array(65536), this.invoke_definition_map = null
            }
            var e = i(9738);
            var o = i(6440);
            var s = i(4152);
            var a = "DEFAULT";
            r.load = function(t, n, i) {
                var o = new r;
                return o.character_category_map = t, o.compatible_category_map = n, o.invoke_definition_map = e.load(i), o
            }, r.parseCharCategory = function(t, n) {
                var i = n[1];
                var r = parseInt(n[2]);
                var e = parseInt(n[3]);
                var s = parseInt(n[4]);
                return !isFinite(r) || 0 !== r && 1 !== r || !isFinite(e) || 0 !== e && 1 !== e || !isFinite(s) || s < 0 ? null : new o(t, i, 1 === r, 1 === e, s)
            }, r.parseCategoryMapping = function(t) {
                var n = parseInt(t[1]);
                var i = t[2];
                var r = 3 < t.length ? t.slice(3) : [];
                return isFinite(n), {
                    start: n,
                    default: i,
                    compatible: r
                }
            }, r.parseRangeCategoryMapping = function(t) {
                var n = parseInt(t[1]);
                var i = parseInt(t[2]);
                var r = t[3];
                var e = 4 < t.length ? t.slice(4) : [];
                return isFinite(n), isFinite(i), {
                    start: n,
                    end: i,
                    default: r,
                    compatible: e
                }
            }, r.prototype.initCategoryMappings = function(t) {
                var n;
                if (null != t)
                    for (var i = 0; i < t.length; i++) {
                        var r = t[i];
                        var e = r.end || r.start;
                        for (n = r.start; n <= e; n++) {
                            this.character_category_map[n] = this.invoke_definition_map.lookup(r.default);
                            for (var o = 0; o < r.compatible.length; o++) {
                                var s = this.compatible_category_map[n];
                                var u = r.compatible[o];
                                if (null != u) {
                                    var c = this.invoke_definition_map.lookup(u);
                                    null != c && (s |= 1 << c, this.compatible_category_map[n] = s)
                                }
                            }
                        }
                    }
                var h = this.invoke_definition_map.lookup(a);
                if (null != h)
                    for (n = 0; n < this.character_category_map.length; n++) 0 === this.character_category_map[n] && (this.character_category_map[n] = 1 << h)
            }, r.prototype.lookupCompatibleCategory = function(t) {
                var n = [];
                var i = t.charCodeAt(0);
                var r;
                if (i < this.compatible_category_map.length && (r = this.compatible_category_map[i]), null == r || 0 === r) return n;
                for (var e = 0; e < 32; e++)
                    if (r << 31 - e >>> 31 == 1) {
                        var o = this.invoke_definition_map.getCharacterClass(e);
                        if (null == o) continue;
                        n.push(o)
                    } return n
            }, r.prototype.lookup = function(t) {
                var n;
                var i = t.charCodeAt(0);
                return s.isSurrogatePair(t) ? n = this.invoke_definition_map.lookup(a) : i < this.character_category_map.length && (n = this.character_category_map[i]), null == n && (n = this.invoke_definition_map.lookup(a)), this.invoke_definition_map.getCharacterClass(n)
            }, t.exports = r
        },
        9738: (t, n, i) => {
            "use strict";
    
            function r() {
                this.map = [], this.lookup_table = {}
            }
            var e = i(3178);
            var o = i(6440);
            r.load = function(t) {
                var n = new r;
                var i = [];
                var s = new e(t);
                for (; s.position + 1 < s.size();) {
                    var a = i.length;
                    var u = s.get();
                    var c = s.get();
                    var h = s.getInt();
                    var f = s.getString();
                    i.push(new o(a, f, u, c, h))
                }
                return n.init(i), n
            }, r.prototype.init = function(t) {
                if (null != t)
                    for (var n = 0; n < t.length; n++) {
                        var i = t[n];
                        this.map[n] = i, this.lookup_table[i.class_name] = n
                    }
            }, r.prototype.getCharacterClass = function(t) {
                return this.map[t]
            }, r.prototype.lookup = function(t) {
                var n = this.lookup_table[t];
                return null == n ? null : n
            }, r.prototype.toBuffer = function() {
                var t = new e;
                for (var n = 0; n < this.map.length; n++) {
                    var i = this.map[n];
                    t.put(i.is_always_invoke), t.put(i.is_grouping), t.putInt(i.max_length), t.putString(i.class_name)
                }
                return t.shrink(), t.buffer
            }, t.exports = r
        },
        3178: t => {
            "use strict";
    
            function n(t) {
                var n;
                if (null == t) n = 1048576;
                else {
                    if ("number" != typeof t) {
                        if (t instanceof Uint8Array) return this.buffer = t, void(this.position = 0);
                        throw typeof t + " is invalid parameter type for ByteBuffer constructor"
                    }
                    n = t
                }
                this.buffer = new Uint8Array(n), this.position = 0
            }
            var i = function(t) {
                var n = new Uint8Array(4 * t.length);
                var i = 0,
                    r = 0;
                for (; i < t.length;) {
                    var e;
                    var o = t.charCodeAt(i++);
                    if (o >= 55296 && o <= 56319) {
                        var s = o;
                        var a = t.charCodeAt(i++);
                        if (!(a >= 56320 && a <= 57343)) return null;
                        e = 1024 * (s - 55296) + 65536 + (a - 56320)
                    } else e = o;
                    e < 128 ? n[r++] = e : e < 2048 ? (n[r++] = e >>> 6 | 192, n[r++] = 63 & e | 128) : e < 65536 ? (n[r++] = e >>> 12 | 224, n[r++] = e >> 6 & 63 | 128, n[r++] = 63 & e | 128) : e < 1 << 21 && (n[r++] = e >>> 18 | 240, n[r++] = e >> 12 & 63 | 128, n[r++] = e >> 6 & 63 | 128, n[r++] = 63 & e | 128)
                }
                return n.subarray(0, r)
            };
            var r = function(t) {
                var n = "";
                var i, r, e, o;
                var s = 0;
                for (; s < t.length;)(i = (r = t[s++]) < 128 ? r : r >> 5 == 6 ? (31 & r) << 6 | 63 & t[s++] : r >> 4 == 14 ? (15 & r) << 12 | (63 & t[s++]) << 6 | 63 & t[s++] : (7 & r) << 18 | (63 & t[s++]) << 12 | (63 & t[s++]) << 6 | 63 & t[s++]) < 65536 ? n += String.fromCharCode(i) : (e = 55296 | (i -= 65536) >> 10, o = 56320 | 1023 & i, n += String.fromCharCode(e, o));
                return n
            };
            n.prototype.size = function() {
                return this.buffer.length
            }, n.prototype.reallocate = function() {
                var t = new Uint8Array(2 * this.buffer.length);
                t.set(this.buffer), this.buffer = t
            }, n.prototype.shrink = function() {
                return this.buffer = this.buffer.subarray(0, this.position), this.buffer
            }, n.prototype.put = function(t) {
                this.buffer.length < this.position + 1 && this.reallocate(), this.buffer[this.position++] = t
            }, n.prototype.get = function(t) {
                return null == t && (t = this.position, this.position += 1), this.buffer.length < t + 1 ? 0 : this.buffer[t]
            }, n.prototype.putShort = function(t) {
                if (65535 < t) throw t + " is over short value";
                var n = 255 & t;
                var i = (65280 & t) >> 8;
                this.put(n), this.put(i)
            }, n.prototype.getShort = function(t) {
                if (null == t && (t = this.position, this.position += 2), this.buffer.length < t + 2) return 0;
                var n = this.buffer[t];
                var i = (this.buffer[t + 1] << 8) + n;
                return 32768 & i && (i = -(i - 1 ^ 65535)), i
            }, n.prototype.putInt = function(t) {
                if (4294967295 < t) throw t + " is over integer value";
                var n = 255 & t;
                var i = (65280 & t) >> 8;
                var r = (16711680 & t) >> 16;
                var e = (4278190080 & t) >> 24;
                this.put(n), this.put(i), this.put(r), this.put(e)
            }, n.prototype.getInt = function(t) {
                if (null == t && (t = this.position, this.position += 4), this.buffer.length < t + 4) return 0;
                var n = this.buffer[t];
                var i = this.buffer[t + 1];
                var r = this.buffer[t + 2];
                return (this.buffer[t + 3] << 24) + (r << 16) + (i << 8) + n
            }, n.prototype.readInt = function() {
                var t = this.position;
                return this.position += 4, this.getInt(t)
            }, n.prototype.putString = function(t) {
                var n = i(t);
                for (var r = 0; r < n.length; r++) this.put(n[r]);
                this.put(0)
            }, n.prototype.getString = function(t) {
                var n, i = [];
                for (null == t && (t = this.position); !(this.buffer.length < t + 1) && 0 !== (n = this.get(t++));) i.push(n);
                return this.position = t, r(i)
            }, t.exports = n
        },
        6440: t => {
            "use strict";
    
            function n(t, n, i, r, e) {
                this.class_id = t, this.class_name = n, this.is_always_invoke = i, this.is_grouping = r, this.max_length = e
            }
            t.exports = n
        },
        6440: t => {
            "use strict";
    
            function n(t, n, i, r, e) {
                this.class_id = t, this.class_name = n, this.is_always_invoke = i, this.is_grouping = r, this.max_length = e
            }
            t.exports = n
        },
        4152: t => {
            "use strict";
    
            function n(t) {
                this.str = t, this.index_mapping = [];
                for (var i = 0; i < t.length; i++) {
                    var r = t.charAt(i);
                    this.index_mapping.push(i), n.isSurrogatePair(r) && i++
                }
                this.length = this.index_mapping.length
            }
            n.prototype.slice = function(t) {
                if (this.index_mapping.length <= t) return "";
                var n = this.index_mapping[t];
                return this.str.slice(n)
            }, n.prototype.charAt = function(t) {
                if (this.str.length <= t) return "";
                var n = this.index_mapping[t];
                var i = this.index_mapping[t + 1];
                return null == i ? this.str.slice(n) : this.str.slice(n, i)
            }, n.prototype.charCodeAt = function(t) {
                if (this.index_mapping.length <= t) return NaN;
                var n = this.index_mapping[t];
                var i = this.str.charCodeAt(n);
                var r;
                return i >= 55296 && i <= 56319 && n < this.str.length && (r = this.str.charCodeAt(n + 1)) >= 56320 && r <= 57343 ? 1024 * (i - 55296) + r - 56320 + 65536 : i
            }, n.prototype.toString = function() {
                return this.str
            }, n.isSurrogatePair = function(t) {
                var n = t.charCodeAt(0);
                return n >= 55296 && n <= 56319
            }, t.exports = n
        },
        9738: (t, n, i) => {
            "use strict";
    
            function r() {
                this.map = [], this.lookup_table = {}
            }
            var e = i(3178);
            var o = i(6440);
            r.load = function(t) {
                var n = new r;
                var i = [];
                var s = new e(t);
                for (; s.position + 1 < s.size();) {
                    var a = i.length;
                    var u = s.get();
                    var c = s.get();
                    var h = s.getInt();
                    var f = s.getString();
                    i.push(new o(a, f, u, c, h))
                }
                return n.init(i), n
            }, r.prototype.init = function(t) {
                if (null != t)
                    for (var n = 0; n < t.length; n++) {
                        var i = t[n];
                        this.map[n] = i, this.lookup_table[i.class_name] = n
                    }
            }, r.prototype.getCharacterClass = function(t) {
                return this.map[t]
            }, r.prototype.lookup = function(t) {
                var n = this.lookup_table[t];
                return null == n ? null : n
            }, r.prototype.toBuffer = function() {
                var t = new e;
                for (var n = 0; n < this.map.length; n++) {
                    var i = this.map[n];
                    t.put(i.is_always_invoke), t.put(i.is_grouping), t.putInt(i.max_length), t.putString(i.class_name)
                }
                return t.shrink(), t.buffer
            }, t.exports = r
        },
        3178: t => {
            "use strict";
    
            function n(t) {
                var n;
                if (null == t) n = 1048576;
                else {
                    if ("number" != typeof t) {
                        if (t instanceof Uint8Array) return this.buffer = t, void(this.position = 0);
                        throw typeof t + " is invalid parameter type for ByteBuffer constructor"
                    }
                    n = t
                }
                this.buffer = new Uint8Array(n), this.position = 0
            }
            var i = function(t) {
                var n = new Uint8Array(4 * t.length);
                var i = 0,
                    r = 0;
                for (; i < t.length;) {
                    var e;
                    var o = t.charCodeAt(i++);
                    if (o >= 55296 && o <= 56319) {
                        var s = o;
                        var a = t.charCodeAt(i++);
                        if (!(a >= 56320 && a <= 57343)) return null;
                        e = 1024 * (s - 55296) + 65536 + (a - 56320)
                    } else e = o;
                    e < 128 ? n[r++] = e : e < 2048 ? (n[r++] = e >>> 6 | 192, n[r++] = 63 & e | 128) : e < 65536 ? (n[r++] = e >>> 12 | 224, n[r++] = e >> 6 & 63 | 128, n[r++] = 63 & e | 128) : e < 1 << 21 && (n[r++] = e >>> 18 | 240, n[r++] = e >> 12 & 63 | 128, n[r++] = e >> 6 & 63 | 128, n[r++] = 63 & e | 128)
                }
                return n.subarray(0, r)
            };
            var r = function(t) {
                var n = "";
                var i, r, e, o;
                var s = 0;
                for (; s < t.length;)(i = (r = t[s++]) < 128 ? r : r >> 5 == 6 ? (31 & r) << 6 | 63 & t[s++] : r >> 4 == 14 ? (15 & r) << 12 | (63 & t[s++]) << 6 | 63 & t[s++] : (7 & r) << 18 | (63 & t[s++]) << 12 | (63 & t[s++]) << 6 | 63 & t[s++]) < 65536 ? n += String.fromCharCode(i) : (e = 55296 | (i -= 65536) >> 10, o = 56320 | 1023 & i, n += String.fromCharCode(e, o));
                return n
            };
            n.prototype.size = function() {
                return this.buffer.length
            }, n.prototype.reallocate = function() {
                var t = new Uint8Array(2 * this.buffer.length);
                t.set(this.buffer), this.buffer = t
            }, n.prototype.shrink = function() {
                return this.buffer = this.buffer.subarray(0, this.position), this.buffer
            }, n.prototype.put = function(t) {
                this.buffer.length < this.position + 1 && this.reallocate(), this.buffer[this.position++] = t
            }, n.prototype.get = function(t) {
                return null == t && (t = this.position, this.position += 1), this.buffer.length < t + 1 ? 0 : this.buffer[t]
            }, n.prototype.putShort = function(t) {
                if (65535 < t) throw t + " is over short value";
                var n = 255 & t;
                var i = (65280 & t) >> 8;
                this.put(n), this.put(i)
            }, n.prototype.getShort = function(t) {
                if (null == t && (t = this.position, this.position += 2), this.buffer.length < t + 2) return 0;
                var n = this.buffer[t];
                var i = (this.buffer[t + 1] << 8) + n;
                return 32768 & i && (i = -(i - 1 ^ 65535)), i
            }, n.prototype.putInt = function(t) {
                if (4294967295 < t) throw t + " is over integer value";
                var n = 255 & t;
                var i = (65280 & t) >> 8;
                var r = (16711680 & t) >> 16;
                var e = (4278190080 & t) >> 24;
                this.put(n), this.put(i), this.put(r), this.put(e)
            }, n.prototype.getInt = function(t) {
                if (null == t && (t = this.position, this.position += 4), this.buffer.length < t + 4) return 0;
                var n = this.buffer[t];
                var i = this.buffer[t + 1];
                var r = this.buffer[t + 2];
                return (this.buffer[t + 3] << 24) + (r << 16) + (i << 8) + n
            }, n.prototype.readInt = function() {
                var t = this.position;
                return this.position += 4, this.getInt(t)
            }, n.prototype.putString = function(t) {
                var n = i(t);
                for (var r = 0; r < n.length; r++) this.put(n[r]);
                this.put(0)
            }, n.prototype.getString = function(t) {
                var n, i = [];
                for (null == t && (t = this.position); !(this.buffer.length < t + 1) && 0 !== (n = this.get(t++));) i.push(n);
                return this.position = t, r(i)
            }, t.exports = n
        },
        6440: t => {
            "use strict";
    
            function n(t, n, i, r, e) {
                this.class_id = t, this.class_name = n, this.is_always_invoke = i, this.is_grouping = r, this.max_length = e
            }
            t.exports = n
        },
        8068: (t, n, i) => {
            "use strict";
    
            function r() {
                this.dictionary = new s(10485760), this.target_map = {}, this.pos_buffer = new s(10485760), this.character_definition = null
            }
            var e = i(7756);
            var o = i(7982);
            var s = i(3178);
            r.prototype = Object.create(e.prototype), r.prototype.characterDefinition = function(t) {
                return this.character_definition = t, this
            }, r.prototype.lookup = function(t) {
                return this.character_definition.lookup(t)
            }, r.prototype.lookupCompatibleCategory = function(t) {
                return this.character_definition.lookupCompatibleCategory(t)
            }, r.prototype.loadUnknownDictionaries = function(t, n, i, r, e, s) {
                this.loadDictionary(t), this.loadPosVector(n), this.loadTargetMap(i), this.character_definition = o.load(r, e, s)
            }, t.exports = r
        },
        7756: (t, n, i) => {
            "use strict";
    
            function r() {
                this.dictionary = new e(10485760), this.target_map = {}, this.pos_buffer = new e(10485760)
            }
            var e = i(3178);
            r.prototype.buildDictionary = function(t) {
                var n = {};
                for (var i = 0; i < t.length; i++) {
                    var r = t[i];
                    if (!(r.length < 4)) {
                        var e = r[0];
                        var o = r[1];
                        var s = r[2];
                        var a = r[3];
                        var u = r.slice(4).join(",");
                        !isFinite(o) || !isFinite(s) || isFinite(a), n[this.put(o, s, a, e, u)] = e
                    }
                }
                return this.dictionary.shrink(), this.pos_buffer.shrink(), n
            }, r.prototype.put = function(t, n, i, r, e) {
                var o = this.dictionary.position;
                var s = this.pos_buffer.position;
                return this.dictionary.putShort(t), this.dictionary.putShort(n), this.dictionary.putShort(i), this.dictionary.putInt(s), this.pos_buffer.putString(r + "," + e), o
            }, r.prototype.addMapping = function(t, n) {
                var i = this.target_map[t];
                null == i && (i = []), i.push(n), this.target_map[t] = i
            }, r.prototype.targetMapToBuffer = function() {
                var t = new e;
                var n = Object.keys(this.target_map).length;
                for (var i in t.putInt(n), this.target_map) {
                    var r = this.target_map[i];
                    var o = r.length;
                    t.putInt(parseInt(i)), t.putInt(o);
                    for (var s = 0; s < r.length; s++) t.putInt(r[s])
                }
                return t.shrink()
            }, r.prototype.loadDictionary = function(t) {
                return this.dictionary = new e(t), this
            }, r.prototype.loadPosVector = function(t) {
                return this.pos_buffer = new e(t), this
            }, r.prototype.loadTargetMap = function(t) {
                var n = new e(t);
                for (n.position = 0, this.target_map = {}, n.readInt(); !(n.buffer.length < n.position + 1);) {
                    var i = n.readInt();
                    var r = n.readInt();
                    for (var o = 0; o < r; o++) {
                        var s = n.readInt();
                        this.addMapping(i, s)
                    }
                }
                return this
            }, r.prototype.getFeatures = function(t) {
                var n = parseInt(t);
                if (isNaN(n)) return "";
                var i = this.dictionary.getInt(n + 6);
                return this.pos_buffer.getString(i)
            }, t.exports = r
        },
        3178: t => {
            "use strict";
    
            function n(t) {
                var n;
                if (null == t) n = 1048576;
                else {
                    if ("number" != typeof t) {
                        if (t instanceof Uint8Array) return this.buffer = t, void(this.position = 0);
                        throw typeof t + " is invalid parameter type for ByteBuffer constructor"
                    }
                    n = t
                }
                this.buffer = new Uint8Array(n), this.position = 0
            }
            var i = function(t) {
                var n = new Uint8Array(4 * t.length);
                var i = 0,
                    r = 0;
                for (; i < t.length;) {
                    var e;
                    var o = t.charCodeAt(i++);
                    if (o >= 55296 && o <= 56319) {
                        var s = o;
                        var a = t.charCodeAt(i++);
                        if (!(a >= 56320 && a <= 57343)) return null;
                        e = 1024 * (s - 55296) + 65536 + (a - 56320)
                    } else e = o;
                    e < 128 ? n[r++] = e : e < 2048 ? (n[r++] = e >>> 6 | 192, n[r++] = 63 & e | 128) : e < 65536 ? (n[r++] = e >>> 12 | 224, n[r++] = e >> 6 & 63 | 128, n[r++] = 63 & e | 128) : e < 1 << 21 && (n[r++] = e >>> 18 | 240, n[r++] = e >> 12 & 63 | 128, n[r++] = e >> 6 & 63 | 128, n[r++] = 63 & e | 128)
                }
                return n.subarray(0, r)
            };
            var r = function(t) {
                var n = "";
                var i, r, e, o;
                var s = 0;
                for (; s < t.length;)(i = (r = t[s++]) < 128 ? r : r >> 5 == 6 ? (31 & r) << 6 | 63 & t[s++] : r >> 4 == 14 ? (15 & r) << 12 | (63 & t[s++]) << 6 | 63 & t[s++] : (7 & r) << 18 | (63 & t[s++]) << 12 | (63 & t[s++]) << 6 | 63 & t[s++]) < 65536 ? n += String.fromCharCode(i) : (e = 55296 | (i -= 65536) >> 10, o = 56320 | 1023 & i, n += String.fromCharCode(e, o));
                return n
            };
            n.prototype.size = function() {
                return this.buffer.length
            }, n.prototype.reallocate = function() {
                var t = new Uint8Array(2 * this.buffer.length);
                t.set(this.buffer), this.buffer = t
            }, n.prototype.shrink = function() {
                return this.buffer = this.buffer.subarray(0, this.position), this.buffer
            }, n.prototype.put = function(t) {
                this.buffer.length < this.position + 1 && this.reallocate(), this.buffer[this.position++] = t
            }, n.prototype.get = function(t) {
                return null == t && (t = this.position, this.position += 1), this.buffer.length < t + 1 ? 0 : this.buffer[t]
            }, n.prototype.putShort = function(t) {
                if (65535 < t) throw t + " is over short value";
                var n = 255 & t;
                var i = (65280 & t) >> 8;
                this.put(n), this.put(i)
            }, n.prototype.getShort = function(t) {
                if (null == t && (t = this.position, this.position += 2), this.buffer.length < t + 2) return 0;
                var n = this.buffer[t];
                var i = (this.buffer[t + 1] << 8) + n;
                return 32768 & i && (i = -(i - 1 ^ 65535)), i
            }, n.prototype.putInt = function(t) {
                if (4294967295 < t) throw t + " is over integer value";
                var n = 255 & t;
                var i = (65280 & t) >> 8;
                var r = (16711680 & t) >> 16;
                var e = (4278190080 & t) >> 24;
                this.put(n), this.put(i), this.put(r), this.put(e)
            }, n.prototype.getInt = function(t) {
                if (null == t && (t = this.position, this.position += 4), this.buffer.length < t + 4) return 0;
                var n = this.buffer[t];
                var i = this.buffer[t + 1];
                var r = this.buffer[t + 2];
                return (this.buffer[t + 3] << 24) + (r << 16) + (i << 8) + n
            }, n.prototype.readInt = function() {
                var t = this.position;
                return this.position += 4, this.getInt(t)
            }, n.prototype.putString = function(t) {
                var n = i(t);
                for (var r = 0; r < n.length; r++) this.put(n[r]);
                this.put(0)
            }, n.prototype.getString = function(t) {
                var n, i = [];
                for (null == t && (t = this.position); !(this.buffer.length < t + 1) && 0 !== (n = this.get(t++));) i.push(n);
                return this.position = t, r(i)
            }, t.exports = n
        },
        7982: (t, n, i) => {
            "use strict";
    
            function r() {
                this.character_category_map = new Uint8Array(65536), this.compatible_category_map = new Uint32Array(65536), this.invoke_definition_map = null
            }
            var e = i(9738);
            var o = i(6440);
            var s = i(4152);
            var a = "DEFAULT";
            r.load = function(t, n, i) {
                var o = new r;
                return o.character_category_map = t, o.compatible_category_map = n, o.invoke_definition_map = e.load(i), o
            }, r.parseCharCategory = function(t, n) {
                var i = n[1];
                var r = parseInt(n[2]);
                var e = parseInt(n[3]);
                var s = parseInt(n[4]);
                return !isFinite(r) || 0 !== r && 1 !== r || !isFinite(e) || 0 !== e && 1 !== e || !isFinite(s) || s < 0 ? null : new o(t, i, 1 === r, 1 === e, s)
            }, r.parseCategoryMapping = function(t) {
                var n = parseInt(t[1]);
                var i = t[2];
                var r = 3 < t.length ? t.slice(3) : [];
                return isFinite(n), {
                    start: n,
                    default: i,
                    compatible: r
                }
            }, r.parseRangeCategoryMapping = function(t) {
                var n = parseInt(t[1]);
                var i = parseInt(t[2]);
                var r = t[3];
                var e = 4 < t.length ? t.slice(4) : [];
                return isFinite(n), isFinite(i), {
                    start: n,
                    end: i,
                    default: r,
                    compatible: e
                }
            }, r.prototype.initCategoryMappings = function(t) {
                var n;
                if (null != t)
                    for (var i = 0; i < t.length; i++) {
                        var r = t[i];
                        var e = r.end || r.start;
                        for (n = r.start; n <= e; n++) {
                            this.character_category_map[n] = this.invoke_definition_map.lookup(r.default);
                            for (var o = 0; o < r.compatible.length; o++) {
                                var s = this.compatible_category_map[n];
                                var u = r.compatible[o];
                                if (null != u) {
                                    var c = this.invoke_definition_map.lookup(u);
                                    null != c && (s |= 1 << c, this.compatible_category_map[n] = s)
                                }
                            }
                        }
                    }
                var h = this.invoke_definition_map.lookup(a);
                if (null != h)
                    for (n = 0; n < this.character_category_map.length; n++) 0 === this.character_category_map[n] && (this.character_category_map[n] = 1 << h)
            }, r.prototype.lookupCompatibleCategory = function(t) {
                var n = [];
                var i = t.charCodeAt(0);
                var r;
                if (i < this.compatible_category_map.length && (r = this.compatible_category_map[i]), null == r || 0 === r) return n;
                for (var e = 0; e < 32; e++)
                    if (r << 31 - e >>> 31 == 1) {
                        var o = this.invoke_definition_map.getCharacterClass(e);
                        if (null == o) continue;
                        n.push(o)
                    } return n
            }, r.prototype.lookup = function(t) {
                var n;
                var i = t.charCodeAt(0);
                return s.isSurrogatePair(t) ? n = this.invoke_definition_map.lookup(a) : i < this.character_category_map.length && (n = this.character_category_map[i]), null == n && (n = this.invoke_definition_map.lookup(a)), this.invoke_definition_map.getCharacterClass(n)
            }, t.exports = r
        },
        9738: (t, n, i) => {
            "use strict";
    
            function r() {
                this.map = [], this.lookup_table = {}
            }
            var e = i(3178);
            var o = i(6440);
            r.load = function(t) {
                var n = new r;
                var i = [];
                var s = new e(t);
                for (; s.position + 1 < s.size();) {
                    var a = i.length;
                    var u = s.get();
                    var c = s.get();
                    var h = s.getInt();
                    var f = s.getString();
                    i.push(new o(a, f, u, c, h))
                }
                return n.init(i), n
            }, r.prototype.init = function(t) {
                if (null != t)
                    for (var n = 0; n < t.length; n++) {
                        var i = t[n];
                        this.map[n] = i, this.lookup_table[i.class_name] = n
                    }
            }, r.prototype.getCharacterClass = function(t) {
                return this.map[t]
            }, r.prototype.lookup = function(t) {
                var n = this.lookup_table[t];
                return null == n ? null : n
            }, r.prototype.toBuffer = function() {
                var t = new e;
                for (var n = 0; n < this.map.length; n++) {
                    var i = this.map[n];
                    t.put(i.is_always_invoke), t.put(i.is_grouping), t.putInt(i.max_length), t.putString(i.class_name)
                }
                return t.shrink(), t.buffer
            }, t.exports = r
        },
        3178: t => {
            "use strict";
    
            function n(t) {
                var n;
                if (null == t) n = 1048576;
                else {
                    if ("number" != typeof t) {
                        if (t instanceof Uint8Array) return this.buffer = t, void(this.position = 0);
                        throw typeof t + " is invalid parameter type for ByteBuffer constructor"
                    }
                    n = t
                }
                this.buffer = new Uint8Array(n), this.position = 0
            }
            var i = function(t) {
                var n = new Uint8Array(4 * t.length);
                var i = 0,
                    r = 0;
                for (; i < t.length;) {
                    var e;
                    var o = t.charCodeAt(i++);
                    if (o >= 55296 && o <= 56319) {
                        var s = o;
                        var a = t.charCodeAt(i++);
                        if (!(a >= 56320 && a <= 57343)) return null;
                        e = 1024 * (s - 55296) + 65536 + (a - 56320)
                    } else e = o;
                    e < 128 ? n[r++] = e : e < 2048 ? (n[r++] = e >>> 6 | 192, n[r++] = 63 & e | 128) : e < 65536 ? (n[r++] = e >>> 12 | 224, n[r++] = e >> 6 & 63 | 128, n[r++] = 63 & e | 128) : e < 1 << 21 && (n[r++] = e >>> 18 | 240, n[r++] = e >> 12 & 63 | 128, n[r++] = e >> 6 & 63 | 128, n[r++] = 63 & e | 128)
                }
                return n.subarray(0, r)
            };
            var r = function(t) {
                var n = "";
                var i, r, e, o;
                var s = 0;
                for (; s < t.length;)(i = (r = t[s++]) < 128 ? r : r >> 5 == 6 ? (31 & r) << 6 | 63 & t[s++] : r >> 4 == 14 ? (15 & r) << 12 | (63 & t[s++]) << 6 | 63 & t[s++] : (7 & r) << 18 | (63 & t[s++]) << 12 | (63 & t[s++]) << 6 | 63 & t[s++]) < 65536 ? n += String.fromCharCode(i) : (e = 55296 | (i -= 65536) >> 10, o = 56320 | 1023 & i, n += String.fromCharCode(e, o));
                return n
            };
            n.prototype.size = function() {
                return this.buffer.length
            }, n.prototype.reallocate = function() {
                var t = new Uint8Array(2 * this.buffer.length);
                t.set(this.buffer), this.buffer = t
            }, n.prototype.shrink = function() {
                return this.buffer = this.buffer.subarray(0, this.position), this.buffer
            }, n.prototype.put = function(t) {
                this.buffer.length < this.position + 1 && this.reallocate(), this.buffer[this.position++] = t
            }, n.prototype.get = function(t) {
                return null == t && (t = this.position, this.position += 1), this.buffer.length < t + 1 ? 0 : this.buffer[t]
            }, n.prototype.putShort = function(t) {
                if (65535 < t) throw t + " is over short value";
                var n = 255 & t;
                var i = (65280 & t) >> 8;
                this.put(n), this.put(i)
            }, n.prototype.getShort = function(t) {
                if (null == t && (t = this.position, this.position += 2), this.buffer.length < t + 2) return 0;
                var n = this.buffer[t];
                var i = (this.buffer[t + 1] << 8) + n;
                return 32768 & i && (i = -(i - 1 ^ 65535)), i
            }, n.prototype.putInt = function(t) {
                if (4294967295 < t) throw t + " is over integer value";
                var n = 255 & t;
                var i = (65280 & t) >> 8;
                var r = (16711680 & t) >> 16;
                var e = (4278190080 & t) >> 24;
                this.put(n), this.put(i), this.put(r), this.put(e)
            }, n.prototype.getInt = function(t) {
                if (null == t && (t = this.position, this.position += 4), this.buffer.length < t + 4) return 0;
                var n = this.buffer[t];
                var i = this.buffer[t + 1];
                var r = this.buffer[t + 2];
                return (this.buffer[t + 3] << 24) + (r << 16) + (i << 8) + n
            }, n.prototype.readInt = function() {
                var t = this.position;
                return this.position += 4, this.getInt(t)
            }, n.prototype.putString = function(t) {
                var n = i(t);
                for (var r = 0; r < n.length; r++) this.put(n[r]);
                this.put(0)
            }, n.prototype.getString = function(t) {
                var n, i = [];
                for (null == t && (t = this.position); !(this.buffer.length < t + 1) && 0 !== (n = this.get(t++));) i.push(n);
                return this.position = t, r(i)
            }, t.exports = n
        },
        6440: t => {
            "use strict";
    
            function n(t, n, i, r, e) {
                this.class_id = t, this.class_name = n, this.is_always_invoke = i, this.is_grouping = r, this.max_length = e
            }
            t.exports = n
        },
        6440: t => {
            "use strict";
    
            function n(t, n, i, r, e) {
                this.class_id = t, this.class_name = n, this.is_always_invoke = i, this.is_grouping = r, this.max_length = e
            }
            t.exports = n
        },
        4152: t => {
            "use strict";
    
            function n(t) {
                this.str = t, this.index_mapping = [];
                for (var i = 0; i < t.length; i++) {
                    var r = t.charAt(i);
                    this.index_mapping.push(i), n.isSurrogatePair(r) && i++
                }
                this.length = this.index_mapping.length
            }
            n.prototype.slice = function(t) {
                if (this.index_mapping.length <= t) return "";
                var n = this.index_mapping[t];
                return this.str.slice(n)
            }, n.prototype.charAt = function(t) {
                if (this.str.length <= t) return "";
                var n = this.index_mapping[t];
                var i = this.index_mapping[t + 1];
                return null == i ? this.str.slice(n) : this.str.slice(n, i)
            }, n.prototype.charCodeAt = function(t) {
                if (this.index_mapping.length <= t) return NaN;
                var n = this.index_mapping[t];
                var i = this.str.charCodeAt(n);
                var r;
                return i >= 55296 && i <= 56319 && n < this.str.length && (r = this.str.charCodeAt(n + 1)) >= 56320 && r <= 57343 ? 1024 * (i - 55296) + r - 56320 + 65536 : i
            }, n.prototype.toString = function() {
                return this.str
            }, n.isSurrogatePair = function(t) {
                var n = t.charCodeAt(0);
                return n >= 55296 && n <= 56319
            }, t.exports = n
        },
        3178: t => {
            "use strict";
    
            function n(t) {
                var n;
                if (null == t) n = 1048576;
                else {
                    if ("number" != typeof t) {
                        if (t instanceof Uint8Array) return this.buffer = t, void(this.position = 0);
                        throw typeof t + " is invalid parameter type for ByteBuffer constructor"
                    }
                    n = t
                }
                this.buffer = new Uint8Array(n), this.position = 0
            }
            var i = function(t) {
                var n = new Uint8Array(4 * t.length);
                var i = 0,
                    r = 0;
                for (; i < t.length;) {
                    var e;
                    var o = t.charCodeAt(i++);
                    if (o >= 55296 && o <= 56319) {
                        var s = o;
                        var a = t.charCodeAt(i++);
                        if (!(a >= 56320 && a <= 57343)) return null;
                        e = 1024 * (s - 55296) + 65536 + (a - 56320)
                    } else e = o;
                    e < 128 ? n[r++] = e : e < 2048 ? (n[r++] = e >>> 6 | 192, n[r++] = 63 & e | 128) : e < 65536 ? (n[r++] = e >>> 12 | 224, n[r++] = e >> 6 & 63 | 128, n[r++] = 63 & e | 128) : e < 1 << 21 && (n[r++] = e >>> 18 | 240, n[r++] = e >> 12 & 63 | 128, n[r++] = e >> 6 & 63 | 128, n[r++] = 63 & e | 128)
                }
                return n.subarray(0, r)
            };
            var r = function(t) {
                var n = "";
                var i, r, e, o;
                var s = 0;
                for (; s < t.length;)(i = (r = t[s++]) < 128 ? r : r >> 5 == 6 ? (31 & r) << 6 | 63 & t[s++] : r >> 4 == 14 ? (15 & r) << 12 | (63 & t[s++]) << 6 | 63 & t[s++] : (7 & r) << 18 | (63 & t[s++]) << 12 | (63 & t[s++]) << 6 | 63 & t[s++]) < 65536 ? n += String.fromCharCode(i) : (e = 55296 | (i -= 65536) >> 10, o = 56320 | 1023 & i, n += String.fromCharCode(e, o));
                return n
            };
            n.prototype.size = function() {
                return this.buffer.length
            }, n.prototype.reallocate = function() {
                var t = new Uint8Array(2 * this.buffer.length);
                t.set(this.buffer), this.buffer = t
            }, n.prototype.shrink = function() {
                return this.buffer = this.buffer.subarray(0, this.position), this.buffer
            }, n.prototype.put = function(t) {
                this.buffer.length < this.position + 1 && this.reallocate(), this.buffer[this.position++] = t
            }, n.prototype.get = function(t) {
                return null == t && (t = this.position, this.position += 1), this.buffer.length < t + 1 ? 0 : this.buffer[t]
            }, n.prototype.putShort = function(t) {
                if (65535 < t) throw t + " is over short value";
                var n = 255 & t;
                var i = (65280 & t) >> 8;
                this.put(n), this.put(i)
            }, n.prototype.getShort = function(t) {
                if (null == t && (t = this.position, this.position += 2), this.buffer.length < t + 2) return 0;
                var n = this.buffer[t];
                var i = (this.buffer[t + 1] << 8) + n;
                return 32768 & i && (i = -(i - 1 ^ 65535)), i
            }, n.prototype.putInt = function(t) {
                if (4294967295 < t) throw t + " is over integer value";
                var n = 255 & t;
                var i = (65280 & t) >> 8;
                var r = (16711680 & t) >> 16;
                var e = (4278190080 & t) >> 24;
                this.put(n), this.put(i), this.put(r), this.put(e)
            }, n.prototype.getInt = function(t) {
                if (null == t && (t = this.position, this.position += 4), this.buffer.length < t + 4) return 0;
                var n = this.buffer[t];
                var i = this.buffer[t + 1];
                var r = this.buffer[t + 2];
                return (this.buffer[t + 3] << 24) + (r << 16) + (i << 8) + n
            }, n.prototype.readInt = function() {
                var t = this.position;
                return this.position += 4, this.getInt(t)
            }, n.prototype.putString = function(t) {
                var n = i(t);
                for (var r = 0; r < n.length; r++) this.put(n[r]);
                this.put(0)
            }, n.prototype.getString = function(t) {
                var n, i = [];
                for (null == t && (t = this.position); !(this.buffer.length < t + 1) && 0 !== (n = this.get(t++));) i.push(n);
                return this.position = t, r(i)
            }, t.exports = n
        },
    }
    var i = {};
    t.n = n => {
        var i = n && n.__esModule ? () => n["default"] : () => n;
        return t.d(i, {
            a: i
        }), i
    }, t.d = (n, i) => {
        for (var r in i) t.o(i, r) && !t.o(n, r) && Object.defineProperty(n, r, {
            enumerable: !0,
            get: i[r]
        })
    }, t.g = function() {
        if ("object" == typeof globalThis) return globalThis;
        try {
            return this || new Function("return this")()
        } catch (t) {
            if ("object" == typeof window) return window
        }
    }(), t.o = (t, n) => Object.prototype.hasOwnProperty.call(t, n), t.r = t => {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(t, "__esModule", {
            value: !0
        })
    }, t.nmd = t => (t.paths = [], t.children || (t.children = []), t)

    var CC = t(3297);
    var EC = t.n(CC);

    const sentenceSeparatorPattern = /(?:\s+?)?([\w\W]+?)(?:\.|\?|\!|\n|$|？|！|。|”)+/g;

    function pr(t) {
        return !!/\S/g.test(t)
    }

    function wr(t, n) {
        const i = [...t.matchAll(n)];
        const r = [];
        for (const t of i) pr(t[0]) && r.push(t[0]);
        return r
    }

    function splitToSentences(t) {
        return wr(t, sentenceSeparatorPattern)
    }

    function isAcceptedSurfacePosPair(t) {
        const n = [
            ["接続詞", "じゃ"],
            ["助詞", "じゃ"]
        ];
        for (const i of n)
            if (t.pos == i[0] && t.surface_form == i[1]) return !0;
        return !1
    }

    function isVerbToIgnore(t) {
        return !(!["てる", "れる", "られる", "せる", "がる", "じまう", "ちまう", "じゃう"].includes(t.basic_form) || "動詞" != t.pos)
    }
    function isJyoshiToIgnore(t) {
        return !(!["で", "て", "ちゃ", "ば", "じゃ"].includes(t.basic_form) || "助詞" != t.pos)
    }
    function isJyodoushiToIgnore(t) {
        return !(!["た", "ます", "たい", "ぬ", "ない", "う", "ん"].includes(t.basic_form) || "助動詞" != t.pos)
    }
    function isKeiyoushiToIgnore(t) {
        return !(!["ない"].includes(t.basic_form) || "形容詞" != t.pos)
    }
    function otherIgnorableEndings(t) {
        return !(!["ん"].includes(t.basic_form) || "名詞" != t.pos) || !(!["う"].includes(t.basic_form) || "感動詞" != t.pos)
    }

    function wordIsAValidEnding(t) {
        let n = !1;
        return (isVerbToIgnore(t) || isJyodoushiToIgnore(t) || isJyoshiToIgnore(t) || isKeiyoushiToIgnore(t) || otherIgnorableEndings(t)) && (n = !0), n && (t.skip = !0), n
    }

    function getEndingForVerbAdj(t, n) {
        let i = !1;
        let r = "";
        let e = n;
        for (; !i && t[e];) {
            const n = t[e];
            if (!wordIsAValidEnding(n)) break;
            r += n.surface_form, e++
        }
        return r
    }

    function getCombinedWords(t) {
        for (let n = 0; n < t.length; n++) {
            const i = t[n];
            let r = "";
            (["動詞", "形容詞", "助動詞"].includes(i.pos) || isAcceptedSurfacePosPair(i)) && (r = getEndingForVerbAdj(t, n + 1)), i.ending = r
        }
        return t
    }

    const minOneTargetSentenceWordCount = 4;
    const maxOneTargetSentenceWordCount = 18;

    function isOneTargetSentenceValidLength(t) {
        return minOneTargetSentenceWordCount <= t && t <= maxOneTargetSentenceWordCount
    }

    function isValidWordType(t) {
        return !["記号"].includes(t.pos)
    }

    function parseAudioArray(t) {
        let n = [];
        if (t) {
            const i = t.split(":");
            for (const t of i) {
                let [i, r, e] = t.split(";");
                n.push({
                    pronunciation: i,
                    accent: r,
                    file: e
                })
            }
        }
        return n
    }

    function getPronAccentsAndAudioFromWordEntry(t, n) {
        let [i, r] = t.split("◲");
        return parseAudioArray(r), [i + n.ending, r]
    }

    this.displayMode = "coloredkanjireading";
    this.pitchShapes = !1;

    function getStyledWord(t) {
        let n;
        return n = t.includes("[") ? this.japaneseParser.formatJapanese(t, this.displayMode, this.pitchShapes) : addNoReadingClass(t)[0], n
    }

    function getAudioPrefix(t) {
        const n = t.split(":");
        const i = [];
        const r = [];
        const e = [];
        for (const t of n) {
            const [n, o, s] = t.split(";");
            i.push(s), r.push(n), e.push(o)
        }
        return `<span class="migaku-audio" data-accents="${e.join(",")}" data-pron="${r.join(",")}" data-mp3s="${i.join(",")}">`
    }

    function numberToStatus(t) {
        switch (t) {
            case 1:
                return "status-learning";
            case 2:
                return "status-known";
            default:
                return "status-unknown"
        }
    }

    function getLearningStatusClass(t) {
        let n = "status-unknown";
        return t && (n = numberToStatus(t.status)), n
    }

    const allJP = /^[\u3400-\u4dbf\u4e00-\u9fafｦ-ﾝ\u30a0-\u30fa\u3040-\u309fー〤々〆〱〲ヵヶヷヸヹヺｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾟﾝﾞ]+$/;

    function isAllJP(t) {
        return allJP.test(t)
    }

    function addNoReadingClass(t) {
        let n = "";
        let i = !1;
        return isAllJP(t) && (i = !0, n = "migaku-matched-language"), [`<span data-language="ja" class="migaku-no-reading ${n}">${t}</span>`, t, i]
    }

    function convertToHira(t) {
        const n = "がぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽあいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんぁぃぅぇぉゃゅょっゐゑ";
        const i = "ガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポアイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンァィゥェォャュョッヰヱ";
        let r = "";
        for (let e = 0; e < t.length; e++) - 1 !== i.indexOf(t[e]) ? r += n[i.indexOf(t[e])] : r += t[e];
        return r
    }

    const learningStatusBarHidden = "migaku-status-bar-hidden";
    const onlyUnknown = true;
    const cleanedLanguageCode = "ja";

    function addLearningStatusStyling(t, n, i, r) {
        return `<div class="migaku-learning-status ${n}${i}" data-status-word="${r}">` + t + `<div class="migaku-status-bar ${learningStatusBarHidden}"></div></div>`
    }

    function wrapSentence(t) {
        return `<span data-lang="${cleanedLanguageCode}" class="migaku-sentence">${t}</span>`
    }

    class Gy {
        constructor() {
            this.initiateBuiltInDictionaries()
        }
        initiateBuiltInDictionaries() {
            this.forvo = new Fy(this), this.images = new Vy(this), this.examples = new qy(this);
            const t = [this.forvo, this.images, this.examples];
            this.dictionaries = [];
            for (const n of t) this.dictionaries.push(n.getDictionaryRow());
            this.dictionaryNames = this.filterNamesFromDictionaries()
        }
        filterNamesFromDictionaries() {
            const t = [];
            for (const n of this.dictionaries) t.push(n.name);
            return t
        }
        getDictionaries() {
            return this.dictionaries
        }
        conflictsWithBuiltInDictionaries(t) {
            return !!this.dictionaryNames.includes(t)
        }
    }

    async function getFrequencyAndTagClasses(t, n) {
        let i = [];
        let r = [Gm.oneTarget];
        let e = [];
        let o;
        if (t) {
            const s = t[0].split(",");
            const a = t[1];
            let u;
            this.manager.shouldExportBasedOnFrequencyScore() && (u = await this.getFrequencyScoreForWordReading(s, a),
            this.manager.isValidFrequencyForExport(u) || (r = [])),
            this.manager.shouldColor1TAccordingToFrequency() && (void 0 === u && (u = await this.getFrequencyScoreForWordReading(s, a)),
            e.push(await this.getFrequencyClassFor1TWord(u))),
            this.manager.shouldOnlyExport1TWithTags() && (o = await this.manager.getWordListTagsForWordReading(this.langCode, s, a), o || (r = [])),
            this.manager.shouldUnderline1TWithTags() && (void 0 === o && (o = await this.manager.getWordListTagsForWordReading(this.langCode, s, a)),
            o && (i = [Gm.oneTargetTagged], n && i.push(Gm.onlyUnknownRuby)))
        }
        return [r, e, i, o]
    }

    function replaceUnknownStatusBarWithTagBar(t, n, i) {
        let [r, e] = t;
        e && (e = `<span class="migaku-word-list-tag">${e}</span>`);
        const o = /\<div class="migaku-status-bar([^>]*?)"+?>\<\/div\>/;
        const s = `<div class="migaku-status-bar $1"><div title="${r}" class="migaku-word-list-bar">${e}</div></div>`;
        const a = i.replace(o, s);
        return n.replace(i, a)
    }

    async function addOneTargetWrapper(t, n, i, r, e) {
        if (!n) return wrapSentence(t);
        const [o, s, a, u] = await getFrequencyAndTagClasses(i, e);
        return u && (t = replaceUnknownStatusBarWithTagBar(u, t, r)), 0 === o.length && 0 === s.length && 0 === a.length ? this.wrapSentence(t) : `<span data-lang="${this.cleanedLanguageCode}" class="migaku-sentence ${s.join(" ")} ${o.join(" ")} ${a.join(" ")}">${t}</span>`
    }

    async function produceStringFromWords(t, n = !0) {
        let i = "";
        let r = 0;
        let e = !1;
        let o = !1;
        for (const n of t) {
            if (n.skip) continue;
            const t = n.surface_form;
            const s = n.pronunciation;
            if (isValidWordType(n) && s) {
                const [t, a] = getPronAccentsAndAudioFromWordEntry(s, n);
                let u = getStyledWord(t);
                a && (u = getAudioPrefix(a) + u + "</span>");
                const c = n.reading;
                // const h = await this.wordDb.checkStatus(c);
                const h = undefined; // FIXED VALUE
                const f = getLearningStatusClass(h);
                let l = !1;
                let d = "";
                // Always f=status-unknown because of h=undefined
                "status-unknown" == f ? (l = !0, r++, e = c.split("◴")) : onlyUnknown && (d = " migaku-not-unknown"), u = addLearningStatusStyling(u, f, d, c), l && (o = u), i += u
            } else {
                let [n, o, s] = addNoReadingClass(t);
                if (s) {
                    const t = o + "◴" + convertToHira(o);
                    // const i = await this.wordDb.checkStatus(t);
                    const i = undefined; // FIXED VALUE
                    const s = getLearningStatusClass(i);
                    let a = !1;
                    let u = "";
                    // Always s=status-unknown because of i=undefined
                    "status-unknown" == s ? (a = !0, r++, e = t.split("◴")) : onlyUnknown && (u = " migaku-not-unknown"), n = addLearningStatusStyling(n, s, u, t)
                }
                i += n
            }
        }
        // disabled addOneTargetWrapper
        return i = 1 == r && false ? await addOneTargetWrapper(i, n, e, o, onlyUnknown) : wrapSentence(i), i
    }


    async function parseTextInner(t, n = !0) {
        const i = [];
        let r;
        r = n ? splitToSentences(t) : [t];
        for (const t of r) {
            const n = this.tokenizer.tokenize(t);
            const r = getCombinedWords(n);
            const e = isOneTargetSentenceValidLength(r.length);
            const o = await produceStringFromWords(r, e);
            i.push(o)
        }
        return i.join("")
    }

    function removeLeadingAndTrailingWhitespace(t) {
        return t.replace(/^\s+|\s+$/g, "")
    }

    const removeBrackets = !1;

    function performBracketRemoval(t) {
        const n = [];
        const i = [];
        removeBrackets.includes("removeHalf") && (n.push("("), i.push(")")), removeBrackets.includes("removeFull") && (n.push("（"), i.push("）")), removeBrackets.includes("removeSquare") && (n.push("\\["), i.push("\\]"));
        const r = new RegExp(`[${n.join("")}]+.+[${i.join("")}]+`, "g");
        return t = t.replace(r, ""), removeLeadingAndTrailingWhitespace(t)
    }

    function processOriginalText(t) {
        return removeBrackets.length > 0 && (t = performBracketRemoval(t)), t
    }

    function parseTextOuter(t, n) {
        const i = t[Ww.textToParse];
        const r = t[Ww.preferences];
        let e;
        parseTextInner(processOriginalText(i)).then(n)
    }

    class eE {
        pitchGraphsEnabled = !0;
        pitchShapesEnabled = !0;
        furiganaFontSize = 5;
        replaceWithKanji = !0;
        displayModes = ["hover", "coloredhover", "coloredkanji", "reading", "coloredreading", "kanjireading", "coloredkanjireading", "kanji"];
        cleanUpSpaces(t) {
            return t.replace(/&nbsp;&nbsp;/g, "&nbsp;").replace(/\n/g, "").replace(/ /g, "")
        }
        fetchColoredPitchIds(t) {
            const n = [];
            let i;
            for (let r = 0; r < t.length; r++) i = t[r].match(/(n[\d]{1,2})|(k[\d]{1,2})+?|[hanok]/g), i.length > 1 ? n.push("$span class=^" + this.pitchConvert(i[0][0]) + "^%" + this.replaceAccentWithKanji(i[0]) + "$/span%-$span class=^" + this.pitchConvert(i[1][0]) + "^%" + this.replaceAccentWithKanji(i[1]) + "$/span%") : n.push("$span class=^" + this.pitchConvert(i[0][0]) + "^>" + this.replaceAccentWithKanji(i[0]) + "$/span%");
            return "$span style=^font-family:Arial;^%" + n.join("$span class=^migaku-separator^%, $/span%") + "$/span%"
        }
        pitchConvert(t, n = !1) {
            let i = "";
            switch (t = t[0]) {
                case "h":
                    i = "heiban";
                    break;
                case "a":
                    i = "atamadaka";
                    break;
                case "n":
                    i = "nakadaka";
                    break;
                case "o":
                    i = "odaka";
                    break;
                case "k":
                    i = "kifuku"
            }
            return n ? " bg" + i.charAt(0).toUpperCase() + i.slice(1) : i
        }
        fetchPitch(t) {
            if (/(n[\d]{1,2})|(k[\d]{1,2})+?/g.test(t)) {
                const n = t.match(/(n[\d]{1,2})|(k[\d]{1,2})+?|[hanok]/g);
                let i = "";
                let r = [];
                for (let t = 0; t < n.length; t++) n[t].length > 1 && 0 == t ? (r.push(n[t].substring(0, 1)), i = parseInt(n[t].substring(1))) : r.push(n[t]);
                return [this.pitchConvert(r[0].substring(0, 1)), [!0, r, i]]
            }
            if (/[hanok]{2,}/g.test(t)) {
                let n = t.split("");
                return [this.pitchConvert(n[0]), [!1, this.pitchConvert(n[1], !0)]]
            }
            return [this.pitchConvert(t), !1]
        }
        getPitchGraph(t, n, i = !1, r = !1) {
            let e = 1;
            const o = ["ゃ", "ょ", "ゅ", "ぁ", "ぃ", "ぇ", "ぉ", "ぅ", "ャ", "ョ", "ュ", "ァ", "ィ", "ェ", "ォ", "ゥ"];
            if (-1 !== o.indexOf(t[1]) && (e = 2), "a" === n) return "$div class=^pitch-box^%$div class=^pitch-overbar^%$/div%$span class=^high-pitch^%" + t.substring(0, e) + "$/span%$div class=^pitch-drop^%$/div%$/div%" + t.substring(e);
            if ("n" == n || "k" === n) {
                let s = 1;
                let a = 0;
                let u = !1;
                if ("k" === n) {
                    if (!r) return !1;
                    t = r
                }
                if (!1 === i) return t;
                s = i;
                for (let n = 0; n < s + 1; n++) - 1 !== o.indexOf(t[n]) && s++;
                return a = s, 1 === i && (u = !0), u ? "$div class=^pitch-box^%$div class=^pitch-overbar^%$/div%$span class=^high-pitch^%" + t.substring(0, s) + "$/span%$div class=^pitch-drop^%$/div%$/div%" + t.substring(s) : t.substring(0, e) + "$div class=^pitch-box^%$div class=^pitch-overbar^%$/div%$span class=^high-pitch^%" + t.substring(e, a) + "$/span%$div class=^pitch-drop^%$/div%$/div%" + t.substring(a)
            }
            return "h" === n ? (r && (t = r), t.substring(0, e) + "$div class=^pitch-box^%$div class=^pitch-overbar^%$/div%$span class=^high-pitch^%" + t.substring(e) + "$/span%$/div%") : "o" === n ? (r && (t = r), 1 === t.length || 2 == t.length && -1 !== o.indexOf(t[1]) ? "$div class=^pitch-box^%$div class=^pitch-overbar^%$/div%$span class=^high-pitch^%" + t + "$/span%$div class=^pitch-drop^%$/div%$/div%" : t.substring(0, e) + "$div class=^pitch-box^%$div class=^pitch-overbar^%$/div%$span class=^high-pitch^%" + t.substring(e) + "$/span%$div class=^pitch-drop^%$/div%$/div%") : void 0
        }
        convertToHira(t) {
            const n = "がぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽあいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんぁぃぅぇぉゃゅょっゐゑ";
            const i = "ガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポアイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンァィゥェォャュョッヰヱ";
            let r = "";
            for (let e = 0; e < t.length; e++) - 1 !== i.indexOf(t[e]) ? r += n[i.indexOf(t[e])] : r += t[e];
            return r
        }
        fetchFuriWrapper(t) {
            return t ? '<div class="migaku-ruby-top migaku-upper-ruby' + this.furiganaFontSize + '"><span class="migaku-upper-ruby" data-text="' + t + '">' + "</span></div>" : ""
        }
        getJEvents() {
            return ""
        }
        fetchPitchShapes(t, n, i, r) {
            let e, o, s, a = "",
                u = [];
            o = this.getJEvents();
            for (let c = 1; c < t.length; c++) {
                if (this.pitchGraphsEnabled && (a = "$div class=^pitch-accent-popup no-ruby^%$div class=^no-ruby-pitch^%" + n + "$/div%$/div%"), e = t[c].match(/(n[\d]{1,2})|(k[\d]{1,2})+?|[hanok]/g), e.length > 1) s = `<div data-language="ja" data-extra="${a}" class="pitch-shape-box pitch-circle-box" ` + o + '><div class="pitch-circle-box-left"  ><div class="left-pitch-circle ' + this.pitchConvert(e[0][0], !0) + '"></div></div><div class="pitch-circle-box-right"><div class="right-pitch-circle ' + this.pitchConvert(e[1][0], !0) + '"></div></div></div>';
                else {
                    let u = !1;
                    let c = e[0][0];
                    if (e[0].length > 1 && (u = parseInt(e[0].substring(1))), ("" !== i || "" !== r) && this.pitchGraphsEnabled)
                        if (r || "k" != e[0][0] && "k" != t[0][0]) {
                            r && "k" == e[0][0] && (i = r);
                            const t = this.getPitchGraph(i, c, u, r);
                            a = "$div class=^pitch-accent-popup^%$div class=^pitch-graph-container^%$span class=^" + this.pitchConvert(e[0][0]) + "^%" + t + "$/span%$/div%$div class=^pitch-numbers^%" + n + "$/div%$/div%"
                        } else a = "$div class=^pitch-accent-popup no-ruby^%$div class=^no-ruby-pitch^%" + n + "$/div%$/div%";
                    s = `<div data-language="ja" data-extra="${a}" class="pitch-shape-box pitch-diamond-box"  ` + o + '><div class="pitch-diamond ' + this.pitchConvert(e[0][0], !0) + '"></div></div>'
                }
                u.push(s)
            }
            return u.join("")
        }
        replaceAccentWithKanji(t) {
            return this.replaceWithKanji ? t.replace(/h/g, "平板").replace(/a/g, "頭高").replace(/n/g, "中高").replace(/o/g, "尾高").replace(/k/g, "起伏") : t.toUpperCase()
        }
        getReadingColoredSettings(t) {
            let n = !1;
            let i = !1;
            return "c" == t.charAt(0) && (i = !0), "reading" != t && "coloredreading" != t || (n = !0), [n, i]
        }
        isAllKana(t) {
            return t.match(/^[\u3040-\u309f\u30a0-\u30ff]+$/)
        }
        formatJapanese(t, n, i) {
            const [r, e] = this.getReadingColoredSettings(n);
            let o;
            if (this.pitchShapesEnabled = i, o = t.match(/[^ 　&>;☷\n]+?\[[^\]]+\][^ 　&<;☷\n]*/g)) {
                r || (t = this.cleanUpSpaces(t));
                for (let i = 0; i < o.length; i++) {
                    let s = o[i];
                    let a, u;
                    let c = s.match(/\[([^\]]+)\]/)[1];
                    let h = s.replace(/\[[^\]]+\]/, "---SEPERATOR---");
                    [a, u] = h.split("---SEPERATOR---");
                    let f, l = ""; - 1 !== c.indexOf(";") ? ([f, l] = c.split(";"), r || "" != f || (f = a), l = -1 !== l.indexOf("、") ? l.split("、") : [l]) : f = c;
                    let d = ""; - 1 !== f.indexOf("、") && ([f, d] = f.split("、")), "" === f || this.isAllKana(f) || (f = ""), r && "" == f && this.isAllKana(a) && (f = a);
                    let v = "",
                        p = "",
                        w = "";
                    let g = !0;
                    let m = !1;
                    let y = "";
                    let b = "";
                    let k;
                    if (l) {
                        k = this.fetchColoredPitchIds(l), [v, p] = this.fetchPitch(l[0]), p && (p[0] ? p[1].length > 1 ? (g = !1, w = this.pitchConvert(p[1][1], !0)) : m = !0 : (g = !1, p[1].length > 1 && (w = p[1])));
                        let t = "";
                        this.isAllKana(a) && "" == f && (t = a);
                        let n = "";
                        g && this.pitchGraphsEnabled && ("" !== f || "" !== t || "" !== d) && (n = t || f, y = m ? this.getPitchGraph(this.convertToHira(n + u), p[1][0], p[2], d) : this.getPitchGraph(this.convertToHira(n + u), l[0], !1, d), y ? (b = " thumb-hover", y = "$div class=^pitch-accent-popup " + v + "^%$div class=^pitch-graph-container^%" + y + "$/div%$div class=^pitch-numbers^%" + k + "$/div%$/div%") : y = ""), !y && this.pitchGraphsEnabled && (e ? m && (y = "$div class=^pitch-accent-popup no-ruby^%$div class=^no-ruby-pitch^%" + k + "$/div%$/div%") : y = "$div class=^pitch-accent-popup no-ruby^%$div class=^no-ruby-pitch^%" + k + "$/div%$/div%")
                    }
                    "" === f && "" !== d && this.pitchGraphsEnabled && !y && (y = "$div class=^pitch-accent-popup^%$div class=^pitch-graph-container^%" + d + "&nbsp;$/div%$/div%");
                    let S = this.getJEvents();
                    let T = "";
                    if (l.length > 1 && e && "coloredhover" !== n && this.pitchShapesEnabled && (T = f ? this.fetchPitchShapes(l, k, f + u, d) : this.fetchPitchShapes(l, k, "", d)), this.isAllKana(a) && (f = ""), e || (v = "", w = ""), "coloredkanji" == n) t = t.replace(s, `<div class="migaku-word-cont"><span data-language="ja" data-extra="${y}" class="migaku-word ` + v + w + b + '"' + S + ">" + a + u + "</span>" + T + "</div>");
                    else if ("kanji" == n) t = t.replace(s, `<span data-language="ja" data-extra="${y}" class="migaku-word"` + S + ">" + a + u + "</span>");
                    else if ("coloredkanjireading" == n || "kanjireading" == n) f = this.fetchFuriWrapper(f), t = t.replace(s, `<div class="migaku-word-cont"><span data-language="ja" data-extra="${y}" class="migaku-word ` + v + w + b + '"' + S + '><div class="migaku-ruby-cont">' + f + '<div class="migaku-ruby-bottom"><span class="migaku-lower-ruby">' + a + "</span></div></div>" + u + "</span>" + T + "</div>");
                    else if ("coloredhover" == n || "hover" == n) f = this.fetchFuriWrapper(f), t = t.replace(s, `<div class="migaku-word-cont"><span data-language="ja" data-extra="${y}" class="migaku-word unhovered-word ` + v + w + b + '"' + S + '><div class="migaku-ruby-cont">' + f + '<div class="migaku-ruby-bottom"><span class="migaku-lower-ruby">' + a + "</span></div></div>" + u + "</span></div>");
                    else if ("coloredreading" == n || "reading" == n) {
                        let i;
                        "reading" == n && (v = "", T = ""), i = f && u ? f + u : f && "" === u ? f : a + u, t = t.replace(s, `&nbsp;<div class="migaku-word-cont"><span data-language="ja" data-extra="${y}" class="migaku-word ` + v + w + b + '"' + S + ">" + i + "</span>" + T + "</div>&nbsp;")
                    }
                }
                return t
            }
            return r || (t = this.cleanUpSpaces(t)), t
        }
    }

    let isTokenizerReady = false;

    const initializeTokenizer = async() => {
        await EC().builder({
            dicPath: "./alt"
        }).build(((t, n) => {
            this.tokenizer = n, this.ready = !0;
            this.japaneseParser = new eE

            isTokenizerReady = true;
        }))
    }

    initializeTokenizer()

    function Sr(t) {
        chrome.runtime.onMessageExternal.addListener(t)
    }
    
    function kr(t) {
        chrome.runtime.onMessage.addListener(t)
    }

    function callbackWhenHandlerIsReady(t) {
        !isTokenizerReady ? setTimeout((() => {
            this.callbackWhenHandlerIsReady(t)
        }), 50) : t()
    }

    const Ww = {
        textToParse: "textToParse",
        preferences: "preferences",
        _$languageCode$_: "languageCode"
    };

    function handleMigakuParseRequest(t, n, i) {
        if (t[Ww.textToParse]) {
            callbackWhenHandlerIsReady(() => {
                this.pitchShapes = !!t[Ww.preferences].pitchShapes;
                parseTextOuter(t, i)
            })
            return true;
        } else {
            return false;
        }
    }

    Sr(handleMigakuParseRequest.bind(this)), kr(handleMigakuParseRequest.bind(this))
}

InjectMigaku();