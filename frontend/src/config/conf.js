const conf = {
    appwriteUrl: import.meta.env.VITE_APPWRITE_URL,
    appwriteProjectId: import.meta.env.VITE_PROJECT_ID,
    appwriteDatabaseId: import.meta.env.VITE_DATABASE_ID,
    UserCollectionId: import.meta.env.VITE_USERS_COLLECTION_ID,
    ChatsCollectionId: import.meta.env.VITE_CHATS_COLLECTION_ID,
    MessagesCollectionId: import.meta.env.VITE_MESSAGES_COLLECTION_ID,
    appwriteBucketId: import.meta.env.VITE_BUCKET_ID,
}

export default conf