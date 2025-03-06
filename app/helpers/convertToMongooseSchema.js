import mongoose from "mongoose";

function convertToMongooseSchema(convertedObj) {
  const schemaDefinition = {};

  for (const key in convertedObj) {
    if (convertedObj.hasOwnProperty(key)) {
      const type = convertedObj[key];

      // Determine Mongoose schema type based on data type
      switch (type) {
        case "boolean":
          schemaDefinition[key] = { type: Boolean };
          break;
        case "number":
          schemaDefinition[key] = { type: Number };
          break;
        case "string":
          schemaDefinition[key] = { type: String };
          break;
        case "date":
          schemaDefinition[key] = { type: Date };
          break;
        case "array":
          schemaDefinition[key] = { type: Array }; // You can customize the array item type if needed
          break;
        case "object":
          schemaDefinition[key] = { type: Object }; // Generic object, can be made more specific if required
          break;
        case "null":
          schemaDefinition[key] = {
            type: mongoose.Schema.Types.Mixed,
            default: null,
          };
          break;
        default:
          schemaDefinition[key] = { type: mongoose.Schema.Types.Mixed };
      }
    }
  }

  // Create a new Mongoose schema using the dynamically generated schema definition
  return new mongoose.Schema(schemaDefinition);
}

export default convertToMongooseSchema;
