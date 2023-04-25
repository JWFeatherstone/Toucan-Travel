/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _css_loader_dist_cjs_js_glide_core_min_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_css_loader_dist_cjs_js_glide_core_min_css__WEBPACK_IMPORTED_MODULE_1__.default, options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_css_loader_dist_cjs_js_glide_core_min_css__WEBPACK_IMPORTED_MODULE_1__.default.locals || {});

/***/ }),
/* 2 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var isOldIE = function isOldIE() {
  var memo;
  return function memorize() {
    if (typeof memo === 'undefined') {
      // Test for IE <= 9 as proposed by Browserhacks
      // @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
      // Tests for existence of standard globals is to allow style-loader
      // to operate correctly into non-standard environments
      // @see https://github.com/webpack-contrib/style-loader/issues/177
      memo = Boolean(window && document && document.all && !window.atob);
    }

    return memo;
  };
}();

var getTarget = function getTarget() {
  var memo = {};
  return function memorize(target) {
    if (typeof memo[target] === 'undefined') {
      var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

      if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
        try {
          // This will throw an exception if access to iframe is blocked
          // due to cross-origin restrictions
          styleTarget = styleTarget.contentDocument.head;
        } catch (e) {
          // istanbul ignore next
          styleTarget = null;
        }
      }

      memo[target] = styleTarget;
    }

    return memo[target];
  };
}();

var stylesInDom = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDom.length; i++) {
    if (stylesInDom[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var index = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3]
    };

    if (index !== -1) {
      stylesInDom[index].references++;
      stylesInDom[index].updater(obj);
    } else {
      stylesInDom.push({
        identifier: identifier,
        updater: addStyle(obj, options),
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function insertStyleElement(options) {
  var style = document.createElement('style');
  var attributes = options.attributes || {};

  if (typeof attributes.nonce === 'undefined') {
    var nonce =  true ? __webpack_require__.nc : 0;

    if (nonce) {
      attributes.nonce = nonce;
    }
  }

  Object.keys(attributes).forEach(function (key) {
    style.setAttribute(key, attributes[key]);
  });

  if (typeof options.insert === 'function') {
    options.insert(style);
  } else {
    var target = getTarget(options.insert || 'head');

    if (!target) {
      throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
    }

    target.appendChild(style);
  }

  return style;
}

function removeStyleElement(style) {
  // istanbul ignore if
  if (style.parentNode === null) {
    return false;
  }

  style.parentNode.removeChild(style);
}
/* istanbul ignore next  */


var replaceText = function replaceText() {
  var textStore = [];
  return function replace(index, replacement) {
    textStore[index] = replacement;
    return textStore.filter(Boolean).join('\n');
  };
}();

function applyToSingletonTag(style, index, remove, obj) {
  var css = remove ? '' : obj.media ? "@media ".concat(obj.media, " {").concat(obj.css, "}") : obj.css; // For old IE

  /* istanbul ignore if  */

  if (style.styleSheet) {
    style.styleSheet.cssText = replaceText(index, css);
  } else {
    var cssNode = document.createTextNode(css);
    var childNodes = style.childNodes;

    if (childNodes[index]) {
      style.removeChild(childNodes[index]);
    }

    if (childNodes.length) {
      style.insertBefore(cssNode, childNodes[index]);
    } else {
      style.appendChild(cssNode);
    }
  }
}

function applyToTag(style, options, obj) {
  var css = obj.css;
  var media = obj.media;
  var sourceMap = obj.sourceMap;

  if (media) {
    style.setAttribute('media', media);
  } else {
    style.removeAttribute('media');
  }

  if (sourceMap && typeof btoa !== 'undefined') {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    while (style.firstChild) {
      style.removeChild(style.firstChild);
    }

    style.appendChild(document.createTextNode(css));
  }
}

var singleton = null;
var singletonCounter = 0;

function addStyle(obj, options) {
  var style;
  var update;
  var remove;

  if (options.singleton) {
    var styleIndex = singletonCounter++;
    style = singleton || (singleton = insertStyleElement(options));
    update = applyToSingletonTag.bind(null, style, styleIndex, false);
    remove = applyToSingletonTag.bind(null, style, styleIndex, true);
  } else {
    style = insertStyleElement(options);
    update = applyToTag.bind(null, style, options);

    remove = function remove() {
      removeStyleElement(style);
    };
  }

  update(obj);
  return function updateStyle(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) {
        return;
      }

      update(obj = newObj);
    } else {
      remove();
    }
  };
}

module.exports = function (list, options) {
  options = options || {}; // Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
  // tags it will allow on a page

  if (!options.singleton && typeof options.singleton !== 'boolean') {
    options.singleton = isOldIE();
  }

  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    if (Object.prototype.toString.call(newList) !== '[object Array]') {
      return;
    }

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDom[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDom[_index].references === 0) {
        stylesInDom[_index].updater();

        stylesInDom.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),
/* 3 */
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
/* harmony import */ var _css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5);
/* harmony import */ var _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".glide{position:relative;width:100%;box-sizing:border-box}.glide *{box-sizing:inherit}.glide__track{overflow:hidden}.glide__slides{position:relative;width:100%;list-style:none;backface-visibility:hidden;transform-style:preserve-3d;touch-action:pan-Y;overflow:hidden;margin:0;padding:0;white-space:nowrap;display:flex;flex-wrap:nowrap;will-change:transform}.glide__slides--dragging{user-select:none}.glide__slide{width:100%;height:100%;flex-shrink:0;white-space:normal;user-select:none;-webkit-touch-callout:none;-webkit-tap-highlight-color:transparent}.glide__slide a{user-select:none;-webkit-user-drag:none;-moz-user-select:none;-ms-user-select:none}.glide__arrows{-webkit-touch-callout:none;user-select:none}.glide__bullets{-webkit-touch-callout:none;user-select:none}.glide--rtl{direction:rtl}/*# sourceMappingURL=glide.core.min.css.map */\n", "",{"version":3,"sources":["webpack://./node_modules/@glidejs/glide/src/assets/sass/glide.core.scss"],"names":[],"mappings":"AAEA,OAME,iBAAA,CACA,UAAA,CACA,qBAAA,CAEA,SACE,kBAAA,CAGF,cACE,eAAA,CAGF,eACE,iBAAA,CACA,UAAA,CACA,eAAA,CACA,0BAAA,CACA,2BAAA,CACA,kBAAA,CACA,eAAA,CACA,QAAA,CACA,SAAA,CACA,kBAAA,CACA,YAAA,CACA,gBAAA,CACA,qBAAA,CAEA,yBACE,gBAAA,CAIJ,cACE,UAAA,CACA,WAAA,CACA,aAAA,CACA,kBAAA,CACA,gBAAA,CACA,0BAAA,CACA,uCAAA,CAEA,gBACE,gBAAA,CACA,sBAAA,CACA,qBAAA,CACA,oBAAA,CAIJ,eACE,0BAAA,CACA,gBAAA,CAGF,gBACE,0BAAA,CACA,gBAAA,CAGF,YACE,aAAA,CAAA,6CAAA","sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),
/* 4 */
/***/ ((module) => {

"use strict";


function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]); if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

module.exports = function cssWithMappingToString(item) {
  var _item = _slicedToArray(item, 4),
      content = _item[1],
      cssMapping = _item[3];

  if (typeof btoa === "function") {
    // eslint-disable-next-line no-undef
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot || "").concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join("\n");
  }

  return [content].join("\n");
};

/***/ }),
/* 5 */
/***/ ((module) => {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
// eslint-disable-next-line func-names
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item);

      if (item[2]) {
        return "@media ".concat(item[2], " {").concat(content, "}");
      }

      return content;
    }).join("");
  }; // import a list of modules into the list
  // eslint-disable-next-line func-names


  list.i = function (modules, mediaQuery, dedupe) {
    if (typeof modules === "string") {
      // eslint-disable-next-line no-param-reassign
      modules = [[null, modules, ""]];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var i = 0; i < this.length; i++) {
        // eslint-disable-next-line prefer-destructuring
        var id = this[i][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _i = 0; _i < modules.length; _i++) {
      var item = [].concat(modules[_i]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        // eslint-disable-next-line no-continue
        continue;
      }

      if (mediaQuery) {
        if (!item[2]) {
          item[2] = mediaQuery;
        } else {
          item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _css_loader_dist_cjs_js_glide_theme_min_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7);

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_css_loader_dist_cjs_js_glide_theme_min_css__WEBPACK_IMPORTED_MODULE_1__.default, options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_css_loader_dist_cjs_js_glide_theme_min_css__WEBPACK_IMPORTED_MODULE_1__.default.locals || {});

/***/ }),
/* 7 */
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
/* harmony import */ var _css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5);
/* harmony import */ var _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".glide__arrow{position:absolute;display:block;top:50%;z-index:2;color:#fff;text-transform:uppercase;padding:9px 12px;background-color:transparent;border:2px solid rgba(255,255,255,.5);border-radius:4px;box-shadow:0 .25em .5em 0 rgba(0,0,0,.1);text-shadow:0 .25em .5em rgba(0,0,0,.1);opacity:1;cursor:pointer;transition:opacity 150ms ease,border 300ms ease-in-out;transform:translateY(-50%);line-height:1}.glide__arrow:focus{outline:none}.glide__arrow:hover{border-color:#fff}.glide__arrow--left{left:2em}.glide__arrow--right{right:2em}.glide__arrow--disabled{opacity:.33}.glide__bullets{position:absolute;z-index:2;bottom:2em;left:50%;display:inline-flex;list-style:none;transform:translateX(-50%)}.glide__bullet{background-color:rgba(255,255,255,.5);width:9px;height:9px;padding:0;border-radius:50%;border:2px solid transparent;transition:all 300ms ease-in-out;cursor:pointer;line-height:0;box-shadow:0 .25em .5em 0 rgba(0,0,0,.1);margin:0 .25em}.glide__bullet:focus{outline:none}.glide__bullet:hover,.glide__bullet:focus{border:2px solid #fff;background-color:rgba(255,255,255,.5)}.glide__bullet--active{background-color:#fff}.glide--swipeable{cursor:grab;cursor:-moz-grab;cursor:-webkit-grab}.glide--dragging{cursor:grabbing;cursor:-moz-grabbing;cursor:-webkit-grabbing}/*# sourceMappingURL=glide.theme.min.css.map */\n", "",{"version":3,"sources":["webpack://./node_modules/@glidejs/glide/src/assets/sass/glide.theme.scss"],"names":[],"mappings":"AAQE,cACE,iBAAA,CACA,aAAA,CACA,OAAA,CACA,SAAA,CACA,UAAA,CACA,wBAAA,CACA,gBAAA,CACA,4BAAA,CACA,qCAAA,CACA,iBAAA,CACA,wCAAA,CACA,uCAAA,CACA,SAAA,CACA,cAAA,CACA,sDAAA,CACA,0BAAA,CACA,aAAA,CAEA,oBAAA,YAAA,CACA,oBAAA,iBAAA,CAEA,oBACE,QAAA,CAGF,qBACE,SAAA,CAGF,wBACE,WAAA,CAIJ,gBACE,iBAAA,CACA,SAAA,CACA,UAAA,CACA,QAAA,CACA,mBAAA,CACA,eAAA,CACA,0BAAA,CAGF,eACE,qCAAA,CACA,SAAA,CACA,UAAA,CACA,SAAA,CACA,iBAAA,CACA,4BAAA,CACA,gCAAA,CACA,cAAA,CACA,aAAA,CACA,wCAAA,CACA,cAAA,CAEA,qBACE,YAAA,CAGF,0CAEE,qBAAA,CACA,qCAAA,CAGF,uBACE,qBAAA,CAIJ,kBACE,WAAA,CACA,gBAAA,CACA,mBAAA,CAGF,iBACE,eAAA,CACA,oBAAA,CACA,uBAAA,CAAA,8CAAA","sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),
/* 8 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9);

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_1__.default, options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_1__.default.locals || {});

/***/ }),
/* 9 */
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(10);
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _images_mediterranean_jpg__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(11);
/* harmony import */ var _images_azores_jpg__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(12);
/* harmony import */ var _images_iceland_jpg__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(13);
/* harmony import */ var _images_montana_png__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(14);
/* harmony import */ var _images_mtstmichel_jpg__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(15);
/* harmony import */ var _images_namibia_jpg__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(16);
/* harmony import */ var _images_peru_jpg__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(17);
// Imports










