import React from "react";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import firebase_app from "@/utils/firebase/config";
import { getDocument } from "@/utils/firebase/firestore";
import Loader from "@/components/Loading";
import { truncate } from "fs/promises";
import { useRouter } from "next/router";

const auth = getAuth(firebase_app);

export const AuthContext = React.createContext({});

export const useAuthContext = () => React.useContext(AuthContext);

export const AuthContextProvider = ({ children }: any) => {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();

  React.useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, (user: any) => {
      if (user) {
        getDocument("users", user.uid).then((data: any) => {
          setUser(data);
          setLoading(false);
        });
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {loading ? <Loader /> : children}
    </AuthContext.Provider>
  );
};
