export type TxnType='credit_sale'|'payment_received'|'opening_receivable'|'credit_purchase'|'payment_made'|'opening_payable';
export interface Txn{id?:string;transaction_type:TxnType;amount:string;transaction_date:string}
const INCREASE:TxnType[]=['credit_sale','opening_receivable','credit_purchase','opening_payable'];
/** Money in integer paise: no floating-point. Throws on invalid/negative/zero. */
export function toPaise(a:string):bigint{
  if(!/^\d+(\.\d{1,2})?$/.test(a.trim()))throw new Error('Invalid amount');
  const [r,p='']=a.trim().split('.');const v=BigInt(r)*100n+BigInt(p.padEnd(2,'0'));
  if(v<=0n)throw new Error('Amount must be positive');return v;}
export const signed=(t:Txn)=>INCREASE.includes(t.transaction_type)?toPaise(t.amount):-toPaise(t.amount);
export function runningLedger(txns:Txn[]){
  const s=[...txns].sort((a,b)=>a.transaction_date.localeCompare(b.transaction_date));
  let bal=0n;return s.map(t=>({...t,balance:(bal+=signed(t))}));}
export const balanceOf=(txns:Txn[])=>txns.reduce((a,t)=>a+signed(t),0n);
/** Indian grouping: 125000 paise*... -> ₹1,25,000 */
export function formatINR(paise:bigint){const neg=paise<0n;const x=neg?-paise:paise;
  const r=(x/100n).toString(),f=(x%100n).toString().padStart(2,'0');
  const last=r.slice(-3),rest=r.slice(0,-3).replace(/\B(?=(\d{2})+(?!\d))/g,',');
  return(neg?'-':'')+'₹'+(rest?rest+',':'')+last+(f==='00'?'':'.'+f);}
export const formatDate=(iso:string)=>iso.slice(0,10).split('-').reverse().join('/');
