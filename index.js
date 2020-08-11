import Vue from "vue";
import MainComponent from "./components/Main.vue";

new Vue({
    render: createElement => createElement(MainComponent),
}).$mount("#app");