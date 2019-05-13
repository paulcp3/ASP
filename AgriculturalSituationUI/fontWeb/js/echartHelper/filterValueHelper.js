jQuery(function($){
	window.FilterValueHelper = function(contextPath){
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
		
		helperObj.create = function(key, index, values, FOID){
			var filterValueDefineObj = etool.clone(defaultFilterValueDefineObject);
			if(key != null || $.type(index) != 'number' || $.type(values) != 'array'){
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
		
		helperObj.getFilterValues = function(obj){
			/*
				将chartObj或dataObj中的parameters、filters提出来，
				'_custom_'开头的是非控件提供，
				其它均为控件的htmlID开头
			*/
			var filterValues = [];
			if($.type(obj) == 'object'
				&& $.type(obj.parameters) == 'object'
				&& $.type(obj.filters) == 'object'){
				$.each(obj.parameters || [], function(FOID, parameter){
					var filterValueObj = obj.filters[FOID];
					
					if(parameter != null && filterValueObj != null){
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
});