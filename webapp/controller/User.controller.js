sap.ui.define([ "./BaseController" ], function( Base ) {
  return Base.extend("me.reichwald.jsonapi.controller.User",
  {
    onRoutePatternMatched: function( evt ) {
      this.getView().bindElement( '/users/' + evt.getParameter( 'arguments' ).id );
    }
  });
});
