import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

			const data = await res.json();

			if (!res.ok || !data.status) {
				throw new Error(data.message || 'Login gagal');
			}

			// simpan auth
			localStorage.setItem('token', data.token);
			localStorage.setItem('user', JSON.stringify(data.user));

			const role = data.user?.role;
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
		<div className="flex items-center justify-center h-screen bg-gray-100">
			<Card className="w-full max-w-[90%] sm:max-w-sm md:max-w-md rounded-2xl border border-white/10 bg-white/80 backdrop-blur-xl shadow-xl">
				<CardHeader className="space-y-2 px-5 pt-6 sm:px-8 sm:pt-8 text-center">
					<CardTitle className="text-xl sm:text-2xl font-semibold tracking-tight">Welcome Back</CardTitle>
					<CardDescription className="text-xs sm:text-sm text-muted-foreground">Login to continue to your account</CardDescription>
				</CardHeader>

				<CardContent className="px-5 sm:px-8">
					<form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
						{/* Username */}
						<div className="space-y-1.5 sm:space-y-2">
							<Label htmlFor="username" className="text-xs sm:text-sm font-medium">
								Username
							</Label>
							<Input
								id="username"
								type="text"
								placeholder="Your username"
								value={username}
								onChange={e => setUsername(e.target.value)}
								required
								className="h-10 sm:h-11 rounded-xl bg-white/60"
							/>
						</div>

						{/* Password */}
						<div className="space-y-1.5 sm:space-y-2">
							<Label htmlFor="password" className="text-xs sm:text-sm font-medium">
								Password
							</Label>
							<Input
								id="password"
								type="password"
								placeholder="••••••••"
								value={password}
								onChange={e => setPassword(e.target.value)}
								required
								className="h-10 sm:h-11 rounded-xl bg-white/60"
							/>
						</div>

						{/* Error */}
						{error && <p className="text-sm text-red-500 text-center">{error}</p>}

						<Button type="submit" disabled={loading} className="h-10 sm:h-11 w-full rounded-xl bg-black text-white hover:bg-black/70 cursor-pointer">
							{loading ? 'Logging in...' : 'Login'}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}

export default Login;
