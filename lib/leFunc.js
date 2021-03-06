(function(){
  var
    // Custom data types - will only check here if type is object
    dataTypes = {}

    // Holds mappings to actual data types
  , shortHands = {
      s: "string"
    , b: "boolean"
    , n: "number"
    , o: "object"
    , u: "undefined"
    , r: "regexp"
    , a: "array"
    , f: "function"
    , d: "date"
    }

  , getDataTypeName = function(value){
      for (var type in dataTypes){
        if (value instanceof dataTypes[type]) return type;
      }
      return "object";
    }

  , getType = function(value){
      var type = Object.prototype.toString.call(value).toLowerCase();
      return type.substring(8, type.length -1);
    }

    // Returns the data type checking function
  , leFunc = function(functions, bindTo){
      var
        functionList = {} // - Holds the various types of functions
      , types             // - String of all arg types
      , typesArray        // - Array of all arg types
      , i                 // - Index for array of all arg types
      , type              // - typesArray[i]
      , key               // - Constructed key/index for the functionList
      , custom = false    // - Indicates whether or not this function uses a custom
                          //   data type so we can skip the instanceof checks
      ;
      // Create the possible function list lowercasing all arg types
      for (types in functions){
        // Get the types in a workable format
        typesArray = types.split(',');
        key = "";
        // Go through each type and construct the key
        for (i = 0; i < typesArray.length; i++){
          type = typesArray[i];
          // Check to see if we're using a custom data type
          if (!custom && dataTypes.hasOwnProperty(type)) custom = true;
          // Use the shortHand mapping if available
          key += shortHands.hasOwnProperty(type) ? shortHands[type] : type.toLowerCase();
        }

        functionList[key] = functions[types];
      }

      // Return a function that finds the correct function in the functionList
      return function(){
        // Create a key based on the arguments data types that will match
        // A function list key
        var key = "", i  = 0, type, arg;
        for (; i < arguments.length; i++){
          arg = arguments[i];
          type = getType(arg);

          // If it's an object, it might be a custom data type
          if (type === "object" && custom) type = getDataTypeName(arg);
          // Append the type
          key += type;
        }

        // Couldn't find a matching function
        if (!functionList.hasOwnProperty(key)){
          // Just use the default fallback function then
          if (functionList.hasOwnProperty('default'))
            return functionList.default.apply(bindTo || {}, arguments);
          else throw new Error("The function of type " + key + " is undefined");
        }
        return functionList[key].apply(bindTo || {}, arguments);
      };
    }
  ;

  leFunc.config = function(configuration){
    // Setup data types
    for (var key in configuration.dataTypes){
      dataTypes[key.toLowerCase()] = configuration.dataTypes[key];
    }

    // Setup shorthands
    for (var key in configuration.shortHands){
      shortHands[key.toLowerCase()] = configuration.shortHands[key];
    }
  };

  if (typeof module !== "undefined") module.exports.leFunc = leFunc;
  else if (typeof define !== "undefined") define('leFunc', function(){ return leFunc });
  else window.leFunc = leFunc;
})();