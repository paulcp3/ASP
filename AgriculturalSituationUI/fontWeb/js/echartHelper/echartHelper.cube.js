jQuery(function($){
	window.EChartHelper = function(contextPath){
		var contextPath = contextPath ? contextPath : '';
		
		var helperObj = this;
		
		var defaultChartObject = {
			define: null,
			option: null,
			optionWithData: null,
			echart: null,
			type: 'chart',
			parameters: {},	// object
			data: null,
			filters: {},	// object
			period: null,
			htmlId: null
		}
		
		var defaultFilterValueDefineObject = {
			parameter: null,
			filterValueObj: null,
			FOID: null
		}
		
		var defaultFilterValueObject = {
			index: -1,
			type: 'string',
			filterValues: []
		}
		
		var echartList = {};
		helperObj.echartList = echartList;
		
		helperObj.createChart = function(url, id, filterValueDefineObjs, userOption){
			var deferred = $.Deferred(), chartObj = $.type(echartList[id]) == 'object' ? echartList[id] : etool.clone(defaultChartObject);
			chartObj.htmlId = id;
			chartObj.parameters = {};
			chartObj.filters = {};
			
			if($.type(chartObj.htmlId) == 'string' || $.type(chartObj.htmlId) == 'number'){
				var $area = $('#' + chartObj.htmlId);
				
				if($area.length > 0){
					$.ajax({
						url: url,
						isLocal: true,
						type: 'get',
						dataType: 'json'
					}).done(function(data){
						chartObj.define = data;
						chartObj.option = userOption == null ? data.option : userOption;
						chartObj.echart = echarts.init($area.get(0));
						if($.type(filterValueDefineObjs) == 'array'){
							$.each(filterValueDefineObjs || [], function(i, filterValueDefineObj){
								helperObj.setFilter(chartObj, filterValueDefineObj);
							});
						}
						echartList[chartObj.htmlId] = chartObj;
						// helperObj.requsetData(chartObj, true).done(function(chartObj){
						// 	deferred.resolve(chartObj);
						// });
						deferred.resolve(chartObj);
					}).fail(function(xhr, states, err){
						console.log('获取配置' + '失败:' + err);
						deferred.resolve(chartObj);
					});
				}else{
					console.log('HTML ID无效，图标初始化失败。');
					deferred.resolve(chartObj);
				}
			}else{
				console.log('HTML ID无效，图标初始化失败。');
				deferred.resolve(chartObj);
			}
			
			return deferred.promise();
		};
		
		helperObj.setOption = function(chartObj, option){
			if($.type(option) == 'object'){
				chartObj.define.option = option;
				chartObj.option = option;
			}else{
				console.error('setOption', 'not object.');
			}
		}
		
		helperObj.setRequestParameter = function(chartObj, parameter){
			if($.type(parameter) == 'array'){
				chartObj.define.parameter = parameter;
			}else{
				console.error('setRequestParameter', 'not array.');
			}
		}
		
		helperObj.setRequestPeriod = function(chartObj, period){
			if($.type(period) == 'string'){
				chartObj.period = period;
			}else{
				console.error('setRequestPeriod', 'not string.');
			}
		}
		
		helperObj.requsetData = function(chartObj, autoResetOption){
			var deferred = $.Deferred(), dataSrc = chartObj.define.dataSrc + '.data';
			// default reset option
			autoResetOption = autoResetOption == true ? true : false;
			chartObj.data = null;
	
			$.ajax({
				url: dataSrc,
				cache: false,
				type: 'get',
				dataType: 'json'
			}).done(function(data){
				chartObj.data = data;
			}).fail(function(xhr, states, err){
				console.log('获取数据文件' + '失败:' + err);
			}).always(function(data){
				if($.type(chartObj.data) != 'array'){
					// stitch parameterJson
					var parameterJson = '';
					if($.type(chartObj.parameters) == 'object'){
						var parameterList = [];
						$.each(chartObj.parameters || [], function(key, parameter){
							parameterList.push(parameter);
						});
						parameterJson = JSON.stringify(parameterList);
					}
			
					$.ajax({
						url: contextPath + 'public/echarts/getCubeData',
						data: {columnJson: JSON.stringify(chartObj.define.parameter), parameterJson: parameterJson, period: chartObj.period, sortJson: JSON.stringify(chartObj.define.parameterSort || [])},
						type: 'post',
						dataType: 'json'
					}).done(function(data){
						if(data && data.result == '成功' && data.content){
							chartObj.data = data.content;
						}else{
							var message = (data && data.message) ? data.message : 'unknow error.';
							console.log('获取数据' + '失败:' + message);
						}
					}).fail(function(xhr, states, err){
						console.log('获取数据' + '失败:' + err);
					}).always(function(data){
						console.log(
							'columnJson:' + JSON.stringify(chartObj.define.parameter) + 
							'\nparameterJson:' +  parameterJson + 
							'\nperiod:' +  chartObj.period + 
							'\nsortJson:' + (JSON.stringify(chartObj.define.parameterSort || []))
						);
						chartObj.data = $.type(chartObj.data) == 'array' ? chartObj.data : [];
						console.log('chartObj.data:' + JSON.stringify(chartObj.data));
						deferred.resolve(dealData(chartObj, autoResetOption));
					});			
				}else{
					deferred.resolve(dealData(chartObj, autoResetOption));
				}
			});
	
			return deferred.promise();
		}
		
		helperObj.setFilter = function(chartObj, filterValueDefineObj, needRequest, autoResetOption){
			if($.type(filterValueDefineObj) == 'object'
				&& $.type(filterValueDefineObj.parameter) == 'object'
				&& $.type(filterValueDefineObj.filterValueObj) == 'object'
				&& filterValueDefineObj.FOID != null){
				
				if($.type(chartObj.parameters) != 'object'){
					chartObj.parameters = {}
				}
				if($.type(chartObj.filters) != 'object'){
					chartObj.filters = {}
				}
				chartObj.parameters[filterValueDefineObj.FOID] = filterValueDefineObj.parameter;
				chartObj.filters[filterValueDefineObj.FOID] = filterValueDefineObj.filterValueObj;
				if(needRequest == true){
					helperObj.requsetData(chartObj, autoResetOption);
				}
			}
		}
		
		function filterValue(filterValueObj, data){
			var targetList = [];
			if($.type(data) == 'array'){
				for(var i = 0; i < data.length; i++){
					targetList.push([]);
				}
				if($.type(filterValueObj) == 'object'
					&& $.type(filterValueObj.index) == 'number' 
					&& $.type(data[filterValueObj.index]) == 'array'
					&& $.type(filterValueObj.filterValues) == 'array'
					&& filterValueObj.filterValues.length > 0){
						
					var source = data[filterValueObj.index];						
					$.each(source || [], function(i, value){
						$.each(filterValueObj.filterValues || [], function(j, keyword){
							if(keyword == value){
								$.each(data || [], function(k, subList){
									var subTarget = targetList[k];
									subTarget.push(subList[i]);
								});
								return false;
							}
						});
					});
				}else{
					targetList = data;
				}
			}
			return targetList;
		}
		
		function dealData(chartObj, autoResetOption){
			var option = etool.clone(chartObj.option);
			
			// filter data
			if($.type(chartObj.filters) == 'object'){
				$.each(chartObj.filters || [], function(key, filterValueObj){
					chartObj.data = filterValue(filterValueObj, chartObj.data);
				});
			}
			
			if($.type(chartObj.define.params) == 'object'){
				$.each(chartObj.define.params || [], function(key, param){
					var data4replace = [];
					$.each(param.parameter || [], function(i, value){
						if($.type(value) == 'number' && $.type(chartObj.data[value]) == 'array'){
							data4replace.push(chartObj.data[value]);
						}else{
							data4replace.push([]);
						}
					});
					if(param.type == 'custom' && $.type(param.callback) == 'string'){
						if($.type(_chartCallbackCustom[param.callback]) == 'function'){
							data4replace = _chartCallbackCustom[param.callback](data4replace);
						}else{
							data4replace = [];
						}
					}else{
						data4replace = _chartCallbackDefault.normal(data4replace);
					}

					replaceLabel(option, key, data4replace);
				});
			}
			
			/*
				处理未替换{request_?}
			*/
			replaceAllLabel(option);
			chartObj.optionWithData = option;

			// console.log(JSON.stringify(option));
			
			if(autoResetOption){
				chartObj.echart.setOption(chartObj.optionWithData, true);
			}
			
			return chartObj;
		}
		
		function replaceLabel(node, label, data){
			var test = new RegExp('^\\{request_' + label + '\\}$');
			var isDone = false;
				
			if($.type(node) == 'array' || $.type(node) == 'object'){
				$.each(node || [], function(key, obj){
					if($.type(obj) == 'string' && test.test(obj)){
						node[key] = data;
						isDone = true;
						return false;
					}else if($.type(obj) == 'array' || $.type(obj) == 'object'){
						isDone = replaceLabel(obj, label, data);
						if(isDone){
							return false;
						}
					}
				});
			}
			
			return isDone;
		}
		
		function replaceAllLabel(node){
			var test = new RegExp('^\\{request_');
			
			if($.type(node) == 'array' || $.type(node) == 'object'){
				$.each(node || [], function(key, obj){
					if($.type(obj) == 'string' && test.test(obj)){
						node[key] = [];
					}else if($.type(obj) == 'array' || $.type(obj) == 'object'){
						replaceAllLabel(obj);
					}
				})	
			}	
		}
		
		$(window).resize(function(){
			$.each(echartList || [], function(i, chartObj){
				chartObj.echart.resize();
			});
		});
	}
	
	window.chartHelper = new EChartHelper();
});