sap.ui.define([ "./BaseController" ], function( Base ) {
  return Base.extend("me.reichwald.jsonapi.controller.Home",
  {
    toUsers: function( evt ) {
      this.getOwnerComponent().getRouter().navTo( "users" );
    },

    toBoards: function( evt ) {
      this.getOwnerComponent().getRouter().navTo( "users" );
    },

    toStories: function( evt ) {
      this.getOwnerComponent().getRouter().navTo( "users" );
    },

    toTasks: function( evt ) {
      this.getOwnerComponent().getRouter().navTo( "users" );
    },
  });
});
