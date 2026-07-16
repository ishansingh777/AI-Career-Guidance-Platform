import React, { createContext, useContext, useEffect, useState } from "react";
import * as authService from "../services/auth";
import api from "../services/axios";

type User = { id: number; email: string; name?: string; role?: string } | null;

type AuthContextType = {
	user: User;
	loading: boolean;
	error: string | null;
	signup: (email: string, password: string, name?: string) => Promise<void>;
	login: (email: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [user, setUser] = useState<User>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		// On startup, restore token and fetch user
		(async () => {
			const token = localStorage.getItem("token");
			if (!token) {
				setLoading(false);
				return;
			}

			try {
				// axios interceptor already reads token from localStorage
				const u = await authService.getCurrentUser();
				setUser(u);
			} catch (e: any) {
				localStorage.removeItem("token");
				setUser(null);
				setError("Session expired");
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	async function signup(email: string, password: string, name?: string) {
		setLoading(true);
		setError(null);
		try {
			const data = await authService.signup(email, password, name);
			const token = data.token;
			localStorage.setItem("token", token);
			// set default header
			api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
			setUser(data.user);
		} catch (e: any) {
			setError(e?.response?.data?.error || e.message || "Signup failed");
			throw e;
		} finally {
			setLoading(false);
		}
	}

	async function login(email: string, password: string) {
		setLoading(true);
		setError(null);
		try {
			const data = await authService.login(email, password);
			const token = data.token;
			localStorage.setItem("token", token);
			api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
			setUser(data.user);
		} catch (e: any) {
			setError(e?.response?.data?.error || e.message || "Login failed");
			throw e;
		} finally {
			setLoading(false);
		}
	}

	async function logout() {
		setLoading(true);
		setError(null);
		try {
			await authService.logout();
		} catch (e) {
			// ignore
		} finally {
			localStorage.removeItem("token");
			delete api.defaults.headers.common["Authorization"];
			setUser(null);
			setLoading(false);
		}
	}

	const value: AuthContextType = { user, loading, error, signup, login, logout };
	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuthContext() {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
	return ctx;
}

export default AuthContext;
