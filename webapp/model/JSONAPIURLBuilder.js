sap.ui.define([], function()
{
  function JSONAPIURLBuilder( model, path ) {
    this.path = path;
    this.url = model.getRequestUrl( path );
    this.params = {};
  };

  $.extend( JSONAPIURLBuilder.prototype, {

    top: function( top ) {
      if ( !isNaN( +top ) )
        this.params[ 'page[limit]' ] = +top;
      return this;
    },

    skip: function( skip ) {
      if ( !isNaN( +skip ) )
        this.params[ 'page[offset]' ] = +skip;
      return this;
    },

    filter: function( filters ) {
      if ( filters ) {
        var filterStr = "";
        if ( filterStr ) this.params.filter = filterStr;
      }
      return this;
    },

    sort: function( sorters ) {
      if ( sorters ) {
        var sorterStr = sorters.filter( sorter => !sorter.fnComparator ).map( sorter => sorter.bDescending ? '-' + sorter.sPath : sorter.sPath ).join( ',' ) || null;
        if ( sorterStr ) this.params.sort = sorterStr;
      }
      return this;
    },

    include: function( expands ) {
      if ( expands ) {
        var expandStr = expands.join( ',' );
        if ( expandStr ) this.params.include = expandStr;
      }
      return this;
    },

    select: function( selects ) {
      if ( selects ) {
        selects.forEach( select => {
          this.params[ 'fields[' + select +  ']' ] = true;
        });
      }
      return this;
    },

    toString: function() {
      var paramStr = $.param( this.params );
      if ( paramStr ) paramStr = '?' + paramStr;
      return this.url + paramStr;
    },


  });


  return JSONAPIURLBuilder;
}, true);
