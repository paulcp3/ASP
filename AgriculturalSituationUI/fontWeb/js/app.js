window.FilterValueHelper = function(contextPath) {
    var contextPath = contextPath ? contextPath : '';

    var helperObj = this;

    var defaultFilterValueDefineObject = {
        parameter: null,
        filterValueObj: null,
        FOID: null
    }

    var defaultParameter = {
        'class': 'com.allfirst.job.model.Parameter',
        'name': null,
        'type': 'string',
        'value': [],
        'displayValue': [],
        'nullAble': true
    }

    var defaultFilterValueObject = {
        index: -1,
        type: 'string',
        filterValues: []
    }

    helperObj.create = function(key, index, values, FOID) {
        var filterValueDefineObj = etool.clone(defaultFilterValueDefineObject);
        if (key != null || $.type(index) != 'number' || $.type(values) != 'array') {
            var parameter = etool.clone(defaultParameter);
            var filterValueObj = etool.clone(defaultFilterValueObject);

            parameter.name = key;
            parameter.value = values;
            parameter.displayValue = values;

            filterValueObj.index = index >= 0 ? index : 0;
            filterValueObj.filterValues = values;

            filterValueDefineObj.parameter = parameter;
            filterValueDefineObj.filterValueObj = filterValueObj;
            filterValueDefineObj.FOID = FOID != null ? FOID : '_custom_' + etool.randomId();

            return filterValueDefineObj;
        }
    }

    helperObj.getFilterValues = function(obj) {
        /*
            将chartObj或dataObj中的parameters、filters提出来，
            '_custom_'开头的是非控件提供，
            其它均为控件的htmlID开头
        */
        var filterValues = [];
        if ($.type(obj) == 'object' &&
            $.type(obj.parameters) == 'object' &&
            $.type(obj.filters) == 'object') {
            $.each(obj.parameters || [], function(FOID, parameter) {
                var filterValueObj = obj.filters[FOID];

                if (parameter != null && filterValueObj != null) {
                    var filterValueDefineObj = etool.clone(defaultFilterValueDefineObject);
                    filterValueDefineObj.parameter = parameter;
                    filterValueDefineObj.filterValueObj = filterValueObj;
                    filterValueDefineObj.FOID = FOID;

                    filterValues.push(filterValueDefineObj);
                }
            })
        }
        return filterValues;
    }
}
window.filterHelper = new FilterValueHelper();
var GETBASE, GETUUID, GETREGIONID, GETAPIROOT;
if (typeof(window.getBaseUrl) != 'undefined') {
    GETBASE = window.getBaseUrl();
    GETUUID = window.getUuid();
    GETREGIONID = window.getRegionId();
    GETAPIROOT = window.getApiRoot();
} else {
    GETBASE = 'http://36.7.159.225:16000/api/as/file/';
    GETUUID = '24acfc1215da435cbe76c69beb07f32b';
    GETREGIONID = '101221002';
    GETAPIROOT = 'http://36.7.159.225:16000/api/as';
}

