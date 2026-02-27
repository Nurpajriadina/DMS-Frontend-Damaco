import { useState } from "react";
import { FaPlus, FaEye, FaEdit, FaTrash } from "react-icons/fa";

interface UserType {
  id: number;
  name: string;
  email: string;
  username: string;
  address: string;
  status: "ACTIVE" | "INACTIVE";
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<UserType[]>([
    {
      id: 3,
      name: "test",
      email: "",
      username: "testt",
      address: "",
      status: "ACTIVE",
    },
    {
      id: 2,
      name: "Super Admin",
      email: "super@gmail.com",
      username: "superpapau",
      address: "",
      status: "INACTIVE",
    },
  ]);

  const [search, setSearch] = useState("");
  const [viewUser, setViewUser] = useState<UserType | null>(null);
  const [editUser, setEditUser] = useState<UserType | null>(null);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  const deleteUser = (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmDelete) return;

    setUsers(users.filter((u) => u.id !== id));
  };

  const updateStatus = (status: "ACTIVE" | "INACTIVE") => {
    if (!editUser) return;

    setUsers((prev) =>
      prev.map((u) =>
        u.id === editUser.id ? { ...u, status: status } : u
      )
    );

    setEditUser(null);
  };

  return (
    <>
      <div style={{ padding: "30px", maxWidth: "1100px", margin: "auto" }}>
        {/* TITLE + ADD BUTTON */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <h2 style={{ marginBottom: "5px" }}>List User</h2>
            <p style={{ marginTop: 0, color: "gray" }}>
              This is a list of all file users in the system.
            </p>
          </div>

          <button
            style={{
              background: "black",
              color: "white",
              border: "none",
              padding: "8px 15px",
              height: "35px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              cursor: "pointer",
            }}
          >
            <FaPlus /> Add New
          </button>
        </div>

        {/* SEARCH */}
        <div style={{ marginTop: "25px", marginBottom: "15px" }}>
          Search:{" "}
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ padding: "6px", width: "250px" }}
          />
        </div>

        {/* TABLE */}
        <table
          width="100%"
          border={1}
          cellPadding={10}
          style={{ borderCollapse: "collapse" }}
        >
          <thead style={{ background: "#f0f0f0" }}>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Email</th>
              <th>Username</th>
              <th>Address</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.username}</td>
                  <td>{user.address}</td>

                  {/* STATUS */}
                  <td>
                    <span
                      style={{
                        background:
                          user.status === "ACTIVE" ? "#28a745" : "#dc3545",
                        color: "white",
                        padding: "3px 8px",
                        fontSize: "11px",
                        borderRadius: "3px",
                      }}
                    >
                      {user.status}
                    </span>
                  </td>

                  {/* ACTION */}
                  <td style={{ display: "flex", gap: "8px" }}>
                    <FaEye
                      style={{ cursor: "pointer" }}
                      onClick={() => setViewUser(user)}
                    />

                    <FaEdit
                      style={{ cursor: "pointer" }}
                      onClick={() => setEditUser(user)}
                    />

                    <FaTrash
                      style={{ cursor: "pointer", color: "red" }}
                      onClick={() => deleteUser(user.id)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} align="center">
                  No Data
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* FOOTER */}
        <div
          style={{
            marginTop: "10px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ color: "gray" }}>
            Showing 1 to {filteredUsers.length} of {filteredUsers.length} entries
          </div>

          <div style={{ display: "flex", gap: "5px" }}>
            <button
              style={{
                padding: "5px 10px",
                border: "1px solid #ccc",
                background: "#f8f8f8",
              }}
            >
              Previous
            </button>

            <button
              style={{
                padding: "5px 10px",
                border: "1px solid black",
                background: "black",
                color: "white",
              }}
            >
              1
            </button>

            <button
              style={{
                padding: "5px 10px",
                border: "1px solid #ccc",
                background: "#f8f8f8",
              }}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* VIEW POPUP */}
      {viewUser && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "20px",
              width: "350px",
              borderRadius: "8px",
            }}
          >
            <h3>User Detail</h3>
            <p><b>ID:</b> {viewUser.id}</p>
            <p><b>Name:</b> {viewUser.name}</p>
            <p><b>Email:</b> {viewUser.email}</p>
            <p><b>Username:</b> {viewUser.username}</p>
            <p><b>Address:</b> {viewUser.address}</p>
            <p><b>Status:</b> {viewUser.status}</p>

            <button
              onClick={() => setViewUser(null)}
              style={{
                marginTop: "10px",
                padding: "6px 12px",
                background: "black",
                color: "white",
                border: "none",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* EDIT STATUS POPUP */}
      {editUser && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.3)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "20px",
              width: "260px",
              borderRadius: "8px",
              textAlign: "center",
            }}
          >
            <h3 style={{ marginBottom: "15px" }}>Edit Status</h3>

            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button
                onClick={() => updateStatus("ACTIVE")}
                style={{
                  padding: "6px 12px",
                  background: "#28a745",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Active
              </button>

              <button
                onClick={() => updateStatus("INACTIVE")}
                style={{
                  padding: "6px 12px",
                  background: "#dc3545",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Inactive
              </button>
            </div>

            <button
              onClick={() => setEditUser(null)}
              style={{
                marginTop: "15px",
                padding: "5px 10px",
                border: "1px solid #ccc",
                background: "#f8f8f8",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Users;