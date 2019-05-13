jQuery(function($){
	window.DataHelper = function(contextPath){
		contextPath = contextPath ? contextPath : '';
		
		var helperObj = this;
		
		var defaultDataObject = {
			define: null,
			type: 'data',
			parameters: {},	// object
			data: null,
			filters: {},	// object
			period: null,
			callbacks: {}
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
		
		helperObj.createData = function(url, filterValueDefineObjs){
			var deferred = $.Deferred(), dataObj = etool.clone(defaultDataObject);
			
			$.ajax({
				url: url,
				isLocal: true,
				type: 'get',
				dataType: 'json'
			}).done(function(data){
				dataObj.define = data;
				if($.type(filterValueDefineObjs) == 'array'){
					$.each(filterValueDefineObjs || [], function(i, filterValueDefineObj){
						helperObj.setFilter(dataObj, filterValueDefineObj);
					});
				}
				// helperObj.requsetData(dataObj, true).done(function(dataObj){
				// 	deferred.resolve(dataObj);
				// });
				deferred.resolve(dataObj);
			}).fail(function(xhr, states, err){
				console.log('获取配置' + '失败:' + err);
				deferred.resolve(dataObj);
			});

			return deferred.promise();
		};
		
		helperObj.setRequestParameter = function(dataObj, parameter){
			if($.type(parameter) == 'array'){
				dataObj.define.parameter = parameter;
			}else{
				console.error('setRequestParameter', 'not array.');
			}
		}
		
		helperObj.setRequestPeriod = function(dataObj, period){
			if($.type(period) == 'string'){
				dataObj.period = period;
			}else{
				console.error('setRequestPeriod', 'not string.');
			}
		}
		
		helperObj.requsetData = helperObj.requestData = function(dataObj){
			var deferred = $.Deferred(), dataSrc = dataObj.define.dataSrc + '.data';
			dataObj.data = null;
			
			$.ajax({
				url: dataSrc,
				type: 'get',
				cache: false,
				dataType: 'json',
			}).done(function(data){
				dataObj.data = data;
			}).fail(function(xhr, states, err){
				console.log('获取数据文件' + '失败:' + err);
			}).always(function(data){
				if($.type(dataObj.data) != 'array'){
					// stitch parameterJson
					var parameterJson = '';
					if($.type(dataObj.parameters) == 'object'){
						var parameterList = [];
						$.each(dataObj.parameters || [], function(key, parameter){
							parameterList.push(parameter);
						});
						parameterJson = JSON.stringify(parameterList);
					}
					
					$.ajax({
						url: contextPath + 'public/echarts/getCubeData',
						data: {columnJson: JSON.stringify(dataObj.define.parameter), parameterJson: parameterJson, period: dataObj.period, sortJson: JSON.stringify(dataObj.define.parameterSort || [])},
						type: 'post',
						dataType: 'json'
					}).done(function(data){
						if(data && data.result == '成功' && data.content){
							dataObj.data = data.content;
						}else{
							var message = (data && data.message) ? data.message : 'unknow error.';
							console.log('获取数据' + '失败:' + message);
						}
					}).fail(function(xhr, states, err){
						console.log('获取数据' + '失败:' + err);
					}).always(function(data){
						console.log(
							'columnJson:' + JSON.stringify(dataObj.define.parameter) + 
							'\nparameterJson:' +  parameterJson + 
							'\nperiod:' +  dataObj.period + 
							'\nsortJson:' + (JSON.stringify(dataObj.define.parameterSort || []))
						);
						dataObj.data = $.type(dataObj.data) == 'array' ? dataObj.data : [];
						console.log('dataObj.data:' + JSON.stringify(dataObj.data));
						deferred.resolve(dealData(dataObj));
					});			
				}else{
					deferred.resolve(dealData(dataObj));
				}
			});
			
			return deferred.promise();
		}
		
		helperObj.bindRequestCallback = function(dataObj, callback, callbackKey){
			if($.type(callback) == 'function'){
				callbackKey = callbackKey ? callbackKey : '_callback_' + etool.randomId();
				dataObj.callbacks[callbackKey] = callback;
			}
		};
		
		helperObj.unbindRequestCallback = function(dataObj, callbackKey){
			delete dataObj.callbacks[callbackKey];
		};
		
		helperObj.setFilter = function(dataObj, filterValueDefineObj, needRequest){
			if($.type(filterValueDefineObj) == 'object'
				&& $.type(filterValueDefineObj.parameter) == 'object'
				&& $.type(filterValueDefineObj.filterValueObj) == 'object'
				&& filterValueDefineObj.FOID != null){
				
				if($.type(dataObj.parameters) != 'object'){
					dataObj.parameters = {}
				}
				if($.type(dataObj.filters) != 'object'){
					dataObj.filters = {}
				}
				dataObj.parameters[filterValueDefineObj.FOID] = filterValueDefineObj.parameter;
				dataObj.filters[filterValueDefineObj.FOID] = filterValueDefineObj.filterValueObj;
				if(needRequest == true){
					helperObj.requsetData(dataObj);
				}
			}
		}
		
		function dealData(dataObj){
			// filter data
			if($.type(dataObj.filters) == 'object'){
				$.each(dataObj.filters || [], function(key, filterValueObj){
					dataObj.data = filterValue(filterValueObj, dataObj.data);
				});
			}
			
			$.each(dataObj.callbacks || [], function(key, callback){
				if($.type(callback) == 'function'){
					callback(dataObj);
				}
			});
			
			return dataObj;
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
	}
	
	window.dataHelper = new DataHelper();
});