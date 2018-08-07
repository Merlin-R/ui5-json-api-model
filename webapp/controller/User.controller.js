sap.ui.define(["./BaseController"], function(Base) {
  return Base.extend("me.reichwald.jsonapi.controller.User", {
    onRoutePatternMatched: function(evt) {
      var id = evt.getParameter('arguments').id;
      if (id === ':new') {
        id = this.getModel().createNewId('users');
        this.getRouter().navTo('user', {
          id: id
        });
        return;
      }
      this.getView().bindElement('/users/' + id);
    },

    onDelete: function() {
      this.getModel().deleteOne( this.getView().getElementBinding().getPath() ).then( () => {
        this.getModel().checkUpdate('/users');
      });
    },

    onSave: function() {
      this.getModel().saveChanges( this.getView().getElementBinding().getPath() ).then( () => {
        var path = this.getView().getElementBinding().getPath();
        var id   = this.getModel().getProperty( path + '/id' );
        this.getRouter().navTo('user', {
          id: id
        });
        this.getModel().checkUpdate('/users');
      });
    },

    onCancel: function() {
      this.getModel().cancelChanges( this.getView().getElementBinding().getPath() );
    },
  });
});
