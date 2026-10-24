'use server';
import {redirect} from 'next/navigation';import {z} from 'zod';import {supabaseServer,currentBusiness} from '@/lib/supabase/server';import {toPaise} from '@/lib/ledger';
const cred=z.object({email:z.string().email(),password:z.string().min(8)});
export async function signup(_:any,f:FormData){const p=cred.extend({name:z.string().min(1)}).safeParse(Object.fromEntries(f));
  if(!p.success)return {error:'नाम, सही ईमेल और 8+ अक्षर का पासवर्ड दें / Enter name, valid email and 8+ char password'};
  const s=await supabaseServer();const {error}=await s.auth.signUp({email:p.data.email,password:p.data.password,options:{data:{full_name:p.data.name}}});
  if(error)return {error:'Sign up failed. Try again.'};return {ok:'Check your email to verify your account, then log in.'};}
export async function login(_:any,f:FormData){const p=cred.safeParse(Object.fromEntries(f));if(!p.success)return {error:'Invalid email or password'};
  const s=await supabaseServer();const {error}=await s.auth.signInWithPassword(p.data);if(error)return {error:'Invalid email or password'};redirect('/dashboard');}
export async function logout(){const s=await supabaseServer();await s.auth.signOut();redirect('/login');}
export async function onboard(_:any,f:FormData){const s=await supabaseServer();
  const {error}=await s.rpc('create_business',{p_name:f.get('name'),p_type:f.get('type'),p_mobile:f.get('mobile')||null,p_address:f.get('address')||null,p_lang:f.get('lang')});
  if(error)return {error:'Could not save business'};redirect('/dashboard');}
export async function addParty(f:FormData){const c=await currentBusiness();if(!c?.businessId)redirect('/onboarding');
  const name=String(f.get('name')||'').trim();if(!name)return;
  const {data}=await c.s.from('parties').insert({business_id:c.businessId,party_type:f.get('type'),name,mobile_number:f.get('mobile')||null}).select('id').single();
  const ob=String(f.get('opening')||'').trim();
  if(data&&ob)await c.s.from('transactions').insert({business_id:c.businessId,party_id:data.id,party_type:f.get('type'),transaction_type:f.get('type')==='customer'?'opening_receivable':'opening_payable',amount:ob,created_by:c.user.id});
  redirect('/customers');}
export async function addTxn(_:any,f:FormData){const c=await currentBusiness();if(!c?.businessId)redirect('/onboarding');
  try{toPaise(String(f.get('amount')))}catch{return {error:'Enter a valid amount greater than 0'}}
  const {data:party}=await c.s.from('parties').select('party_type').eq('id',f.get('party_id')).single(); // RLS-scoped
  if(!party)return {error:'Party not found'};
  const type=String(f.get('kind'));const {error}=await c.s.from('transactions').insert({business_id:c.businessId,party_id:f.get('party_id'),party_type:party.party_type,
    transaction_type:type,amount:f.get('amount'),payment_method:f.get('method')||null,description:f.get('description')||null,due_date:f.get('due')||null,created_by:c.user.id});
  if(error)return {error:'Could not save. Check the transaction type matches the party.'};redirect('/dashboard');}
