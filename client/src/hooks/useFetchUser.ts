"use client";
import { useEffect } from "react";
import { axios_auth } from "@/lib/axios";
import { userStore } from "@/lib/store";

const useFetchUser = () => {
  const { setUser, user } = userStore((state) => ({
    setUser: state.setUser,
    user: state.user,
  }));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await axios_auth.get("/get-user");
        setUser(userResponse.data);
      } catch (error: any) {
        console.log(error.response.data);
      }
    };

    fetchData();
  }, []);

  return user;
};

export default useFetchUser;