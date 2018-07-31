sap.ui.define([ "./BaseController" ], function( Base ) {
  return Base.extend("me.reichwald.jsonapi.controller.Users",
  {
    toUser: function( evt ) {
      var cxt = evt.getSource().getBindingContext();
      var path = cxt.getPath();
      var id = cxt.getProperty('id');

      this.getOwnerComponent().getRouter().navTo( "user", { id: id } );
    },

    newUser: function( evt ) {
      this.getOwnerComponent().getRouter().navTo( "user", { id: ':new' } );
    }
  });
});
