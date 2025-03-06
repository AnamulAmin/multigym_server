function convertValuesToDataType(obj) {
  const convertedObj = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      let value = obj[key];

      // Determine the data type based on the value
      if ( value === true || value === false) {
        convertedObj[key] = "boolean";
        console.log()
      }
      else
      if (value === null) {
        convertedObj[key] = "null";
      } else if (!isNaN(value) && value !== "") {
        convertedObj[key] = "number";
      }
       else if (
        new Date(value).toString() !== "Invalid Date" &&
        typeof value === "string"
      ) {
        convertedObj[key] = "date";
      }
      else if (Array.isArray(value)) {
        convertedObj[key] = "array";
      } else if (typeof value === "object") {
        // Recursively convert nested objects
        convertedObj[key] = convertValuesToDataType(value);
      } else {
        convertedObj[key] = "string";
      }
    }
  }

  return convertedObj;
}

export default convertValuesToDataType;
