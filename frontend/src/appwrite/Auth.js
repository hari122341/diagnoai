import config from '@/config/conf'
import { Client, Account, ID } from "appwrite";



class AuthService {

    client = new Client();
    account;

    constructor() {
        // this.client.setEndpoint(config.appwriteUrl).setProject(config.appwriteDatabaseId);
        this.client
            .setEndpoint(config.appwriteUrl) // Your API Endpoint
            .setProject(config.appwriteProjectId);

        this.account = new Account(this.client);
    }
    async createAccount(email, password, name) {
        try {
            const userAccount = await this.account.create(
                ID.unique(),
                email,
                password,
                name
            )
            if (userAccount) {
                console.log(userAccount?.password);
                return userAccount;
                // return this.login({ email, password });
            } else {
                throw new Error("Account not created");
            }
        } catch (e) {
            console.log("account not created", e);
        }

    }
    async login({ email, password }) {
        try {
            try {
                await this.account.deleteSession('current');
            } catch (err) {
                console.warn("No active session to delete, continuing.");
            }
            const session = await this.account.createEmailPasswordSession(email, password);
            if (!session) throw new Error('Session creation failed');
            console.log(session);
            return session;
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    }

    async getCurrentUser() {
        try {
            return await this.account.get();
        } catch (e) {
            console.log("unable to get user", e);
        }
        return null;
    }
    async logout() {
        try {
            await this.account.deleteSession()
        } catch (error) {
            console.log("unable to logout", error);

        }

    }
    async deleteAccount() {
        try {
            await this.account.delete();
        } catch (error) {
            console.log("unable to delete account", error);
        }
    }



}


const authService = new AuthService();

export default authService;