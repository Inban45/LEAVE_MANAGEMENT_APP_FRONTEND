// src/pages/Users/UsersPage.js
import React, { useEffect, useState } from "react";
import { getAllUsers, createUser, updateUser, deleteUser } from "../../api/userApi";
import Loader from "../../components/common/Loader";
import Layout from "../../components/common/Layout";

const UsersPage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formEmployee, setFormEmployee] = useState({ name: "", email: "", role: "EMPLOYEE", password: "" });
  const [editingEmployeeId, setEditingEmployeeId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all users
  const fetchUsers = () => {
    setLoading(true);
    getAllUsers()
      .then((res) => setEmployees(res.data || []))
      .catch((err) => console.error("Error fetching users:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Add user
  const handleAdd = () => {
    if (!formEmployee.name || !formEmployee.email || !formEmployee.password) return;
    createUser(formEmployee)
      .then(() => {
        setFormEmployee({ name: "", email: "", role: "EMPLOYEE", password: "" });
        fetchUsers();
      })
      .catch((err) => console.error("Error creating user:", err));
  };

  // Edit user
  const handleEdit = (employee) => {
    setEditingEmployeeId(employee.id);
    setFormEmployee({
      name: employee.name || "",
      email: employee.email || "",
      role: employee.role || "EMPLOYEE",
      password: "" // do not prefill password
    });
  };

  const handleUpdate = () => {
    const updateData = { ...formEmployee };
    delete updateData.password; // remove password field when updating
    updateUser(editingEmployeeId, updateData)
      .then(() => {
        setEditingEmployeeId(null);
        setFormEmployee({ name: "", email: "", role: "EMPLOYEE", password: "" });
        fetchUsers();
      })
      .catch((err) => console.error("Error updating user:", err));
  };

  // Delete user
  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    deleteUser(id)
      .then(() => fetchUsers())
      .catch((err) => console.error("Error deleting user:", err));
  };

  // Filter employees by search term
  const filteredEmployees = employees.filter((emp) =>
    (emp.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (emp.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (emp.role || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loader />;

  return (
    <Layout>
      <div className="container-fluid py-4">
        <div className="row">
          <div className="col-12">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-primary text-white">
                <div className="row align-items-center">
                  <div className="col-md-6">
                    <h4 className="mb-0">
                      <i className="bi bi-people-fill me-2"></i>
                      Employee Management
                    </h4>
                  </div>
                  <div className="col-md-6">
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <i className="bi bi-search"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search by name, email or role..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="fw-bold text-center">#</th>
                        <th className="fw-bold">
                          <i className="bi bi-person me-1"></i>Name
                        </th>
                        <th className="fw-bold">
                          <i className="bi bi-envelope me-1"></i>Email
                        </th>
                        <th className="fw-bold">
                          <i className="bi bi-briefcase me-1"></i>Role
                        </th>
                        <th className="fw-bold text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEmployees.length ? (
                        filteredEmployees.map((emp) => (
                          <tr key={emp.id}>
                            <td className="text-center">
                              <span className="badge bg-light text-dark">{emp.id}</span>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2" 
                                     style={{width: '32px', height: '32px', fontSize: '14px'}}>
                                  {emp.name?.charAt(0)?.toUpperCase() || 'U'}
                                </div>
                                <strong>{emp.name}</strong>
                              </div>
                            </td>
                            <td>
                              <span className="text-muted">
                                <i className="bi bi-envelope-fill me-1"></i>
                                {emp.email}
                              </span>
                            </td>
                            <td>
                              <span className={`badge ${emp.role === 'ADMIN' ? 'bg-danger' : 
                                                       emp.role === 'MANAGER' ? 'bg-warning' : 
                                                       'bg-success'}`}>
                                {emp.role}
                              </span>
                            </td>
                            <td className="text-center">
                              <div className="btn-group btn-group-sm" role="group">
                                <button 
                                  onClick={() => handleEdit(emp)} 
                                  className="btn btn-outline-primary"
                                  title="Edit Employee"
                                >
                                  <i className="bi bi-pencil"></i>
                                </button>
                                <button 
                                  onClick={() => handleDelete(emp.id)} 
                                  className="btn btn-outline-danger"
                                  title="Delete Employee"
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center py-5">
                            <div className="text-muted">
                              <i className="bi bi-people fs-1 d-block mb-3"></i>
                              <h5>No employees found</h5>
                              <p>Try adjusting your search criteria</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add/Edit Form */}
        <div className="row mt-4">
          <div className="col-12">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-secondary text-white">
                <h5 className="mb-0">
                  <i className={`bi ${editingEmployeeId ? 'bi-pencil-square' : 'bi-person-plus'} me-2`}></i>
                  {editingEmployeeId ? 'Edit Employee' : 'Add New Employee'}
                </h5>
              </div>
              <div className="card-body">
                <form>
                  <div className="row g-3">
                    <div className="col-md-3">
                      <label className="form-label fw-bold">
                        <i className="bi bi-person me-1"></i>Full Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter full name"
                        value={formEmployee.name}
                        onChange={(e) => setFormEmployee({ ...formEmployee, name: e.target.value })}
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label fw-bold">
                        <i className="bi bi-envelope me-1"></i>Email Address
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Enter email address"
                        value={formEmployee.email}
                        onChange={(e) => setFormEmployee({ ...formEmployee, email: e.target.value })}
                      />
                    </div>
                    {!editingEmployeeId && (
                      <div className="col-md-2">
                        <label className="form-label fw-bold">
                          <i className="bi bi-lock me-1"></i>Password
                        </label>
                        <input
                          type="password"
                          className="form-control"
                          placeholder="Enter password"
                          value={formEmployee.password}
                          onChange={(e) => setFormEmployee({ ...formEmployee, password: e.target.value })}
                        />
                      </div>
                    )}
                    <div className={`col-md-${editingEmployeeId ? '3' : '2'}`}>
                      <label className="form-label fw-bold">
                        <i className="bi bi-briefcase me-1"></i>Role
                      </label>
                      <select
                        className="form-select"
                        value={formEmployee.role}
                        onChange={(e) => setFormEmployee({ ...formEmployee, role: e.target.value })}
                      >
                        <option value="EMPLOYEE">Employee</option>
                        <option value="MANAGER">Manager</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </div>
                    <div className={`col-md-${editingEmployeeId ? '3' : '2'} d-flex align-items-end`}>
                      {editingEmployeeId ? (
                        <div className="btn-group w-100">
                          <button 
                            type="button"
                            onClick={handleUpdate} 
                            className="btn btn-success"
                          >
                            <i className="bi bi-check-lg me-1"></i>Update
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingEmployeeId(null);
                              setFormEmployee({ name: "", email: "", role: "EMPLOYEE", password: "" });
                            }}
                            className="btn btn-outline-secondary"
                          >
                            <i className="bi bi-x-lg me-1"></i>Cancel
                          </button>
                        </div>
                      ) : (
                        <button 
                          type="button"
                          onClick={handleAdd}
                          className="btn btn-primary w-100"
                        >
                          <i className="bi bi-plus-lg me-1"></i>Add Employee
                        </button>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UsersPage;