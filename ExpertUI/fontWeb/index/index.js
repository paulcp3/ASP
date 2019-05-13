

// window.filterHelper = new FilterValueHelper();
var GETBASE,GETUUID,GETREGIONID,GETAPIROOT;
if(typeof(window.getBaseUrl) !='undefined'){
    GETBASE= window.getBaseUrl();
    GETUUID= window.getUuid();
    GETREGIONID= window.getRegionId();
    GETAPIROOT = window.getApiRoot();
}else{
    // GETBASE= 'http://localhost:16000/api/expert/file/';
        // GETUUID= '24acfc1215da435cbe76c69beb07f32b';
        // GETREGIONID= '101221002';
        // GETAPIROOT = 'http://localhost:16000/api/expert';

        GETBASE= 'http://36.7.159.225:16000/api/expert/file/';
        GETUUID= '24acfc1215da435cbe76c69beb07f32b';
        GETREGIONID= '101221002';
        GETAPIROOT = 'http://36.7.159.225:16000/api/expert';
}

var index = new Vue({
    el: "#root",
    data:{
        baseUrl:GETBASE,
        uuid:GETUUID,
        regionID:GETREGIONID,
        getApiRoot:GETAPIROOT,

        isLogin:false,
        userType:4,
        SearchName: '预警',
        keyWords:'',
        form: {
            name: '',
            date1: '',
            date2: '',
            delivery: false,
            resource: '',
            vegetation: 0,
            body: 0,
            symptom: 0
        },
        alarmList:[
           
        ],
        cureList:[
            
        ],

        questionList:[
           
        ],

        kgList:[
           
        ],

        expertList:[
            
        ],

        vegetations:[//植被类型
        ],
        bodys:[//植被部位
        ],
        symptoms:[//症状类型
        ],
        
        diseasesList:[
            // {
            //     "id":1,
            //     "name":"海芋花叶病",
            //     "imageUrl":"public/image/content.jpg",
            // }
        ],

    },

    methods:{

        changeVegetation:function(value){
            // alert(value);
            this.form.vegetation = value;
        },
        changeBody:function(value){
            this.form.body = value;
        },
        changeSymptom:function(value){
            this.form.symptom = value;
        },

        onSearchDislib:function(){
            // alert('111');
            this.loadDiseaseslib();
        },
        onClearDislib:function(){
            // alert('2222');
            this.form.vegetation = 0;
            this.form.body = 0;
            this.form.symptom = 0;

            this.loadDiseaseslib();
        },

        searchClick: function() {

        },
        onSearch:function(){

            if (this.SearchName == '预警') {
                location.href = './searchList.html?type=1&keyword=' + this.keyWords;
            } else if (this.SearchName == '防治') {
                location.href = './searchList.html?type=2&keyword=' + this.keyWords;
            } else if (this.SearchName == '病虫害') {
                location.href = './searchList.html?type=3&keyword=' + this.keyWords;
            }else if (this.SearchName == '知识库') {
                location.href = './searchList.html?type=4&keyword=' + this.keyWords;
            }else if (this.SearchName == '专家') {
                location.href = './searchList.html?type=5&keyword=' + this.keyWords;
            }

            
        },

        //提问
        onAsk:function(epId, epName){

            // alert(epId);
            // return;
            if(!this.isLogin)
                location.href = './login.html?returnUrl=./personal.html';
            else
                location.href = './personal.html?epId=' + epId + '&epName='+epName;
        },

        //植被类型
        loadVegetation:function(){
            var self = this;
            var param = '{}';

            var url = this.getApiRoot + '/vegetation/getall/'+self.uuid;
        
            $.ajax({
                method:'GET',
                url:url,
                dataType:'JSON',
                contentType:'application/json',
                success:function(res){
                
                //    debugger
                    self.vegetations = res.data;
                },
                error:function(){
    
                }
            })
        },

        //部位
        loadBody:function(){
            var self = this; 
            var param = '{}';  

            var url = this.getApiRoot + '/diseasesbody/getall/'+self.uuid;
        
            $.ajax({
                method:'GET',
                url:url,
                dataType:'JSON',
                contentType:'application/json',
                success:function(res){
                    console.log('返回结果-部位:' + JSON.stringify(res));
                    self.bodys = res.data;
                },
                error:function(){
    
                }
            })
        },

        //症状类型
        loadSymptom:function(){
            var self = this; 
            var param = '{}';

            var url = this.getApiRoot + '/symptomtype/getall/'+self.uuid;
        
            $.ajax({
                method:'GET',
                url:url,
                dataType:'JSON',
                contentType:'application/json',
                success:function(res){
                    console.log('返回结果-症状类型:' + JSON.stringify(res));
                    self.symptoms = res.data;
                },
                error:function(){
    
                }
            })
        },


        // 病虫害预警 add by liulei
        loadAlarm:function(){
            var self = this;
            var param = '{}';

            var url = this.getApiRoot + '/alarm/getpage/'+self.uuid+'/1/7';
        
            $.ajax({
                method:'GET',
                url:url,
                dataType:'JSON',
                contentType:'application/json',
                success:function(res){
                    console.log('返回结果-病虫害预警:' + JSON.stringify(res));
                    self.alarmList = res.data.list;
                },
                error:function(){
    
                }
            })
        },


        // 病虫害防治 add by liulei
        loadCure:function(){
            var self = this;
            var param = '{}';

            var url = this.getApiRoot + '/cure/getpage/'+self.uuid+'/1/7';
        
            $.ajax({
                method:'GET',
                url:url,
                dataType:'JSON',
                contentType:'application/json',
                success:function(res){
                    console.log('返回结果-病虫害防治:' + JSON.stringify(res));
                    self.cureList = res.data.list;
                },
                error:function(){
    
                }
            })
        },

        // 最新问答 add by liulei
        loadQuestion:function(){
            var self = this;
            var param = '{}';

            var url = this.getApiRoot + '/question/getlatest/1/7';
        
            $.ajax({
                method:'GET',
                url:url,
                dataType:'JSON',
                contentType:'application/json',
                success:function(res){
                    console.log('返回结果-最新问答:' + JSON.stringify(res));
                    self.questionList = res.data.list;
                },
                error:function(){
    
                }
            })
        },

        // 最新知识库 add by liulei
        loadKg:function(){
            var self = this;
            var param = '{}';

            var url = this.getApiRoot + '/knowledge/getlatest/1/7';
        
            $.ajax({
                method:'GET',
                url:url,
                dataType:'JSON',
                contentType:'application/json',
                success:function(res){
                    console.log('返回结果-最新知识库:' + JSON.stringify(res));
                    self.kgList = res.data.list;
                },
                error:function(){
    
                }
            })
        },

        //加载推荐专家
        loadExpert:function(){
            var self = this;
            var param = '{}';

            var url = this.getApiRoot + '/expertlibrary/getrecom/1/10';
        
            $.ajax({
                method:'GET',
                url:url,
                dataType:'JSON',
                contentType:'application/json',
                success:function(res){
                    console.log('返回结果-推荐专家:' + JSON.stringify(res));
                    self.expertList = res.data.list;
                    self.$nextTick(function(){
                        mySwiper.updateSlides()
                    })
                },
                error:function(){
    
                }
            })
        },

        //加载病虫害大全
        loadDiseaseslib:function(){
            var self = this;
            var param = '{}';

            var url = this.getApiRoot + '/diseaseslib/getsearch/'+self.uuid+'/0/'+this.form.vegetation+'/'+this.form.body+'/'+this.form.symptom+'/1/16';
        
            $.ajax({
                method:'GET',
                url:url,
                dataType:'JSON',
                contentType:'application/json',
                success:function(res){
                    console.log('返回结果-病虫害大全:' + JSON.stringify(res));
                    self.diseasesList = res.data.list;
                },
                error:function(){
    
                }
            })
        },

        onSubmit:function() {
         
        }
        
    },

    filters:{
        //add by liulei
        formatDate:function(time) {
            var date = new Date(time);
            return formatDate(date, 'yyyy-MM-dd');
        }
    },

    created:function(){

    },

    mounted: function () {
        var self = this;

        var token = sessionStorage.getItem("token"); 
        var userType = sessionStorage.getItem("userType"); 
        if(token == undefined || token == ''){
        }else{
            this.isLogin = true;
            this.userType = userType;
        }

        //植被类型
        self.loadVegetation();
        //部位
        self.loadBody();
        //症状类型
        self.loadSymptom();
        //加载病虫害预警
        self.loadAlarm();
        //病虫害防治
        self.loadCure();
        //推荐专家
        self.loadExpert();
        //加载病虫害大全
        self.loadDiseaseslib();

        self.loadQuestion();
        self.loadKg();
    }


})
