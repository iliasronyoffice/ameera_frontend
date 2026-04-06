// lib/fetchWithAuth.js
export const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  const guestId = localStorage.getItem('guest_id');

  const defaultOptions = {
    method: 'POST', // Your API uses POST
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
  };

  // Add user_id or temp_user_id to body if it's a POST request
  if (options.method === 'POST' || !options.method) {
    const body = options.body ? JSON.parse(options.body) : {};
    
    if (token && user) {
      body.user_id = JSON.parse(user).id;
    } else if (guestId) {
      body.temp_user_id = guestId;
    }
    
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Request failed');
  }

  return response.json();
};