import { useEffect, useState } from "react";
import { createUser, deleteUser, getUsers, updateUser } from "../api/users";

const emptyForm = { name: "", email: "" };

function Form() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let isCurrent = true;

    getUsers()
      .then((records) => {
        if (isCurrent) setUsers(records);
      })
      .catch((requestError) => {
        if (isCurrent) setError(requestError.message);
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setMessage("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSaving(true);
    setError("");
    setMessage("");

    try {
      if (editingId) {
        const updatedUser = await updateUser(editingId, form);
        setUsers((currentUsers) =>
          currentUsers.map((user) => (user._id === editingId ? updatedUser : user)),
        );
        setMessage("User updated successfully.");
      } else {
        const newUser = await createUser(form);
        setUsers((currentUsers) => [newUser, ...currentUsers]);
        setMessage("User added successfully.");
      }
      setForm(emptyForm);
      setEditingId(null);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSaving(false);
    }
  }

  function startEdit(user) {
    setEditingId(user._id);
    setForm({ name: user.name, email: user.email });
    setError("");
    setMessage("");
  }

  async function handleDelete(user) {
    setBusyId(user._id);
    setError("");
    setMessage("");

    try {
      await deleteUser(user._id);
      setUsers((currentUsers) => currentUsers.filter((record) => record._id !== user._id));
      if (editingId === user._id) cancelEdit();
      setMessage("User deleted successfully.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <section className="crud-page">
      <header className="page-heading">
        <p className="eyebrow">Manage your records</p>
        <h2>Users</h2>
        <p>Add, update, or remove a user. Changes are saved to the database.</p>
      </header>

      <div className="crud-layout">
        <form className="user-form" onSubmit={handleSubmit}>
          <h3>{editingId ? "Edit user" : "Add a user"}</h3>

          <label htmlFor="user-name">Name</label>
          <input
            id="user-name"
            name="name"
            type="text"
            placeholder="Enter a name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <label htmlFor="user-email">Email</label>
          <input
            id="user-email"
            name="email"
            type="email"
            placeholder="Enter an email address"
            value={form.email}
            onChange={handleChange}
            required
          />

          <div className="form-actions">
            <button className="primary-button" type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : editingId ? "Save changes" : "Add user"}
            </button>
            {editingId && (
              <button className="secondary-button" type="button" onClick={cancelEdit}>
                Cancel
              </button>
            )}
          </div>
        </form>

        <section className="users-panel" aria-labelledby="users-heading">
          <div className="users-panel-heading">
            <h3 id="users-heading">All users</h3>
            <span className="user-count">{users.length}</span>
          </div>

          {error && <p className="notice error-notice" role="alert">{error}</p>}
          {message && <p className="notice success-notice" role="status">{message}</p>}

          {isLoading ? (
            <p className="empty-state">Loading users...</p>
          ) : error && users.length === 0 ? (
            <p className="empty-state">Users could not be loaded.</p>
          ) : users.length === 0 ? (
            <p className="empty-state">No users yet. Add one using the form.</p>
          ) : (
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <div className="row-actions">
                          <button
                            className="text-button"
                            type="button"
                            onClick={() => startEdit(user)}
                            disabled={busyId === user._id}
                          >
                            Edit
                          </button>
                          <button
                            className="text-button delete-button"
                            type="button"
                            onClick={() => handleDelete(user)}
                            disabled={busyId === user._id}
                          >
                            {busyId === user._id ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </section>
  );
}

export default Form;
