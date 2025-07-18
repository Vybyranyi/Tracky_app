import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  id: Number,
  projectId: Number,
  tick: Boolean,
  title: String,
  taskCreated: String,
  duoDate: String,
  status: String,
  description: String,
  userId: Number,
});

export default mongoose.model('Task', taskSchema);