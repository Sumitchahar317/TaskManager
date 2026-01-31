const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();
const Task = require('./models/tasks');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Atlas Connected...');
  } catch (err) {
    console.error('Database connection error:', err.message);
    process.exit(1);
  }
};

// home routee
app.get('/', (req, res) => {
  res.redirect("/tasks");
});

//all tasks
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.render('index.ejs', { tasks });
  } catch (err) {
    res.status(500).send("Error fetching tasks: " + err.message);
  }
});

// new task
app.get('/tasks/new', (req, res) => {
  res.render("new.ejs");
});

app.post('/tasks', async (req, res) => {
  try {
    const { title, description, status } = req.body;
    const newTask = new Task({
      title,
      description,
      status,
    });
    const savedTask = await newTask.save();
    res.redirect('/tasks');
  } catch (err) {
    res.send("Data (Task) is not saved :", err.message);
  }

});

//delete task 
app.post('/tasks/:id', async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    res.redirect('/tasks');
  } catch (err) {
    res.status(500).json({ message: "Error deleting task", error: err.message });
  }
})


connectDB().then(() => {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  })
});
