import React, { useState } from 'react';

const urlUsersAuth = "http://localhost:4000/users/authenticate";

export function LoginForm({ urlQueries }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [credentials, setCredentials] = useState({ user: "", password: "" });
  const [errorMsg, setErrorMsg] = useState("");

  async function login(e) {
    e.preventDefault(); // Prevent page reload
    if (currentUser !== null) {
      setCurrentUser(null);
      setErrorMsg("");
    } else {
      try {
        const response = await fetch(urlUsersAuth, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials),
        });
        const result = await response.text();
        console.log('Auth response:', response.status, result);

        if (response.status === 200) {
          setCurrentUser({ ...credentials });
          setCredentials({ user: "", password: "" });
          setErrorMsg("");
        } else {
          setErrorMsg(result);
          setCurrentUser(null);
        }
      } catch (error) {
        setErrorMsg("Network or server error");
        console.error('Error authenticating user:', error);
        setCurrentUser(null);
      }
    }
  }

  return (
    <form onSubmit={login}>
      <input
        type="text"
        placeholder="Username"
        value={credentials.user}
        onChange={e => setCredentials({ ...credentials, user: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        value={credentials.password}
        onChange={e => setCredentials({ ...credentials, password: e.target.value })}
      />
      <button type="submit">
        {currentUser ? "Logout" : "Login"}
      </button>
      {errorMsg && <div style={{color: "red"}}>{errorMsg}</div>}
      {/* Add UI for saveQueryList as needed */}
    </form>
  );
}
