var DataTableHelper = function(htmlId, clmns, wts){
	var $ = jQuery;
	var obj = this;
	var id = htmlId;
	var columns = clmns;
	var widths = wts;
	
	var $el = $('#' + id);
	obj.$el = $el;
	
	obj.create = function(){
		var $tr;
		$el.empty().addClass('dataTableHelper');
		$.each(columns || [], function(i, column){
			if(i == 0){
				$tr = $('<tr>');
				$tr.appendTo($el);
				$tr.addClass('head');
			}
			var $th = $('<th>');
			$th.appendTo($tr);
			if($.type(widths) == 'array' && widths[i] != '')
				$th.css({'width': widths[i]});
			$th.html(column);
		});
	}
	
	obj.setData = function(data){
		$el.find('tr:not(.head)').remove();
		if($.type(data) == 'array' && data.length > 0 && $.type(data[0]) == 'array'){
			$.each(data[0] || [], function(j){
				var $tr = $('<tr>');
				$tr.appendTo($el);
				$.each(columns, function(i){
					var $td = $('<td>');
					$td.appendTo($tr);
					$td.html(data[i][j]);
				});
			});
		}
	}
	
	obj.setStyle = function(x, y, className){
		if($.type(x) == 'number' && $.type(y) == 'number' && $.type(className) == 'string'){
			var $trs = $el.find('tr:not(.head)');
			if($trs.length > y){
				var $tr = $trs.eq(y);
				var $tds = $tr.find('td');
				if($tds.length > x){
					var $td = $tds.eq(x);
					$td.attr('class', className);
				}
			}
		}
	}
	
	obj.setRowStyle = function(row, classNames){
		if($.type(row) == 'number' && $.type(classNames) == 'array'){
			var $trs = $el.find('tr:not(.head)');
			if($trs.length > row){
				$.each(classNames || [], function(i, className){
					obj.setStyle(i, row, className);
				});
			}
		}
	}
	
	obj.setColStyle = function(col, classNames){
		if($.type(col) == 'number' && $.type(classNames) == 'array'){
			var $rowExp = $el.find('tr:first th');
			if($rowExp.length > col){
				$.each(classNames || [], function(i, className){
					obj.setStyle(col, i, className);
				});
			}
		}
	}
	
	obj.create();
}