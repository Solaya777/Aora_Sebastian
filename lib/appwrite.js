import { Account, Client, ID, Avatars, Databases } from 'react-native-appwrite';
export const config= {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.sena.aora_sebastian',
    projectId: '66e780520030d2940d35',
    databaseId: '66e78783000b96eb15a4',
    userCollectionId: '66e787ad0025d619575f',
    videosCollectionId: '66e78e38000c755661ca',
    storageId: '66e7919a00256942a485'
}


const client = new Client();

client
    .setEndpoint(config.endpoint) // Your Appwrite Endpoint
    .setProject(config.projectId) // Your project ID
    .setPlatform(config.platform) // Your application ID or bundle ID.
;

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export const createUser = async (email, password, username) =>{
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        )
        if(!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(username)

        await signIn(email, password);

        const newUser = await databases.createDocument(
            config.databaseId,
            config.userCollectionId,
            ID.unique(),
            {
            accountId: newAccount.$id,
            email,
            username,
            avatar: avatarUrl
            }
        )

        return newUser;

    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

export async function signIn(email, password) {
    try {
        const session = await account.createEmailSession(email, password)
        return session;
    } catch (error) {
        throw new Error(error);
    }
}

// Register User
