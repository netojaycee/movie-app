import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "authToken";

// Save token
export async function setToken(token: string) {
    try {
        await SecureStore.setItemAsync(TOKEN_KEY, token);
    } catch (error) {
        console.error("Error storing token:", error);
    }
}

// Get token
export async function getToken() {
    try {
        return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch (error) {
        console.error("Error retrieving token:", error);
        return null;
    }
}

// Remove token
export async function removeToken() {
    try {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
    } catch (error) {
        console.error("Error deleting token:", error);
    }
}
