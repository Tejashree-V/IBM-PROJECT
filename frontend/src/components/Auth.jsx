import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { supabase } from '../supabaseClient';
import { setUser } from '../slices/userSlice';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const dispatch = useDispatch();

  const handleAuth = async (e) => {
    e.preventDefault();
    if (isSignUp) {
      const { data: { user }, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        console.error('Error signing up:', error.message);
      } else {
        const { error: insertError } = await supabase
          .from('users')
          .insert([{ user_ID: user.id, email, password }]);
        if (insertError) {
          console.error('Error inserting user data:', insertError.message);
        } else {
          dispatch(setUser(user));
        }
      }
    } else {
      const { data: { user }, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error('Error signing in:', error.message);
      } else {
        dispatch(setUser(user));
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">
                {isSignUp ? 'Sign Up' : 'Sign In'}
              </h2>
              <form onSubmit={handleAuth}>
                <div className="mb-3">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary">
                    {isSignUp ? 'Sign Up' : 'Sign In'}
                  </button>
                  <button 
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setIsSignUp(!isSignUp)}
                  >
                    {isSignUp ? 'Switch to Sign In' : 'Switch to Sign Up'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;