import React,{useState} from 'react';
import {View,Text,TextInput,TouchableOpacity,Linking,Platform} from 'react-native';

const defaults={
 netflix:['https://www.netflix.com','https://www.netflix.com/YourAccount'],
 spotify:['https://open.spotify.com','https://www.spotify.com/account/'],
 youtube:['https://www.youtube.com','https://www.youtube.com/paid_memberships'],
 'disney+':['https://www.disneyplus.com','https://www.disneyplus.com'],
};
export const safeUrl=v=>{try{const u=new URL((v||'').trim());return (u.protocol==='https:'||u.protocol==='http:')&&!!u.hostname&& !u.username&&!u.password ? u.href : null;}catch{return null;}};
const lookup=s=>Object.entries(defaults).find(([key])=>s.name?.toLowerCase().includes(key))?.[1]||[];
export const serviceUrl=s=>safeUrl(s.home_url)||safeUrl(lookup(s)[0]);
export function SubscriptionExtras({s,t,prices=[],onSave,onArchive,onNotify}){
 const [editing,setEditing]=useState(false);const [showHistory,setShowHistory]=useState(false);const [moreActions,setMoreActions]=useState(false);
 const [home,setHome]=useState(s.home_url||'');const [manage,setManage]=useState(s.manage_url||'');
 const [trial,setTrial]=useState(s.trial_end||'');const [reminder,setReminder]=useState(s.reminder_days||'7,3,1');
 const [saving,setSaving]=useState(false);const [err,setErr]=useState('');
 const panel={backgroundColor:t.card,borderColor:t.line,borderWidth:1,borderRadius:19,padding:18,marginTop:14};
 const txt=(value,size=13,color=t.text,weight='400')=><Text style={{fontSize:size,color,fontWeight:weight}}>{value}</Text>;
 const button=(label,action,outline=false)=><TouchableOpacity accessibilityRole="button" onPress={action} style={{padding:13,borderRadius:12,backgroundColor:outline?t.card2:t.purple,marginTop:9,alignItems:'center',borderWidth:outline?1:0,borderColor:t.line}}>{txt(label,13,outline?t.text:'#fff','700')}</TouchableOpacity>;
 const input=(title,value,set,placeholder)=><View style={{marginTop:13}}>{txt(title,12,t.muted,'600')}<TextInput autoCapitalize="none" value={value} onChangeText={set} placeholder={placeholder} placeholderTextColor={t.muted} style={{marginTop:7,padding:12,color:t.text,backgroundColor:t.input,borderRadius:10,borderWidth:1,borderColor:t.line}}/></View>;
 const open=async(value)=>{const url=safeUrl(value);if(!url)return setErr('Enter a valid http:// or https:// link in Edit links.');try{if(Platform.OS==='web'){window.open(url,'_blank','noopener,noreferrer');}else await Linking.openURL(url);}catch(e){setErr(e.message||'Could not open the link.')}};
 const known=lookup(s),site=home||known[0],account=manage||known[1];
 const save=async()=>{if((home&&!safeUrl(home))||(manage&&!safeUrl(manage)))return setErr('Use a valid http:// or https:// address.');if(trial&&!/^\d{4}-\d{2}-\d{2}$/.test(trial))return setErr('Trial end date must be YYYY-MM-DD.');const nums=reminder.split(',').map(v=>Number(v.trim()));if(nums.some(v=>!Number.isInteger(v)||v<0||v>365))return setErr('Reminder days must be comma-separated numbers from 0 to 365.');setSaving(true);try{await onSave({home_url:home.trim(),manage_url:manage.trim(),trial_end:trial.trim(),reminder_days:[...new Set(nums)].join(',')});setEditing(false);setErr('')}catch(e){setErr(e.message||'Could not save changes')}finally{setSaving(false)}};
 return <View style={{marginTop:4,marginBottom:22}}>
  <View style={panel}>
   {txt('SERVICE & PREFERENCES',11,t.muted,'800')}
   <View style={{marginTop:8,marginBottom:14}}>{txt('Quick access',17,t.text,'800')}{txt('Open the service or manage your account.',12,t.muted)}</View>
   <View style={{flexDirection:'row',gap:9}}>
    {!site&&<View style={{flex:1}}>{txt('No service URL set. Add one below to enable Open Service.',12,t.muted)}</View>}
    {!!account&&<View style={{flex:1}}>{button('Manage Account',()=>open(account),true)}</View>}
   </View>
   <TouchableOpacity accessibilityRole="button" onPress={()=>setEditing(!editing)} style={{paddingVertical:16,marginTop:12,borderTopWidth:1,borderTopColor:t.line,flexDirection:'row',justifyContent:'space-between'}}>{txt('Links, trial & reminders',13,t.text,'700')}{txt(editing?'− Hide':'＋ Edit',12,t.muted,'700')}</TouchableOpacity>
   {editing&&<View>{input('App / website URL',home,setHome,'https://example.com')}{input('Account / billing URL',manage,setManage,'https://example.com/account')}{input('Free trial ends (optional)',trial,setTrial,'YYYY-MM-DD')}{input('Remind days before renewal',reminder,setReminder,'7,3,1')}{button(saving?'Saving...':'Save preferences',save)}</View>}
   {!!trial&&<View style={{paddingVertical:13,borderTopWidth:1,borderTopColor:t.line}}>{txt('Free trial ends',12,t.muted)}{txt(trial,14,t.text,'700')}</View>}
   <TouchableOpacity accessibilityRole="button" onPress={()=>setShowHistory(!showHistory)} style={{paddingVertical:16,borderTopWidth:1,borderTopColor:t.line,flexDirection:'row',justifyContent:'space-between'}}>{txt('Price change history',13,t.text,'700')}{txt(`${prices.length} changes  ${showHistory?'−':'＋'}`,12,t.muted)}</TouchableOpacity>
   {showHistory&&(prices.length?prices.map((p,i)=><View key={p.id||i} style={{paddingVertical:9,borderTopWidth:1,borderTopColor:t.line}}>{txt(`${p.old_price} → ${p.new_price}`,14,t.text,'700')}{txt(p.changed_at,11,t.muted)}</View>):txt('No price changes recorded yet.',12,t.muted))}
   <TouchableOpacity accessibilityRole="button" onPress={()=>setMoreActions(!moreActions)} style={{paddingVertical:16,borderTopWidth:1,borderTopColor:t.line,flexDirection:'row',justifyContent:'space-between'}}>{txt('More actions',13,t.muted,'700')}{txt(moreActions?'−':'＋',14,t.muted)}</TouchableOpacity>
   {moreActions&&<TouchableOpacity onPress={onArchive} accessibilityRole="button" style={{padding:13,backgroundColor:t.card2,borderRadius:12,alignItems:'center'}}>{txt(s.status==='Archived'?'Restore from Archive':'Archive Subscription',13,t.text,'700')}</TouchableOpacity>}
  </View>
  {!!err&&<View style={{padding:12}}>{txt(err,12,t.red)}</View>}
 </View>;
}
