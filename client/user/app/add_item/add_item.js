define(['knockout'], function (ko) {
	
	var $ = require('jquery');
	
	var viewModel = {
		title : ko.observable(),
		description : ko.observable(),
		price : ko.observable(),
		priority : ko.observable(),
		output : ko.observable(),
		availablePriority : ko.observableArray(['1','2','3','4','5','6','7','8','9','10'])
	}
	
	this.addItem = function() {
		if (!cheakTitle(viewModel.title()) || !cheakPrice(viewModel.price())) {
			return false;
		}
		
		var param = {
				title:viewModel.title(),
				description:viewModel.description(),
				price:viewModel.price(),
				priority:viewModel.priority()
		}
		
		$.ajax({
			type:'POST',
			url:'/add_item',
			data:param
		}).done(function (data) {
			viewModel.output('<div class="alert alert-success">Item added.</div>');
			viewModel.title('');
			viewModel.description('');
			viewModel.price('');
			viewModel.priority(1);
		});
	}
	
	
   function cheakTitle(title) {
	   
	   if (title) return true;
	   var BAD_TITLE = '<div class="alert alert-danger">'
			+'Title can\'t be empty! </div>';
	   viewModel.output(BAD_TITLE);
	   return false;
   }
	
   function cheakPrice(price) {
		viewModel.output('');
		var expr = /(^[1-9][0-9]{0,5}$)|(^0$)/;
		if (!expr.test(price)) {
			var inputedPrice = price?price:'empty price';
			var BAD_PRICE = '<div class="alert alert-danger">'
				+'Bad price : ['+inputedPrice+']! Price must be natural number. </div>';
			viewModel.output(BAD_PRICE);
			return false;
		}
		return true;
	};


    return viewModel;
});