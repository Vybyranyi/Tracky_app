import mongoose from 'mongoose';

const teamMemberSchema = new mongoose.Schema({
  // id: Number,
  name: String,
  job: String,
  desc: String,
  taskCount: Number,
  rating: Number,
  reviews: Number,
  role: String,
  img: String,
});

export default mongoose.model('TeamMember', teamMemberSchema);