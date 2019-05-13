/**
 * 需要expresstool.js
 */
jQuery(function($){
	window._chartCallbackDefault = {
		'normal': function(params){
			if(etool.isArray(params)){
				var result = [];
				
				if(etool.isArray(params[0])){
					if(params.length > 1){
						// e.g. [[1, 2, 3]] || [[1, 2, 3], [4, 5, 6]]
						// 找到长度最长的队列，以其为基准构建result
						var maxIndex = -1
						var maxLength = -1;
						$.each(params || [], function(i, param){
							if(etool.isArray(param) && param.length > maxLength){
								maxLength = param.length;
								maxIndex = i;
							}
						});
						// 构建result
						if(maxIndex != -1){
							// 循环最长队列
							$.each(params[maxIndex] || [], function(i){
								var temp = [];
								// 各param分别取值放入temp
								$.each(params || [], function(j, param){
									temp.push(param[i] || null);
								})
								result.push(temp);
							});							
						}
					}else if(params.length == 1){
						result = params[0];
					}else{
						// e.g. [1, 2, 3]
						result = params;
					}
				}
				
				return result;
			}else{
				return [];
			}
		}
	}
})