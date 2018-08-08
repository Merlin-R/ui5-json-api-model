sap.ui.define( ["sap/ui/model/Filter"], function( Filter ){
  function Filters() {};

  Filters.searchFields = function( fields, query, mode ) {
    if ( !mode ) mode = 'Contains';
    words = query.split(/\s/g);
    return new Filter({
      filters: words.map( function( word ) {
        return Filters.oneFieldMatches( fields, word, mode );
      }),
      and: true
    });
  };

  Filters.oneFieldMatches = function( fields, query, mode ) {
    if ( !mode ) mode = 'EQ';
    return new Filter({
      filters: fields.map( function( field ) {
        return new Filter( field, mode, query );
      }),
      and: false
    });
  };

  Filters.allFieldsMatch = function( fields, query, mode ) {
    if ( !mode ) mode = 'EQ';
    return new Filter({
      filters: fields.map( function( field ) {
        return new Filter( field, mode, query );
      }),
      and: true
    });
  };


  return Filters;
}, true)
