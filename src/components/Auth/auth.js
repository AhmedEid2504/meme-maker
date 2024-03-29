import {auth} from "../../firebase/firebase";
import { GoogleAuthProvider, createUserWithEmailAndPassword , signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";



export const doCreateUserWithEmailAndPassword = async (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
}

export const doSignInWithEmailAndPassword = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password)
}

export const doSignInWithGoogle = async () => {
    const Provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, Provider);
    // result.user
    return result
}

export const doSignOut = () => {
    return auth.signOut();
}

// const doPasswordReset = (email) => {
//     return sendPasswordResetEmail(auth, email);
// }

// const doPasswordChange = (password) => {
//     return  updatePassword(auth.currentUser, password);
// }

// export const doSendEmailVerification = () => {
//     return sendEmailVerification(auth.currentUser, {
//         url: `${window.location.origin}/home`,
//     })
// }
