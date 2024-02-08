import { createServerSupabaseClient } from '@/app/supabase-server';
import s from './Navbar.module.css';
import SignInButton from './SignInButton';
import SignOutButton from './SignOutButton';
// import { createServerSupabaseClient } from '@/app/supabase-server';
import Logo from '@/components/icons/Logo';
import Link from 'next/link';

export default async function Navbar() {
  const supabase = createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const handle = user?.user_metadata.preferred_username;

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className={s.root}>
      <a href="#skip" className="sr-only focus:not-sr-only">
        Skip to content
      </a>
      <div className="max-w-5xl px-6 mx-auto text-sm">
        <div className="w-full relative flex flex-row justify-between py-4 align-center md:py-6">
          <div className="flex items-center flex-1">
            <Link
              href="/"
              className="inline-flex items-center text-3xl font-bold"
              aria-label="Logo"
            >
              <img className="w-[100px]" src="/tweetmore-logo.png"></img>
            </Link>
          </div>
          <div className="flex items-center gap-x-6 text-white">
            {user && <SignOutButton handle={handle} />}
          </div>
        </div>
        {/* </div> */}
      </div>
    </div>
  );
}
