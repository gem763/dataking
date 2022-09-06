import moment from 'moment'
import _ from 'lodash'

const { VITE_SEOUL_DATA_APIKEY } = import.meta.env

const api_specs = [
    {
        id: 0,
        name: 'TbCorona19CountStatus',
        apikey: VITE_SEOUL_DATA_APIKEY,
        method: 'get',
        category: {
            type: 'timeseries',
            unit: 'day',
        },
        data_path: 'TbCorona19CountStatus.row',

        struct: {
            'seoul.confirmed': { title: '서울 확진자수', src: 'S_HJ' },
            'seoul.death': { title: '서울 사망자수', src: 'S_DEATH' },
            'all.confirmed': { title: '전국 확진자수', src: 'T_HJ' },
            'all.death': { title: '전국 사망자수', src: 'DEATH' }
        },

        n_single_call: 5,
        url: function(apikey, start, end) {
            const today = moment();
            const start_page = today.diff(start, 'days');
            const end_page = today.diff(end, 'days');
        
            return `http://openapi.seoul.go.kr:8088/${apikey}/json/TbCorona19CountStatus/${end_page}/${start_page}`
        },
        timestamp_format: [ 'YYYY.MM.DD.HH', 'YY.MM.DD.HH' ]
    }
]

class ProviderApi {}

class UserApi {
    constructor(data_id, start_date, end_date) {
        this.data_id = data_id;
        this.start_date = start_date;
        this.end_date = end_date;
        this.api_spec = api_specs.filter(o => o.id == data_id)[0];
        this.date_chunks = this._split_dates(start_date, end_date);
        this.data = [];
        this.run();
    }

    _split_dates(start, end) {
        const _chunks = [];
        let date_0 = moment(start);
        let date_1 = moment(end);
        
        const diff = date_1.diff(date_0, 'days');
    
        if (diff > this.api_spec.n_single_call) {
            date_0 = date_1.add(-this.api_spec.n_single_call, 'days');
            _chunks.push([date_0.format('YYYY-MM-DD'), end]);
    
            let date_1_prev = date_0.add(-1, 'days').format('YYYY-MM-DD');
            _chunks.push(...this._split_dates(start, date_1_prev));
    
        } else {
            _chunks.push([start, end]);
        }
    
        return _chunks
    }

    _parse_timestamp(dt) {
        if (Array.isArray(this.api_spec.timestamp_format)) {
            let _timestamp;
    
            for (let fmt of this.api_spec.timestamp_format) {
                if (fmt.length == dt.length) {
                    _timestamp = moment(dt, fmt).toDate()
                    break
                }
            }
    
            return _timestamp
    
        } else {
            return moment(dt, this.api_spec.timestamp_format).toDate()
        }
    }

    _timeseries_adapter(o) {
        const struct = this.api_spec.struct;
        const obj = { timestamp: this._parse_timestamp(o.S_DT) };

        for (let key in struct) {
            _.set(obj, key, o[struct[key].src] * 1);
        }

        return obj
    }

    run() {
        this.date_chunks.forEach(([start, end]) => {
            fetch(this.api_spec.url(this.api_spec.apikey, start, end))
                .then(x => x.json())
                .then(x => {
                    try {
                        const _data = _.get(x, this.api_spec.data_path).map(this._timeseries_adapter.bind(this));
                        this.data.push(..._data);
    
                    } catch(e) {
                        console.log(e);
                    }
                });
        });
    }
}

export {
    UserApi,
    ProviderApi
}