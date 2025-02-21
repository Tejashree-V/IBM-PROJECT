import React, { useEffect } from 'react';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import Auth from './components/Auth';
import { supabase } from './supabaseClient';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearUser } from './slices/userSlice';
import { setTasks } from './slices/tasksSlice';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

function App() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const tasks = useSelector(state => state.tasks);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:3001/tasks');
      dispatch(setTasks(response.data));
    } catch (error) {
      console.error('There was an error fetching the tasks!', error);
    }
  };

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Session:', session);
      dispatch(setUser(session?.user ?? null));
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', session);
      dispatch(setUser(session?.user ?? null));
    });

    return () => subscription.unsubscribe();
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user, dispatch]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    dispatch(clearUser());
  };

  if (!user) {
    return (
      <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <Auth />
      </div>
    );
  }

  return (
    <div className="container-fluid min-vh-100 bg-light py-4">
      <div className="container">
        <div className="row mb-4">
          <div className="col-12 d-flex justify-content-between align-items-center">
            <h1 className="display-4 mb-0">Educational Task Management</h1>
            <button 
              onClick={handleLogout}
              className="btn btn-outline-danger"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="row">
          <div className="col-12 col-md-4 mb-4 mb-md-0">
            <div className="card shadow-sm">
              <div className="card-body">
                <h2 className="h4 card-title mb-3">Add New Task</h2>
                <TaskForm fetchTasks={fetchTasks} />
              </div>
            </div>
          </div>

          <div className="col-12 col-md-8">
            <div className="card shadow-sm">
              <div className="card-body">
                <h2 className="h4 card-title mb-3">Your Tasks</h2>
                <TaskList tasks={tasks} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;