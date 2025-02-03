import React, { useEffect, useState } from 'react';
import { PieChart, Pie, BarChart, Bar, Tooltip, Cell, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import axios from 'axios';
import './Dashboard.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6699'];

export const Dashboard = () => {
  const [data, setData] = useState([]);
  const [facultyData, setFacultyData] = useState([]);
  const [newDepartment, setNewDepartment] = useState({
    name: '',
    numberOfStudents: '',
    numberOfFaculty: '',
  });
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/departments');
        console.log('Fetched data:', response.data);
        setData(response.data);

        const facultyChartData = response.data.map(dep => ({
          name: dep.name,
          numberOfFaculty: dep.numberOfFaculty || 0,
        }));
        setFacultyData(facultyChartData);
      } catch (error) {
        console.error('Error fetching department data:', error);
      }
    };

    fetchData();
  }, []);

  const handleAddDepartment = async e => {
    e.preventDefault();

    if (!newDepartment.name || !newDepartment.numberOfStudents || !newDepartment.numberOfFaculty) {
      setErrorMessage('Please fill out all fields.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/departments', newDepartment);
      setData([...data, response.data]);

      const newFacultyData = [
        ...facultyData,
        { name: response.data.name, numberOfFaculty: response.data.numberOfFaculty },
      ];
      setFacultyData(newFacultyData);

      setNewDepartment({ name: '', numberOfStudents: '', numberOfFaculty: '' });
      setErrorMessage('');
    } catch (error) {
      console.error('Error adding department:', error);
      setErrorMessage('Failed to add department. Department might already exist.');
    }
  };

  const handleInputChange = e => {
    setNewDepartment({
      ...newDepartment,
      [e.target.name]: e.target.value,
    });
  };

  const generateLegendColors = () => {
    return data.map((dep, index) => ({
      name: dep.name,
      color: COLORS[index % COLORS.length],
    }));
  };

  const legendColors = generateLegendColors();

  return (
    <div className="dashboard-container">
      <div className="charts-container">
        <div className="chart-wrapper">
          <h3 className="chart-title">Students Distribution</h3>
          <PieChart width={600} height={400} className="pie-chart">
            <Pie
              data={data}
              cx={300}
              cy={200}
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={120}
              fill="#8884d8"
              dataKey="numberOfStudents"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

        <div className="chart-wrapper">
          <h3 className="chart-title">Faculty Distribution</h3>
          <PieChart width={600} height={400} className="pie-chart">
            <Pie
              data={facultyData}
              cx={300}
              cy={200}
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={120}
              fill="#82ca9d"
              dataKey="numberOfFaculty"
            >
              {facultyData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
      </div>

      {/* Legend Container */}
      <div className="legend-container">
        {legendColors.map((legend, index) => (
          <div className="legend-item" key={`legend-${index}`}>
            <div className="legend-color" style={{ backgroundColor: legend.color }} />
            <div className="legend-label">{legend.name}</div>
          </div>
        ))}
      </div>
      <div className="charts">
      {/* Add Department Form */}
      <div className="p">
      <form className="department-form" onSubmit={handleAddDepartment}>
        <div className="form-group">
          <label htmlFor="name">Department Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={newDepartment.name}
            onChange={handleInputChange}
            className="form-input"
            placeholder="Enter department name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="numberOfStudents">Number of Students</label>
          <input
            type="number"
            id="numberOfStudents"
            name="numberOfStudents"
            value={newDepartment.numberOfStudents}
            onChange={handleInputChange}
            className="form-input"
            placeholder="Enter number of students"
          />
        </div>
        <div className="form-group">
          <label htmlFor="numberOfFaculty">Number of Faculty</label>
          <input
            type="number"
            id="numberOfFaculty"
            name="numberOfFaculty"
            value={newDepartment.numberOfFaculty}
            onChange={handleInputChange}
            className="form-input"
            placeholder="Enter number of faculty"
          />
        </div>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <button type="submit" className="form-submit-btn">
          Add Department
        </button>
      </form>
      </div>

      {/* Bar Chart for Department Data */}
      <div className="bar-chart-container">
        <h3 className="chart-title">Department Data</h3>
        <BarChart width={600} height={400} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="numberOfStudents" fill="#8884d8" />
          <Bar dataKey="numberOfFaculty" fill="#82ca9d" />
        </BarChart>
      </div>
    </div>
    </div>
  );
};

export default Dashboard;
