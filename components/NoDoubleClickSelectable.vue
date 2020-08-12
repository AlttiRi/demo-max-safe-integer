<template lang="pug">
span.no-double-click-selectable(@click="preventUnnecessarySelecting")
  slot
</template>

<script>
export default {
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
</script>