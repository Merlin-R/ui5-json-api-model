sap.ui.define([
  "sap/ui/model/json/JSONModel"
], function( JSONModel ) {

  var defaults = {
    autoConnect:    true,
    autoReconnect:  false,
    protocol:       ""
  };

  var WebSocketModel = JSONModel.extend("me.reichwald.model.ws.WebSocketModel",
  {
    constructor: function( settings ) {
      if ( typeof settings === 'string' ) settings = { url: settings };
      $.extend( this, defaults, settings );
      if ( this.connect )
        this.connect();
    },

    connect: function() {
      var ws = this.ws = new WebSocket( this.settings.url, this.settings.protocol );
      ws.onopen     = this.onOpen.bind( this );
      ws.onmessage  = this.onMessage.bind( this );
      ws.onerror    = this.onError.bind( this );
      ws.onclose    = this.onClose.bind( this );
    },

    onOpen:     function() {},
    onMessage: function( message ) {
      var content = JSON.parse( message );
      this.setProperty( content.path, content.data, undefined );
    },
    onError:    function() {},
    onClose:    function() {
      if ( this.autoReconnect )
        this.connect();
    },

    create: function( path, data ) {
      this.ws.send( JSON.stringify({ action: "create", path: path, data: data }) );
    },

    read: function( path ) {
      this.ws.send( JSON.stringify({ action: "read",   path: path }) );
    },

    update: function( path, data ) {
      this.ws.send( JSON.stringify({ action: "update", path: path, data: data }) );
    },

    delete: function( path ) {
      this.ws.send( JSON.stringify({ action: "delete", path: path }) );
    },


  })


});
