'use client';

import { useSupabase } from '@/app/supabase-provider';
// import { useSupabase } from '@/app/supabase-provider';
import Form from './Form';
import { AnalyticsEvents } from '@/utils/constants/AnalyticsEvents';
import { User } from '@supabase/supabase-js';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Papa from 'papaparse';
import posthog from 'posthog-js';
import { ChangeEvent, useState } from 'react';
import { useCallback } from 'react';
import { BarLoader, ClipLoader, DotLoader } from 'react-spinners';
import { v4 as uuid } from 'uuid';

interface Props {
  user: User | null | undefined;
}

export default function Home({ user }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [blurData, setBlurData] = useState(false);

  const supabase = useSupabase();

  async function toggleLoading() {
    setLoading(!loading);
  }

  const handleBlurToggle = () => {
    setBlurData(!blurData);
  };

  return (
    <>
      <div className="min-h-screen px-6 mx-auto max-w-7xl">
        <div className="py-10 text-white md:py-20 bg-opacity-10">
          <div className="container flex flex-col items-center justify-between lg:flex-row">
            <div className="flex flex-col items-center w-full gap-y-8">
              <h1
                className="text-5xl lg:text-[64px] font-bold gap-4 max-w-[45rem] text-center"
                style={{
                  fontStyle: 'normal',
                  fontWeight: 700,
                  lineHeight: '110%',
                  letterSpacing: '-1.28px',
                  background:
                    'linear-gradient(146deg, #FFF 45.88%, rgba(255, 255, 255, 0.50) 88.34%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                A personal brand coach for your Twitter.
              </h1>
              <p className="max-w-lg text-sm text-center text-gray-300 md:text-lg">
                Our AI bot scrapes your Twitter and helps you come up with
                tweets that don’t suck.
              </p>
            </div>
          </div>
          <Form user={user} />

          {/* <LogoCloud /> */}
        </div>
      </div>
      <div className="flex justify-center">
        <h1
          className="gap-4 px-4 text-3xl font-bold text-center lg:text-5xl"
          style={{
            fontStyle: 'normal',
            fontWeight: 700,
            lineHeight: '110%',
            letterSpacing: '-1.28px',
            background:
              'linear-gradient(146deg, #FFF 45.88%, rgba(255, 255, 255, 0.50) 88.34%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Latest generated tweets from the community.{' '}
        </h1>
      </div>

      <div className="flex justify-center mt-12 mb-28">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          <div
            className="flex items-center gap-5 px-6 py-5 rounded-2xl"
            style={{
              border: '1px solid rgba(255, 255, 255, 0.15)',
              background: 'rgba(0, 0, 0, 0.15)'
            }}
          >
            <img className="w-16" src="icon1.png"></img>
            <div className="flex flex-col gap-2">
              <a className="text-[#0C8CE9] text-base">@elonmusk</a>
              <p className="text-[#FFFFFFCC] text-base font-medium max-w-[15rem]">
                Cybertruck handles like a sports car because it is one.
              </p>
            </div>
          </div>
          <div
            className="flex items-center gap-5 px-6 py-5 rounded-2xl"
            style={{
              border: '1px solid rgba(255, 255, 255, 0.15)',
              background: 'rgba(0, 0, 0, 0.15)'
            }}
          >
            <img className="w-16" src="icon2.png"></img>
            <div className="flex flex-col gap-2">
              <a className="text-[#0C8CE9] text-base">@aggressivepet</a>
              <p className="text-[#FFFFFFCC] text-base font-medium max-w-[15rem]">
                i dont like to overshare unless its with people i love{' '}
              </p>
            </div>
          </div>
          <div
            className="flex items-center gap-5 px-6 py-5 rounded-2xl"
            style={{
              border: '1px solid rgba(255, 255, 255, 0.15)',
              background: 'rgba(0, 0, 0, 0.15)'
            }}
          >
            <img className="w-16" src="icon3.png"></img>
            <div className="flex flex-col gap-2">
              <a className="text-[#0C8CE9] text-base">@dril</a>
              <p className="text-[#FFFFFFCC] text-base font-medium max-w-[15rem]">
                im getting so tired of jordan peterson that im gonna start
                calling him jordan jenkins{' '}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function LogoCloud() {
  return (
    <div>
      <p className="mt-24 text-xs uppercase text-zinc-400 text-center font-bold tracking-[0.3em]">
        Brought to you by
      </p>
      <div className="flex flex-col items-center my-12 space-y-4 sm:mt-8 sm:space-y-0 md:mx-auto md:max-w-2xl sm:grid sm:gap-6 sm:grid-cols-5">
        <div className="flex items-center justify-start">
          <a href="https://nextjs.org" aria-label="Next.js Link">
            <img
              src="/nextjs.svg"
              alt="Next.js Logo"
              className="h-12 text-white"
            />
          </a>
        </div>
        <div className="flex items-center justify-start">
          <a href="https://vercel.com" aria-label="Vercel.com Link">
            <img
              src="/vercel.svg"
              alt="Vercel.com Logo"
              className="h-6 text-white"
            />
          </a>
        </div>
        <div className="flex items-center justify-start">
          <a href="https://stripe.com" aria-label="stripe.com Link">
            <img
              src="/stripe.svg"
              alt="stripe.com Logo"
              className="h-12 text-white"
            />
          </a>
        </div>
        <div className="flex items-center justify-start">
          <a href="https://supabase.io" aria-label="supabase.io Link">
            <img
              src="/supabase.svg"
              alt="supabase.io Logo"
              className="h-10 text-white"
            />
          </a>
        </div>
        <div className="flex items-center justify-start">
          <a href="https://github.com" aria-label="github.com Link">
            <img
              src="/github.svg"
              alt="github.com Logo"
              className="h-8 text-white"
            />
          </a>
        </div>
      </div>
    </div>
  );
}
