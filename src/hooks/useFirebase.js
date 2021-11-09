import { useState, useEffect } from "react"
import initializeFirebase from "../Pages/Login/Login/Firebase/Firebase.init"
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";

initializeFirebase();
const useFirebase = () => {
    const [user, setUser] = useState({})
    const [isLoding, setIsLoading] = useState(true)
    const [authError, setAuthError] = useState('')
    const auth = getAuth();

    const registerUser = (email, password) => {
        setIsLoading(true);
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                setAuthError('')
            })
            .catch((error) => {

                setAuthError(error.message)

            })
            .finally(() => setIsLoading(false));

    }

    const loginUser = (email, password, location, history) => {
        setIsLoading(true)
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const destination = location?.state?.from || '/';
                history.replace(destination)
                setAuthError('')
            })
            .catch((error) => {
                setAuthError(error.message)
            })
            .finally(() => setIsLoading(false));
    }
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser({})
            }
            setIsLoading(false)
        });
        return () => unsubscribe;
    }, [])

    const logOut = () => {
        setIsLoading(true)
        signOut(auth).then(() => {
            // Sign-out successful.
        }).catch((error) => {
            // An error happened.
        })
            .finally(() => setIsLoading(false));
    }

    return {
        user,
        isLoding,
        authError,
        registerUser,
        logOut,
        loginUser,
    }

}
export default useFirebase


/*
steps for authentication
----------------
Step-1: Initial Setup
1. firebase: create project
2. create web app
3. get configuration
4. initialize firebase
5. Enable auth method
------------------
Step-2: setup component
1. Create Login Component
2. Create Register Component
3. Create Route for Login and Register
------------------------
Step 3: set auth system
1. set up sign in method
2. setup sign out method
3. user state
4. special observer
5. return necessary methods and states from useFirebase
---------------------
Step 4: create auth context hook (useAuth)
1. create a auth context
2. Create context Provider
3. set context Provider context value
4. use Auth Provider in the app.js
5. create useAuth Hook
---------------------
Step 5: create private route
1. create private Route
2. set private route
------------------
Step-6: Redirect after login
1. after login redirect user to their desired destination
*/