import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchJobs, createJob, updateJob, deleteJob } from "../../api/api";

const CATEGORIES = ["Audit & Assurance", "Tax & GST", "Legal & Secretarial", "Advisory & Finance", "Operations"];
const JOB_TYPES  = ["Full-Time", "Part-Time", "Contract", "Internship"];
const WORK_MODES = ["On-Site", "Hybrid", "Remote"];

const CAT_COLORS = {
  "Audit & Assurance":   { bg: "#fff0f3", text: "#c0392b", border: "#f5c6cb" },
  "Tax & GST":           { bg: "#fff3e0", text: "#e65100", border: "#ffcc80" },
  "Legal & Secretarial": { bg: "#e8f5e9", text: "#2e7d32", border: "#a5d6a7" },
  "Advisory & Finance":  { bg: "#e3f2fd", text: "#1565c0", border: "#90caf9" },
  "Operations":          { bg: "#f3e5f5", text: "#6a1b9a", border: "#ce93d8" },
};

const emptyForm = {
  title: "", category: CATEGORIES[0], jobType: JOB_TYPES[0],
  experience: "", location: "Gurugram, Haryana", workMode: WORK_MODES[0],
  qualification: "", description: "",
};

const jobToForm = (job) => ({
  title:         job.title,
  category:      job.category,
  jobType:       job.jobType,
  experience:    job.experience,
  location:      job.location,
  workMode:      job.workMode,
  qualification: job.qualification,
  description:   job.description || "",
});

// Inject responsive CSS once
const css = `
  * { box-sizing: border-box; }
  .anix-sidebar {
    width: 230px;
    background: #fff;
    border-right: 1px solid #f0d8db;
    display: flex;
    flex-direction: column;
    padding: 28px 0;
    position: sticky;
    top: 0;
    height: 100vh;
    flex-shrink: 0;
    transition: transform 0.25s ease;
    z-index: 200;
  }
  .anix-overlay {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.35);
    z-index: 199;
  }
  .anix-topbar { display: none; }
  .anix-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin-bottom: 22px; }
  .anix-form-pad { padding: 36px 40px; }
  .anix-main-pad { padding: 36px 40px; }
  .anix-card { flex-direction: row; align-items: center; }
  .anix-card-actions { flex-direction: row; }
  .anix-filter-scroll { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 26px; }

  @media (max-width: 768px) {
    .anix-sidebar {
      position: fixed;
      left: 0; top: 0;
      height: 100vh;
      transform: translateX(-100%);
    }
    .anix-sidebar.open {
      transform: translateX(0);
    }
    .anix-overlay.open {
      display: block;
    }
    .anix-topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 18px;
      background: #fff;
      border-bottom: 1px solid #f0d8db;
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .anix-main-pad { padding: 20px 16px; }
    .anix-form-pad { padding: 22px 18px; }
    .anix-grid-2 { grid-template-columns: 1fr; }
    .anix-card { flex-direction: column; align-items: flex-start; }
    .anix-card-actions { flex-direction: row; width: 100%; justify-content: flex-end; margin-top: 12px; }
    .anix-filter-scroll { flex-wrap: nowrap; overflow-x: auto; padding-bottom: 6px; -webkit-overflow-scrolling: touch; }
    .anix-filter-scroll::-webkit-scrollbar { display: none; }
    .anix-header-row { flex-direction: column; gap: 12px; align-items: flex-start !important; }
    .anix-header-row button { width: 100%; }
  }
`;

if (!document.getElementById("anix-responsive-css")) {
  const style = document.createElement("style");
  style.id = "anix-responsive-css";
  style.textContent = css;
  document.head.appendChild(style);
}

