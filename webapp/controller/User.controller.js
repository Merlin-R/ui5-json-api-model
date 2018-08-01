sap.ui.define([ "./BaseController" ], function( Base ) {
  return Base.extend("me.reichwald.jsonapi.controller.User",
  {
    onRoutePatternMatched: function( evt ) {
      var id = evt.getParameter( 'arguments' ).id;
      if ( id === ':new' )
      {
        id = this.getModel().createNewId( 'users' );
        this.getRouter().navTo( 'user', { id: id });
        return;
      }
      this.getView().bindElement( '/users/' + id );
    }
  });
});
