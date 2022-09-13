<script setup>
import { ref, computed, reactive } from 'vue'
import { Loader, Multiloader } from '@/assets/api.js'

/*
user inputs
*/
const apid = ref(0);
const start_date = ref('2022-09-01');
const end_date = ref('2022-09-09');
// const cols = ref([
//     { name: 'custom1', formula: '$col("0_quantlab_1")*2' },
//     { name: 'custom2', formula: '$col("S_HJ")*0 + $col("DEATH").sum()' },
// ]);

const specs = {
    0: { start: start_date.value, end: end_date.value },
    1: { start: start_date.value, end: end_date.value }
}

// const specs = new Map([
//     [0, { start: start_date, end: end_date }],
//     [1, { start: start_date, end: end_date }],
// ])

const multiloader = new Multiloader(specs);

// const loader = ref(null);

const load = () => {
    // loader.value = Loader.build(apid.value, {
    //     start: start_date.value,
    //     end: end_date.value,
    // });

    // loader.value.load();
    multiloader.load();
}

const get = () => {
    // loader.value.get(cols.value);
}
</script>

<template>
    <button @click="load">LOAD</button>
    <button @click="get">GET</button>
</template>

<style scoped>
</style>
    