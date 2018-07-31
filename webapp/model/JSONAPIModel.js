sap.ui.define([
  "sap/ui/model/Model",
  "sap/ui/model/ContextBinding",
  "./JSONAPIListBinding",
  "./JSONAPIPropertyBinding",
  "./JSONAPIURLBuilder",
], function( Model, ContextBinding, ListBinding, PropertyBinding, URLBuilder )
{

  var JSONAPIModel = Model.extend("me.reichwald.model.jsonapi.JSONAPIModel", {

    constructor: function( settings ) {
      Model.apply( this, arguments );
      this.settings = typeof settings === 'string' ? { url: settings } : settings;
      this.pending = {};
    },

    bindList: function( path, context, sorters, filters, params ) {
      return new ListBinding( this, path, context, sorters, filters, params );
    },

    bindProperty: function( path, context, params ) {
      return new PropertyBinding( this, path, context, params );
    },

    bindContext: function( path, context, params ) {
      return new ContextBinding( this, path, context, params );
    },

    getList: function( path, context, top, skip, sorters, filters, expands, selects ) {
      var url = this.buildRequestUrl( path, context, top, skip, sorters, filters, expands, selects );
      return $.ajax({ method: 'GET', url: url, headers: { 'Content-Type': 'application/vnd.api+json' } }).then( this.processList.bind( this ) );
    },

    getProperty: function( path, context ) {
      var base = this.resolve( path, context );
      if ( !base ) return;
      return base.substr( 1 ).split( '/' ).reduce( ( leaf, key ) => leaf[ key ], this.oData );
    },

    processList: function( data ) {
      var meta  = data.meta;
      var array = data.data.map( this.processElement.bind( this ) );
      array.meta = meta;
      return array;
    },

    processElement: function( data )
    {
      var id   = data.id;
      var type = data.type;
      var meta = data.meta;
      var atts = data.attributes;
      var rels = Object.keys( data.relationships ).map( key => ({ key: key, value: this.processList( data.relationships[ key ] ) }) ).reduce( (rels,entry) => {
        rels[ entry.key ] = entry.value;
        return rels;
      }, {});
      var result = {
        ...atts,
        ...rels,
        id: id,
        __id: id,
        __type: type,
        __meta: meta,
        __res: data
      };
      this.storeElement( type, id, result );
      return result;
    },

    storeElement: function( type, id, result ) {
      if ( !this.oData[ type ] ) this.oData[ type ] = {};
      if ( !this.oData[ type ][ id ] ) this.oData[ type ][ id ] = result;
      else $.extend( this.oData[ type ][ id ], result );
    },

    storeList: function( type, results ) {
      if ( !this.oData[ type ] ) this.oData[ type ] = {};
      if ( !this.oData[ type ].__list ) this.oData[ type ].__list = result;
      else $.extend( this.oData[ type ].__list, result );
    },

    buildRequestUrl: function( path, context, top, skip, sorters, filters, expands, selects ) {
      return (new URLBuilder( this, this.resolve( path, context ) ))
        .top( top ).skip( skip )
        .sort( sorters )
        .filter( filters )
        .include( expands )
        .select( selects )
        .toString();
    },

    getRequestUrl: function( path ) {
      return this.getBaseUrl() + path;
    },

    getBaseUrl: function() {
      return (this.settings.url || '.').replace(/\/$/, "");
    },

  });

  return JSONAPIModel;
});
