import { useState } from "react";

const CATEGORIES = ["Audit & Assurance", "Tax & GST", "Legal & Secretarial", "Advisory & Finance", "Operations"];
const JOB_TYPES = ["Full-Time", "Part-Time", "Contract", "Internship"];
const WORK_MODES = ["On-Site", "Hybrid", "Remote"];

const CAT_COLORS = {
  "Audit & Assurance":  { bg: "#fff0f3", text: "#c0392b", border: "#f5c6cb" },
  "Tax & GST":          { bg: "#fff3e0", text: "#e65100", border: "#ffcc80" },
  "Legal & Secretarial":{ bg: "#e8f5e9", text: "#2e7d32", border: "#a5d6a7" },
  "Advisory & Finance": { bg: "#e3f2fd", text: "#1565c0", border: "#90caf9" },
  "Operations":         { bg: "#f3e5f5", text: "#6a1b9a", border: "#ce93d8" },
};

const INITIAL_JOBS = [
  { id: 1, title: "Audit Manager — Statutory & Internal", category: "Audit & Assurance", type: "Full-Time", experience: "3–6 Years Experience", location: "Gurugram, Haryana", mode: "Hybrid", qualification: "CA Qualified Preferred", description: "" },
  { id: 2, title: "GST & Indirect Tax Executive", category: "Tax & GST", type: "Full-Time", experience: "1–3 Years Experience", location: "Gurugram, Haryana", mode: "On-Site", qualification: "B.Com / CA Inter / CA Final", description: "" },
  { id: 3, title: "Senior Income Tax & Litigation Associate", category: "Tax & GST", type: "Full-Time", experience: "3–7 Years Experience", location: "Gurugram, Haryana", mode: "Hybrid", qualification: "CA Qualified Required", description: "" },
  { id: 4, title: "Company Secretary — Corporate Compliance", category: "Legal & Secretarial", type: "Full-Time", experience: "2–5 Years Experience", location: "Gurugram, Haryana", mode: "On-Site", qualification: "CS (Qualified) — ICSI Member", description: "" },
  { id: 5, title: "Financial Analyst — Valuation & Project Reports", category: "Advisory & Finance", type: "Full-Time", experience: "2–4 Years Experience", location: "Gurugram, Haryana", mode: "Hybrid", qualification: "CA / MBA Finance", description: "" },
];

const emptyForm = { title: "", category: CATEGORIES[0], type: JOB_TYPES[0], experience: "", location: "Gurugram, Haryana", mode: WORK_MODES[0], qualification: "", description: "" };

