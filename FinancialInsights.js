import React,{useState} from 'react';
import {View,Text,TouchableOpacity,TextInput,Modal} from 'react-native';
const asDate=s=>new Date(`${s}T12:00:00`);
const monthKey=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
const monthly=s=>Number(s.price)*(s.cycle==='Weekly'?52/12:s.cycle==='Yearly'?1/12:s.cycle==='Quarterly'?1/3:1);
export function FinancialInsights({subscriptions,payments,budget=0,t,symbol='₱'}){
 const [period,setPeriod]=useState(6);
 const fmt=v=>symbol+Number(v||0).toLocaleString('en-PH',{maximumFractionDigits:2,minimumFractionDigits:2});
 const live=subscriptions.filter(s=>s.status==='Active');
 const recurring=live.reduce((a,s)=>a+monthly(s),0);
 const now=new Date();const trend=Array.from({length:period},(_,i)=>{const d=new Date(now.getFullYear(),now.getMonth()-period+i+1,1),key=monthKey(d);return {key,label:d.toLocaleDateString('en-US',{month:'short',year:'2-digit'}),actual:payments.filter(p=>p.paid_at?.slice(0,7)===key).reduce((a,p)=>a+Number(p.amount),0)}});
 const max=Math.max(1,...trend.map(v=>v.actual));
 const box={backgroundColor:t.card,borderRadius:18,borderWidth:1,borderColor:t.line,padding:20,marginBottom:20};
 const label=(v,size=13,color=t.text,weight='400')=><Text style={{fontSize:size,color,fontWeight:weight}}>{v}</Text>;
 return <View>
  <View style={box}>{label('Actual Payments — Spending Trend',17,t.text,'800')}{label('Recorded payments, not estimated recurring costs.',12,t.muted)}
   <View style={{flexDirection:'row',gap:9,marginTop:14,marginBottom:8}}>{[6,12].map(v=><TouchableOpacity key={v} onPress={()=>setPeriod(v)} style={{backgroundColor:v===period?t.card2:'transparent',padding:9,borderRadius:10,borderWidth:1,borderColor:t.line}}>{label(v+' months',12,v===period?t.text:t.muted,'600')}</TouchableOpacity>)}</View>
   {trend.map(row=><View key={row.key} style={{flexDirection:'row',alignItems:'center',gap:10,marginTop:12}}><View style={{width:62}}>{label(row.label,11,t.muted)}</View><View style={{flex:1,height:10,borderRadius:8,backgroundColor:t.card2,overflow:'hidden'}}><View style={{height:10,width:`${row.actual/max*100}%`,backgroundColor:'#6DA9E8',borderRadius:8}}/></View><View style={{width:98,alignItems:'flex-end'}}>{label(fmt(row.actual),11,t.text,'600')}</View></View>)}
  </View>
  <View style={box}>{label('Spending Forecast',17,t.text,'800')}{label('Estimates based on current active subscription prices and cycles.',12,t.muted)}
   {[1,2,3].map(n=><View key={n} style={{flexDirection:'row',justifyContent:'space-between',marginTop:14}}>{label(`Next ${n*30} days (approx.)`,12,t.muted)}{label(fmt(recurring*n),14,t.text,'700')}</View>)}
  </View>
  {budget>0&&<View style={box}>{label('Budget Alerts',17,t.text,'800')}{label(`${fmt(recurring)} of ${fmt(budget)} monthly budget`,13,t.muted)}{label(recurring>=budget?'Over budget — review your active subscriptions.':recurring>=budget*.8?'Approaching budget — over 80% used.':'Within your monthly budget.',13,recurring>=budget?t.red:recurring>=budget*.8?'#E8B96A':t.green,'700')}</View>}
 </View>;
}
export function PaymentHistoryTools({payments,t,symbol='₱'}){
 const [term,setTerm]=useState(''),[month,setMonth]=useState('');
 const [calendarOpen,setCalendarOpen]=useState(false),[viewMonth,setViewMonth]=useState(()=>new Date(new Date().getFullYear(),new Date().getMonth(),1));
 const chooseMonth=(d)=>{setMonth(monthKey(d));setCalendarOpen(false)};
 const calendarMonth=(offset)=>setViewMonth(d=>new Date(d.getFullYear(),d.getMonth()+offset,1));
 const list=payments.filter(p=>p.service_name?.toLowerCase().includes(term.toLowerCase())&&(!month||p.paid_at?.startsWith(month)));
 const total=list.reduce((a,p)=>a+Number(p.amount||0),0);
 const input=(value,set,placeholder)=><TextInput value={value} onChangeText={set} placeholder={placeholder} placeholderTextColor={t.muted} style={{backgroundColor:t.input,color:t.text,borderWidth:1,borderColor:t.line,padding:13,borderRadius:12,marginBottom:10}}/>;
 return <View style={{marginBottom:15}}>{input(term,setTerm,'Filter by subscription name')}<View style={{flexDirection:'row',gap:9,alignItems:'center',marginBottom:12}}>
 <TouchableOpacity accessibilityRole="button" onPress={()=>setCalendarOpen(true)} style={{flex:1,backgroundColor:t.input,borderWidth:1,borderColor:t.line,borderRadius:12,padding:14}}>
 <Text style={{color:month?t.text:t.muted,fontSize:13}}>{month?new Date(month+'-01T12:00:00').toLocaleDateString('en-US',{month:'long',year:'numeric'}):'All months · Select from calendar'}</Text>
 </TouchableOpacity>
 {!!month&&<TouchableOpacity accessibilityRole="button" onPress={()=>setMonth('')} style={{padding:13,backgroundColor:t.card2,borderRadius:12}}><Text style={{color:t.text,fontSize:12,fontWeight:'700'}}>Clear</Text></TouchableOpacity>}
 </View>
 <Modal visible={calendarOpen} transparent animationType="fade" onRequestClose={()=>setCalendarOpen(false)}>
 <View style={{flex:1,backgroundColor:'rgba(0,0,0,0.65)',justifyContent:'center',alignItems:'center',padding:20}}>
 <View style={{width:'100%',maxWidth:410,backgroundColor:t.card,borderRadius:22,padding:20,borderWidth:1,borderColor:t.line}}>
 <Text style={{color:t.text,fontSize:19,fontWeight:'800',marginBottom:5}}>Select payment month</Text>
 <Text style={{color:t.muted,fontSize:12,marginBottom:18}}>Choose a month and year to filter recorded payments.</Text>
 <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:17}}>
 <TouchableOpacity onPress={()=>calendarMonth(-12)} style={{padding:12,backgroundColor:t.card2,borderRadius:10}}><Text style={{color:t.text}}>‹</Text></TouchableOpacity>
 <Text style={{color:t.text,fontSize:17,fontWeight:'800'}}>{viewMonth.getFullYear()}</Text>
 <TouchableOpacity onPress={()=>calendarMonth(12)} style={{padding:12,backgroundColor:t.card2,borderRadius:10}}><Text style={{color:t.text}}>›</Text></TouchableOpacity>
 </View>
 <View style={{flexDirection:'row',flexWrap:'wrap',gap:9}}>{Array.from({length:12},(_,i)=>{const d=new Date(viewMonth.getFullYear(),i,1),selected=month===monthKey(d);return <TouchableOpacity key={i} onPress={()=>chooseMonth(d)} accessibilityRole="button" style={{width:'30%',flexGrow:1,paddingVertical:16,alignItems:'center',backgroundColor:selected?t.purple:t.card2,borderRadius:11,borderWidth:1,borderColor:selected?t.purple:t.line}}><Text style={{color:selected?'#fff':t.text,fontWeight:selected?'800':'500'}}>{d.toLocaleDateString('en-US',{month:'short'})}</Text></TouchableOpacity>})}</View>
 <TouchableOpacity onPress={()=>setCalendarOpen(false)} style={{marginTop:18,padding:13,alignItems:'center',borderWidth:1,borderColor:t.line,borderRadius:11}}><Text style={{color:t.text,fontWeight:'600'}}>Cancel</Text></TouchableOpacity>
 </View></View></Modal>
 <View style={{backgroundColor:t.card,borderRadius:14,padding:15,borderWidth:1,borderColor:t.line}}><Text style={{color:t.muted,fontSize:12}}>{list.length} matching payments</Text><Text style={{color:t.text,fontWeight:'800',fontSize:22,marginTop:5}}>{symbol}{total.toLocaleString('en-PH',{minimumFractionDigits:2,maximumFractionDigits:2})}</Text>
 {list.map(p=><View key={p.id} style={{flexDirection:'row',justifyContent:'space-between',paddingVertical:11,borderBottomWidth:1,borderBottomColor:t.line}}><View style={{flex:1}}><Text style={{color:t.text,fontWeight:'600'}}>{p.service_name}</Text><Text style={{color:t.muted,fontSize:11}}>{p.paid_at}</Text></View><Text style={{color:t.text}}>{symbol}{Number(p.amount).toFixed(2)}</Text></View>)}
 </View></View>;
}
export function RenewalAlertPanel({subscriptions,t,onOpen}){
 const now=new Date();now.setHours(12,0,0,0);
 const alerts=[];
 for(const s of subscriptions.filter(s=>s.status==='Active')){
   const renewal=asDate(s.next_date);const days=Math.ceil((renewal-now)/86400000);
   const offsets=String(s.reminder_days||'7,3,1').split(',').map(Number);
   if(days>=0&&offsets.some(n=>Number.isInteger(n)&&days<=n))alerts.push({s,kind:'Renewal',days});
   if(s.trial_end){const trialDays=Math.ceil((asDate(s.trial_end)-now)/86400000);if(trialDays>=0&&trialDays<=3)alerts.push({s,kind:'Trial ends',days:trialDays});}
 }
 if(!alerts.length)return null;
 return <View style={{backgroundColor:t.card,borderColor:t.line,borderWidth:1,borderRadius:18,padding:16,marginBottom:16}}><Text style={{color:t.text,fontWeight:'800',fontSize:16,marginBottom:6}}>Upcoming reminders</Text><Text style={{color:t.muted,fontSize:12,marginBottom:8}}>In-app alerts based on your saved renewal and trial dates</Text>{alerts.slice(0,8).map((a,i)=><TouchableOpacity key={`${a.s.id}-${a.kind}-${i}`} onPress={()=>onOpen(a.s)} style={{paddingVertical:11,borderTopWidth:1,borderTopColor:t.line,flexDirection:'row',justifyContent:'space-between'}}><Text style={{color:t.text,fontSize:13,fontWeight:'600',flex:1}}>{a.s.name} · {a.kind}</Text><Text style={{color:a.days<=1?t.red:t.muted,fontSize:12}}>{a.days===0?'Today':`In ${a.days} days`}</Text></TouchableOpacity>)}</View>;
}
