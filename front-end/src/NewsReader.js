import { useState, useEffect } from 'react';
import { QueryForm } from './QueryForm';
import { Articles } from './Articles';
import { SavedQueries } from './SavedQueries';
import { LoginForm } from './LoginForm';
import { defaultQueries } from './defaultQueries';
import { exampleQuery, exampleData } from './data';

export function NewsReader() {
  const [query, setQuery] = useState(exampleQuery);
  const [data, setData] = useState(exampleData);
  const [queryFormObject, setQueryFormObject] = useState({ ...exampleQuery });
  const [savedQueries, setSavedQueries] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [credentials, setCredentials] = useState({ user: "", password: "" });

  const urlNews = "/news";
  const urlQueries = "/queries";
  const urlUsersAuth = "http://localhost:4000/users/authenticate";

  useEffect(() => {
    if (!currentUser) {
      // No user logged in: show canned defaults
      setSavedQueries(defaultQueries);
    } else if (currentUser.user === "guest" || currentUser.user === "admin") {
      // Guest or Admin logged in: start with empty list
      setSavedQueries([]);
    } else {
      // Other logged in users: load saved queries from backend
      getQueryList();
    }
  }, [currentUser]);

  useEffect(() => {
    getNews(query);
  }, [query]);

  async function getQueryList() {
    try {
      const response = await fetch(urlQueries);
      if (response.ok) {
        const data = await response.json();
        console.log("✅ savedQueries has been retrieved:");
        setSavedQueries(data);
      }
    } catch (error) {
      console.error('Error fetching saved queries:', error);
    }
  }

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
      console.log("✅ savedQueries array has been persisted");
    } catch (error) {
      console.error('Error saving queries:', error);
    }
  }

  function currentUserMatches(user) {
    return currentUser?.user === user;
  }

  function isAdmin() {
    return currentUser?.user === "admin";
  }

  function onFormSubmit(queryObject) {
    if (currentUser === null) {
      alert("Log in if you want to create new queries!");
      return;
    }

    // Guest user max query limit of 3, admin unlimited
    if (currentUser.user === "guest" && savedQueries.length >= 3) {
      alert("Guest users cannot submit new queries once saved query count is 3 or greater!");
      return;
    }

    const newSavedQueries = [queryObject, ...savedQueries.filter(q => q.queryName !== queryObject.queryName)];

    setSavedQueries(newSavedQueries);
    saveQueryList(newSavedQueries);
    setQuery(queryObject);
  }

  function onSavedQuerySelect(selectedQuery) {
    setQueryFormObject(selectedQuery);
    setQuery(selectedQuery);
  }

  function onResetQueries() {
    if (!currentUser) return;

    const confirmReset = window.confirm("Are you sure you want to erase the list?");
    if (confirmReset) {
      const cleared = [
        { queryName: "exampleQuery", q: "hello", language: "en", pageSize: 5 },
      ];
      saveQueryList(cleared);
      setSavedQueries(cleared);
    }
  }

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

  async function login() {
    if (currentUser !== null) {
      // logout
      setCurrentUser(null);
    } else {
      try {
        const response = await fetch(urlUsersAuth, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials),
        });

        if (response.status === 200) {
          setCurrentUser({ user: credentials.user });
          setCredentials({ user: "", password: "" });
        } else {
          alert("Error during authentication! " + credentials.user);
          setCurrentUser(null);
        }
      } catch (error) {
        console.error('Error authenticating user:', error);
        setCurrentUser(null);
      }
    }
  }

  return (
    <div className="container">
      <header>
        <LoginForm
          login={login}
          credentials={credentials}
          setCredentials={setCredentials}
          currentUser={currentUser}
        />
        <div className="status">
          User: {currentUser ? currentUser.user : <em>not logged in</em>}
        </div>
      </header>

      <main className="main-content">
        <aside className="sidebar">
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

        <aside className="sidebar">
          <div className="title">Saved Queries</div>
          <SavedQueries
            savedQueries={savedQueries}
            selectedQueryName={query.queryName}
            onQuerySelect={onSavedQuerySelect}
            onReset={onResetQueries}
            currentUser={currentUser}
          />
        </aside>

        <section className="articles">
          <div className="title">Articles List</div>
          <Articles data={data} query={query} />
        </section>
      </main>
    </div>
  );
}