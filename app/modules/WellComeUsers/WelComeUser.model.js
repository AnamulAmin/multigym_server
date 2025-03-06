import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const WelcomeUserSchema = new Schema({
  visitorName: {
    type: String,
    required: true,
  },
  visitorMobile: {
    type: String,
    required: true,
  },
  visitorEmail: {
    type: String,
    required: false,  
  },
  visitorPicture: {
    type: String,
    required: false,
  },
  branch: {
    type: String,
    required: true,
  },
  visit_date: {  
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

const WelcomeUser = model('welcomeusers', WelcomeUserSchema);

export default WelcomeUser;
