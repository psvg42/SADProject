requirejs.config({
	paths : {
		'durandal' : '/client/resources/lib/durandal/js',
		'knockout' : '/client/resources/lib/knockout/knockout-3.0.0',
		'jquery' : '/client/resources/lib/jquery/jquery-1.10.2.min',
		'plugins' : '/client/resources/lib/durandal/js/plugins',
		'transitions': '/client/resources/lib/durandal/js/transitions',
		'text': '/client/resources/lib/require/text',
	},
	shim : {}
});


define([ 'durandal/system', 'durandal/app', 'durandal/viewLocator' ], function(system, app, viewLocator) {
	system.debug(true);

	
	app.title = 'My application';

	app.configurePlugins({
		router : true
	});

	app.start().then(function() {
		viewLocator.useConvention();
		app.setRoot('shell', 'entrance', 'my_app');
	});
});