export default function Dashboard({ onLogout }) {
  const [jobs, setJobs] = useState(INITIAL_JOBS);
  const [tab, setTab] = useState("jobs"); // "jobs" | "add"
  const [filterCat, setFilterCat] = useState("All Roles");
  const [form, setForm] = useState(emptyForm);
  const [editJob, setEditJob] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast] = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const handleSubmit = () => {
    if (!form.title.trim() || !form.experience.trim() || !form.qualification.trim()) return;
    if (editJob) {
      setJobs(jobs.map(j => j.id === editJob.id ? { ...form, id: editJob.id } : j));
      showToast("Job updated successfully!");
      setEditJob(null);
    } else {
      setJobs([{ ...form, id: Date.now() }, ...jobs]);
      showToast("Job posted successfully!");
    }
    setForm(emptyForm);
    setTab("jobs");
  };

  const startEdit = (job) => { setForm({ ...job }); setEditJob(job); setTab("add"); };
  const cancelForm = () => { setForm(emptyForm); setEditJob(null); setTab("jobs"); };
  const confirmDelete = () => { setJobs(jobs.filter(j => j.id !== deleteId)); setDeleteId(null); showToast("Job deleted."); };

  const filtered = filterCat === "All Roles" ? jobs : jobs.filter(j => j.category === filterCat);

  return (
    <div style={{ minHeight: "100vh", background: "#fdf5f6", fontFamily: "'Georgia', serif", display: "flex" }}>

      {/* ── Sidebar ── */}
      <aside style={{
        width: 230, background: "#fff", borderRight: "1px solid #f0d8db",
        display: "flex", flexDirection: "column", padding: "28px 0",
        position: "sticky", top: 0, height: "100vh", flexShrink: 0
      }}>
        <div style={{ padding: "0 22px 24px", borderBottom: "1px solid #f5e0e3" }}>
          <div style={{
            background: "#d1495b", color: "#fff", fontWeight: "bold",
            fontSize: 20, letterSpacing: 4, padding: "7px 14px",
            borderRadius: 8, display: "inline-block"
          }}>ANIX</div>
          <div style={{ fontSize: 10, color: "#bbb", marginTop: 5, letterSpacing: 2, textTransform: "uppercase" }}>Admin Panel</div>
        </div>

        <nav style={{ flex: 1, padding: "18px 10px" }}>
          {[
            { id: "jobs", icon: "📋", label: "All Job Posts", badge: jobs.length },
            { id: "add", icon: editJob ? "✏️" : "➕", label: editJob ? "Edit Job" : "Add New Job" },
          ].map(item => (
            <button key={item.id}
              onClick={() => { if (item.id === "jobs") cancelForm(); else setTab("add"); }}
              style={{
                width: "100%", textAlign: "left", padding: "11px 14px", borderRadius: 9,
                border: "none", background: tab === item.id ? "#fdf0f2" : "transparent",
                color: tab === item.id ? "#d1495b" : "#666",
                fontWeight: tab === item.id ? 700 : 400, fontSize: 13,
                cursor: "pointer", marginBottom: 3, fontFamily: "inherit",
                borderLeft: tab === item.id ? "3px solid #d1495b" : "3px solid transparent",
                display: "flex", justifyContent: "space-between", alignItems: "center"
              }}>
              <span>{item.icon}&nbsp; {item.label}</span>
              {item.badge !== undefined && (
                <span style={{ background: "#d1495b", color: "#fff", borderRadius: 20, padding: "2px 8px", fontSize: 11 }}>{item.badge}</span>
              )}
            </button>
          ))}
        </nav>

        <div style={{ padding: "16px 16px 0", borderTop: "1px solid #f5e0e3" }}>
          <button onClick={onLogout} style={{
            width: "100%", padding: "10px", border: "1.5px solid #f0d0d5",
            borderRadius: 8, background: "transparent", color: "#aaa",
            fontSize: 13, cursor: "pointer", fontFamily: "inherit"
          }}>Sign Out</button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main style={{ flex: 1, padding: "36px 40px", overflowY: "auto" }}>

        {/* Toast */}
        {toast && (
          <div style={{
            position: "fixed", top: 24, right: 28, background: "#d1495b", color: "#fff",
            padding: "12px 26px", borderRadius: 10, fontWeight: 600, fontSize: 14,
            boxShadow: "0 4px 24px rgba(209,73,91,0.3)", zIndex: 1000
          }}>✓ {toast}</div>
        )}

        {/* ── JOBS LIST ── */}
        {tab === "jobs" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
              <div>
                <h1 style={{ margin: 0, fontSize: 30, color: "#1a1a1a", fontWeight: 700, lineHeight: 1.2 }}>
                  Current <span style={{ color: "#d1495b", fontStyle: "italic" }}>Opportunities</span>
                </h1>
                <p style={{ margin: "6px 0 0", color: "#999", fontSize: 14 }}>
                  Roles across audit, tax, legal and corporate finance
                </p>
              </div>
              <button onClick={() => { setEditJob(null); setForm(emptyForm); setTab("add"); }} style={{
                background: "#d1495b", color: "#fff", border: "none", borderRadius: 10,
                padding: "12px 22px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit"
              }}>+ Add New Job</button>
            </div>

            {/* Filter pills */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 26 }}>
              {["All Roles", ...CATEGORIES].map(cat => (
                <button key={cat} onClick={() => setFilterCat(cat)} style={{
                  padding: "8px 18px", borderRadius: 50,
                  border: `1.5px solid ${filterCat === cat ? "#d1495b" : "#f0d0d5"}`,
                  background: filterCat === cat ? "#d1495b" : "#fff",
                  color: filterCat === cat ? "#fff" : "#777",
                  fontSize: 13, cursor: "pointer", fontFamily: "inherit",
                  fontWeight: filterCat === cat ? 700 : 400
                }}>{cat}</button>
              ))}
            </div>

            {/* Job cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {filtered.map(job => {
                const cc = CAT_COLORS[job.category] || CAT_COLORS["Operations"];
                return (
                  <div key={job.id} style={{
                    background: "#fff", borderRadius: 14, padding: "20px 24px",
                    border: "1px solid #f5e0e3", display: "flex", alignItems: "center",
                    justifyContent: "space-between", gap: 16,
                    boxShadow: "0 2px 12px rgba(209,73,91,0.05)"
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center", flexWrap: "wrap" }}>
                        <span style={{ background: cc.bg, color: cc.text, border: `1px solid ${cc.border}`, fontSize: 11, padding: "3px 11px", borderRadius: 20, fontWeight: 700 }}>{job.category}</span>
                        <span style={{ background: "#f5f5f5", color: "#888", fontSize: 11, padding: "3px 11px", borderRadius: 20 }}>{job.type}</span>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: 16, color: "#1a1a1a", marginBottom: 7 }}>{job.title}</div>
                      <div style={{ display: "flex", gap: 18, fontSize: 12, color: "#aaa", flexWrap: "wrap" }}>
                        <span>⏱ {job.experience}</span>
                        <span>📍 {job.location} ({job.mode})</span>
                        <span>🎓 {job.qualification}</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                      <button onClick={() => startEdit(job)} style={{
                        padding: "8px 16px", border: "1.5px solid #f0d0d5", borderRadius: 8,
                        background: "#fff", color: "#d1495b", fontSize: 13,
                        cursor: "pointer", fontFamily: "inherit", fontWeight: 600
                      }}>Edit</button>
                      <button onClick={() => setDeleteId(job.id)} style={{
                        padding: "8px 16px", border: "1.5px solid #ffd0d0", borderRadius: 8,
                        background: "#fff5f5", color: "#c0392b", fontSize: 13, cursor: "pointer", fontFamily: "inherit"
                      }}>Delete</button>
                    </div>
                  </div>
                );
              })}
              {filtered.length === 0 && (
                <div style={{ textAlign: "center", padding: 60, color: "#ddd", fontSize: 16 }}>
                  No jobs in this category.
                </div>
              )}
            </div>
          </>
        )}

        {/* ── ADD / EDIT FORM ── */}
        {tab === "add" && (
          <>
            <div style={{ marginBottom: 28 }}>
              <h1 style={{ margin: 0, fontSize: 30, color: "#1a1a1a", fontWeight: 700 }}>
                {editJob ? <>Edit <span style={{ color: "#d1495b", fontStyle: "italic" }}>Job Post</span></> : <>Add <span style={{ color: "#d1495b", fontStyle: "italic" }}>New Job</span></>}
              </h1>
              <p style={{ margin: "6px 0 0", color: "#999", fontSize: 14 }}>
                {editJob ? "Update the details below and save." : "Fill in the details to publish a new opportunity."}
              </p>
            </div>

            <div style={{
              background: "#fff", borderRadius: 18, padding: "36px 40px",
              border: "1px solid #f5e0e3", maxWidth: 680,
              boxShadow: "0 2px 16px rgba(209,73,91,0.06)"
            }}>
              <Field label="Job Title *">
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Audit Manager — Statutory & Internal" style={iStyle} />
              </Field>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 22 }}>
                <Field label="Category">
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={iStyle}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="Job Type">
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={iStyle}>
                    {JOB_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </Field>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 22 }}>
                <Field label="Experience Required *">
                  <input value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })}
                    placeholder="e.g. 3–6 Years Experience" style={iStyle} />
                </Field>
                <Field label="Work Mode">
                  <select value={form.mode} onChange={e => setForm({ ...form, mode: e.target.value })} style={iStyle}>
                    {WORK_MODES.map(m => <option key={m}>{m}</option>)}
                  </select>
                </Field>
              </div>

              <Field label="Location">
                <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}
                  placeholder="e.g. Gurugram, Haryana" style={iStyle} />
              </Field>

              <Field label="Qualification Required *">
                <input value={form.qualification} onChange={e => setForm({ ...form, qualification: e.target.value })}
                  placeholder="e.g. CA Qualified Preferred" style={iStyle} />
              </Field>

              <Field label="Job Description (optional)">
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe the role, responsibilities, and requirements..."
                  rows={4} style={{ ...iStyle, resize: "vertical", lineHeight: 1.7 }} />
              </Field>

              <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                <button onClick={handleSubmit} style={{
                  padding: "13px 34px", background: "#d1495b", color: "#fff", border: "none",
                  borderRadius: 11, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit"
                }}>
                  {editJob ? "Update Job →" : "Post Job →"}
                </button>
                <button onClick={cancelForm} style={{
                  padding: "13px 24px", background: "transparent", color: "#aaa",
                  border: "1.5px solid #f0d0d5", borderRadius: 11, fontSize: 15,
                  cursor: "pointer", fontFamily: "inherit"
                }}>Cancel</button>
              </div>
            </div>
          </>
        )}
      </main>

      {/* ── Delete Modal ── */}
      {deleteId && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999
        }}>
          <div style={{
            background: "#fff", borderRadius: 18, padding: "40px 44px",
            maxWidth: 360, textAlign: "center", boxShadow: "0 12px 48px rgba(0,0,0,0.15)"
          }}>
            <div style={{ fontSize: 38, marginBottom: 14 }}>🗑️</div>
            <h3 style={{ margin: "0 0 10px", fontSize: 20, color: "#1a1a1a" }}>Delete this job?</h3>
            <p style={{ color: "#aaa", fontSize: 14, marginBottom: 26 }}>This action cannot be undone.</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button onClick={confirmDelete} style={{
                padding: "11px 26px", background: "#d1495b", color: "#fff",
                border: "none", borderRadius: 9, fontSize: 14, fontWeight: 700, cursor: "pointer"
              }}>Yes, Delete</button>
              <button onClick={() => setDeleteId(null)} style={{
                padding: "11px 22px", background: "#f5f5f5", color: "#666",
                border: "none", borderRadius: 9, fontSize: 14, cursor: "pointer"
              }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Small helper wrapper
function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#666", marginBottom: 8, letterSpacing: 1, textTransform: "uppercase" }}>{label}</label>
      {children}
    </div>
  );
}

const iStyle = {
  width: "100%", padding: "12px 15px", border: "1.5px solid #f0d0d5",
  borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box",
  fontFamily: "Georgia, serif", background: "#fff9fa", color: "#1a1a1a"
};