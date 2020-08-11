(function (Vue) {
  'use strict';

  Vue = Vue && Object.prototype.hasOwnProperty.call(Vue, 'default') ? Vue['default'] : Vue;

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //

  var script = {
    name: "NumberTrio",
    props: {
      value: {
        type: String,
        required: true,
        validator(value) {
          return Boolean(value.match(/^\d+$/));
        }
      },
      position: {
        type: Number,
        required: true,
      },
      count: {
        type: Number,
        required: true,
      },
      padding: { // letterSpacing value, e.g., "5px"
        type: String
      },
    },
    computed: {
      part1() {
        return this.parts.part1;
      },
      part2() {
        return this.parts.part2;
      },
      parts() {
        const el = this.value;
        if (this.isLast) {
          return {
            part1: el,
            part2: ""
          };
        } else {
          return {
            part1: el.substring(0, el.length - 1),
            part2: el.substring(el.length - 1)
          };
        }
      },
      isLast() {
        return this.position === this.count - 1;
      }
    }
  };

  function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
      if (typeof shadowMode !== 'boolean') {
          createInjectorSSR = createInjector;
          createInjector = shadowMode;
          shadowMode = false;
      }
      // Vue.extend constructor export interop.
      const options = typeof script === 'function' ? script.options : script;
      // render functions
      if (template && template.render) {
          options.render = template.render;
          options.staticRenderFns = template.staticRenderFns;
          options._compiled = true;
          // functional template
          if (isFunctionalTemplate) {
              options.functional = true;
          }
      }
      // scopedId
      if (scopeId) {
          options._scopeId = scopeId;
      }
      let hook;
      if (moduleIdentifier) {
          // server build
          hook = function (context) {
              // 2.3 injection
              context =
                  context || // cached call
                      (this.$vnode && this.$vnode.ssrContext) || // stateful
                      (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
              // 2.2 with runInNewContext: true
              if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                  context = __VUE_SSR_CONTEXT__;
              }
              // inject component styles
              if (style) {
                  style.call(this, createInjectorSSR(context));
              }
              // register component module identifier for async chunk inference
              if (context && context._registeredComponents) {
                  context._registeredComponents.add(moduleIdentifier);
              }
          };
          // used by ssr in case component is cached and beforeCreate
          // never gets called
          options._ssrRegister = hook;
      }
      else if (style) {
          hook = shadowMode
              ? function (context) {
                  style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
              }
              : function (context) {
                  style.call(this, createInjector(context));
              };
      }
      if (hook) {
          if (options.functional) {
              // register for functional component in vue file
              const originalRender = options.render;
              options.render = function renderWithStyleInjection(h, context) {
                  hook.call(context);
                  return originalRender(h, context);
              };
          }
          else {
              // inject component registration as beforeCreate hook
              const existing = options.beforeCreate;
              options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
          }
      }
      return script;
  }

  /* script */
  const __vue_script__ = script;

  /* template */
  var __vue_render__ = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("span", { staticClass: "trio" }, [
      _vm.part1 ? _c("span", [_vm._v(_vm._s(_vm.part1))]) : _vm._e(),
      _vm.part2
        ? _c(
            "span",
            { staticClass: "pad", style: { letterSpacing: _vm.padding } },
            [_vm._v(_vm._s(_vm.part2))]
          )
        : _vm._e()
    ])
  };
  var __vue_staticRenderFns__ = [];
  __vue_render__._withStripped = true;

    /* style */
    const __vue_inject_styles__ = undefined;
    /* scoped */
    const __vue_scope_id__ = undefined;
    /* module identifier */
    const __vue_module_identifier__ = undefined;
    /* functional template */
    const __vue_is_functional_template__ = false;
    /* style inject */
    
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__ = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
      __vue_inject_styles__,
      __vue_script__,
      __vue_scope_id__,
      __vue_is_functional_template__,
      __vue_module_identifier__,
      false,
      undefined,
      undefined,
      undefined
    );

  //

  var script$1 = {
    name: "FormattedNumber",
    props: {
      number: {
        type: Number,
        required: true,
      },
      precision: { // Count of numbers after the point (the dot), if the integer part contains 1 digit
        type: Number,
        default: 2 // result for "3": "1.123", "10.12", "100.1", "1000"; for "2": "1.01", "10", "100";
      },
      padding: {   // letterSpacing value, e.g., "5px"
        type: String,
        default: null
      }
    },
    computed: {
      /** @returns {Boolean} */
      isNegative() {
        return this.parts.isNegative;
      },
      /** @returns {String} */
      integer() {
        return this.parts.integer;
      },
      /** @returns {String} */
      decimal() {
        return this.parts.decimal;
      },
      parts() {
        const [integer, decimal] = this.number.toString().split(".");
        const isNegative = this.number < 0;
        return {
          isNegative,
          integer: isNegative ? integer.substring(1) : integer,
          decimal
        };
      },
      decimalTrimmed() {
        const [integer, decimal] = [this.integer, this.decimal];
        const precision = this.precision;

        if (decimal) {
          const subDecimal = decimal.substring(0, precision + 1 - integer.length);
          // if contains only zeros
          return subDecimal.match(/^0*$/) ? "" : subDecimal;
        }
        return null;
      },
      integerTrios() {
        return this.getTrios(this.integer);
      }
    },
    methods: {
      getTrios(number) {
        const trios = [];
        const offset = ((number.length % 3) - 3) % 3;
        for (let i = offset; i < number.length; i += 3) {
          const part = number.substring(i, i + 3);
          trios.push(part);
        }
        return trios;
      }
    },
    components: {NumberTrio: __vue_component__}
  };

  /* script */
  const __vue_script__$1 = script$1;

  /* template */
  var __vue_render__$1 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("span", { staticClass: "formatted-number" }, [
      _vm.isNegative
        ? _c("span", { staticClass: "minus" }, [_vm._v("-")])
        : _vm._e(),
      _c(
        "span",
        { staticClass: "integer" },
        _vm._l(_vm.integerTrios, function(integerTrio, index) {
          return _c("NumberTrio", {
            key: index,
            attrs: {
              value: integerTrio,
              position: index,
              count: _vm.integerTrios.length,
              padding: _vm.padding
            }
          })
        }),
        1
      ),
      _vm.decimalTrimmed
        ? _c("span", { staticClass: "point" }, [_vm._v(".")])
        : _vm._e(),
      _vm.decimalTrimmed
        ? _c("span", { staticClass: "decimal" }, [
            _vm._v(_vm._s(_vm.decimalTrimmed))
          ])
        : _vm._e()
    ])
  };
  var __vue_staticRenderFns__$1 = [];
  __vue_render__$1._withStripped = true;

    /* style */
    const __vue_inject_styles__$1 = undefined;
    /* scoped */
    const __vue_scope_id__$1 = undefined;
    /* module identifier */
    const __vue_module_identifier__$1 = undefined;
    /* functional template */
    const __vue_is_functional_template__$1 = false;
    /* style inject */
    
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$1 = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
      __vue_inject_styles__$1,
      __vue_script__$1,
      __vue_scope_id__$1,
      __vue_is_functional_template__$1,
      __vue_module_identifier__$1,
      false,
      undefined,
      undefined,
      undefined
    );

  //
  //
  //
  //
  //
  //

  var script$2 = {
    name: "NoDoubleClickSelectable",
    data() {
      return {
        timerId: null
      }
    },
    methods: {
      preventUnnecessarySelecting() {
        this.$el.style.userSelect = "none";
        window.getSelection().empty();

        clearTimeout(this.timerId);
        this.timerId = setTimeout(() => {
          this.$el.style.userSelect = "";
        }, 500);
      }
    }
  };

  /* script */
  const __vue_script__$2 = script$2;

  /* template */
  var __vue_render__$2 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "span",
      {
        staticClass: "no-double-click-selectable",
        on: { click: _vm.preventUnnecessarySelecting }
      },
      [_vm._t("default")],
      2
    )
  };
  var __vue_staticRenderFns__$2 = [];
  __vue_render__$2._withStripped = true;

    /* style */
    const __vue_inject_styles__$2 = undefined;
    /* scoped */
    const __vue_scope_id__$2 = undefined;
    /* module identifier */
    const __vue_module_identifier__$2 = undefined;
    /* functional template */
    const __vue_is_functional_template__$2 = false;
    /* style inject */
    
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$2 = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$2, staticRenderFns: __vue_staticRenderFns__$2 },
      __vue_inject_styles__$2,
      __vue_script__$2,
      __vue_scope_id__$2,
      __vue_is_functional_template__$2,
      __vue_module_identifier__$2,
      false,
      undefined,
      undefined,
      undefined
    );

  //

  var script$3 = {
    name: "Main",
    data() {
      return {
        value: Number.MAX_SAFE_INTEGER,
        color: null
      }
    },
    methods: {
      onClick() {
        this.color = randomHexColor();
      }
    },
    components: {
      FormattedNumber: __vue_component__$1,
      NoDoubleClickSelectable: __vue_component__$2
    }
  };

  function randomHexColor() {
    const numbers = [
      Number(Math.trunc(Math.random() * 256)),
      Number(Math.trunc(Math.random() * 256)),
      Number(Math.trunc(Math.random() * 256))
    ];
    return `rgb(${numbers.join()})`;
  }

  /* script */
  const __vue_script__$3 = script$3;
  /* template */
  var __vue_render__$3 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { staticClass: "main" }, [
      _c(
        "span",
        { on: { click: _vm.onClick } },
        [
          _c(
            "NoDoubleClickSelectable",
            [
              _c("FormattedNumber", {
                style: { color: _vm.color },
                attrs: { number: _vm.value }
              })
            ],
            1
          )
        ],
        1
      )
    ])
  };
  var __vue_staticRenderFns__$3 = [];
  __vue_render__$3._withStripped = true;

    /* style */
    const __vue_inject_styles__$3 = undefined;
    /* scoped */
    const __vue_scope_id__$3 = "data-v-926574d4";
    /* module identifier */
    const __vue_module_identifier__$3 = undefined;
    /* functional template */
    const __vue_is_functional_template__$3 = false;
    /* style inject */
    
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$3 = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$3, staticRenderFns: __vue_staticRenderFns__$3 },
      __vue_inject_styles__$3,
      __vue_script__$3,
      __vue_scope_id__$3,
      __vue_is_functional_template__$3,
      __vue_module_identifier__$3,
      false,
      undefined,
      undefined,
      undefined
    );

  new Vue({
      render: createElement => createElement(__vue_component__$3),
  }).$mount("#app");

}(Vue));
//# sourceMappingURL=index.js.map
