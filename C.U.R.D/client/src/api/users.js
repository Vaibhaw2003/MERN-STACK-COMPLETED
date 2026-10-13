const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/+$/, "");

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        "Cannot reach the server. Start the backend and verify its MongoDB connection.",
        { cause: error },
      );
    }
    throw error;
  }

  if (response.status === 204) {
    return null;
  }

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}.`);
  }

  return data;
}

export function getUsers() {
  return request("/users");
}

export function createUser(user) {
  return request("/users", {
    method: "POST",
    body: JSON.stringify(user),
  });
}

export function updateUser(id, user) {
  return request(`/users/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(user),
  });
}

export function deleteUser(id) {
  return request(`/users/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}
