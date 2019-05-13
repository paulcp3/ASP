/*! JQExpresstool - v0.01 - 2015-02-08 01:18:13
* Editor: Gavin Guo
* Includes: jquery.js
* Copyright (c) 2015 Gavin Guo */
jQuery(function($){
	window.JQExpresstool  = function(){
		var jtoolObj = this;
		jtoolObj.formId = 'form_' + etool.randomId();
		jtoolObj.buttonsSetId = 'buttonsSet_' + etool.randomId();
		
		// 页面跳转
		jtoolObj.jumpToAction = function(action, param, target, method){
			var $submitForm = $('#' + jtoolObj.formId);
			
			method = method == 'get' ? 'get' : 'post';
			
			if($submitForm.length == 0){
				$submitForm = $('<form>');
				$submitForm.appendTo('body');
				$submitForm.hide(0);
				$submitForm.attr({
					method: method,
					target: '_self' 
				});
			}
			$submitForm.empty();
			target = target ? target : '_self';
			$submitForm.attr({
				'action': action,
				'target': target
			});		
			if(param){
				$.each(param, function(key, value){
					var $param = $('<input type="hidden" />');
					$param.appendTo($submitForm);
					$param.attr('name', key);
					if(typeof value === 'object'){
						value = JSON.stringify(value);
					}
					$param.val(value);
				});
			}
			$submitForm.submit();
		}
		
		// 设置值
		/*
			TODO 只能处理“选中为true，为选中为false”逻辑的checkbox
		*/
		jtoolObj.setFormValue = function(key, data, $obj){
			var $inputs = $obj.find('input[type=text].' + key + ', input[type=hidden].' + key + ', input[type=checkbox].' + key + ', select.' + key + ', textarea.' + key);
			// IE6 hack
			if($.browser.msie && $.browser.version == 6){
				$inputs.filter(':not(:checkbox, select)').val('');
				$inputs.filter(':checkbox').prop('checked', false);
				$inputs.filter('select').each(function(){
					var $select = $(this);
					setTimeout(function(){
						$select.val('');
					}, 1);
				});
			}else{
				$inputs.filter(':not(:checkbox)').val('');
				$inputs.filter(':checkbox').prop('checked', false);				
			}
			
			$.each(data, function(k, o){
				var $input = $inputs.filter('[name=' + k + ']');
				if($input.length > 0 && $input.filter(':checkbox').length == 0){
					// IE6 hack
					if($.browser.msie && $.browser.version == 6 && ('' + $input.prop('nodeName')).toLowerCase() == 'select'){
						setTimeout(function(){
							if(typeof o === 'number' || typeof o === 'string' || typeof o === 'undefined'){
								$input.find('option[value="' + o + '"]').attr('selected', true);
							}else if(typeof o === 'boolean'){
								$input.find('option[value="' + o + '"]').attr('selected', true);
							}
						}, 1);
					}else{
						if(typeof o === 'number' || typeof o === 'string' || typeof o === 'undefined'){
							$input.val(o);
						}else if(typeof o === 'boolean'){
							$input.val('' + o);
						}						
					}
				}else{
					if(typeof o === 'number' || typeof o === 'string' || typeof o === 'undefined'){
						$input.filter('[value="' + o + '"]').prop('checked', true);
					}else if(typeof o === 'boolean'){
						if(o){
							$input.prop('checked', true);
						}
					}
				}   
			});
		}
	
		/*
			TODO 只能处理“选中为true，为选中为false”逻辑的checkbox
		*/
		// 收集值
		jtoolObj.getFormValue = function(key, data, $obj, checkList){
			var $inputs = $obj.find('input[type=text].' + key + ', input[type=hidden].' + key + ', input[type=checkbox].' + key + ', select.' + key + ', textarea.' + key);
			$inputs.removeClass('inputerror');
			var noError = true;
			var temp = {};
			$inputs.filter(':not(:checkbox)').each(function(i, input){
				var $input = $(this);
				var name = $input.attr('name');
				var value = $.trim($input.val());
			
				$.each(checkList, function(j, check){
					if(noError){
						$.each(check.scope, function(j, n){
							if(noError){
								if(name == n){
									if(!check.check(name, value)){
										popups.alert(j + check.description);
										$input.addClass('inputerror');
										noError = false;
										return false;
									}
								}
							}							
						})	
					}else{
						return false;
					}
				});
				if(noError){
					if(typeof data[name] === 'boolean'){
						temp[name] = value == 'true' ? true : false;
					}else{
						temp[name] = value == '' ? null : value;
					}
				}else{
					return false;
				}
			});

			if(noError){
				$inputs.filter(':checkbox').each(function(i, input){
					/*
						TODO 只实现boolean
					*/
					var $input = $(this);
					var name = $input.attr('name');
					var value = $input.prop('checked');
			
					if(noError){
						if(typeof data[name] === 'boolean'){
							temp[name] = value;
						}
					}else{
						return false;
					}
				});
			}

			if(noError){
				$.extend(data, temp);
			}

			return noError;
		}
		
		// 校验
		jtoolObj.check = function(value, key, checkList){
			var noError = true;
			
			$.each(checkList, function(i, check){
				if(noError){
					if(!check.check(key, value)){
						popups.alert(key + check.description);
						noError = false;
						return false;
					}
				}else{
					return false;
				}
			});

			return noError;
		}
		
		// 队列控制
		var ajax = $.ajax; 
		var pendingRequests = {};
		var ajaxRunning = {};
		
		jtoolObj.defaultConfigAjax = {
			cache:false,
			type:'post',
			dataType:'json',
			mode: 'async',
			queueName: 'ajaxRequst'
		}
		jtoolObj.ajax = function(settings){
			settings = $.extend({}, $.ajaxSettings, jtoolObj.defaultConfigAjax, settings);
			var requestName = settings.url || '';
			requestName = requestName.split('?');
			
			// 封装msg参数
			var successFun = settings.success;
			var errorFun = settings.error;
			var completeFun = settings.complete;
			settings.success = function(){
				var _arguments = Array.prototype.slice.call(arguments);
				if(successFun){
					_arguments.push(settings.msg);
					successFun.apply(this, _arguments);
				}
			}
			settings.error = function(){
				var _arguments = Array.prototype.slice.call(arguments);
				if(errorFun){
					_arguments.push(settings.msg);
					errorFun.apply(this, _arguments);
				}
			}
			settings.complete = function(){
				var _arguments = Array.prototype.slice.call(arguments);
				if(completeFun){
					_arguments.push(settings.msg);
					completeFun.apply(this, _arguments);
				}
			}
			
			switch(settings.mode)
			{
			case 'abort':
				if(pendingRequests[requestName] != null){
					pendingRequests[requestName].abort();
				}
				pendingRequests[requestName] = ajax.apply(ajax, arguments);
				return pendingRequests[requestName];
			case 'queue':
				var oldAjaxComplete = settings.complete;
				settings.complete = function(){
					if(oldAjaxComplete && (oldAjaxComplete.apply(this, arguments) || true)){
						// oldAjaxComplete.apply(this, arguments);
					}
					if($(jtoolObj).queue(settings.queueName).length > 0){
						$(jtoolObj).dequeue(settings.queueName);
					}else {
                        ajaxRunning[settings.queueName] = false;
                    }
				}
				
				$(jtoolObj).queue(settings.queueName, function(){
					ajax(settings)
				});
				
                if ($(jtoolObj).queue(settings.queueName).length == 1 && !ajaxRunning[settings.queueName]) {
                    ajaxRunning[settings.queueName] = true;
                    $(jtoolObj).dequeue(settings.queueName);
                }
				
				return;
			case 'async':
				return ajax.apply(ajax, arguments);
			}
		}
		
		jtoolObj.ajaxQueueAction = function(action, queueName){
			queueName = queueName == null ? jtoolObj.defaultConfigAjax.queueName : queueName;
			if($.type(action) == 'function'){
				$(jtoolObj).queue(queueName, function(){
					action();
				});	
				if($(jtoolObj).queue(queueName).length == 1 && !ajaxRunning[queueName]){
					ajaxRunning[settings.queueName] = true;
					$(jtoolObj).dequeue(queueName);
				}
			}
		}
		
		// buttonpane: jQuery style buttons
		jtoolObj.buttonsSet = function(buttons){
			var hasButtons = false;
			var $buttonpane = $('#' + jtoolObj.buttonsSetId);
			if($buttonpane.length == 0){
				$buttonpane = $('<div id="' + jtoolObj.buttonsSetId + '">');
				$buttonpane.appendTo($('body'));
				$buttonpane.css({
					'text-align': 'right',
					'margin-top': '5px',
					'border-top': '1px solid #ccc',
					'padding-top': '3px',
					'height': '32px'
				})
			}
			$buttonpane.empty();

			if ( typeof buttons === "object" && buttons !== null ) {
				$.each( buttons, function() {
					return !(hasButtons = true);
				});
			}
			if ( hasButtons ) {
				$.each( buttons, function( name, props ) {
					props = $.isFunction( props ) ?
						{ click: props, text: name } :
						props;
					var button = $( "<button type='button'>" )
						.attr( props, true )
						.unbind( "click" )
						.click(function() {
							props.click.apply();
						})
						.appendTo( $buttonpane );
					if ( $.fn.button ) {
						button.button();
					}
				});
			}
		}
		
		jtoolObj.block = function(msg, callback){
			if($.blockUI){
				var config = {
					css: {backgroundColor:'',border:'none',color:'#fff',fontSize:'20px'},
					baseZ: 9999
				}
				config.message = '<h4>' + msg + '</h4>';
				if(typeof callback == 'function'){
					config.onBlock = callback;
				}
				$.blockUI(config);
			}
		}
		
		jtoolObj.unblock = function(){
			if($.unblockUI){
				$.unblockUI();
			}
		}
		
		jtoolObj.clone = function(obj){
			var result = null
			if($.type(obj) == 'object'){
				result = {};
				$.each(obj || {}, function(k, v){
					result[k] = jtoolObj.clone(v);
				});
			}else if($.type(obj) == 'array'){
				result = [];
				$.each(obj || [], function(i, v){
					result.push(jtoolObj.clone(v));
				});
			}else if($.type(obj) == 'string'){
				result = obj.valueOf();
			}else if($.type(obj) == 'number'){
				result = obj.valueOf();
			}else if($.type(obj) == 'function'){
				result = obj;
			}else if($.type(obj) == 'date'){
				result = new Date(obj.valueOf());
			}else if($.type(obj) == 'regexp'){
				var pattern = obj.valueOf();
	            var flags = '';
	            flags += pattern.global ? 'g' : '';
	            flags += pattern.ignoreCase ? 'i' : '';
	            flags += pattern.multiline ? 'm' : '';
	            result = new RegExp(pattern.source, flags);
			}else if($.type(obj) == 'boolean'){
				result = obj;
			}else{
				result = obj;
			}
			
			return result;
		}
		
		jtoolObj.openLinkInIndexPage = function(title, url, params){
			if(top !== self && $.type(top.postMessage) == 'function'){
				var data = {
					'class': '_openIndexPageTab',
					'data': {
						title: title,
						url: url,
						params: params
					}
				};
				
				top.postMessage(JSON.stringify(data), '*');
			}else{
				jtoolObj.jumpToAction(url, params, '_blank');
			}
		}
	}
	
	window.jtool = new JQExpresstool();
});