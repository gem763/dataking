<script setup>
import { ref, computed } from 'vue'
import moment from 'moment'

const { VITE_SEOUL_DATA_APIKEY } = import.meta.env

// defineProps({
//     msg: String
// })


/*
user inputs
*/
const start_date = '2022-08-20';
// const start_date = '2020-01-25';
const end_date = '2022-09-02';


/*
provider inputs
*/
// const url_base = 'http://openapi.seoul.go.kr:8088';
// const apikey = VITE_SEOUL_DATA_APIKEY;
const service = 'TbCorona19CountStatus';
const measure_unit = 'day';
const n_single_call = 5;

const date_chunks = (start, end) => {
    const _chunks = [];
    let date_0 = moment(start);
    let date_1 = moment(end);
    
    const diff = date_1.diff(date_0, 'days');

    if (diff > n_single_call) {
        date_0 = date_1.add(-n_single_call, 'days');
        _chunks.push([date_0.format('YYYY-MM-DD'), end]);

        let date_1_prev = date_0.add(-1, 'days').format('YYYY-MM-DD');
        _chunks.push(...date_chunks(start, date_1_prev));

    } else {
        _chunks.push([start, end]);
    }

    return _chunks
}

// console.log(date_chunks(start_date, end_date));

// const url = `${url_base}/${apikey}/${type}/${service}/${end_offset}/${start_offset}`;
const url = (start, end) => {
    const today = moment();
    const start_page = today.diff(start, 'days');
    const end_page = today.diff(end, 'days');
    const url_base = 'http://openapi.seoul.go.kr:8088';
    const apikey = VITE_SEOUL_DATA_APIKEY;

    return `${url_base}/${apikey}/json/TbCorona19CountStatus/${end_page}/${start_page}`
}

const timestamp_format = [ 'YYYY.MM.DD.HH', 'YY.MM.DD.HH' ];
// const timestamp_format = 'YYYY.MM.DD.HH';


const timestamp_parser = (dt) => {
    if (Array.isArray(timestamp_format)) {
        let _timestamp;

        for (let fmt of timestamp_format) {
            if (fmt.length == dt.length) {
                _timestamp = moment(dt, fmt).toDate()
                break
            }
        }

        return _timestamp

    } else {
        return moment(dt, timestamp_format).toDate()
    }
}


const adapter = o => {
    return {
        date: o.S_DT,//.slice(0, 10),
        timestamp: timestamp_parser(o.S_DT),
        seoul: {
            confirmed: o.S_HJ * 1,
            death: o.S_DEATH * 1,
        },
        all: {
            confirmed: o.T_HJ * 1,
            death: o.DEATH * 1,
        }
    }
}

const api = {

}

const data = ref([]);
const data_sorted = computed(() => {
    return data.value.sort((a,b) => a.timestamp - b.timestamp)
})


// 유저입장에서, start_date, end_date만 있으면 된다
const run = () => {
    date_chunks(start_date, end_date).forEach(([start, end]) => {
        fetch(url(start, end))
            .then(x => x.json())
            .then(x => {
                try {
                    data.value.push(...x[service].row.map(adapter));

                } catch(e) {
                    console.log(e);
                }
            })
    });
}
</script>

<template>
    <button @click="run">RUN</button>
</template>

<style scoped>
</style>
    