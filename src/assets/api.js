import moment from 'moment'
import _ from 'lodash'
import * as dfd from "danfojs"
import { parsed, parse } from '@/assets/mathparser.js'


// const result = parsed('e*((a*(b+c))+d)');
// const result = parsed('$col("a")-($some()-20)');
// const result = parsed('$col("T_HJ") - $col("S_HJ")');
// const result = parsed('$col("T_HJ") - 1');
// console.log(result);
// console.log(parse('e*((a*(b+c))+d)'))
// console.log(parse('$col("T_HJ") - $col()'))
// const result = parsed('$col("T_HJ") - $col()*5');
// console.log(result);

// let arr = [[12, 34, 2.2, 2], [30, 30, 2.1, 7]];
// let df = new dfd.DataFrame(/*arr, {columns: ["A", "B", "C", "D"]}*/);
// let df = new dfd.Series([1,2,3,4]);
// console.log(df.constructor.name);
// console.log(1234)
// console.log(moment('2022-09-09').add(1, 'days'));

// console.log(new dfd.DataFrame());

// let df = new dfd.DataFrame();
// df.addColumn('test', [1,2,3], { inplace: true });
// console.log(df);

const { VITE_SEOUL_DATA_APIKEY } = import.meta.env

const apis = [
    {
        id: 0,
        name: '코로나 확진자 및 사망자 발생동향 (전국/서울)',
        desc: '',
        keywords: [],
        author: 'quantlab',
        created_at: new Date(),
        category: 'timeseries', //spot
        params: [ 
            { name: 'start', type: 'default', title: '시작일' },
            { name: 'end', type: 'default', title: '종료일' },
            { name: 'file', type: 'user', title: '요청파일' },
        ], 
        base: {
            provider: '서울 열린데이터 광장',
            webpage: 'http://data.seoul.go.kr/dataList/OA-20461/S/1/datasetView.do',
            apikey: VITE_SEOUL_DATA_APIKEY,
            method: 'get',
            n_limit: 5,
            timestamp_format: [ 'YYYY.MM.DD.HH', 'YY.MM.DD.HH' ],
            data_path: 'TbCorona19CountStatus.row',
            url: 'http://openapi.seoul.go.kr:8088/{$apikey}/{?file}/TbCorona19CountStatus/{$index_from_today({?end})+1}/{$index_from_today({?start})+1}',
            // url: 'http://openapi.seoul.go.kr:8088/{$apikey}/json/TbCorona19CountStatus/{$index_from_today({?end})+1}/{$index_from_today({?start})+1}',
            timestamp_path: 'S_DT',
        },
        cols: [
            // 데이터 위치 path: a.b.c
            { name: 'S_HJ', path: 'S_HJ', title: '서울 확진자수', desc: '서울 확진자수 설명' },
            { name: 'S_DEATH', path: 'S_DEATH', title: '서울 사망자수', desc: '서울 사망자수 설명' },
            { name: 'T_HJ', path: 'T_HJ', title: '전국 확진자수', desc: '전국 확진자수 설명' },
            { name: 'DEATH', path: 'DEATH', title: '전국 사망자수', desc: '전국 사망자수 설명' },
            { name: 'quantlab_0_0', formula: '$col("T_HJ")-$col("S_HJ")', title: '지방 확진자수', desc: '지방 확진자수 설명' },
            { name: 'quantlab_0_1', formula: '$col("DEATH")-$col("S_DEATH")', title: '지방 사망자수', desc: '지방 사망자수 설명' },
        ]
    },
    {
        id: 1,
        name: '코로나 확진자 발생동향 (서울 자치구별)',
        desc: '',
        keywords: [],
        author: 'quantlab',
        created_at: new Date(),
        category: 'timeseries', //spot
        params: [ 
            { name: 'start', type: 'default', title: '시작일' },
            { name: 'end', type: 'default', title: '종료일' },
            { name: 'ftype', type: 'user', title: '요청파일' },
        ], 
        base: {
            provider: '서울 열린데이터 광장',
            webpage: 'http://data.seoul.go.kr/dataList/OA-20470/S/1/datasetView.do',
            apikey: VITE_SEOUL_DATA_APIKEY,
            method: 'get',
            n_limit: 5,
            timestamp_format: [ 'YYYY.MM.DD.HH', 'YY.MM.DD.HH' ],
            data_path: 'TbCorona19CountStatusJCG.row',
            url: 'http://openapi.seoul.go.kr:8088/{$apikey}/{?ftype}/TbCorona19CountStatusJCG/{$index_from_today({?end})+1}/{$index_from_today({?start})+1}',
            // url: 'http://openapi.seoul.go.kr:8088/{$apikey}/json/TbCorona19CountStatusJCG/{$index_from_today({?end})+1}/{$index_from_today({?start})+1}',
            timestamp_path: 'JCG_DT',
        },
        cols: [
            { name: 'JONGNO', path: 'JONGNO', title: '종로구' },
            { name: 'JUNGGU', path: 'JUNGGU', title: '중구' },
            { name: 'YONGSAN', path: 'YONGSAN', title: '용산구' },
            { name: 'SEONGDONG', path: 'SEONGDONG', title: '성동구' },
            { name: 'GWANGJIN', path: 'GWANGJIN', title: '광진구' },
            { name: 'DDM', path: 'DDM', title: '동대문구' },
            { name: 'JUNGNANG', path: 'JUNGNANG', title: '중랑구' },
            { name: 'SEONGBUK', path: 'SEONGBUK', title: '성북구' },
            { name: 'GANGBUK', path: 'GANGBUK', title: '강북구' },
            { name: 'DOBONG', path: 'DOBONG', title: '도봉구' },
            { name: 'NOWON', path: 'NOWON', title: '노원구' },
            { name: 'EP', path: 'EP', title: '은평구' },
            { name: 'SDM', path: 'SDM', title: '서대문구' },
            { name: 'MAPO', path: 'MAPO', title: '마포구' },
            { name: 'YANGCHEON', path: 'YANGCHEON', title: '양천구' },
            { name: 'GANGSEO', path: 'GANGSEO', title: '강서구' },
            { name: 'GURO', path: 'GURO', title: '구로구' },
            { name: 'GEUMCHEON', path: 'GEUMCHEON', title: '금천구' },
            { name: 'YDP', path: 'YDP', title: '영등포구' },
            { name: 'DONGJAK', path: 'DONGJAK', title: '동작구' },
            { name: 'GWANAK', path: 'GWANAK', title: '관악구' },
            { name: 'SEOCHO', path: 'SEOCHO', title: '서초구' },
            { name: 'GANGNAM', path: 'GANGNAM', title: '강남구' },
            { name: 'SONGPA', path: 'SONGPA', title: '송파구' },
            { name: 'GANGDONG', path: 'GANGDONG', title: '강동구' },
            { name: 'ETC', path: 'ETC', title: '기타' },
        ]
    },
    {
        id: 2,
        name: '코로나19 통계추이',
        desc: '',
        keywords: [],
        author: 'quantlab',
        created_at: new Date(),
        category: 'timeseries', //spot
        params: [ 
            { name: 'start', type: 'default', title: '시작일' },
            { name: 'end', type: 'default', title: '종료일' },
            { name: 'filetype', type: 'user', title: '요청파일' },
        ], 
        child: [
            {
                baseid: 0,
                paramap: [
                    { from: 'start', to: 'start' },
                    { from: 'end', to: 'end' },
                    { from: 'filetype', to: 'file' }
                ]
            },
            {
                baseid: 1,
                paramap: [
                    { from: 'start', to: 'start' },
                    { from: 'end', to: 'end' },
                    { from: 'filetype', to: 'ftype' }
                ]
            },
        ],
        cols: [
            { name: 'quantlab_2_0', formula: '$_api("0").col("S_HJ")', title: '서울 확진자수', desc: '서울 확진자수 설명' },
            // { name: 'quantlab_2_1', formula: '$api("1").col("JONGNO")', title: '종로구 확진자수', desc: '종로구 확진자수 설명' },
            // { name: 'quantlab_2_1', formula: '$api("1").col("JONGNO")', title: '종로구 확진자수', desc: '종로구 확진자수 설명' },
        ]
    }
]