var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default()));
var ___CSS_LOADER_URL_REPLACEMENT_0___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(_images_mediterranean_jpg__WEBPACK_IMPORTED_MODULE_3__.default);
var ___CSS_LOADER_URL_REPLACEMENT_1___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(_images_azores_jpg__WEBPACK_IMPORTED_MODULE_4__.default);
var ___CSS_LOADER_URL_REPLACEMENT_2___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(_images_iceland_jpg__WEBPACK_IMPORTED_MODULE_5__.default);
var ___CSS_LOADER_URL_REPLACEMENT_3___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(_images_montana_png__WEBPACK_IMPORTED_MODULE_6__.default);
var ___CSS_LOADER_URL_REPLACEMENT_4___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(_images_mtstmichel_jpg__WEBPACK_IMPORTED_MODULE_7__.default);
var ___CSS_LOADER_URL_REPLACEMENT_5___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(_images_namibia_jpg__WEBPACK_IMPORTED_MODULE_8__.default);
var ___CSS_LOADER_URL_REPLACEMENT_6___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(_images_peru_jpg__WEBPACK_IMPORTED_MODULE_9__.default);
// Module
___CSS_LOADER_EXPORT___.push([module.id, "* {\n  font-family: 'Europa', sans-serif;\n}\n\nhtml, body {\n  margin: 0;\n  padding: 0;\n  height: 100%;\n  width: 100%;\n  font-family: 'Europa', sans-serif;\n}\n\n.body-grid {\n  display: grid;\n  grid-template-rows: 1.3fr 4fr 1.3fr;\n}\n\nheader, footer {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n\n/* Traveler Page Backgrounds */\n\n.traveler-page0 {\n  background-image: url(" + ___CSS_LOADER_URL_REPLACEMENT_0___ + ");\n  background-size: cover;\n}\n\n.traveler-page1 {\n  background-image: url(" + ___CSS_LOADER_URL_REPLACEMENT_1___ + ");\n  background-size: cover;\n}\n\n.traveler-page2 {\n  background-image: url(" + ___CSS_LOADER_URL_REPLACEMENT_2___ + ");\n  background-size: cover;\n}\n\n.traveler-page3 {\n  background-image: url(" + ___CSS_LOADER_URL_REPLACEMENT_3___ + ");\n  background-size: cover;\n}\n\n.traveler-page4 {\n  background-image: url(" + ___CSS_LOADER_URL_REPLACEMENT_4___ + ");\n  background-size: cover;\n}\n\n.traveler-page5 {\n  background-image: url(" + ___CSS_LOADER_URL_REPLACEMENT_5___ + ");\n  background-size: cover;\n}\n\n.traveler-page6 {\n  background-image: url(" + ___CSS_LOADER_URL_REPLACEMENT_6___ + ");\n  background-size: cover;\n}\n\n/* Navigation Bar */\n\nnav {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  width: 35%;\n  height: 25%;\n  border-radius: 15px;\n  background-color:rgb(255, 255, 255, 0.85);\n}\n\n.nav-separator {\n  height: 50%;\n  width: 1px;\n  background: black;\n}\n\n/* Navigation Bar: Buttons */\n\n.nav-btns {\n  height: 100%;\n  width: 50%;\n  background: none;\n  border: none;\n  color: #363A45;\n  cursor: pointer;\n  font-size: 0.9rem;\n  font-weight: 700;\n  background-color: transparent;\n  position: relative;\n  z-index: 1;\n}\n\n.nav-btns::before {\n  content: \"\";\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  width: 0%;\n  height: 0%;\n  border-radius: 15px;\n  background-color: #00F1BD;\n  transform: translate(-50%, -50%);\n  transition: all 0.4s ease;\n  z-index: -1;\n}\n\n.nav-btns:hover {\n  background-color: transparent;\n  color: #363A45;\n}\n\n.nav-btns:hover::before {\n  width: 100%;\n  height: 100%;\n}\n\n/* Footer Search Bar */\n\nform {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  width: 90%;\n  height: 60%;\n}\n\n.input-holder {\n  display: flex;\n  justify-content: start;\n  align-items: center;\n  height: 40%;\n  min-height: 40%;\n  padding: 0 2%;\n  background-color: rgb(255, 255, 255, 0.85);\n  border-radius: 15px;\n  margin: 0 1rem;\n}\n\n.submit-btn {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  cursor: pointer;\n  height: 40%;\n  width: 10%;\n  border-radius: 15px;\n  background-color: rgb(255, 255, 255, 0.85);\n  color: #363A45;\n  margin: 0 1rem;\n}\n\n\n.trip-input, .login-input {\n  border: none;\n  text-align: center;\n  background: transparent;\n  color: black;\n  font-size: 0.8rem;\n  width: 80%;\n  font-weight: 600;\n}\n\n#date-picker {\n  color: black;\n}\n\n.destination-holder {\n  width: 20%;\n}\n\n.date-holder {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  width: 15%;\n}\n\n.date-label {\n  text-align: left;\n  width: 30%;\n}\n\n.calendar {\n  width: 60%;\n  font-weight: 400;\n  font-size: 0.8rem;\n}\n\n.travelers-holder {\n  width: 15%;\n}\n\n.search-icon {\n  height: 40%;\n  aspect-ratio: 1/1;\n  margin-right: 0.5rem;\n}\n\n.ss-main, .ss-values, .ss-single {\n  font-size: 0.8rem;\n  text-align: center;\n  font-family: 'Europa', sans-serif;\n}\n\n.ss-list, .ss-option {\n  background-color: white;\n  font-size: 0.8rem;\n  font-family: 'Europa', sans-serif;\n}\n\n/* Booking Confirmation Page */\n\n.booking-main, .login-main {\n  grid-row: 2;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n\n.confirm-booking-container, .status-info, .login-container {\n  display: grid;\n  grid-template-columns: 1.8fr 2fr;\n  grid-template-rows: 2fr 1fr;\n  width: 70%;\n  height: 80%;\n  background-color: rgb(255, 255, 255, 0.85);\n  border-radius: 25px;\n  padding: 2rem;\n}\n\n.confirm-booking-info {\n  grid-column: 1;\n  grid-row: 1;\n  width: 90%;\n  display: flex;\n  flex-direction: column;\n  justify-content: start;\n  align-items: start;\n}\n\n.confirm-booking-btns-container {\n  grid-column: 1;\n  grid-row: 2;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  justify-items: center;\n  width: 100%;\n  height: 100%;\n}\n\n.booking-btn, .login-btn {\n  height: 50%;\n  width: 48%;\n  background: white;\n  cursor: pointer;\n  border: none;\n  font-size: 0.9rem;\n  font-weight: 700;\n  border-radius: 15px;\n  -webkit-transition: ease-out 0.4s;\n  -moz-transition: ease-out 0.4s;\n  transition: ease-out 0.4s;\n}\n\n.confirm-btn, .login-btn {\n  box-shadow: inset 0 0 0 0 #00F1BD;\n}\n\n.confirm-btn:hover {\n  box-shadow: inset 0 100px 0 0 #00F1BD;\n}\n\n.cancel-btn {\n  box-shadow: inset 0 0 0 0 #F17171;\n}\n\n.cancel-btn:hover {\n  box-shadow: inset 0 100px 0 0 #F17171;\n}\n\n.confirm-booking-details-box, .slide-details-box {\n  display: flex;\n  justify-content: flex-start;\n  align-items: center;\n  width: 100%;\n  height: 40px;\n  background: rgb(255, 255, 255, 0.85);\n  border-radius: 15px;\n  margin: 0.5rem 0;\n  padding: 0 1.5rem;\n}\n\n.booking-detail-header {\n  font-size: 0.9rem;\n  font-weight: 700;\n  margin-block-end: 0;\n  margin-block-start: 0;\n}\n\n.booking-detail-text {\n  position: absolute;\n  font-size: 0.9rem;\n  left: 25%;\n}\n\n.confirm-booking-img-container {\n  grid-column: 2;\n  grid-row: 1 / span 2;\n  display: flex;\n  justify-content: flex-end;\n  align-items: center;\n  margin-right: 2.5rem;\n}\n\n.confirm-booking-img-bounding-box {\n  position: relative;\n  overflow: hidden;\n  border-radius: 15px;\n  width: 80%;\n  aspect-ratio: 1/1;\n}\n\n.confirm-booking-img {\n  max-width: 150%;\n  max-height: 100%;\n}\n\n.booking-confirmation-title, .slide-title {\n  font-size: 1.5rem;\n  font-weight: 700;\n  margin-block-end: 0.5rem;\n}\n\n.booking-confirmation-title-subtext {\n  margin-block-start: 0.1rem;\n}\n\n.status-info {\n  display: flex;\n  flex-direction: column;\n  justify-content: start;\n  align-items: center;\n  width: 100%;\n  height: 40%;\n}\n\n.status-title {\n  font-family: 'Hobo Std', sans-serif;\n  font-size: 3rem;\n  font-weight: 700;\n  margin-block-end: 0.1rem;\n  display: block;\n}\n\n.status-subtext {\n  font-family: 'Hobo Std', sans-serif;\n  font-size: 1.5rem;\n  color: #363A45;\n  display: block;\n  text-align: center;\n}\n\n/* My Trips Page */\n\n.main-carousel {\n  position: absolute;\n  top: 10%;\n  left: 0;\n  width: 100%;\n  height: 70%;\n}\n\n.carousel-footer {\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  width: 100%;\n  height: 20%;\n  border-radius: 25px;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n\n.glide-wrap {\n  height: 600px;\n  margin: 0 auto;\n  width: 90%;\n}\n\n.glide__slide {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  padding: 1rem 2rem;\n  border: 1px solid black;\n  border-radius: 25px;\n  margin: 0 1rem;\n  background-color: rgb(255, 255, 255, 0.85);\n  margin: 0;\n  text-align: center;\n  max-height: 100%;\n  min-width: 0;\n}\n\n.slide-text-container {\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: center;\n  align-items: center;\n  height: 40%;\n}\n\n.slide-details-box {\n  height: 40px;\n}\n\n.slide-title {\n  margin-block-start: 0.2rem;\n  font-size: 1.3rem;\n}\n\n.slide-header {\n  font-size: 1.1rem;\n  font-weight: 700;\n}\n\n.summary-header {\n  text-align: center;\n  height: 25px;\n}\n\n.trips-heading-box {\n  background: rgb(84, 84, 84);\n  color: white;\n  justify-content: center;\n  height: 32px;\n}\n\n.slide-text {\n  margin-left: 1rem;\n}\n\n.glide__arrow--right, .glide__arrow--left {\n  background-color: rgb(0, 0, 0, 0.8);\n  color: white;\n  border: none;\n  font-weight: 700;\n}\n\n.glide__arrow--right:hover, .glide__arrow--left:hover {\n  background-color: white;\n  color: black;\n}\n\n.glide__arrow--left {\n  transform: translateX(-80px);\n}\n\n.glide__arrow--right {\n  transform: translateX(80px);\n}\n\n.slide-img-container {\n  position: relative;\n  overflow: hidden;\n  border-radius: 15px;\n  width: 100%;\n  height: 200px;\n}\n\n.slide-img {\n  max-width: 150%;\n  max-height: 130%;\n}\n\n.Upcoming {\n  background-color: #00F1BD;\n}\n\n.Past {\n  background-color: #b9faed;\n}\n\n.Pending {\n  background-color: #F1C400;\n}\n\n/* Login Page */\n\n.login-container {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  height: 40%;\n  width: 40%;\n}\n\n.login-info-box {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 80%;\n  width: 40%;\n}\n\n.login-form {\n  flex-direction: column;\n  width: 50%;\n}\n\n.login-header {\n  font-family: 'Droid', sans-serif;\n  width: 70%;\n  font-size: 1.8rem;\n  margin-block-start: 0.2rem;\n  margin-block-end: 0.3rem;\n  text-align: center;\n  font-weight: 800;\n}\n\n.login-btn {\n  width: 100%;\n  height: auto;\n  margin-top: 0.3rem;\n  padding: 0.2rem 0;\n}\n\n.login-input {\n  background: white;\n  width: 100%;\n  padding: 0.3rem 0;\n  border-radius: 15px;\n  margin: 0.3rem 0;\n}\n\n.login-btn:hover {\n  box-shadow: inset 400px 0 0 0 #00F1BD;\n}\n\n/* Login Error Messages */\n\n.login-error-header {\n  font-size: 1.5rem;\n  font-weight: 700;\n  margin-block-start: 0.2rem;\n  margin-block-end: 0.1rem;\n  text-align: center;\n}\n\n.login-error {\n  font-size: 1rem;\n  font-weight: 500;\n  margin-block-start: 0.75rem;\n  margin-block-end: 0.1rem;\n  text-align: center;\n}\n\n/* Login Success Message */\n\n.login-success-backer {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  background: rgb(255,255,255, 0.1);\n  backdrop-filter: blur(8px);\n}\n\n.login-success-container {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  height: 20%;\n  width: 35%;\n}\n\n.toucan-icon-wrapper {\n  height: 200%;\n  width: 30%;\n  background-size: cover;\n  background-position: center;\n  background-repeat: no-repeat;\n}\n\n.toucan-icon {\n  height: 100%;\n  width: 100%;\n}\n\n.login-success-header {\n  font-family: 'Droid', sans-serif;\n  font-size: 3.5rem;\n  font-weight: 700;\n  margin-block-start: 0.2rem;\n  margin-block-end: 0.1rem;\n  text-align: center;\n}\n\n.welcome-message {\n  font-size: 1.5rem;\n  font-weight: 500;\n  color:black;\n}\n\n.welcome-container {\n  justify-content: center;\n}\n\n.welcome-backer {\n  background: rgb(255,255,255,0.3);\n}\n\n\n.welcome-message {\n  font-size: 1.5rem;\n  font-weight: 500;\n  color: black;\n  animation: fadeInOut 5s ease-in-out;\n}\n\n@keyframes fadeInOut {\n  0% {\n    opacity: 0;\n  }\n  10% {\n    opacity: 1;\n  }\n  70% {\n    opacity: 1;\n  }\n  100% {\n    opacity: 0;\n  }\n}", "",{"version":3,"sources":["webpack://./src/css/styles.css"],"names":[],"mappings":"AAAA;EACE,iCAAiC;AACnC;;AAEA;EACE,SAAS;EACT,UAAU;EACV,YAAY;EACZ,WAAW;EACX,iCAAiC;AACnC;;AAEA;EACE,aAAa;EACb,mCAAmC;AACrC;;AAEA;EACE,aAAa;EACb,uBAAuB;EACvB,mBAAmB;AACrB;;AAEA,8BAA8B;;AAE9B;EACE,yDAAkD;EAClD,sBAAsB;AACxB;;AAEA;EACE,yDAA2C;EAC3C,sBAAsB;AACxB;;AAEA;EACE,yDAA4C;EAC5C,sBAAsB;AACxB;;AAEA;EACE,yDAA4C;EAC5C,sBAAsB;AACxB;;AAEA;EACE,yDAA+C;EAC/C,sBAAsB;AACxB;;AAEA;EACE,yDAA4C;EAC5C,sBAAsB;AACxB;;AAEA;EACE,yDAAyC;EACzC,sBAAsB;AACxB;;AAEA,mBAAmB;;AAEnB;EACE,aAAa;EACb,uBAAuB;EACvB,mBAAmB;EACnB,UAAU;EACV,WAAW;EACX,mBAAmB;EACnB,yCAAyC;AAC3C;;AAEA;EACE,WAAW;EACX,UAAU;EACV,iBAAiB;AACnB;;AAEA,4BAA4B;;AAE5B;EACE,YAAY;EACZ,UAAU;EACV,gBAAgB;EAChB,YAAY;EACZ,cAAc;EACd,eAAe;EACf,iBAAiB;EACjB,gBAAgB;EAChB,6BAA6B;EAC7B,kBAAkB;EAClB,UAAU;AACZ;;AAEA;EACE,WAAW;EACX,kBAAkB;EAClB,QAAQ;EACR,SAAS;EACT,SAAS;EACT,UAAU;EACV,mBAAmB;EACnB,yBAAyB;EACzB,gCAAgC;EAChC,yBAAyB;EACzB,WAAW;AACb;;AAEA;EACE,6BAA6B;EAC7B,cAAc;AAChB;;AAEA;EACE,WAAW;EACX,YAAY;AACd;;AAEA,sBAAsB;;AAEtB;EACE,aAAa;EACb,uBAAuB;EACvB,mBAAmB;EACnB,UAAU;EACV,WAAW;AACb;;AAEA;EACE,aAAa;EACb,sBAAsB;EACtB,mBAAmB;EACnB,WAAW;EACX,eAAe;EACf,aAAa;EACb,0CAA0C;EAC1C,mBAAmB;EACnB,cAAc;AAChB;;AAEA;EACE,aAAa;EACb,uBAAuB;EACvB,mBAAmB;EACnB,eAAe;EACf,WAAW;EACX,UAAU;EACV,mBAAmB;EACnB,0CAA0C;EAC1C,cAAc;EACd,cAAc;AAChB;;;AAGA;EACE,YAAY;EACZ,kBAAkB;EAClB,uBAAuB;EACvB,YAAY;EACZ,iBAAiB;EACjB,UAAU;EACV,gBAAgB;AAClB;;AAEA;EACE,YAAY;AACd;;AAEA;EACE,UAAU;AACZ;;AAEA;EACE,aAAa;EACb,uBAAuB;EACvB,mBAAmB;EACnB,UAAU;AACZ;;AAEA;EACE,gBAAgB;EAChB,UAAU;AACZ;;AAEA;EACE,UAAU;EACV,gBAAgB;EAChB,iBAAiB;AACnB;;AAEA;EACE,UAAU;AACZ;;AAEA;EACE,WAAW;EACX,iBAAiB;EACjB,oBAAoB;AACtB;;AAEA;EACE,iBAAiB;EACjB,kBAAkB;EAClB,iCAAiC;AACnC;;AAEA;EACE,uBAAuB;EACvB,iBAAiB;EACjB,iCAAiC;AACnC;;AAEA,8BAA8B;;AAE9B;EACE,WAAW;EACX,aAAa;EACb,uBAAuB;EACvB,mBAAmB;AACrB;;AAEA;EACE,aAAa;EACb,gCAAgC;EAChC,2BAA2B;EAC3B,UAAU;EACV,WAAW;EACX,0CAA0C;EAC1C,mBAAmB;EACnB,aAAa;AACf;;AAEA;EACE,cAAc;EACd,WAAW;EACX,UAAU;EACV,aAAa;EACb,sBAAsB;EACtB,sBAAsB;EACtB,kBAAkB;AACpB;;AAEA;EACE,cAAc;EACd,WAAW;EACX,aAAa;EACb,8BAA8B;EAC9B,mBAAmB;EACnB,qBAAqB;EACrB,WAAW;EACX,YAAY;AACd;;AAEA;EACE,WAAW;EACX,UAAU;EACV,iBAAiB;EACjB,eAAe;EACf,YAAY;EACZ,iBAAiB;EACjB,gBAAgB;EAChB,mBAAmB;EACnB,iCAAiC;EACjC,8BAA8B;EAC9B,yBAAyB;AAC3B;;AAEA;EACE,iCAAiC;AACnC;;AAEA;EACE,qCAAqC;AACvC;;AAEA;EACE,iCAAiC;AACnC;;AAEA;EACE,qCAAqC;AACvC;;AAEA;EACE,aAAa;EACb,2BAA2B;EAC3B,mBAAmB;EACnB,WAAW;EACX,YAAY;EACZ,oCAAoC;EACpC,mBAAmB;EACnB,gBAAgB;EAChB,iBAAiB;AACnB;;AAEA;EACE,iBAAiB;EACjB,gBAAgB;EAChB,mBAAmB;EACnB,qBAAqB;AACvB;;AAEA;EACE,kBAAkB;EAClB,iBAAiB;EACjB,SAAS;AACX;;AAEA;EACE,cAAc;EACd,oBAAoB;EACpB,aAAa;EACb,yBAAyB;EACzB,mBAAmB;EACnB,oBAAoB;AACtB;;AAEA;EACE,kBAAkB;EAClB,gBAAgB;EAChB,mBAAmB;EACnB,UAAU;EACV,iBAAiB;AACnB;;AAEA;EACE,eAAe;EACf,gBAAgB;AAClB;;AAEA;EACE,iBAAiB;EACjB,gBAAgB;EAChB,wBAAwB;AAC1B;;AAEA;EACE,0BAA0B;AAC5B;;AAEA;EACE,aAAa;EACb,sBAAsB;EACtB,sBAAsB;EACtB,mBAAmB;EACnB,WAAW;EACX,WAAW;AACb;;AAEA;EACE,mCAAmC;EACnC,eAAe;EACf,gBAAgB;EAChB,wBAAwB;EACxB,cAAc;AAChB;;AAEA;EACE,mCAAmC;EACnC,iBAAiB;EACjB,cAAc;EACd,cAAc;EACd,kBAAkB;AACpB;;AAEA,kBAAkB;;AAElB;EACE,kBAAkB;EAClB,QAAQ;EACR,OAAO;EACP,WAAW;EACX,WAAW;AACb;;AAEA;EACE,kBAAkB;EAClB,SAAS;EACT,OAAO;EACP,WAAW;EACX,WAAW;EACX,mBAAmB;EACnB,aAAa;EACb,uBAAuB;EACvB,mBAAmB;AACrB;;AAEA;EACE,aAAa;EACb,cAAc;EACd,UAAU;AACZ;;AAEA;EACE,aAAa;EACb,sBAAsB;EACtB,uBAAuB;EACvB,mBAAmB;EACnB,kBAAkB;EAClB,uBAAuB;EACvB,mBAAmB;EACnB,cAAc;EACd,0CAA0C;EAC1C,SAAS;EACT,kBAAkB;EAClB,gBAAgB;EAChB,YAAY;AACd;;AAEA;EACE,aAAa;EACb,eAAe;EACf,uBAAuB;EACvB,mBAAmB;EACnB,WAAW;AACb;;AAEA;EACE,YAAY;AACd;;AAEA;EACE,0BAA0B;EAC1B,iBAAiB;AACnB;;AAEA;EACE,iBAAiB;EACjB,gBAAgB;AAClB;;AAEA;EACE,kBAAkB;EAClB,YAAY;AACd;;AAEA;EACE,2BAA2B;EAC3B,YAAY;EACZ,uBAAuB;EACvB,YAAY;AACd;;AAEA;EACE,iBAAiB;AACnB;;AAEA;EACE,mCAAmC;EACnC,YAAY;EACZ,YAAY;EACZ,gBAAgB;AAClB;;AAEA;EACE,uBAAuB;EACvB,YAAY;AACd;;AAEA;EACE,4BAA4B;AAC9B;;AAEA;EACE,2BAA2B;AAC7B;;AAEA;EACE,kBAAkB;EAClB,gBAAgB;EAChB,mBAAmB;EACnB,WAAW;EACX,aAAa;AACf;;AAEA;EACE,eAAe;EACf,gBAAgB;AAClB;;AAEA;EACE,yBAAyB;AAC3B;;AAEA;EACE,yBAAyB;AAC3B;;AAEA;EACE,yBAAyB;AAC3B;;AAEA,eAAe;;AAEf;EACE,aAAa;EACb,sBAAsB;EACtB,uBAAuB;EACvB,mBAAmB;EACnB,WAAW;EACX,UAAU;AACZ;;AAEA;EACE,aAAa;EACb,uBAAuB;EACvB,mBAAmB;EACnB,WAAW;EACX,UAAU;AACZ;;AAEA;EACE,sBAAsB;EACtB,UAAU;AACZ;;AAEA;EACE,gCAAgC;EAChC,UAAU;EACV,iBAAiB;EACjB,0BAA0B;EAC1B,wBAAwB;EACxB,kBAAkB;EAClB,gBAAgB;AAClB;;AAEA;EACE,WAAW;EACX,YAAY;EACZ,kBAAkB;EAClB,iBAAiB;AACnB;;AAEA;EACE,iBAAiB;EACjB,WAAW;EACX,iBAAiB;EACjB,mBAAmB;EACnB,gBAAgB;AAClB;;AAEA;EACE,qCAAqC;AACvC;;AAEA,yBAAyB;;AAEzB;EACE,iBAAiB;EACjB,gBAAgB;EAChB,0BAA0B;EAC1B,wBAAwB;EACxB,kBAAkB;AACpB;;AAEA;EACE,eAAe;EACf,gBAAgB;EAChB,2BAA2B;EAC3B,wBAAwB;EACxB,kBAAkB;AACpB;;AAEA,0BAA0B;;AAE1B;EACE,kBAAkB;EAClB,MAAM;EACN,QAAQ;EACR,SAAS;EACT,OAAO;EACP,aAAa;EACb,uBAAuB;EACvB,mBAAmB;EACnB,iCAAiC;EACjC,0BAA0B;AAC5B;;AAEA;EACE,aAAa;EACb,8BAA8B;EAC9B,mBAAmB;EACnB,WAAW;EACX,UAAU;AACZ;;AAEA;EACE,YAAY;EACZ,UAAU;EACV,sBAAsB;EACtB,2BAA2B;EAC3B,4BAA4B;AAC9B;;AAEA;EACE,YAAY;EACZ,WAAW;AACb;;AAEA;EACE,gCAAgC;EAChC,iBAAiB;EACjB,gBAAgB;EAChB,0BAA0B;EAC1B,wBAAwB;EACxB,kBAAkB;AACpB;;AAEA;EACE,iBAAiB;EACjB,gBAAgB;EAChB,WAAW;AACb;;AAEA;EACE,uBAAuB;AACzB;;AAEA;EACE,gCAAgC;AAClC;;;AAGA;EACE,iBAAiB;EACjB,gBAAgB;EAChB,YAAY;EACZ,mCAAmC;AACrC;;AAEA;EACE;IACE,UAAU;EACZ;EACA;IACE,UAAU;EACZ;EACA;IACE,UAAU;EACZ;EACA;IACE,UAAU;EACZ;AACF","sourcesContent":["* {\n  font-family: 'Europa', sans-serif;\n}\n\nhtml, body {\n  margin: 0;\n  padding: 0;\n  height: 100%;\n  width: 100%;\n  font-family: 'Europa', sans-serif;\n}\n\n.body-grid {\n  display: grid;\n  grid-template-rows: 1.3fr 4fr 1.3fr;\n}\n\nheader, footer {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n\n/* Traveler Page Backgrounds */\n\n.traveler-page0 {\n  background-image: url(../images/mediterranean.jpg);\n  background-size: cover;\n}\n\n.traveler-page1 {\n  background-image: url(../images/azores.jpg);\n  background-size: cover;\n}\n\n.traveler-page2 {\n  background-image: url(../images/iceland.jpg);\n  background-size: cover;\n}\n\n.traveler-page3 {\n  background-image: url(../images/montana.png);\n  background-size: cover;\n}\n\n.traveler-page4 {\n  background-image: url(../images/mtstmichel.jpg);\n  background-size: cover;\n}\n\n.traveler-page5 {\n  background-image: url(../images/namibia.jpg);\n  background-size: cover;\n}\n\n.traveler-page6 {\n  background-image: url(../images/peru.jpg);\n  background-size: cover;\n}\n\n/* Navigation Bar */\n\nnav {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  width: 35%;\n  height: 25%;\n  border-radius: 15px;\n  background-color:rgb(255, 255, 255, 0.85);\n}\n\n.nav-separator {\n  height: 50%;\n  width: 1px;\n  background: black;\n}\n\n/* Navigation Bar: Buttons */\n\n.nav-btns {\n  height: 100%;\n  width: 50%;\n  background: none;\n  border: none;\n  color: #363A45;\n  cursor: pointer;\n  font-size: 0.9rem;\n  font-weight: 700;\n  background-color: transparent;\n  position: relative;\n  z-index: 1;\n}\n\n.nav-btns::before {\n  content: \"\";\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  width: 0%;\n  height: 0%;\n  border-radius: 15px;\n  background-color: #00F1BD;\n  transform: translate(-50%, -50%);\n  transition: all 0.4s ease;\n  z-index: -1;\n}\n\n.nav-btns:hover {\n  background-color: transparent;\n  color: #363A45;\n}\n\n.nav-btns:hover::before {\n  width: 100%;\n  height: 100%;\n}\n\n/* Footer Search Bar */\n\nform {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  width: 90%;\n  height: 60%;\n}\n\n.input-holder {\n  display: flex;\n  justify-content: start;\n  align-items: center;\n  height: 40%;\n  min-height: 40%;\n  padding: 0 2%;\n  background-color: rgb(255, 255, 255, 0.85);\n  border-radius: 15px;\n  margin: 0 1rem;\n}\n\n.submit-btn {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  cursor: pointer;\n  height: 40%;\n  width: 10%;\n  border-radius: 15px;\n  background-color: rgb(255, 255, 255, 0.85);\n  color: #363A45;\n  margin: 0 1rem;\n}\n\n\n.trip-input, .login-input {\n  border: none;\n  text-align: center;\n  background: transparent;\n  color: black;\n  font-size: 0.8rem;\n  width: 80%;\n  font-weight: 600;\n}\n\n#date-picker {\n  color: black;\n}\n\n.destination-holder {\n  width: 20%;\n}\n\n.date-holder {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  width: 15%;\n}\n\n.date-label {\n  text-align: left;\n  width: 30%;\n}\n\n.calendar {\n  width: 60%;\n  font-weight: 400;\n  font-size: 0.8rem;\n}\n\n.travelers-holder {\n  width: 15%;\n}\n\n.search-icon {\n  height: 40%;\n  aspect-ratio: 1/1;\n  margin-right: 0.5rem;\n}\n\n.ss-main, .ss-values, .ss-single {\n  font-size: 0.8rem;\n  text-align: center;\n  font-family: 'Europa', sans-serif;\n}\n\n.ss-list, .ss-option {\n  background-color: white;\n  font-size: 0.8rem;\n  font-family: 'Europa', sans-serif;\n}\n\n/* Booking Confirmation Page */\n\n.booking-main, .login-main {\n  grid-row: 2;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n\n.confirm-booking-container, .status-info, .login-container {\n  display: grid;\n  grid-template-columns: 1.8fr 2fr;\n  grid-template-rows: 2fr 1fr;\n  width: 70%;\n  height: 80%;\n  background-color: rgb(255, 255, 255, 0.85);\n  border-radius: 25px;\n  padding: 2rem;\n}\n\n.confirm-booking-info {\n  grid-column: 1;\n  grid-row: 1;\n  width: 90%;\n  display: flex;\n  flex-direction: column;\n  justify-content: start;\n  align-items: start;\n}\n\n.confirm-booking-btns-container {\n  grid-column: 1;\n  grid-row: 2;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  justify-items: center;\n  width: 100%;\n  height: 100%;\n}\n\n.booking-btn, .login-btn {\n  height: 50%;\n  width: 48%;\n  background: white;\n  cursor: pointer;\n  border: none;\n  font-size: 0.9rem;\n  font-weight: 700;\n  border-radius: 15px;\n  -webkit-transition: ease-out 0.4s;\n  -moz-transition: ease-out 0.4s;\n  transition: ease-out 0.4s;\n}\n\n.confirm-btn, .login-btn {\n  box-shadow: inset 0 0 0 0 #00F1BD;\n}\n\n.confirm-btn:hover {\n  box-shadow: inset 0 100px 0 0 #00F1BD;\n}\n\n.cancel-btn {\n  box-shadow: inset 0 0 0 0 #F17171;\n}\n\n.cancel-btn:hover {\n  box-shadow: inset 0 100px 0 0 #F17171;\n}\n\n.confirm-booking-details-box, .slide-details-box {\n  display: flex;\n  justify-content: flex-start;\n  align-items: center;\n  width: 100%;\n  height: 40px;\n  background: rgb(255, 255, 255, 0.85);\n  border-radius: 15px;\n  margin: 0.5rem 0;\n  padding: 0 1.5rem;\n}\n\n.booking-detail-header {\n  font-size: 0.9rem;\n  font-weight: 700;\n  margin-block-end: 0;\n  margin-block-start: 0;\n}\n\n.booking-detail-text {\n  position: absolute;\n  font-size: 0.9rem;\n  left: 25%;\n}\n\n.confirm-booking-img-container {\n  grid-column: 2;\n  grid-row: 1 / span 2;\n  display: flex;\n  justify-content: flex-end;\n  align-items: center;\n  margin-right: 2.5rem;\n}\n\n.confirm-booking-img-bounding-box {\n  position: relative;\n  overflow: hidden;\n  border-radius: 15px;\n  width: 80%;\n  aspect-ratio: 1/1;\n}\n\n.confirm-booking-img {\n  max-width: 150%;\n  max-height: 100%;\n}\n\n.booking-confirmation-title, .slide-title {\n  font-size: 1.5rem;\n  font-weight: 700;\n  margin-block-end: 0.5rem;\n}\n\n.booking-confirmation-title-subtext {\n  margin-block-start: 0.1rem;\n}\n\n.status-info {\n  display: flex;\n  flex-direction: column;\n  justify-content: start;\n  align-items: center;\n  width: 100%;\n  height: 40%;\n}\n\n.status-title {\n  font-family: 'Hobo Std', sans-serif;\n  font-size: 3rem;\n  font-weight: 700;\n  margin-block-end: 0.1rem;\n  display: block;\n}\n\n.status-subtext {\n  font-family: 'Hobo Std', sans-serif;\n  font-size: 1.5rem;\n  color: #363A45;\n  display: block;\n  text-align: center;\n}\n\n/* My Trips Page */\n\n.main-carousel {\n  position: absolute;\n  top: 10%;\n  left: 0;\n  width: 100%;\n  height: 70%;\n}\n\n.carousel-footer {\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  width: 100%;\n  height: 20%;\n  border-radius: 25px;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n\n.glide-wrap {\n  height: 600px;\n  margin: 0 auto;\n  width: 90%;\n}\n\n.glide__slide {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  padding: 1rem 2rem;\n  border: 1px solid black;\n  border-radius: 25px;\n  margin: 0 1rem;\n  background-color: rgb(255, 255, 255, 0.85);\n  margin: 0;\n  text-align: center;\n  max-height: 100%;\n  min-width: 0;\n}\n\n.slide-text-container {\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: center;\n  align-items: center;\n  height: 40%;\n}\n\n.slide-details-box {\n  height: 40px;\n}\n\n.slide-title {\n  margin-block-start: 0.2rem;\n  font-size: 1.3rem;\n}\n\n.slide-header {\n  font-size: 1.1rem;\n  font-weight: 700;\n}\n\n.summary-header {\n  text-align: center;\n  height: 25px;\n}\n\n.trips-heading-box {\n  background: rgb(84, 84, 84);\n  color: white;\n  justify-content: center;\n  height: 32px;\n}\n\n.slide-text {\n  margin-left: 1rem;\n}\n\n.glide__arrow--right, .glide__arrow--left {\n  background-color: rgb(0, 0, 0, 0.8);\n  color: white;\n  border: none;\n  font-weight: 700;\n}\n\n.glide__arrow--right:hover, .glide__arrow--left:hover {\n  background-color: white;\n  color: black;\n}\n\n.glide__arrow--left {\n  transform: translateX(-80px);\n}\n\n.glide__arrow--right {\n  transform: translateX(80px);\n}\n\n.slide-img-container {\n  position: relative;\n  overflow: hidden;\n  border-radius: 15px;\n  width: 100%;\n  height: 200px;\n}\n\n.slide-img {\n  max-width: 150%;\n  max-height: 130%;\n}\n\n.Upcoming {\n  background-color: #00F1BD;\n}\n\n.Past {\n  background-color: #b9faed;\n}\n\n.Pending {\n  background-color: #F1C400;\n}\n\n/* Login Page */\n\n.login-container {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  height: 40%;\n  width: 40%;\n}\n\n.login-info-box {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 80%;\n  width: 40%;\n}\n\n.login-form {\n  flex-direction: column;\n  width: 50%;\n}\n\n.login-header {\n  font-family: 'Droid', sans-serif;\n  width: 70%;\n  font-size: 1.8rem;\n  margin-block-start: 0.2rem;\n  margin-block-end: 0.3rem;\n  text-align: center;\n  font-weight: 800;\n}\n\n.login-btn {\n  width: 100%;\n  height: auto;\n  margin-top: 0.3rem;\n  padding: 0.2rem 0;\n}\n\n.login-input {\n  background: white;\n  width: 100%;\n  padding: 0.3rem 0;\n  border-radius: 15px;\n  margin: 0.3rem 0;\n}\n\n.login-btn:hover {\n  box-shadow: inset 400px 0 0 0 #00F1BD;\n}\n\n/* Login Error Messages */\n\n.login-error-header {\n  font-size: 1.5rem;\n  font-weight: 700;\n  margin-block-start: 0.2rem;\n  margin-block-end: 0.1rem;\n  text-align: center;\n}\n\n.login-error {\n  font-size: 1rem;\n  font-weight: 500;\n  margin-block-start: 0.75rem;\n  margin-block-end: 0.1rem;\n  text-align: center;\n}\n\n/* Login Success Message */\n\n.login-success-backer {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  background: rgb(255,255,255, 0.1);\n  backdrop-filter: blur(8px);\n}\n\n.login-success-container {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  height: 20%;\n  width: 35%;\n}\n\n.toucan-icon-wrapper {\n  height: 200%;\n  width: 30%;\n  background-size: cover;\n  background-position: center;\n  background-repeat: no-repeat;\n}\n\n.toucan-icon {\n  height: 100%;\n  width: 100%;\n}\n\n.login-success-header {\n  font-family: 'Droid', sans-serif;\n  font-size: 3.5rem;\n  font-weight: 700;\n  margin-block-start: 0.2rem;\n  margin-block-end: 0.1rem;\n  text-align: center;\n}\n\n.welcome-message {\n  font-size: 1.5rem;\n  font-weight: 500;\n  color:black;\n}\n\n.welcome-container {\n  justify-content: center;\n}\n\n.welcome-backer {\n  background: rgb(255,255,255,0.3);\n}\n\n\n.welcome-message {\n  font-size: 1.5rem;\n  font-weight: 500;\n  color: black;\n  animation: fadeInOut 5s ease-in-out;\n}\n\n@keyframes fadeInOut {\n  0% {\n    opacity: 0;\n  }\n  10% {\n    opacity: 1;\n  }\n  70% {\n    opacity: 1;\n  }\n  100% {\n    opacity: 0;\n  }\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),
/* 10 */
/***/ ((module) => {

"use strict";


module.exports = function (url, options) {
  if (!options) {
    // eslint-disable-next-line no-param-reassign
    options = {};
  } // eslint-disable-next-line no-underscore-dangle, no-param-reassign


  url = url && url.__esModule ? url.default : url;

  if (typeof url !== "string") {
    return url;
  } // If url is already wrapped in quotes, remove them


  if (/^['"].*['"]$/.test(url)) {
    // eslint-disable-next-line no-param-reassign
    url = url.slice(1, -1);
  }

  if (options.hash) {
    // eslint-disable-next-line no-param-reassign
    url += options.hash;
  } // Should url be wrapped?
  // See https://drafts.csswg.org/css-values-3/#urls


  if (/["'() \t\n]/.test(url) || options.needQuotes) {
    return "\"".concat(url.replace(/"/g, '\\"').replace(/\n/g, "\\n"), "\"");
  }

  return url;
};

/***/ }),
/* 11 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("images/mediterranean.jpg");

/***/ }),
/* 12 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("images/azores.jpg");

/***/ }),
/* 13 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("images/iceland.jpg");

/***/ }),
/* 14 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("images/montana.png");

/***/ }),
/* 15 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("images/mtstmichel.jpg");

/***/ }),
/* 16 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("images/namibia.jpg");

/***/ }),
/* 17 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("images/peru.jpg");

/***/ }),
/* 18 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("images/turing-logo.png");

/***/ }),
/* 19 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("images/toucan-icon.svg");

/***/ }),
/* 20 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class Traveler {
  constructor(traveler) {
    this.id = traveler.id;
    this.name = traveler.name;
    this.travelerType = traveler.travelerType;
  }

  getFirstName() {
    return this.name.split(' ')[0];
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Traveler);

/***/ }),
/* 21 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class Trips {
  constructor(tripsData) {
    this.data = tripsData;
  }

  getTripsByUserId(id) {
    return this.data.filter(trip => trip.userID === id);
  }

  getNewTripId() {
    let tripIds = this.data.map(trip => trip.id);
    return Math.max(...tripIds) + 1;
  };

  getUserTripsByStatus(id, status) {
    let userTrips = this.getTripsByUserId(id);
    return userTrips.filter(trip => trip.status === status);
  } 

  getUserTripsByDate(id, pastOrUpcoming, date) {
    let approvedTrips = this.getUserTripsByStatus(id, 'approved');
    if (pastOrUpcoming === 'past') {
      return approvedTrips.filter(trip => trip.date < date);
    } else if (pastOrUpcoming === 'upcoming') {
      return approvedTrips.filter(trip => trip.date > date);
    }
  }

  getFavoriteDestination(id) {
    let trips = this.getUserTripsByStatus(id, 'approved');
    let mostFrequented = trips.reduce((destinations, trip) => {
      if (!destinations[trip.destinationID]) {
        destinations[trip.destinationID] = 1;
      } else {
        destinations[trip.destinationID] += 1;
      }
      return destinations;
    }, {});
    console.log(mostFrequented)
    let favoriteDestination = Object.keys(mostFrequented).sort((a, b) => mostFrequented[b] - mostFrequented[a])[0];
    return Number(favoriteDestination);
  }

  calculateTotalSpent(id, destinations) {
    let trips = this.getUserTripsByStatus(id, 'approved');
    let totalSpent = trips.reduce((total, trip) => {
      total += destinations.calculateTripCost(trip.destinationID, trip.travelers, trip.duration);
      return total
    } , 0);
    return totalSpent;
  }
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Trips);

/***/ }),
/* 22 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class Destinations {
  constructor(destinationsData) {
    this.data = destinationsData;
  }

  getDestinationById(id) {
    return this.data.find(destination => destination.id === id);
  }

  calculateTripCost(id, travelers, duration) {
    let destination = this.getDestinationById(id);
    let lodgingCost = destination.estimatedLodgingCostPerDay * duration;
    let flightCost = destination.estimatedFlightCostPerPerson * travelers;
    let totalCost = Number(((lodgingCost + flightCost)*1.1).toFixed(2));
    return totalCost;
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Destinations);

/***/ }),
/* 23 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
let backgrounds = [
  './images/azores.jpg', 
  './images/iceland.jpg', 
  './images/mediterranean.jpg', 
  './images/mtstmichel.jpg', 
  './images/namibia.jpg', 
  './images/peru.jpg', 
  './images/montana.png'
];

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (backgrounds);

/***/ }),
/* 24 */
/***/ (function(module) {

!function(t,e){ true?module.exports=e():0}(this,(function(){"use strict";var t=1e3,e=6e4,n=36e5,r="millisecond",i="second",s="minute",u="hour",a="day",o="week",f="month",h="quarter",c="year",d="date",l="Invalid Date",$=/^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,y=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,M={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),ordinal:function(t){var e=["th","st","nd","rd"],n=t%100;return"["+t+(e[(n-20)%10]||e[n]||e[0])+"]"}},m=function(t,e,n){var r=String(t);return!r||r.length>=e?t:""+Array(e+1-r.length).join(n)+t},v={s:m,z:function(t){var e=-t.utcOffset(),n=Math.abs(e),r=Math.floor(n/60),i=n%60;return(e<=0?"+":"-")+m(r,2,"0")+":"+m(i,2,"0")},m:function t(e,n){if(e.date()<n.date())return-t(n,e);var r=12*(n.year()-e.year())+(n.month()-e.month()),i=e.clone().add(r,f),s=n-i<0,u=e.clone().add(r+(s?-1:1),f);return+(-(r+(n-i)/(s?i-u:u-i))||0)},a:function(t){return t<0?Math.ceil(t)||0:Math.floor(t)},p:function(t){return{M:f,y:c,w:o,d:a,D:d,h:u,m:s,s:i,ms:r,Q:h}[t]||String(t||"").toLowerCase().replace(/s$/,"")},u:function(t){return void 0===t}},g="en",D={};D[g]=M;var p=function(t){return t instanceof _},S=function t(e,n,r){var i;if(!e)return g;if("string"==typeof e){var s=e.toLowerCase();D[s]&&(i=s),n&&(D[s]=n,i=s);var u=e.split("-");if(!i&&u.length>1)return t(u[0])}else{var a=e.name;D[a]=e,i=a}return!r&&i&&(g=i),i||!r&&g},w=function(t,e){if(p(t))return t.clone();var n="object"==typeof e?e:{};return n.date=t,n.args=arguments,new _(n)},O=v;O.l=S,O.i=p,O.w=function(t,e){return w(t,{locale:e.$L,utc:e.$u,x:e.$x,$offset:e.$offset})};var _=function(){function M(t){this.$L=S(t.locale,null,!0),this.parse(t)}var m=M.prototype;return m.parse=function(t){this.$d=function(t){var e=t.date,n=t.utc;if(null===e)return new Date(NaN);if(O.u(e))return new Date;if(e instanceof Date)return new Date(e);if("string"==typeof e&&!/Z$/i.test(e)){var r=e.match($);if(r){var i=r[2]-1||0,s=(r[7]||"0").substring(0,3);return n?new Date(Date.UTC(r[1],i,r[3]||1,r[4]||0,r[5]||0,r[6]||0,s)):new Date(r[1],i,r[3]||1,r[4]||0,r[5]||0,r[6]||0,s)}}return new Date(e)}(t),this.$x=t.x||{},this.init()},m.init=function(){var t=this.$d;this.$y=t.getFullYear(),this.$M=t.getMonth(),this.$D=t.getDate(),this.$W=t.getDay(),this.$H=t.getHours(),this.$m=t.getMinutes(),this.$s=t.getSeconds(),this.$ms=t.getMilliseconds()},m.$utils=function(){return O},m.isValid=function(){return!(this.$d.toString()===l)},m.isSame=function(t,e){var n=w(t);return this.startOf(e)<=n&&n<=this.endOf(e)},m.isAfter=function(t,e){return w(t)<this.startOf(e)},m.isBefore=function(t,e){return this.endOf(e)<w(t)},m.$g=function(t,e,n){return O.u(t)?this[e]:this.set(n,t)},m.unix=function(){return Math.floor(this.valueOf()/1e3)},m.valueOf=function(){return this.$d.getTime()},m.startOf=function(t,e){var n=this,r=!!O.u(e)||e,h=O.p(t),l=function(t,e){var i=O.w(n.$u?Date.UTC(n.$y,e,t):new Date(n.$y,e,t),n);return r?i:i.endOf(a)},$=function(t,e){return O.w(n.toDate()[t].apply(n.toDate("s"),(r?[0,0,0,0]:[23,59,59,999]).slice(e)),n)},y=this.$W,M=this.$M,m=this.$D,v="set"+(this.$u?"UTC":"");switch(h){case c:return r?l(1,0):l(31,11);case f:return r?l(1,M):l(0,M+1);case o:var g=this.$locale().weekStart||0,D=(y<g?y+7:y)-g;return l(r?m-D:m+(6-D),M);case a:case d:return $(v+"Hours",0);case u:return $(v+"Minutes",1);case s:return $(v+"Seconds",2);case i:return $(v+"Milliseconds",3);default:return this.clone()}},m.endOf=function(t){return this.startOf(t,!1)},m.$set=function(t,e){var n,o=O.p(t),h="set"+(this.$u?"UTC":""),l=(n={},n[a]=h+"Date",n[d]=h+"Date",n[f]=h+"Month",n[c]=h+"FullYear",n[u]=h+"Hours",n[s]=h+"Minutes",n[i]=h+"Seconds",n[r]=h+"Milliseconds",n)[o],$=o===a?this.$D+(e-this.$W):e;if(o===f||o===c){var y=this.clone().set(d,1);y.$d[l]($),y.init(),this.$d=y.set(d,Math.min(this.$D,y.daysInMonth())).$d}else l&&this.$d[l]($);return this.init(),this},m.set=function(t,e){return this.clone().$set(t,e)},m.get=function(t){return this[O.p(t)]()},m.add=function(r,h){var d,l=this;r=Number(r);var $=O.p(h),y=function(t){var e=w(l);return O.w(e.date(e.date()+Math.round(t*r)),l)};if($===f)return this.set(f,this.$M+r);if($===c)return this.set(c,this.$y+r);if($===a)return y(1);if($===o)return y(7);var M=(d={},d[s]=e,d[u]=n,d[i]=t,d)[$]||1,m=this.$d.getTime()+r*M;return O.w(m,this)},m.subtract=function(t,e){return this.add(-1*t,e)},m.format=function(t){var e=this,n=this.$locale();if(!this.isValid())return n.invalidDate||l;var r=t||"YYYY-MM-DDTHH:mm:ssZ",i=O.z(this),s=this.$H,u=this.$m,a=this.$M,o=n.weekdays,f=n.months,h=function(t,n,i,s){return t&&(t[n]||t(e,r))||i[n].slice(0,s)},c=function(t){return O.s(s%12||12,t,"0")},d=n.meridiem||function(t,e,n){var r=t<12?"AM":"PM";return n?r.toLowerCase():r},$={YY:String(this.$y).slice(-2),YYYY:this.$y,M:a+1,MM:O.s(a+1,2,"0"),MMM:h(n.monthsShort,a,f,3),MMMM:h(f,a),D:this.$D,DD:O.s(this.$D,2,"0"),d:String(this.$W),dd:h(n.weekdaysMin,this.$W,o,2),ddd:h(n.weekdaysShort,this.$W,o,3),dddd:o[this.$W],H:String(s),HH:O.s(s,2,"0"),h:c(1),hh:c(2),a:d(s,u,!0),A:d(s,u,!1),m:String(u),mm:O.s(u,2,"0"),s:String(this.$s),ss:O.s(this.$s,2,"0"),SSS:O.s(this.$ms,3,"0"),Z:i};return r.replace(y,(function(t,e){return e||$[t]||i.replace(":","")}))},m.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},m.diff=function(r,d,l){var $,y=O.p(d),M=w(r),m=(M.utcOffset()-this.utcOffset())*e,v=this-M,g=O.m(this,M);return g=($={},$[c]=g/12,$[f]=g,$[h]=g/3,$[o]=(v-m)/6048e5,$[a]=(v-m)/864e5,$[u]=v/n,$[s]=v/e,$[i]=v/t,$)[y]||v,l?g:O.a(g)},m.daysInMonth=function(){return this.endOf(f).$D},m.$locale=function(){return D[this.$L]},m.locale=function(t,e){if(!t)return this.$L;var n=this.clone(),r=S(t,e,!0);return r&&(n.$L=r),n},m.clone=function(){return O.w(this.$d,this)},m.toDate=function(){return new Date(this.valueOf())},m.toJSON=function(){return this.isValid()?this.toISOString():null},m.toISOString=function(){return this.$d.toISOString()},m.toString=function(){return this.$d.toUTCString()},M}(),T=_.prototype;return w.prototype=T,[["$ms",r],["$s",i],["$m",s],["$H",u],["$W",a],["$M",f],["$y",c],["$D",d]].forEach((function(t){T[t[1]]=function(e){return this.$g(e,t[0],t[1])}})),w.extend=function(t,e){return t.$i||(t(e,_,w),t.$i=!0),w},w.locale=S,w.isDayjs=p,w.unix=function(t){return w(1e3*t)},w.en=D[g],w.Ls=D,w.p={},w}));

