import { useEffect, useState } from "react";

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const API = "http://localhost:3000";

  const loadUsers = async () => {
    const res = await fetch(`${API}/users`);
    const data = await res.json();
    setUsers(data);
  };

  const addUser = async () => {
    if (!name || !email) {
      alert("Please enter name and email");
      return;
    }

    await fetch(`${API}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email })
    });

    setName("");
    setEmail("");
    loadUsers();
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h2>Add User</h2>

      <input
        placeholder="Name"
        value={name}
        onChange={e => setName(e.target.value)}
      />

      <input
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <button onClick={addUser}>Submit</button>

      <h2>Users</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;