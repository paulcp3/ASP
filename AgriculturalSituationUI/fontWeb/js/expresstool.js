/*! Expresstool - v0.01 - 2015-02-08 01:18:13
* Editor: Gavin Guo
* Copyright (c) 2015 Gavin Guo */
(function(){
	window.Expresstool = function(){
		this.clone = function(obj){
			var result, funRegular = /^function/;
			if(obj == null){
				result = obj;
			}else if(obj.constructor === Array){
				result = [];
				for(var i in obj){
					result[i] = this.clone(obj[i]);
				}
			}else if(obj.constructor === Object){
				result = {};
				for(var k in obj){
					result[k] = this.clone(obj[k]);
				}
			}else{
				result = obj;
			}
			return result;
		}
		this.isEmpty = function(obj){
			if(obj == null){
				return true;
			}else if(obj.constructor === Array){
				return obj.length == 0 ? true : false;
			}else if(obj.constructor === Object){
				for(var k in obj){
					return false; 
				}
				return true;
			}else{
				return false;
			}
		}
		this.randomId = function(){
			return parseInt(Math.random() * 1000000);
		}
		// 日期数字，例如：1400233999
		this.dateToString = function(timeString){
			var dateFormatMap = {
				month: [
					'01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'
				],
				date: [
					'01', '02', '03', '04', '05', '06', '07', '08', '09', '10',
					'11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
					'21', '22', '23', '24', '25', '26', '27', '28', '29', '30',
					'31'
				],
				hour: [
					'00', '01', '02', '03', '04', '05', '06', '07', '08', '09', 
					'10', '11', '12', '13', '14', '15', '16', '17', '18', '19', 
					'20', '21', '22', '23'
				],
				minute: [
					'00', '01', '02', '03', '04', '05', '06', '07', '08', '09', 
					'10', '11', '12', '13', '14', '15', '16', '17', '18', '19', 
					'20', '21', '22', '23', '24', '25', '26', '27', '28', '29', 
					'30', '31', '32', '33', '34', '35', '36', '37', '38', '39', 
					'40', '41', '42', '43', '44', '45', '46', '47', '48', '49', 
					'50', '51', '52', '53', '54', '55', '56', '57', '58', '59'
				],
				second: [
					'00', '01', '02', '03', '04', '05', '06', '07', '08', '09', 
					'10', '11', '12', '13', '14', '15', '16', '17', '18', '19', 
					'20', '21', '22', '23', '24', '25', '26', '27', '28', '29', 
					'30', '31', '32', '33', '34', '35', '36', '37', '38', '39', 
					'40', '41', '42', '43', '44', '45', '46', '47', '48', '49', 
					'50', '51', '52', '53', '54', '55', '56', '57', '58', '59'
				]
			}
			
			var value = '';
			if(timeString && isNaN(parseInt(timeString)) == false){
				var time = new Date(timeString);
			
				value += time.getFullYear();
				value += '-';
				value += dateFormatMap.month[time.getMonth()];
				value += '-';
				value += dateFormatMap.date[time.getDate() - 1];
				value += ' ';
				value += dateFormatMap.hour[time.getHours()];
				value += ':';
				value += dateFormatMap.minute[time.getMinutes()];
				value += ':';
				value += dateFormatMap.second[time.getSeconds()];
			}
			
			return value;
		}
		// 判断是否为Array对象
		this.isArray = function(obj){   
			return Object.prototype.toString.call(obj) === '[object Array]';    
		}
		// 下面的方法待验证，当数据作为页面传递时的可用性
		// 判断是否为String对象
		this.isString = function(obj){
			return (typeof obj == 'string') && obj.constructor == String; 
		}
		// 判断是否为Number对象
		this.isNumber = function(obj){ 
			return (typeof obj == 'number') && obj.constructor == Number; 
		}
		// 判断是否为Date对象
		this.isDate = function(obj){ 
			return (typeof obj == 'object') && obj.constructor == Date; 
		}
		// 判断是否为Function对象
		this.isFunction = function(obj){ 
			return (typeof obj == 'function') && obj.constructor == Function; 
		}
		// 判断是否为Object对象
		this.isObject = function(obj){ 
			return (typeof obj == 'object') && obj.constructor == Object; 
		}
	}
	
	window.etool = new Expresstool();
})()