const BASE_URL = "https://anaxbacl.vercel.app/";

export const getToken = () => localStorage.getItem("anix_token");
export const setToken = (t) => localStorage.setItem("anix_token", t);
export const removeToken = () => localStorage.removeItem("anix_token");

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

// ── Auth ──────────────────────────────────────────────────────────
export const loginAdmin = async ({ username, password }) => {
  const res = await fetch(`${BASE_URL}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Login failed.");
  return data; // { success, token }
};

// ── Jobs ──────────────────────────────────────────────────────────
export const fetchJobs = async () => {
  const res = await fetch(`${BASE_URL}/api/jobs/admin/all`, {
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch jobs.");
  return data.jobs;
};

export const createJob = async (payload) => {
  const res = await fetch(`${BASE_URL}/api/jobs`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to create job.");
  return data.job;
};

export const updateJob = async ({ id, ...payload }) => {
  const res = await fetch(`${BASE_URL}/api/jobs/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update job.");
  return data.job;
};

export const deleteJob = async (id) => {
  const res = await fetch(`${BASE_URL}/api/jobs/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to delete job.");
  return data;
};