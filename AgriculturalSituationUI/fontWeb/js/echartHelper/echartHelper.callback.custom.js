jQuery(function($){
	window._chartCallbackCustom = {
		'test': function(params){
			return [1, 2, 3, 4, 5, 6];
		},
		'map':function(params){
			var result = [];
			for(var i = 0;i < params[0].length;i++){
				var obj = {};
				obj['value'] = parseFloat(params[1][i]).toFixed(2);
				obj['name'] = params[0][i];
				result.push(obj);
			}
			return result;
		},
		'mapen':function(params){
          var obj = {};
			for(var i = 0;i < params[0].length;i++){
				
				obj[params[1][i]]=params[0][i];
			}
			return obj;
		},
		'gauge':function(params){
			var result = [];
			for(var i = 0;i < params[0].length;i++){
				var obj = {};
				obj['value'] = params[1][i];
				obj['name'] = params[0][i];;
				result.push(obj);
			}
			return result;
		},			
		'pie':function(params){
			var result = [];
			for(var i = 0;i < params[0].length;i++){
				var obj = {};
				obj['value'] = params[1][i];
				obj['name'] = params[0][i];
				result.push(obj);
			}
			return result;
		},
		'num':function(params){
			var result =params[0][0];
			return Number(result);
		},
		'max':function(params){
			var result = params[0][0];;
				for(var i = 1;i < params[0].length;i++){
			
				if(params[0][i]>params[0][i-1]){
			
					obj=params[0][i];
					if(obj>result){
						result=obj;
							}
							else{
								result=result;
							}
				}else{
					
					obj=params[0][i-1];
					if(obj>result){
						result=obj;
							}
							else{
								result=result;
							}
				}
			}
			return Number(result);
		},
		'cube1':function(params){
			var result = [];
			var my_params = params[0].slice(0);
             my_params.sort();
			  result.push(my_params[0]);
			  for(var i = 1; i < my_params.length; i++){
			     if(my_params[i]!==result[result.length-1])
				 {
					 result.push(my_params[i]);
				 }
			  }
			return result;
		},
		'cube2':function(params){
			var result_1 = [];
			var result_2 = [];
			var result_3 = [];
			var my_params = params[0].slice(0);
             my_params.sort();
			  result_1.push(my_params[0]);
			  for(var i = 1; i < my_params.length; i++){
			     if(my_params[i]!==result_1[result_1.length-1])
				 {
					 result_1.push(my_params[i]);
				 }
			  }
			  
			 var my_params_2 = params[1].slice(0);
             my_params_2.sort();
			  result_2.push(my_params_2[0]);
			  for(var i = 1; i < my_params_2.length; i++){
			     if(my_params_2[i]!==result_2[result_2.length-1])
				 {
					 result_2.push(my_params_2[i]);
				 }
			  }
			  
			  for(var i = 0;i<result_1.length;i++){
				  for(var j =0;j<params[0].length;j++){
					  if(params[0][j]==result_1[i]&&params[1][j]==result_2[0]){
						  result_3.push(params[2][j]);
					  }
				  }
			  }
			  
			return result_3;
		},
		'cube3':function(params){
			var result_1 = [];
			var result_2 = [];
			var result_3 = [];
			var my_params = params[0].slice(0);
             my_params.sort();
			  result_1.push(my_params[0]);
			  for(var i = 1; i < my_params.length; i++){
			     if(my_params[i]!==result_1[result_1.length-1])
				 {
					 result_1.push(my_params[i]);
				 }
			  }
			  
			 var my_params_2 = params[1].slice(0);
             my_params_2.sort();
			  result_2.push(my_params_2[0]);
			  for(var i = 1; i < my_params_2.length; i++){
			     if(my_params_2[i]!==result_2[result_2.length-1])
				 {
					 result_2.push(my_params_2[i]);
				 }
			  }
			  
			  for(var i = 0;i<result_1.length;i++){
				  for(var j =0;j<params[0].length;j++){
					  if(params[0][j]==result_1[i]&&params[1][j]==result_2[1]){
						  result_3.push(params[2][j]);
					  }
				  }
			  }
			  
			return result_3;
		},
		'cubeall':function(params){
			var result_1 = [];
			var result_2 = [];	
			var result_5=[];
			var my_params = params[0].slice(0);
             my_params.sort();
			  result_1.push(my_params[0]);
			  for(var i = 1; i < my_params.length; i++){
			     if(my_params[i]!==result_1[result_1.length-1])
				 {
					 result_1.push(my_params[i]);
				 }
			  }
			 
 
			 var my_params_2 = params[1].slice(0);
             my_params_2.sort();
			  result_2.push(my_params_2[0]);
			  for(var i = 1; i < my_params_2.length; i++){
			     if(my_params_2[i]!==result_2[result_2.length-1])
				 {
					 result_2.push(my_params_2[i]);
				 }
			  }
			  
			  for(var h=0;h<result_2.length;h++)
			  {
			    var result_3 = [];
			    for(var i = 0;i<result_1.length;i++){
				  for(var j =0;j<params[0].length;j++){
					  if(params[0][j]==result_1[i]&&params[1][j]==result_2[h]){
						  result_3.push(params[2][j]);
					  }
				  }
			    }
			   var map = {
							  "name":result_2[h],
                              "type":'bar',
                              "data":result_3					  
						  }
				result_5.push(map);
			  }
			return result_5;
		},
		'deduplication': function(params){
			var result = [];
			if($.type(params) == 'array' && params.length > 0 && $.type(params[0]) == 'array'){
				for(var i = 0; i < params[0].length; i++){
					if (result.indexOf(params[0][i]) == -1) 
						result.push(params[0][i]);
				}
			}
			return result;
		},
		'line': function(params){
			var result = [];
			
			var xAxis = []
			for(var i = 0; i < params[1].length; i++){
				if (xAxis.indexOf(params[1][i]) == -1) 
					xAxis.push(params[1][i]);
			}
			
			var template = {
		        "name": null,
		        "type": "line",
				"data": [],
		        "markPoint" : {
					"label": {
						"normal": {
							"textBorderWidth": 2
						}
					},
		            "data" : [
	                    {"type" : "max", "name": "最大值"},
	                    {"type" : "min", "name": "最小值"}
		            ]
		        }
		    };
			
			var map = {};
			$.each(params[0] || [], function(i){
				var key = params[0][i];
				var list = map[key];
				list = $.type(list) == 'array' ? list : [];
				map[key] = list;
				var obj = {};
				obj.name = params[1][i];
				obj.value = parseFloat(params[2][i]).toFixed(2);
				list.push(obj);
			});
			
			$.each(map || [], function(key, l){
				var list = l;
				if(list.length < xAxis.length){
					list = [];
					$.each(xAxis || [], function(i, v){
						if(l.length > 0 && l[0].name == v){
							list.push(l[0]);
							l.shift();
						}else{
							var obj = {
								name: v,
								value: '-'
							}
							list.push(obj);
						}
					});
				}
				
				list.sort(function(a, b){
					return a.name.localeCompare(b.name);
				});
				
				var t = etool.clone(template);
				t.name = key;
				t.data = list;
				
				result.push(t);
			});
			
			return result;
		},
		'bar': function(params){
			var result = [];
			
			var xAxis = []
			for(var i = 0; i < params[1].length; i++){
				if (xAxis.indexOf(params[1][i]) == -1) 
					xAxis.push(params[1][i]);
			}
			
			var template = {
		        "name": null,
		        "type": "bar",
				"data": [],
		        "markPoint" : {
					"label": {
						"normal": {
							"textBorderWidth": 2
						}
					},
		            "data" : [
	                    {"type" : "max", "name": "最大值"},
	                    {"type" : "min", "name": "最小值"}
		            ]
		        }
		    };
			
			var map = {};
			$.each(params[0] || [], function(i){
				var key = params[0][i];
				var list = map[key];
				list = $.type(list) == 'array' ? list : [];
				map[key] = list;
				var obj = {};
				obj.name = params[1][i];
				obj.value = parseFloat(params[2][i]).toFixed(2);
				list.push(obj);
			});
			
			$.each(map || [], function(key, l){
				var list = l;
				if(list.length < xAxis.length){
					list = [];
					$.each(xAxis || [], function(i, v){
						if(l.length > 0 && l[0].name == v){
							list.push(l[0]);
							l.shift();
						}else{
							var obj = {
								name: v,
								value: '-'
							}
							list.push(obj);
						}
					});
				}
				list.sort(function(a, b){
					return a.name.localeCompare(b.name);
				});
				
				var t = etool.clone(template);
				t.name = key;
				t.data = list;
				
				result.push(t);
			});
			
			return result;
		},
		'cumulative': function(params){
			var result = [];
			
			var map = {};
			if($.type(params) == 'array' && params.length > 1){
				var valueList = params[0];
				var keyList = params[1];
				$.each(keyList || [], function(i, key){
					if($.type(map[key]) != 'number'){
						map[key] = 0;
					}
					
					var value = parseFloat(valueList[i]);
					if(isNaN(value)){
						value = 0;
					}
					
					map[key] += value;
				});
				
				$.each(map || [], function(key, value){
					result.push(value.toFixed(2));
				});
			}
			
			return result;
		},
		'average': function(params){
			var result = [];
			
			var map = {};
			if($.type(params) == 'array' && params.length > 1){
				var valueList = params[0];
				var keyList = params[1];
				$.each(keyList || [], function(i, key){
					if($.type(map[key]) != 'object'){
						map[key] = {value: 0, index: 0};
					}
					
					var value = parseFloat(valueList[i]);
					if(isNaN(value)){
						value = 0;
					}
					
					map[key].value += value;
					map[key].index++;
				});
				
				$.each(map || [], function(key, obj){
					var value = obj.value;
					value = value / obj.index;
					result.push(value.toFixed(2));
				});
			}
			
			return result;
		},
		'titleText': function(params){
			var array = [], title = '';
			if($.type(params) == 'array' && params.length > 0 && $.type(params[0]) == 'array'){
				for(var i = 0; i < params[0].length; i++){
					if (array.indexOf(params[0][i]) == -1) 
						array.push(params[0][i]);
				}
			}
			if(array.length > 0){
				array.sort(function(a, b){
					if(a > b){
						return 1;
					}else if(a == b){
						return 0;
					}else if(a < b){
						return -1;
					}
				});
				var min = array[0];
				var max = array[array.length - 1];
				title += min;
				if(min != max){
					title += max;
				}
			}
			return title;
		}
	}	
});