import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const { Schema } = mongoose;
const departmentSchema = new Schema({
  title: {
    type: String,
    required: [true, 'department must have title'],
  },
  description: {
    type: String,
    required: [true, 'department must have description'],
  },
  location: {
      type: String,
      required: [true, 'department must have location'],
    },
  employees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  }],
  parent_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      default: null
    },
});
departmentSchema.plugin(mongoosePaginate);
export default mongoose.model('Department', departmentSchema);
