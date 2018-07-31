sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox"
], function(Controller, MessageToast, JSONModel, MessageBox) {
	"use strict";
	var c = sap.ui.getCore();

	return Controller.extend("me.reichwald.jsonapi.controller.BaseController",{

		onInit: function() {
			var v = this.getView();

			v.setModel(new JSONModel({}), 'Routing');

			var routing = this.getOwnerComponent().getManifest()['sap.ui5'].routing;
			var viewPath = routing.config.viewPath;

			this.getRouter()
				.attachRouteMatched(this._onBeforeRouteMatched.bind(this, routing, viewPath, v))
				.attachRoutePatternMatched(this._onBeforeRoutePatternMatched.bind(this, routing, viewPath, v));

		},

		_onBeforeRoutePatternMatched: function(routing, viewPath, view, e) {
			// Filter onRoutePatternMatched events for relevance.

			var viewName = view.getViewName().replace(viewPath + '.', '');
			var destTarget = this._resolveRouteName(e.getParameter('name'), routing.routes);

			if (routing.targets[destTarget].viewName === viewName) {
				view.getModel('Routing').setData(e.getParameters());
				return this.onRoutePatternMatched.apply(this, Array.prototype.slice.call(arguments, 3));
			}
		},

		_onBeforeRouteMatched: function(routing, viewPath, view, e) {
			// Filter onRouteMatched events for relevance.

			var viewName = view.getViewName().replace(viewPath + '.', '');
			var destTarget = this._resolveRouteName(e.getParameter('name'), routing.routes);

			if (routing.targets[destTarget].viewName === viewName)
				return this.onRouteMatched.apply(this, Array.prototype.slice.call(arguments, 3));
		},

		_resolveRouteName: function(name, routes) {
			for (var i in routes)
				if (routes[i].name === name)
					return routes[i].target;
				else if (routes[i].subroutes) {
				var result = this._resolveRouteName(name, routes[i].subroutes);
				if (result)
					return result;
			}
			return null;
		},

		onRouteMatched: function() {},
		onRoutePatternMatched: function() {},

		getRouter: function() {
			return this.getOwnerComponent().getRouter();
		},

		getLanguage: function() {
			return c.getConfiguration().getLanguage() || 'de';
		},

		getModel: function(model) {
			return this.getOwnerComponent().getModel(model);
		},

    setModel: function() {
      var comp = this.getOwnerComponent();
      comp.setModel.apply( comp, arguments );
      return this;
    },

		toast: function(text) {
			MessageToast.show(this.translate(text));
		},

		msg: MessageBox.show.bind(MessageBox),
		msgError: MessageBox.error.bind(MessageBox),
		msgWarning: MessageBox.warning.bind(MessageBox),
		msgAlert: MessageBox.alert.bind(MessageBox),

		translate: function() {
			var i18n = this.getModel('i18n');
			return i18n.getProperty.apply(i18n, arguments);
		},

		translateWithParam: function(i18nId,params){
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			return oBundle.getText(i18nId, params);
		},

		navBack: function() {
			window.history.back();
		},

		displayODataError: function(err) {
			var errorText;
			if ( err.response && err.response.body )
			{
				errorText = $(err.response.body).find('message').first().text();
				if ( !errorText )
					errorText = $(err.response.body).find('h1').first().text();
				if ( !errorText )
					errorText = $(err.response.body).text();
			}
			MessageBox.error( errorText );
			if (this && this.setBusy)
				this.setBusy(false);
		},

		setBusy: function(state) {
			if (this && this.getView())
				this.getView().setBusy(state);
		},

	});
});
