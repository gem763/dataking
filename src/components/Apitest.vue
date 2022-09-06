<script setup>
import { ref, computed } from 'vue'
import { UserApi } from '@/assets/api.js'

const data = ref([]);
const data_sorted = computed(() => {
    return data.value.sort((a,b) => a.timestamp - b.timestamp)
})

/*
user inputs
*/
const start_date = '2022-09-01';
const end_date = '2022-09-02';

const run = () => {
    const userapi = new UserApi(0, start_date, end_date);
    data.value = userapi.data;
}
</script>

<template>
    <button @click="run">RUN</button>
</template>

<style scoped>
</style>
    