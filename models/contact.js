import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ContactSchema = new Schema({
  name: {
    type: String,
    required: [true, "name is required."],
  },
  address: {
    type: String,
    required: [true, "address is required."],
  },
  email: {
    type: String,
    required: [true, "email is required."],
  },

  phone: {
    type: Number,
    required: [true, "phone number is required."],
  },
  postedBy : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "User",
  },
});


export default mongoose.model('Contact', ContactSchema);