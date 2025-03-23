
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const baseUrl = import.meta.env.VITE_BASE_URL;

type User = {
  id: string;
  name: string;
  email: string;
  role: "staff" | "admin";
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Set up axios interceptor for authentication
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    return () => {
      delete axios.defaults.headers.common['Authorization'];
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token && role) {
      const parsedRole = JSON.parse(role);
      setUser({
        id: '1',  // We'll use a placeholder ID since it's not provided in the token
        name: 'Staff User',  // Placeholder name
        email: '',  // Email not available from token
        role: parsedRole
      });
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      const response = await axios.post(`${baseUrl}/auth/signin`, 
        { email, password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (response.data.token) {
        const token = response.data.token;
        localStorage.setItem('token', token);
        localStorage.setItem('role', JSON.stringify(response.data.role));
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        setUser({
          id: '1',  // Placeholder ID
          name: 'Staff User',  // Placeholder name
          email: email,
          role: response.data.role
        });

        toast.success('Login successful!');
        
        if (response.data.role === 'staff' || response.data.role === 'admin') {
          navigate('/staff/dashboard');
        }
      }
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Login failed. Please check your credentials.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    delete axios.defaults.headers.common['Authorization'];
    toast.info("You've been logged out");
    navigate('/staff/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
