import React, { useState, useEffect } from "react";
import axios from "axios";
import "./index.css";
import SearchImg from "./img/search.png";

const ToDoList = () => {
  const [data, setData] = useState([]);
  const [editTask, setEditTask] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "pending",
    dueDate: "",
  });
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // for search by title

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:9090/task");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchFilteredTasks = async () => {
    try {
      if (startDate && endDate) {
        const response = await axios.get(
          `http://localhost:9090/task/by-date?startDate=${startDate}&endDate=${endDate}`
        );
        setData(response.data);
      } else {
        fetchTasks();
      }
    } catch (error) {
      console.error("Error filtering tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    if (name === "startDate") {
      setStartDate(value);
    } else if (name === "endDate") {
      setEndDate(value);
    }
  };



  const addTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:9090/task", form);
      setForm({ title: "", description: "", status: "pending", dueDate: "" });
      fetchTasks();
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const updateTask = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:9090/task/update/${editTask.id}`, form);
      setForm({ title: "", description: "", status: "pending", dueDate: "" });
      setEditTask(null);
      fetchTasks();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:9090/task/delete/${id}`);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleEdit = (task) => {
    setEditTask(task);
    setForm({
      title: task.title,
      description: task.description,
      status: task.status,
      dueDate: task.dueDate,
    });
  };

  const filterTasks = data.filter((task)=> 
    task.title.toLowarCase().includes(searchQuery.toLowarCase())
  );

  return (
    <div className="todo-container">
      <header className="navbar">
        <h1 className="navbar-title">To-Do List</h1>
        <div className="search-filter-task">
          <input
            type="text"
            placeholder="Search by title"
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
          />
          <img src={SearchImg} alt="search" onClick={handleSearchChange} className="search-icon" />
        </div>
        <div className="date-filter">
          <input
            type="date"
            name="startDate"
            value={startDate}
            onChange={handleDateRangeChange}
            className="date-input"
          />
          <input
            type="date"
            name="endDate"
            value={endDate}
            onChange={handleDateRangeChange}
            className="date-input"
          />
          <button onClick={fetchFilteredTasks} className="filter-button">
            Filter Tasks
          </button>
        </div>
      </header>

      <form onSubmit={editTask ? updateTask : addTask} className="task-form">
        <h2 className="form-heading">
          {editTask ? "Edit Task" : "Add New Task"}
        </h2>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={form.title}
          onChange={handleFormChange}
          required
        />
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleFormChange}
          required
        ></textarea>
        <label htmlFor="status">Status</label>
        <select
          id="status"
          name="status"
          value={form.status}
          onChange={handleFormChange}
          required
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <label htmlFor="dueDate">Due Date</label>
        <input
          type="date"
          id="dueDate"
          name="dueDate"
          value={form.dueDate}
          onChange={handleFormChange}
          required
        />
        <button type="submit">{editTask ? "Update Task" : "Add Task"}</button>
      </form>

      <div className="task-cards">
        {data.map((task) => (
          <div className="task-card" key={task.id}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>Status: {task.status}</p>
            <p>
              Due Date:{" "}
              {task.dueDate
                ? new Date(task.dueDate).toLocaleDateString()
                : "Not Set"}
            </p>
            <button onClick={() => handleEdit(task)} className="edit-button">
              Edit
            </button>
            <button
              onClick={() => deleteTask(task.id)}
              className="delete-button"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ToDoList;
