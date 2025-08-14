import { LocalStorage } from "@/services/localStorage/localStorage"

// Constants for storage keys
export const AUTH_TOKEN_KEY = "auth_token"
export const USER_DATA_KEY = "user_data"
export const REMEMBER_ME_KEY = "remember_me"

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
    return !!LocalStorage.getItem<string>(AUTH_TOKEN_KEY, false)
}

/**
 * Get current user information
 */
export function getCurrentUser<T>(): T | null | string {
    return LocalStorage.getItem<T>(USER_DATA_KEY, true)
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
export function setAuthData(token: string, userData: any, rememberMe: boolean = false): void {
    LocalStorage.setItem(AUTH_TOKEN_KEY, token)
    LocalStorage.setItem(USER_DATA_KEY, userData)
    LocalStorage.setItem(REMEMBER_ME_KEY, rememberMe)

    // Also set cookies for server-side access if needed
    setCookie(AUTH_TOKEN_KEY, token, rememberMe ? 30 : 1)
    if (userData?.role) {
        setCookie("user_role", userData.role, rememberMe ? 30 : 1)
    }
}

/**
 * Clear authentication data (logout)
 */
export function clearAuthData(): void {
    LocalStorage.removeItem(AUTH_TOKEN_KEY)
    LocalStorage.removeItem(USER_DATA_KEY)
    LocalStorage.removeItem(REMEMBER_ME_KEY)

    // Clear cookies
    setCookie(AUTH_TOKEN_KEY, "", -1)
    setCookie("user_role", "", -1)
}

/**
 * Check if user has specific role
 */
export function hasRole(role: string): boolean {
    const user: any = getCurrentUser()
    return user?.role === role
}

/**
 * Set a cookie with the specified expiration
 */
function setCookie(name: string, value: string, daysToExpire: number): void {
    if (typeof document === "undefined") return // Only run in browser

    const date = new Date()
    date.setTime(date.getTime() + daysToExpire * 24 * 60 * 60 * 1000)
    const expires = `expires=${date.toUTCString()}`
    document.cookie = `${name}=${value}; ${expires}; path=/; SameSite=Lax`
}
