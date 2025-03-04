import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  UserCredential,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../../firebase";

export interface AuthContextType {
  user: User | null;
  logout: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<UserCredential>;
  currentStudentNumber: string;
  setCurrentStudentNumber: (studentNumber: string) => void;
  currentClassName: string;
  setCurrentClassName: (className: string) => void;
  createUser: (
    email: string,
    password: string,
    studentNumber: string,
    className: string,
  ) => Promise<void>;
}

const UserContext = createContext<AuthContextType | null>(null);

export const AuthContextProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);
  const [currentStudentNumber, setCurrentStudentNumber] = useState<string>("");

  const createUser = async (
    email: string,
    password: string,
    studentNumber: string,
    className: string,
  ) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: studentNumber,
        photoURL: className, //store class name in photoURL, useful to have only one source of truth to fetch student metadata
      });

      console.log("User created and student number saved in displayName!");
    } catch (error) {
      console.error("Error creating user or saving student number", error);
    }
  };
  const signIn = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  console.log(user);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      return setUser(currentUser);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        logout,
        signIn,
        currentStudentNumber,
        setCurrentStudentNumber,
        createUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useAuth must be used within a AuthContextProvider");
  }
  return context;
};