/***/ }),
/* 25 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Glide)
/* harmony export */ });
/*!
 * Glide.js v3.6.0
 * (c) 2013-2022 Jędrzej Chałubek (https://github.com/jedrzejchalubek/)
 * Released under the MIT License.
 */

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }

  return _assertThisInitialized(self);
}

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();

  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
        result;

    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;

      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return _possibleConstructorReturn(this, result);
  };
}

function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }

  return object;
}

function _get() {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get;
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);

      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);

      if (desc.get) {
        return desc.get.call(arguments.length < 3 ? target : receiver);
      }

      return desc.value;
    };
  }

  return _get.apply(this, arguments);
}

var defaults = {
  /**
   * Type of the movement.
   *
   * Available types:
   * `slider` - Rewinds slider to the start/end when it reaches the first or last slide.
   * `carousel` - Changes slides without starting over when it reaches the first or last slide.
   *
   * @type {String}
   */
  type: 'slider',

  /**
   * Start at specific slide number defined with zero-based index.
   *
   * @type {Number}
   */
  startAt: 0,

  /**
   * A number of slides visible on the single viewport.
   *
   * @type {Number}
   */
  perView: 1,

  /**
   * Focus currently active slide at a specified position in the track.
   *
   * Available inputs:
   * `center` - Current slide will be always focused at the center of a track.
   * `0,1,2,3...` - Current slide will be focused on the specified zero-based index.
   *
   * @type {String|Number}
   */
  focusAt: 0,

  /**
   * A size of the gap added between slides.
   *
   * @type {Number}
   */
  gap: 10,

  /**
   * Change slides after a specified interval. Use `false` for turning off autoplay.
   *
   * @type {Number|Boolean}
   */
  autoplay: false,

  /**
   * Stop autoplay on mouseover event.
   *
   * @type {Boolean}
   */
  hoverpause: true,

  /**
   * Allow for changing slides with left and right keyboard arrows.
   *
   * @type {Boolean}
   */
  keyboard: true,

  /**
   * Stop running `perView` number of slides from the end. Use this
   * option if you don't want to have an empty space after
   * a slider. Works only with `slider` type and a
   * non-centered `focusAt` setting.
   *
   * @type {Boolean}
   */
  bound: false,

  /**
   * Minimal swipe distance needed to change the slide. Use `false` for turning off a swiping.
   *
   * @type {Number|Boolean}
   */
  swipeThreshold: 80,

  /**
   * Minimal mouse drag distance needed to change the slide. Use `false` for turning off a dragging.
   *
   * @type {Number|Boolean}
   */
  dragThreshold: 120,

  /**
   * A number of slides moved on single swipe.
   *
   * Available types:
   * `` - Moves slider by one slide per swipe
   * `|` - Moves slider between views per swipe (number of slides defined in `perView` options)
   *
   * @type {String}
   */
  perSwipe: '',

  /**
   * Moving distance ratio of the slides on a swiping and dragging.
   *
   * @type {Number}
   */
  touchRatio: 0.5,

  /**
   * Angle required to activate slides moving on swiping or dragging.
   *
   * @type {Number}
   */
  touchAngle: 45,

  /**
   * Duration of the animation in milliseconds.
   *
   * @type {Number}
   */
  animationDuration: 400,

  /**
   * Allows looping the `slider` type. Slider will rewind to the first/last slide when it's at the start/end.
   *
   * @type {Boolean}
   */
  rewind: true,

  /**
   * Duration of the rewinding animation of the `slider` type in milliseconds.
   *
   * @type {Number}
   */
  rewindDuration: 800,

  /**
   * Easing function for the animation.
   *
   * @type {String}
   */
  animationTimingFunc: 'cubic-bezier(.165, .840, .440, 1)',

  /**
   * Wait for the animation to finish until the next user input can be processed
   *
   * @type {boolean}
   */
  waitForTransition: true,

  /**
   * Throttle costly events at most once per every wait milliseconds.
   *
   * @type {Number}
   */
  throttle: 10,

  /**
   * Moving direction mode.
   *
   * Available inputs:
   * - 'ltr' - left to right movement,
   * - 'rtl' - right to left movement.
   *
   * @type {String}
   */
  direction: 'ltr',

  /**
   * The distance value of the next and previous viewports which
   * have to peek in the current view. Accepts number and
   * pixels as a string. Left and right peeking can be
   * set up separately with a directions object.
   *
   * For example:
   * `100` - Peek 100px on the both sides.
   * { before: 100, after: 50 }` - Peek 100px on the left side and 50px on the right side.
   *
   * @type {Number|String|Object}
   */
  peek: 0,

  /**
   * Defines how many clones of current viewport will be generated.
   *
   * @type {Number}
   */
  cloningRatio: 1,

  /**
   * Collection of options applied at specified media breakpoints.
   * For example: display two slides per view under 800px.
   * `{
   *   '800px': {
   *     perView: 2
   *   }
   * }`
   */
  breakpoints: {},

  /**
   * Collection of internally used HTML classes.
   *
   * @todo Refactor `slider` and `carousel` properties to single `type: { slider: '', carousel: '' }` object
   * @type {Object}
   */
  classes: {
    swipeable: 'glide--swipeable',
    dragging: 'glide--dragging',
    direction: {
      ltr: 'glide--ltr',
      rtl: 'glide--rtl'
    },
    type: {
      slider: 'glide--slider',
      carousel: 'glide--carousel'
    },
    slide: {
      clone: 'glide__slide--clone',
      active: 'glide__slide--active'
    },
    arrow: {
      disabled: 'glide__arrow--disabled'
    },
    nav: {
      active: 'glide__bullet--active'
    }
  }
};

