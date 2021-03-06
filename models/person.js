// eslint-disable-next-line @typescript-eslint/no-var-requires
const mongoose = require("mongoose");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const uniqueValidator = require("mongoose-unique-validator");

// eslint-disable-next-line no-undef
const url = process.env.MONGODB_URI;

mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const personSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, minLength: 3 },
  number: { type: String, required: true, minLength: 8 },
});

personSchema.plugin(uniqueValidator, {
  message: "Error, expected {PATH} to be unique.",
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
