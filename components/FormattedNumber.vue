<!--
  It works OK only with integer numbers and partially with decimal numbers
  (no support of `1.2e-34`, `Infinity`, `NaN`, for example)
 -->
<template>
  <span class="formatted-number">
    <span class="minus" v-if="isNegative">-</span
    ><span class="integer"
    ><NumberTrio
        v-for="(integerTrio, index) of integerTrios"
        :value="integerTrio"
        :position="index"
        :count="integerTrios.length"
        :key="index"
        :padding="padding"
    /></span
    ><span class="point" v-if="decimalTrimmed">.</span
    ><span class="decimal" v-if="decimalTrimmed">{{decimalTrimmed}}</span>
  </span>
</template>

<script>
import NumberTrio from "./NumberTrio.vue";

export default {
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
  components: {NumberTrio}
};
</script>