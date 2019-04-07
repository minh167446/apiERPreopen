import mongoose from 'mongoose';

const { Schema } = mongoose;
const employeeSchema = new Schema({
  fullname: {
    type: String,
    required: [true, 'Employee must have full name!'],
  },
  email: {
    type: String,
    required: [true, 'Employee must real, we will mail password for you!'],
  },
  password: {
    type: String
  },
  phone: {
    type: String,
    required: [true, 'Employee must have phone!']
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  },
  position: {
    type: String,
    required: [true, 'Employee must enter his position!']
  },
  salary: {
    type: String
  },
  hired_at: {
    type: Date,
    default: Date.now
  },
   identify: [{
    tax_number: String,
    ID: String,
    place_ID: String,
    date_ID: String
  }],
  departments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
    },
  ],
  user_create: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});
export default mongoose.model('Employee', employeeSchema);
