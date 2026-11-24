
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Bug, LayoutDashboard, Plus, Search, RefreshCw,
  Trash2, Pencil, CircleAlert, Clock3, CheckCircle2,
  ListTodo, X, Activity
} from "lucide-react";
import "./App.css";

const API = "http://localhost:8081/api/bugs";

function App() {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const emptyForm = {
    title: "",
    description: "",
    priority: "MEDIUM",
    status: "OPEN",
    reporter: ""
  };

  const [form, setForm] = useState(emptyForm);

  // Fetch bugs from Spring Boot
  const fetchBugs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API);
      setBugs(response.data);
    } catch (error) {
      console.error("Failed to fetch bugs:", error);
      alert("Cannot connect to backend. Check Spring Boot.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBugs();
  }, []);

  // Create or update bug
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await axios.put(`${API}/${editingId}`, form);
      } else {
        await axios.post(API, form);
      }

      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);
      fetchBugs();
    } catch (error) {
      console.error(error);
      alert("Unable to save bug.");
    }
  };

  // Delete bug
  const deleteBug = async (id) => {
    if (!window.confirm("Are you sure you want to delete this bug?")) {
      return;
    }

    try {
      await axios.delete(`${API}/${id}`);
      fetchBugs();
    } catch (error) {
      alert("Unable to delete bug.");
    }
  };

  // Edit bug
  const editBug = (bug) => {
    setForm({
      title: bug.title || "",
      description: bug.description || "",
      priority: bug.priority || "MEDIUM",
      status: bug.status || "OPEN",
      reporter: bug.reporter || ""
    });

    setEditingId(bug.id);
    setShowForm(true);
  };

  // Update status
  const updateStatus = async (bug, status) => {
    try {
      await axios.put(`${API}/${bug.id}`, {
        ...bug,
        status
      });
      fetchBugs();
    } catch (error) {
      alert("Unable to update status.");
    }
  };

  // Dashboard statistics
  const stats = useMemo(() => ({
    total: bugs.length,
    open: bugs.filter(b => b.status === "OPEN").length,
    progress: bugs.filter(b => b.status === "IN_PROGRESS").length,
    resolved: bugs.filter(b => b.status === "RESOLVED").length
  }), [bugs]);

  // Search functionality
  const filteredBugs = bugs.filter(b =>
    b.title?.toLowerCase().includes(search.toLowerCase())
  );

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  return (
    <div className="app-layout">

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon"><Bug size={25}/></div>
          <h2>BugTrack<span>.</span></h2>
        </div>

        <p className="menu-label">WORKSPACE</p>

        <div className="nav-item active">
          <LayoutDashboard size={19}/>
          Dashboard
        </div>

        <div className="nav-item">
          <ListTodo size={19}/>
          All Issues
        </div>

        <div className="sidebar-bottom">
          <div className="profile">
            <div className="avatar">BT</div>
            <div>
              <strong>BugTrack Team</strong>
              <small>Project Workspace</small>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="main-content">

        <header className="topbar">
          <div>
            <span className="breadcrumb">Workspace / Dashboard</span>
            <h1>Bug Dashboard</h1>
            <p>Monitor and manage your software issues.</p>
          </div>

          <button className="primary-btn"
            onClick={() => {
              setEditingId(null);
              setForm(emptyForm);
              setShowForm(true);
            }}>
            <Plus size={18}/> Create Bug
          </button>
        </header>

        {/* Statistics */}
        <section className="stats-grid">

          <div className="stat-card">
            <div className="stat-icon purple"><Bug/></div>
            <span>Total Bugs</span>
            <h2>{stats.total}</h2>
            <small>All reported issues</small>
          </div>

          <div className="stat-card">
            <div className="stat-icon red"><CircleAlert/></div>
            <span>Open Bugs</span>
            <h2>{stats.open}</h2>
            <small>Waiting for action</small>
          </div>

          <div className="stat-card">
            <div className="stat-icon orange"><Clock3/></div>
            <span>In Progress</span>
            <h2>{stats.progress}</h2>
            <small>Currently being fixed</small>
          </div>

          <div className="stat-card">
            <div className="stat-icon green"><CheckCircle2/></div>
            <span>Resolved</span>
            <h2>{stats.resolved}</h2>
            <small>Successfully completed</small>
          </div>

        </section>

        {/* Bug list */}
        <section className="issues-section">

          <div className="section-heading">
            <div>
              <h2><Activity size={20}/> Recent Issues</h2>
              <p>Manage all reported bugs in one place.</p>
            </div>

            <button className="refresh-btn" onClick={fetchBugs}>
              <RefreshCw size={16}/> Refresh
            </button>
          </div>

          <div className="search-box">
            <Search size={19}/>
            <input
              type="text"
              placeholder="Search bugs by title..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>BUG DETAILS</th>
                  <th>REPORTER</th>
                  <th>PRIORITY</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr><td colSpan="5">Loading bugs...</td></tr>
                ) : filteredBugs.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="empty-state">
                      No bugs found.
                    </td>
                  </tr>
                ) : (
                  filteredBugs.map(bug => (
                    <tr key={bug.id}>
                      <td>
                        <strong>{bug.title}</strong>
                        <small className="bug-description">
                          {bug.description}
                        </small>
                        <small className="bug-id">BUG-{bug.id}</small>
                      </td>

                      <td>{bug.reporter || "Unknown"}</td>

                      <td>
                        <span className={`priority ${bug.priority?.toLowerCase()}`}>
                          {bug.priority}
                        </span>
                      </td>

                      <td>
                        <select
                          className={`status-select ${bug.status?.toLowerCase()}`}
                          value={bug.status}
                          onChange={e => updateStatus(bug, e.target.value)}
                        >
                          <option value="OPEN">Open</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="RESOLVED">Resolved</option>
                        </select>
                      </td>

                      <td>
                        <div className="action-buttons">
                          <button title="Edit" onClick={() => editBug(bug)}>
                            <Pencil size={17}/>
                          </button>

                          <button title="Delete" className="delete-btn"
                            onClick={() => deleteBug(bug.id)}>
                            <Trash2 size={17}/>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </section>

      </main>

      {/* Create/Edit Bug Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal">

            <div className="modal-header">
              <div>
                <h2>{editingId ? "Update Bug" : "Report New Bug"}</h2>
                <p>Enter the issue details below.</p>
              </div>
              <button className="close-btn" onClick={closeForm}>
                <X/>
              </button>
            </div>

            <form onSubmit={handleSubmit}>

              <label>Bug Title *</label>
              <input
                required
                placeholder="Enter bug title"
                value={form.title}
                onChange={e => setForm({...form, title:e.target.value})}
              />

              <label>Description *</label>
              <textarea
                required
                placeholder="Describe the issue..."
                value={form.description}
                onChange={e => setForm({...form, description:e.target.value})}
              />

              <label>Reporter *</label>
              <input
                required
                placeholder="Your name"
                value={form.reporter}
                onChange={e => setForm({...form, reporter:e.target.value})}
              />

              <div className="form-row">
                <div>
                  <label>Priority</label>
                  <select
                    value={form.priority}
                    onChange={e => setForm({...form, priority:e.target.value})}
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>

                <div>
                  <label>Status</label>
                  <select
                    value={form.status}
                    onChange={e => setForm({...form, status:e.target.value})}
                  >
                    <option value="OPEN">Open</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="RESOLVED">Resolved</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="cancel-btn"
                  onClick={closeForm}>Cancel</button>

                <button type="submit" className="primary-btn">
                  {editingId ? "Update Bug" : "Create Bug"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;

