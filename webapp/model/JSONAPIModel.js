sap.ui.define([
  "sap/ui/model/Model",
  "./JSONAPIContextBinding",
  "./JSONAPIListBinding",
  "./JSONAPIPropertyBinding",
  "./JSONAPIURLBuilder",
], function( Model, ContextBinding, ListBinding, PropertyBinding, URLBuilder )
{
  function nextId()
  {
    return Date.now().toString(16).padStart(16,'0')
         + (nextId.counter++&0xFFFFFFFF).toString(16).padStart(8,'0')
         + (Math.random()*0xFFFF&0xFFFF).toString(16).padStart(4,'0')
         + (Math.random()*0xFFFF&0xFFFF).toString(16).padStart(4,'0');
  }
  nextId.counter = 0;

  var JSONAPIModel = Model.extend("me.reichwald.model.jsonapi.JSONAPIModel", {

    constructor: function( settings, schema ) {
      Model.apply( this, arguments );
      this.settings = typeof settings === 'string' ? { url: settings, schema: schema || {}, schemaPath: "/schema/" } : settings;
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

    createBindingContext: function( path, context, params, callback, reload ) {
      if ( !callback ) callback = () => null;
      var base = this.resolve( path, context );
      if ( !base ) {
        callback( null );
        return null;
      }
      var canonical = this.resolve( path, context, true );
      if ( !reload ) {
        var cxt = this.getContext( canonical );
        callback( cxt );
        return cxt;
      } else {
        this.getList( path, context ).then( data => {
          var path = '/' + data.type + '/' + data.id;
          var cxt = this.getContext( path );
          callback( cxt );
        })
      }
    },


    readList: function( path, context, top, skip, sorters, filters, expands, selects ) {
      var url = this.buildRequestUrl( path, context, top, skip, sorters, filters, expands, selects );
      return $.ajax({ method: 'GET', url: url, headers: { 'Content-Type': 'application/vnd.api+json' } }).then( this.processList.bind( this ) );
    },

    readOne: function( path, context, expands, selects ) {
      var url = this.buildRequestUrl( path, context, null, null, null, null, expands, selects );
      return $.ajax({ method: 'GET', url: url, headers: { 'Content-Type': 'application/vnd.api+json' } }).then( this.processElement.bind( this ) );
    },

    createOne: function( path, context, data ) {
      var url = this.buildRequestUrl( path, context );
      return $.ajax({ method: 'POST', url: url, headers: { 'Content-Type': 'application/vnd.api+json' }, data: this.prepareCreate( path, context, data ) }).then( this.processElement.bind( this ) );
    },

    deleteOne: function( path, context ) {
      var url = this.buildRequestUrl( path, context );
      return $.ajax({ method: 'DELETE', url: url, headers: { 'Content-Type': 'application/vnd.api+json' } }).then( () => this.setProperty( path, undefined, context ) );
    },

    prepareCreate: function( path, context, data ) {
      var copy = $.extend({}, data);
      Object.keys( copy ).filter( key => key.indexOf('__') === 0 ).forEach( key => delete copy[ key ] );
      delete copy.id;
      return JSON.stringify({
        data: copy
      });
    },

    getProperty: function( path, context ) {
      var base = this.resolve( path, context );
      if ( !base ) return;
      try {
        return base.substr( 1 ).split( '/' ).reduce( ( leaf, key ) => leaf[ key ], this.oData );
      } catch ( e ) { return undefined; }
    },

    setProperty: function( path, value, context ) {
      var base = this.resolve( path, context );
      var parts = base.substr( 1 ).split( '/' );
      var leaf  = parts.pop();
      var parent = parts.reduce( ( leaf, key ) => leaf[ key ], this.oData );
      parent[ leaf ] = value;
      parent = parts.reduce( (leaf, key) => leaf[ key ] || (leaf[ key ] = {}), this.pending );
      parent[ leaf ] = value;
      this.firePropertyChange({
        reason: "Binding",
        path: path,
        context: null,
        value: value
      });
      this.checkUpdate( path, context );
      return this;
    },

    migrateBindings: function( path, context, data ) {
      var base = this.resolve( path, context );
      this.aBindings.forEach( binding => {
        if ( path === binding.sPath && !binding.oContext ) {
          binding.sPath = '/' + data.type + '/' + data.id;
          binding.refresh();
        } else if ( context && binding.oContext && context.sPath === binding.oContext.sPath ) {
          binding.oContext.sPath = '/' + data.type + '/' + data.id;
          binding.refresh();
        }
      })
    },

    checkUpdate: function( path, context ) {
      var base = this.resolve( path, context );
      this.aBindings.forEach( binding => { try {
        if ( base === this.resolve( binding.sPath, binding.oContext ) )
          binding.refresh();
        } catch (e) {}
      });
    },

    processList: function( data ) {
      var meta  = data.meta;
      var array = data.data.map( this.processElement.bind( this ) );
      array.meta = meta;
      return array;
    },

    processElement: function( data )
    {
      if ( data.data ) data = data.data;
      var id   = data.id;
      var type = data.type;
      var meta = data.meta;
      var atts = data.attributes;
      var rels = Object.keys( data.relationships ).map( key => ({ key: key, value: this.processList( data.relationships[ key ] ) }) ).reduce( (rels,entry) => {
        rels[ entry.key ] = entry.value;
        return rels;
      }, {});
      var result = {
        ...data,
        id: id,
        type: type,
        meta: meta,
        res: data
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

    createNewId: function( type ) {
      var id = ':new:' + nextId();
      if ( !this.oData[ type ]   ) this.oData[ type ] = {};
      if ( !this.pending[ type ] ) this.pending[ type ] = {};
      this.oData[ type ][ id ] = this.pending[ type ][ id ] = { id: id, __new: true, type: type, attributes: {}, relationships: {} };
      return id;
    },

    getRequestUrl: function( path ) {
      return this.getBaseUrl() + path;
    },

    getBaseUrl: function() {
      return (this.settings.url || '.').replace(/\/$/, "");
    },

    saveChanges: function( path, context ) {
      var base = this.resolve( path, context ) || '/';
      var toSave = base.substr(1).split('/').reduce( (root, key) => key !== "" ? root[ key ] : root, this.pending );
      if ( toSave.id === undefined )
        return Promise.all( Object.keys( toSave )
          .filter( key => key.indexOf('__') !== 0 )
          .map( key => this.saveChanges( base + '/' + key, toSave[ key ] ) ) );
      else if ( toSave.__new ) {
        var parent = path.substr(0,path.length - toSave.id.length - 1);
        delete (parent.substr(1).split('/').reduce( (root, key) => root[ key ], this.pending ))[toSave.id];
        return this.createOne( path.substr(0,path.length - toSave.id.length - 1), context, toSave )
          .then( data => {
            this.migrateBindings( path, context, data );
            this.setProperty( path, undefined, context );
          });
      }

    },

    cancelChanges: function( path, context ) {
      
    }

  });

  return JSONAPIModel;
});
