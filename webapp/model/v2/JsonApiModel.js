sap.ui.define([
  "sap/ui/model/json/JSONModel",
  "../JSONAPIURLBuilder",
], function( JSONModel, URLBuilder )
{
  var Constants = {
    ID_NEW = ':new:',
  };

  function nextId()
  {
    return Date.now().toString(16).padStart(12,'0')
         + (nextId.counter++&0xFF).toString(16).padStart(2,'0')
         + (Math.random()*0xFF&0xFF).toString(16).padStart(2,'0');
  }
  nextId.counter = 0;

  var JsonApiModel = JSONModel.extend("me.reichwald.model.jsonapi.v2.JsonApiModel",
  {
    constructor: function( settings ) {
      JSONModel.apply( this );
      this.settings = typeof settings === 'string' ? { url: settings } : settings;
      this.pending = {};
    },

    bindList: function( path, context, sorters, filters, params ) {
      var binding = JSONModel.prototype.bindList.apply( this, arguments );
      var absPath = this.resolve( path, context );
      if ( this._oData[])
      return binding;
    },

    readList: function( path, context, top, skip, sorters, filters, expands, selects ) {
      var url = this.buildRequestUrl( path, context, top, skip, sorters, filters, expands, selects );
      return $.ajax({ method: 'GET', url: url, headers: { 'Content-Type': 'application/vnd.api+json' } }).then( this.processList.bind( this ) );
    },

    readOne: function( path, context, expands, selects ) {
      var url = this.buildRequestUrl( path, context, null, null, null, null, expands, selects );
      return $.ajax({ method: 'GET', url: url, headers: { 'Content-Type': 'application/vnd.api+json' } }).then( this.processElement.bind( this ) );
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
      if ( !this.oData[ type ] )        this.oData[ type ] = {};
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

    createNewId: function() {
      return Constants.ID_NEW + nextId();
    },

    createNewEntry: function( data ) {
      var id = this.createNewId( type );
      if ( !this.oData[ type ]   ) this.oData[ type ] = {};
      if ( !this.pending[ type ] ) this.pending[ type ] = {};
      return this.oData[ type ][ id ] = this.pending[ type ][ id ] = $.extend({}, data, { __id: id, id: id, __new: true });
    }


  });
});
