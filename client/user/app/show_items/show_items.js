define(['knockout'], function (ko) {
	
	var $ = require('jquery');
	
	var vm = {
		busy: ko.observable(true),
		activate: activate,
		load: load,
		items: ko.observableArray(),
		isNext: ko.observable(false)
	}
	
	function setItems(items) {
		vm.items.removeAll();
		for(i = 0; i < items.length; i++){
			vm.items.push(items[i]);
		}
	};
	
	function activate() {
		var data = {
			next: 'begin'
		}
		$.ajax({
			type:'get',
			url:'/get_items',
			data:data			
		}).done(function (data) {
			if (data.items) {
				setItems(data.items);
			}
			vm.busy(false);
		});
	};
	
	function load() {
		vm.busy(!vm.busy());
	};
	
	return vm;
});