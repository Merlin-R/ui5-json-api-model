sap.ui.define([
  'sap/ui/model/Context',
  'sap/ui/model/ChangeReason',
  'sap/ui/model/PropertyBinding'
], function( Context, ChangeReason, PropertyBinding )
{
  var JSONAPIPropertyBinding = PropertyBinding.extend("me.reichwald.model.jsonapi.JSONAPIPropertyBinding",
  {
    constructor: function( model, path, context, params ) {
      PropertyBinding.apply( this, arguments );
      this.initial = true;
      this.settings = {
        model: model,
        path: path,
        context: context,
        params: params
      };
      this.value = this._getValue();
    },

    getValue: function() {
      return this.value;
    },

    _getValue: function() {
      return this.settings.model.getProperty( this.settings.path, this.settings.context );
    }
  });
  return JSONAPIPropertyBinding;
});
