import { useState } from "react"
// API
import { createUser, deleteUser } from "../../api/api"
// Styles
import styles from './style.module.css'
import mainStyles from '../../App.module.css'

export default function UsersBlock({ users, selectedUserId, onUserSelect, onDataUpdate }) {
  const [form, setForm] = useState({ name: "", email: "", balance: "" });
  const [error, setError] = useState("");

  const handleCreate = async () => {
    const { name, email, balance } = form;
    if (!name || !email) return setError("Please fill in all required fields.");
    try {
      await createUser({
        name,
        email,
        balance: balance ? Number(balance) : undefined,
      });
      setForm({ name: "", email: "", balance: "" });
      setError("");
      onDataUpdate();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create user");
    }
  };

  return (
    <div>
      <h2>Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user._id} className={styles.userItem}>
            <div
							className={selectedUserId === user._id ? styles.selected : ""}
							onClick={() => onUserSelect(user._id)}
						>
              {user.name} ({user.email}) — ${user?.balance?.toFixed(2) ?? 0}
            </div>
            <button 
							className={mainStyles.deleteButton}
							onClick={() => deleteUser(user._id).then(onDataUpdate)}>
							Delete
						</button>
          </li>
        ))}
      </ul>

      <h3>Create User</h3>
      <input
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        type="number"
        placeholder="Balance (optional)"
        value={form.balance}
        onChange={(e) => setForm({ ...form, balance: e.target.value })}
      />
      <button onClick={handleCreate} className={mainStyles.button}>Create</button>
      {error && <div className={mainStyles.error}>{error}</div>}
    </div>
  );
}
