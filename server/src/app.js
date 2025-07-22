import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Task from '../Models/Task.js';
import Project from '../Models/Project.js';
import TeamMember from '../Models/Team.js';
import mongoose from 'mongoose';

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://marianEduCnu:5tnghL64l4Vj5uei@cluster0.rqclvuf.mongodb.net/tracky?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const students = [];

const users = [{ username: 'admin', password: '$2b$10$EBsUXWo2pWNjXFOJehnXcuLZzg/UYx5u3VwZRFyeLbjYXbvPuRJNK' }]
const SECRET_KEY = 'hillel_fullstack';

app.post('/signin', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(usr => usr.username === username);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '30min' });

  res.json({ token });
});

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.sendStatus(401);
  }

  const token = authHeader.split(' ')[1];
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.sendStatus(403);
    }
    next();
  });
}

// Endpoints for Tasks
app.get('/api/tasks', authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoints for Projects
app.get('/api/projects', authMiddleware, async (req, res) => {
  try {
    const projects = await Project.find();

    const projectsByCategory = projects.reduce((acc, project) => {
      const category = project.category || 'newProj';
      if (!acc[category]) acc[category] = [];
      acc[category].push(project);
      return acc;
    }, {});

    res.json(projectsByCategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/projects', authMiddleware, async (req, res) => {
  try {
    const newProject = new Project(req.body);
    await newProject.save();
    res.status(201).json(newProject);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/projects/:id', authMiddleware, async (req, res) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedProject);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/projects/:id', authMiddleware, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/team', authMiddleware, async (req, res) => {
  try {
    const team = await TeamMember.find();
    res.json(team);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server ready on :${PORT}`));
