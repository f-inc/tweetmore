import { getSession } from '@/app/supabase-server';
import Home from '@/components/home';
import { useState } from 'react';

export default async function PricingPage() {
  const session = await getSession();

  return <Home user={session?.user} />;
  // return <Pricing session={session} user={session?.user} products={products} subscription={subscription} />
}
