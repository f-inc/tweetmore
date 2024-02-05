'use server';

import { Leap } from '@leap-ai/workflows';

const leap = new Leap({
  apiKey: process.env.LEAP_API_KEY as string
});

export const getWorkflow = async (id: string) => {
  // return new Promise((resolve) => {
  //   const interval = setInterval(async () => {
  //     const { data } = await leap.workflowRuns.getWorkflowRun({
  //       workflowRunId: id
  //     });

  //     if (data.status === 'completed') {
  //       clearInterval(interval);
  //       // @ts-ignore
  //       resolve(data.output.value);
  //     }
  //   }, 1000);
  // });

  const { data } = await leap.workflowRuns.getWorkflowRun({
    workflowRunId: id
  });

  return data;
};

export const getFeedback = async (tweet: string, handle?: string) => {
  if (!handle) {
    const {
      data: { id }
    } = await leap.workflowRuns.workflow({
      workflow_id: 'wkf_FSAjAFRHXk7oxg',
      input: {
        tweet_raw: tweet
      }
    });

    return id;
  } else {
    const {
      data: { id }
    } = await leap.workflowRuns.workflow({
      workflow_id: 'wkf_clHn5KNLx1UsEn',
      input: {
        tweet_raw: tweet,
        tweet_acc: handle
      }
    });

    return id;
  }
};
