import conf from '../conf/conf.js';
import { Client, Account, ID } from "appwrite";

export class AuthService {
    client = new Client();
    account;

    constructor() {
        // Initialize the Appwrite client with the endpoint and project ID
        console.log("Initializing Appwrite Client with URL:", conf.appwriteUrl, "and Project ID:", conf.appwriteProjectId);
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);

        // Initialize the Account service with the client
        this.account = new Account(this.client);
    }

    async createAccount({ email, password, name }) {
        try {
            // Create a new user account
            const userAccount = await this.account.create(ID.unique(), email, password, name);
            if (userAccount) {
                // If account creation is successful, log the user in
                return this.login({ email, password });
            } else {
                return userAccount;
            }
        } catch (error) {
            // Handle and throw any errors
            throw error;
        }
    }

    async login({ email, password }) {
        try {
            // Create a new email session (log in)
            return await this.account.createEmailSession(email, password);
        } catch (error) {
            // Handle and throw any errors
            throw error;
        }
    }

    async getCurrentUser() {
        try {
            // Retrieve the current logged-in user
            return await this.account.get();
        } catch (error) {
            // Log any errors and return null
            console.log("Appwrite service :: getCurrentUser :: error", error);
            return null;
        }
    }

    async logout() {
        try {
            // Delete all sessions (log out)
            await this.account.deleteSessions();
        } catch (error) {
            // Log any errors
            console.log("Appwrite service :: logout :: error", error);
        }
    }
}

const authService = new AuthService();

export default authService;
