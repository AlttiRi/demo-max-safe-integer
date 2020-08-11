<template>
  <div class="main">
    <span @click="onClick">
      <NoDoubleClickSelectable>
        <FormattedNumber :style="{color}" :number="value"/>
      </NoDoubleClickSelectable>
    </span>
  </div>
</template>

<script>
import FormattedNumber from "./FormattedNumber.vue";
import NoDoubleClickSelectable from "./NoDoubleClickSelectable.vue";

export default {
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
    FormattedNumber,
    NoDoubleClickSelectable
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
</script>

<style lang="sass" scoped>
.main
  display: flex
  flex-direction: column
  justify-content: center
  align-items: center
  height: 100%

.main::v-deep
  .formatted-number
    font-size: 8vw
    color: cornflowerblue
    text-shadow: 0 0 2vw #08080840
    .trio
      .pad
        letter-spacing: 1.6vw

@media all and (min-width: 1500px)
  .main::v-deep
    .formatted-number
      font-size: 120px
      text-shadow: 0 0 30px #08080840
      .trio
        .pad
          letter-spacing: 24px
</style>