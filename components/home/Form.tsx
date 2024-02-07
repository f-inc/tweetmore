import LoadingDots from '../ui/LoadingDots';
import { getFeedback, getWorkflow } from './analyze';
import { useEffect, useState } from 'react';
import { useSupabase } from '@/app/supabase-provider';
import AuthUI from '@/app/signin/AuthUI';
import {
  User,
  createClientComponentClient
} from '@supabase/auth-helpers-nextjs';

const Form = ({ user }: { user: User | null | undefined }) => {
  const [tweet, setTweet] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<string>();
  const [workflowId, setWorkflowId] = useState<string>();

  const [showModal, setShowModal] = useState(false);

  const supabase = createClientComponentClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  });

  const login = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'twitter'
    });

    console.log(data, error);
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

            // @ts-ignore
            setResult(res.output.value);
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

  const analyze = () => {
    if (!user) {
      setShowModal(true);
      return;
    }

    (async () => {
      setLoading(true);
      setResult(undefined);

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

  return (
    <>
      {showModal && (
        <div className="absolute z-50 w-full h-screen inset-0 flex items-center justify-center backdrop-blur-sm">
          <div className="w-full mx-10 p-4 lg:max-w-sm bg-black rounded-lg border border-[#222]">
            <button className="h-12 w-full bg-blue-500 rounded-lg">
              Log in with 𝕏
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
        {/* <input
          type="text"
          className="w-full lg:w-1/2 text-white outline-none bg-[#00000026] rounded-xl px-5 border border-solid border-[#FFFFFF1F] border-opacity-25 placeholder-white placeholder-opacity-25 h-12"
          placeholder="twitter @ (for accurate feedback, optional)"
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
        /> */}
        <button
          className="text-[#8D5BDF] bg-[#5A25B080] rounded-xl font-medium text-base px-6 h-12 w-full lg:w-1/2 disabled:cursor-not-allowed flex items-center justify-center"
          disabled={tweet === '' || loading}
          onClick={analyze}
        >
          {/* We need your Twitter @ to give you accurate feedback, based on
              your past tweets. */}
          {loading ? <LoadingDots /> : ' Analyze'}
        </button>
      </div>

      <div className="mt-10 lg:mt-16 font-medium text-base tracking-wide">
        {result && (
          <div>
            <div className="text-white text-xl font-medium flex justify-center">
              {' '}
              Output:
            </div>
            <br />
            <br />
            {/* line break when theres a new line*/}
            {result.split('\n').map((i, key) => {
              return (
                <div key={key}>
                  {i}
                  <br />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default Form;
