import {createServerClient} from '@supabase/ssr';import {cookies} from 'next/headers';
export async function supabaseServer(){const c=await cookies();
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {cookies:{getAll:()=>c.getAll(),setAll:(l)=>{try{l.forEach(({name,value,options})=>c.set(name,value,options))}catch{}}}});}
/** Business is derived from the session, never from browser input. */
export async function currentBusiness(){const s=await supabaseServer();const {data:{user}}=await s.auth.getUser();
  if(!user)return null;const {data}=await s.from('business_members').select('business_id,businesses(business_name,preferred_language)').eq('user_id',user.id).limit(1).maybeSingle();
  return data?{s,user,businessId:data.business_id as string}:{s,user,businessId:null};}
