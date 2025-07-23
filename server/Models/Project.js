import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  // id: Number,
  title: String,
  img: String,
  subtitle: String,
  deadline: String,
  people: Number,
  desc: String,
  managerId: String,
});

export default mongoose.model('Project', projectSchema);