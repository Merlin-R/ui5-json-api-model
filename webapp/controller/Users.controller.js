sap.ui.define([ "./BaseController", "../util/Filters", "sap/ui/model/Sorter" ], function( Base, Filters, Sorter ) {
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
    },

    onSearch: function( evt ) {
      var filters = Filters.searchFields( ["name","email"], evt.getParameter( 'newValue' ) );
      this.getView().byId("list").getBinding("items").filter( filters );
    },

    onSortAsc: function( evt ) {
      this.getView().byId("list").getBinding("items").sort( new Sorter( "name", true ) );
    },

    onSortDesc: function( evt ) {
      this.getView().byId("list").getBinding("items").sort( new Sorter( "name", false ) );
    }
  });
});
