import { useState, useEffect } from 'react';
import { QueryForm } from './QueryForm';
import { Articles } from './Articles';
import { SavedQueries } from './SavedQueries';
import { LoginForm } from './LoginForm';
import { defaultQueries } from './defaultQueries';
import { exampleQuery, exampleData } from './data';

export function NewsReader() {
  // State declarations
  const [query, setQuery] = useState(exampleQuery);
  const [data, setData] = useState(exampleData);
  const [queryFormObject, setQueryFormObject] = useState({ ...exampleQuery });
  const [savedQueries, setSavedQueries] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [credentials, setCredentials] = useState({ user: '', password: '' });

  // API endpoints
  const urlNews = '/news';
  const urlQueries = '/queries';
  const urlUsersAuth = 'http://localhost:4000/users/authenticate';

  // Load saved queries or default queries based on login state
  useEffect(() => {
    if (!currentUser) {
      // No user logged in: load default canned queries
      setSavedQueries(defaultQueries);
    } else if (currentUser.user === 'guest' || currentUser.user === 'admin') {
      // Guest or Admin logged in: start with empty list
      setSavedQueries([]);
    } else {
      // Other logged in users: fetch saved queries from backend
      getQueryList();
    }
  }, [currentUser]);

  // Fetch news data when query changes
  useEffect(() => {
    getNews(query);
  }, [query]);

  // Fetch saved queries from backend
  async function getQueryList() {
    try {
      const response = await fetch(urlQueries);
      if (response.ok) {
        const data = await response.json();
        setSavedQueries(data);
      }
    } catch (error) {
      console.error('Error fetching saved queries:', error);
    }
  }

  // Save queries list to backend
  async function saveQueryList(queriesToSave) {
    try {
      const response = await fetch(urlQueries, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(queriesToSave),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error saving queries:', error);
    }
  }

  // Check if current user matches a username
  function currentUserMatches(user) {
    return currentUser?.user === user;
  }

  // Check if current user is admin
  function isAdmin() {
    return currentUser?.user === 'admin';
  }

  // Handle query form submission
  function onFormSubmit(queryObject) {
    if (!currentUser) {
      alert('Log in if you want to create new queries!');
      return;
    }

    if (currentUser.user === 'guest' && savedQueries.length >= 3) {
      alert('Guest users cannot submit new queries once saved query count is 3 or greater!');
      return;
    }

    const newSavedQueries = [
      queryObject,
      ...savedQueries.filter(q => q.queryName !== queryObject.queryName),
    ];

    setSavedQueries(newSavedQueries);
    saveQueryList(newSavedQueries);
    setQuery(queryObject);
  }

  // When user selects a saved query
  function onSavedQuerySelect(selectedQuery) {
    setQueryFormObject(selectedQuery);
    setQuery(selectedQuery);
  }

  // Reset saved queries to a default example query
  function onResetQueries() {
    if (!currentUser) return;

    const confirmReset = window.confirm('Are you sure you want to erase the list?');
    if (confirmReset) {
      const cleared = [
        { queryName: 'exampleQuery', q: 'hello', language: 'en', pageSize: 5 },
      ];
      setSavedQueries(cleared);
      saveQueryList(cleared);
    }
  }

  // Fetch news articles from backend based on query
  async function getNews(queryObject) {
    if (queryObject.q) {
      try {
        const response = await fetch(urlNews, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(queryObject),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    } else {
      setData({});
    }
  }

  // Handle login and logout
  async function login() {
    if (currentUser) {
      setCurrentUser(null);
      return;
    }

    try {
      const response = await fetch(urlUsersAuth, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (response.status === 200) {
        setCurrentUser({ user: credentials.user });
        setCredentials({ user: '', password: '' });
      } else {
        alert(`Error during authentication! ${credentials.user}`);
        setCurrentUser(null);
      }
    } catch (error) {
      console.error('Error authenticating user:', error);
      setCurrentUser(null);
    }
  }

  // Render component JSX
  return (
    <div className="container">
      <header
        className="header"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '1rem 0',
          borderBottom: '2px solid grey',
        }}
      >
        {/* <h1
          style={{
            margin: 0,
            userSelect: 'none',
            fontWeight: 'bold',
            fontSize: '2rem',
            color: '#333',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          News Reader App
        </h1> */}

        <div
          style={{
            // marginLeft: 'auto'
            display: 'flex',
            alignItems: 'center',
            padding: '10px',
            gap: '1rem',
          }}
        >
          <LoginForm
            login={login}
            credentials={credentials}
            setCredentials={setCredentials}
            currentUser={currentUser}
          />
          <div
            className="status"
            style={{
              fontStyle: 'italic',
              fontWeight: 'bold',
              whiteSpace: 'nowrap',
            }}
          >
            User: {currentUser ? currentUser.user : <em>not logged in</em>}
          </div>
        </div>
      </header>

      <main
        className="main-content"
        style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}
      >
        <aside
          className="sidebar"
          style={{
            flex: '1 1 300px',
            minWidth: 280,
            background: '#fff',
            padding: '1rem',
            borderRadius: 6,
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div className="title">Query Form</div>
          {currentUser && (
            <QueryForm
              formObject={queryFormObject}
              setFormObject={setQueryFormObject}
              submitToParent={onFormSubmit}
              currentUser={currentUser}
              isAdmin={isAdmin()}
            />
          )}
        </aside>

        <aside
          className="sidebar"
          style={{
            flex: '1 1 300px',
            minWidth: 280,
            background: '#fff',
            padding: '1rem',
            borderRadius: 6,
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          }}
        >
          <div className="title">Saved Queries</div>
          <SavedQueries
            savedQueries={savedQueries}
            selectedQueryName={query.queryName}
            onQuerySelect={onSavedQuerySelect}
            onReset={onResetQueries}
            currentUser={currentUser}
          />
        </aside>

        <section
          className="articles"
          style={{
            flex: '2 1 600px',
            minWidth: 320,
            background: '#fff',
            padding: '1rem',
            borderRadius: 6,
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            overflowWrap: 'break-word',
          }}
        >
          <div className="title">Articles List</div>
          <Articles data={data} query={query} />
        </section>
      </main>
    </div>
  );
}