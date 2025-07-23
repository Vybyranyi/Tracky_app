import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  // id: Number,
  projectId: String,
  title: String,
  taskCreated: String,
  duoDate: String,
  status: String,
  description: String,
  userId: String,
});

export default mongoose.model('Task', taskSchema);