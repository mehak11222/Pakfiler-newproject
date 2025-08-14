// lib/localStorage.ts

/**
 * A reusable utility for handling localStorage operations with browser compatibility checks
 */
export const LocalStorage = {
    /**
     * Checks if code is running in a browser environment
     */
    isBrowser(): boolean {
        return typeof window !== 'undefined';
    },

    /**
     * Store data in localStorage
     * @param key Storage key
     * @param value Value to store (will be JSON stringified if not a string)
     * @returns boolean indicating success
     */
    setItem(key: string, value: any): boolean {
        if (this.isBrowser()) {
            try {
                localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
                return true;
            } catch (error) {
                console.error('Error storing data in localStorage:', error);
                return false;
            }
        }
        return false;
    },

    /**
     * Retrieve data from localStorage
     * @param key Storage key
     * @param parseJson Whether to parse the value as JSON
     * @returns The retrieved value or null if not found
     */
    getItem<T>(key: string, parseJson: boolean = true): T | string | null {
        if (this.isBrowser()) {
            try {
                const item = localStorage.getItem(key);

                if (item === null) {
                    return null;
                }

                return parseJson ? JSON.parse(item) : item;
            } catch (error) {
                console.error('Error retrieving data from localStorage:', error);
                return null;
            }
        }
        return null;
    },

    /**
     * Remove data from localStorage
     * @param key Storage key
     * @returns boolean indicating success
     */
    removeItem(key: string): boolean {
        if (this.isBrowser()) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (error) {
                console.error('Error removing data from localStorage:', error);
                return false;
            }
        }
        return false;
    },

    /**
     * Clear all data from localStorage
     * @returns boolean indicating success
     */
    clear(): boolean {
        if (this.isBrowser()) {
            try {
                localStorage.clear();
                return true;
            } catch (error) {
                console.error('Error clearing localStorage:', error);
                return false;
            }
        }
        return false;
    },

    /**
     * Check if a key exists in localStorage
     * @param key Storage key
     * @returns boolean indicating if key exists
     */
    hasKey(key: string): boolean {
        if (this.isBrowser()) {
            return localStorage.getItem(key) !== null;
        }
        return false;
    },
};