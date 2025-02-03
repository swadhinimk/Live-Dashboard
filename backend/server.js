const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/college', { 
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

const departmentSchema = new mongoose.Schema({
  name: String,
  numberOfStudents: Number,
  numberOfFaculty: Number,
});

const Department = mongoose.model('Department', departmentSchema);

app.get('/api/departments', async (req, res) => {
  try {
    const departments = await Department.find();
    res.json(departments);
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
});

app.post('/api/departments', async (req, res) => {
  const { name, numberOfStudents, numberOfFaculty } = req.body;

  try {
    let department = await Department.findOne({ name });
    if (department) {
      return res.status(400).json({ message: 'Department already exists' });
    }

    department = new Department({ name, numberOfStudents, numberOfFaculty });
    await department.save();
    res.status(201).json(department);
  } catch (error) {
    console.error('Error adding department:', error);
    res.status(500).json({ error: 'Failed to add department' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
