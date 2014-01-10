define(function(require) {
	var router = require('plugins/router');
	var ko = require('knockout');
	var $ = require('jquery');

	
	var viewModel = {
		userName : ko.observable(),
	    logoutLink : ko.observable(),	
		router : router,
		activate : function() {
			setupNavigation();
			getUser();
			return router.activate();
		}
	};
	
	function getUser() {
		$.ajax({url: '/get_user'}).done(function (data) {
			viewModel.userName(data.user_name);
	        viewModel.logoutLink(data.logout_url);
		});
	}

	var setupNavigation = function() {
		router.map([ {
			route : [ 'hello', '' ],
			title : 'Hello page',
			moduleId : 'hello/hello',
			hash : '#hello',
			nav : 1
		}, {
			route : 'add_item',
			title : 'Add new item',
			moduleId : 'add_item/add_item',
			hash : '#add_item',
			nav : 2
		}, {
			route : 'show_items',
			title : 'Show all items',
			moduleId : 'show_items/show_items',
			hash : '#show_items',
			nav : 3
		}]).mapUnknownRoutes('notfound/notfound', 'not-found').buildNavigationModel();
	};
	return viewModel;
});