export function QueryForm({ formObject, setFormObject, submitToParent, currentUser }) {
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormObject({
      ...formObject,
      [name]: value,
    });
  };

  const onSubmitClick = (event) => {
    event.preventDefault();

    if (!formObject.queryName || formObject.queryName.trim() === "") {
      alert("Please provide a name for the query!");
      return;
    }

    if (!formObject.q || formObject.q.trim().length === 0) {
      alert("Please provide some text for the query field!");
      return;
    }

    submitToParent(formObject);
  };

  // Helper flags
  const isGuest = currentUser?.user === "guest";
  const isAdmin = currentUser?.user === "admin";

  return (
    <form onSubmit={onSubmitClick}>
      <div>
        <label htmlFor="queryName">Query Name:</label>
        <input
          type="text"
          id="queryName"
          name="queryName"
          value={formObject.queryName}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="q">Query Text:</label>
        <input
          type="text"
          id="q"
          name="q"
          value={formObject.q}
          onChange={handleChange}
          required
        />
      </div>

      {/* Show language and pageSize only if NOT guest */}
      {!isGuest && (
        <>
          <div>
            <label htmlFor="language">Language:</label>
            <select
              id="language"
              name="language"
              value={formObject.language}
              onChange={handleChange}
            >
              <option value="">All</option>
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              {/* Add more languages as needed */}
            </select>
          </div>

          <div>
            <label htmlFor="pageSize">Page Size:</label>
            <input
              type="number"
              id="pageSize"
              name="pageSize"
              min={1}
              max={100}
              value={formObject.pageSize}
              onChange={handleChange}
            />
          </div>
        </>
      )}

      <button type="submit">Submit</button>
    </form>
  );
}