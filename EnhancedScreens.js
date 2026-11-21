import {Linking,Platform} from 'react-native';
import {serviceUrl} from './SubscriptionExtras';
import {CategoryIcon} from './CategoryEditorExtras';
import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const label=(value,size=13,color='#64748b',weight='400',style={})=><Text style={{fontSize:size,color,fontWeight:weight,...style}}>{value}</Text>;
const dateLabel=(date)=>{if(!date)return 'Not scheduled';const d=new Date(`${date}T12:00:00`);return Number.isNaN(d.getTime())?date:d.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});};
const parseDay=(date)=>new Date(`${date}T12:00:00`);
const dayDiff=(date)=>{const now=new Date();const today=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;return Math.round((parseDay(date)-parseDay(today))/86400000);};
const icon=(name,size=19,color='#64748b')=><Ionicons name={name} size={size} color={color}/>;
const action=(title,iconName,fn,background,color,border)=> <TouchableOpacity onPress={fn} accessibilityRole="button" style={{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:8,backgroundColor:background,borderRadius:13,borderWidth:border?1:0,borderColor:border||'transparent',paddingHorizontal:18,paddingVertical:14,minHeight:48}}>{icon(iconName,17,color)}{label(title,13,color,'700')}</TouchableOpacity>;

export function SubscriptionDetailView({s,cat,t,sym,money,monthly,logo,onBack,onPaid,onEdit,onToggle,onDelete,payments=[]}){
 const {width}=useWindowDimensions();const wide=width>=760;
 const diff=dayDiff(s.next_date),paused=s.status!=='Active';
 const status=paused?'Paused':diff<0?`${Math.abs(diff)} days overdue`:diff===0?'Due today':`Due in ${diff} day${diff===1?'':'s'}`;
 const recent=payments.filter(p=>p.subscription_id===s.id).slice(0,3);
 const panel={backgroundColor:t.card,borderWidth:1,borderColor:t.line,borderRadius:20,overflow:'hidden'};
 const info=(title,value,ico,last=false)=><View style={{flexDirection:'row',alignItems:'center',gap:13,paddingVertical:15,borderBottomWidth:last?0:1,borderColor:t.line}}>
   <View style={{width:38,height:38,borderRadius:11,backgroundColor:t.card2,alignItems:'center',justifyContent:'center'}}>{icon(ico,19,t.purple2)}</View>
   <View style={{flex:1}}>{label(title,12,t.muted,'500')}{label(value,14,t.text,'600',{marginTop:4})}</View>
 </View>;
 return <View style={{width:'100%',maxWidth:1000,alignSelf:'center',paddingBottom:30}}>
  <TouchableOpacity onPress={onBack} style={{flexDirection:'row',alignItems:'center',gap:10,marginBottom:18,paddingVertical:6}}>{icon('arrow-back',20,t.text)}{label('Subscription Details',18,t.text,'700')}</TouchableOpacity>
  <View style={{...panel,marginBottom:15}}>
   <View style={{height:3,backgroundColor:t.purple2,opacity:.65}}/>
   <View style={{padding:wide?26:20}}>
    <View style={{flexDirection:'row',alignItems:'flex-start',gap:15}}>
     <View style={{width:72,height:72,borderRadius:16,backgroundColor:t.card2,alignItems:'center',justifyContent:'center',overflow:'hidden'}}>{s.image_uri?<Image source={{uri:s.image_uri}} style={{width:72,height:72}} resizeMode="cover"/>:<View style={{transform:[{scale:1.6}]}}>{logo(s)}</View>}</View>
     <View style={{flex:1,minWidth:0}}>{label(s.name,wide?27:23,t.text,'800')}{label(cat?.name||'Uncategorized',13,t.muted,'500',{marginTop:5})}</View>
     <View style={{backgroundColor:t.card2,borderRadius:30,paddingHorizontal:11,paddingVertical:7}}>{label(s.status,11,s.status==='Active'?t.green:t.muted,'700')}</View>
    </View>
    <View style={{marginTop:22,paddingTop:18,borderTopWidth:1,borderTopColor:t.line}}>
      {label('SUBSCRIPTION AMOUNT',11,t.muted,'700',{letterSpacing:1})}
      <View style={{flexDirection:wide?'row':'column',alignItems:wide?'center':'flex-start',justifyContent:'space-between',gap:12,marginTop:6}}>
       <View style={{flexDirection:'row',alignItems:'baseline',gap:8,flexShrink:1,flexWrap:'wrap'}}>{label(money(s.price,sym),32,t.text,'800')}{label('/ '+s.cycle.toLowerCase(),13,t.muted)}</View>
       {serviceUrl(s)?<TouchableOpacity accessibilityRole="button" accessibilityLabel={'Open '+s.name+' service'} onPress={async()=>{const url=serviceUrl(s);if(!url)return;try{if(Platform.OS==='web')window.open(url,'_blank','noopener,noreferrer');else await Linking.openURL(url)}catch(e){console.warn('Unable to open subscription service',e)}}} style={{flexDirection:'row',alignItems:'center',gap:8,paddingHorizontal:16,paddingVertical:11,borderRadius:12,backgroundColor:t.card2,borderWidth:1,borderColor:t.line}}>{icon('open-outline',17,t.text)}{label('Open Service',13,t.text,'700')}</TouchableOpacity>:<TouchableOpacity accessibilityRole="button" onPress={onEdit} style={{flexDirection:'row',alignItems:'center',gap:8,paddingHorizontal:16,paddingVertical:11,borderRadius:12,backgroundColor:t.card2,borderWidth:1,borderColor:t.line}}>{icon('link-outline',17,t.muted)}{label('Add service link',13,t.muted,'600')}</TouchableOpacity>}
      </View>
    </View>
   </View>
  </View>
  <View style={{flexDirection:wide?'row':'column',gap:15}}>
   <View style={{flex:wide?1.4:undefined,gap:15}}>
    <View style={{...panel,paddingHorizontal:19,paddingTop:7,paddingBottom:5}}>
     {info('Next renewal',dateLabel(s.next_date),'calendar-outline')}
     {info('Renewal status',status,'time-outline')}
     {info('Billing cycle',s.cycle,'repeat-outline')}
     {info('Monthly equivalent',money(monthly(s),sym),'wallet-outline')}
     {info('Category',cat?.name||'Uncategorized','pricetag-outline')}
     {info('Notes',s.notes?.trim()||'No notes added','document-text-outline',true)}
    </View>
    <View style={{...panel,padding:19}}>
      {label('Payment History',16,t.text,'800',{marginBottom:12})}
      {recent.length===0?label('No payments recorded yet.',13,t.muted):recent.map(p=><View key={p.id} style={{flexDirection:'row',alignItems:'center',gap:11,paddingVertical:12,borderTopWidth:1,borderTopColor:t.line}}>
       {icon('checkmark-circle',20,t.green)}
       <View style={{flex:1}}>{label('Paid',13,t.text,'700')}{label(dateLabel(p.paid_at),11,t.muted,'400',{marginTop:4})}</View>
       {label(money(p.amount,sym),13,t.text,'700')}
      </View>)}
    </View>
   </View>
   <View style={{flex:1,gap:15}}>
    <View style={{...panel,padding:19}}>
     {label('QUICK ACTIONS',11,t.muted,'800',{letterSpacing:1.3,marginBottom:14})}
     {!paused&&<View style={{marginBottom:10}}>{action('Mark as Paid','checkmark-circle-outline',onPaid,t.purple,'#fff')}</View>}
     <View style={{flexDirection:'row',gap:10}}>
      <View style={{flex:1}}>{action('Edit Plan','create-outline',onEdit,t.card2,t.text,t.line)}</View>
      <View style={{flex:1}}>{action(paused?'Resume':'Pause',paused?'play-circle-outline':'pause-circle-outline',onToggle,t.card2,t.text,t.line)}</View>
     </View>
     <TouchableOpacity onPress={onDelete} accessibilityRole="button" style={{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:7,paddingVertical:13,marginTop:12}}>{icon('trash-outline',15,t.red)}{label('Delete subscription',12,t.red,'600')}</TouchableOpacity>
    </View>
    <View style={{backgroundColor:t.card2,borderRadius:16,padding:17,gap:7}}>
      {label('Renewal tracking',13,t.text,'700')}
      {label('Mark as Paid saves the payment and moves the renewal date forward by one billing cycle.',12,t.muted,'400',{lineHeight:19})}
    </View>
   </View>
  </View>
 </View>;
}
export function RenewalCalendarView({month,setMonth,calendarDay,setCalendarDay,active,categories=[],t,sym,money,onOpenSubscription,addCycle}){
 const {width}=useWindowDimensions();const wide=width>=760;
 const year=month.getFullYear(),monthIndex=month.getMonth(),first=new Date(year,monthIndex,1).getDay(),days=new Date(year,monthIndex+1,0).getDate();
 const today=new Date();const todayISO=`${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
 const monthStart=`${year}-${String(monthIndex+1).padStart(2,'0')}-01`;
 const events=[];
 for(const s of active){let d=s.next_date;for(let i=0;i<100;i++){if(!d||d.slice(0,7)>monthStart.slice(0,7))break;if(d.slice(0,7)===monthStart.slice(0,7))events.push({...s,date:d});const next=addCycle(d,s.cycle);if(!next||next===d)break;d=next;}}
 const grouped={};for(const event of events)(grouped[event.date]??=[]).push(event);
 const shown=(calendarDay?grouped[calendarDay]||[]:events).slice().sort((a,b)=>a.date.localeCompare(b.date));
 const total=events.reduce((a,e)=>a+Number(e.price||0),0);
 const move=(offset)=>{setMonth(new Date(year,monthIndex+offset,1));setCalendarDay(null)};
 const navButton=(ico,fn)=><TouchableOpacity onPress={fn} style={{width:40,height:40,borderRadius:12,backgroundColor:t.card2,alignItems:'center',justifyContent:'center'}}>{icon(ico,20,t.text)}</TouchableOpacity>;
 const cellSize=wide?80:54;
 return <View style={{width:'100%',maxWidth:1100,alignSelf:'center',paddingBottom:25}}>
  <View style={{marginBottom:19}}>{label('Renewal calendar',wide?27:22,t.text,'800')}{label('Track your upcoming subscription billing dates.',13,t.muted,'400',{marginTop:6})}</View>
  <View style={{flexDirection:wide?'row':'column',gap:15,marginBottom:17}}>
   <View style={{flex:1,backgroundColor:t.card,borderRadius:17,padding:18,borderWidth:1,borderColor:t.line}}>{label('Renewals this month',12,t.muted,'600')}{label(String(events.length),25,t.text,'800',{marginTop:6})}</View>
   <View style={{flex:1,backgroundColor:t.card,borderRadius:17,padding:18,borderWidth:1,borderColor:t.line}}>{label('Scheduled total',12,t.muted,'600')}{label(money(total,sym),25,t.text,'800',{marginTop:6})}</View>
  </View>
  <View style={{flexDirection:wide?'row':'column',gap:17,alignItems:'flex-start'}}>
   <View style={{flex:wide?1.65:undefined,width:wide?undefined:'100%',backgroundColor:t.card,borderRadius:20,padding:wide?22:12,borderWidth:1,borderColor:t.line}}>
    <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>{navButton('chevron-back',()=>move(-1))}<View style={{alignItems:'center'}}>{label(month.toLocaleDateString('en-US',{month:'long',year:'numeric'}),wide?19:16,t.text,'800')}
    <TouchableOpacity onPress={()=>{setMonth(new Date(today.getFullYear(),today.getMonth(),1));setCalendarDay(null)}} style={{marginTop:6}}>{label('Jump to today',11,t.purple2,'700')}</TouchableOpacity></View>{navButton('chevron-forward',()=>move(1))}</View>
    <View style={{flexDirection:'row',marginBottom:7}}>{['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d=><View key={d} style={{width:'14.285%',alignItems:'center',paddingVertical:7}}>{label(d,11,t.muted,'700')}</View>)}</View>
    <View style={{flexDirection:'row',flexWrap:'wrap'}}>{Array.from({length:Math.ceil((first+days)/7)*7},(_,i)=>{const day=i-first+1,valid=day>=1&&day<=days;const date=valid?`${year}-${String(monthIndex+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`:null;const matches=date?grouped[date]||[]:[];const selected=date===calendarDay,isToday=date===todayISO,overdue=date<todayISO&&matches.length>0;
     return <TouchableOpacity key={i} disabled={!valid} onPress={()=>setCalendarDay(selected?null:date)} style={{width:'14.285%',height:cellSize,alignItems:'center',justifyContent:'center',padding:2}}><View style={{width:'100%',height:'100%',borderRadius:11,alignItems:'center',justifyContent:'center',backgroundColor:selected?t.purple:isToday?t.card2:'transparent',borderWidth:isToday&&!selected?1:0,borderColor:t.purple2}}>{valid&&<>{label(day,wide?14:12,selected?'#fff':t.text,selected||isToday?'800':'500')}{matches.length>0&&<View style={{flexDirection:'row',alignItems:'center',gap:3,marginTop:3}}>{matches[0].image_uri?<Image source={{uri:matches[0].image_uri}} style={{width:wide?17:13,height:wide?17:13,borderRadius:4}}/>:<View style={{width:7,height:7,borderRadius:4,backgroundColor:categories.find(c=>c.id===matches[0].category_id)?.color||t.purple2}}/>}{matches.length>1&&label('+'+(matches.length-1),9,t.muted,'700')}</View>}</>}</View></TouchableOpacity>})}</View>
    <View style={{flexDirection:'row',gap:15,flexWrap:'wrap',marginTop:16,paddingTop:13,borderTopWidth:1,borderColor:t.line}}>{label('●  Scheduled',11,t.purple2,'600')}{label('●  Overdue',11,t.red,'600')}{label('Tap a date to filter',11,t.muted)}</View>
   </View>
   <View style={{flex:1,width:wide?undefined:'100%',backgroundColor:t.card,borderRadius:20,padding:19,borderWidth:1,borderColor:t.line}}>
    <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:15}}><View style={{flex:1}}>{label(calendarDay?dateLabel(calendarDay):'This month’s renewals',16,t.text,'800')}{label(`${shown.length} scheduled ${shown.length===1?'renewal':'renewals'}`,12,t.muted,'400',{marginTop:5})}</View>{calendarDay&&<TouchableOpacity onPress={()=>setCalendarDay(null)}>{label('Clear',12,t.purple2,'700')}</TouchableOpacity>}</View>
    {shown.length===0?<View style={{alignItems:'center',paddingVertical:35,gap:10}}>{icon('calendar-clear-outline',30,t.muted)}{label('No renewals for this selection',13,t.muted)}</View>:shown.map((event,i)=><TouchableOpacity key={`${event.id}-${event.date}-${i}`} onPress={()=>onOpenSubscription(event)} style={{flexDirection:'row',alignItems:'center',gap:12,paddingVertical:13,borderTopWidth:i?1:0,borderColor:t.line}}><View style={{width:43,height:43,borderRadius:12,backgroundColor:t.card2,alignItems:'center',justifyContent:'center'}}>{event.image_uri?<Image source={{uri:event.image_uri}} style={{width:43,height:43,borderRadius:12}} resizeMode='cover'/>:<CategoryIcon name={categories.find(c=>c.id===event.category_id)?.icon||'receipt-outline'} color={categories.find(c=>c.id===event.category_id)?.color||t.purple2} size={22}/>}</View><View style={{flex:1}}>{label(event.name,13,t.text,'700')}{label(dateLabel(event.date),11,event.date<todayISO?t.red:t.muted,'500',{marginTop:5})}</View><View style={{alignItems:'flex-end'}}>{label(money(event.price,sym),13,t.text,'700')}{icon('chevron-forward',14,t.muted)}</View></TouchableOpacity>)}
   </View>
  </View>
 </View>;
}
