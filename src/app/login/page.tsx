'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { HARDCODED_USERS, loginSuccess } from '@/redux/slices/authSlice';
import { NavBar } from '@/components/NavBar';

export default function LoginPage(){
  const dispatch = useAppDispatch();
  const router = useRouter();
  const currentUser = useAppSelector(s => s.auth?.user);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmed = username.trim();
    if (trimmed === HARDCODED_USERS.admin.username && password === HARDCODED_USERS.admin.password) {
  dispatch(loginSuccess({ username: trimmed, role: 'admin' }));
  (router.push as any)('/dashboard');
      return;
    }
    if (trimmed === HARDCODED_USERS.user.username && password === HARDCODED_USERS.user.password) {
  dispatch(loginSuccess({ username: trimmed, role: 'user' }));
  (router.push as any)('/dashboard');
      return;
    }
    setError('Invalid credentials');
  };

  // Redirect if already logged in (must be in an effect to avoid Router update during render)
  useEffect(() => {
    if (currentUser) {
      (router.replace as any)('/dashboard');
    }
  }, [currentUser, router]);

  return (
    <main>
      <NavBar />
      <section className="container" style={{ padding: '3rem 1rem', maxWidth: 640 }}>
        <h1 style={{ fontSize: 'clamp(1.5rem,2.5vw,2rem)', marginBottom: '1rem' }}>Sign in</h1>
        <form onSubmit={onSubmit} style={{ display: 'grid', gap: '0.75rem' }}>
          <label>
            <div>Username</div>
            <input value={username} onChange={e=>setUsername(e.target.value)} required style={{ width:'100%', padding:'0.5rem', border:'1px solid #ddd', borderRadius:8 }} />
          </label>
          <label>
            <div>Password</div>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required style={{ width:'100%', padding:'0.5rem', border:'1px solid #ddd', borderRadius:8 }} />
          </label>
          {error && <div style={{ color: '#ef4444' }}>{error}</div>}
          <button type="submit" style={{ padding:'0.6rem 1rem', borderRadius:8, background:'var(--color-primary)', color:'#fff', border:'none' }}>Login</button>
          <div style={{ opacity:0.75 }}>
            Demo users: admin/admin123 • user/user123
          </div>
        </form>
      </section>
    </main>
  );
}
