import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from "motion/react";
import '../App.css';
import { useNavigate } from 'react-router-dom';
import { ROLE_ROUTE } from '@/config/roleRoute';
// import { FetchAPI } from "@/utils/api"

function Login() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const navigate = useNavigate();

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError('');

		try {
			const res = await fetch('http://localhost:8000/api/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					username,
					password,
				}),
			});

			const responseData = await res.json();
			const result = responseData.data;

			if (!res.ok || responseData.status !== 200 || !result) {
				throw new Error(responseData.message || 'Login gagal');
			}

			// simpan auth
			localStorage.setItem('token', result.token);
			localStorage.setItem('user', JSON.stringify(result.user));

			const role = result.user?.role?.toLowerCase();
			const redirectPath = ROLE_ROUTE[role];

			if (!redirectPath) {
				throw new Error('Role tidak dikenali');
			}

			// 🔥 pindah halaman TANPA reload
			navigate(redirectPath, { replace: true });
		} catch (err: any) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex items-center justify-center h-screen bg-[#151829] selection:bg-blue-500/30">
			<Card className="w-full max-w-[90%] sm:max-w-sm md:max-w-md rounded-2xl border border-white/5 bg-[#1e2238] shadow-2xl">
				<CardHeader className="space-y-4 px-5 pt-8 sm:px-8 sm:pt-10 text-center">
					<div className="flex justify-center mb-2">
						<div className="flex items-center space-x-2">
							<div className="h-8 w-8 shrink-0 rounded-tl-xl rounded-br-xl bg-white" />
							<motion.span
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								className="font-bold text-2xl tracking-tight text-white"
							>
								GradePoint
							</motion.span>
						</div>
					</div>
					<div className="space-y-1">
						<CardTitle className="text-xl sm:text-2xl font-semibold tracking-tight text-white">Welcome Back</CardTitle>
						<CardDescription className="text-xs sm:text-sm text-neutral-400">Login to continue to your dashboard</CardDescription>
					</div>
				</CardHeader>

				<CardContent className="px-5 sm:px-8 pb-8 sm:pb-10">
					<form onSubmit={handleLogin} className="space-y-5">
						{/* Username */}
						<div className="space-y-2">
							<Label htmlFor="username" className="text-xs sm:text-sm font-medium text-neutral-300">
								Username
							</Label>
							<Input
								id="username"
								type="text"
								placeholder="username"
								value={username}
								onChange={e => setUsername(e.target.value)}
								required
								className="h-11 sm:h-12 rounded-xl bg-[#151829] border-white/10 text-white placeholder-neutral-600 focus-visible:ring-1 focus-visible:ring-blue-500 outline-none transition-all"
							/>
						</div>

						{/* Password */}
						<div className="space-y-2">
							<Label htmlFor="password" className="text-xs sm:text-sm font-medium text-neutral-300">
								Password
							</Label>
							<Input
								id="password"
								type="password"
								placeholder="••••••••"
								value={password}
								onChange={e => setPassword(e.target.value)}
								required
								className="h-11 sm:h-12 rounded-xl bg-[#151829] border-white/10 text-white placeholder-neutral-600 focus-visible:ring-1 focus-visible:ring-blue-500 outline-none transition-all"
							/>
						</div>

						{/* Error */}
						{error && (
							<motion.p
								initial={{ opacity: 0, y: -5 }}
								animate={{ opacity: 1, y: 0 }}
								className="text-sm font-medium text-red-400 text-center bg-red-400/10 py-2 rounded-lg border border-red-400/20"
							>
								{error}
							</motion.p>
						)}

						<Button type="submit" disabled={loading} className="h-11 sm:h-12 mt-2 w-full rounded-xl bg-white text-[#151829] font-semibold hover:bg-[#191c2b] hover:text-white transition-colors shadow-[0_4px_14px_0_rgba(255,255,255,0.1)] cursor-pointer">
							{loading ? (
								<span className="flex items-center gap-2">
									<div className="h-4 w-4 rounded-full border-2 border-[#151829] border-t-transparent animate-spin"></div>
									Logging in...
								</span>
							) : 'Login'}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}

export default Login;