export default function Dashboard({ onLogout }) {
  const qc = useQueryClient();

  const [tab,       setTab]       = useState("jobs");
  const [filterCat, setFilterCat] = useState("All Roles");
  const [form,      setForm]      = useState(emptyForm);
  const [editJob,   setEditJob]   = useState(null);
  const [deleteId,  setDeleteId]  = useState(null);
  const [toast,     setToast]     = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const { data: jobs = [], isLoading, isError } = useQuery({
    queryKey: ["jobs"],
    queryFn: fetchJobs,
    staleTime: 30_000,
  });

  const createMutation = useMutation({
    mutationFn: createJob,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["jobs"] });
      showToast("Job posted successfully!");
      setForm(emptyForm);
      setTab("jobs");
    },
    onError: (err) => showToast(`Error: ${err.message}`),
  });

  const updateMutation = useMutation({
    mutationFn: updateJob,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["jobs"] });
      showToast("Job updated successfully!");
      setForm(emptyForm);
      setEditJob(null);
      setTab("jobs");
    },
    onError: (err) => showToast(`Error: ${err.message}`),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteJob,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["jobs"] });
      setDeleteId(null);
      showToast("Job deleted.");
    },
    onError: (err) => showToast(`Error: ${err.message}`),
  });

  const handleSubmit = () => {
    if (!form.title.trim() || !form.experience.trim() || !form.qualification.trim()) return;
    if (editJob) {
      updateMutation.mutate({ id: editJob._id, ...form });
    } else {
      createMutation.mutate(form);
    }
  };

  const startEdit = (job) => {
    setForm(jobToForm(job));
    setEditJob(job);
    setTab("add");
    setSidebarOpen(false);
  };

  const cancelForm = () => {
    setForm(emptyForm);
    setEditJob(null);
    setTab("jobs");
  };

  const activeJobs = jobs.filter(j => j.isActive);

  const filtered = filterCat === "All Roles"
    ? activeJobs
    : activeJobs.filter(j => j.category === filterCat);

  const isBusy = createMutation.isPending || updateMutation.isPending;

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div style={{ minHeight: "100vh", background: "#fdf5f6", fontFamily: "'Georgia', serif", display: "flex", flexDirection: "column" }}>

      {/* ── Mobile Top Bar ─────────────────────────────────────── */}
      <div className="anix-topbar">
        <button onClick={() => setSidebarOpen(true)} style={{
          background: "none", border: "none", cursor: "pointer", padding: 6,
          display: "flex", flexDirection: "column", gap: 5
        }}>
          <span style={{ display: "block", width: 22, height: 2, background: "#d1495b", borderRadius: 2 }} />
          <span style={{ display: "block", width: 22, height: 2, background: "#d1495b", borderRadius: 2 }} />
          <span style={{ display: "block", width: 22, height: 2, background: "#d1495b", borderRadius: 2 }} />
        </button>
        <div style={{ background: "#d1495b", color: "#fff", fontWeight: "bold", fontSize: 16, letterSpacing: 4, padding: "5px 12px", borderRadius: 7 }}>ANIX</div>
        <button onClick={() => { setEditJob(null); setForm(emptyForm); setTab("add"); }} style={{
          background: "#d1495b", color: "#fff", border: "none", borderRadius: 8,
          padding: "8px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit"
        }}>+ Add</button>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* ── Overlay ───────────────────────────────────────────── */}
        <div className={`anix-overlay${sidebarOpen ? " open" : ""}`} onClick={closeSidebar} />

        {/* ── Sidebar ─────────────────────────────────────────────── */}
        <aside className={`anix-sidebar${sidebarOpen ? " open" : ""}`}>
          <div style={{ padding: "0 22px 24px", borderBottom: "1px solid #f5e0e3", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{
                background: "#d1495b", color: "#fff", fontWeight: "bold",
                fontSize: 20, letterSpacing: 4, padding: "7px 14px",
                borderRadius: 8, display: "inline-block"
              }}>ANIX</div>
              <div style={{ fontSize: 10, color: "#bbb", marginTop: 5, letterSpacing: 2, textTransform: "uppercase" }}>Admin Panel</div>
            </div>
            {/* Close button — only visible on mobile via CSS would need extra class, use inline style trick */}
            <button onClick={closeSidebar} style={{
              background: "none", border: "none", cursor: "pointer", fontSize: 20,
              color: "#ccc", lineHeight: 1, padding: 4
            }}>✕</button>
          </div>

          <nav style={{ flex: 1, padding: "18px 10px" }}>
            {[
              { id: "jobs", icon: "📋", label: "All Job Posts", badge: activeJobs.length },
              { id: "add", icon: editJob ? "✏️" : "➕", label: editJob ? "Edit Job" : "Add New Job" },
            ].map(item => (
              <button key={item.id}
                onClick={() => {
                  item.id === "jobs" ? cancelForm() : setTab("add");
                  closeSidebar();
                }}
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

        {/* ── Main ────────────────────────────────────────────────── */}
        <main className="anix-main-pad" style={{ flex: 1, overflowY: "auto" }}>

          {/* Toast */}
          {toast && (
            <div style={{
              position: "fixed", top: 24, right: 16, left: 16, maxWidth: 360,
              margin: "0 auto", background: "#d1495b", color: "#fff",
              padding: "12px 26px", borderRadius: 10, fontWeight: 600, fontSize: 14,
              boxShadow: "0 4px 24px rgba(209,73,91,0.3)", zIndex: 1000, textAlign: "center"
            }}>✓ {toast}</div>
          )}

          {/* ── JOBS LIST ──────────────────────────────────────────── */}
          {tab === "jobs" && (
            <>
              <div className="anix-header-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
                <div>
                  <h1 style={{ margin: 0, fontSize: 26, color: "#1a1a1a", fontWeight: 700, lineHeight: 1.2 }}>
                    Current <span style={{ color: "#d1495b", fontStyle: "italic" }}>Opportunities</span>
                  </h1>
                  <p style={{ margin: "6px 0 0", color: "#999", fontSize: 13 }}>
                    Roles across audit, tax, legal and corporate finance
                  </p>
                </div>
                <button onClick={() => { setEditJob(null); setForm(emptyForm); setTab("add"); }} style={{
                  background: "#d1495b", color: "#fff", border: "none", borderRadius: 10,
                  padding: "12px 22px", fontSize: 14, fontWeight: 700, cursor: "pointer",
                  fontFamily: "inherit", flexShrink: 0
                }}>+ Add New Job</button>
              </div>

              {/* Filter pills */}
              <div className="anix-filter-scroll">
                {["All Roles", ...CATEGORIES].map(cat => (
                  <button key={cat} onClick={() => setFilterCat(cat)} style={{
                    padding: "8px 16px", borderRadius: 50, whiteSpace: "nowrap",
                    border: `1.5px solid ${filterCat === cat ? "#d1495b" : "#f0d0d5"}`,
                    background: filterCat === cat ? "#d1495b" : "#fff",
                    color: filterCat === cat ? "#fff" : "#777",
                    fontSize: 13, cursor: "pointer", fontFamily: "inherit",
                    fontWeight: filterCat === cat ? 700 : 400, flexShrink: 0
                  }}>{cat}</button>
                ))}
              </div>

              {isLoading && (
                <div style={{ textAlign: "center", padding: 60, color: "#d1495b", fontSize: 15 }}>Loading jobs...</div>
              )}
              {isError && (
                <div style={{ textAlign: "center", padding: 60, color: "#c0392b", fontSize: 15 }}>Failed to load jobs.</div>
              )}

              {!isLoading && !isError && (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {filtered.map(job => {
                    const cc = CAT_COLORS[job.category] || CAT_COLORS["Operations"];
                    return (
                      <div key={job._id} className="anix-card" style={{
                        background: "#fff", borderRadius: 14, padding: "18px 20px",
                        border: "1px solid #f5e0e3", display: "flex",
                        justifyContent: "space-between", gap: 12,
                        boxShadow: "0 2px 12px rgba(209,73,91,0.05)"
                      }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center", flexWrap: "wrap" }}>
                            <span style={{ background: cc.bg, color: cc.text, border: `1px solid ${cc.border}`, fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 700 }}>{job.category}</span>
                            <span style={{ background: "#f5f5f5", color: "#888", fontSize: 11, padding: "3px 10px", borderRadius: 20 }}>{job.jobType}</span>
                          </div>
                          <div style={{ fontWeight: 700, fontSize: 15, color: "#1a1a1a", marginBottom: 7, wordBreak: "break-word" }}>{job.title}</div>
                          <div style={{ display: "flex", gap: 12, fontSize: 12, color: "#aaa", flexWrap: "wrap" }}>
                            <span>⏱ {job.experience}</span>
                            <span>📍 {job.location} ({job.workMode})</span>
                            <span>🎓 {job.qualification}</span>
                          </div>
                        </div>
                        <div className="anix-card-actions" style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                          <button onClick={() => startEdit(job)} style={{
                            padding: "8px 14px", border: "1.5px solid #f0d0d5", borderRadius: 8,
                            background: "#fff", color: "#d1495b", fontSize: 13,
                            cursor: "pointer", fontFamily: "inherit", fontWeight: 600
                          }}>Edit</button>
                          <button onClick={() => setDeleteId(job._id)} style={{
                            padding: "8px 14px", border: "1.5px solid #ffd0d0", borderRadius: 8,
                            background: "#fff5f5", color: "#c0392b", fontSize: 13,
                            cursor: "pointer", fontFamily: "inherit"
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
              )}
            </>
          )}

          {/* ── ADD / EDIT FORM ─────────────────────────────────── */}
          {tab === "add" && (
            <>
              <div style={{ marginBottom: 24 }}>
                <h1 style={{ margin: 0, fontSize: 26, color: "#1a1a1a", fontWeight: 700 }}>
                  {editJob
                    ? <>Edit <span style={{ color: "#d1495b", fontStyle: "italic" }}>Job Post</span></>
                    : <>Add <span style={{ color: "#d1495b", fontStyle: "italic" }}>New Job</span></>}
                </h1>
                <p style={{ margin: "6px 0 0", color: "#999", fontSize: 13 }}>
                  {editJob ? "Update the details below and save." : "Fill in the details to publish a new opportunity."}
                </p>
              </div>

              <div className="anix-form-pad" style={{
                background: "#fff", borderRadius: 18,
                border: "1px solid #f5e0e3", maxWidth: 680,
                boxShadow: "0 2px 16px rgba(209,73,91,0.06)"
              }}>
                <Field label="Job Title *">
                  <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Audit Manager — Statutory & Internal" style={iStyle} />
                </Field>

                <div className="anix-grid-2">
                  <Field label="Category">
                    <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={iStyle}>
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </Field>
                  <Field label="Job Type">
                    <select value={form.jobType} onChange={e => setForm({ ...form, jobType: e.target.value })} style={iStyle}>
                      {JOB_TYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </Field>
                </div>

                <div className="anix-grid-2">
                  <Field label="Experience Required *">
                    <input value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })}
                      placeholder="e.g. 3–6 Years" style={iStyle} />
                  </Field>
                  <Field label="Work Mode">
                    <select value={form.workMode} onChange={e => setForm({ ...form, workMode: e.target.value })} style={iStyle}>
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

                <div style={{ display: "flex", gap: 12, marginTop: 8, flexWrap: "wrap" }}>
                  <button onClick={handleSubmit} disabled={isBusy} style={{
                    padding: "13px 34px", background: isBusy ? "#e8949e" : "#d1495b", color: "#fff",
                    border: "none", borderRadius: 11, fontSize: 15, fontWeight: 700,
                    cursor: isBusy ? "not-allowed" : "pointer", fontFamily: "inherit"
                  }}>
                    {isBusy ? "Saving..." : editJob ? "Update Job →" : "Post Job →"}
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
      </div>

      {/* ── Delete Modal ──────────────────────────────────────────── */}
      {deleteId && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999,
          padding: "0 16px"
        }}>
          <div style={{
            background: "#fff", borderRadius: 18, padding: "36px 32px",
            width: "100%", maxWidth: 360, textAlign: "center",
            boxShadow: "0 12px 48px rgba(0,0,0,0.15)"
          }}>
            <div style={{ fontSize: 38, marginBottom: 14 }}>🗑️</div>
            <h3 style={{ margin: "0 0 10px", fontSize: 20, color: "#1a1a1a" }}>Delete this job?</h3>
            <p style={{ color: "#aaa", fontSize: 14, marginBottom: 26 }}>This action cannot be undone.</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button
                onClick={() => deleteMutation.mutate(deleteId)}
                disabled={deleteMutation.isPending}
                style={{
                  padding: "11px 26px", background: "#d1495b", color: "#fff",
                  border: "none", borderRadius: 9, fontSize: 14, fontWeight: 700,
                  cursor: deleteMutation.isPending ? "not-allowed" : "pointer"
                }}>
                {deleteMutation.isPending ? "Deleting..." : "Yes, Delete"}
              </button>
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