sap.ui.define([
  "sap/ui/core/UIComponent",
  "me/reichwald/model/jsonapi/JSONAPIModel"
], function( UIComponent, JSONAPIModel ) {

  return UIComponent.extend("me.reichwald.jsonapi.Component", {

    metadata: {
      manifest: "json"
    },

    init: function() {
      UIComponent.prototype.init.apply( this, arguments );
      this.setModel( window.model = new JSONAPIModel({ url: "./api" }) );
      this.getRouter().initialize();
    },

  });

});
