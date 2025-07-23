export function QueryForm(params) {
// Handles changes to all input/select fields
const handleChange = (event) => {
const { name, value } = event.target;
const newQueryObject = { ...params.formObject, [name]: value };
params.setFormObject(newQueryObject);
};

// Submits the form and triggers parent save logic
function onSubmitClick(event) {
event.preventDefault();

// Basic validation
if (!params.formObject.queryName?.trim()) {
alert("Please provide a name for the query!");
return;
}
if (!params.formObject.q?.trim()) {
alert("Please provide some text for the query field!");
return;
}

// Pass query to parent (which handles saving & API call)
params.submitToParent(params.formObject);
}

return (
<div>
<form onSubmit={onSubmitClick}>
<div>
<label htmlFor="queryName">Query Name: </label>
<input
type="text"
size={10}
id="queryName"
name="queryName"
value={params.formObject.queryName}
onChange={handleChange}
/>
</div>

<div>
<label htmlFor="q">Query Text: </label>
<input
type="text"
size={10}
id="q"
name="q"
value={params.formObject.q}
onChange={handleChange}
/>
</div>

<div>
<label htmlFor="language">Language: </label>
<select
id="language"
name="language"
value={params.formObject.language}
onChange={handleChange}
>
<option value="">All</option>
<option value="en">English</option>
<option value="es">Spanish</option>
<option value="fr">French</option>
<option value="de">German</option>
</select>
</div>

<div>
<label htmlFor="pageSize">Page Size: </label>
<input
type="number"
id="pageSize"
name="pageSize"
min={1}
max={100}
value={params.formObject.pageSize}
onChange={handleChange}
/>
</div>

<span style={{ display: "block", backgroundColor: "#eee" }}>
<button type="submit">Submit</button>
</span>
</form>
</div>
);
}