/**
 * Outputs warning message to the bowser console.
 *
 * @param  {String} msg
 * @return {Void}
 */
function warn(msg) {
  console.error("[Glide warn]: ".concat(msg));
}

/**
 * Converts value entered as number
 * or string to integer value.
 *
 * @param {String} value
 * @returns {Number}
 */
function toInt(value) {
  return parseInt(value);
}
/**
 * Converts value entered as number
 * or string to flat value.
 *
 * @param {String} value
 * @returns {Number}
 */

function toFloat(value) {
  return parseFloat(value);
}
/**
 * Indicates whether the specified value is a string.
 *
 * @param  {*}   value
 * @return {Boolean}
 */

function isString(value) {
  return typeof value === 'string';
}
/**
 * Indicates whether the specified value is an object.
 *
 * @param  {*} value
 * @return {Boolean}
 *
 * @see https://github.com/jashkenas/underscore
 */

function isObject(value) {
  var type = _typeof(value);

  return type === 'function' || type === 'object' && !!value; // eslint-disable-line no-mixed-operators
}
/**
 * Indicates whether the specified value is a function.
 *
 * @param  {*} value
 * @return {Boolean}
 */

function isFunction(value) {
  return typeof value === 'function';
}
/**
 * Indicates whether the specified value is undefined.
 *
 * @param  {*} value
 * @return {Boolean}
 */

function isUndefined(value) {
  return typeof value === 'undefined';
}
/**
 * Indicates whether the specified value is an array.
 *
 * @param  {*} value
 * @return {Boolean}
 */

function isArray(value) {
  return value.constructor === Array;
}

/**
 * Creates and initializes specified collection of extensions.
 * Each extension receives access to instance of glide and rest of components.
 *
 * @param {Object} glide
 * @param {Object} extensions
 *
 * @returns {Object}
 */

function mount(glide, extensions, events) {
  var components = {};

  for (var name in extensions) {
    if (isFunction(extensions[name])) {
      components[name] = extensions[name](glide, components, events);
    } else {
      warn('Extension must be a function');
    }
  }

  for (var _name in components) {
    if (isFunction(components[_name].mount)) {
      components[_name].mount();
    }
  }

  return components;
}

/**
 * Defines getter and setter property on the specified object.
 *
 * @param  {Object} obj         Object where property has to be defined.
 * @param  {String} prop        Name of the defined property.
 * @param  {Object} definition  Get and set definitions for the property.
 * @return {Void}
 */
function define(obj, prop, definition) {
  Object.defineProperty(obj, prop, definition);
}
/**
 * Sorts aphabetically object keys.
 *
 * @param  {Object} obj
 * @return {Object}
 */

function sortKeys(obj) {
  return Object.keys(obj).sort().reduce(function (r, k) {
    r[k] = obj[k];
    return r[k], r;
  }, {});
}
/**
 * Merges passed settings object with default options.
 *
 * @param  {Object} defaults
 * @param  {Object} settings
 * @return {Object}
 */

function mergeOptions(defaults, settings) {
  var options = Object.assign({}, defaults, settings); // `Object.assign` do not deeply merge objects, so we
  // have to do it manually for every nested object
  // in options. Although it does not look smart,
  // it's smaller and faster than some fancy
  // merging deep-merge algorithm script.

  if (settings.hasOwnProperty('classes')) {
    options.classes = Object.assign({}, defaults.classes, settings.classes);

    if (settings.classes.hasOwnProperty('direction')) {
      options.classes.direction = Object.assign({}, defaults.classes.direction, settings.classes.direction);
    }

    if (settings.classes.hasOwnProperty('type')) {
      options.classes.type = Object.assign({}, defaults.classes.type, settings.classes.type);
    }

    if (settings.classes.hasOwnProperty('slide')) {
      options.classes.slide = Object.assign({}, defaults.classes.slide, settings.classes.slide);
    }

    if (settings.classes.hasOwnProperty('arrow')) {
      options.classes.arrow = Object.assign({}, defaults.classes.arrow, settings.classes.arrow);
    }

    if (settings.classes.hasOwnProperty('nav')) {
      options.classes.nav = Object.assign({}, defaults.classes.nav, settings.classes.nav);
    }
  }

  if (settings.hasOwnProperty('breakpoints')) {
    options.breakpoints = Object.assign({}, defaults.breakpoints, settings.breakpoints);
  }

  return options;
}

var EventsBus = /*#__PURE__*/function () {
  /**
   * Construct a EventBus instance.
   *
   * @param {Object} events
   */
  function EventsBus() {
    var events = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, EventsBus);

    this.events = events;
    this.hop = events.hasOwnProperty;
  }
  /**
   * Adds listener to the specifed event.
   *
   * @param {String|Array} event
   * @param {Function} handler
   */


  _createClass(EventsBus, [{
    key: "on",
    value: function on(event, handler) {
      if (isArray(event)) {
        for (var i = 0; i < event.length; i++) {
          this.on(event[i], handler);
        }

        return;
      } // Create the event's object if not yet created


      if (!this.hop.call(this.events, event)) {
        this.events[event] = [];
      } // Add the handler to queue


      var index = this.events[event].push(handler) - 1; // Provide handle back for removal of event

      return {
        remove: function remove() {
          delete this.events[event][index];
        }
      };
    }
    /**
     * Runs registered handlers for specified event.
     *
     * @param {String|Array} event
     * @param {Object=} context
     */

  }, {
    key: "emit",
    value: function emit(event, context) {
      if (isArray(event)) {
        for (var i = 0; i < event.length; i++) {
          this.emit(event[i], context);
        }

        return;
      } // If the event doesn't exist, or there's no handlers in queue, just leave


      if (!this.hop.call(this.events, event)) {
        return;
      } // Cycle through events queue, fire!


      this.events[event].forEach(function (item) {
        item(context || {});
      });
    }
  }]);

  return EventsBus;
}();

var Glide$1 = /*#__PURE__*/function () {
  /**
   * Construct glide.
   *
   * @param  {String} selector
   * @param  {Object} options
   */
  function Glide(selector) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Glide);

    this._c = {};
    this._t = [];
    this._e = new EventsBus();
    this.disabled = false;
    this.selector = selector;
    this.settings = mergeOptions(defaults, options);
    this.index = this.settings.startAt;
  }
  /**
   * Initializes glide.
   *
   * @param {Object} extensions Collection of extensions to initialize.
   * @return {Glide}
   */


  _createClass(Glide, [{
    key: "mount",
    value: function mount$1() {
      var extensions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      this._e.emit('mount.before');

      if (isObject(extensions)) {
        this._c = mount(this, extensions, this._e);
      } else {
        warn('You need to provide a object on `mount()`');
      }

      this._e.emit('mount.after');

      return this;
    }
    /**
     * Collects an instance `translate` transformers.
     *
     * @param  {Array} transformers Collection of transformers.
     * @return {Void}
     */

  }, {
    key: "mutate",
    value: function mutate() {
      var transformers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      if (isArray(transformers)) {
        this._t = transformers;
      } else {
        warn('You need to provide a array on `mutate()`');
      }

      return this;
    }
    /**
     * Updates glide with specified settings.
     *
     * @param {Object} settings
     * @return {Glide}
     */

  }, {
    key: "update",
    value: function update() {
      var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      this.settings = mergeOptions(this.settings, settings);

      if (settings.hasOwnProperty('startAt')) {
        this.index = settings.startAt;
      }

      this._e.emit('update');

      return this;
    }
    /**
     * Change slide with specified pattern. A pattern must be in the special format:
     * `>` - Move one forward
     * `<` - Move one backward
     * `={i}` - Go to {i} zero-based slide (eq. '=1', will go to second slide)
     * `>>` - Rewinds to end (last slide)
     * `<<` - Rewinds to start (first slide)
     * `|>` - Move one viewport forward
     * `|<` - Move one viewport backward
     *
     * @param {String} pattern
     * @return {Glide}
     */

  }, {
    key: "go",
    value: function go(pattern) {
      this._c.Run.make(pattern);

      return this;
    }
    /**
     * Move track by specified distance.
     *
     * @param {String} distance
     * @return {Glide}
     */

  }, {
    key: "move",
    value: function move(distance) {
      this._c.Transition.disable();

      this._c.Move.make(distance);

      return this;
    }
    /**
     * Destroy instance and revert all changes done by this._c.
     *
     * @return {Glide}
     */

  }, {
    key: "destroy",
    value: function destroy() {
      this._e.emit('destroy');

      return this;
    }
    /**
     * Start instance autoplaying.
     *
     * @param {Boolean|Number} interval Run autoplaying with passed interval regardless of `autoplay` settings
     * @return {Glide}
     */

  }, {
    key: "play",
    value: function play() {
      var interval = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      if (interval) {
        this.settings.autoplay = interval;
      }

      this._e.emit('play');

      return this;
    }
    /**
     * Stop instance autoplaying.
     *
     * @return {Glide}
     */

  }, {
    key: "pause",
    value: function pause() {
      this._e.emit('pause');

      return this;
    }
    /**
     * Sets glide into a idle status.
     *
     * @return {Glide}
     */

  }, {
    key: "disable",
    value: function disable() {
      this.disabled = true;
      return this;
    }
    /**
     * Sets glide into a active status.
     *
     * @return {Glide}
     */

  }, {
    key: "enable",
    value: function enable() {
      this.disabled = false;
      return this;
    }
    /**
     * Adds cuutom event listener with handler.
     *
     * @param  {String|Array} event
     * @param  {Function} handler
     * @return {Glide}
     */

  }, {
    key: "on",
    value: function on(event, handler) {
      this._e.on(event, handler);

      return this;
    }
    /**
     * Checks if glide is a precised type.
     *
     * @param  {String} name
     * @return {Boolean}
     */

  }, {
    key: "isType",
    value: function isType(name) {
      return this.settings.type === name;
    }
    /**
     * Gets value of the core options.
     *
     * @return {Object}
     */

  }, {
    key: "settings",
    get: function get() {
      return this._o;
    }
    /**
     * Sets value of the core options.
     *
     * @param  {Object} o
     * @return {Void}
     */
    ,
    set: function set(o) {
      if (isObject(o)) {
        this._o = o;
      } else {
        warn('Options must be an `object` instance.');
      }
    }
    /**
     * Gets current index of the slider.
     *
     * @return {Object}
     */

  }, {
    key: "index",
    get: function get() {
      return this._i;
    }
    /**
     * Sets current index a slider.
     *
     * @return {Object}
     */
    ,
    set: function set(i) {
      this._i = toInt(i);
    }
    /**
     * Gets type name of the slider.
     *
     * @return {String}
     */

  }, {
    key: "type",
    get: function get() {
      return this.settings.type;
    }
    /**
     * Gets value of the idle status.
     *
     * @return {Boolean}
     */

  }, {
    key: "disabled",
    get: function get() {
      return this._d;
    }
    /**
     * Sets value of the idle status.
     *
     * @return {Boolean}
     */
    ,
    set: function set(status) {
      this._d = !!status;
    }
  }]);

  return Glide;
}();

function Run (Glide, Components, Events) {
  var Run = {
    /**
     * Initializes autorunning of the glide.
     *
     * @return {Void}
     */
    mount: function mount() {
      this._o = false;
    },

    /**
     * Makes glides running based on the passed moving schema.
     *
     * @param {String} move
     */
    make: function make(move) {
      var _this = this;

      if (!Glide.disabled) {
        !Glide.settings.waitForTransition || Glide.disable();
        this.move = move;
        Events.emit('run.before', this.move);
        this.calculate();
        Events.emit('run', this.move);
        Components.Transition.after(function () {
          if (_this.isStart()) {
            Events.emit('run.start', _this.move);
          }

          if (_this.isEnd()) {
            Events.emit('run.end', _this.move);
          }

          if (_this.isOffset()) {
            _this._o = false;
            Events.emit('run.offset', _this.move);
          }

          Events.emit('run.after', _this.move);
          Glide.enable();
        });
      }
    },

    /**
     * Calculates current index based on defined move.
     *
     * @return {Number|Undefined}
     */
    calculate: function calculate() {
      var move = this.move,
          length = this.length;
      var steps = move.steps,
          direction = move.direction; // By default assume that size of view is equal to one slide

      var viewSize = 1; // While direction is `=` we want jump to
      // a specified index described in steps.

      if (direction === '=') {
        // Check if bound is true, 
        // as we want to avoid whitespaces.
        if (Glide.settings.bound && toInt(steps) > length) {
          Glide.index = length;
          return;
        }

        Glide.index = steps;
        return;
      } // When pattern is equal to `>>` we want
      // fast forward to the last slide.


      if (direction === '>' && steps === '>') {
        Glide.index = length;
        return;
      } // When pattern is equal to `<<` we want
      // fast forward to the first slide.


      if (direction === '<' && steps === '<') {
        Glide.index = 0;
        return;
      } // pagination movement


      if (direction === '|') {
        viewSize = Glide.settings.perView || 1;
      } // we are moving forward


      if (direction === '>' || direction === '|' && steps === '>') {
        var index = calculateForwardIndex(viewSize);

        if (index > length) {
          this._o = true;
        }

        Glide.index = normalizeForwardIndex(index, viewSize);
        return;
      } // we are moving backward


      if (direction === '<' || direction === '|' && steps === '<') {
        var _index = calculateBackwardIndex(viewSize);

        if (_index < 0) {
          this._o = true;
        }

        Glide.index = normalizeBackwardIndex(_index, viewSize);
        return;
      }

      warn("Invalid direction pattern [".concat(direction).concat(steps, "] has been used"));
    },

    /**
     * Checks if we are on the first slide.
     *
     * @return {Boolean}
     */
    isStart: function isStart() {
      return Glide.index <= 0;
    },

    /**
     * Checks if we are on the last slide.
     *
     * @return {Boolean}
     */
    isEnd: function isEnd() {
      return Glide.index >= this.length;
    },

    /**
     * Checks if we are making a offset run.
     *
     * @param {String} direction
     * @return {Boolean}
     */
    isOffset: function isOffset() {
      var direction = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

      if (!direction) {
        return this._o;
      }

      if (!this._o) {
        return false;
      } // did we view to the right?


      if (direction === '|>') {
        return this.move.direction === '|' && this.move.steps === '>';
      } // did we view to the left?


      if (direction === '|<') {
        return this.move.direction === '|' && this.move.steps === '<';
      }

      return this.move.direction === direction;
    },

    /**
     * Checks if bound mode is active
     *
     * @return {Boolean}
     */
    isBound: function isBound() {
      return Glide.isType('slider') && Glide.settings.focusAt !== 'center' && Glide.settings.bound;
    }
  };
  /**
   * Returns index value to move forward/to the right
   *
   * @param viewSize
   * @returns {Number}
   */

  function calculateForwardIndex(viewSize) {
    var index = Glide.index;

    if (Glide.isType('carousel')) {
      return index + viewSize;
    }

    return index + (viewSize - index % viewSize);
  }
  /**
   * Normalizes the given forward index based on glide settings, preventing it to exceed certain boundaries
   *
   * @param index
   * @param length
   * @param viewSize
   * @returns {Number}
   */


  function normalizeForwardIndex(index, viewSize) {
    var length = Run.length;

    if (index <= length) {
      return index;
    }

    if (Glide.isType('carousel')) {
      return index - (length + 1);
    }

    if (Glide.settings.rewind) {
      // bound does funny things with the length, therefor we have to be certain
      // that we are on the last possible index value given by bound
      if (Run.isBound() && !Run.isEnd()) {
        return length;
      }

      return 0;
    }

    if (Run.isBound()) {
      return length;
    }

    return Math.floor(length / viewSize) * viewSize;
  }
  /**
   * Calculates index value to move backward/to the left
   *
   * @param viewSize
   * @returns {Number}
   */


  function calculateBackwardIndex(viewSize) {
    var index = Glide.index;

    if (Glide.isType('carousel')) {
      return index - viewSize;
    } // ensure our back navigation results in the same index as a forward navigation
    // to experience a homogeneous paging


    var view = Math.ceil(index / viewSize);
    return (view - 1) * viewSize;
  }
  /**
   * Normalizes the given backward index based on glide settings, preventing it to exceed certain boundaries
   *
   * @param index
   * @param length
   * @param viewSize
   * @returns {*}
   */


  function normalizeBackwardIndex(index, viewSize) {
    var length = Run.length;

    if (index >= 0) {
      return index;
    }

    if (Glide.isType('carousel')) {
      return index + (length + 1);
    }

    if (Glide.settings.rewind) {
      // bound does funny things with the length, therefor we have to be certain
      // that we are on first possible index value before we to rewind to the length given by bound
      if (Run.isBound() && Run.isStart()) {
        return length;
      }

      return Math.floor(length / viewSize) * viewSize;
    }

    return 0;
  }

  define(Run, 'move', {
    /**
     * Gets value of the move schema.
     *
     * @returns {Object}
     */
    get: function get() {
      return this._m;
    },

    /**
     * Sets value of the move schema.
     *
     * @returns {Object}
     */
    set: function set(value) {
      var step = value.substr(1);
      this._m = {
        direction: value.substr(0, 1),
        steps: step ? toInt(step) ? toInt(step) : step : 0
      };
    }
  });
  define(Run, 'length', {
    /**
     * Gets value of the running distance based
     * on zero-indexing number of slides.
     *
     * @return {Number}
     */
    get: function get() {
      var settings = Glide.settings;
      var length = Components.Html.slides.length; // If the `bound` option is active, a maximum running distance should be
      // reduced by `perView` and `focusAt` settings. Running distance
      // should end before creating an empty space after instance.

      if (this.isBound()) {
        return length - 1 - (toInt(settings.perView) - 1) + toInt(settings.focusAt);
      }

      return length - 1;
    }
  });
  define(Run, 'offset', {
    /**
     * Gets status of the offsetting flag.
     *
     * @return {Boolean}
     */
    get: function get() {
      return this._o;
    }
  });
  return Run;
}

