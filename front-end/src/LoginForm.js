import React from 'react';

export function LoginForm({ login, credentials, setCredentials, currentUser }) {
  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="login-form"
    >
      <label htmlFor="user">User:</label>
      <input
        type="text"
        id="user"
        name="user"
        value={credentials.user}
        onChange={handleChange}
        autoComplete="username"
        disabled={!!currentUser}
      />
      <label htmlFor="password">Password:</label>
      <input
        type="password"
        id="password"
        name="password"
        value={credentials.password}
        onChange={handleChange}
        autoComplete="current-password"
        disabled={!!currentUser}
      />
      <button type="submit">{currentUser ? 'Logout' : 'Login'}</button>
    </form>
  );
}