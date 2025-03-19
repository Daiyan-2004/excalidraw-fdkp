  
  document.addEventListener("DOMContentLoaded", function () {
    var rootNode = document.createElement("div");
    rootNode.style.display = "none";

    var newDiv = document.createElement("div");
    newDiv.id = "incomingSourceContainer";
    newDiv.innerHTML = "";
    rootNode.append(newDiv);

    var newDiv = document.createElement("div");
    newDiv.id = "outgoingSourceContainer";
    newDiv.innerHTML = "";
    rootNode.append(newDiv);

    var newInp = document.createElement("input");
    newInp.id = "promiseContainer";
    newInp.value = "";
    rootNode.append(newInp);

    document.body.prepend(rootNode);

    var loderdiv = document.createElement('div');
    loderdiv.innerText = 'Converting SVG to Excalidraw element is under processing...';
    loderdiv.id = "loderdiv";
    loderdiv.setAttribute('style', 'display: none;position: fixed;z-index: 100;justify-content: center;align-items: center;width: 100vw;height: 100vh;color: black;backdrop-filter: blur(10px);')

    document.body.prepend(loderdiv);
  });
  var pathConverter = (function () {
    "use strict";
    var je = Object.defineProperty;
    var ze = ($, P, S) =>
      P in $
        ? je($, P, { enumerable: !0, configurable: !0, writable: !0, value: S })
        : ($[P] = S);
    var w = ($, P, S) => (ze($, typeof P != "symbol" ? P + "" : P, S), S);
    const $ = { origin: [0, 0, 0], round: 4 },
      P = "pathConverter Error",
      S = { a: 7, c: 6, h: 1, l: 2, m: 2, r: 4, q: 4, s: 4, t: 2, v: 1, z: 0 },
      Ct = (e) => {
        let t = e.pathValue[e.segmentStart],
          n = t.toLowerCase();
        const { data: r } = e;
        for (
          ;
          r.length >= S[n] &&
          (n === "m" && r.length > 2
            ? (e.segments.push([t, ...r.splice(0, 2)]),
              (n = "l"),
              (t = t === "m" ? "l" : "L"))
            : e.segments.push([t, ...r.splice(0, S[n])]),
          !!S[n]);
  
        );
      },
      te = (e) => {
        const { index: t, pathValue: n } = e,
          r = n.charCodeAt(t);
        if (r === 48) {
          (e.param = 0), (e.index += 1);
          return;
        }
        if (r === 49) {
          (e.param = 1), (e.index += 1);
          return;
        }
        e.err = `${P}: invalid Arc flag "${n[t]}", expecting 0 or 1 at index ${t}`;
      },
      Z = (e) => e >= 48 && e <= 57,
      X = "Invalid path value",
      ee = (e) => {
        const { max: t, pathValue: n, index: r } = e;
        let s = r,
          i = !1,
          o = !1,
          l = !1,
          a = !1,
          c;
        if (s >= t) {
          e.err = `${P}: ${X} at index ${s}, "pathValue" is missing param`;
          return;
        }
        if (
          ((c = n.charCodeAt(s)),
          (c === 43 || c === 45) && ((s += 1), (c = n.charCodeAt(s))),
          !Z(c) && c !== 46)
        ) {
          e.err = `${P}: ${X} at index ${s}, "${n[s]}" is not a number`;
          return;
        }
        if (c !== 46) {
          if (
            ((i = c === 48),
            (s += 1),
            (c = n.charCodeAt(s)),
            i && s < t && c && Z(c))
          ) {
            e.err = `${P}: ${X} at index ${r}, "${n[r]}" illegal number`;
            return;
          }
          for (; s < t && Z(n.charCodeAt(s)); ) (s += 1), (o = !0);
          c = n.charCodeAt(s);
        }
        if (c === 46) {
          for (a = !0, s += 1; Z(n.charCodeAt(s)); ) (s += 1), (l = !0);
          c = n.charCodeAt(s);
        }
        if (c === 101 || c === 69) {
          if (a && !o && !l) {
            e.err = `${P}: ${X} at index ${s}, "${n[s]}" invalid float exponent`;
            return;
          }
          if (
            ((s += 1),
            (c = n.charCodeAt(s)),
            (c === 43 || c === 45) && (s += 1),
            s < t && Z(n.charCodeAt(s)))
          )
            for (; s < t && Z(n.charCodeAt(s)); ) s += 1;
          else {
            e.err = `${P}: ${X} at index ${s}, "${n[s]}" invalid integer exponent`;
            return;
          }
        }
        (e.index = s), (e.param = +e.pathValue.slice(r, s));
      },
      ne = (e) =>
        [
          5760, 6158, 8192, 8193, 8194, 8195, 8196, 8197, 8198, 8199, 8200, 8201,
          8202, 8239, 8287, 12288, 65279, 10, 13, 8232, 8233, 32, 9, 11, 12, 160,
        ].includes(e),
      B = (e) => {
        const { pathValue: t, max: n } = e;
        for (; e.index < n && ne(t.charCodeAt(e.index)); ) e.index += 1;
      },
      se = (e) => {
        switch (e | 32) {
          case 109:
          case 122:
          case 108:
          case 104:
          case 118:
          case 99:
          case 115:
          case 113:
          case 116:
          case 97:
            return !0;
          default:
            return !1;
        }
      },
      re = (e) => Z(e) || e === 43 || e === 45 || e === 46,
      ie = (e) => (e | 32) === 97,
      Tt = (e) => {
        const { max: t, pathValue: n, index: r } = e,
          s = n.charCodeAt(r),
          i = S[n[r].toLowerCase()];
        if (((e.segmentStart = r), !se(s))) {
          e.err = `${P}: ${X} "${n[r]}" is not a path command`;
          return;
        }
        if (((e.index += 1), B(e), (e.data = []), !i)) {
          Ct(e);
          return;
        }
        for (;;) {
          for (let o = i; o > 0; o -= 1) {
            if ((ie(s) && (o === 3 || o === 4) ? te(e) : ee(e), e.err.length))
              return;
            e.data.push(e.param),
              B(e),
              e.index < t &&
                n.charCodeAt(e.index) === 44 &&
                ((e.index += 1), B(e));
          }
          if (e.index >= e.max || !re(n.charCodeAt(e.index))) break;
        }
        Ct(e);
      };
    class Lt {
      constructor(t) {
        (this.segments = []),
          (this.pathValue = t),
          (this.max = t.length),
          (this.index = 0),
          (this.param = 0),
          (this.segmentStart = 0),
          (this.data = []),
          (this.err = "");
      }
    }
    const J = (e) =>
        Array.isArray(e) &&
        e.every((t) => {
          const n = t[0].toLowerCase();
          return (
            S[n] === t.length - 1 &&
            "achlmqstvz".includes(n) &&
            t.slice(1).every(Number.isFinite)
          );
        }) &&
        e.length > 0,
      F = (e) => {
        if (J(e)) return [...e];
        const t = new Lt(e);
        for (B(t); t.index < t.max && !t.err.length; ) Tt(t);
        if (t.err && t.err.length) throw TypeError(t.err);
        return t.segments;
      },
      oe = (e) => {
        const t = e.length;
        let n = -1,
          r,
          s = e[t - 1],
          i = 0;
        for (; ++n < t; ) (r = s), (s = e[n]), (i += r[1] * s[0] - r[0] * s[1]);
        return i / 2;
      },
      V = (e, t) =>
        Math.sqrt((e[0] - t[0]) * (e[0] - t[0]) + (e[1] - t[1]) * (e[1] - t[1])),
      ce = (e) => e.reduce((t, n, r) => (r ? t + V(e[r - 1], n) : 0), 0);
    var ae = Object.defineProperty,
      le = (e, t, n) =>
        t in e
          ? ae(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n })
          : (e[t] = n),
      T = (e, t, n) => (le(e, typeof t != "symbol" ? t + "" : t, n), n);
    const me = {
        a: 1,
        b: 0,
        c: 0,
        d: 1,
        e: 0,
        f: 0,
        m11: 1,
        m12: 0,
        m13: 0,
        m14: 0,
        m21: 0,
        m22: 1,
        m23: 0,
        m24: 0,
        m31: 0,
        m32: 0,
        m33: 1,
        m34: 0,
        m41: 0,
        m42: 0,
        m43: 0,
        m44: 1,
        is2D: !0,
        isIdentity: !0,
      },
      St = (e) =>
        (e instanceof Float64Array ||
          e instanceof Float32Array ||
          (Array.isArray(e) && e.every((t) => typeof t == "number"))) &&
        [6, 16].some((t) => e.length === t),
      kt = (e) =>
        e instanceof DOMMatrix ||
        e instanceof v ||
        (typeof e == "object" && Object.keys(me).every((t) => e && t in e)),
      U = (e) => {
        const t = new v(),
          n = Array.from(e);
        if (!St(n))
          throw TypeError(
            `CSSMatrix: "${n.join(",")}" must be an array with 6/16 numbers.`
          );
        if (n.length === 16) {
          const [r, s, i, o, l, a, c, m, u, y, g, f, h, x, p, b] = n;
          (t.m11 = r),
            (t.a = r),
            (t.m21 = l),
            (t.c = l),
            (t.m31 = u),
            (t.m41 = h),
            (t.e = h),
            (t.m12 = s),
            (t.b = s),
            (t.m22 = a),
            (t.d = a),
            (t.m32 = y),
            (t.m42 = x),
            (t.f = x),
            (t.m13 = i),
            (t.m23 = c),
            (t.m33 = g),
            (t.m43 = p),
            (t.m14 = o),
            (t.m24 = m),
            (t.m34 = f),
            (t.m44 = b);
        } else if (n.length === 6) {
          const [r, s, i, o, l, a] = n;
          (t.m11 = r),
            (t.a = r),
            (t.m12 = s),
            (t.b = s),
            (t.m21 = i),
            (t.c = i),
            (t.m22 = o),
            (t.d = o),
            (t.m41 = l),
            (t.e = l),
            (t.m42 = a),
            (t.f = a);
        }
        return t;
      },
      $t = (e) => {
        if (kt(e))
          return U([
            e.m11,
            e.m12,
            e.m13,
            e.m14,
            e.m21,
            e.m22,
            e.m23,
            e.m24,
            e.m31,
            e.m32,
            e.m33,
            e.m34,
            e.m41,
            e.m42,
            e.m43,
            e.m44,
          ]);
        throw TypeError(
          `CSSMatrix: "${JSON.stringify(
            e
          )}" is not a DOMMatrix / CSSMatrix / JSON compatible object.`
        );
      },
      qt = (e) => {
        if (typeof e != "string")
          throw TypeError(`CSSMatrix: "${JSON.stringify(e)}" is not a string.`);
        const t = String(e).replace(/\s/g, "");
        let n = new v();
        const r = `CSSMatrix: invalid transform string "${e}"`;
        return (
          t
            .split(")")
            .filter((s) => s)
            .forEach((s) => {
              const [i, o] = s.split("(");
              if (!o) throw TypeError(r);
              const l = o
                  .split(",")
                  .map((f) =>
                    f.includes("rad")
                      ? parseFloat(f) * (180 / Math.PI)
                      : parseFloat(f)
                  ),
                [a, c, m, u] = l,
                y = [a, c, m],
                g = [a, c, m, u];
              if (i === "perspective" && a && [c, m].every((f) => f === void 0))
                n.m34 = -1 / a;
              else if (
                i.includes("matrix") &&
                [6, 16].includes(l.length) &&
                l.every((f) => !Number.isNaN(+f))
              ) {
                const f = l.map((h) => (Math.abs(h) < 1e-6 ? 0 : h));
                n = n.multiply(U(f));
              } else if (i === "translate3d" && y.every((f) => !Number.isNaN(+f)))
                n = n.translate(a, c, m);
              else if (i === "translate" && a && m === void 0)
                n = n.translate(a, c || 0, 0);
              else if (i === "rotate3d" && g.every((f) => !Number.isNaN(+f)) && u)
                n = n.rotateAxisAngle(a, c, m, u);
              else if (i === "rotate" && a && [c, m].every((f) => f === void 0))
                n = n.rotate(0, 0, a);
              else if (
                i === "scale3d" &&
                y.every((f) => !Number.isNaN(+f)) &&
                y.some((f) => f !== 1)
              )
                n = n.scale(a, c, m);
              else if (
                i === "scale" &&
                !Number.isNaN(a) &&
                a !== 1 &&
                m === void 0
              ) {
                const f = Number.isNaN(+c) ? a : c;
                n = n.scale(a, f, 1);
              } else if (
                i === "skew" &&
                (a || (!Number.isNaN(a) && c)) &&
                m === void 0
              )
                n = n.skew(a, c || 0);
              else if (
                ["translate", "rotate", "scale", "skew"].some((f) =>
                  i.includes(f)
                ) &&
                /[XYZ]/.test(i) &&
                a &&
                [c, m].every((f) => f === void 0)
              )
                if (i === "skewX" || i === "skewY") n = n[i](a);
                else {
                  const f = i.replace(/[XYZ]/, ""),
                    h = i.replace(f, ""),
                    x = ["X", "Y", "Z"].indexOf(h),
                    p = f === "scale" ? 1 : 0,
                    b = [x === 0 ? a : p, x === 1 ? a : p, x === 2 ? a : p];
                  n = n[f](...b);
                }
              else throw TypeError(r);
            }),
          n
        );
      },
      gt = (e, t) =>
        t
          ? [e.a, e.b, e.c, e.d, e.e, e.f]
          : [
              e.m11,
              e.m12,
              e.m13,
              e.m14,
              e.m21,
              e.m22,
              e.m23,
              e.m24,
              e.m31,
              e.m32,
              e.m33,
              e.m34,
              e.m41,
              e.m42,
              e.m43,
              e.m44,
            ],
      Ot = (e, t, n) => {
        const r = new v();
        return (r.m41 = e), (r.e = e), (r.m42 = t), (r.f = t), (r.m43 = n), r;
      },
      Et = (e, t, n) => {
        const r = new v(),
          s = Math.PI / 180,
          i = e * s,
          o = t * s,
          l = n * s,
          a = Math.cos(i),
          c = -Math.sin(i),
          m = Math.cos(o),
          u = -Math.sin(o),
          y = Math.cos(l),
          g = -Math.sin(l),
          f = m * y,
          h = -m * g;
        (r.m11 = f), (r.a = f), (r.m12 = h), (r.b = h), (r.m13 = u);
        const x = c * u * y + a * g;
        (r.m21 = x), (r.c = x);
        const p = a * y - c * u * g;
        return (
          (r.m22 = p),
          (r.d = p),
          (r.m23 = -c * m),
          (r.m31 = c * g - a * u * y),
          (r.m32 = c * y + a * u * g),
          (r.m33 = a * m),
          r
        );
      },
      jt = (e, t, n, r) => {
        const s = new v(),
          i = Math.sqrt(e * e + t * t + n * n);
        if (i === 0) return s;
        const o = e / i,
          l = t / i,
          a = n / i,
          c = r * (Math.PI / 360),
          m = Math.sin(c),
          u = Math.cos(c),
          y = m * m,
          g = o * o,
          f = l * l,
          h = a * a,
          x = 1 - 2 * (f + h) * y;
        (s.m11 = x), (s.a = x);
        const p = 2 * (o * l * y + a * m * u);
        (s.m12 = p), (s.b = p), (s.m13 = 2 * (o * a * y - l * m * u));
        const b = 2 * (l * o * y - a * m * u);
        (s.m21 = b), (s.c = b);
        const A = 1 - 2 * (h + g) * y;
        return (
          (s.m22 = A),
          (s.d = A),
          (s.m23 = 2 * (l * a * y + o * m * u)),
          (s.m31 = 2 * (a * o * y + l * m * u)),
          (s.m32 = 2 * (a * l * y - o * m * u)),
          (s.m33 = 1 - 2 * (g + f) * y),
          s
        );
      },
      zt = (e, t, n) => {
        const r = new v();
        return (r.m11 = e), (r.a = e), (r.m22 = t), (r.d = t), (r.m33 = n), r;
      },
      et = (e, t) => {
        const n = new v();
        if (e) {
          const r = (e * Math.PI) / 180,
            s = Math.tan(r);
          (n.m21 = s), (n.c = s);
        }
        if (t) {
          const r = (t * Math.PI) / 180,
            s = Math.tan(r);
          (n.m12 = s), (n.b = s);
        }
        return n;
      },
      It = (e) => et(e, 0),
      Dt = (e) => et(0, e),
      O = (e, t) => {
        const n = t.m11 * e.m11 + t.m12 * e.m21 + t.m13 * e.m31 + t.m14 * e.m41,
          r = t.m11 * e.m12 + t.m12 * e.m22 + t.m13 * e.m32 + t.m14 * e.m42,
          s = t.m11 * e.m13 + t.m12 * e.m23 + t.m13 * e.m33 + t.m14 * e.m43,
          i = t.m11 * e.m14 + t.m12 * e.m24 + t.m13 * e.m34 + t.m14 * e.m44,
          o = t.m21 * e.m11 + t.m22 * e.m21 + t.m23 * e.m31 + t.m24 * e.m41,
          l = t.m21 * e.m12 + t.m22 * e.m22 + t.m23 * e.m32 + t.m24 * e.m42,
          a = t.m21 * e.m13 + t.m22 * e.m23 + t.m23 * e.m33 + t.m24 * e.m43,
          c = t.m21 * e.m14 + t.m22 * e.m24 + t.m23 * e.m34 + t.m24 * e.m44,
          m = t.m31 * e.m11 + t.m32 * e.m21 + t.m33 * e.m31 + t.m34 * e.m41,
          u = t.m31 * e.m12 + t.m32 * e.m22 + t.m33 * e.m32 + t.m34 * e.m42,
          y = t.m31 * e.m13 + t.m32 * e.m23 + t.m33 * e.m33 + t.m34 * e.m43,
          g = t.m31 * e.m14 + t.m32 * e.m24 + t.m33 * e.m34 + t.m34 * e.m44,
          f = t.m41 * e.m11 + t.m42 * e.m21 + t.m43 * e.m31 + t.m44 * e.m41,
          h = t.m41 * e.m12 + t.m42 * e.m22 + t.m43 * e.m32 + t.m44 * e.m42,
          x = t.m41 * e.m13 + t.m42 * e.m23 + t.m43 * e.m33 + t.m44 * e.m43,
          p = t.m41 * e.m14 + t.m42 * e.m24 + t.m43 * e.m34 + t.m44 * e.m44;
        return U([n, r, s, i, o, l, a, c, m, u, y, g, f, h, x, p]);
      };
    class v {
      constructor(t) {
        return (
          (this.a = 1),
          (this.b = 0),
          (this.c = 0),
          (this.d = 1),
          (this.e = 0),
          (this.f = 0),
          (this.m11 = 1),
          (this.m12 = 0),
          (this.m13 = 0),
          (this.m14 = 0),
          (this.m21 = 0),
          (this.m22 = 1),
          (this.m23 = 0),
          (this.m24 = 0),
          (this.m31 = 0),
          (this.m32 = 0),
          (this.m33 = 1),
          (this.m34 = 0),
          (this.m41 = 0),
          (this.m42 = 0),
          (this.m43 = 0),
          (this.m44 = 1),
          t ? this.setMatrixValue(t) : this
        );
      }
      get isIdentity() {
        return (
          this.m11 === 1 &&
          this.m12 === 0 &&
          this.m13 === 0 &&
          this.m14 === 0 &&
          this.m21 === 0 &&
          this.m22 === 1 &&
          this.m23 === 0 &&
          this.m24 === 0 &&
          this.m31 === 0 &&
          this.m32 === 0 &&
          this.m33 === 1 &&
          this.m34 === 0 &&
          this.m41 === 0 &&
          this.m42 === 0 &&
          this.m43 === 0 &&
          this.m44 === 1
        );
      }
      get is2D() {
        return (
          this.m31 === 0 &&
          this.m32 === 0 &&
          this.m33 === 1 &&
          this.m34 === 0 &&
          this.m43 === 0 &&
          this.m44 === 1
        );
      }
      setMatrixValue(t) {
        return typeof t == "string" && t.length && t !== "none"
          ? qt(t)
          : Array.isArray(t) ||
            t instanceof Float64Array ||
            t instanceof Float32Array
          ? U(t)
          : typeof t == "object"
          ? $t(t)
          : this;
      }
      toFloat32Array(t) {
        return Float32Array.from(gt(this, t));
      }
      toFloat64Array(t) {
        return Float64Array.from(gt(this, t));
      }
      toString() {
        const { is2D: t } = this,
          n = this.toFloat64Array(t).join(", ");
        return `${t ? "matrix" : "matrix3d"}(${n})`;
      }
      toJSON() {
        const { is2D: t, isIdentity: n } = this;
        return { ...this, is2D: t, isIdentity: n };
      }
      multiply(t) {
        return O(this, t);
      }
      translate(t, n, r) {
        const s = t;
        let i = n,
          o = r;
        return (
          typeof i > "u" && (i = 0),
          typeof o > "u" && (o = 0),
          O(this, Ot(s, i, o))
        );
      }
      scale(t, n, r) {
        const s = t;
        let i = n,
          o = r;
        return (
          typeof i > "u" && (i = t),
          typeof o > "u" && (o = 1),
          O(this, zt(s, i, o))
        );
      }
      rotate(t, n, r) {
        let s = t,
          i = n || 0,
          o = r || 0;
        return (
          typeof t == "number" &&
            typeof n > "u" &&
            typeof r > "u" &&
            ((o = s), (s = 0), (i = 0)),
          O(this, Et(s, i, o))
        );
      }
      rotateAxisAngle(t, n, r, s) {
        if ([t, n, r, s].some((i) => Number.isNaN(+i)))
          throw new TypeError("CSSMatrix: expecting 4 values");
        return O(this, jt(t, n, r, s));
      }
      skewX(t) {
        return O(this, It(t));
      }
      skewY(t) {
        return O(this, Dt(t));
      }
      skew(t, n) {
        return O(this, et(t, n));
      }
      transformPoint(t) {
        const n =
            this.m11 * t.x + this.m21 * t.y + this.m31 * t.z + this.m41 * t.w,
          r = this.m12 * t.x + this.m22 * t.y + this.m32 * t.z + this.m42 * t.w,
          s = this.m13 * t.x + this.m23 * t.y + this.m33 * t.z + this.m43 * t.w,
          i = this.m14 * t.x + this.m24 * t.y + this.m34 * t.z + this.m44 * t.w;
        return t instanceof DOMPoint
          ? new DOMPoint(n, r, s, i)
          : { x: n, y: r, z: s, w: i };
      }
    }
    T(v, "Translate", Ot),
      T(v, "Rotate", Et),
      T(v, "RotateAxisAngle", jt),
      T(v, "Scale", zt),
      T(v, "SkewX", It),
      T(v, "SkewY", Dt),
      T(v, "Skew", et),
      T(v, "Multiply", O),
      T(v, "fromArray", U),
      T(v, "fromMatrix", $t),
      T(v, "fromString", qt),
      T(v, "toArray", gt),
      T(v, "isCompatibleArray", St),
      T(v, "isCompatibleObject", kt);
    const xt = (e) => J(e) && e.every(([t]) => t === t.toUpperCase()),
      Q = (e) => {
        if (xt(e)) return [...e];
        const t = F(e);
        let n = 0,
          r = 0,
          s = 0,
          i = 0;
        return t.map((o) => {
          const l = o.slice(1).map(Number),
            [a] = o,
            c = a.toUpperCase();
          if (a === "M") return ([n, r] = l), (s = n), (i = r), ["M", n, r];
          let m = [];
          if (a !== c)
            if (c === "A")
              m = [c, l[0], l[1], l[2], l[3], l[4], l[5] + n, l[6] + r];
            else if (c === "V") m = [c, l[0] + r];
            else if (c === "H") m = [c, l[0] + n];
            else {
              const u = l.map((y, g) => y + (g % 2 ? r : n));
              m = [c, ...u];
            }
          else m = [c, ...l];
          return (
            c === "Z"
              ? ((n = s), (r = i))
              : c === "H"
              ? ([, n] = m)
              : c === "V"
              ? ([, r] = m)
              : (([n, r] = m.slice(-2)), c === "M" && ((s = n), (i = r))),
            m
          );
        });
      },
      he = (e, t) => {
        const [n] = e,
          { x1: r, y1: s, x2: i, y2: o } = t,
          l = e.slice(1).map(Number);
        let a = e;
        if (("TQ".includes(n) || ((t.qx = null), (t.qy = null)), n === "H"))
          a = ["L", e[1], s];
        else if (n === "V") a = ["L", r, e[1]];
        else if (n === "S") {
          const c = r * 2 - i,
            m = s * 2 - o;
          (t.x1 = c), (t.y1 = m), (a = ["C", c, m, ...l]);
        } else if (n === "T") {
          const c = r * 2 - (t.qx ? t.qx : 0),
            m = s * 2 - (t.qy ? t.qy : 0);
          (t.qx = c), (t.qy = m), (a = ["Q", c, m, ...l]);
        } else if (n === "Q") {
          const [c, m] = l;
          (t.qx = c), (t.qy = m);
        }
        return a;
      },
      pt = (e) => xt(e) && e.every(([t]) => "ACLMQZ".includes(t)),
      nt = { x1: 0, y1: 0, x2: 0, y2: 0, x: 0, y: 0, qx: null, qy: null },
      I = (e) => {
        if (pt(e)) return [...e];
        const t = Q(e),
          n = { ...nt },
          r = t.length;
        for (let s = 0; s < r; s += 1) {
          t[s], (t[s] = he(t[s], n));
          const i = t[s],
            o = i.length;
          (n.x1 = +i[o - 2]),
            (n.y1 = +i[o - 1]),
            (n.x2 = +i[o - 4] || n.x1),
            (n.y2 = +i[o - 3] || n.y1);
        }
        return t;
      },
      E = (e, t, n) => {
        const [r, s] = e,
          [i, o] = t;
        return [r + (i - r) * n, s + (o - s) * n];
      },
      bt = (e, t, n, r, s) => {
        const i = V([e, t], [n, r]);
        let o = { x: 0, y: 0 };
        if (typeof s == "number")
          if (s <= 0) o = { x: e, y: t };
          else if (s >= i) o = { x: n, y: r };
          else {
            const [l, a] = E([e, t], [n, r], s / i);
            o = { x: l, y: a };
          }
        return {
          length: i,
          point: o,
          min: { x: Math.min(e, n), y: Math.min(t, r) },
          max: { x: Math.max(e, n), y: Math.max(t, r) },
        };
      },
      Zt = (e, t) => {
        const { x: n, y: r } = e,
          { x: s, y: i } = t,
          o = n * s + r * i,
          l = Math.sqrt((n ** 2 + r ** 2) * (s ** 2 + i ** 2));
        return (n * i - r * s < 0 ? -1 : 1) * Math.acos(o / l);
      },
      ue = (e, t, n, r, s, i, o, l, a, c) => {
        const { abs: m, sin: u, cos: y, sqrt: g, PI: f } = Math;
        let h = m(n),
          x = m(r);
        const b = (((s % 360) + 360) % 360) * (f / 180);
        if (e === l && t === a) return { x: e, y: t };
        if (h === 0 || x === 0) return bt(e, t, l, a, c).point;
        const A = (e - l) / 2,
          d = (t - a) / 2,
          M = { x: y(b) * A + u(b) * d, y: -u(b) * A + y(b) * d },
          L = M.x ** 2 / h ** 2 + M.y ** 2 / x ** 2;
        L > 1 && ((h *= g(L)), (x *= g(L)));
        const D = h ** 2 * x ** 2 - h ** 2 * M.y ** 2 - x ** 2 * M.x ** 2,
          _ = h ** 2 * M.y ** 2 + x ** 2 * M.x ** 2;
        let Y = D / _;
        Y = Y < 0 ? 0 : Y;
        const ht = (i !== o ? 1 : -1) * g(Y),
          q = { x: ht * ((h * M.y) / x), y: ht * (-(x * M.x) / h) },
          ut = {
            x: y(b) * q.x - u(b) * q.y + (e + l) / 2,
            y: u(b) * q.x + y(b) * q.y + (t + a) / 2,
          },
          W = { x: (M.x - q.x) / h, y: (M.y - q.y) / x },
          ft = Zt({ x: 1, y: 0 }, W),
          yt = { x: (-M.x - q.x) / h, y: (-M.y - q.y) / x };
        let j = Zt(W, yt);
        !o && j > 0 ? (j -= 2 * f) : o && j < 0 && (j += 2 * f), (j %= 2 * f);
        const z = ft + j * c,
          G = h * y(z),
          tt = x * u(z);
        return { x: y(b) * G - u(b) * tt + ut.x, y: u(b) * G + y(b) * tt + ut.y };
      },
      fe = (e, t, n, r, s, i, o, l, a, c) => {
        const m = typeof c == "number";
        let u = e,
          y = t,
          g = 0,
          f = [u, y, g],
          h = [u, y],
          x = 0,
          p = { x: 0, y: 0 },
          b = [{ x: u, y }];
        m && c <= 0 && (p = { x: u, y });
        const A = 300;
        for (let d = 0; d <= A; d += 1) {
          if (
            ((x = d / A),
            ({ x: u, y } = ue(e, t, n, r, s, i, o, l, a, x)),
            (b = [...b, { x: u, y }]),
            (g += V(h, [u, y])),
            (h = [u, y]),
            m && g > c && c > f[2])
          ) {
            const M = (g - c) / (g - f[2]);
            p = { x: h[0] * (1 - M) + f[0] * M, y: h[1] * (1 - M) + f[1] * M };
          }
          f = [u, y, g];
        }
        return (
          m && c >= g && (p = { x: l, y: a }),
          {
            length: g,
            point: p,
            min: {
              x: Math.min(...b.map((d) => d.x)),
              y: Math.min(...b.map((d) => d.y)),
            },
            max: {
              x: Math.max(...b.map((d) => d.x)),
              y: Math.max(...b.map((d) => d.y)),
            },
          }
        );
      },
      ye = (e, t, n, r, s, i, o, l, a) => {
        const c = 1 - a;
        return {
          x: c ** 3 * e + 3 * c ** 2 * a * n + 3 * c * a ** 2 * s + a ** 3 * o,
          y: c ** 3 * t + 3 * c ** 2 * a * r + 3 * c * a ** 2 * i + a ** 3 * l,
        };
      },
      ge = (e, t, n, r, s, i, o, l, a) => {
        const c = typeof a == "number";
        let m = e,
          u = t,
          y = 0,
          g = [m, u, y],
          f = [m, u],
          h = 0,
          x = { x: 0, y: 0 },
          p = [{ x: m, y: u }];
        c && a <= 0 && (x = { x: m, y: u });
        const b = 300;
        for (let A = 0; A <= b; A += 1) {
          if (
            ((h = A / b),
            ({ x: m, y: u } = ye(e, t, n, r, s, i, o, l, h)),
            (p = [...p, { x: m, y: u }]),
            (y += V(f, [m, u])),
            (f = [m, u]),
            c && y > a && a > g[2])
          ) {
            const d = (y - a) / (y - g[2]);
            x = { x: f[0] * (1 - d) + g[0] * d, y: f[1] * (1 - d) + g[1] * d };
          }
          g = [m, u, y];
        }
        return (
          c && a >= y && (x = { x: o, y: l }),
          {
            length: y,
            point: x,
            min: {
              x: Math.min(...p.map((A) => A.x)),
              y: Math.min(...p.map((A) => A.y)),
            },
            max: {
              x: Math.max(...p.map((A) => A.x)),
              y: Math.max(...p.map((A) => A.y)),
            },
          }
        );
      },
      xe = (e, t, n, r, s, i, o) => {
        const l = 1 - o;
        return {
          x: l ** 2 * e + 2 * l * o * n + o ** 2 * s,
          y: l ** 2 * t + 2 * l * o * r + o ** 2 * i,
        };
      },
      pe = (e, t, n, r, s, i, o) => {
        const l = typeof o == "number";
        let a = e,
          c = t,
          m = 0,
          u = [a, c, m],
          y = [a, c],
          g = 0,
          f = { x: 0, y: 0 },
          h = [{ x: a, y: c }];
        l && o <= 0 && (f = { x: a, y: c });
        const x = 300;
        for (let p = 0; p <= x; p += 1) {
          if (
            ((g = p / x),
            ({ x: a, y: c } = xe(e, t, n, r, s, i, g)),
            (h = [...h, { x: a, y: c }]),
            (m += V(y, [a, c])),
            (y = [a, c]),
            l && m > o && o > u[2])
          ) {
            const b = (m - o) / (m - u[2]);
            f = { x: y[0] * (1 - b) + u[0] * b, y: y[1] * (1 - b) + u[1] * b };
          }
          u = [a, c, m];
        }
        return (
          l && o >= m && (f = { x: s, y: i }),
          {
            length: m,
            point: f,
            min: {
              x: Math.min(...h.map((p) => p.x)),
              y: Math.min(...h.map((p) => p.y)),
            },
            max: {
              x: Math.max(...h.map((p) => p.x)),
              y: Math.max(...h.map((p) => p.y)),
            },
          }
        );
      },
      st = (e, t) => {
        const n = I(e),
          r = typeof t == "number";
        let s,
          i = [],
          o,
          l = 0,
          a = 0,
          c = 0,
          m = 0,
          u,
          y = [],
          g = [],
          f = 0,
          h = { x: 0, y: 0 },
          x = h,
          p = h,
          b = h,
          A = 0;
        for (let d = 0, M = n.length; d < M; d += 1)
          (u = n[d]),
            ([o] = u),
            (s = o === "M"),
            (i = s ? i : [l, a, ...u.slice(1)]),
            s
              ? (([, c, m] = u),
                (h = { x: c, y: m }),
                (x = h),
                (f = 0),
                r && t < 0.001 && (b = h))
              : o === "L"
              ? ({ length: f, min: h, max: x, point: p } = bt(...i, (t || 0) - A))
              : o === "A"
              ? ({ length: f, min: h, max: x, point: p } = fe(...i, (t || 0) - A))
              : o === "C"
              ? ({ length: f, min: h, max: x, point: p } = ge(...i, (t || 0) - A))
              : o === "Q"
              ? ({ length: f, min: h, max: x, point: p } = pe(...i, (t || 0) - A))
              : o === "Z" &&
                ((i = [l, a, c, m]),
                ({
                  length: f,
                  min: h,
                  max: x,
                  point: p,
                } = bt(...i, (t || 0) - A))),
            r && A < t && A + f >= t && (b = p),
            (g = [...g, x]),
            (y = [...y, h]),
            (A += f),
            ([l, a] = o !== "Z" ? u.slice(-2) : [c, m]);
        return (
          r && t >= A && (b = { x: l, y: a }),
          {
            length: A,
            point: b,
            min: {
              x: Math.min(...y.map((d) => d.x)),
              y: Math.min(...y.map((d) => d.y)),
            },
            max: {
              x: Math.max(...g.map((d) => d.x)),
              y: Math.max(...g.map((d) => d.y)),
            },
          }
        );
      },
      Ft = (e) => {
        if (!e)
          return {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            x2: 0,
            y2: 0,
            cx: 0,
            cy: 0,
            cz: 0,
          };
        const {
            min: { x: t, y: n },
            max: { x: r, y: s },
          } = st(e),
          i = r - t,
          o = s - n;
        return {
          width: i,
          height: o,
          x: t,
          y: n,
          x2: r,
          y2: s,
          cx: t + i / 2,
          cy: n + o / 2,
          cz: Math.max(i, o) + Math.min(i, o) / 2,
        };
      },
      dt = (e, t, n) => {
        if (e[n].length > 7) {
          e[n].shift();
          const r = e[n];
          let s = n;
          for (; r.length; )
            (t[n] = "A"), e.splice((s += 1), 0, ["C", ...r.splice(0, 6)]);
          e.splice(n, 1);
        }
      },
      Rt = (e) => pt(e) && e.every(([t]) => "MC".includes(t)),
      rt = (e, t, n) => {
        const r = e * Math.cos(n) - t * Math.sin(n),
          s = e * Math.sin(n) + t * Math.cos(n);
        return { x: r, y: s };
      },
      Xt = (e, t, n, r, s, i, o, l, a, c) => {
        let m = e,
          u = t,
          y = n,
          g = r,
          f = l,
          h = a;
        const x = (Math.PI * 120) / 180,
          p = (Math.PI / 180) * (+s || 0);
        let b = [],
          A,
          d,
          M,
          L,
          D;
        if (c) [d, M, L, D] = c;
        else {
          (A = rt(m, u, -p)),
            (m = A.x),
            (u = A.y),
            (A = rt(f, h, -p)),
            (f = A.x),
            (h = A.y);
          const C = (m - f) / 2,
            k = (u - h) / 2;
          let R = (C * C) / (y * y) + (k * k) / (g * g);
          R > 1 && ((R = Math.sqrt(R)), (y *= R), (g *= R));
          const vt = y * y,
            Pt = g * g,
            Gt =
              (i === o ? -1 : 1) *
              Math.sqrt(
                Math.abs(
                  (vt * Pt - vt * k * k - Pt * C * C) / (vt * k * k + Pt * C * C)
                )
              );
          (L = (Gt * y * k) / g + (m + f) / 2),
            (D = (Gt * -g * C) / y + (u + h) / 2),
            (d = Math.asin(((((u - D) / g) * 10 ** 9) >> 0) / 10 ** 9)),
            (M = Math.asin(((((h - D) / g) * 10 ** 9) >> 0) / 10 ** 9)),
            (d = m < L ? Math.PI - d : d),
            (M = f < L ? Math.PI - M : M),
            d < 0 && (d = Math.PI * 2 + d),
            M < 0 && (M = Math.PI * 2 + M),
            o && d > M && (d -= Math.PI * 2),
            !o && M > d && (M -= Math.PI * 2);
        }
        let _ = M - d;
        if (Math.abs(_) > x) {
          const C = M,
            k = f,
            R = h;
          (M = d + x * (o && M > d ? 1 : -1)),
            (f = L + y * Math.cos(M)),
            (h = D + g * Math.sin(M)),
            (b = Xt(f, h, y, g, s, 0, o, k, R, [M, C, L, D]));
        }
        _ = M - d;
        const Y = Math.cos(d),
          ht = Math.sin(d),
          q = Math.cos(M),
          ut = Math.sin(M),
          W = Math.tan(_ / 4),
          ft = (4 / 3) * y * W,
          yt = (4 / 3) * g * W,
          j = [m, u],
          z = [m + ft * ht, u - yt * Y],
          G = [f + ft * ut, h - yt * q],
          tt = [f, h];
        if (((z[0] = 2 * j[0] - z[0]), (z[1] = 2 * j[1] - z[1]), c))
          return [...z, ...G, ...tt, ...b];
        b = [...z, ...G, ...tt, ...b];
        const wt = [];
        for (let C = 0, k = b.length; C < k; C += 1)
          wt[C] = C % 2 ? rt(b[C - 1], b[C], p).y : rt(b[C], b[C + 1], p).x;
        return wt;
      },
      be = (e, t, n, r, s, i) => {
        const o = 0.3333333333333333,
          l = 2 / 3;
        return [o * e + l * n, o * t + l * r, o * s + l * n, o * i + l * r, s, i];
      },
      Qt = (e, t, n, r) => {
        const s = E([e, t], [n, r], 0.3333333333333333),
          i = E([e, t], [n, r], 2 / 3);
        return [...s, ...i, n, r];
      },
      it = (e, t) => {
        const [n] = e,
          r = e.slice(1).map(Number),
          [s, i] = r;
        let o;
        const { x1: l, y1: a, x: c, y: m } = t;
        return (
          "TQ".includes(n) || ((t.qx = null), (t.qy = null)),
          n === "M"
            ? ((t.x = s), (t.y = i), e)
            : n === "A"
            ? ((o = [l, a, ...r]), ["C", ...Xt(...o)])
            : n === "Q"
            ? ((t.qx = s), (t.qy = i), (o = [l, a, ...r]), ["C", ...be(...o)])
            : n === "L"
            ? ["C", ...Qt(l, a, s, i)]
            : n === "Z"
            ? ["C", ...Qt(l, a, c, m)]
            : e
        );
      },
      ot = (e) => {
        if (Rt(e)) return [...e];
        const t = I(e),
          n = { ...nt },
          r = [];
        let s = "",
          i = t.length;
        for (let o = 0; o < i; o += 1) {
          ([s] = t[o]),
            (r[o] = s),
            (t[o] = it(t[o], n)),
            dt(t, r, o),
            (i = t.length);
          const l = t[o],
            a = l.length;
          (n.x1 = +l[a - 2]),
            (n.y1 = +l[a - 1]),
            (n.x2 = +l[a - 4] || n.x1),
            (n.y2 = +l[a - 3] || n.y1);
        }
        return t;
      },
      de = (e, t, n, r, s, i, o, l) =>
        (3 *
          ((l - t) * (n + s) -
            (o - e) * (r + i) +
            r * (e - s) -
            n * (t - i) +
            l * (s + e / 3) -
            o * (i + t / 3))) /
        20,
      Ht = (e) => {
        let t = 0,
          n = 0,
          r = 0;
        return ot(e)
          .map((s) => {
            switch (s[0]) {
              case "M":
                return ([, t, n] = s), 0;
              default:
                return (r = de(t, n, ...s.slice(1))), ([t, n] = s.slice(-2)), r;
            }
          })
          .reduce((s, i) => s + i, 0);
      },
      H = (e) => st(e).length,
      Me = (e) => Ht(ot(e)) >= 0,
      K = (e, t) => st(e, t).point,
      Mt = (e, t) => {
        const n = F(e);
        let r = [...n],
          s = H(r),
          i = r.length - 1,
          o = 0,
          l = 0,
          a = n[0];
        const [c, m] = a.slice(-2),
          u = { x: c, y: m };
        if (i <= 0 || !t || !Number.isFinite(t))
          return {
            segment: a,
            index: 0,
            length: l,
            point: u,
            lengthAtSegment: o,
          };
        if (t >= s)
          return (
            (r = n.slice(0, -1)),
            (o = H(r)),
            (l = s - o),
            { segment: n[i], index: i, length: l, lengthAtSegment: o }
          );
        const y = [];
        for (; i > 0; )
          (a = r[i]),
            (r = r.slice(0, -1)),
            (o = H(r)),
            (l = s - o),
            (s = o),
            y.push({ segment: a, index: i, length: l, lengthAtSegment: o }),
            (i -= 1);
        return y.find(({ lengthAtSegment: g }) => g <= t);
      },
      ct = (e, t) => {
        const n = F(e),
          r = I(n),
          s = H(n),
          i = (d) => {
            const M = d.x - t.x,
              L = d.y - t.y;
            return M * M + L * L;
          };
        let o = 8,
          l,
          a = { x: 0, y: 0 },
          c = 0,
          m = 0,
          u = 1 / 0;
        for (let d = 0; d <= s; d += o)
          (l = K(r, d)), (c = i(l)), c < u && ((a = l), (m = d), (u = c));
        o /= 2;
        let y,
          g,
          f = 0,
          h = 0,
          x = 0,
          p = 0;
        for (; o > 0.5; )
          (f = m - o),
            (y = K(r, f)),
            (x = i(y)),
            (h = m + o),
            (g = K(r, h)),
            (p = i(g)),
            f >= 0 && x < u
              ? ((a = y), (m = f), (u = x))
              : h <= s && p < u
              ? ((a = g), (m = h), (u = p))
              : (o /= 2);
        const b = Mt(n, m),
          A = Math.sqrt(u);
        return { closest: a, distance: A, segment: b };
      },
      Ae = (e, t) => ct(e, t).closest,
      Ne = (e, t) => ct(e, t).segment,
      we = (e, t) => Mt(e, t).segment,
      ve = (e, t) => {
        const { distance: n } = ct(e, t);
        return Math.abs(n) < 0.001;
      },
      Yt = (e) => {
        if (typeof e != "string" || !e.length) return !1;
        const t = new Lt(e);
        for (B(t); t.index < t.max && !t.err.length; ) Tt(t);
        return !t.err.length && "mM".includes(t.segments[0][0]);
      },
      Bt = (e) => J(e) && e.slice(1).every(([t]) => t === t.toLowerCase()),
      at = {
        line: ["x1", "y1", "x2", "y2"],
        circle: ["cx", "cy", "r"],
        ellipse: ["cx", "cy", "rx", "ry"],
        rect: ["width", "height", "x", "y", "rx", "ry"],
        polygon: ["points"],
        polyline: ["points"],
        glyph: ["d"],
      },
      Pe = (e) => {
        let { x1: t, y1: n, x2: r, y2: s } = e;
        return (
          ([t, n, r, s] = [t, n, r, s].map((i) => +i)),
          [
            ["M", t, n],
            ["L", r, s],
          ]
        );
      },
      Ce = (e) => {
        const t = [],
          n = (e.points || "")
            .trim()
            .split(/[\s|,]/)
            .map((s) => +s);
        let r = 0;
        for (; r < n.length; ) t.push([r ? "L" : "M", n[r], n[r + 1]]), (r += 2);
        return e.type === "polygon" ? [...t, ["z"]] : t;
      },
      Te = (e) => {
        let { cx: t, cy: n, r } = e;
        return (
          ([t, n, r] = [t, n, r].map((s) => +s)),
          [
            ["M", t - r, n],
            ["a", r, r, 0, 1, 0, 2 * r, 0],
            ["a", r, r, 0, 1, 0, -2 * r, 0],
          ]
        );
      },
      Le = (e) => {
        let { cx: t, cy: n } = e,
          r = e.rx || 0,
          s = e.ry || r;
        return (
          ([t, n, r, s] = [t, n, r, s].map((i) => +i)),
          [
            ["M", t - r, n],
            ["a", r, s, 0, 1, 0, 2 * r, 0],
            ["a", r, s, 0, 1, 0, -2 * r, 0],
          ]
        );
      },
      Se = (e) => {
        const t = +e.x || 0,
          n = +e.y || 0,
          r = +e.width,
          s = +e.height;
        let i = +(e.rx || 0),
          o = +(e.ry || i);
        return i || o
          ? (i * 2 > r && (i -= (i * 2 - r) / 2),
            o * 2 > s && (o -= (o * 2 - s) / 2),
            [
              ["M", t + i, n],
              ["h", r - i * 2],
              ["s", i, 0, i, o],
              ["v", s - o * 2],
              ["s", 0, o, -i, o],
              ["h", -r + i * 2],
              ["s", -i, 0, -i, -o],
              ["v", -s + o * 2],
              ["s", 0, -o, i, -o],
            ])
          : [["M", t, n], ["h", r], ["v", s], ["H", t], ["Z"]];
      },
      Jt = (e, t) => {
        const r = (t || document).defaultView || window,
          s = Object.keys(at),
          i = e instanceof r.SVGElement,
          o = i ? e.tagName : null;
        if (o && [...s, "path"].every((u) => o !== u))
          throw TypeError(`${P}: "${o}" is not SVGElement`);
        const l = i ? o : e.type,
          a = at[l],
          c = { type: l };
        i
          ? a.forEach((u) => {
              c[u] = e.getAttribute(u);
            })
          : Object.assign(c, e);
        let m = [];
        return (
          l === "circle"
            ? (m = Te(c))
            : l === "ellipse"
            ? (m = Le(c))
            : ["polyline", "polygon"].includes(l)
            ? (m = Ce(c))
            : l === "rect"
            ? (m = Se(c))
            : l === "line"
            ? (m = Pe(c))
            : ["glyph", "path"].includes(l) &&
              (m = F(i ? e.getAttribute("d") || "" : e.d || "")),
          J(m) && m.length ? m : !1
        );
      },
      lt = (e, t) => {
        let { round: n } = $;
        if (t === "off" || n === "off") return [...e];
        n = typeof t == "number" && t >= 0 ? t : n;
        const r = typeof n == "number" && n >= 1 ? 10 ** n : 1;
        return e.map((s) => {
          const i = s
            .slice(1)
            .map(Number)
            .map((o) => (n ? Math.round(o * r) / r : Math.round(o)));
          return [s[0], ...i];
        });
      },
      At = (e, t) =>
        lt(e, t)
          .map((n) => n[0] + n.slice(1).join(" "))
          .join(""),
      ke = (e, t, n) => {
        const r = n || document,
          s = r.defaultView || window,
          i = Object.keys(at),
          o = e instanceof s.SVGElement,
          l = o ? e.tagName : null;
        if (l === "path")
          throw TypeError(`${P}: "${l}" is already SVGPathElement`);
        if (l && i.every((h) => l !== h))
          throw TypeError(`${P}: "${l}" is not SVGElement`);
        const a = r.createElementNS("http://www.w3.org/2000/svg", "path"),
          c = o ? l : e.type,
          m = at[c],
          u = { type: c },
          y = $.round,
          g = Jt(e, r),
          f = g && g.length ? At(g, y) : "";
        return (
          o
            ? (m.forEach((h) => {
                u[h] = e.getAttribute(h);
              }),
              Object.values(e.attributes).forEach(({ name: h, value: x }) => {
                m.includes(h) || a.setAttribute(h, x);
              }))
            : (Object.assign(u, e),
              Object.keys(u).forEach((h) => {
                !m.includes(h) &&
                  h !== "type" &&
                  a.setAttribute(
                    h.replace(/[A-Z]/g, (x) => `-${x.toLowerCase()}`),
                    u[h]
                  );
              })),
          Yt(f)
            ? (a.setAttribute("d", f), t && o && (e.before(a, e), e.remove()), a)
            : !1
        );
      },
      Vt = (e) => {
        const t = [];
        let n,
          r = -1;
        return (
          e.forEach((s) => {
            s[0] === "M" ? ((n = [s]), (r += 1)) : (n = [...n, s]), (t[r] = n);
          }),
          t
        );
      },
      Ut = (e) => {
        let t = new v();
        const { origin: n } = e,
          [r, s] = n,
          { translate: i } = e,
          { rotate: o } = e,
          { skew: l } = e,
          { scale: a } = e;
        return (
          Array.isArray(i) &&
          i.length >= 2 &&
          i.every((c) => !Number.isNaN(+c)) &&
          i.some((c) => c !== 0)
            ? (t = t.translate(...i))
            : typeof i == "number" && !Number.isNaN(i) && (t = t.translate(i)),
          (o || l || a) &&
            ((t = t.translate(r, s)),
            Array.isArray(o) &&
            o.length >= 2 &&
            o.every((c) => !Number.isNaN(+c)) &&
            o.some((c) => c !== 0)
              ? (t = t.rotate(...o))
              : typeof o == "number" && !Number.isNaN(o) && (t = t.rotate(o)),
            Array.isArray(l) &&
            l.length === 2 &&
            l.every((c) => !Number.isNaN(+c)) &&
            l.some((c) => c !== 0)
              ? ((t = l[0] ? t.skewX(l[0]) : t), (t = l[1] ? t.skewY(l[1]) : t))
              : typeof l == "number" && !Number.isNaN(l) && (t = t.skewX(l)),
            Array.isArray(a) &&
            a.length >= 2 &&
            a.every((c) => !Number.isNaN(+c)) &&
            a.some((c) => c !== 1)
              ? (t = t.scale(...a))
              : typeof a == "number" && !Number.isNaN(a) && (t = t.scale(a)),
            (t = t.translate(-r, -s))),
          t
        );
      },
      Nt = (e) => {
        if (Bt(e)) return [...e];
        const t = F(e);
        let n = 0,
          r = 0,
          s = 0,
          i = 0;
        return t.map((o) => {
          const l = o.slice(1).map(Number),
            [a] = o,
            c = a.toLowerCase();
          if (a === "M") return ([n, r] = l), (s = n), (i = r), ["M", n, r];
          let m = [];
          if (a !== c)
            if (c === "a")
              m = [c, l[0], l[1], l[2], l[3], l[4], l[5] - n, l[6] - r];
            else if (c === "v") m = [c, l[0] - r];
            else if (c === "h") m = [c, l[0] - n];
            else {
              const y = l.map((g, f) => g - (f % 2 ? r : n));
              m = [c, ...y];
            }
          else a === "m" && ((s = l[0] + n), (i = l[1] + r)), (m = [c, ...l]);
          const u = m.length;
          return (
            c === "z"
              ? ((n = s), (r = i))
              : c === "h"
              ? (n += m[1])
              : c === "v"
              ? (r += m[1])
              : ((n += m[u - 2]), (r += m[u - 1])),
            m
          );
        });
      },
      $e = (e, t, n, r) => {
        const [s] = e,
          i = (p) => Math.round(p * 10 ** 4) / 10 ** 4,
          o = e.slice(1).map((p) => +p),
          l = t.slice(1).map((p) => +p),
          { x1: a, y1: c, x2: m, y2: u, x: y, y: g } = n;
        let f = e;
        const [h, x] = l.slice(-2);
        if (
          ("TQ".includes(s) || ((n.qx = null), (n.qy = null)),
          ["V", "H", "S", "T", "Z"].includes(s))
        )
          f = [s, ...o];
        else if (s === "L")
          i(y) === i(h) ? (f = ["V", x]) : i(g) === i(x) && (f = ["H", h]);
        else if (s === "C") {
          const [p, b] = l;
          "CS".includes(r) &&
            ((i(p) === i(a * 2 - m) && i(b) === i(c * 2 - u)) ||
              (i(a) === i(m * 2 - y) && i(c) === i(u * 2 - g))) &&
            (f = ["S", ...l.slice(-4)]),
            (n.x1 = p),
            (n.y1 = b);
        } else if (s === "Q") {
          const [p, b] = l;
          (n.qx = p),
            (n.qy = b),
            "QT".includes(r) &&
              ((i(p) === i(a * 2 - m) && i(b) === i(c * 2 - u)) ||
                (i(a) === i(m * 2 - y) && i(c) === i(u * 2 - g))) &&
              (f = ["T", ...l.slice(-2)]);
        }
        return f;
      },
      Kt = (e, t) => {
        const n = Q(e),
          r = I(n),
          s = { ...nt },
          i = [],
          o = n.length;
        let l = "",
          a = "",
          c = 0,
          m = 0,
          u = 0,
          y = 0;
        for (let h = 0; h < o; h += 1) {
          ([l] = n[h]),
            (i[h] = l),
            h && (a = i[h - 1]),
            (n[h] = $e(n[h], r[h], s, a));
          const x = n[h],
            p = x.length;
          switch (
            ((s.x1 = +x[p - 2]),
            (s.y1 = +x[p - 1]),
            (s.x2 = +x[p - 4] || s.x1),
            (s.y2 = +x[p - 3] || s.y1),
            l)
          ) {
            case "Z":
              (c = u), (m = y);
              break;
            case "H":
              [, c] = x;
              break;
            case "V":
              [, m] = x;
              break;
            default:
              ([c, m] = x.slice(-2).map(Number)), l === "M" && ((u = c), (y = m));
          }
          (s.x = c), (s.y = m);
        }
        const g = lt(n, t),
          f = lt(Nt(n), t);
        return g.map((h, x) =>
          x ? (h.join("").length < f[x].join("").length ? h : f[x]) : h
        );
      },
      qe = (e) => {
        const t = e
          .slice(1)
          .map((n, r, s) =>
            r
              ? [...s[r - 1].slice(-2), ...n.slice(1)]
              : [...e[0].slice(1), ...n.slice(1)]
          )
          .map((n) => n.map((r, s) => n[n.length - s - 2 * (1 - (s % 2))]))
          .reverse();
        return [
          ["M", ...t[0].slice(0, 2)],
          ...t.map((n) => ["C", ...n.slice(2)]),
        ];
      },
      mt = (e) => {
        const t = Q(e),
          n = t.slice(-1)[0][0] === "Z",
          r = I(t)
            .map((s, i) => {
              const [o, l] = s.slice(-2).map(Number);
              return { seg: t[i], n: s, c: t[i][0], x: o, y: l };
            })
            .map((s, i, o) => {
              const l = s.seg,
                a = s.n,
                c = i && o[i - 1],
                m = o[i + 1],
                u = s.c,
                y = o.length,
                g = i ? o[i - 1].x : o[y - 1].x,
                f = i ? o[i - 1].y : o[y - 1].y;
              let h = [];
              switch (u) {
                case "M":
                  h = n ? ["Z"] : [u, g, f];
                  break;
                case "A":
                  h = [u, ...l.slice(1, -3), l[5] === 1 ? 0 : 1, g, f];
                  break;
                case "C":
                  m && m.c === "S"
                    ? (h = ["S", l[1], l[2], g, f])
                    : (h = [u, l[3], l[4], l[1], l[2], g, f]);
                  break;
                case "S":
                  c && "CS".includes(c.c) && (!m || m.c !== "S")
                    ? (h = ["C", a[3], a[4], a[1], a[2], g, f])
                    : (h = [u, a[1], a[2], g, f]);
                  break;
                case "Q":
                  m && m.c === "T"
                    ? (h = ["T", g, f])
                    : (h = [u, ...l.slice(1, -2), g, f]);
                  break;
                case "T":
                  c && "QT".includes(c.c) && (!m || m.c !== "T")
                    ? (h = ["Q", a[1], a[2], g, f])
                    : (h = [u, g, f]);
                  break;
                case "Z":
                  h = ["M", g, f];
                  break;
                case "H":
                  h = [u, g];
                  break;
                case "V":
                  h = [u, f];
                  break;
                default:
                  h = [u, ...l.slice(1, -2), g, f];
              }
              return h;
            });
        return n ? r.reverse() : [r[0], ...r.slice(1).reverse()];
      },
      Oe = (e, t) => {
        let n = v.Translate(...t.slice(0, -1));
        return (
          ([, , , n.m44] = t), (n = e.multiply(n)), [n.m41, n.m42, n.m43, n.m44]
        );
      },
      _t = (e, t, n) => {
        const [r, s, i] = n,
          [o, l, a] = Oe(e, [...t, 0, 1]),
          c = o - r,
          m = l - s,
          u = a - i;
        return [
          c * (Math.abs(i) / Math.abs(u) || 1) + r,
          m * (Math.abs(i) / Math.abs(u) || 1) + s,
        ];
      },
      Wt = (e, t) => {
        let n = 0,
          r = 0,
          s,
          i,
          o,
          l,
          a,
          c;
        const m = Q(e),
          u = t && Object.keys(t);
        if (!t || (u && !u.length)) return [...m];
        const y = I(m);
        if (!t.origin) {
          const { origin: M } = $;
          Object.assign(t, { origin: M });
        }
        const g = Ut(t),
          { origin: f } = t,
          h = { ...nt };
        let x = [],
          p = 0,
          b = "",
          A = [];
        const d = [];
        if (!g.isIdentity) {
          for (s = 0, o = m.length; s < o; s += 1) {
            (x = m[s]),
              m[s] && ([b] = x),
              (d[s] = b),
              b === "A" &&
                ((x = it(y[s], h)),
                (m[s] = it(y[s], h)),
                dt(m, d, s),
                (y[s] = it(y[s], h)),
                dt(y, d, s),
                (o = Math.max(m.length, y.length))),
              (x = y[s]),
              (p = x.length),
              (h.x1 = +x[p - 2]),
              (h.y1 = +x[p - 1]),
              (h.x2 = +x[p - 4] || h.x1),
              (h.y2 = +x[p - 3] || h.y1);
            const M = { s: m[s], c: m[s][0], x: h.x1, y: h.y1 };
            A = [...A, M];
          }
          return A.map((M) => {
            if (((b = M.c), (x = M.s), b === "L" || b === "H" || b === "V"))
              return (
                ([a, c] = _t(g, [M.x, M.y], f)),
                n !== a && r !== c
                  ? (x = ["L", a, c])
                  : r === c
                  ? (x = ["H", a])
                  : n === a && (x = ["V", c]),
                (n = a),
                (r = c),
                x
              );
            for (i = 1, l = x.length; i < l; i += 2)
              ([n, r] = _t(g, [+x[i], +x[i + 1]], f)), (x[i] = n), (x[i + 1] = r);
            return x;
          });
        }
        return [...m];
      },
      Ee = (e) => {
        const n = e.slice(0, 2),
          r = e.slice(2, 4),
          s = e.slice(4, 6),
          i = e.slice(6, 8),
          o = E(n, r, 0.5),
          l = E(r, s, 0.5),
          a = E(s, i, 0.5),
          c = E(o, l, 0.5),
          m = E(l, a, 0.5),
          u = E(c, m, 0.5);
        return [
          ["C", ...o, ...c, ...u],
          ["C", ...m, ...a, ...i],
        ];
      };
    class N {
      constructor(t, n) {
        const r = n || {},
          s = typeof t > "u";
        if (s || !t.length)
          throw TypeError(`${P}: "pathValue" is ${s ? "undefined" : "empty"}`);
        const i = F(t);
        this.segments = i;
        const { width: o, height: l, cx: a, cy: c, cz: m } = this.getBBox(),
          { round: u, origin: y } = r;
        let g;
        if (u === "auto") {
          const h = `${Math.floor(Math.max(o, l))}`.length;
          g = h >= 4 ? 0 : 4 - h;
        } else Number.isInteger(u) || u === "off" ? (g = u) : (g = $.round);
        let f;
        if (Array.isArray(y) && y.length >= 2) {
          const [h, x, p] = y.map(Number);
          f = [
            Number.isNaN(h) ? a : h,
            Number.isNaN(x) ? c : x,
            Number.isNaN(p) ? m : p,
          ];
        } else f = [a, c, m];
        return (this.round = g), (this.origin = f), this;
      }
      getBBox() {
        return Ft(this.segments);
      }
      getTotalLength() {
        return H(this.segments);
      }
      getPointAtLength(t) {
        return K(this.segments, t);
      }
      toAbsolute() {
        const { segments: t } = this;
        return (this.segments = Q(t)), this;
      }
      toRelative() {
        const { segments: t } = this;
        return (this.segments = Nt(t)), this;
      }
      toCurve() {
        const { segments: t } = this;
        return (this.segments = ot(t)), this;
      }
      reverse(t) {
        this.toAbsolute();
        const { segments: n } = this,
          r = Vt(n),
          s = r.length > 1 ? r : !1,
          i = s
            ? [...s].map((l, a) => (t ? (a ? mt(l) : [...l]) : mt(l)))
            : [...n];
        let o = [];
        return (
          s ? (o = i.flat(1)) : (o = t ? n : mt(n)),
          (this.segments = [...o]),
          this
        );
      }
      normalize() {
        const { segments: t } = this;
        return (this.segments = I(t)), this;
      }
      optimize() {
        const { segments: t } = this;
        return (this.segments = Kt(t, this.round)), this;
      }
      transform(t) {
        if (
          !t ||
          typeof t != "object" ||
          (typeof t == "object" &&
            !["translate", "rotate", "skew", "scale"].some((a) => a in t))
        )
          return this;
        const {
            segments: n,
            origin: [r, s, i],
          } = this,
          o = {};
        for (const [a, c] of Object.entries(t))
          (a === "skew" && Array.isArray(c)) ||
          ((a === "rotate" ||
            a === "translate" ||
            a === "origin" ||
            a === "scale") &&
            Array.isArray(c))
            ? (o[a] = c.map(Number))
            : a !== "origin" &&
              typeof Number(c) == "number" &&
              (o[a] = Number(c));
        const { origin: l } = o;
        if (Array.isArray(l) && l.length >= 2) {
          const [a, c, m] = l.map(Number);
          o.origin = [Number.isNaN(a) ? r : a, Number.isNaN(c) ? s : c, m || i];
        } else o.origin = [r, s, i];
        return (this.segments = Wt(n, o)), this;
      }
      flipX() {
        return this.transform({ rotate: [0, 180, 0] }), this;
      }
      flipY() {
        return this.transform({ rotate: [180, 0, 0] }), this;
      }
      toString() {
        return At(this.segments, this.round);
      }
    }
    return (
      w(N, "CSSMatrix", v),
      w(N, "getSVGMatrix", Ut),
      w(N, "getPathBBox", Ft),
      w(N, "getPathArea", Ht),
      w(N, "getTotalLength", H),
      w(N, "getDrawDirection", Me),
      w(N, "getPointAtLength", K),
      w(N, "pathLengthFactory", st),
      w(N, "getPropertiesAtLength", Mt),
      w(N, "getPropertiesAtPoint", ct),
      w(N, "polygonLength", ce),
      w(N, "polygonArea", oe),
      w(N, "getClosestPoint", Ae),
      w(N, "getSegmentOfPoint", Ne),
      w(N, "getSegmentAtLength", we),
      w(N, "isPointInStroke", ve),
      w(N, "isValidPath", Yt),
      w(N, "isPathArray", J),
      w(N, "isAbsoluteArray", xt),
      w(N, "isRelativeArray", Bt),
      w(N, "isCurveArray", Rt),
      w(N, "isNormalizedArray", pt),
      w(N, "shapeToPath", ke),
      w(N, "shapeToPathArray", Jt),
      w(N, "parsePathString", F),
      w(N, "roundPath", lt),
      w(N, "splitPath", Vt),
      w(N, "splitCubic", Ee),
      w(N, "optimizePath", Kt),
      w(N, "reverseCurve", qe),
      w(N, "reversePath", mt),
      w(N, "normalizePath", I),
      w(N, "transformPath", Wt),
      w(N, "pathToAbsolute", Q),
      w(N, "pathToRelative", Nt),
      w(N, "pathToCurve", ot),
      w(N, "pathToString", At),
      N
    );
  })();
  var myGsource_s, myGsource_r;
  setInterval(() => {
    var incomingSourceContainer = document.getElementById(
      "incomingSourceContainer"
    );
    var outgoingSourceContainer = document.getElementById(
      "outgoingSourceContainer"
    );
    var promiseContainer = document.getElementById(
    "promiseContainer"
  );
  var ghjloderdiv = document.getElementById(
    "loderdiv"
  );
    if (incomingSourceContainer && outgoingSourceContainer) {
      myGsource_r = incomingSourceContainer.innerHTML;
      if (myGsource_s != myGsource_r && myGsource_r != "") {
      var match_mimeType = myGsource_r.match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/);
      // console.log(match_mimeType);
      if (match_mimeType) {
        var mimeType = match_mimeType[0];
        if (mimeType == "image/svg+xml") {
          var svgcode = atob(
            myGsource_r.replace(/data:image\/svg\+xml;base64,/gims, "")
          ).replace(/(\r\n|\n|\r)/gims, "");
          svgcode = svgcode.replace(/\s\s*/gims, " ");
          ghjloderdiv.style.display = 'flex';

          /*--myca--*/
          function task1() {
            return new Promise((resolve, reject) => {
              try {
                const transformedElement = svgPathToExcalidrawElement(svgcode);
                outgoingSourceContainer.innerHTML = JSON.stringify(transformedElement);
                resolve();
              } catch (error) {
                reject(error);
              }
            });
          }

          function task2() {
            ghjloderdiv.style.display = 'none';
            promiseContainer.value = 'resolve';
          }

          task1()
            .then(task2)
            .catch(error => {
              console.warn();("An error occurred in task1:", error);
            });

          /*--myca--*/          
        }
      }
        myGsource_s = myGsource_r;
      }
    }
  }, 1);

  // function validateColor(colorCode) {
  //   // Create a canvas to determine the actual color
  //   const ctx = document.createElement("canvas").getContext("2d");
    
  //   // Try setting the color
  //   ctx.fillStyle = colorCode;
    
  //   // Retrieve the computed color in RGB format
  //   const computedColor = ctx.fillStyle;
  
  //   // If color is black or invalid, return the fallback color
  //   return (computedColor === "rgb(0, 0, 0)" || computedColor === "" || colorCode === 'rgb(255, 255, 255)') ? 'rgba(239, 239, 239, 0.65)' : colorCode;
  // }

  function validateColor(colorCode) {
    // Create an element to test the color
    const s = new Option().style;
    
    // Assign the provided color to the element's color property
    s.color = colorCode;
    
    // Check if the assigned color is retained or reverted to an empty string
    return (!s.color || s.color === 'rgb(0, 0, 0)' || s.color === '') ? 'rgba(255, 255, 255, 0.65)' : colorCode;
  }

  function getComputedStylesFromSVGPath(pathElement) {
    const svg = pathElement.closest("svg");
    if (!svg) {
      console.warn("SVG element not found for the provided path element");
      return null;
    }

    document.body.appendChild(svg);
    const computedStyles = window.getComputedStyle(pathElement);
    const bbox = pathElement.getBBox();
    const properties = {};
    const relevantProperties = [
      "font-size",
      "fill",
      "stroke",
      "stroke-miterlimit",
      "stroke-width",
      "opacity",
      "translate",
    ];

    relevantProperties.forEach((prop) => {
      properties[prop] = computedStyles.getPropertyValue(prop);
    });

    properties["width"] = bbox.width;
    properties["height"] = bbox.height;
    properties["x"] = bbox.x;
    properties["y"] = bbox.y;

    document.body.removeChild(svg);
    // console.log(properties);
    
    return properties;
  }
  
  // function getComputedStylesFromSVGPath(pathElement) {
  //   const svg = pathElement.closest("svg");
  //   if (!svg) {
  //     console.warn("SVG element not found for the provided path element");
  //     return null;
  //   }
  //   document.body.appendChild(svg);
  //   const computedStyles = window.getComputedStyle(pathElement);
  //   const bbox = pathElement.getBBox();
  //   const properties = {};
    
  //   const relevantProperties = [
  //     "font-size",
  //     "stroke",
  //     "stroke-miterlimit",
  //     "stroke-width",
  //     "opacity",
  //     "translate",
  //   ];
  
  //   // Retrieve relevant computed properties
  //   relevantProperties.forEach((prop) => {
  //     properties[prop] = computedStyles.getPropertyValue(prop);
  //   });
  
  //   // Check for gradient in different places
  //   let fillValue = computedStyles.getPropertyValue("fill");
  
  //   // 1. Check `fill` attribute directly for gradient reference
  //   const fillAttr = pathElement.getAttribute("fill");
  //   if (fillAttr && fillAttr.startsWith("url(")) {
  //     fillValue = fillAttr;
  //   }
  
  //   // 2. Check inline `style` attribute for gradient reference
  //   const styleAttr = pathElement.getAttribute("style");
  //   if (styleAttr) {
  //     const styleMatch = styleAttr.match(/fill:\s*(url\(#\w+\)|#[0-9a-fA-F]{3,6}|\w+)/);
  //     if (styleMatch) {
  //       fillValue = styleMatch[1];
  //     }
  //   }
  
  //   // 3. Check class-based styling for gradient reference
  //   const classList = pathElement.classList;
  //   if (classList.length > 0) {
  //     Array.from(classList).some(className => {
  //       const classStyle = window.getComputedStyle(document.querySelector(`.${className}`));
  //       const classFill = classStyle.getPropertyValue("fill");
  //       if (classFill && classFill.startsWith("url(")) {
  //         fillValue = classFill;
  //         return true;
  //       }
  //       return false;
  //     });
  //   }
  
  //   // 4. Check ID-based styling for gradient reference
  //   const id = pathElement.id;
  //   if (id) {
  //     const idStyle = window.getComputedStyle(document.querySelector(`#${id}`));
  //     const idFill = idStyle.getPropertyValue("fill");
  //     if (idFill && idFill.startsWith("url(")) {
  //       fillValue = idFill;
  //     }
  //   }
  
  //   // If fill is a gradient reference, retrieve the gradient definition from the SVG
  //   if (fillValue && fillValue.startsWith("url(")) {
  //     const gradientMatch = fillValue.match(/url\(#(.*?)\)/);
  //     if (gradientMatch && gradientMatch[1]) { // Ensure match is found
  //       const gradientId = gradientMatch[1];
  //       const gradientElement = svg.querySelector(`#${gradientId}`);
  
  //       if (gradientElement) {
  //         const stops = Array.from(gradientElement.querySelectorAll("stop")).map(stop => ({
  //           offset: stop.getAttribute("offset"),
  //           color: stop.getAttribute("stop-color")
  //         }));
  //         properties["fill"] = {
  //           type: gradientElement.tagName,
  //           id: gradientId,
  //           stops: stops
  //         };
  //       } else {
  //         console.warn(`Gradient with ID #${gradientId} not found`);
  //         properties["fill"] = "Gradient not found";
  //       }
  //     } else {
  //       properties["fill"] = fillValue; // Default to the original `fillValue` if no match found
  //     }
  //   } else {
  //     properties["fill"] = fillValue; // Direct color if no gradient
  //   }
  
  //   // Add bounding box dimensions
  //   properties["width"] = bbox.width;
  //   properties["height"] = bbox.height;
  //   properties["x"] = bbox.x;
  //   properties["y"] = bbox.y;
    
  //   document.body.removeChild(svg);
  //   console.log(properties);
    
  //   return properties;
  // }
  

  
  function getComputedTransformations(pathElement) {
    const svg = pathElement.closest("svg");
    if (!svg) {
      console.error("SVG element not found for the provided path element");
      return null;
    }
    document.body.appendChild(svg);
    const ctm = pathElement.getCTM();
    const transformations = {
      a: ctm.a,
      b: ctm.b,
      c: ctm.c,
      d: ctm.d,
      e: ctm.e,
      f: ctm.f,
    };
    transformations.rotation = Math.atan2(ctm.b, ctm.a);
    document.body.removeChild(svg);
    return transformations;
  }
  function parseTransformationMatrix(matrixString) {
    const trimmedString = matrixString.replace(/^matrix\(|\)$/g, "");
    const components = trimmedString.split(/\s+/).map(parseFloat);
    const matrix = {
      a: components[0],
      b: components[1],
      c: components[2],
      d: components[3],
      e: components[4],
      f: components[5],
    };
    return matrix;
  }
  function svgPathToExcalidrawElement(svgString) {
    const elements = [];
    const universalGroup = generateRandomId();
    var sFactor = 1;
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgString, "image/svg+xml");
    const svg = svgDoc.documentElement;
    // svg.querySelectorAll('circle, rect, ellipse, line, polyline, polygon, path, text').forEach((path) => {
    //   getComputedStylesFromSVGPath(path);
    // });

    const otherShapes = svg.querySelectorAll("circle, rect, ellipse, line, polyline, polygon");
    otherShapes.forEach((shape) => {
      pathConverter.shapeToPath(shape, true);
    });
    const shapes = svg.querySelectorAll("path, text");
    const groupTag = svg.querySelectorAll("g");
    for (let i = 0; i < groupTag.length; i++) {
      groupTag[i].setAttributeNS(null, "gid", generateRandomId());
    }
    const svgdimension = calculateDimensions(svg);
    if (svgdimension) {
      var bigDimension = svgdimension.width > svgdimension.height ? svgdimension.width : svgdimension.height;
      for (let i = 0; i < shapes.length; i++) {
        var path = shapes[i];
        if (path.hasAttribute("d") && path.nodeName === "path") {
          var pathdimensions = calculateSVGPathDimensions(path);
          var pathBigDimension = pathdimensions.width > pathdimensions.height ? pathdimensions.width : pathdimensions.height;
          if (pathBigDimension > bigDimension) {
            bigDimension = pathBigDimension;
          }
        }
      }
      if (bigDimension > 500) {
        sFactor = 500 / bigDimension;
      } else if (bigDimension > 300) {
        sFactor = 300 / bigDimension;
      }
    }
    shapes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const computedStyle = getComputedStylesFromSVGPath(node);
        const transformations = getComputedTransformations(node);
        const groupIds = [];
        groupIds.push(generateRandomId());
        if (shapes.length > 1) {
          groupIds.push(universalGroup);
        }
        var isLoopContenu = true;
        var parentNodeR = node;
        var degree = 0;
        var translateX = 0;
        var translateY = 0;
        var scaleX = 0;
        var scaleY = 0;

        while (isLoopContenu) {
          if (parentNodeR.hasAttribute("transform")) {
            var transform = parentNodeR.getAttribute("transform");
            var rotate = transform.match(/rotate(\s)*\([^()]*\)/gims);
            var translate = transform.match(/translate(\s)*\([^()]*\)/gims);
            var matrix = transform.match(/matrix(\s)*\([^()]*\)/gims);
            var scale = transform.match(/scale(\s)*\([^()]*\)/gims);
            if (rotate) {
              degree += parseFloat(
                rotate[0].replaceAll(/rotate(\s)*\(|\)/gims, "").trim().split(" ")[0]
              );
            }
            if (translate) {
              translate = translate[0].replaceAll(/translate(\s)*\(|\)/gims, "").trim().split(" ");
              if (translate.length === 2) {
                translateX += parseFloat(translate[0]);
                translateY += parseFloat(translate[1]);
              }
            }

            if (matrix) {
              var matrixObject = parseTransformationMatrix(matrix[0]);
              translateX += parseFloat(matrixObject.e);
              translateY += parseFloat(matrixObject.f);
              scaleX += parseFloat(matrixObject.a);
              scaleY += parseFloat(matrixObject.d);
            }

            if (scale) {
              scale = scale[0].replaceAll(/scale(\s)*\(|\)/gims, "").trim().split(" ");
              if (scale.length === 2) {
                scaleX += parseFloat(scale[0]);
                scaleY += parseFloat(scale[1]);
              } else if (scale.length === 1) {
                scaleX += parseFloat(scale[0]);
                scaleY += parseFloat(scale[0]);
              }
            }
          }
          // if (shapes.length > 1) {
          //   // if (parentNodeR.nodeName == "g") {
          //   //   if (parentNodeR.getAttributeNS(null, "gid")) {
          //   //     groupIds.push(parentNodeR.getAttributeNS(null, "gid"));
          //   //   }
          //   // }
          // }
          parentNodeR = parentNodeR.parentNode;
          if (parentNodeR.nodeName == "svg") {
            isLoopContenu = false;
          }
        }
        
        var angle = (Math.PI * degree) / 180;
        switch (node.tagName.toLowerCase()) {
          case "path":
            var dimensions = calculateSVGPathDimensions(node);
            var svgPath = node.getAttribute("d");
            var dwidth = dimensions.width ? dimensions.width : 1;
            var dheight = dimensions.height ? dimensions.height : 1;
            var mygetingobj = {
              type: "rectangle",
              id: generateRandomId(),
              angle: angle,
              x: (dimensions.x + translateX) * sFactor,
              y: (dimensions.y + translateY) * sFactor,
              width: dwidth * sFactor,
              height: dheight * sFactor,
              constx: dimensions.x,
              consty: dimensions.y,
              constWidth: dwidth,
              constHeight: dheight,
              backgroundColor: validateColor(computedStyle.fill),
              strokeColor: computedStyle.stroke,
              strokeWidth: extractNumber(computedStyle["stroke-width"], 0),
              opacity: extractNumber(computedStyle.opacity, 1) * 100,
              pathObjects: getPathObjects(svgPath),
              groupIds: groupIds,
              seed: 1784680689,
              frameId: null,
              roundness: null,
              boundElements: [],
              updated: Date.now(),
              link: null,
              locked: false,
              startBinding: null,
              endBinding: null,
              lastCommittedPoint: null,
              startArrowhead: null,
              endArrowhead: null,
              isDeleted: false,
              isPathElement: true
            };
            elements.push(mygetingobj);
            
            console.log({computedStyle: computedStyle.fill, mygetingobjBackgroundColor: mygetingobj.backgroundColor});
            
            break;
          case "text":
            var textChildNodes = node.childNodes;
            textChildNodes.forEach((textNode) => {
              var mygetingobj;
              if (textNode.nodeType === Node.TEXT_NODE) {
                var elementText = textNode.textContent.trim();
                var subtractionFactorY = computedStyle.height / 2;
                mygetingobj = {
                  type: "text",
                  x: (node.getAttribute("x") + translateX) * sFactor,
                  y: (node.getAttribute("y") + translateY - subtractionFactorY) * sFactor - 3,
                  width: computedStyle.width * sFactor,
                  height: computedStyle.height * sFactor,
                  strokeColor: computedStyle.fill,
                  backgroundColor: "transparent",
                  fillStyle: "solid",
                  strokeWidth: 1,
                  strokeStyle: "solid",
                  roughness: 0,
                  opacity: 100,
                  frameId: null,
                  roundness: null,
                  seed: 679432561,
                  version: 36,
                  versionNonce: 879694929,
                  boundElements: null,
                  link: null,
                  locked: false,
                  text: elementText,
                  fontSize: parseFloat(computedStyle["font-size"]) * sFactor,
                  fontFamily: 2,
                  textAlign: "center",
                  verticalAlign: "top",
                  baseline: 13,
                  containerId: null,
                  originalText: elementText,
                  lineHeight: 1.15,
                };
              } else if (textNode.nodeType === Node.ELEMENT_NODE) {
                const textNodeComputedStyle = getComputedStylesFromSVGPath(textNode);
                var elementText = textNode.textContent.trim();
                var subtractionFactorY = textNodeComputedStyle.height / 2;
                mygetingobj = {
                  type: "text",
                  x: (textNodeComputedStyle.x + translateX) * sFactor,
                  y: (textNodeComputedStyle.y + translateY - subtractionFactorY) * sFactor - 3,
                  width: textNodeComputedStyle.width * sFactor,
                  height: textNodeComputedStyle.height * sFactor,
                  strokeColor: textNodeComputedStyle.fill,
                  backgroundColor: "transparent",
                  fillStyle: "solid",
                  strokeWidth: 1,
                  strokeStyle: "solid",
                  roughness: 0,
                  opacity: 100,
                  frameId: null,
                  roundness: null,
                  seed: 679432561,
                  version: 36,
                  versionNonce: 879694929,
                  boundElements: null,
                  link: null,
                  locked: false,
                  text: elementText,
                  fontSize: parseFloat(textNodeComputedStyle["font-size"]) * sFactor,
                  fontFamily: 2,
                  textAlign: "center",
                  verticalAlign: "top",
                  baseline: 13,
                  containerId: null,
                  originalText: elementText,
                  lineHeight: 1.15,
                };
              }
              if (mygetingobj) {
                const object = {
                  id: generateRandomId(),
                  angle: angle,
                  groupIds: groupIds,
                  seed: 1784680689,
                  frameId: null,
                  roundness: null,
                  boundElements: [],
                  updated: Date.now(),
                  link: null,
                  locked: false,
                  startBinding: null,
                  endBinding: null,
                  lastCommittedPoint: null,
                  startArrowhead: null,
                  endArrowhead: null,
                  isDeleted: false,
                };
                Object.assign(object, mygetingobj);
                elements.push(object);
              }

              // console.log(mygetingobj.y);
            });
            break;
          default:
            break;
        }
      }
    });
    return elements;
  }
  function generateRandomId(length = 21) {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-";
    let randomId = "";
    for (let i = 0; i < length; i++) {
      randomId += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return randomId;
  }
  function extractNumber(str, defult) {
    if (isNaN(parseFloat(str))) {
      return defult;
    } else {
      return parseFloat(str);
    }
  }
  function calculateSVGPathDimensions(path) {
    if (path.hasAttribute("d") && path.nodeName === "path") {
      const svgNS = "http://www.w3.org/2000/svg";
      const tempSvg = document.createElementNS(svgNS, "svg");
      const tempPath = document.createElementNS(svgNS, "path");
      tempPath.setAttributeNS(null, "d", path.getAttributeNS(null, "d"));
      tempSvg.appendChild(tempPath);
      document.body.appendChild(tempSvg);
      var bbox;
      if (tempPath.getBBox()) {
        bbox = tempPath.getBBox();
      }
      document.body.removeChild(tempSvg);
      return bbox;
    } else {
      return { width: 0, height: 0, x: 0, y: 0 };
    }
  }
  function calculateDimensions(svg) {
    let tempDiv = document.createElement("div");
    tempDiv.style.position = "absolute";
    tempDiv.style.left = "-9999px";
    tempDiv.appendChild(svg);
    document.body.appendChild(tempDiv);
    var BBox;
    if (svg.getBBox()) {
      var BBox = svg.getBBox();
    }
    document.body.removeChild(tempDiv);
    return BBox;
  }
  function getPathObjects(path) {
    if (pathConverter.isValidPath(path)) {
      var properties = [];
      var pathPointsMatches = toAbsolute(path).match(/[A-Za-z][^A-Za-z]*/gims);
      for (let i = 0; i < pathPointsMatches.length; i++) {
        var pathPointObject = {
          realParts: "M322 164.5",
          command: "M",
          coordinates: [0, 0],
        };
        var ExtractComm = pathPointsMatches[i].match(/[a-z]/gims)[0];
        var ExtractCoor = pathPointsMatches[i].match(/(-)*\d(\d|\.)*/gims);
        var numCoor = [];
        if (ExtractCoor) {
          if (
            ExtractComm.toLowerCase() === "a" &&
            ExtractCoor.length % 7 !== 0 &&
            ExtractCoor.length
          ) {
            var counter = 0;
            for (let j = 0; j < ExtractCoor.length; j++) {
              if (counter % 3 == 0 && counter) {
                var jointCoords = ExtractCoor[j];
                if (jointCoords) {
                  if (jointCoords.length >= 2) {
                    var fristTwocoords = jointCoords.slice(0, 2).split("");
                    for (let k = 0; k < fristTwocoords.length; k++) {
                      numCoor.push(Number(fristTwocoords[k]));
                    }
                    var lastCoords = jointCoords.slice(2);
                    if (lastCoords) {
                      numCoor.push(Number(lastCoords));
                    }
                  }
                }
              } else {
                numCoor.push(Number(ExtractCoor[j]));
              }
              counter++;
              if (numCoor.length % 7 == 0) {
                counter = 0;
              }
            }
          } else {
            for (let j = 0; j < ExtractCoor.length; j++) {
              numCoor.push(Number(ExtractCoor[j]));
            }
          }
        }
        Object.assign(pathPointObject, {
          realParts: pathPointsMatches[i],
          command: ExtractComm,
          coordinates: numCoor,
        });
        properties.push(pathPointObject);
      }
      var newProperties = [];
      let prevX = 0;
      let prevY = 0;
      let startX = 0;
      let startY = 0;
      properties.forEach((property) => {
        var command = property.command;
        var coordinates = property.coordinates;
        switch (command) {
          case "M":
            prevX = coordinates[0];
            prevY = coordinates[1];
            startX = prevX;
            startY = prevY;
            var myObject = {
              realParts: property.realParts,
              command: command.toUpperCase(),
              coordinates: [prevX, prevY],
            };
            newProperties.push(myObject);
            break;
          case "m":
            prevX += coordinates[0];
            prevY += coordinates[1];
            startX = prevX;
            startY = prevY;
            var myObject = {
              realParts: property.realParts,
              command: command.toUpperCase(),
              coordinates: [prevX, prevY],
            };
            newProperties.push(myObject);
            break;
          case "H":
            for (let i = 0; i < coordinates.length; i++) {
              prevX = coordinates[i];
              prevY = prevY;
              var myObject = {
                realParts: property.realParts,
                command: "L",
                coordinates: [prevX, prevY],
              };
              newProperties.push(myObject);
            }
            break;
          case "h":
            for (let i = 0; i < coordinates.length; i++) {
              prevX += coordinates[i];
              prevY = prevY;
              var myObject = {
                realParts: property.realParts,
                command: "L",
                coordinates: [prevX, prevY],
              };
              newProperties.push(myObject);
            }
            break;
          case "V":
            for (let i = 0; i < coordinates.length; i++) {
              prevX = prevX;
              prevY = coordinates[i];
              var myObject = {
                realParts: property.realParts,
                command: "L",
                coordinates: [prevX, prevY],
              };
              newProperties.push(myObject);
            }
            break;
          case "v":
            for (let i = 0; i < coordinates.length; i++) {
              prevX = prevX;
              prevY += coordinates[i];
              var myObject = {
                realParts: property.realParts,
                command: "L",
                coordinates: [prevX, prevY],
              };
              newProperties.push(myObject);
            }
            break;
          case "Z":
          case "z":
            prevX = startX;
            prevY = startY;
            var myObject = {
              realParts: property.realParts,
              command: "Z",
              coordinates: [],
            };
            newProperties.push(myObject);
            break;
          case "L":
            if (coordinates.length % 2 == 0 && coordinates.length != 0) {
              for (let i = 0; i < coordinates.length; i += 2) {
                prevX = coordinates[0 + i];
                prevY = coordinates[1 + i];
                var myObject = {
                  realParts: property.realParts,
                  command: "L",
                  coordinates: [prevX, prevY],
                };
                newProperties.push(myObject);
              }
            }
            break;
          case "l":
            if (coordinates.length % 2 == 0 && coordinates.length) {
              for (let i = 0; i < coordinates.length; i += 2) {
                prevX += coordinates[0 + i];
                prevY += coordinates[1 + i];
                var myObject = {
                  realParts: property.realParts,
                  command: "L",
                  coordinates: [prevX, prevY],
                };
                newProperties.push(myObject);
              }
            }
            break;
          case "Q":
            if (coordinates.length % 4 == 0 && coordinates.length) {
              for (let i = 0; i < coordinates.length; i += 4) {
                prevX = coordinates[2 + i];
                prevY = coordinates[3 + i];
                var myObject = {
                  realParts: property.realParts,
                  command: "Q",
                  coordinates: [
                    coordinates[0 + i],
                    coordinates[1 + i],
                    prevX,
                    prevY,
                  ],
                };
                newProperties.push(myObject);
              }
            }
            break;
          case "q":
            if (coordinates.length % 4 == 0 && coordinates.length) {
              for (let i = 0; i < coordinates.length; i += 4) {
                var px1 = coordinates[0 + i] + prevX,
                  py1 = coordinates[1 + i] + prevY;
                prevX += coordinates[2 + i];
                prevY += coordinates[3 + i];
                var myObject = {
                  realParts: property.realParts,
                  command: "Q",
                  coordinates: [px1, py1, prevX, prevY],
                };
                newProperties.push(myObject);
              }
            }
            break;
          case "T":
            if (coordinates.length % 2 == 0 && coordinates.length) {
              for (let i = 0; i < coordinates.length; i += 2) {
                prevX = coordinates[0 + i];
                prevY = coordinates[1 + i];
                var myObject = {
                  realParts: property.realParts,
                  command: "T",
                  coordinates: [prevX, prevY],
                };
                newProperties.push(myObject);
              }
            }
            break;
          case "t":
            if (coordinates.length % 2 == 0 && coordinates.length) {
              for (let i = 0; i < coordinates.length; i += 2) {
                prevX += coordinates[0 + i];
                prevY += coordinates[1 + i];
                var myObject = {
                  realParts: property.realParts,
                  command: "T",
                  coordinates: [prevX, prevY],
                };
                newProperties.push(myObject);
              }
            }
            break;
          case "C":
            if (coordinates.length % 6 == 0 && coordinates.length) {
              for (let i = 0; i < coordinates.length; i += 6) {
                prevX = coordinates[4 + i];
                prevY = coordinates[5 + i];
                var myObject = {
                  realParts: property.realParts,
                  command: "C",
                  coordinates: [
                    coordinates[0 + i],
                    coordinates[1 + i],
                    coordinates[2 + i],
                    coordinates[3 + i],
                    prevX,
                    prevY,
                  ],
                };
                newProperties.push(myObject);
              }
            }
            break;
          case "c":
            if (coordinates.length % 6 == 0 && coordinates.length) {
              for (let i = 0; i < coordinates.length; i += 6) {
                var px1 = coordinates[0 + i] + prevX;
                py1 = coordinates[1 + i] + prevY;
                px2 = coordinates[2 + i] + prevX;
                py2 = coordinates[3 + i] + prevY;
                prevX += coordinates[4 + i];
                prevY += coordinates[5 + i];
                var myObject = {
                  realParts: property.realParts,
                  command: "C",
                  coordinates: [px1, py1, px2, py2, prevX, prevY],
                };
                newProperties.push(myObject);
              }
            }
            break;
          case "S":
            if (coordinates.length % 4 == 0 && coordinates.length) {
              for (let i = 0; i < coordinates.length; i += 4) {
                prevX = coordinates[2 + i];
                prevY = coordinates[3 + i];
                var myObject = {
                  realParts: property.realParts,
                  command: "S",
                  coordinates: [
                    coordinates[0 + i],
                    coordinates[1 + i],
                    prevX,
                    prevY,
                  ],
                };
                newProperties.push(myObject);
              }
            }
            break;
          case "s":
            if (coordinates.length % 4 == 0 && coordinates.length) {
              for (let i = 0; i < coordinates.length; i += 4) {
                var px1 = coordinates[0 + i] + prevX,
                  py1 = coordinates[1 + i] + prevY;
                prevX += coordinates[2 + i];
                prevY += coordinates[3 + i];
                var myObject = {
                  realParts: property.realParts,
                  command: "S",
                  coordinates: [px1, py1, prevX, prevY],
                };
                newProperties.push(myObject);
              }
            }
            break;
          case "A":
            if (coordinates.length % 7 == 0 && coordinates.length) {
              for (let i = 0; i < coordinates.length; i += 7) {
                prevX = coordinates[5 + i];
                prevY = coordinates[6 + i];
                var myObject = {
                  realParts: property.realParts,
                  command: "A",
                  coordinates: [
                    coordinates[0 + i],
                    coordinates[1 + i],
                    coordinates[2 + i],
                    coordinates[3 + i],
                    coordinates[4 + i],
                    prevX,
                    prevY,
                  ],
                };
                newProperties.push(myObject);
              }
            }
            break;
          case "a":
            if (coordinates.length % 7 == 0 && coordinates.length) {
              for (let i = 0; i < coordinates.length; i += 7) {
                prevX += coordinates[5 + i];
                prevY += coordinates[6 + i];
                var myObject = {
                  realParts: property.realParts,
                  command: "A",
                  coordinates: [
                    coordinates[0 + i],
                    coordinates[1 + i],
                    coordinates[2 + i],
                    coordinates[3 + i],
                    coordinates[4 + i],
                    prevX,
                    prevY,
                  ],
                };
                newProperties.push(myObject);
              }
            }
            break;
          default:
            break;
        }
      });
      return newProperties;
    }
  }
  function toAbsolute(path) {
    if (pathConverter.isValidPath(path)) {
      const absPath = new pathConverter(path).toAbsolute().toString();
      return absPath;
    }
  }