/**
 * Returns a current time.
 *
 * @return {Number}
 */
function now() {
  return new Date().getTime();
}

/**
 * Returns a function, that, when invoked, will only be triggered
 * at most once during a given window of time.
 *
 * @param {Function} func
 * @param {Number} wait
 * @param {Object=} options
 * @return {Function}
 *
 * @see https://github.com/jashkenas/underscore
 */

function throttle(func, wait, options) {
  var timeout, context, args, result;
  var previous = 0;
  if (!options) options = {};

  var later = function later() {
    previous = options.leading === false ? 0 : now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };

  var throttled = function throttled() {
    var at = now();
    if (!previous && options.leading === false) previous = at;
    var remaining = wait - (at - previous);
    context = this;
    args = arguments;

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }

      previous = at;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }

    return result;
  };

  throttled.cancel = function () {
    clearTimeout(timeout);
    previous = 0;
    timeout = context = args = null;
  };

  return throttled;
}

var MARGIN_TYPE = {
  ltr: ['marginLeft', 'marginRight'],
  rtl: ['marginRight', 'marginLeft']
};
function Gaps (Glide, Components, Events) {
  var Gaps = {
    /**
     * Applies gaps between slides. First and last
     * slides do not receive it's edge margins.
     *
     * @param {HTMLCollection} slides
     * @return {Void}
     */
    apply: function apply(slides) {
      for (var i = 0, len = slides.length; i < len; i++) {
        var style = slides[i].style;
        var direction = Components.Direction.value;

        if (i !== 0) {
          style[MARGIN_TYPE[direction][0]] = "".concat(this.value / 2, "px");
        } else {
          style[MARGIN_TYPE[direction][0]] = '';
        }

        if (i !== slides.length - 1) {
          style[MARGIN_TYPE[direction][1]] = "".concat(this.value / 2, "px");
        } else {
          style[MARGIN_TYPE[direction][1]] = '';
        }
      }
    },

    /**
     * Removes gaps from the slides.
     *
     * @param {HTMLCollection} slides
     * @returns {Void}
    */
    remove: function remove(slides) {
      for (var i = 0, len = slides.length; i < len; i++) {
        var style = slides[i].style;
        style.marginLeft = '';
        style.marginRight = '';
      }
    }
  };
  define(Gaps, 'value', {
    /**
     * Gets value of the gap.
     *
     * @returns {Number}
     */
    get: function get() {
      return toInt(Glide.settings.gap);
    }
  });
  define(Gaps, 'grow', {
    /**
     * Gets additional dimensions value caused by gaps.
     * Used to increase width of the slides wrapper.
     *
     * @returns {Number}
     */
    get: function get() {
      return Gaps.value * Components.Sizes.length;
    }
  });
  define(Gaps, 'reductor', {
    /**
     * Gets reduction value caused by gaps.
     * Used to subtract width of the slides.
     *
     * @returns {Number}
     */
    get: function get() {
      var perView = Glide.settings.perView;
      return Gaps.value * (perView - 1) / perView;
    }
  });
  /**
   * Apply calculated gaps:
   * - after building, so slides (including clones) will receive proper margins
   * - on updating via API, to recalculate gaps with new options
   */

  Events.on(['build.after', 'update'], throttle(function () {
    Gaps.apply(Components.Html.wrapper.children);
  }, 30));
  /**
   * Remove gaps:
   * - on destroying to bring markup to its inital state
   */

  Events.on('destroy', function () {
    Gaps.remove(Components.Html.wrapper.children);
  });
  return Gaps;
}

/**
 * Finds siblings nodes of the passed node.
 *
 * @param  {Element} node
 * @return {Array}
 */
function siblings(node) {
  if (node && node.parentNode) {
    var n = node.parentNode.firstChild;
    var matched = [];

    for (; n; n = n.nextSibling) {
      if (n.nodeType === 1 && n !== node) {
        matched.push(n);
      }
    }

    return matched;
  }

  return [];
}
/**
 * Checks if passed node exist and is a valid element.
 *
 * @param  {Element} node
 * @return {Boolean}
 */

function exist(node) {
  if (node && node instanceof window.HTMLElement) {
    return true;
  }

  return false;
}
/**
 * Coerces a NodeList to an Array.
 *
 * @param  {NodeList} nodeList
 * @return {Array}
 */

function toArray(nodeList) {
  return Array.prototype.slice.call(nodeList);
}

var TRACK_SELECTOR = '[data-glide-el="track"]';
function Html (Glide, Components, Events) {
  var Html = {
    /**
     * Setup slider HTML nodes.
     *
     * @param {Glide} glide
     */
    mount: function mount() {
      this.root = Glide.selector;
      this.track = this.root.querySelector(TRACK_SELECTOR);
      this.collectSlides();
    },

    /**
     * Collect slides
     */
    collectSlides: function collectSlides() {
      this.slides = toArray(this.wrapper.children).filter(function (slide) {
        return !slide.classList.contains(Glide.settings.classes.slide.clone);
      });
    }
  };
  define(Html, 'root', {
    /**
     * Gets node of the glide main element.
     *
     * @return {Object}
     */
    get: function get() {
      return Html._r;
    },

    /**
     * Sets node of the glide main element.
     *
     * @return {Object}
     */
    set: function set(r) {
      if (isString(r)) {
        r = document.querySelector(r);
      }

      if (exist(r)) {
        Html._r = r;
      } else {
        warn('Root element must be a existing Html node');
      }
    }
  });
  define(Html, 'track', {
    /**
     * Gets node of the glide track with slides.
     *
     * @return {Object}
     */
    get: function get() {
      return Html._t;
    },

    /**
     * Sets node of the glide track with slides.
     *
     * @return {Object}
     */
    set: function set(t) {
      if (exist(t)) {
        Html._t = t;
      } else {
        warn("Could not find track element. Please use ".concat(TRACK_SELECTOR, " attribute."));
      }
    }
  });
  define(Html, 'wrapper', {
    /**
     * Gets node of the slides wrapper.
     *
     * @return {Object}
     */
    get: function get() {
      return Html.track.children[0];
    }
  });
  /**
   * Add/remove/reorder dynamic slides
   */

  Events.on('update', function () {
    Html.collectSlides();
  });
  return Html;
}

function Peek (Glide, Components, Events) {
  var Peek = {
    /**
     * Setups how much to peek based on settings.
     *
     * @return {Void}
     */
    mount: function mount() {
      this.value = Glide.settings.peek;
    }
  };
  define(Peek, 'value', {
    /**
     * Gets value of the peek.
     *
     * @returns {Number|Object}
     */
    get: function get() {
      return Peek._v;
    },

    /**
     * Sets value of the peek.
     *
     * @param {Number|Object} value
     * @return {Void}
     */
    set: function set(value) {
      if (isObject(value)) {
        value.before = toInt(value.before);
        value.after = toInt(value.after);
      } else {
        value = toInt(value);
      }

      Peek._v = value;
    }
  });
  define(Peek, 'reductor', {
    /**
     * Gets reduction value caused by peek.
     *
     * @returns {Number}
     */
    get: function get() {
      var value = Peek.value;
      var perView = Glide.settings.perView;

      if (isObject(value)) {
        return value.before / perView + value.after / perView;
      }

      return value * 2 / perView;
    }
  });
  /**
   * Recalculate peeking sizes on:
   * - when resizing window to update to proper percents
   */

  Events.on(['resize', 'update'], function () {
    Peek.mount();
  });
  return Peek;
}

function Move (Glide, Components, Events) {
  var Move = {
    /**
     * Constructs move component.
     *
     * @returns {Void}
     */
    mount: function mount() {
      this._o = 0;
    },

    /**
     * Calculates a movement value based on passed offset and currently active index.
     *
     * @param  {Number} offset
     * @return {Void}
     */
    make: function make() {
      var _this = this;

      var offset = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      this.offset = offset;
      Events.emit('move', {
        movement: this.value
      });
      Components.Transition.after(function () {
        Events.emit('move.after', {
          movement: _this.value
        });
      });
    }
  };
  define(Move, 'offset', {
    /**
     * Gets an offset value used to modify current translate.
     *
     * @return {Object}
     */
    get: function get() {
      return Move._o;
    },

    /**
     * Sets an offset value used to modify current translate.
     *
     * @return {Object}
     */
    set: function set(value) {
      Move._o = !isUndefined(value) ? toInt(value) : 0;
    }
  });
  define(Move, 'translate', {
    /**
     * Gets a raw movement value.
     *
     * @return {Number}
     */
    get: function get() {
      return Components.Sizes.slideWidth * Glide.index;
    }
  });
  define(Move, 'value', {
    /**
     * Gets an actual movement value corrected by offset.
     *
     * @return {Number}
     */
    get: function get() {
      var offset = this.offset;
      var translate = this.translate;

      if (Components.Direction.is('rtl')) {
        return translate + offset;
      }

      return translate - offset;
    }
  });
  /**
   * Make movement to proper slide on:
   * - before build, so glide will start at `startAt` index
   * - on each standard run to move to newly calculated index
   */

  Events.on(['build.before', 'run'], function () {
    Move.make();
  });
  return Move;
}

function Sizes (Glide, Components, Events) {
  var Sizes = {
    /**
     * Setups dimensions of slides.
     *
     * @return {Void}
     */
    setupSlides: function setupSlides() {
      var width = "".concat(this.slideWidth, "px");
      var slides = Components.Html.slides;

      for (var i = 0; i < slides.length; i++) {
        slides[i].style.width = width;
      }
    },

    /**
     * Setups dimensions of slides wrapper.
     *
     * @return {Void}
     */
    setupWrapper: function setupWrapper() {
      Components.Html.wrapper.style.width = "".concat(this.wrapperSize, "px");
    },

    /**
     * Removes applied styles from HTML elements.
     *
     * @returns {Void}
     */
    remove: function remove() {
      var slides = Components.Html.slides;

      for (var i = 0; i < slides.length; i++) {
        slides[i].style.width = '';
      }

      Components.Html.wrapper.style.width = '';
    }
  };
  define(Sizes, 'length', {
    /**
     * Gets count number of the slides.
     *
     * @return {Number}
     */
    get: function get() {
      return Components.Html.slides.length;
    }
  });
  define(Sizes, 'width', {
    /**
     * Gets width value of the slider (visible area).
     *
     * @return {Number}
     */
    get: function get() {
      return Components.Html.track.offsetWidth;
    }
  });
  define(Sizes, 'wrapperSize', {
    /**
     * Gets size of the slides wrapper.
     *
     * @return {Number}
     */
    get: function get() {
      return Sizes.slideWidth * Sizes.length + Components.Gaps.grow + Components.Clones.grow;
    }
  });
  define(Sizes, 'slideWidth', {
    /**
     * Gets width value of a single slide.
     *
     * @return {Number}
     */
    get: function get() {
      return Sizes.width / Glide.settings.perView - Components.Peek.reductor - Components.Gaps.reductor;
    }
  });
  /**
   * Apply calculated glide's dimensions:
   * - before building, so other dimensions (e.g. translate) will be calculated propertly
   * - when resizing window to recalculate sildes dimensions
   * - on updating via API, to calculate dimensions based on new options
   */

  Events.on(['build.before', 'resize', 'update'], function () {
    Sizes.setupSlides();
    Sizes.setupWrapper();
  });
  /**
   * Remove calculated glide's dimensions:
   * - on destoting to bring markup to its inital state
   */

  Events.on('destroy', function () {
    Sizes.remove();
  });
  return Sizes;
}

function Build (Glide, Components, Events) {
  var Build = {
    /**
     * Init glide building. Adds classes, sets
     * dimensions and setups initial state.
     *
     * @return {Void}
     */
    mount: function mount() {
      Events.emit('build.before');
      this.typeClass();
      this.activeClass();
      Events.emit('build.after');
    },

    /**
     * Adds `type` class to the glide element.
     *
     * @return {Void}
     */
    typeClass: function typeClass() {
      Components.Html.root.classList.add(Glide.settings.classes.type[Glide.settings.type]);
    },

    /**
     * Sets active class to current slide.
     *
     * @return {Void}
     */
    activeClass: function activeClass() {
      var classes = Glide.settings.classes;
      var slide = Components.Html.slides[Glide.index];

      if (slide) {
        slide.classList.add(classes.slide.active);
        siblings(slide).forEach(function (sibling) {
          sibling.classList.remove(classes.slide.active);
        });
      }
    },

    /**
     * Removes HTML classes applied at building.
     *
     * @return {Void}
     */
    removeClasses: function removeClasses() {
      var _Glide$settings$class = Glide.settings.classes,
          type = _Glide$settings$class.type,
          slide = _Glide$settings$class.slide;
      Components.Html.root.classList.remove(type[Glide.settings.type]);
      Components.Html.slides.forEach(function (sibling) {
        sibling.classList.remove(slide.active);
      });
    }
  };
  /**
   * Clear building classes:
   * - on destroying to bring HTML to its initial state
   * - on updating to remove classes before remounting component
   */

  Events.on(['destroy', 'update'], function () {
    Build.removeClasses();
  });
  /**
   * Remount component:
   * - on resizing of the window to calculate new dimensions
   * - on updating settings via API
   */

  Events.on(['resize', 'update'], function () {
    Build.mount();
  });
  /**
   * Swap active class of current slide:
   * - after each move to the new index
   */

  Events.on('move.after', function () {
    Build.activeClass();
  });
  return Build;
}

function Clones (Glide, Components, Events) {
  var Clones = {
    /**
     * Create pattern map and collect slides to be cloned.
     */
    mount: function mount() {
      this.items = [];

      if (Glide.isType('carousel')) {
        this.items = this.collect();
      }
    },

    /**
     * Collect clones with pattern.
     *
     * @return {[]}
     */
    collect: function collect() {
      var items = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var slides = Components.Html.slides;
      var _Glide$settings = Glide.settings,
          perView = _Glide$settings.perView,
          classes = _Glide$settings.classes,
          cloningRatio = _Glide$settings.cloningRatio;

      if (slides.length !== 0) {
        var peekIncrementer = +!!Glide.settings.peek;
        var cloneCount = perView + peekIncrementer + Math.round(perView / 2);
        var append = slides.slice(0, cloneCount).reverse();
        var prepend = slides.slice(cloneCount * -1);

        for (var r = 0; r < Math.max(cloningRatio, Math.floor(perView / slides.length)); r++) {
          for (var i = 0; i < append.length; i++) {
            var clone = append[i].cloneNode(true);
            clone.classList.add(classes.slide.clone);
            items.push(clone);
          }

          for (var _i = 0; _i < prepend.length; _i++) {
            var _clone = prepend[_i].cloneNode(true);

            _clone.classList.add(classes.slide.clone);

            items.unshift(_clone);
          }
        }
      }

      return items;
    },

    /**
     * Append cloned slides with generated pattern.
     *
     * @return {Void}
     */
    append: function append() {
      var items = this.items;
      var _Components$Html = Components.Html,
          wrapper = _Components$Html.wrapper,
          slides = _Components$Html.slides;
      var half = Math.floor(items.length / 2);
      var prepend = items.slice(0, half).reverse();
      var append = items.slice(half * -1).reverse();
      var width = "".concat(Components.Sizes.slideWidth, "px");

      for (var i = 0; i < append.length; i++) {
        wrapper.appendChild(append[i]);
      }

      for (var _i2 = 0; _i2 < prepend.length; _i2++) {
        wrapper.insertBefore(prepend[_i2], slides[0]);
      }

      for (var _i3 = 0; _i3 < items.length; _i3++) {
        items[_i3].style.width = width;
      }
    },

    /**
     * Remove all cloned slides.
     *
     * @return {Void}
     */
    remove: function remove() {
      var items = this.items;

      for (var i = 0; i < items.length; i++) {
        Components.Html.wrapper.removeChild(items[i]);
      }
    }
  };
  define(Clones, 'grow', {
    /**
     * Gets additional dimensions value caused by clones.
     *
     * @return {Number}
     */
    get: function get() {
      return (Components.Sizes.slideWidth + Components.Gaps.value) * Clones.items.length;
    }
  });
  /**
   * Append additional slide's clones:
   * - while glide's type is `carousel`
   */

  Events.on('update', function () {
    Clones.remove();
    Clones.mount();
    Clones.append();
  });
  /**
   * Append additional slide's clones:
   * - while glide's type is `carousel`
   */

  Events.on('build.before', function () {
    if (Glide.isType('carousel')) {
      Clones.append();
    }
  });
  /**
   * Remove clones HTMLElements:
   * - on destroying, to bring HTML to its initial state
   */

  Events.on('destroy', function () {
    Clones.remove();
  });
  return Clones;
}

var EventsBinder = /*#__PURE__*/function () {
  /**
   * Construct a EventsBinder instance.
   */
  function EventsBinder() {
    var listeners = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, EventsBinder);

    this.listeners = listeners;
  }
  /**
   * Adds events listeners to arrows HTML elements.
   *
   * @param  {String|Array} events
   * @param  {Element|Window|Document} el
   * @param  {Function} closure
   * @param  {Boolean|Object} capture
   * @return {Void}
   */


  _createClass(EventsBinder, [{
    key: "on",
    value: function on(events, el, closure) {
      var capture = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

      if (isString(events)) {
        events = [events];
      }

      for (var i = 0; i < events.length; i++) {
        this.listeners[events[i]] = closure;
        el.addEventListener(events[i], this.listeners[events[i]], capture);
      }
    }
    /**
     * Removes event listeners from arrows HTML elements.
     *
     * @param  {String|Array} events
     * @param  {Element|Window|Document} el
     * @param  {Boolean|Object} capture
     * @return {Void}
     */

  }, {
    key: "off",
    value: function off(events, el) {
      var capture = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      if (isString(events)) {
        events = [events];
      }

      for (var i = 0; i < events.length; i++) {
        el.removeEventListener(events[i], this.listeners[events[i]], capture);
      }
    }
    /**
     * Destroy collected listeners.
     *
     * @returns {Void}
     */

  }, {
    key: "destroy",
    value: function destroy() {
      delete this.listeners;
    }
  }]);

  return EventsBinder;
}();

function Resize (Glide, Components, Events) {
  /**
   * Instance of the binder for DOM Events.
   *
   * @type {EventsBinder}
   */
  var Binder = new EventsBinder();
  var Resize = {
    /**
     * Initializes window bindings.
     */
    mount: function mount() {
      this.bind();
    },

    /**
     * Binds `rezsize` listener to the window.
     * It's a costly event, so we are debouncing it.
     *
     * @return {Void}
     */
    bind: function bind() {
      Binder.on('resize', window, throttle(function () {
        Events.emit('resize');
      }, Glide.settings.throttle));
    },

    /**
     * Unbinds listeners from the window.
     *
     * @return {Void}
     */
    unbind: function unbind() {
      Binder.off('resize', window);
    }
  };
  /**
   * Remove bindings from window:
   * - on destroying, to remove added EventListener
   */

  Events.on('destroy', function () {
    Resize.unbind();
    Binder.destroy();
  });
  return Resize;
}

var VALID_DIRECTIONS = ['ltr', 'rtl'];
var FLIPED_MOVEMENTS = {
  '>': '<',
  '<': '>',
  '=': '='
};
function Direction (Glide, Components, Events) {
  var Direction = {
    /**
     * Setups gap value based on settings.
     *
     * @return {Void}
     */
    mount: function mount() {
      this.value = Glide.settings.direction;
    },

    /**
     * Resolves pattern based on direction value
     *
     * @param {String} pattern
     * @returns {String}
     */
    resolve: function resolve(pattern) {
      var token = pattern.slice(0, 1);

      if (this.is('rtl')) {
        return pattern.split(token).join(FLIPED_MOVEMENTS[token]);
      }

      return pattern;
    },

    /**
     * Checks value of direction mode.
     *
     * @param {String} direction
     * @returns {Boolean}
     */
    is: function is(direction) {
      return this.value === direction;
    },

    /**
     * Applies direction class to the root HTML element.
     *
     * @return {Void}
     */
    addClass: function addClass() {
      Components.Html.root.classList.add(Glide.settings.classes.direction[this.value]);
    },

    /**
     * Removes direction class from the root HTML element.
     *
     * @return {Void}
     */
    removeClass: function removeClass() {
      Components.Html.root.classList.remove(Glide.settings.classes.direction[this.value]);
    }
  };
  define(Direction, 'value', {
    /**
     * Gets value of the direction.
     *
     * @returns {Number}
     */
    get: function get() {
      return Direction._v;
    },

    /**
     * Sets value of the direction.
     *
     * @param {String} value
     * @return {Void}
     */
    set: function set(value) {
      if (VALID_DIRECTIONS.indexOf(value) > -1) {
        Direction._v = value;
      } else {
        warn('Direction value must be `ltr` or `rtl`');
      }
    }
  });
  /**
   * Clear direction class:
   * - on destroy to bring HTML to its initial state
   * - on update to remove class before reappling bellow
   */

  Events.on(['destroy', 'update'], function () {
    Direction.removeClass();
  });
  /**
   * Remount component:
   * - on update to reflect changes in direction value
   */

  Events.on('update', function () {
    Direction.mount();
  });
  /**
   * Apply direction class:
   * - before building to apply class for the first time
   * - on updating to reapply direction class that may changed
   */

  Events.on(['build.before', 'update'], function () {
    Direction.addClass();
  });
  return Direction;
}

