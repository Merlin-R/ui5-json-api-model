sap.ui.define([], function(){

  function Functions() {};

  var bind  = Function.prototype.bind;
  var apply = Function.prototype.apply;
  var call  = Function.prototype.call;
  var dNow  = Date.now.bind( Date );

  Functions.debounce = function( ms, fn ) {
    var res, now, last = 0;
    return function() {
      now = dNow();
      if ( last >= now - ms ) return res;
      last = now;
      return res = fn.apply( this, arguments );
    };
  };

  Functions.debounceEnd = function( ms, fn ) {
    var res, now, last = 0;
    return function() {
      now = dNow();
      if ( now <= last ) return res;
      setTimeout( bind.apply( function(){
        res = fn.apply( this, arguments );
        last = dNow();
      }, [ this ].concat( arguments ) ), ms );
      return res;
    };
  };

  Functions.delay = function( ms, fn ) {
    var newFn = function() {
      var bound = fn.bind( this, arguments );
      return new Promise( function(resolve, reject) {
        newFn._reject = reject;
        newFn.tId = setTimeout( function(){
          newFn._reject = null;
          resolve( bound() );
        }, ms );
      });
    };
    newFn.cancel = function() {
      if ( newFn.tId !== undefined )
        clearTimeout( newFn.tId );
      newFn.tId = undefined;
      if ( newFn._reject )
        newFn._reject( "Cancelled" );
    };
    return newFn;
  };

  Functions.schedule = function( date, fn ) {
    var delay = date - dNow();
    return new Promise( function(resolve) {
      setTimeout( function(){
        resolve( fn() );
      }, delay < 0 ? 0 : delay );
    });
  };









  return Functions;

}, true)
