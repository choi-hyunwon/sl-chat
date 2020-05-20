(function($) {
	$.templateRenderer = function(filename, renderData, contextpath) {
		$.extend(renderData, {
			"contextpath" : CONTEXTPATH
		});	
		
		var content = $.ajax({
	    	url: "./js/tmpl/"+filename+".tmpl",
	        dataType:"text",
	        async : false,
	        type:"get",
	        processData:false
	    });
		
		var template = $.templates(content.responseText);
		return template.render(renderData);
	};
	
	$.getTemplateStr = function(filename) {
		var content = $.ajax({
	    	url: "./js/tmpl/"+filename+".tmpl",
	        dataType:"text",
	        async : false,
	        type:"get",
	        processData:false
	    });
		return $.templates(content.responseText);
	};
	
	$.registTemplateStr = function(registName, filename) {
		var content = $.ajax({
	    	url: "./js/tmpl/"+filename+".tmpl",
	        dataType:"text",
	        async : false,
	        type:"get",
	        processData:false
	    });
		return $.templates(registName, content.responseText);
	};
	
	$.dialogResponse = function(contents, tmpl) {
		if(!tmpl)
			tmpl = $.getTemplateStr("dialog-response");
	
		var data = {
			contents : contents, 
			contextpath : CONTEXTPATH,
			functionName : "chat.sendRichMessage",
			botBubbleId : $("li.bot").length + 1 
		};		

		var $dialogResponse = $(tmpl.render(data));
		return $dialogResponse;
	};
	
	$.views.converters({
		escape: function(val) {
			return escape(val);
		}
	});
	
}(jQuery));