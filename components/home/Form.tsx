import LoadingDots from '../ui/LoadingDots';
import { getFeedback, getWorkflow } from './analyze';
import React, { useEffect, useState } from 'react';
import { useSupabase } from '@/app/supabase-provider';
import AuthUI from '@/app/signin/AuthUI';
import {
  User,
  createClientComponentClient
} from '@supabase/auth-helpers-nextjs';

const Form = ({ user }: { user: User | null | undefined }) => {
  const [tweet, setTweet] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [ratings, setRatings] = useState<{
    conciseness: number;
    word_choice: number;
    seriousness: number;
    clarity: number;
    readability: number;
    presentability: number;
  }>();
  const [revisedTweet, setRevisedTweet] = useState<string>();
  const [workflowId, setWorkflowId] = useState<string>();

  const [showModal, setShowModal] = useState(false);

  const supabase = createClientComponentClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  });

  const login = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'twitter'
    });
  };

  useEffect(() => {
    // @ts-ignore
    let intervalId;

    if (workflowId) {
      intervalId = setInterval(async () => {
        try {
          const res = await getWorkflow(workflowId);
          if (res.status === 'completed') {
            // @ts-ignore
            clearInterval(intervalId);

            console.log(res.output);

            const revisedTweet = res.output.revised_tweet;
            setRevisedTweet(revisedTweet);

            const _ratings = res.output.value;
            const ratings = _ratings.replace(/'/g, '"').match(/\{([^}]+)\}/g);
            console.log(ratings);
            setRatings(JSON.parse(ratings));

            // @ts-ignore
            // setRatings(ratings);
            setWorkflowId(undefined);
            setLoading(false);
          }
        } catch (error) {
          console.error('Error fetching workflow:', error);
          setLoading(false);
        }
      }, 3000);
    }

    return () => {
      // @ts-ignore
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [workflowId]);

  const analyze = (tweet: string) => {
    if (!user) {
      localStorage.setItem('tweet', tweet);
      setShowModal(true);
      return;
    }

    (async () => {
      setLoading(true);
      setRatings(undefined);

      try {
        const handle = user?.user_metadata.preferred_username;

        let _workflowId = await getFeedback(tweet, handle);

        // @ts-ignore
        setWorkflowId(_workflowId);
      } catch {
        console.error('Error generating worjflow_id');
        setLoading(false);
      }
    })();
  };

  useEffect(() => {
    const tweet = localStorage.getItem('tweet');
    if (user && tweet && tweet !== '') {
      setTweet(tweet);
      localStorage.removeItem('tweet');
      analyze(tweet);
    }
  }, [user]);

  return (
    <>
      {showModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center w-full h-screen backdrop-blur-sm">
          <div className="flex flex-col items-center w-full p-4 mx-10 bg-white rounded-lg lg:max-w-sm">
            <div className="text-lg font-bold text-center text-black">
              {/* We'll scrape your tweets to help you write better ones. */}
            </div>

            <button
              className="w-full h-12 mt-0 bg-[#1a9ef5] rounded-lg"
              onClick={() => login()}
            >
              Log in with 𝕏 / Twitter
            </button>
          </div>
        </div>
      )}
      <div className="flex flex-col items-center justify-center mt-10 lg:mt-20 gap-y-5">
        <textarea
          className="w-full overflow-hidden lg:w-1/2 text-white outline-none bg-[#00000026] rounded-2xl p-5 border border-solid border-[#FFFFFF1F] placeholder-white placeholder-opacity-25 h-40 resize-none"
          placeholder="Start typing or paste your tweet.*"
          value={tweet}
          onChange={(e) => setTweet(e.target.value)}
        />

        <button
          className="text-[#8D5BDF] bg-[#5A25B080] rounded-xl font-medium text-base px-6 h-12 w-full lg:w-1/2 disabled:cursor-not-allowed flex items-center justify-center"
          disabled={tweet === '' || loading}
          onClick={() => analyze(tweet)}
        >
          {loading ? <LoadingDots /> : ' Analyze'}
        </button>
      </div>

      <div className="flex justify-center w-full mt-10 text-base font-medium tracking-wide lg:mt-16">
        {ratings && (
          <div className="w-full lg:w-1/2">
            <div className="w-full text-lg h-12 bg-[#00000026] border border-[#FFFFFF1F] rounded-lg flex justify-between items-center px-5 font-bold">
              Your Tweet
            </div>

            <div className="grid grid-cols-3 grid-rows-2 gap-4 mt-5">
              {Object.entries(ratings)
                .slice(0, 6)
                .map(([key, value]) => (
                  <div
                    key={key}
                    className="col-span-1 bg-[#00000026] border border-[#FFFFFF1F] rounded-lg flex flex-col items-center px-5 h-32 "
                  >
                    <span className="mt-4 text-5xl font-bold">{value}</span>
                    <span className="mt-1.5">
                      {key
                        .split('_')
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(' ')}
                    </span>
                    <div className="mt-2 relative w-full h-2.5 overflow-hidden bg-white bg-opacity-10 border border-[#FFFFFF1F] rounded-full">
                      <div
                        className="h-2.5 rounded-r-full"
                        style={{
                          width: `${value * 10}%`,
                          backgroundColor: `${
                            value >= 9
                              ? '#12F078'
                              : value >= 8
                              ? '#9FFB66'
                              : value >= 7
                              ? '#D4FB66'
                              : '#FFF969'
                          }`
                        }}
                      />
                    </div>
                  </div>
                ))}
            </div>

            <div className="mt-5 bg-[#00000026] border border-[#FFFFFF1F] w-full rounded-lg">
              <div className="h-12 border-b border-[#FFFFFF1F] flex items-center pl-5 text-lg font-bold">
                Revised Tweet
              </div>
              <div className="px-5 py-3">
                {revisedTweet?.split('\n').map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Form;
