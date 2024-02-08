'use client';

import { useSupabase } from '@/app/supabase-provider';
import { useRouter } from 'next/navigation';

import s from './Navbar.module.css';

export default function SignOutButton({ handle }: { handle: string }) {
  const router = useRouter();
  const { supabase } = useSupabase();

  const logout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <div className="hover:underline cursor-pointer" onClick={logout}>
      Logged In as @{handle}. Click here to Log Out
    </div>
  );
}
