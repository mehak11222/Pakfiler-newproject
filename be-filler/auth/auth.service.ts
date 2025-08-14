import axios from "axios";
import Cookies from "js-cookie";
import { environment } from "@/environment/environment";

class AuthService {
  private cookieKey = "token";
  private baseUrl = environment.apiUrl + "/api/v1/auth";

  async login(credentials: any): Promise<any> {
    let data = { ...credentials }
    try {
      const response = await axios.post<any>(
        `${this.baseUrl}/login`,
        data
      );
      if (response.data.token) {
        this.setToken(response.data.token);
      } else {
        return null;
      }

      return response;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  async loginNoHash(credentials: any): Promise<any> {
    let data = { ...credentials }
    try {
      const response = await axios.post<any>(
        `${this.baseUrl}/login/no-hash`,
        data
      );
      if (response.data.token) {
        this.setToken(response.data.token);
      } else {
        return null;
      }

      return response;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  async logout(): Promise<any> {
    const token = this.getToken();
    try {
      await axios.get(`${this.baseUrl}/logout`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      this.clearToken();
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  }

  async logoutOfAllDevices(): Promise<any> {
    const token = this.getToken();
    try {
      await axios.get(`${this.baseUrl}/logoutOfAllDevices`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      this.clearToken();
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  }

  async logoutUserOfAllDevices(id: string): Promise<any> {
    const token = this.getToken();
    try {
      await axios.post(`${this.baseUrl}/logoutUserOfAllDevices`, { id }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  }

  setToken(token: string): void {
    // Set the token as an HTTP-only cookie
    Cookies.set(this.cookieKey, token); // Ensure secure cookies
  }

  getToken(): string | undefined {
    return Cookies.get(this.cookieKey);
  }

  clearToken(): void {
    Cookies.remove(this.cookieKey);
    Cookies.remove("user");
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== null && token !== undefined;
  }
}

export default AuthService;
