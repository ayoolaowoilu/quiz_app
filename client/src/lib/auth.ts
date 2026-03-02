

// types/auth.ts
type UserDetails = {
  email: string;
  password: string;
};

type AuthResponse = {
  success: boolean;
  msg: string;
  token:string
  data: {
    token: string;
    user?: any;
  };
  error?: string;
};

// lib/auth.ts
const API_URL = import.meta.env.VITE_URL || "http://localhost:1234";


const getAuthHeaders = (token?: string) => ({
  "Content-Type": "application/json",
  ...(token && { "Authorization": `Bearer ${token}` }) 
});


const fetchWithError = async (url: string, options: RequestInit) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(url, {
      ...options,
      headers: {
        ...getAuthHeaders(token || undefined), // Use stored token if available
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.msg || `HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (err: any) {
    if (err.name === 'TypeError' || err.message.includes('fetch')) {
      throw new Error('Network Error: Check your internet connection');
    }
    throw err;
  }
};

// Get user profile
const getUserData = async () => {
  const token = localStorage.getItem("token");
  
  if (!token) {
    throw new Error('No authentication token found');
  }

  try {
    const data = await fetchWithError(`${API_URL}/auth/profile`, {
      method: "GET",
      headers: getAuthHeaders(token),
    });
   
    console.log(data)
    

    if (!data.success && data.error) {
      throw new Error(data.msg || 'Failed to fetch user data');
    }
   
    const user = data.data || data;
    if (user.username) localStorage.setItem("username", user.username);
    if (user.id) localStorage.setItem("id", user.id);
    if (user.email) localStorage.setItem("email", user.email);

    return data;
  } catch (err: any) {
    if (err.message.includes('401') || err.message.includes('403')) {
      localStorage.removeItem('token');
    }
    throw err;
  }
};

// Login
const loginAuth = async (credentials: UserDetails): Promise<AuthResponse> => {
  if (!credentials.email || !credentials.password) {
    throw new Error('Email and password are required');
  }

  try {
    const data = await fetchWithError(`${API_URL}/auth/login`, {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    // FIXED: Check data.data.token instead of just data.token
    if (data.error) {
      throw new Error(data.msg || data.error || 'Login failed');
    }

    // FIXED: Token is usually in data.data.token based on your AuthResponse type
    const token = data.data?.token || data.token;
    if (token) {
      localStorage.setItem("token", token);
      // Fetch user data after storing token
      try {
        await getUserData();
      } catch (err) {
        console.warn('Failed to fetch user data after login:', err);
        // Don't fail login if profile fetch fails
      }
    } else {
      throw new Error('No token received from server');
    }

    return data;
  } catch (err: any) {
    localStorage.removeItem('token');
    throw err;
  }
};

// Register
const registerAuth = async (credentials: UserDetails): Promise<AuthResponse> => {
  if (!credentials.email || !credentials.password) {
    throw new Error('Email and password are required');
  }

  if (credentials.password.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }

  try {
    const data = await fetchWithError(`${API_URL}/auth/register`, {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    console.log(data)

    if (data.error) {
      throw new Error(data.msg || data.error || 'Registration failed');
    }
    
    // FIXED: Check data.data.token instead of data.token
    const token = data.data?.token || data.token;
    if (token) {
      localStorage.setItem("token", token);
    }
    
    return data;
  } catch (err: any) {
    throw err;
  }
};

const checkUsername = async(id:any,username:string):Promise<any> =>{
    try{
        const posted = await fetch(`${API_URL}/auth/setusername`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
         },body:JSON.stringify({id:id,username:username})
        })  
      
        if (!posted.ok) {
          return { msg: "There was an error fetching username" }
          }

        const displayed = await posted.json()
        return displayed;} catch(e){
        console.log(e)
    }}

// Logout
const logoutAuth = (type:string) => {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  localStorage.removeItem("id");
  localStorage.removeItem("email");
   if(type === "App"){
       window.location.href = '/login?appauth=true';
   }else if(type === "AppReg"){
         window.location.href = '/reg?appauth=true';
   }else{
       window.location.href = '/login';
   }
};


const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

export { 
  loginAuth, 
  getUserData, 
  registerAuth, 
  logoutAuth,
  isAuthenticated,
  checkUsername,
  type UserDetails,
  type AuthResponse 
};