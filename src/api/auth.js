const testMode = true;

async function request(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const error = new Error(data.message || "error");
    error.status = res.status;
    throw error;
  }
  return data;
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function registerRequest(username, password) {
  if (testMode) {
    await wait(400);
    return {};
  }
  return request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export async function loginRequest(username, password) {
  if (testMode) {
    await wait(400);
    localStorage.setItem("testUser", username);
    return { token: "fake-token", user: { username } };
  }
  return request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export async function meRequest(token) {
  if (testMode) {
    await wait(200);
    return { username: localStorage.getItem("testUser")};
  }
  return request("/api/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
}