var app = new Vue({ //vue对象
    el: '#root',
    data: {
        activeIDs: {
            id: 0
        },
        baseUrl: GETBASE,
        uuid: GETUUID,
        regionID: GETREGIONID,
        getApiRoot: GETAPIROOT,
        catLevel: 0, //分类级别 0,1,2,3
        catId: 0, //供应分类id
        SearchName: '供应',
        keyWords: '',
        menuActive: '0',
        isLogin: false,
        menuList: [],
        banner: [],
        qiu: [],
        gong: [
            //     {
            //     label: '江苏12公分15公分白玉兰树价',
            //     href: '#'
            // }
        ],
        weather: {
            // "nowTime": "01:25 实况",
            // "hum": "90%",
            // "tem": "14",
            // "winCn": "东北风",
            // "winLevel": "1级",
            // "temHeight": "height:51.2px",
            // "weatherDay": [
            //     {
            //         "day": "7日夜间",
            //         "wea": "晴",
            //         "tem": "11",
            //         "winEn": "N",
            //         "winCn": "北风",
            //         "winLevel": "<3级",
            //         "sunState": "sun sunDown",
            //         "sunTime": "日落 18:28"
            //     },
            //     {
            //         "day": "8日白天",
            //         "wea": "多云",
            //         "tem": "32",
            //         "winEn": "S",
            //         "winCn": "南风",
            //         "winLevel": "<3级",
            //         "sunState": "sun sunUp",
            //         "sunTime": "日出 05:51"
            //     }
            // ]
        },
        gqActive: "0",
        tjList: [{
            "id": 3,
            "userId": 1,
            "industryTypeId": 10,
            "uRegionId": "111111",
            "title": "title111",
            "brand": "brand222",
            "price": 11,
            "uUnitId": 1,
            "expirationDate": null,
            "hits": 0,
            "status": 1,
            "isRecommend": 0,
            "isStick": 0,
            "createTime": null,
            "introduce": "content123",
            "author": {
                "id": "1",
                "account": "test_user",
                "realName": "realName1"
            },
            "industrytype": {
                "id": 10,
                "name": "新鲜蔬菜",
                "pid": null
            },
            "region": {
                "id": "111111",
                "name": "太和县",
                "pid": null
            },
            "unit": {
                "id": 1,
                "name": "元"
            },
            "imageList": [{
                "id": 3,
                "asSupplyId": 3,
                "imageUrl": "3.jpg"
            }]
        }],

        tjTag: [{
            label: '生鲜水果',

            href: '#'
        }],
        chartActive: '0',
        chartOption: {
            tooltip: {
                trigger: 'axis'
            },
            color: [
                '#c23531', '#5098ca', '#29a02e', '#ff9978', '#e8b724', '#401984', '#8a8383', '#426373', '#cddc39', '#39dcbe'
            ],
            dataZoom: [{
                    type: 'slider',
                    start: 0,
                    end: 100,
                    fillerColor: 'rgba(167,183,204,0.2)'
                },
                {
                    type: 'inside',
                    start: 0,
                    end: 100
                }
            ],
            toolbox: {
                feature: {
                    saveAsImage: {
                        show: true
                    }
                }
            },
            legend: {
                data: [
                    '农产品200指数',
                    '粮油',
                    '菜篮子产品'

                ]
            },
            xAxis: [{
                type: 'category',
                data: ['1', '2', '3', '4', '5', '6', '7'] //'{request_x}'
            }],
            yAxis: [{
                min: 'dataMin',
                type: 'value',
                axisLabel: {
                    formatter: '{value} '
                }
            }],
            series: [{
                    name: '农产品200指数',
                    type: 'line',
                    data: [11, 11, 15, 13, 12, 13, 10],
                    markPoint: {
                        data: [
                            { type: 'max', name: '最大值' },
                            { type: 'min', name: '最小值' }
                        ]
                    }
                },
                {
                    name: '粮油',
                    type: 'line',
                    data: [1, 2, 2, 5, 3, 2, 0],
                    markPoint: {
                        data: [
                            { type: 'max', name: '最大值' },
                            { type: 'min', name: '最小值' }
                        ]
                    }
                },
                {
                    name: '菜篮子产品',
                    type: 'line',
                    data: [3, 4, 5, 7, 6, 4, 1],
                    markPoint: {
                        data: [
                            { type: 'max', name: '最大值' },
                            { type: 'min', name: '最小值' }
                        ]
                    }
                }
            ]

        },
        chartOption1: {
            tooltip: {
                trigger: 'axis'
            },
            color: [
                '#c23531', '#5098ca', '#29a02e', '#ff9978', '#e8b724', '#401984', '#8a8383', '#426373', '#cddc39', '#39dcbe'
            ],
            dataZoom: [{
                    type: 'slider',
                    start: 0,
                    end: 100,
                    fillerColor: 'rgba(167,183,204,0.2)'
                },
                {
                    type: 'inside',
                    start: 0,
                    end: 100
                }
            ],
            toolbox: {
                feature: {
                    saveAsImage: {
                        show: true
                    }
                }
            },
            legend: {
                data: [
                    '农产品200指数',
                    '粮油',
                    '菜篮子产品'

                ]
            },
            xAxis: [{
                type: 'category',
                data: ['1', '2', '3', '4', '5', '6', '7'] //'{request_x}'
            }],
            yAxis: [{
                min: 'dataMin',
                type: 'value',
                axisLabel: {
                    formatter: '{value} '
                }
            }],
            series: [{
                    name: '农产品200指数',
                    type: 'line',
                    data: [11, 11, 15, 13, 12, 13, 10],
                    markPoint: {
                        data: [
                            { type: 'max', name: '最大值' },
                            { type: 'min', name: '最小值' }
                        ]
                    }
                },
                {
                    name: '粮油',
                    type: 'line',
                    data: [1, 2, 2, 5, 3, 2, 0],
                    markPoint: {
                        data: [
                            { type: 'max', name: '最大值' },
                            { type: 'min', name: '最小值' }
                        ]
                    }
                },
                {
                    name: '菜篮子产品',
                    type: 'line',
                    data: [3, 4, 5, 7, 6, 4, 1],
                    markPoint: {
                        data: [
                            { type: 'max', name: '最大值' },
                            { type: 'min', name: '最小值' }
                        ]
                    }
                }
            ]

        },
        chartOption2: {
            tooltip: {
                trigger: 'axis'
            },
            color: [
                '#c23531', '#5098ca', '#29a02e', '#ff9978', '#e8b724', '#401984', '#8a8383', '#426373', '#cddc39', '#39dcbe'
            ],
            dataZoom: [{
                    type: 'slider',
                    start: 0,
                    end: 100,
                    fillerColor: 'rgba(167,183,204,0.2)'
                },
                {
                    type: 'inside',
                    start: 0,
                    end: 100
                }
            ],
            toolbox: {
                feature: {
                    saveAsImage: {
                        show: true
                    }
                }
            },
            legend: {
                data: [
                    '农产品200指数',
                    '粮油',
                    '菜篮子产品'

                ]
            },
            xAxis: [{
                type: 'category',
                data: ['1', '2', '3', '4', '5', '6', '7'] //'{request_x}'
            }],
            yAxis: [{
                min: 'dataMin',
                type: 'value',
                axisLabel: {
                    formatter: '{value} '
                }
            }],
            series: [{
                    name: '农产品200指数',
                    type: 'line',
                    data: [11, 11, 15, 13, 12, 13, 10],
                    markPoint: {
                        data: [
                            { type: 'max', name: '最大值' },
                            { type: 'min', name: '最小值' }
                        ]
                    }
                },
                {
                    name: '粮油',
                    type: 'line',
                    data: [1, 2, 2, 5, 3, 2, 0],
                    markPoint: {
                        data: [
                            { type: 'max', name: '最大值' },
                            { type: 'min', name: '最小值' }
                        ]
                    }
                },
                {
                    name: '菜篮子产品',
                    type: 'line',
                    data: [3, 4, 5, 7, 6, 4, 1],
                    markPoint: {
                        data: [
                            { type: 'max', name: '最大值' },
                            { type: 'min', name: '最小值' }
                        ]
                    }
                }
            ]

        },
        chart0: null,
        chart1: null,
        chart2: null,
        jsge: [{
            "id": 3,
            "name": "name111",
            "agorae": "agorae1",
            "updateTime": 1537977600000,
            "wholesalePrice": "11.12"
        }],
        price200List: {
            "priceDate": "2019年4月5日",
            "currentPrice200IndexValue": "12",
            "currentPrice200IndexValue": "+1",

            "currentPriceCLZIndexValue": "11",
            "priceCLZIndexChangeValue": "-2",

            "currentPriceXCPIndexValue": "12",
            "priceXCPIndexChangeValue": "+2",

            "currentPriceSCPIndexValue": "21",
            "priceSCPIndexChangeValue": "+1",

            "currentPriceSCIndexValue": "45",
            "priceSCIndexChangeValue": "+1",

            "currentPriceSGIndexValue": "24",
            "priceSGIndexChangeValue": "-3",

            "currentPriceLYCPIndexValue": "45",
            "priceLYCPIndexChangeValue": "+4",

            "currentPriceLSIndexValue": "56",
            "priceLSIndexChangeValue": "+1",

            "currentPriceSYYIndexValue": "66",
            "priceSYYIndexChangeValue": "-2",
        },
        njUl: [
            //     {
            //     href: '#',
            //     label: '汉江养殖场大量收购玉米碎米油糠麸皮',
            //     time: '2019-02-08'
            // }
        ],
        tfUl: [
            //     {
            //     href: '#',
            //     label: '汉江养殖场大量收购玉米碎米油糠麸皮',
            //     time: '2019-02-08'
            // }
        ],
        warnList: []
    },
    methods: {
        //搜索类型
        searchClick: function() {

        },

        //点击二级分类 add by liulei
        tagClick: function(catId) {
            var self = this;

            // debugger
            this.$nextTick(function() {
                self.activeIDs.id = catId;
            })
            this.catLevel = 0;
            if (catId > 0)
                this.catLevel = 2;

            this.catId = catId;
            // alert(catId);
            this.loadSupplyByCatId();
        },
        //立即搜索
        onSearch: function() {

            if (this.SearchName == '供应') {
                location.href = './search_list.html?type=1&keyword=' + this.keyWords;
            } else if (this.SearchName == '求购') {
                location.href = './search_list.html?type=2&keyword=' + this.keyWords;
            } else if (this.SearchName == '农机服务') {
                location.href = './search_list.html?type=3&keyword=' + this.keyWords;
            }

        },
        handleOver: function(index) {
            this.menuActive = index;
        },
        handleClick: function(index) {
            var self = this;
            // alert(index.name);
            if (index.name == 0) {
                // alert('1');
                this.loadPrice200Day();

                // self.chart0.setOption(self.chartOption);
                // self.chart0.resize();
            } else if (index.name == 1) {

                // alert('2');
                this.loadPrice200Month();

                // self.chart1.setOption(self.chartOption1);
                // self.chart1.resize();
            } else if (index.name == 2) {
                // alert('3');
                this.loadPrice200Year();

                // self.chart2.setOption(self.chartOption2);
                // self.chart2.resize();
            }
            // self.init();
        },

        //加载天气
        loadWeather: function() {
            var self = this;
            var param = '{}';
            var url = this.getApiRoot + '/weather/get/' + self.uuid;
            $.ajax({
                method: 'GET',
                url: url,
                dataType: 'JSON',
                contentType: 'application/json',
                success: function(res) {
                    console.log('返回结果-天气:' + JSON.stringify(res));
                    self.weather = res.data;
                },
                error: function() {

                }
            })
        },
        // 加载分类列表 add by liulei
        loadIndustrytype: function() {
            var self = this;
            var param = '{}';

            var url = this.getApiRoot + '/industrytype/gettree/' + self.uuid;

            $.ajax({
                method: 'GET',
                url: url,
                dataType: 'JSON',
                contentType: 'application/json',
                success: function(res) {
                    console.log('返回结果-分类tree:' + JSON.stringify(res));
                    self.menuList = res.data.list;
                },
                error: function() {

                }
            })
        },

        // 加载banner add by liulei
        loadBanner: function() {
            var self = this;
            var param = '{}';
            var url = this.getApiRoot + '/banner/getall/' + self.uuid;
            $.ajax({
                method: 'GET',
                url: url,
                dataType: 'JSON',
                contentType: 'application/json',
                success: function(res) {
                    console.log('返回结果-banner:' + JSON.stringify(res));
                    self.banner = res.data;
                },
                error: function() {

                }
            })
        },

        // 加载灾害预警 add by liulei
        loadWarning: function() {
            var self = this;
            var param = '{}';
            var url = this.getApiRoot + '/alarm/get_alarm/' + self.uuid;

            $.ajax({
                method: 'GET',
                url: url,
                dataType: 'JSON',
                contentType: 'application/json',
                success: function(res) {
                    console.log('返回结果 灾害预警:' + JSON.stringify(res));

                    self.warnList = res.data;

                },
                error: function() {

                }
            })
        },

        // 加载求购速递 add by liulei
        loadSeek: function() {
            var self = this;
            var param = '{}';

            var url = this.getApiRoot + '/seekpurchase/getpage/' + self.uuid + '/1/18';

            $.ajax({
                method: 'GET',
                url: url,
                dataType: 'JSON',
                contentType: 'application/json',
                success: function(res) {
                    console.log('返回结果-求购速递:' + JSON.stringify(res));
                    self.qiu = res.data.list;
                },
                error: function() {

                }
            })
        },

        // 加载供应速递 add by liulei
        loadSupply: function() {
            var self = this;
            var param = '{}';

            var url = this.getApiRoot + '/supply/getpage/' + self.uuid + '/0/0/0/1/18';

            $.ajax({
                method: 'GET',
                url: url,
                dataType: 'JSON',
                contentType: 'application/json',
                success: function(res) {
                    console.log('返回结果-供应速递:' + JSON.stringify(res));
                    self.gong = res.data.list;
                },
                error: function() {

                }
            })
        },

        // 加载农产品价格 add by liulei
        loadProPrice: function() {
            var self = this;
            var param = '{}';

            var url = this.getApiRoot + '/productionprice/getpage/' + self.uuid + '/1/10';

            $.ajax({
                method: 'GET',
                url: url,
                dataType: 'JSON',
                contentType: 'application/json',
                success: function(res) {
                    console.log('返回结果-农产品价格:' + JSON.stringify(res));
                    self.jsge = res.data.list;
                },
                error: function() {

                }
            })
        },

        // 加载农机服务 add by liulei
        loadSever: function() {
            var self = this;
            var param = '{}';

            var url = this.getApiRoot + '/agriculturalms/getpage/' + self.uuid + '/1/10';

            $.ajax({
                method: 'GET',
                url: url,
                dataType: 'JSON',
                contentType: 'application/json',
                success: function(res) {
                    console.log('返回结果-农机服务:' + JSON.stringify(res));
                    self.njUl = res.data.list;
                },
                error: function() {

                }
            })
        },

        // 加载统防统治 add by liulei
        loadControl: function() {
            var self = this;
            var param = '{}';

            var url = this.getApiRoot + '/unifyingcontrol/getpage/' + self.uuid + '/1/10';

            $.ajax({
                method: 'GET',
                url: url,
                dataType: 'JSON',
                contentType: 'application/json',
                success: function(res) {
                    console.log('返回结果-统防统治:' + JSON.stringify(res));
                    self.tfUl = res.data.list;
                },
                error: function() {

                }
            })
        },

        // 价格指数
        // 价格趋势
        // 农产品供应中心
        //加载所有二级分类
        loadAllSecond: function() {
            var self = this;
            var param = '{}';

            var url = this.getApiRoot + '/industrytype/getsecond/' + self.uuid;

            $.ajax({
                method: 'GET',
                url: url,
                dataType: 'JSON',
                contentType: 'application/json',
                success: function(res) {
                    console.log('返回结果-二级分类:' + JSON.stringify(res));
                    self.tjTag = res.data;
                },
                error: function() {

                }
            })

        },

        //根据分类加载供应产品
        loadSupplyByCatId: function() {
            var self = this;
            var param = '{}';
            // debugger
            var url = this.getApiRoot + '/supply/getpage/' + self.uuid + '/' + self.catLevel + '/' + self.catId + '/0/1/21';

            $.ajax({
                method: 'GET',
                url: url,
                dataType: 'JSON',
                contentType: 'application/json',
                success: function(res) {
                    console.log('返回结果-二级分类产品:' + JSON.stringify(res));
                    self.tjList = res.data.list;
                },
                error: function() {

                }
            })
        },




        // 加载农产品批发价格new add by liulei get_wholesale_price
        loadProPriceNew: function() {
            var self = this;
            var param = '{}';

            var url = this.getApiRoot + '/price/get_wholesale_price'; ///getpage/1/10';

            $.ajax({
                method: 'GET',
                url: url,
                dataType: 'JSON',
                contentType: 'application/json',
                success: function(res) {
                    console.log('返回结果-批发价格:' + JSON.stringify(res));
                    var jsonObj = JSON.parse(res.data); //转换为json对象
                    self.jsge = jsonObj;
                },
                error: function() {

                }
            })
        },

        // 加载价格200 add by liulei 
        loadPrice200: function() {
            var self = this;
            var param = '{}';

            var url = this.getApiRoot + '/price/get_price200_index'; ///getpage/1/10';

            $.ajax({
                method: 'GET',
                url: url,
                dataType: 'JSON',
                contentType: 'application/json',
                success: function(res) {
                    console.log('返回结果-价格200指数:' + JSON.stringify(res));


                    self.price200List = res.data;
                },
                error: function() {

                }
            })
        },

        // 加载农产品批发价格new add by liulei 
        loadPrice200Day: function() {
            var self = this;
            var param = '{}';

            var url = this.getApiRoot + '/price/get_chart200_day'; ///getpage/1/10';

            $.ajax({
                method: 'GET',
                url: url,
                dataType: 'JSON',
                contentType: 'application/json',
                success: function(res) {
                    console.log('返回结果-200趋势day:' + JSON.stringify(res));
                    var jsonObj = JSON.parse(res.data); //转换为json对象
                    var times = jsonObj[0];
                    var names = jsonObj[1];
                    var values = jsonObj[2];

                    var timesList1 = [];
                    var timesList2 = [];
                    var timesList3 = [];
                    for (var i = 0; i < times.length / 3; i++) {
                        var x = times[i * 3];
                        var y = times[i * 3 + 1];
                        var z = times[i * 3 + 2];
                        timesList1.push(x);
                        timesList2.push(y);
                        timesList3.push(z);
                    }

                    self.chartOption.xAxis[0].data = timesList1;


                    var valueList1 = [];
                    var valueList2 = [];
                    var valueList3 = [];
                    for (var i = 0; i < times.length / 3; i++) {
                        var x = values[i * 3];
                        var y = values[i * 3 + 1];
                        var z = values[i * 3 + 2];
                        valueList1.push(x);
                        valueList2.push(y);
                        valueList3.push(z);
                    }
                    // console.log('timesList1:' + timesList1);

                    self.chartOption.series[0].data = valueList1;
                    self.chartOption.series[1].data = valueList2;
                    self.chartOption.series[2].data = valueList3;
                    self.chart0.setOption(self.chartOption);
                    self.chart0.resize();
                    // console.log('time:' + JSON.stringify(times) + 'name:'+JSON.stringify(names)+ 'value:'+JSON.stringify(values));

                },
                error: function() {

                }
            })
        },

        // 加载价格200month add by liulei
        loadPrice200Month: function() {
            var self = this;
            var param = '{}';

            var url = this.getApiRoot + '/price/get_chart200_month'; ///getpage/1/10';

            $.ajax({
                method: 'GET',
                url: url,
                dataType: 'JSON',
                contentType: 'application/json',
                success: function(res) {
                    console.log('返回结果-200趋势month:' + JSON.stringify(res));
                    // self.chart1 = res.data;

                    var jsonObj = JSON.parse(res.data); //转换为json对象
                    var times = jsonObj[0];
                    var names = jsonObj[1];
                    var values = jsonObj[2];

                    var timesList1 = [];
                    var timesList2 = [];
                    var timesList3 = [];
                    for (var i = 0; i < times.length / 3; i++) {
                        var x = times[i * 3];
                        var y = times[i * 3 + 1];
                        var z = times[i * 3 + 2];
                        timesList1.push(x);
                        timesList2.push(y);
                        timesList3.push(z);
                    }

                    self.chartOption1.xAxis[0].data = timesList1;


                    var valueList1 = [];
                    var valueList2 = [];
                    var valueList3 = [];
                    for (var i = 0; i < times.length / 3; i++) {
                        var x = values[i * 3];
                        var y = values[i * 3 + 1];
                        var z = values[i * 3 + 2];
                        valueList1.push(x);
                        valueList2.push(y);
                        valueList3.push(z);
                    }
                    // console.log('timesList1:' + timesList1);

                    self.chartOption1.series[0].data = valueList1;
                    self.chartOption1.series[1].data = valueList2;
                    self.chartOption1.series[2].data = valueList3;
                    self.chart1.setOption(self.chartOption1);
                    self.chart1.resize();
                    // console.log('time:' + JSON.stringify(times) + 'name:'+JSON.stringify(names)+ 'value:'+JSON.stringify(values));

                },
                error: function() {

                }
            })
        },

        // 加载价格new add by liulei
        loadPrice200Year: function() {
            var self = this;
            var param = '{}';

            var url = this.getApiRoot + '/price/get_chart200_year'; ///getpage/1/10';

            $.ajax({
                method: 'GET',
                url: url,
                dataType: 'JSON',
                contentType: 'application/json',
                success: function(res) {
                    console.log('返回结果-200趋势year:' + JSON.stringify(res));
                    // self.chart2 = res.data;

                    var jsonObj = JSON.parse(res.data); //转换为json对象
                    var times = jsonObj[0];
                    var names = jsonObj[1];
                    var values = jsonObj[2];

                    var timesList1 = [];
                    var timesList2 = [];
                    var timesList3 = [];
                    for (var i = 0; i < times.length / 3; i++) {
                        var x = times[i * 3];
                        var y = times[i * 3 + 1];
                        var z = times[i * 3 + 2];
                        timesList1.push(x);
                        timesList2.push(y);
                        timesList3.push(z);
                    }

                    self.chartOption2.xAxis[0].data = timesList1;


                    var valueList1 = [];
                    var valueList2 = [];
                    var valueList3 = [];
                    for (var i = 0; i < times.length / 3; i++) {
                        var x = values[i * 3];
                        var y = values[i * 3 + 1];
                        var z = values[i * 3 + 2];
                        valueList1.push(x);
                        valueList2.push(y);
                        valueList3.push(z);
                    }
                    // console.log('timesList1:' + timesList1);

                    self.chartOption2.series[0].data = valueList1;
                    self.chartOption2.series[1].data = valueList2;
                    self.chartOption2.series[2].data = valueList3;
                    self.chart2.setOption(self.chartOption2);
                    self.chart2.resize();
                    // console.log('time:' + JSON.stringify(times) + 'name:'+JSON.stringify(names)+ 'value:'+JSON.stringify(values));

                },
                error: function() {

                }
            })
        },

    },

    filters: {
        //add by liulei
        formatDate: function(time) {
            var date = new Date(time);
            return formatDate(date, 'yyyy-MM-dd hh:mm');
        },

        warn: function(val) {
            switch (val) {
                case 0:
                    return '红色预警';
                    break;
                case 1:
                    return '橙色预警';
                    break;
                case 2:
                    return '黄色预警';
                    break;
                case 3:
                    return '蓝色预警';
                    break;
                default:
                    return '未知预警';
                    break;
            }
        },
        warnTag: function(val) {
            switch (val) {
                case 0:
                    return 'danger';
                    break;
                case 1:
                    return 'cheng';
                    break;
                case 2:
                    return 'huang';
                    break;
                case 3:
                    return 'primary';
                    break;
                default:
                    return 'info';
                    break;
            }
        },
        //提示框
        showAlert: function(title, msg, btnTitle) {
            this.$alert(msg, title, {
                confirmButtonText: btnTitle
                    // callback: action => {
                    //     // this.$message({
                    //     //     type: 'info',
                    //     //     message: `action: ${ action }`
                    //     // });
                    // }
            });
        },

        showMsg: function(msg) {
            this.$message({
                type: 'info',
                message: msg
            });
        }

    },
    created: function() {

    },
    mounted: function() {
        var self = this;


        var token = sessionStorage.getItem("token");
        if (token == undefined || token == '') {

        } else {
            this.isLogin = true;
        }
        var _myChart0 = echarts.init(document.getElementById('chart0'));
        self.chart0 = _myChart0;
        self.chart0.setOption(self.chartOption);

        var _myChart1 = echarts.init(document.getElementById('chart1'));
        self.chart1 = _myChart1;
        // self.chart1.setOption(self.chartOption1);


        var _myChart2 = echarts.init(document.getElementById('chart2'));
        self.chart2 = _myChart2;
        // self.chart2.setOption(self.chartOption2);

        setTimeout(function() {
            // self.init();
            // 调用网络请求方法

            self.loadWeather();
            self.loadBanner();
            self.loadIndustrytype();
            self.loadWarning();
            self.loadSeek();
            self.loadSupply();
            self.loadSever();
            self.loadControl();
            self.loadAllSecond();
            self.loadSupplyByCatId(); //根据二级分类加载产品


            self.loadProPrice();
            // self.loadProPriceNew();
            self.loadPrice200();
            self.loadPrice200Day();



        }, 1000)

    }
})