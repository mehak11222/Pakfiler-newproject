import { LocalStorage } from "./localStorage"

// Constants for storage keys
const AUTH_TOKEN_KEY = "auth_token"
const USER_DATA_KEY = "user_data"

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
    return LocalStorage.hasKey(AUTH_TOKEN_KEY)
}

/**
 * Get current user information
 */
export function getCurrentUser() {
    return LocalStorage.getItem(USER_DATA_KEY, true)
}

/**
 * Get authentication token
 */
export function getAuthToken(): string | null {
    return LocalStorage.getItem<string>(AUTH_TOKEN_KEY, false)
}

/**
 * Set authentication data
 */
export function setAuthData(token: string, userData: any): void {
    LocalStorage.setItem(AUTH_TOKEN_KEY, token)
    LocalStorage.setItem(USER_DATA_KEY, userData)
}

/**
 * Clear authentication data (logout)
 */
export function clearAuthData(): void {
    LocalStorage.removeItem(AUTH_TOKEN_KEY)
    LocalStorage.removeItem(USER_DATA_KEY)
}

/**
 * Check if user has specific role
 */
export function hasRole(role: string): boolean {
    const user: any = getCurrentUser()
    return user?.role === role
}
