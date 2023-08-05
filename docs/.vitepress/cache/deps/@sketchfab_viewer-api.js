import {
  __commonJS
} from "./chunk-CF3WPAMV.js";

// node_modules/@sketchfab/viewer-api/viewer-api.js
var require_viewer_api = __commonJS({
  "node_modules/@sketchfab/viewer-api/viewer-api.js"(exports, module) {
    !function(t, e) {
      "object" == typeof exports && "object" == typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define([], e) : "object" == typeof exports ? exports.Sketchfab = e() : t.Sketchfab = e();
    }(exports, () => (() => {
      "use strict";
      var t = { d: (e2, i2) => {
        for (var n2 in i2)
          t.o(i2, n2) && !t.o(e2, n2) && Object.defineProperty(e2, n2, { enumerable: true, get: i2[n2] });
      }, o: (t2, e2) => Object.prototype.hasOwnProperty.call(t2, e2) }, e = {};
      function i(t2) {
        return i = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t3) {
          return typeof t3;
        } : function(t3) {
          return t3 && "function" == typeof Symbol && t3.constructor === Symbol && t3 !== Symbol.prototype ? "symbol" : typeof t3;
        }, i(t2);
      }
      t.d(e, { default: () => h });
      var n = function(t2, e2) {
        t2.forEach(function(t3) {
          this[t3] = function() {
            var i2, n2 = e2._requestIdCounter++, s2 = Array.prototype.slice.call(arguments);
            if (s2.length > 0) {
              var r2 = s2[s2.length - 1];
              "function" == typeof r2 && (i2 = s2.pop());
            }
            i2 && (e2._pendingRequests[n2] = i2.bind(this)), e2._target.postMessage({ type: "api.request", instanceId: e2.getIdentifier(), requestId: n2, member: t3, arguments: s2 }, e2.getDomain());
          };
        }, this), this.addEventListener = function(t3, i2, n2) {
          "viewerready" === t3 && e2.isViewerReady && i2(), e2._eventListeners[t3] || (e2._eventListeners[t3] = []), e2._eventListeners[t3].push(i2), n2 && this.setListenerOptions && (n2.name = t3, this.setListenerOptions(n2));
        }, this.removeEventListener = function(t3, i2) {
          if (e2._eventListeners[t3]) {
            var n2 = e2._eventListeners[t3].indexOf(i2);
            -1 !== n2 && e2._eventListeners[t3].splice(n2, 1);
          }
        };
      }, s = function(t2, e2, i2) {
        this._target = t2, this._requestIdCounter = 0, this._pendingRequests = {}, this._eventListeners = {}, this._ready = false, this._domain = i2, this._instanceId = e2, this.listenServer();
      };
      s.prototype = { getIdentifier: function() {
        return this._instanceId;
      }, getDomain: function() {
        return this._domain;
      }, setIdentifier: function(t2) {
        this._instanceId = t2;
      }, use: function(t2, e2) {
        this._version = t2, this._ready = true;
        var i2 = this._requestIdCounter++;
        this._pendingRequests[i2] = (function(t3, i3, s2) {
          t3 ? e2.call(this, t3) : e2.call(this, null, new n(s2, this));
        }).bind(this), this._target.postMessage({ type: "api.initialize", requestId: i2, name: t2, instanceId: this._instanceId }, this._domain);
      }, listenServer: function() {
        if (!this._serverReceiveMessageBinded) {
          var t2 = ["api.initialize.result", "api.request.result", "api.event"];
          this._serverReceiveMessageBinded = (function(e2) {
            if (e2.origin === this._domain && e2.data && e2.data.type && e2.data.instanceId && e2.data.instanceId === this.getIdentifier()) {
              var i2 = e2.data.type;
              if (-1 !== t2.indexOf(i2))
                if ("api.event" === i2) {
                  var n2 = e2.data.results, s2 = n2[0];
                  if (this._eventListeners["*"] || this._eventListeners.all)
                    return void ["*", "all"].forEach(function(t3) {
                      var e3 = this._eventListeners[t3];
                      e3 && e3.forEach(function(t4) {
                        t4.apply(t4, n2);
                      });
                    }, this);
                  var r2 = n2.slice(1), o2 = this._eventListeners[s2];
                  o2 ? o2.forEach(function(t3) {
                    t3.apply(t3, r2);
                  }) : "viewerready" === s2 && (this.isViewerReady = true);
                } else {
                  var a2 = e2.data.requestId, d2 = this._pendingRequests[a2];
                  if (!d2)
                    return;
                  d2.apply(null, e2.data.results), this._pendingRequests[a2] = void 0;
                }
            }
          }).bind(this), window.addEventListener("message", this._serverReceiveMessageBinded);
        }
      } };
      const r = s;
      var o = /[&|;]+/g;
      function a(t2) {
        return "object" === i(t2) ? (e2 = t2, n2 = {}, Object.keys(e2).forEach(function(t3) {
          n2[t3] = Array.isArray(e2[t3]) ? e2[t3] : [e2[t3]];
        }), n2) : ("?" === t2[0] && (t2 = t2.substr(1)), t2.split(o).reduce(function(t3, e3) {
          if (0 === e3.length)
            return t3;
          var i2 = e3.indexOf("=");
          -1 === i2 && (i2 = e3.length);
          var n3 = decodeURIComponent(e3.substr(0, i2).replace(/\+/g, "%20")), s2 = decodeURIComponent(e3.substr(i2 + 1).replace(/\+/g, "%20"));
          return void 0 === t3[n3] && (t3[n3] = []), t3[n3].push(s2), t3;
        }, {}));
        var e2, n2;
      }
      window.SketchfabAPIClient = r;
      var d = function(t2, e2) {
        var n2 = t2, s2 = e2;
        "object" === i(t2) && (s2 = t2, n2 = null), this._version = n2, this._target = s2, window.sketchfabAPIinstances || (window.sketchfabAPIinstances = []), window.sketchfabAPIinstances.push(this), this._apiId = window.sketchfabAPIinstances.length.toString(), this._target.id && (this._apiId += "_" + this._target.id), this._target.allow || (this._target.allow = "vr; autoplay; fullscreen"), this._client = void 0, this._options = void 0, this._domain = "sketchfab.com", this._domain = "same-as-current" === this._domain ? window.location.hostname : this._domain, this._urlTemplate = "https://YYYY/models/XXXX/embed", this._url = this._urlTemplate.replace("YYYY", this._domain), this._transmitOptions = {}, this._getURLOptions();
      };
      d.prototype = { _urlOptionsDict: { skfb_api_version: { default: "1.12.1", type: "string" } }, _optionsLoaded: function(t2) {
        this._urlOptions = t2, this._version = this._getURLOption("skfb_api_version", this._version);
      }, _getURLOption: function(t2, e2) {
        var i2 = this._urlOptionsDict[t2];
        if (!i2)
          return e2;
        null == e2 && (e2 = i2.default);
        var n2 = this._urlOptions[t2];
        return n2 && n2.length ? n2[0] : e2;
      }, _getURLOptions: function() {
        if (!window || !window.location.search)
          return this._optionsLoaded({});
        var t2 = a(window.location.search);
        for (var e2 in t2)
          e2.startsWith("skfb_") && (this._transmitOptions[e2.substr(5)] = t2[e2]);
        return this._optionsLoaded(t2);
      }, getEmbedURL: function(t2, e2) {
        var i2 = this._url + "?api_version=" + this._version + "&api_id=" + this._apiId;
        e2 && Object.keys(e2).forEach(function(t3) {
          null != e2[t3] && "function" != typeof e2[t3] && (i2 += "&" + t3.toString() + "=" + e2[t3].toString());
        });
        var n2 = this._transmitOptions;
        return Object.keys(this._transmitOptions).forEach(function(t3) {
          i2 += "&" + t3.toString() + "=" + n2[t3].toString();
        }), i2.replace("XXXX", t2);
      }, init: function(t2, e2) {
        this._options = e2, this._uid = t2, this._realInit();
      }, _initializeAPIEmbed: function(t2) {
        if (t2.data && t2.data.instanceId && this._apiId === t2.data.instanceId && "api.ready" === t2.data.type && this._target.src) {
          if (void 0 !== t2.data.error)
            return this.error(t2.data.error), void window.removeEventListener("message", this._initializeAPIEmbedBinded);
          var e2 = this._target.src.split("/");
          e2 = "https://" + e2[2], this._client && (console.log("reusing a Sketchfab instance for multiple client is not supported, please create a new sketchfab instance"), window.removeEventListener("message", this._client._serverReceiveMessageBinded)), this._client = new window.SketchfabAPIClient(this._target.contentWindow, this._apiId, e2), this._client.use(this._version, (function(t3, e3) {
            if (t3)
              throw t3;
            this.success.call(this, e3);
          }).bind(this)), window.removeEventListener("message", this._initializeAPIEmbedBinded);
        }
      }, _realInit: function() {
        this._initializeAPIEmbedBinded || (this._initializeAPIEmbedBinded = this._initializeAPIEmbed.bind(this)), window.addEventListener("message", this._initializeAPIEmbedBinded), this._target.src = this.getEmbedURL(this._uid, this._options);
      }, success: function(t2) {
        this._options.success && "function" == typeof this._options.success && this._options.success(t2);
      }, error: function(t2) {
        this._options.error && "function" == typeof this._options.error && this._options.error(t2);
      }, show: function() {
        var t2 = this._target.style.top;
        this._target.style.top = "-1000vh", Promise.resolve().then((function() {
          this._target.style.top = t2;
        }).bind(this));
      } };
      const h = d;
      return e.default;
    })());
  }
});
export default require_viewer_api();
//# sourceMappingURL=@sketchfab_viewer-api.js.map
