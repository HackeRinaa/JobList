"use client";
import { createContext } from "react";
import { UserData } from "@/types/user";

// Create the context
export const UserContext = createContext<UserData | null>(null); 