import { useState } from "react";
import Navbar from "../components/Navbar";

interface User {
  name: string;
  role: string;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    { name: "Admin", role: "Super Admin" },
  ]);

  const addUser = () => {
    setUsers([...users, { name: "User" + users.length, role: "User" }]);
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: "30px", maxWidth: "1100px", margin: "auto" }}>
        <h2>Users</h2>
        <button onClick={addUser}>Add User</button>

        <table width="100%" border={1} cellPadding={10}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => (
              <tr key={i}>
                <td>{user.name}</td>
                <td>{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Users;