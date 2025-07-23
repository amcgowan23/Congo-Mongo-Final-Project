import { useState, useEffect } from 'react';
import { QueryForm } from './QueryForm';
import { Articles } from './Articles';
import { SavedQueries } from './SavedQueries';
import { LoginForm } from './LoginForm';
import { exampleQuery, exampleData } from './data';

export function NewsReader() {
  const [query, setQuery] = useState(exampleQuery);
  const [data, setData] = useState(exampleData);
  const [queryFormObject, setQueryFormObject] = useState({ ...exampleQuery });
  const [savedQueries, setSavedQueries] = useState([{ ...exampleQuery }]);
  const [currentUser, setCurrentUser] = useState(null);
  const [credentials, setCredentials] = useState({ user: "", password: "" });

  const urlNews = "/news";
  const urlQueries = "/queries";
  const urlUsersAuth = "http://localhost:4000/users/authenticate"; // <-- Make sure this URL is correct

  useEffect(() => {
    getNews(query);
  }, [query]);

  useEffect(() => {
    getQueryList();
  }, []);

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

  async function saveQueryList(savedQueries) {
    try {
      const response = await fetch(urlQueries, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(savedQueries),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log("✅ savedQueries array has been persisted");
    } catch (error) {
      console.error('Error saving queries:', error);
    }
  }

  // Simplified currentUserMatches helper
  function currentUserMatches(user) {
    return currentUser?.user === user;
  }

  // Helper to check if admin user
  function isAdmin() {
    return currentUser?.user === "admin";
  }

  function onFormSubmit(queryObject) {
    if (currentUser === null) {
      alert("Log in if you want to create new queries!");
      return;
    }

    if (savedQueries.length >= 3 && currentUserMatches("guest")) {
      alert("Guest users cannot submit new queries once saved query count is 3 or greater!");
      return;
    }

    // Compose new saved queries without duplicates by queryName
    let newSavedQueries = [];
    newSavedQueries.push(queryObject);

    for (let query of savedQueries) {
      if (query.queryName !== queryObject.queryName) {
        newSavedQueries.push(query);
      }
    }

    console.log(JSON.stringify(newSavedQueries));
    saveQueryList(newSavedQueries);
    setSavedQueries(newSavedQueries);
    setQuery(queryObject);
  }

  function onSavedQuerySelect(selectedQuery) {
    setQueryFormObject(selectedQuery);
    setQuery(selectedQuery);
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
          // Store only username, never store password in state
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
    <div>
      <LoginForm
        login={login}
        credentials={credentials}
        currentUser={currentUser}
        setCredentials={setCredentials}
      />

      <section className="parent">
        <div className="box">
          <span className='title'>Query Form</span>
          <QueryForm
            setFormObject={setQueryFormObject}
            formObject={queryFormObject}
            submitToParent={onFormSubmit}
            isAdmin={isAdmin()}  /* Pass admin flag to enable extra fields */
          />
        </div>

        <div className="box">
          <span className='title'>Saved Queries</span>
          <SavedQueries
            savedQueries={savedQueries}
            selectedQueryName={query.queryName}
            onQuerySelect={onSavedQuerySelect}
          />
        </div>

        <div className="box">
          <span className='title'>Articles List</span>
          <Articles query={query} data={data} />
        </div>
      </section>
    </div>
  );
}