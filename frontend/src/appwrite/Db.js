import { Client, Databases, Storage, Query, Account, ID } from "appwrite";
import authService from "./Auth.js";
import config from "@/config/conf";

export class Service {
    client = new Client();
    account
    databases;
    bucket;
    constructor() {
        this.client.setEndpoint(config.appwriteUrl).setProject(config.appwriteProjectId);
        this.account = new Account(this.client);
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    async getUserChatNames() {
        try {
            const user = await authService.getCurrentUser();
            const data = await this.databases
                .listDocuments(config.appwriteDatabaseId, config.ChatsCollectionId, [
                    Query.equal('user_id', user.$id),
                    Query.orderAsc('last_updated'),
                    Query.select('title')
                ]);
            if (data) {
                return post.documents;
            } else {
                throw new Error("Post not found");
            }
        } catch (e) {
            console.log("unable to get post", e);
            return false;
        }

    }
    async getUserChat(id) {
        try {
            const result = await this.databases.listDocuments(
                config.appwriteDatabaseId,
                config.ChatsCollectionId,
                [
                    Query.equal('user_id', id),
                    Query.orderDesc('created_at')
                ]
            );
            return result;
        } catch (e) {
            console.log("unable to get posts", e);
        }

    }
    async createChat({ user_id, title = 'chat ', created_at, last_updated }) {
        try {
            const user = await authService.getCurrentUser();
            const now = new Date().toISOString();
            return await this.databases.createDocument(
                config.appwriteDatabaseId,
                config.ChatsCollectionId,
                ID.unique(),
                {
                    user_id: user.$id,
                    title,
                    created_at: now,
                    last_updated: now

                }


            )
        } catch (error) {
            console.log("unable to create post", error);
        }

    }

    async listMessages(chatid) {
        try {
            const user = await authService.getCurrentUser();
            return await this.databases.listDocuments(
                config.appwriteDatabaseId,
                config.MessagesCollectionId,

                [
                    Query.equal('chat_id', chatid),
                    Query.orderAsc('timestamp')
                ]

            )


        } catch (error) {
            console.log("unable to update post", error);

        }


    }
    async sendMessage(chatId = '', content, type = 'user', metadata = {}) {
        const user = await authService.getCurrentUser();
        const now = new Date().toISOString();
        const msg = await this.databases.createDocument( // Added this.
            config.appwriteDatabaseId,
            config.MessagesCollectionId,
            ID.unique(),
            { chat_id: chatId, sender_id: user.$id, content, timestamp: now, type, metadata }
        );
        await this.databases.updateDocument(
            config.appwriteDatabaseId,
            config.ChatsCollectionId,
            chatId,
            { last_updated: now }
        );
        return msg;
    }
    async uploadFile(file) {
        try {
            const result = await this.bucket.createFile(
                config.appwriteBucketId,
                ID.unique(),
                file
            )
            // console.log(result);
            return result;
        } catch (error) {
            console.log("unable to upload file", error);
            throw error;

        }
    }
    getFilePreview(fileId) {
        try {
            return this.bucket.getFilePreview( // Changed from this.storage
                config.appwriteBucketId,
                fileId
            );
        } catch (error) {
            console.error("Error getting file preview:", error);
            throw error;
        }
    }



}

const service = new Service();
export default service;