/**
 * Reflects value of glide movement.
 *
 * @param  {Object} Glide
 * @param  {Object} Components
 * @return {Object}
 */
function Rtl (Glide, Components) {
  return {
    /**
     * Negates the passed translate if glide is in RTL option.
     *
     * @param  {Number} translate
     * @return {Number}
     */
    modify: function modify(translate) {
      if (Components.Direction.is('rtl')) {
        return -translate;
      }

      return translate;
    }
  };
}

/**
 * Updates glide movement with a `gap` settings.
 *
 * @param  {Object} Glide
 * @param  {Object} Components
 * @return {Object}
 */
function Gap (Glide, Components) {
  return {
    /**
     * Modifies passed translate value with number in the `gap` settings.
     *
     * @param  {Number} translate
     * @return {Number}
     */
    modify: function modify(translate) {
      var multiplier = Math.floor(translate / Components.Sizes.slideWidth);
      return translate + Components.Gaps.value * multiplier;
    }
  };
}

/**
 * Updates glide movement with width of additional clones width.
 *
 * @param  {Object} Glide
 * @param  {Object} Components
 * @return {Object}
 */
function Grow (Glide, Components) {
  return {
    /**
     * Adds to the passed translate width of the half of clones.
     *
     * @param  {Number} translate
     * @return {Number}
     */
    modify: function modify(translate) {
      return translate + Components.Clones.grow / 2;
    }
  };
}

/**
 * Updates glide movement with a `peek` settings.
 *
 * @param  {Object} Glide
 * @param  {Object} Components
 * @return {Object}
 */

function Peeking (Glide, Components) {
  return {
    /**
     * Modifies passed translate value with a `peek` setting.
     *
     * @param  {Number} translate
     * @return {Number}
     */
    modify: function modify(translate) {
      if (Glide.settings.focusAt >= 0) {
        var peek = Components.Peek.value;

        if (isObject(peek)) {
          return translate - peek.before;
        }

        return translate - peek;
      }

      return translate;
    }
  };
}

/**
 * Updates glide movement with a `focusAt` settings.
 *
 * @param  {Object} Glide
 * @param  {Object} Components
 * @return {Object}
 */
function Focusing (Glide, Components) {
  return {
    /**
     * Modifies passed translate value with index in the `focusAt` setting.
     *
     * @param  {Number} translate
     * @return {Number}
     */
    modify: function modify(translate) {
      var gap = Components.Gaps.value;
      var width = Components.Sizes.width;
      var focusAt = Glide.settings.focusAt;
      var slideWidth = Components.Sizes.slideWidth;

      if (focusAt === 'center') {
        return translate - (width / 2 - slideWidth / 2);
      }

      return translate - slideWidth * focusAt - gap * focusAt;
    }
  };
}

/**
 * Applies diffrent transformers on translate value.
 *
 * @param  {Object} Glide
 * @param  {Object} Components
 * @return {Object}
 */

function mutator (Glide, Components, Events) {
  /**
   * Merge instance transformers with collection of default transformers.
   * It's important that the Rtl component be last on the list,
   * so it reflects all previous transformations.
   *
   * @type {Array}
   */
  var TRANSFORMERS = [Gap, Grow, Peeking, Focusing].concat(Glide._t, [Rtl]);
  return {
    /**
     * Piplines translate value with registered transformers.
     *
     * @param  {Number} translate
     * @return {Number}
     */
    mutate: function mutate(translate) {
      for (var i = 0; i < TRANSFORMERS.length; i++) {
        var transformer = TRANSFORMERS[i];

        if (isFunction(transformer) && isFunction(transformer().modify)) {
          translate = transformer(Glide, Components, Events).modify(translate);
        } else {
          warn('Transformer should be a function that returns an object with `modify()` method');
        }
      }

      return translate;
    }
  };
}

function Translate (Glide, Components, Events) {
  var Translate = {
    /**
     * Sets value of translate on HTML element.
     *
     * @param {Number} value
     * @return {Void}
     */
    set: function set(value) {
      var transform = mutator(Glide, Components).mutate(value);
      var translate3d = "translate3d(".concat(-1 * transform, "px, 0px, 0px)");
      Components.Html.wrapper.style.mozTransform = translate3d; // needed for supported Firefox 10-15

      Components.Html.wrapper.style.webkitTransform = translate3d; // needed for supported Chrome 10-35, Safari 5.1-8, and Opera 15-22

      Components.Html.wrapper.style.transform = translate3d;
    },

    /**
     * Removes value of translate from HTML element.
     *
     * @return {Void}
     */
    remove: function remove() {
      Components.Html.wrapper.style.transform = '';
    },

    /**
     * @return {number}
     */
    getStartIndex: function getStartIndex() {
      var length = Components.Sizes.length;
      var index = Glide.index;
      var perView = Glide.settings.perView;

      if (Components.Run.isOffset('>') || Components.Run.isOffset('|>')) {
        return length + (index - perView);
      } // "modulo length" converts an index that equals length to zero


      return (index + perView) % length;
    },

    /**
     * @return {number}
     */
    getTravelDistance: function getTravelDistance() {
      var travelDistance = Components.Sizes.slideWidth * Glide.settings.perView;

      if (Components.Run.isOffset('>') || Components.Run.isOffset('|>')) {
        // reverse travel distance so that we don't have to change subtract operations
        return travelDistance * -1;
      }

      return travelDistance;
    }
  };
  /**
   * Set new translate value:
   * - on move to reflect index change
   * - on updating via API to reflect possible changes in options
   */

  Events.on('move', function (context) {
    if (!Glide.isType('carousel') || !Components.Run.isOffset()) {
      return Translate.set(context.movement);
    }

    Components.Transition.after(function () {
      Events.emit('translate.jump');
      Translate.set(Components.Sizes.slideWidth * Glide.index);
    });
    var startWidth = Components.Sizes.slideWidth * Components.Translate.getStartIndex();
    return Translate.set(startWidth - Components.Translate.getTravelDistance());
  });
  /**
   * Remove translate:
   * - on destroying to bring markup to its inital state
   */

  Events.on('destroy', function () {
    Translate.remove();
  });
  return Translate;
}

function Transition (Glide, Components, Events) {
  /**
   * Holds inactivity status of transition.
   * When true transition is not applied.
   *
   * @type {Boolean}
   */
  var disabled = false;
  var Transition = {
    /**
     * Composes string of the CSS transition.
     *
     * @param {String} property
     * @return {String}
     */
    compose: function compose(property) {
      var settings = Glide.settings;

      if (!disabled) {
        return "".concat(property, " ").concat(this.duration, "ms ").concat(settings.animationTimingFunc);
      }

      return "".concat(property, " 0ms ").concat(settings.animationTimingFunc);
    },

    /**
     * Sets value of transition on HTML element.
     *
     * @param {String=} property
     * @return {Void}
     */
    set: function set() {
      var property = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'transform';
      Components.Html.wrapper.style.transition = this.compose(property);
    },

    /**
     * Removes value of transition from HTML element.
     *
     * @return {Void}
     */
    remove: function remove() {
      Components.Html.wrapper.style.transition = '';
    },

    /**
     * Runs callback after animation.
     *
     * @param  {Function} callback
     * @return {Void}
     */
    after: function after(callback) {
      setTimeout(function () {
        callback();
      }, this.duration);
    },

    /**
     * Enable transition.
     *
     * @return {Void}
     */
    enable: function enable() {
      disabled = false;
      this.set();
    },

    /**
     * Disable transition.
     *
     * @return {Void}
     */
    disable: function disable() {
      disabled = true;
      this.set();
    }
  };
  define(Transition, 'duration', {
    /**
     * Gets duration of the transition based
     * on currently running animation type.
     *
     * @return {Number}
     */
    get: function get() {
      var settings = Glide.settings;

      if (Glide.isType('slider') && Components.Run.offset) {
        return settings.rewindDuration;
      }

      return settings.animationDuration;
    }
  });
  /**
   * Set transition `style` value:
   * - on each moving, because it may be cleared by offset move
   */

  Events.on('move', function () {
    Transition.set();
  });
  /**
   * Disable transition:
   * - before initial build to avoid transitioning from `0` to `startAt` index
   * - while resizing window and recalculating dimensions
   * - on jumping from offset transition at start and end edges in `carousel` type
   */

  Events.on(['build.before', 'resize', 'translate.jump'], function () {
    Transition.disable();
  });
  /**
   * Enable transition:
   * - on each running, because it may be disabled by offset move
   */

  Events.on('run', function () {
    Transition.enable();
  });
  /**
   * Remove transition:
   * - on destroying to bring markup to its inital state
   */

  Events.on('destroy', function () {
    Transition.remove();
  });
  return Transition;
}

/**
 * Test via a getter in the options object to see
 * if the passive property is accessed.
 *
 * @see https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md#feature-detection
 */
var supportsPassive = false;

try {
  var opts = Object.defineProperty({}, 'passive', {
    get: function get() {
      supportsPassive = true;
    }
  });
  window.addEventListener('testPassive', null, opts);
  window.removeEventListener('testPassive', null, opts);
} catch (e) {}

var supportsPassive$1 = supportsPassive;

var START_EVENTS = ['touchstart', 'mousedown'];
var MOVE_EVENTS = ['touchmove', 'mousemove'];
var END_EVENTS = ['touchend', 'touchcancel', 'mouseup', 'mouseleave'];
var MOUSE_EVENTS = ['mousedown', 'mousemove', 'mouseup', 'mouseleave'];
function Swipe (Glide, Components, Events) {
  /**
   * Instance of the binder for DOM Events.
   *
   * @type {EventsBinder}
   */
  var Binder = new EventsBinder();
  var swipeSin = 0;
  var swipeStartX = 0;
  var swipeStartY = 0;
  var disabled = false;
  var capture = supportsPassive$1 ? {
    passive: true
  } : false;
  var Swipe = {
    /**
     * Initializes swipe bindings.
     *
     * @return {Void}
     */
    mount: function mount() {
      this.bindSwipeStart();
    },

    /**
     * Handler for `swipestart` event. Calculates entry points of the user's tap.
     *
     * @param {Object} event
     * @return {Void}
     */
    start: function start(event) {
      if (!disabled && !Glide.disabled) {
        this.disable();
        var swipe = this.touches(event);
        swipeSin = null;
        swipeStartX = toInt(swipe.pageX);
        swipeStartY = toInt(swipe.pageY);
        this.bindSwipeMove();
        this.bindSwipeEnd();
        Events.emit('swipe.start');
      }
    },

    /**
     * Handler for `swipemove` event. Calculates user's tap angle and distance.
     *
     * @param {Object} event
     */
    move: function move(event) {
      if (!Glide.disabled) {
        var _Glide$settings = Glide.settings,
            touchAngle = _Glide$settings.touchAngle,
            touchRatio = _Glide$settings.touchRatio,
            classes = _Glide$settings.classes;
        var swipe = this.touches(event);
        var subExSx = toInt(swipe.pageX) - swipeStartX;
        var subEySy = toInt(swipe.pageY) - swipeStartY;
        var powEX = Math.abs(subExSx << 2);
        var powEY = Math.abs(subEySy << 2);
        var swipeHypotenuse = Math.sqrt(powEX + powEY);
        var swipeCathetus = Math.sqrt(powEY);
        swipeSin = Math.asin(swipeCathetus / swipeHypotenuse);

        if (swipeSin * 180 / Math.PI < touchAngle) {
          event.stopPropagation();
          Components.Move.make(subExSx * toFloat(touchRatio));
          Components.Html.root.classList.add(classes.dragging);
          Events.emit('swipe.move');
        } else {
          return false;
        }
      }
    },

    /**
     * Handler for `swipeend` event. Finitializes user's tap and decides about glide move.
     *
     * @param {Object} event
     * @return {Void}
     */
    end: function end(event) {
      if (!Glide.disabled) {
        var _Glide$settings2 = Glide.settings,
            perSwipe = _Glide$settings2.perSwipe,
            touchAngle = _Glide$settings2.touchAngle,
            classes = _Glide$settings2.classes;
        var swipe = this.touches(event);
        var threshold = this.threshold(event);
        var swipeDistance = swipe.pageX - swipeStartX;
        var swipeDeg = swipeSin * 180 / Math.PI;
        this.enable();

        if (swipeDistance > threshold && swipeDeg < touchAngle) {
          Components.Run.make(Components.Direction.resolve("".concat(perSwipe, "<")));
        } else if (swipeDistance < -threshold && swipeDeg < touchAngle) {
          Components.Run.make(Components.Direction.resolve("".concat(perSwipe, ">")));
        } else {
          // While swipe don't reach distance apply previous transform.
          Components.Move.make();
        }

        Components.Html.root.classList.remove(classes.dragging);
        this.unbindSwipeMove();
        this.unbindSwipeEnd();
        Events.emit('swipe.end');
      }
    },

    /**
     * Binds swipe's starting event.
     *
     * @return {Void}
     */
    bindSwipeStart: function bindSwipeStart() {
      var _this = this;

      var _Glide$settings3 = Glide.settings,
          swipeThreshold = _Glide$settings3.swipeThreshold,
          dragThreshold = _Glide$settings3.dragThreshold;

      if (swipeThreshold) {
        Binder.on(START_EVENTS[0], Components.Html.wrapper, function (event) {
          _this.start(event);
        }, capture);
      }

      if (dragThreshold) {
        Binder.on(START_EVENTS[1], Components.Html.wrapper, function (event) {
          _this.start(event);
        }, capture);
      }
    },

    /**
     * Unbinds swipe's starting event.
     *
     * @return {Void}
     */
    unbindSwipeStart: function unbindSwipeStart() {
      Binder.off(START_EVENTS[0], Components.Html.wrapper, capture);
      Binder.off(START_EVENTS[1], Components.Html.wrapper, capture);
    },

    /**
     * Binds swipe's moving event.
     *
     * @return {Void}
     */
    bindSwipeMove: function bindSwipeMove() {
      var _this2 = this;

      Binder.on(MOVE_EVENTS, Components.Html.wrapper, throttle(function (event) {
        _this2.move(event);
      }, Glide.settings.throttle), capture);
    },

    /**
     * Unbinds swipe's moving event.
     *
     * @return {Void}
     */
    unbindSwipeMove: function unbindSwipeMove() {
      Binder.off(MOVE_EVENTS, Components.Html.wrapper, capture);
    },

    /**
     * Binds swipe's ending event.
     *
     * @return {Void}
     */
    bindSwipeEnd: function bindSwipeEnd() {
      var _this3 = this;

      Binder.on(END_EVENTS, Components.Html.wrapper, function (event) {
        _this3.end(event);
      });
    },

    /**
     * Unbinds swipe's ending event.
     *
     * @return {Void}
     */
    unbindSwipeEnd: function unbindSwipeEnd() {
      Binder.off(END_EVENTS, Components.Html.wrapper);
    },

    /**
     * Normalizes event touches points accorting to different types.
     *
     * @param {Object} event
     */
    touches: function touches(event) {
      if (MOUSE_EVENTS.indexOf(event.type) > -1) {
        return event;
      }

      return event.touches[0] || event.changedTouches[0];
    },

    /**
     * Gets value of minimum swipe distance settings based on event type.
     *
     * @return {Number}
     */
    threshold: function threshold(event) {
      var settings = Glide.settings;

      if (MOUSE_EVENTS.indexOf(event.type) > -1) {
        return settings.dragThreshold;
      }

      return settings.swipeThreshold;
    },

    /**
     * Enables swipe event.
     *
     * @return {self}
     */
    enable: function enable() {
      disabled = false;
      Components.Transition.enable();
      return this;
    },

    /**
     * Disables swipe event.
     *
     * @return {self}
     */
    disable: function disable() {
      disabled = true;
      Components.Transition.disable();
      return this;
    }
  };
  /**
   * Add component class:
   * - after initial building
   */

  Events.on('build.after', function () {
    Components.Html.root.classList.add(Glide.settings.classes.swipeable);
  });
  /**
   * Remove swiping bindings:
   * - on destroying, to remove added EventListeners
   */

  Events.on('destroy', function () {
    Swipe.unbindSwipeStart();
    Swipe.unbindSwipeMove();
    Swipe.unbindSwipeEnd();
    Binder.destroy();
  });
  return Swipe;
}

function Images (Glide, Components, Events) {
  /**
   * Instance of the binder for DOM Events.
   *
   * @type {EventsBinder}
   */
  var Binder = new EventsBinder();
  var Images = {
    /**
     * Binds listener to glide wrapper.
     *
     * @return {Void}
     */
    mount: function mount() {
      this.bind();
    },

    /**
     * Binds `dragstart` event on wrapper to prevent dragging images.
     *
     * @return {Void}
     */
    bind: function bind() {
      Binder.on('dragstart', Components.Html.wrapper, this.dragstart);
    },

    /**
     * Unbinds `dragstart` event on wrapper.
     *
     * @return {Void}
     */
    unbind: function unbind() {
      Binder.off('dragstart', Components.Html.wrapper);
    },

    /**
     * Event handler. Prevents dragging.
     *
     * @return {Void}
     */
    dragstart: function dragstart(event) {
      event.preventDefault();
    }
  };
  /**
   * Remove bindings from images:
   * - on destroying, to remove added EventListeners
   */

  Events.on('destroy', function () {
    Images.unbind();
    Binder.destroy();
  });
  return Images;
}

function Anchors (Glide, Components, Events) {
  /**
   * Instance of the binder for DOM Events.
   *
   * @type {EventsBinder}
   */
  var Binder = new EventsBinder();
  /**
   * Holds detaching status of anchors.
   * Prevents detaching of already detached anchors.
   *
   * @private
   * @type {Boolean}
   */

  var detached = false;
  /**
   * Holds preventing status of anchors.
   * If `true` redirection after click will be disabled.
   *
   * @private
   * @type {Boolean}
   */

  var prevented = false;
  var Anchors = {
    /**
     * Setups a initial state of anchors component.
     *
     * @returns {Void}
     */
    mount: function mount() {
      /**
       * Holds collection of anchors elements.
       *
       * @private
       * @type {HTMLCollection}
       */
      this._a = Components.Html.wrapper.querySelectorAll('a');
      this.bind();
    },

    /**
     * Binds events to anchors inside a track.
     *
     * @return {Void}
     */
    bind: function bind() {
      Binder.on('click', Components.Html.wrapper, this.click);
    },

    /**
     * Unbinds events attached to anchors inside a track.
     *
     * @return {Void}
     */
    unbind: function unbind() {
      Binder.off('click', Components.Html.wrapper);
    },

    /**
     * Handler for click event. Prevents clicks when glide is in `prevent` status.
     *
     * @param  {Object} event
     * @return {Void}
     */
    click: function click(event) {
      if (prevented) {
        event.stopPropagation();
        event.preventDefault();
      }
    },

    /**
     * Detaches anchors click event inside glide.
     *
     * @return {self}
     */
    detach: function detach() {
      prevented = true;

      if (!detached) {
        for (var i = 0; i < this.items.length; i++) {
          this.items[i].draggable = false;
        }

        detached = true;
      }

      return this;
    },

    /**
     * Attaches anchors click events inside glide.
     *
     * @return {self}
     */
    attach: function attach() {
      prevented = false;

      if (detached) {
        for (var i = 0; i < this.items.length; i++) {
          this.items[i].draggable = true;
        }

        detached = false;
      }

      return this;
    }
  };
  define(Anchors, 'items', {
    /**
     * Gets collection of the arrows HTML elements.
     *
     * @return {HTMLElement[]}
     */
    get: function get() {
      return Anchors._a;
    }
  });
  /**
   * Detach anchors inside slides:
   * - on swiping, so they won't redirect to its `href` attributes
   */

  Events.on('swipe.move', function () {
    Anchors.detach();
  });
  /**
   * Attach anchors inside slides:
   * - after swiping and transitions ends, so they can redirect after click again
   */

  Events.on('swipe.end', function () {
    Components.Transition.after(function () {
      Anchors.attach();
    });
  });
  /**
   * Unbind anchors inside slides:
   * - on destroying, to bring anchors to its initial state
   */

  Events.on('destroy', function () {
    Anchors.attach();
    Anchors.unbind();
    Binder.destroy();
  });
  return Anchors;
}