class DanfoObj {
    constructor(data) {
        this.obj = this.init_obj(data);
    }

    init_obj(data) {
        const obj_type = this.obj_type;

        if (data.constructor.name.includes(obj_type)) {
            return data
        } else {
            return new dfd[obj_type](data)
        }
    }

    get type() {
        return this.constructor.name
    }

    get obj_type() {
        if (this.type == 'Table') {
            return 'DataFrame'

        } else if (this.type == 'Column') {
            return 'Series'
        }
    }

    r(right) {
        return right.obj ? right.obj : right
    }

    add(right) {
        return new this.constructor(this.obj.add(this.r(right)))
    }

    sub(right) {
        return new this.constructor(this.obj.sub(this.r(right)))
    }

    mul(right) {
        return new this.constructor(this.obj.mul(this.r(right)))
    }

    div(right) {
        return new this.constructor(this.obj.div(this.r(right)))
    }
}


class Column extends DanfoObj {
    constructor(data) {
        super(data);
    }

    sum() {
        return this.obj.sum()
    }
}

class Table extends DanfoObj {
    constructor(data, cols_custom) {
        super(data);
        this.cols_added = [];
        this.add_custom_cols(cols_custom);
        // this.view = {
        //     obj: null,
        //     cols: []
        // }
    }

