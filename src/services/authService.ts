// Authentication Service - Mock API calls for now
// TODO: Replace with actual API integration

import { User, UserRole } from "@/types";

const MOCK_DELAY = 1000;

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupData extends LoginCredentials {
  name: string;
  role: UserRole;
  phone: string;
  institution?: string;
  department?: string;
}

// Mock JWT token
const generateMockToken = (user: User): string => {
  return `mock_token_${user.id}_${Date.now()}`;
};

export const authService = {
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    console.log("[API] POST /api/auth/login", credentials);
    
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));

    // Mock validation
    if (!credentials.email || !credentials.password) {
      throw new Error("Email and password are required");
    }

    // Mock successful login
    const mockUser: User = {
      id: "user_" + Math.random().toString(36).substr(2, 9),
      name: credentials.email.includes("professor") ? "Dr. Sarah Johnson" : "Alex Thompson",
      email: credentials.email,
      role: credentials.email.includes("professor") ? "professor" : "student",
      phone: "+1-555-0123",
      institution: "UC Berkeley",
      department: "Computer Science",
      preferences: {
        timezone: "America/Los_Angeles",
        voicePreference: "female",
        callReminders: true,
      },
      createdAt: new Date().toISOString(),
    };

    const token = generateMockToken(mockUser);
    
    return { user: mockUser, token };
  },

  async signup(data: SignupData): Promise<{ user: User; token: string }> {
    console.log("[API] POST /api/auth/register", data);
    
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));

    // Mock validation
    if (!data.email || !data.password || !data.name) {
      throw new Error("All fields are required");
    }

    if (data.password.length < 8) {
      throw new Error("Password must be at least 8 characters");
    }

    // Mock successful signup
    const mockUser: User = {
      id: "user_" + Math.random().toString(36).substr(2, 9),
      name: data.name,
      email: data.email,
      role: data.role,
      phone: data.phone,
      institution: data.institution,
      department: data.department,
      preferences: {
        timezone: "America/Los_Angeles",
        voicePreference: "female",
        callReminders: true,
      },
      createdAt: new Date().toISOString(),
    };

    const token = generateMockToken(mockUser);
    
    return { user: mockUser, token };
  },

  async logout(): Promise<void> {
    console.log("[API] POST /api/auth/logout");
    await new Promise(resolve => setTimeout(resolve, 500));
    // Clear local storage handled by caller
  },

  async verifyToken(token: string): Promise<User | null> {
    console.log("[API] GET /api/auth/verify");
    
    // Mock token validation
    if (!token || !token.startsWith("mock_token_")) {
      return null;
    }

    // Mock user retrieval from token
    const mockUser: User = {
      id: "user_verified",
      name: "Verified User",
      email: "user@example.com",
      role: "student",
      phone: "+1-555-0123",
      preferences: {
        timezone: "America/Los_Angeles",
        voicePreference: "female",
        callReminders: true,
      },
      createdAt: new Date().toISOString(),
    };

    return mockUser;
  },

  async resetPassword(email: string): Promise<void> {
    console.log("[API] POST /api/auth/reset-password", { email });
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
    
    if (!email) {
      throw new Error("Email is required");
    }

    // Mock success
    console.log("Password reset email sent (mock)");
  },
};
