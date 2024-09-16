import { Account, Client, ID, Avatars, Databases, Query } from 'react-native-appwrite';
export const config= {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.sena.aora_sebastian',
    projectId: '66e780520030d2940d35',
    databaseId: '66e78783000b96eb15a4',
    userCollectionId: '66e787ad0025d619575f',
    videosCollectionId: '66e78e38000c755661ca',
    storageId: '66e7919a00256942a485'
}

const{
    endpoint,
    platform,
    projectId,
    databaseId,
    userCollectionId,
    videoCollectionId,
    storageId
} = config

const client = new Client();

client
    .setEndpoint(config.endpoint) // Your Appwrite Endpoint
    .setProject(config.projectId) // Your project ID
    .setPlatform(config.platform) // Your application ID or bundle ID.
;

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export const deleteSession = async () => {
    try {
        const sessions = await account.listSessions();
        if (sessions.total === 0) {
            console.log('No hay sesiones activas');
            return;
        }

        for (const session of sessions.sessions) {
            await account.deleteSession(session.$id);
            console.log(`Sesión ${session.$id} eliminada`);
        }
    } catch (error) {
        console.log('Error al eliminar la sesión:', error.message);
        throw new Error(error.message);
    }
};



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
        const response = await fetch(`${config.endpoint}/account/sessions/email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Appwrite-Project': config.projectId
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        
        if (!response.ok) {
            const errorDetails = await response.json(); 
            console.log('Detalles del error:', errorDetails);
            throw new Error(`Error al iniciar sesión: ${response.status} ${response.statusText}`);
        }

        const session = await response.json();
        return session;
    } catch (error) {
        console.log('Error:', error.message); 
        throw new Error(error.message);
    }
}

export async function getAccount() {
    try {
      const currentAccount = await account.get();
  
      return currentAccount;
    } catch (error) {
      throw new Error(error);
    }
  }


export const getCurrentUser = async () =>{
    try {
        const currentAccount = await account.get();
        if(!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
        config.databaseId,
        config.userCollectionId,
        [Query.equal('accountId', currentAccount.$id)]
        )

        if(!currentUser) throw Error;


        return currentUser.documents[0];
    } catch (error) {
        console.log(error);
    }
}

export async function getAllPosts() {
    try {
      const posts = await databases.listDocuments(
        databaseId,
        videoCollectionId
      );
  
      return posts.documents;
    } catch (error) {
      throw new Error(error);
    }
}

export async function searchPosts(query) {
    try {
      const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.videoCollectionId,
        [Query.search("title", query)]
      );
  
      if (!posts) throw new Error("Something went wrong");
  
      return posts.documents;
    } catch (error) {
      throw new Error(error);
    }
}

// Register User