    _custom_col(name, formula_parsed) {
        try {
            const _col = eval(formula_parsed).obj;
            _col.$columns = [ name ];
            return _col

        } catch(e) {
            throw new Error(`something wrong while getting column [${name}]: ${formula}`);
        }
    }

    // view_custom_cols(cols) {
    //     const view_obj = cols.map(col => {
    //         const _formula = parsed(col.formula).replaceAll('$', 'this.');
    //         this.view.cols.push({
    //             name: col.name,
    //             formula: col.formula,
    //             formula_parsed: _formula
    //         });

    //         return this._custom_col(col.name, _formula)
    //     });

    //     this.view.obj = dfd.concat({ dfList: view_obj, axis: 1 });
    // }

    add_custom_cols(cols) {
        cols.forEach(col => {
            const _formula = parsed(col.formula).replaceAll('$', 'this.');
            this.cols_added.push({
                name: col.name,
                formula: col.formula,
                formula_parsed: _formula
            });

            this.obj.addColumn(col.name, this._custom_col(col.name, _formula), { inplace: true });
        })
    }

    col(name) {
        return new Column(this.obj[name])
    }
}



class Loader {
    constructor(api, p) {
        this.api = api;
        this.p = p;
        this.child = this._child(api, p);
        this.table = null;
    }

    _child(api, p) {
        if (api.child) {
            return api.child.map(_api => { 
                return this.constructor.build(_api, p) 
            })
        }
    }

    static _check_params_well_provided(api, p) {
        // console.log(api.params, p)
        const all_provided = api.params.every(param => { return param.name in p });

        if (!all_provided) {
            throw new Error('all parameters must be provided: ' + JSON.stringify(api.params));
        
        } else if (api.params.length != Object.keys(p).length) {
            throw new Error('input more than necessary');
        }
    }

    static _check_params_usage(api, p) {
        if (api.base) {
            const params_used = api.base.url.match(/(?<=\{\?)([\w]+((?!\+|\-|\*|\/|\{|\}).)*)(?=\})/g);
            const all_used = api.params.every(param => { return params_used.includes(param.name) });

            if (!all_used) {
                throw new Error('all parameters must be used: ' + JSON.stringify(api.params));
            
            } else if (api.params.length != params_used.length) {
                throw new Error('need more api parameters for usage');
            }

        } else if (api.child) {

        }
    }

    static _check_params(api, p) {
        this._check_params_well_provided(api, p);
        this._check_params_usage(api, p);
    }

    static build(api, p) {
        if ('baseid' in api) {    
            return this.build_by_apid(api, p)

        } else {
            this._check_params(api, p);

            if (api.category == 'timeseries' && api.base) {
                return new TimeseriesBaseloader(api, p)
            
            } else if (api.category == 'timeseries' && api.child) {
                return new TimeseriesLoader(api, p)
            
            } else {
    
            }
        }
    }

    static build_by_apid(api, p) {
        const _api = apis.find(o => o.id == api.baseid);

        if (_api) {
            const _p = api.paramap.reduce((acc, cur) => {

                if (!(cur.from in p)) {
                    throw new Error('something wrong while mapping parameters');
                }

                acc[cur.to] = p[cur.from];
                return acc

            }, {});

            return this.build(_api, _p)

        } else {
            throw new Error('cannot find api');
        }    
    }

    async _load() {
        throw new Error('_load() method must be implemented');
    }


    // async _load_child() {
    //     // await this.child.forEach(async c => { 
    //     await this.child.map(async c => {     
    //         // console.log(1)
    //         await c.load(); 
    //     });
    //     // console.log('kk')
    // }

    async _load_child() {
        await Promise.all(this.child.map(async c => {
            await c.load();
        }));
    }

    async load() {
        if (this.child) {
            await this._load_child();
            console.log(this.cols())

        } else {
            await this._load();
        }
    }

