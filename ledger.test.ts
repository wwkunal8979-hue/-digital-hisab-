import {test,expect} from 'vitest';import {balanceOf,formatINR,toPaise,runningLedger} from './ledger';
const t=(transaction_type:any,amount:string,d='2026-10-01')=>({transaction_type,amount,transaction_date:d});
test('customer: 1000+2000-500=2500',()=>expect(balanceOf([t('opening_receivable','1000'),t('credit_sale','2000'),t('payment_received','500')])).toBe(250000n));
test('supplier: 2000+3000-1000=4000',()=>expect(balanceOf([t('opening_payable','2000'),t('credit_purchase','3000'),t('payment_made','1000')])).toBe(400000n));
test('Rahul example =3000',()=>expect(balanceOf([t('credit_sale','2000'),t('payment_received','500'),t('credit_sale','1500')])).toBe(300000n));
test('rejects negative/zero/garbage',()=>{for(const a of ['-5','0','abc','1.234'])expect(()=>toPaise(a)).toThrow();});
test('decimal safe',()=>expect(balanceOf([t('credit_sale','0.1'),t('credit_sale','0.2')])).toBe(30n));
test('running balance',()=>expect(runningLedger([t('credit_sale','100','2026-10-02'),t('credit_sale','50','2026-10-01')]).map(r=>r.balance)).toEqual([5000n,15000n]));
test('INR format',()=>{expect(formatINR(125000n*100n)).toBe('₹1,25,000');expect(formatINR(2550000n)).toBe('₹25,500');expect(formatINR(100000n)).toBe('₹1,000');});
