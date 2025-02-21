import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addTask } from '../slices/tasksSlice';

const TaskForm = ({ fetchTasks }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    category: '',
    assignedTo: '',
    estimatedTime: '',
    status: 'todo',
    comments: []
  });
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCommentChange = (e) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      comments: [value]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/tasks', formData);
      dispatch(addTask(response.data));
      fetchTasks();
      setFormData({
        title: '',
        description: '',
        dueDate: '',
        priority: 'medium',
        category: '',
        assignedTo: '',
        estimatedTime: '',
        status: 'todo',
        comments: []
      });
    } catch (error) {
      console.error('There was an error creating the task!', error);
    }
  };

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-primary bg-gradient text-white py-3">
        <h3 className="card-title h5 mb-0">Create New Task</h3>
      </div>
      
      <div className="card-body px-4 py-4">
        <form onSubmit={handleSubmit} className="needs-validation">
          {/* Title */}
          <div className="mb-3">
            <label htmlFor="title" className="form-label">Task To Do</label>
            <input
              type="text"
              className="form-control form-control-lg"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter task title"
            />
          </div>

          {/* Description */}
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Definition</label>
            <textarea
              className="form-control"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Enter description"
            />
          </div>

          <div className="row g-3">
            {/* Due Date and Priority */}
            <div className="col-sm-6">
              <label htmlFor="dueDate" className="form-label">Due Date</label>
              <input
                type="date"
                className="form-control"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
              />
            </div>

            <div className="col-sm-6">
              <label htmlFor="priority" className="form-label">Priority</label>
              <select
                className="form-select"
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            {/* Category and Assigned To */}
            <div className="col-sm-6">
              <label htmlFor="category" className="form-label">Domain</label>
              <input
                type="text"
                className="form-control"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Enter category"
              />
            </div>

            <div className="col-sm-6">
              <label htmlFor="assignedTo" className="form-label">Assigned To</label>
              <input
                type="text"
                className="form-control"
                id="assignedTo"
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                placeholder="Enter assignee"
              />
            </div>

            {/* Estimated Time and Status */}
            <div className="col-sm-6">
              <label htmlFor="estimatedTime" className="form-label">Deadline (hours)</label>
              <input
                type="number"
                className="form-control"
                id="estimatedTime"
                name="estimatedTime"
                value={formData.estimatedTime}
                onChange={handleChange}
                min="0"
                step="0.5"
                placeholder="Enter time"
              />
            </div>

            <div className="col-sm-6">
              <label htmlFor="status" className="form-label">Level</label>
              <select
                className="form-select"
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="todo">To Do</option>
                <option value="inProgress">In Progress</option>
                <option value="review">Review</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Comments */}
          <div className="mt-3">
            <label htmlFor="comments" className="form-label">Analysis</label>
            <textarea
              className="form-control"
              id="comments"
              name="comments"
              value={formData.comments[0] || ''}
              onChange={handleCommentChange}
              rows="4"
              placeholder="Enter analysis"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="mt-4">
            <button type="submit" className="btn btn-primary w-100 py-2">
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;