    // get(cols) {
    //     this.table.view_custom_cols(cols);
    // }    

    cols() {
        const _cols = this.api.cols.map(col => {
            const _formula = parsed(col.formula).replaceAll('$', 'this.');
            // this.view.cols.push({
            //     name: col.name,
            //     formula: col.formula,
            //     formula_parsed: _formula
            // });

            // return this._custom_col(col.name, _formula)
            console.log(_formula)
            return eval(_formula)
        });

        return _cols

        // this.view.obj = dfd.concat({ dfList: view_obj, axis: 1 });
    }

    
    // 9/26
    // 밑에 _api 이름을 바꿔야한다
    // this.api 라는게 원래 있다
    _api(apid) {
        // console.log(this.child.find(c => c.api.id == Number(apid)))
        return this.child.find(c => c.api.id == apid)
    }

    col(cname) {
        return this.table.col(cname)
    }
}


class TimeseriesLoader extends Loader {
    // async load() {
    //     await this.base.load();
    //     this.table = this.base.table;
    // }
}


class Baseloader extends Loader {
    constructor(api, p) {
        super(api, p);
        this.resp = {};
        this.cols_origin = this.api.cols.filter(o => o.path);
        this.cols_custom = this.api.cols.filter(o => o.formula);
    }

    get apikey() {
        return this.api.base.apikey
    }
}


class TimeseriesBaseloader extends Baseloader {
    constructor(api, p) {
        super(api, p);
        this.today = moment();
        this.baseurl = this._baseurl();
        this.date_chunks = this._date_chunks();
    }

    index_from_today(dt) {
        return this.today.diff(dt, 'days')
    }

    _baseurl() {
        // replace ?params with values
        return this.api.base.url
            .replace(/\{\?([\w]+((?!\+|\-|\*|\/|\{|\}).)*)\}/g, (match, $1)=> { 
                if ($1 == 'start' || $1 == 'end') {
                    return $1

                } else {
                    return this.p[$1]
                }
            })
    }


    _date_chunks() {
        const start = moment(this.p.start);
        const end = moment(this.p.end).add(1, 'days');
        return this._split_dates(start, end)
    }

    _split_dates(start, end) {
        const _chunks = [];

        if (this.api.base.n_limit) {
            const diff = end.diff(start, 'days') + 1;
        
            if (diff > this.api.base.n_limit) {
                const start_0 = end.clone().add(-this.api.base.n_limit + 1, 'days');
                _chunks.push([start_0, end]);
        
                const end_1 = start_0.clone().add(-1, 'days');
                _chunks.push(...this._split_dates(start, end_1));
        
            } else {
                _chunks.push([start, end]);
            }
    
        } else {
            _chunks.push([start, end]);
        }

        return _chunks
    }

    _parse_timestamp(dt) {
        if (Array.isArray(this.api.base.timestamp_format)) {
            let _timestamp;
    
            for (let fmt of this.api.base.timestamp_format) {
                if (fmt.length == dt.length) {
                    _timestamp = moment(dt, fmt).toDate()
                    break
                }
            }
    
            return _timestamp
    
        } else {
            return moment(dt, this.api.base.timestamp_format).toDate()
        }
    }

    _timeseries_adapter(o) {
        const obj = { 
            timestamp: this._parse_timestamp(_.get(o, this.api.base.timestamp_path)) 
        };

        this.cols_origin.forEach(col => {
            obj[col.name] = _.get(o, col.path) * 1;
        })

        return obj
    }

    _url(start, end) {
        const url_split = this.baseurl
            .split(/\{|\}/g)
            .map(o => {
                if (o.startsWith('$')) {
                    return eval(o.replace('$', 'this.'))

                } else {
                    return o
                }
            });
        
        return url_split.join('')
    }

    async _load() {
        let d = [];

        await Promise.all(this.date_chunks.map(async ([start, end]) => {
            const url = this._url(start, end); 
            const resp = await fetch(url);
            const x = await resp.json();
            const _data = _.get(x, this.api.base.data_path).map(this._timeseries_adapter.bind(this));
            d.push(..._data);
            this.resp[url] = x;
        }));

        d = d.filter(o => {
            return o.timestamp >= moment(this.p.start) && o.timestamp <= moment(this.p.end)
        }).sort((a,b) => a.timestamp - b.timestamp);

        this.table = new Table(d, this.cols_custom);
        // this.table.obj.print()
    }
}


export {
    apis,
    Loader,
    TimeseriesBaseloader
}