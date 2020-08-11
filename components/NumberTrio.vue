<!--<template>-->
<!--  <span class="trio"><span-->
<!--      v-if="part1"-->
<!--  >{{part1}}</span-->
<!--  ><span-->
<!--      :style="{letterSpacing: padding}"-->
<!--      class="pad"-->
<!--      v-if="part2"-->
<!--  >{{part2}}</span-->
<!--  ></span>-->
<!--</template>-->

<template lang="pug">
  span.trio
    span(v-if="part1") {{part1}}
    span.pad(v-if="part2" :style="{letterSpacing: padding}") {{part2}}
</template>

<script>
export default {
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
}
</script>