var NAV_SELECTOR = '[data-glide-el="controls[nav]"]';
var CONTROLS_SELECTOR = '[data-glide-el^="controls"]';
var PREVIOUS_CONTROLS_SELECTOR = "".concat(CONTROLS_SELECTOR, " [data-glide-dir*=\"<\"]");
var NEXT_CONTROLS_SELECTOR = "".concat(CONTROLS_SELECTOR, " [data-glide-dir*=\">\"]");
function Controls (Glide, Components, Events) {
  /**
   * Instance of the binder for DOM Events.
   *
   * @type {EventsBinder}
   */
  var Binder = new EventsBinder();
  var capture = supportsPassive$1 ? {
    passive: true
  } : false;
  var Controls = {
    /**
     * Inits arrows. Binds events listeners
     * to the arrows HTML elements.
     *
     * @return {Void}
     */
    mount: function mount() {
      /**
       * Collection of navigation HTML elements.
       *
       * @private
       * @type {HTMLCollection}
       */
      this._n = Components.Html.root.querySelectorAll(NAV_SELECTOR);
      /**
       * Collection of controls HTML elements.
       *
       * @private
       * @type {HTMLCollection}
       */

      this._c = Components.Html.root.querySelectorAll(CONTROLS_SELECTOR);
      /**
       * Collection of arrow control HTML elements.
       *
       * @private
       * @type {Object}
       */

      this._arrowControls = {
        previous: Components.Html.root.querySelectorAll(PREVIOUS_CONTROLS_SELECTOR),
        next: Components.Html.root.querySelectorAll(NEXT_CONTROLS_SELECTOR)
      };
      this.addBindings();
    },

    /**
     * Sets active class to current slide.
     *
     * @return {Void}
     */
    setActive: function setActive() {
      for (var i = 0; i < this._n.length; i++) {
        this.addClass(this._n[i].children);
      }
    },

    /**
     * Removes active class to current slide.
     *
     * @return {Void}
     */
    removeActive: function removeActive() {
      for (var i = 0; i < this._n.length; i++) {
        this.removeClass(this._n[i].children);
      }
    },

    /**
     * Toggles active class on items inside navigation.
     *
     * @param  {HTMLElement} controls
     * @return {Void}
     */
    addClass: function addClass(controls) {
      var settings = Glide.settings;
      var item = controls[Glide.index];

      if (!item) {
        return;
      }

      if (item) {
        item.classList.add(settings.classes.nav.active);
        siblings(item).forEach(function (sibling) {
          sibling.classList.remove(settings.classes.nav.active);
        });
      }
    },

    /**
     * Removes active class from active control.
     *
     * @param  {HTMLElement} controls
     * @return {Void}
     */
    removeClass: function removeClass(controls) {
      var item = controls[Glide.index];

      if (item) {
        item.classList.remove(Glide.settings.classes.nav.active);
      }
    },

    /**
     * Calculates, removes or adds `Glide.settings.classes.disabledArrow` class on the control arrows
     */
    setArrowState: function setArrowState() {
      if (Glide.settings.rewind) {
        return;
      }

      var next = Controls._arrowControls.next;
      var previous = Controls._arrowControls.previous;
      this.resetArrowState(next, previous);

      if (Glide.index === 0) {
        this.disableArrow(previous);
      }

      if (Glide.index === Components.Run.length) {
        this.disableArrow(next);
      }
    },

    /**
     * Removes `Glide.settings.classes.disabledArrow` from given NodeList elements
     *
     * @param {NodeList[]} lists
     */
    resetArrowState: function resetArrowState() {
      var settings = Glide.settings;

      for (var _len = arguments.length, lists = new Array(_len), _key = 0; _key < _len; _key++) {
        lists[_key] = arguments[_key];
      }

      lists.forEach(function (list) {
        toArray(list).forEach(function (element) {
          element.classList.remove(settings.classes.arrow.disabled);
        });
      });
    },

    /**
     * Adds `Glide.settings.classes.disabledArrow` to given NodeList elements
     *
     * @param {NodeList[]} lists
     */
    disableArrow: function disableArrow() {
      var settings = Glide.settings;

      for (var _len2 = arguments.length, lists = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        lists[_key2] = arguments[_key2];
      }

      lists.forEach(function (list) {
        toArray(list).forEach(function (element) {
          element.classList.add(settings.classes.arrow.disabled);
        });
      });
    },

    /**
     * Adds handles to the each group of controls.
     *
     * @return {Void}
     */
    addBindings: function addBindings() {
      for (var i = 0; i < this._c.length; i++) {
        this.bind(this._c[i].children);
      }
    },

    /**
     * Removes handles from the each group of controls.
     *
     * @return {Void}
     */
    removeBindings: function removeBindings() {
      for (var i = 0; i < this._c.length; i++) {
        this.unbind(this._c[i].children);
      }
    },

    /**
     * Binds events to arrows HTML elements.
     *
     * @param {HTMLCollection} elements
     * @return {Void}
     */
    bind: function bind(elements) {
      for (var i = 0; i < elements.length; i++) {
        Binder.on('click', elements[i], this.click);
        Binder.on('touchstart', elements[i], this.click, capture);
      }
    },

    /**
     * Unbinds events binded to the arrows HTML elements.
     *
     * @param {HTMLCollection} elements
     * @return {Void}
     */
    unbind: function unbind(elements) {
      for (var i = 0; i < elements.length; i++) {
        Binder.off(['click', 'touchstart'], elements[i]);
      }
    },

    /**
     * Handles `click` event on the arrows HTML elements.
     * Moves slider in direction given via the
     * `data-glide-dir` attribute.
     *
     * @param {Object} event
     * @return {void}
     */
    click: function click(event) {
      if (!supportsPassive$1 && event.type === 'touchstart') {
        event.preventDefault();
      }

      var direction = event.currentTarget.getAttribute('data-glide-dir');
      Components.Run.make(Components.Direction.resolve(direction));
    }
  };
  define(Controls, 'items', {
    /**
     * Gets collection of the controls HTML elements.
     *
     * @return {HTMLElement[]}
     */
    get: function get() {
      return Controls._c;
    }
  });
  /**
   * Swap active class of current navigation item:
   * - after mounting to set it to initial index
   * - after each move to the new index
   */

  Events.on(['mount.after', 'move.after'], function () {
    Controls.setActive();
  });
  /**
   * Add or remove disabled class of arrow elements
   */

  Events.on(['mount.after', 'run'], function () {
    Controls.setArrowState();
  });
  /**
   * Remove bindings and HTML Classes:
   * - on destroying, to bring markup to its initial state
   */

  Events.on('destroy', function () {
    Controls.removeBindings();
    Controls.removeActive();
    Binder.destroy();
  });
  return Controls;
}

function Keyboard (Glide, Components, Events) {
  /**
   * Instance of the binder for DOM Events.
   *
   * @type {EventsBinder}
   */
  var Binder = new EventsBinder();
  var Keyboard = {
    /**
     * Binds keyboard events on component mount.
     *
     * @return {Void}
     */
    mount: function mount() {
      if (Glide.settings.keyboard) {
        this.bind();
      }
    },

    /**
     * Adds keyboard press events.
     *
     * @return {Void}
     */
    bind: function bind() {
      Binder.on('keyup', document, this.press);
    },

    /**
     * Removes keyboard press events.
     *
     * @return {Void}
     */
    unbind: function unbind() {
      Binder.off('keyup', document);
    },

    /**
     * Handles keyboard's arrows press and moving glide foward and backward.
     *
     * @param  {Object} event
     * @return {Void}
     */
    press: function press(event) {
      var perSwipe = Glide.settings.perSwipe;

      if (event.code === 'ArrowRight') {
        Components.Run.make(Components.Direction.resolve("".concat(perSwipe, ">")));
      }

      if (event.code === 'ArrowLeft') {
        Components.Run.make(Components.Direction.resolve("".concat(perSwipe, "<")));
      }
    }
  };
  /**
   * Remove bindings from keyboard:
   * - on destroying to remove added events
   * - on updating to remove events before remounting
   */

  Events.on(['destroy', 'update'], function () {
    Keyboard.unbind();
  });
  /**
   * Remount component
   * - on updating to reflect potential changes in settings
   */

  Events.on('update', function () {
    Keyboard.mount();
  });
  /**
   * Destroy binder:
   * - on destroying to remove listeners
   */

  Events.on('destroy', function () {
    Binder.destroy();
  });
  return Keyboard;
}

function Autoplay (Glide, Components, Events) {
  /**
   * Instance of the binder for DOM Events.
   *
   * @type {EventsBinder}
   */
  var Binder = new EventsBinder();
  var Autoplay = {
    /**
     * Initializes autoplaying and events.
     *
     * @return {Void}
     */
    mount: function mount() {
      this.enable();
      this.start();

      if (Glide.settings.hoverpause) {
        this.bind();
      }
    },

    /**
     * Enables autoplaying
     *
     * @returns {Void}
     */
    enable: function enable() {
      this._e = true;
    },

    /**
     * Disables autoplaying.
     *
     * @returns {Void}
     */
    disable: function disable() {
      this._e = false;
    },

    /**
     * Starts autoplaying in configured interval.
     *
     * @param {Boolean|Number} force Run autoplaying with passed interval regardless of `autoplay` settings
     * @return {Void}
     */
    start: function start() {
      var _this = this;

      if (!this._e) {
        return;
      }

      this.enable();

      if (Glide.settings.autoplay) {
        if (isUndefined(this._i)) {
          this._i = setInterval(function () {
            _this.stop();

            Components.Run.make('>');

            _this.start();

            Events.emit('autoplay');
          }, this.time);
        }
      }
    },

    /**
     * Stops autorunning of the glide.
     *
     * @return {Void}
     */
    stop: function stop() {
      this._i = clearInterval(this._i);
    },

    /**
     * Stops autoplaying while mouse is over glide's area.
     *
     * @return {Void}
     */
    bind: function bind() {
      var _this2 = this;

      Binder.on('mouseover', Components.Html.root, function () {
        if (_this2._e) {
          _this2.stop();
        }
      });
      Binder.on('mouseout', Components.Html.root, function () {
        if (_this2._e) {
          _this2.start();
        }
      });
    },

    /**
     * Unbind mouseover events.
     *
     * @returns {Void}
     */
    unbind: function unbind() {
      Binder.off(['mouseover', 'mouseout'], Components.Html.root);
    }
  };
  define(Autoplay, 'time', {
    /**
     * Gets time period value for the autoplay interval. Prioritizes
     * times in `data-glide-autoplay` attrubutes over options.
     *
     * @return {Number}
     */
    get: function get() {
      var autoplay = Components.Html.slides[Glide.index].getAttribute('data-glide-autoplay');

      if (autoplay) {
        return toInt(autoplay);
      }

      return toInt(Glide.settings.autoplay);
    }
  });
  /**
   * Stop autoplaying and unbind events:
   * - on destroying, to clear defined interval
   * - on updating via API to reset interval that may changed
   */

  Events.on(['destroy', 'update'], function () {
    Autoplay.unbind();
  });
  /**
   * Stop autoplaying:
   * - before each run, to restart autoplaying
   * - on pausing via API
   * - on destroying, to clear defined interval
   * - while starting a swipe
   * - on updating via API to reset interval that may changed
   */

  Events.on(['run.before', 'swipe.start', 'update'], function () {
    Autoplay.stop();
  });
  Events.on(['pause', 'destroy'], function () {
    Autoplay.disable();
    Autoplay.stop();
  });
  /**
   * Start autoplaying:
   * - after each run, to restart autoplaying
   * - on playing via API
   * - while ending a swipe
   */

  Events.on(['run.after', 'swipe.end'], function () {
    Autoplay.start();
  });
  /**
   * Start autoplaying:
   * - after each run, to restart autoplaying
   * - on playing via API
   * - while ending a swipe
   */

  Events.on(['play'], function () {
    Autoplay.enable();
    Autoplay.start();
  });
  /**
   * Remount autoplaying:
   * - on updating via API to reset interval that may changed
   */

  Events.on('update', function () {
    Autoplay.mount();
  });
  /**
   * Destroy a binder:
   * - on destroying glide instance to clearup listeners
   */

  Events.on('destroy', function () {
    Binder.destroy();
  });
  return Autoplay;
}

/**
 * Sorts keys of breakpoint object so they will be ordered from lower to bigger.
 *
 * @param {Object} points
 * @returns {Object}
 */

function sortBreakpoints(points) {
  if (isObject(points)) {
    return sortKeys(points);
  } else {
    warn("Breakpoints option must be an object");
  }

  return {};
}

function Breakpoints (Glide, Components, Events) {
  /**
   * Instance of the binder for DOM Events.
   *
   * @type {EventsBinder}
   */
  var Binder = new EventsBinder();
  /**
   * Holds reference to settings.
   *
   * @type {Object}
   */

  var settings = Glide.settings;
  /**
   * Holds reference to breakpoints object in settings. Sorts breakpoints
   * from smaller to larger. It is required in order to proper
   * matching currently active breakpoint settings.
   *
   * @type {Object}
   */

  var points = sortBreakpoints(settings.breakpoints);
  /**
   * Cache initial settings before overwritting.
   *
   * @type {Object}
   */

  var defaults = Object.assign({}, settings);
  var Breakpoints = {
    /**
     * Matches settings for currectly matching media breakpoint.
     *
     * @param {Object} points
     * @returns {Object}
     */
    match: function match(points) {
      if (typeof window.matchMedia !== 'undefined') {
        for (var point in points) {
          if (points.hasOwnProperty(point)) {
            if (window.matchMedia("(max-width: ".concat(point, "px)")).matches) {
              return points[point];
            }
          }
        }
      }

      return defaults;
    }
  };
  /**
   * Overwrite instance settings with currently matching breakpoint settings.
   * This happens right after component initialization.
   */

  Object.assign(settings, Breakpoints.match(points));
  /**
   * Update glide with settings of matched brekpoint:
   * - window resize to update slider
   */

  Binder.on('resize', window, throttle(function () {
    Glide.settings = mergeOptions(settings, Breakpoints.match(points));
  }, Glide.settings.throttle));
  /**
   * Resort and update default settings:
   * - on reinit via API, so breakpoint matching will be performed with options
   */

  Events.on('update', function () {
    points = sortBreakpoints(points);
    defaults = Object.assign({}, settings);
  });
  /**
   * Unbind resize listener:
   * - on destroying, to bring markup to its initial state
   */

  Events.on('destroy', function () {
    Binder.off('resize', window);
  });
  return Breakpoints;
}

var COMPONENTS = {
  // Required
  Html: Html,
  Translate: Translate,
  Transition: Transition,
  Direction: Direction,
  Peek: Peek,
  Sizes: Sizes,
  Gaps: Gaps,
  Move: Move,
  Clones: Clones,
  Resize: Resize,
  Build: Build,
  Run: Run,
  // Optional
  Swipe: Swipe,
  Images: Images,
  Anchors: Anchors,
  Controls: Controls,
  Keyboard: Keyboard,
  Autoplay: Autoplay,
  Breakpoints: Breakpoints
};

var Glide = /*#__PURE__*/function (_Core) {
  _inherits(Glide, _Core);

  var _super = _createSuper(Glide);

  function Glide() {
    _classCallCheck(this, Glide);

    return _super.apply(this, arguments);
  }

  _createClass(Glide, [{
    key: "mount",
    value: function mount() {
      var extensions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return _get(_getPrototypeOf(Glide.prototype), "mount", this).call(this, Object.assign({}, COMPONENTS, extensions));
    }
  }]);

  return Glide;
}(Glide$1);




/***/ }),
/* 26 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "fetchTraveler": () => (/* binding */ fetchTraveler),
/* harmony export */   "fetchTrips": () => (/* binding */ fetchTrips),
/* harmony export */   "fetchDestinations": () => (/* binding */ fetchDestinations),
/* harmony export */   "postNewTrip": () => (/* binding */ postNewTrip)
/* harmony export */ });
function checkStatus(response) {
  if (response.ok) {
    return response.json();
  } else {
    throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
  }
}

function fetchTrips() {
  return fetch('http://localhost:3001/api/v1/trips')
    .then(checkStatus)
}

function fetchDestinations() {
  return fetch('http://localhost:3001/api/v1/destinations')
    .then(checkStatus)
}

function fetchTraveler(id) {
  return fetch(`http://localhost:3001/api/v1/travelers/${id}`)
    .then(checkStatus)
}

function postNewTrip(trip) {
  return fetch('http://localhost:3001/api/v1/trips', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(trip)
  })
    .then((response) => response.json())
    .then((response) => {
      if (response.message === `Trip with id ${trip.id} successfully posted`) {
        return 'Post request successful'
      } else { 
        return 'Post request failed'
      }
    });
}




/***/ }),
/* 27 */
/***/ (function(module) {

!function(e,t){ true?module.exports=t():0}(this,(function(){"use strict";var e={LTS:"h:mm:ss A",LT:"h:mm A",L:"MM/DD/YYYY",LL:"MMMM D, YYYY",LLL:"MMMM D, YYYY h:mm A",LLLL:"dddd, MMMM D, YYYY h:mm A"},t=/(\[[^[]*\])|([-_:/.,()\s]+)|(A|a|YYYY|YY?|MM?M?M?|Do|DD?|hh?|HH?|mm?|ss?|S{1,3}|z|ZZ?)/g,n=/\d\d/,r=/\d\d?/,i=/\d*[^-_:/,()\s\d]+/,o={},s=function(e){return(e=+e)+(e>68?1900:2e3)};var a=function(e){return function(t){this[e]=+t}},f=[/[+-]\d\d:?(\d\d)?|Z/,function(e){(this.zone||(this.zone={})).offset=function(e){if(!e)return 0;if("Z"===e)return 0;var t=e.match(/([+-]|\d\d)/g),n=60*t[1]+(+t[2]||0);return 0===n?0:"+"===t[0]?-n:n}(e)}],h=function(e){var t=o[e];return t&&(t.indexOf?t:t.s.concat(t.f))},u=function(e,t){var n,r=o.meridiem;if(r){for(var i=1;i<=24;i+=1)if(e.indexOf(r(i,0,t))>-1){n=i>12;break}}else n=e===(t?"pm":"PM");return n},d={A:[i,function(e){this.afternoon=u(e,!1)}],a:[i,function(e){this.afternoon=u(e,!0)}],S:[/\d/,function(e){this.milliseconds=100*+e}],SS:[n,function(e){this.milliseconds=10*+e}],SSS:[/\d{3}/,function(e){this.milliseconds=+e}],s:[r,a("seconds")],ss:[r,a("seconds")],m:[r,a("minutes")],mm:[r,a("minutes")],H:[r,a("hours")],h:[r,a("hours")],HH:[r,a("hours")],hh:[r,a("hours")],D:[r,a("day")],DD:[n,a("day")],Do:[i,function(e){var t=o.ordinal,n=e.match(/\d+/);if(this.day=n[0],t)for(var r=1;r<=31;r+=1)t(r).replace(/\[|\]/g,"")===e&&(this.day=r)}],M:[r,a("month")],MM:[n,a("month")],MMM:[i,function(e){var t=h("months"),n=(h("monthsShort")||t.map((function(e){return e.slice(0,3)}))).indexOf(e)+1;if(n<1)throw new Error;this.month=n%12||n}],MMMM:[i,function(e){var t=h("months").indexOf(e)+1;if(t<1)throw new Error;this.month=t%12||t}],Y:[/[+-]?\d+/,a("year")],YY:[n,function(e){this.year=s(e)}],YYYY:[/\d{4}/,a("year")],Z:f,ZZ:f};function c(n){var r,i;r=n,i=o&&o.formats;for(var s=(n=r.replace(/(\[[^\]]+])|(LTS?|l{1,4}|L{1,4})/g,(function(t,n,r){var o=r&&r.toUpperCase();return n||i[r]||e[r]||i[o].replace(/(\[[^\]]+])|(MMMM|MM|DD|dddd)/g,(function(e,t,n){return t||n.slice(1)}))}))).match(t),a=s.length,f=0;f<a;f+=1){var h=s[f],u=d[h],c=u&&u[0],l=u&&u[1];s[f]=l?{regex:c,parser:l}:h.replace(/^\[|\]$/g,"")}return function(e){for(var t={},n=0,r=0;n<a;n+=1){var i=s[n];if("string"==typeof i)r+=i.length;else{var o=i.regex,f=i.parser,h=e.slice(r),u=o.exec(h)[0];f.call(t,u),e=e.replace(u,"")}}return function(e){var t=e.afternoon;if(void 0!==t){var n=e.hours;t?n<12&&(e.hours+=12):12===n&&(e.hours=0),delete e.afternoon}}(t),t}}return function(e,t,n){n.p.customParseFormat=!0,e&&e.parseTwoDigitYear&&(s=e.parseTwoDigitYear);var r=t.prototype,i=r.parse;r.parse=function(e){var t=e.date,r=e.utc,s=e.args;this.$u=r;var a=s[1];if("string"==typeof a){var f=!0===s[2],h=!0===s[3],u=f||h,d=s[2];h&&(d=s[2]),o=this.$locale(),!f&&d&&(o=n.Ls[d]),this.$d=function(e,t,n){try{if(["x","X"].indexOf(t)>-1)return new Date(("X"===t?1e3:1)*e);var r=c(t)(e),i=r.year,o=r.month,s=r.day,a=r.hours,f=r.minutes,h=r.seconds,u=r.milliseconds,d=r.zone,l=new Date,m=s||(i||o?1:l.getDate()),M=i||l.getFullYear(),Y=0;i&&!o||(Y=o>0?o-1:l.getMonth());var p=a||0,v=f||0,D=h||0,g=u||0;return d?new Date(Date.UTC(M,Y,m,p,v,D,g+60*d.offset*1e3)):n?new Date(Date.UTC(M,Y,m,p,v,D,g)):new Date(M,Y,m,p,v,D,g)}catch(e){return new Date("")}}(t,a,r),this.init(),d&&!0!==d&&(this.$L=this.locale(d).$L),u&&t!=this.format(a)&&(this.$d=new Date("")),o={}}else if(a instanceof Array)for(var l=a.length,m=1;m<=l;m+=1){s[1]=a[m-1];var M=n.apply(this,s);if(M.isValid()){this.$d=M.$d,this.$L=M.$L,this.init();break}m===l&&(this.$d=new Date(""))}else i.call(this,e)}}}));

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _glidejs_glide_dist_css_glide_core_min_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _glidejs_glide_dist_css_glide_theme_min_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6);
/* harmony import */ var _css_styles_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(8);
/* harmony import */ var _images_turing_logo_png__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(18);
/* harmony import */ var _images_azores_jpg__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(12);
/* harmony import */ var _images_iceland_jpg__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(13);
/* harmony import */ var _images_mediterranean_jpg__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(11);
/* harmony import */ var _images_mtstmichel_jpg__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(15);
/* harmony import */ var _images_namibia_jpg__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(16);
/* harmony import */ var _images_peru_jpg__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(17);
/* harmony import */ var _images_montana_png__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(14);
/* harmony import */ var _images_toucan_icon_svg__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(19);
/* harmony import */ var _classes_traveler__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(20);
/* harmony import */ var _classes_trips__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(21);
/* harmony import */ var _classes_destinations__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(22);
/* harmony import */ var _backgrounds__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(23);
/* harmony import */ var dayjs__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(24);
/* harmony import */ var dayjs__WEBPACK_IMPORTED_MODULE_16___default = /*#__PURE__*/__webpack_require__.n(dayjs__WEBPACK_IMPORTED_MODULE_16__);
/* harmony import */ var _glidejs_glide__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(25);
/* harmony import */ var _api_calls__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(26);
/*
**************
CSS FILE IMPORTS
**************
*/





