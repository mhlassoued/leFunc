# leFunc

leFunc is way to overload functions in Javascript.

Typically, if you have optional arguments or you're uncertain about parameter types and order coming into a function, you might do something like this:

    function getItems(groupId, options, callback){
      if (typeof options == "function"){
        callback = options;
        options = {};
      }
      // Do some work with the corrected parameters
    }

A fairly trivial example, but we do this a lot. Other languages provide more flexible options like function overloading. So you can do stuff like this:

    function getItems(groupId, callback){
      // Do some work with the corrected parameters
    }
    function getItems(groupId, options, callback){
      // Do some work with the corrected parameters
    }

leFunc allows you to do this.

## Examples
    function _getItems(groupId, options, callback){
      // Do some work with the corrected parameters
    }
    // Define function getItems(string groupId, function callback) to window
    leFunc("getItems", ["String", "Function"], function(groupId, callback){
      // Maybe since we know that were not getting the options variable
      // We might want to do some extra work
      console.log("This is the TWO parameter function!");
      _getItems(groupId, {}, callback);
    });
    // Define function getItems(string groupId, function callback) to window
    leFunc("getItems", ["String", "Object", "Function"], function(groupId, options, callback){
      console.log("This is the THREE parameter function")
      _getItems(groupId, options, callback);
    });

    // Call the function how you want to know
    getItems("4f3ae2e3c3e54c2b90000072", function(error, result){});
    // output: This is the TWO parameter function!
    getItems("4f3ae2e3c3e54c2b90000072", {date: {$lt: new Date()}} function(error, result){});
    // output: This is the THREE parameter function!

    // Pass in an object to leFunc and it will bind your definition to that object
    var x = "what what?";
    (function(){
      // Some really important scope!
      // ...
      var x = "weeeee";
      leFunc("something", this, function(){
        console.log(x);
      });
    })();

You can define as many overloads as you want with as many combinations of types as you want.