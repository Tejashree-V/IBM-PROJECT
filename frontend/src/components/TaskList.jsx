import React, { useState } from 'react';

import axios from 'axios';

import { useDispatch } from 'react-redux';

import { deleteTask, updateTask } from '../slices/tasksSlice';



const TaskList = ({ tasks }) => {

  const dispatch = useDispatch();

  const [editingId, setEditingId] = useState(null);

  const [editForm, setEditForm] = useState({});

  const [commentsMap, setCommentsMap] = useState({});

  const [filters, setFilters] = useState({

    status: 'all',

    priority: 'all',

    category: 'all',

    sortBy: 'dueDate'

  });



  // Filter and sort tasks

  const getFilteredTasks = () => {

    if (!Array.isArray(tasks)) return [];



    return tasks

      .filter(task => {

        if (!task) return false;

        return (

          (filters.status === 'all' || task.status === filters.status) &&

          (filters.priority === 'all' || task.priority === filters.priority) &&

          (filters.category === 'all' || task.category === filters.category)

        );

      })

      .sort((a, b) => {

        switch (filters.sortBy) {

          case 'dueDate':

            return new Date(a.dueDate || 0) - new Date(b.dueDate || 0);

          case 'priority': {

            const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };

            return (priorityOrder[a.priority] || 0) - (priorityOrder[b.priority] || 0);

          }

          case 'status':

            return (a.status || '').localeCompare(b.status || '');

          default:

            return 0;

        }

      });

  };



  // Get unique values for filters

  const getUniqueValues = (field) => {

    if (!Array.isArray(tasks)) return ['all'];

    return ['all', ...new Set(tasks.map(task => task[field]).filter(Boolean))];

  };



  // Calculate task progress

  const calculateProgress = (task) => {

    const statusWeights = {

      todo: 0,

      inProgress: 33,

      review: 66,

      completed: 100

    };

    return statusWeights[task?.status] || 0;

  };



  // Format date helper

  const formatDate = (dateString) => {

    if (!dateString) return 'Not set';

    try {

      return new Date(dateString).toLocaleDateString();

    } catch {

      return 'Invalid date';

    }

  };



  // Task operations

  const handleDelete = async (id) => {

    if (!id) return;

    try {

      await axios.delete(`http://localhost:3001/tasks/${id}`);

      dispatch(deleteTask(id));

    } catch (error) {

      console.error('Error deleting task:', error);

    }

  };



  const handleUpdate = async (id, updatedTask) => {

    if (!id || !updatedTask) return;

    try {

      const response = await axios.patch(`http://localhost:3001/tasks/${id}`, updatedTask);

      dispatch(updateTask(response.data));

      setEditingId(null);

    } catch (error) {

      console.error('Error updating task:', error);

    }

  };



  const startEdit = (task) => {

    if (!task) return;

    setEditingId(task._id);

    setEditForm(task);

  };



  const handleEditChange = (e) => {

    const { name, value } = e.target;

    setEditForm(prev => ({

      ...prev,

      [name]: value

    }));

  };



  const handleAddComment = async (taskId) => {

    const comment = commentsMap[taskId];

    if (!taskId || !comment?.trim()) return;



    try {

      const response = await axios.post(`http://localhost:3001/tasks/${taskId}/comments`, {

        content: comment,

        createdAt: new Date().toISOString(),

        author: 'Current User'

      });



      dispatch(updateTask(response.data));

      setCommentsMap(prev => ({ ...prev, [taskId]: '' }));

    } catch (error) {

      console.error('Error adding comment:', error);

    }

  };



  // Render task card

  const TaskCard = ({ task }) => {

    if (!task) return null;



    const getPriorityClass = (priority) => {

      const classes = {

        low: 'success',

        medium: 'info',

        high: 'warning',

        urgent: 'danger'

      };

      return `badge bg-${classes[priority] || 'secondary'}`;

    };



    return (

      <div className="col-12 col-lg-6 mb-4">

        <div className="card h-100 shadow-sm">

          <div className="card-body">

            <div className="d-flex justify-content-between align-items-center mb-3">

              <h5 className="card-title mb-0">{task.title}</h5>

              <span className={getPriorityClass(task.priority)}>

                {task.priority?.toUpperCase()}

              </span>

            </div>



            <div className="mb-3">

              <small className="text-muted">Status:</small>

              <div className="progress mt-1">

                <div

                  className="progress-bar"

                  style={{ width: `${calculateProgress(task)}%` }}

                >

                  {task.status}

                </div>

              </div>

            </div>



            <div className="mb-3">

              <small className="text-muted">Due Date:</small>

              <p className="mb-0">{formatDate(task.dueDate)}</p>

            </div>



            <div className="mb-3">

              <small className="text-muted">Description:</small>

              <p className="mb-0">{task.description || 'No description'}</p>

            </div>



            {/* Comments Section */}

            <div className="mb-3">

              <small className="text-muted">Comments:</small>

              <div className="mt-2">

                {task.comments?.map((comment, index) => (

                  <div key={index} className="border-start border-3 border-primary ps-2 mb-2">

                    <small>{comment.content}</small>

                  </div>

                ))}

              </div>

              <div className="mt-2">

                <textarea

                  className="form-control form-control-sm mb-2"

                  value={commentsMap[task._id] || ''}

                  onChange={(e) => setCommentsMap({ ...commentsMap, [task._id]: e.target.value })}

                  placeholder="Add a comment..."

                  rows="2"

                />

                <button

                  className="btn btn-sm btn-primary"

                  onClick={() => handleAddComment(task._id)}

                >

                  Add Comment

                </button>

              </div>

            </div>



            {/* Action Buttons */}

            <div className="d-flex gap-2">

              <button

                className="btn btn-sm btn-outline-primary"

                onClick={() => startEdit(task)}

              >

                Edit

              </button>

              <button

                className="btn btn-sm btn-outline-danger"

                onClick={() => handleDelete(task._id)}

              >

                Delete

              </button>

              <button

                className="btn btn-sm btn-outline-success"

                onClick={() => handleUpdate(task._id, {

                  status: task.status === 'completed' ? 'todo' : 'completed'

                })}

              >

                {task.status === 'completed' ? 'Reopen' : 'Complete'}

              </button>

            </div>

          </div>

        </div>

      </div>

    );

  };



  // Main render

  return (

    <div className="container-fluid py-4">

      {/* Filters */}

      <div className="row mb-4">

        <div className="col-12">

          <div className="card">

            <div className="card-body">

              <h5 className="card-title mb-3">Filters</h5>

              <div className="row g-3">

                <div className="col-md-3">

                  <select

                    className="form-select"

                    value={filters.status}

                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}

                  >

                    {getUniqueValues('status').map(status => (

                      <option key={status} value={status}>

                        {status === 'all' ? 'All Statuses' : status}

                      </option>

                    ))}

                  </select>

                </div>

                <div className="col-md-3">

                  <select

                    className="form-select"

                    value={filters.priority}

                    onChange={(e) => setFilters({ ...filters, priority: e.target.value })}

                  >

                    {getUniqueValues('priority').map(priority => (

                      <option key={priority} value={priority}>

                        {priority === 'all' ? 'All Priorities' : priority}

                      </option>

                    ))}

                  </select>

                </div>

                <div className="col-md-3">

                  <select

                    className="form-select"

                    value={filters.category}

                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}

                  >

                    {getUniqueValues('category').map(category => (

                      <option key={category} value={category}>

                        {category === 'all' ? 'All Categories' : category}

                      </option>

                    ))}

                  </select>

                </div>

                <div className="col-md-3">

                  <select

                    className="form-select"

                    value={filters.sortBy}

                    onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}

                  >

                    <option value="dueDate">Sort by Due Date</option>

                    <option value="priority">Sort by Priority</option>

                    <option value="status">Sort by Level</option>

                  </select>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>



      {/* Task List */}

      <div className="row">

        {getFilteredTasks().map(task => (

          <TaskCard key={task._id} task={task} />

        ))}

      </div>

    </div>

  );

};



export default TaskList;