/*
**************
IMAGE IMPORTS
**************
*/












/*
**************
CLASS IMPORTS
**************
*/






/*
**************
THIRD PARTY LIBRARY IMPORTS
**************
*/




/*
**************
IMPORTED FUNCTIONS
**************
*/



/*
**************
GLOBAL VARIABLES
**************
*/

let trips, destinations, traveler;
let date = dayjs__WEBPACK_IMPORTED_MODULE_16___default()().format('YYYY/MM/DD');
let picker;
let tripBooking = {};
let bgIndex;

/*
**************
EVENT LISTENERS
**************
*/

addLoginEventListener();

function addSubmitBookingEventListener() {
  document.querySelector('.submit-trip-btn-js').addEventListener('click', function() {
    handleSubmitBooking();
    })
}

function addTravelerNavigationEventListeners() {
  document.querySelector('footer').addEventListener('click', function() {
    if (event.target.classList.contains('bk-trip-js')) {
      showTravelerPage(date, destinations, bgIndex, picker);
    } else if (event.target.classList.contains('my-trips-js')) {
      showTravelerTripsPage();
    }
  })
}

function addLoginEventListener() {
  document.querySelector('.login-btn').addEventListener('click', function() {
    handleSubmitLogin();
  });
}


/*
**************
FETCH REQUESTS
**************
*/

let fetchAPIs = () => {
  Promise.all([(0,_api_calls__WEBPACK_IMPORTED_MODULE_18__.fetchTrips)(), (0,_api_calls__WEBPACK_IMPORTED_MODULE_18__.fetchDestinations)()])
  .then(([tripsData, destinationsData]) => {
    trips = new _classes_trips__WEBPACK_IMPORTED_MODULE_13__.default(tripsData.trips);
    destinations = new _classes_destinations__WEBPACK_IMPORTED_MODULE_14__.default(destinationsData.destinations);
    bgIndex = getRandomIndex(_backgrounds__WEBPACK_IMPORTED_MODULE_15__.default);
    showTravelerPage(date, destinations, bgIndex);
  })
  .catch(error => {
    console.error('Error fetching data:', error.message);
  })
}


/*
**************
FUNCTIONS
**************
*/

populateLoginPage()

// UTILITY FUNCTIONS

function getRandomIndex(array) {
  return Math.floor(Math.random() * array.length);
}

function formatDateToSentence(date) {
  const customParseFormat = __webpack_require__(27);
  dayjs__WEBPACK_IMPORTED_MODULE_16___default().extend(customParseFormat);
  const dateString = dayjs__WEBPACK_IMPORTED_MODULE_16___default()(date).format('YYYY/MM/DD');
  const dayJSDate = dayjs__WEBPACK_IMPORTED_MODULE_16___default()(dateString, 'YYYY/MM/DD');
  return dayJSDate.format('D MMMM YY');
}

function getPastOrUpcomingOrPending(trip) {
  if (trip.status === 'pending') {
    return 'Pending';
  } else if (dayjs__WEBPACK_IMPORTED_MODULE_16___default()(trip.date).isBefore(date)) {
    return 'Past';
  } else {
    return 'Upcoming';
  }
}

// DOM MANIPULATION 
// Traveler Pages: Booking Page

function showTravelerPage(today, destinations, bgIndex) {
  populateTravelerPage(bgIndex)
  populateDestinationList(destinations);
  addSubmitBookingEventListener();
}

function populateTravelerPage(bgIndex) {
  let body = document.querySelector('body');
  body.classList.add('body-grid');
  body.classList.add(`traveler-page${bgIndex}`);
  body.innerHTML = '';
  body.innerHTML = `
  <header>
    <form>
      <div class="input-holder destination-holder">
        <div class="search-icon"></div>
        <select required name="destinationInput" placeholder="Destination" class="trip-input" id="destinationInput" data-id="destinations">
        </select>
      </div>
      <div class="input-holder date-holder">
        <label for="calendarStart" class="trip-input date-label">Depart</label>
        <input type="date" id="calendarStart" name="date-start" min="${dayjs__WEBPACK_IMPORTED_MODULE_16___default()(date).format('YYYY-MM-DD')}" class="calendar trip-input" aria-label="Choose a start date (mm/dd/yyyy) for your vacation."required>
      </div>
      <div class="input-holder date-holder">
        <label for="calendarEnd" class="trip-input date-label">Return</label>
        <input type="date" id="calendarEnd" name="date-start" min="${dayjs__WEBPACK_IMPORTED_MODULE_16___default()(date).format('YYYY-MM-DD')}" class="calendar trip-input" aria-label="Choose an end date (mm/dd/yyyy) for your vacation."required>
      </div>
      <div class="input-holder travelers-holder">
        <div class="search-icon"></div>
        <select required class="trip-input" id="numTravelerInput">
          <option value="1">1 Traveler</option>
          <option value="2">2 Travelers</option>
          <option value="3">3 Travelers</option>
          <option value="4">4 Travelers</option>
          <option value="5">5 Travelers</option>
          <option value="6">6 Travelers</option>
          <option value="7">7 Travelers</option>
          <option value="8">8 Travelers</option>
          <option value="9">9 Travelers</option>
        </select>
      </div>
      <button class="nav-btns submit-btn submit-trip-btn-js">Submit</button>
    </form>
  </header>
  <main>
  </main>
  <footer>
    <nav>
      <button class="nav-btns bk-trip-js">Book Trip</button>
      <div class="nav-separator"></div>
      <button class="nav-btns my-trips-js">My Trips</button>
    </nav>
  </footer>
  `
  addTravelerNavigationEventListeners();
}

/* Booking Page - Search Bar */

function handleSubmitBooking() {
  event.preventDefault();
  const startDate = document.querySelector('#calendarStart').value;
  const endDate = document.querySelector('#calendarEnd').value;
  dateErrorHandling(startDate, endDate)
  const diff = dayjs__WEBPACK_IMPORTED_MODULE_16___default()(endDate).diff(dayjs__WEBPACK_IMPORTED_MODULE_16___default()(startDate), 'day');
  tripBooking = {
    id: trips.getNewTripId(),
    userID: traveler.id,
    destinationID: parseInt(document.querySelector('#destinationInput').value),
    travelers: parseInt(document.querySelector('#numTravelerInput').value),
    date: dayjs__WEBPACK_IMPORTED_MODULE_16___default()(startDate).format('YYYY/MM/DD'),
    duration: diff,
    status: 'pending',
    suggestedActivities: []
  }
  showConfirmBookingPage(startDate, endDate);
}

function populateDestinationList(destinations) {
  let alphabetizedDestinations = destinations.data.sort((a, b) => {
    return a.destination.localeCompare(b.destination);
  });
  alphabetizedDestinations.forEach(destination => {
    let dropDown = document.querySelector('#destinationInput');
    dropDown.innerHTML += `
      <option id="destination_${destination.id}" value="${destination.id}" aria-label="${destination.destination}">${destination.destination}</option>
    `;
  });  
}

function dateErrorHandling(startDate, endDate) {
  if (dayjs__WEBPACK_IMPORTED_MODULE_16___default()(startDate).isAfter(endDate)) {
    showStatusMessages('start after end');
    setTimeout(() => {
      showTravelerPage(date, destinations, bgIndex);
    }, 2000);
    return;
  } else if (startDate === endDate) {
    showStatusMessages('same date');
    setTimeout(() => {
      showTravelerPage(date, destinations, bgIndex);
    }, 2000);
    return;
  } else if (startDate === '' || endDate === '') {
    console.log("yyyy")
    showStatusMessages('empty date');
    setTimeout(() => {
      showTravelerPage(date, destinations, bgIndex);
    }, 2000);
    return;
  }
}

/* Booking Page - Confirm Booking */

function showConfirmBookingPage(start, end) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  let cost = formatter.format(destinations.calculateTripCost(tripBooking.destinationID, tripBooking.travelers, tripBooking.duration));
  let body = document.querySelector('body');
  body.innerHTML = '';
  body.innerHTML = `
  <main class="booking-main">
    <section class="confirm-booking-container">
      <div class="confirm-booking-info">
        <h2 class="booking-confirmation-title">Booking Confirmation</h2> 
        <p class="booking-confirmation-title-subtext"> Let's double check the details on your upcoming trip to ${(destinations.getDestinationById(tripBooking.destinationID).destination).split(",")[0]}.</p>
        <div class="confirm-booking-details-box">
          <h4 class="booking-detail-header">Travelers</h4>
          <p class="booking-detail-text"> ${tripBooking.travelers}</p>
        </div>
        <div class="confirm-booking-details-box">
          <h4 class="booking-detail-header">Dates</h4>
          <p class="booking-detail-text">${formatDateToSentence(start)} to ${formatDateToSentence(end)} (${tripBooking.duration} days)</p>
        </div>
        <div class="confirm-booking-details-box">
          <h4 class="booking-detail-header">Total Cost</h4>
          <p class="booking-detail-text"> ${cost}</p>
        </div>
      </div>
      <section class="confirm-booking-btns-container">
        <button class="booking-btn confirm-btn confirm-booking-btn-js">Confirm</button>
        <button class="booking-btn cancel-btn cancel-booking-btn-js">Cancel</button>
      </section>
      <section class="confirm-booking-img-container">
        <div class="confirm-booking-img-bounding-box">
          <img class="confirm-booking-img" src="${destinations.getDestinationById(tripBooking.destinationID).image}">
        </div>
      </section>
    </section>
  </main>
  `
  document.querySelector('.confirm-booking-btn-js').addEventListener('click', function(event) {
    event.preventDefault();
    (0,_api_calls__WEBPACK_IMPORTED_MODULE_18__.postNewTrip)(tripBooking)
      .then((response) => {
        handlePostSuccess(response);
      })
      .catch((error) => {
        handlePostFailure(error);
      });
  });  
  document.querySelector('.cancel-booking-btn-js').addEventListener('click', function() {
    event.preventDefault();
    showTravelerPage(date, destinations, bgIndex, picker);
  });
}

function handlePostSuccess(response) {
  console.log('Success:', response);
  (0,_api_calls__WEBPACK_IMPORTED_MODULE_18__.fetchTrips)().then(tripData => {
    trips = new _classes_trips__WEBPACK_IMPORTED_MODULE_13__.default(tripData.trips);
    showStatusMessages("success");
    setTimeout(function() {
      showTravelerPage(date, destinations, bgIndex, picker);
    }, 4000);
  })
}
function handlePostFailure(error) {
  console.error('Error:', error);
  showStatusMessages("failure");
  setTimeout(function() {
    showTravelerPage(date, destinations, bgIndex, picker);
  }, 20000);
}

function showStatusMessages(message) {
  let body = document.querySelector('body');
  body.innerHTML = '';
  if (message === "success") {
  body.innerHTML = `
  <main class="booking-main">
    <section class="status-info">
      <h2 class="status-title">Success!</h2> 
      <p class="status-subtext"> Your booking request has been sent to our travel agents. You will receive a confirmation email shortly.</p>
    </section>
  </main>
  `
  } else if (message === 'failure') {
    body.innerHTML = `
    <main class="booking-main">
      <section class="status-info">
          <h2 class="status-title">Booking Request Error</h2> 
          <p class="status-subtext"> There was an issue with our booking systems. Please try again later.</p>
      </section>
    </main>
    `
  } else if (message === 'date error') {
    body.innerHTML = `
    <main class="booking-main">
      <section class="status-info">
          <h2 class="status-title">Booking Request Error</h2>
          <p class="status-subtext">Please select a date range for your booking.</p>
      </section>
    </main>
    `
  } else if (message === 'empty date' || message === 'same date') {
    body.innerHTML = `
    <main class="booking-main">
      <section class="status-info">
          <h2 class="status-title">Booking Request Error</h2>
          <p class="status-subtext">Please select a date range for your booking.</p>
      </section>
    </main>
    `
  } else if (message === 'start after end') {
    body.innerHTML = `
    <main class="booking-main">
      <section class="status-info">
          <h2 class="status-title">Booking Request Error</h2>
          <p class="status-subtext">The return date must be after the departure date.</p>
      </section>
    </main>
    `
  }
}

// Traveler Pages: Trips Page //

function showTravelerTripsPage() {
  populateTravelerTripsPage();
  populateTravelerTripList();
  addTravelerNavigationEventListeners();
}

function populateTravelerTripsPage() {
  let body = document.querySelector('body');
  body.classList.remove('body-grid');
  body.classList.add('body-carousel');
  body.innerHTML = '';
  body.innerHTML = `
  <main class="main-carousel">
    <div class="glide-wrap">
      <div class="glide">
        <div class="glide__track" data-glide-el="track">
          <ul class="glide__slides">
          </ul>
        </div>
        <div class="glide__arrows" data-glide-el="controls">
          <button class="glide__arrow glide__arrow--left" data-glide-dir="<"><< Prev</button>
          <button class="glide__arrow glide__arrow--right" data-glide-dir=">">Next >></button>
        </div>
      </div>
    </div>
  </main>
  <footer class="carousel-footer">
    <nav>
      <button class="nav-btns bk-trip-js">Book Trip</button>
      <div class="nav-separator"></div>
      <button class="nav-btns my-trips-js">My Trips</button>
    </nav>
  </footer>
  `
}

function createTripCard(trip) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  let cost = formatter.format(destinations.calculateTripCost(trip.destinationID, trip.travelers, trip.duration))
  const card = `
    <li class="glide__slide">
    <h3 class="slide-title">${(destinations.getDestinationById(trip.destinationID).destination)} </h3>
      <div class="slide-text-container">
        <div class="slide-details-box ${getPastOrUpcomingOrPending(trip)}">
          <h4 class="booking-detail-header slide-header">Status:</h4>
          <p class="slide-text"> ${getPastOrUpcomingOrPending(trip)}</p>
        </div>
        <div class="slide-details-box">
          <h4 class="booking-detail-header slide-header">Date:</h4>
          <p class="slide-text"> ${formatDateToSentence(trip.date)}</p>
        </div>
        <div class="slide-details-box">
          <h4 class="booking-detail-header slide-header">Duration:</h4>
          <p class="slide-text"> ${trip.duration} days</p>
        </div>
        <div class="slide-details-box">
          <h4 class="booking-detail-header slide-header">Travelers:</h4>
          <p class="slide-text"> ${trip.travelers}</p>
        </div>
        <div class="slide-details-box">
          <h4 class="booking-detail-header slide-header">Total Cost:</h4>
          <p class="slide-text"> ${cost}</p>
        </div>
      </div>
      <div class="slide-img-container">
        <img class="slide-img" src="${destinations.getDestinationById(trip.destinationID).image}">
      </div>
    </li>
  `;
  return card;
}

function createTripsSummaryCard() {
  let totalSpent = trips.calculateTotalSpent(traveler.id, destinations);
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  let faveDestination = trips.getFavoriteDestination(traveler.id);
  let cost = formatter.format(totalSpent)
  const card = `
    <li class="glide__slide traveler-summary-slide">
      <h3 class="slide-title">${traveler.name}</h3>
      <div class="slide-text-container">
        <div class="slide-details-box trips-heading-box">
          <h4 class="booking-detail-header slide-header summary-header">Trips</h4>
        </div> 
        <div class="slide-details-box">
          <h4 class="booking-detail-header slide-header summary-header">Upcoming</h4>
          <p class="slide-text"> ${trips.getUserTripsByDate(traveler.id, "upcoming", date).length}</p>
        </div> 
        <div class="slide-details-box">
          <h4 class="booking-detail-header slide-header summary-header">Pending</h4>
          <p class="slide-text"> ${trips.getUserTripsByStatus(traveler.id, "pending").length}</p>
        </div> 
        <div class="slide-details-box">
          <h4 class="booking-detail-header slide-header summary-header">Past</h4>
          <p class="slide-text"> ${trips.getUserTripsByDate(traveler.id, "past", date).length}</p>
        </div> 
        <div class="slide-details-box trips-heading-box">
          <h4 class="booking-detail-header slide-header summary-header">Traveler Profile</h4>
        </div> 
        <div class="slide-details-box">
          <h4 class="booking-detail-header slide-header">Traveler Style:</h4>
          <p class="slide-text"> ${traveler.travelerType.charAt(0).toUpperCase()}${traveler.travelerType.slice(1)}</p>
        </div> 
        <div class="slide-details-box">
          <h4 class="booking-detail-header slide-header">Total Spent:</h4>
          <p class="slide-text"> ${cost}</p>
        </div> 
          <div class="slide-details-box trips-heading-box">
          <h4 class="booking-detail-header slide-header summary-header">Traveler Stats</h4>
        </div> 
        <div class="slide-details-box">
          <h4 class="booking-detail-header slide-header">Favorite Destination:</h4>
          <p class="slide-text"> ${destinations.getDestinationById(faveDestination).destination}</p>
        </div> 
      </div>
    </li>
  `;
  return card
}


function populateTravelerTripList() {
  let travelerTrips = trips.getTripsByUserId(traveler.id);
  console.log('Traveler Trips', travelerTrips)
  const carousel = document.querySelector('.glide__slides');
  carousel.innerHTML = '';
  carousel.innerHTML += createTripsSummaryCard();
  travelerTrips.forEach(trip => {
    carousel.innerHTML += createTripCard(trip)
  });
  const glide = new _glidejs_glide__WEBPACK_IMPORTED_MODULE_17__.default('.glide', {
    type: 'carousel',
    focusAt: 'center',
    perView: 3,
  })
  glide.mount()
}

/* Login Page */

function populateLoginPage() {
  let body = document.querySelector('body');
  body.classList.add('body-grid');
  bgIndex = getRandomIndex(_backgrounds__WEBPACK_IMPORTED_MODULE_15__.default);
  body.classList.add(`traveler-page${bgIndex}`);
}


function handleSubmitLogin() {
  event.preventDefault();
  let username = document.querySelector('#usernameInput').value;
  let password = document.querySelector('#passwordInput').value;
  let user = username.split('traveler')[1];
  user = parseInt(user);
  if (password === 'travel' && user <= 50 && user >= 1) {
    (0,_api_calls__WEBPACK_IMPORTED_MODULE_18__.fetchTraveler)(user).then((travelerData) => {
        traveler = new _classes_traveler__WEBPACK_IMPORTED_MODULE_12__.default(travelerData);
        showLogo();
        setTimeout(function() {
          showLoginSuccess()
        }, 2500);
        setTimeout(function() {
          fetchAPIs();
        }, 5000);
      })
    .catch((error) => { 
        handleLoginFailure("fetch error");
    });
  } else if (password === '' || username === '') {
    handleLoginFailure("no input");
  } else if (password !== 'travel') {
    handleLoginFailure("password error");
  } else {
    handleLoginFailure("username error");
  }
}

function handleLoginFailure(error) {
  let loginContainer = document.querySelector('.login-container')
  if (error === "fetch error") {
    loginContainer.innerHTML = `
    <h1 class="login-error-header">We Have a Problem</h1>
    <h4 class="login-error">We're sorry, but we couldn't find your account. Please try again.</h4>
    `;
  } else if (error === "username error") {
    loginContainer.innerHTML = `
    <h1 class="login-error-header">Username Error</h1>
    <h4 class="login-error">We're sorry, we don't recognize that username. Please double check your credentials.</h4>
    `;
  } else if (error === "password error") {
    loginContainer.innerHTML = `
    <h1 class="login-error-header">Password Error</h1>
    <h4 class="login-error">We're sorry, that password appears to be incorrect. Please try again.</h4>
    `;
  } else if (error === "no input") {
    loginContainer.innerHTML = `
    <h1 class="login-error-header">Please Enter a Username and Password</h1>
    <h4 class="login-error">Both a username and password are required to login.</h4>
    `;
  }
  setTimeout(function() {
    resetLoginPage();
  }, 4000);
}

function resetLoginPage() {
  let loginContainer = document.querySelector('.login-container');
  loginContainer.innerHTML = `
  <h1 class="login-header">Welcome to Toucan Travel</h1>
  <form class="login-form">
    <input type="text" placeholder="username" class="login-input" id="usernameInput" required>
    <input type="password" placeholder="password" class="login-input" id="passwordInput" required>
    <input type="submit" value="login" class="login-btn">
  </form>
  `
  addLoginEventListener();
}

function showLogo() {
  let body = document.querySelector('body');
  body.classList.remove('body-grid');
  body.innerHTML = "";
  body.innerHTML = `
  <div class="login-success-backer">
    <div class="login-success-container">
      <h1 class="login-success-header">Toucan</h1>
      <div class="toucan-icon-wrapper">
        <img src="./images/toucan-icon.svg" alt="toucan" class="toucan-icon">
      </div>
      <h1 class="login-success-header">Travel</h1>
    </div>
  </div>
  `
}

function showLoginSuccess() {
  let body = document.querySelector('body');
  body.classList.remove('body-grid');
  body.innerHTML = "";
  body.innerHTML = `
  <div class="login-success-backer welcome-backer">
    <div class="login-success-container welcome-container">
      <h1 class="login-success-header welcome-message">Welcome back, ${traveler.name}!</h1>
    </div>
  </div>
  `
}
})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map