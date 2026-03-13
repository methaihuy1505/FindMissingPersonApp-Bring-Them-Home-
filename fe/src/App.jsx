import { useEffect, useState } from "react";
import api from "./api";

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api
      .get("/user")
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <div>
      <h2>User List</h2>

      {users.map((user) => (
        <div key={user.id}>
          {user.name} - {user.email}
        </div>
      ))}
    </div>
  );
}

export default App;
