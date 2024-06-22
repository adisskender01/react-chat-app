import "./addUser.css";
import { arrayUnion, collection, getDocs, doc, setDoc, updateDoc, query, serverTimestamp, where } from "firebase/firestore";
import { db } from "../../../../lib/firebase";
import React, { useState } from "react";
import { useUserStore } from "../../../../lib/userStore";

const AddUser = () => {
    const [user, setUser] = useState(null);
    const { currentUser } = useUserStore();

    const handleSearch = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const username = formData.get("username");

        try {
            const userRef = collection(db, "users");
            const q = query(userRef, where("username", "==", username));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                setUser(querySnapshot.docs[0].data());
            } else {
                setUser(null); // No user found
                console.log("No user found with the provided username.");
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleAdd = async () => {
        if (!user) return; // Ensure there's a user to add

        const chatRef = collection(db, "chats");
        const userChatsRef = collection(db, "userchats");

        try {
            const newChatRef = doc(chatRef);

            // Create the chat document with initial data
            await setDoc(newChatRef, {
                createdAt: serverTimestamp(),
                messages: [],
            });

            // Update the current user's chats
            await updateDoc(doc(userChatsRef, currentUser.id), {
                chats: arrayUnion({
                    chatId: newChatRef.id,
                    lastMessage: "",
                    receiverId: user.id,
                }),
            });

            // Update the other user's chats
            await updateDoc(doc(userChatsRef, user.id), {
                chats: arrayUnion({
                    chatId: newChatRef.id,
                    lastMessage: "",
                    receiverId: currentUser.id,
                }),
            });

            // Update timestamps separately
            await updateDoc(doc(userChatsRef, currentUser.id), {
                [`chats.${newChatRef.id}.updatedAt`]: serverTimestamp(),
            });

            await updateDoc(doc(userChatsRef, user.id), {
                [`chats.${newChatRef.id}.updatedAt`]: serverTimestamp(),
            });

        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="addUser">
            <form onSubmit={handleSearch}>
                <input type="text" placeholder="Username" name="username" required />
                <button>Search</button>
            </form>
            {user && (
                <div className="user">
                    <div className="detail">
                        <img src={user.avatar || "./avatar.png"} alt="" />
                        <span>{user.username}</span>
                    </div>
                    <button onClick={handleAdd}>Add User</button>
                </div>
            )}
        </div>
    );
};

export default AddUser;