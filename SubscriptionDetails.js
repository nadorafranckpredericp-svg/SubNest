import React from 'react';
import {View,Text,Image,TouchableOpacity} from 'react-native';
import {Ionicons} from '@expo/vector-icons';

export default function SubscriptionDetails({subscription:s,category,payments=[],currency='₱',theme:t,onPaid,onEdit,onToggle,onDelete}) {
  const amount=currency+Number(s.price||0).toLocaleString('en-PH',{minimumFractionDigits:2,maximumFractionDigits:2});
  const due=new Date(`${s.next_date}T12:00:00`);
  const today=new Date();today.setHours(12,0,0,0);
  const days=Math.round((due-today)/86400000);
  const dueLabel=s.status!=='Active'?'Not currently active':days<0?`${Math.abs(days)} day${Math.abs(days)===1?'':'s'} overdue`:days===0?'Due today':`In ${days} day${days===1?'':'s'}`;
  const note=(s.notes||'').trim();
  const secondary=t.muted;
  const label=(value,style={})=><Text style={{color:t.text,fontWeight:'600',fontSize:14,...style}}>{value}</Text>;
  const info=(icon,title,value)=><View style={{flexDirection:'row',alignItems:'center',gap:13,paddingVertical:15,borderBottomColor:t.line,borderBottomWidth:1}}><View style={{width:37,height:37,borderRadius:11,backgroundColor:t.card2,alignItems:'center',justifyContent:'center'}}><Ionicons name={icon} size={19} color={t.purple2}/></View><View style={{flex:1}}><Text style={{color:secondary,fontSize:12,marginBottom:4}}>{title}</Text>{label(value)}</View></View>;
  const action=(title,icon,handler,primary=false,danger=false)=><TouchableOpacity accessibilityRole="button" accessibilityLabel={title} onPress={handler} style={{flexGrow:1,flexBasis:'44%',flexDirection:'row',justifyContent:'center',alignItems:'center',gap:8,minHeight:48,borderRadius:12,backgroundColor:primary?t.purple:t.card2,borderWidth:primary?0:1,borderColor:t.line,paddingHorizontal:10}}><Ionicons name={icon} size={18} color={primary?'#fff':danger?t.red:t.text}/><Text style={{fontSize:13,fontWeight:'700',color:primary?'#fff':danger?t.red:t.text}}>{title}</Text></TouchableOpacity>;
  const initial=(s.name||'S').slice(0,1).toUpperCase();
  return <View style={{width:'100%',maxWidth:760,alignSelf:'center'}}>
    <View style={{backgroundColor:t.card,borderRadius:22,overflow:'hidden',borderWidth:1,borderColor:t.line,marginBottom:16}}>
      <View style={{height:5,backgroundColor:t.purple}}/>
      <View style={{padding:22}}>
        <View style={{flexDirection:'row',alignItems:'center',gap:16}}>
          {s.image_uri?<Image source={{uri:s.image_uri}} style={{width:66,height:66,borderRadius:17,backgroundColor:t.card2}}/>:<View style={{width:66,height:66,borderRadius:17,backgroundColor:t.card2,alignItems:'center',justifyContent:'center'}}>{label(initial,{fontSize:29,color:t.purple2})}</View>}
          <View style={{flex:1,minWidth:0}}>{label(s.name,{fontSize:23})}<Text style={{color:secondary,marginTop:5,fontSize:13}}>{category?.name||'Uncategorized'}</Text></View>
          <View style={{backgroundColor:t.card2,borderRadius:20,paddingHorizontal:12,paddingVertical:7}}><Text style={{fontSize:12,fontWeight:'700',color:s.status==='Active'?t.green:secondary}}>{s.status}</Text></View>
        </View>
        <View style={{marginTop:22,paddingTop:19,borderTopWidth:1,borderTopColor:t.line}}><Text style={{fontSize:12,color:secondary,marginBottom:5}}>Subscription amount</Text>{label(amount,{fontSize:32})}<Text style={{color:secondary,fontSize:13,marginTop:4}}>Billed {s.cycle.toLowerCase()}</Text></View>
      </View>
    </View>
    <View style={{backgroundColor:t.card,borderRadius:18,borderWidth:1,borderColor:t.line,paddingHorizontal:18,paddingVertical:5,marginBottom:16}}>
      {info('calendar-outline','Next renewal',due.toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'}))}
      {info('time-outline','Renewal status',dueLabel)}
      {info('repeat-outline','Billing cycle',s.cycle)}
      {info('pricetag-outline','Category',category?.name||'Uncategorized')}
      {info('document-text-outline','Notes',note||'No notes added')}
    </View>
    <View style={{backgroundColor:t.card,borderRadius:18,borderWidth:1,borderColor:t.line,padding:18,marginBottom:17}}>
      {label('Recent payment history',{fontSize:16,marginBottom:11})}
      {payments.filter(p=>p.subscription_id===s.id).slice(0,3).map(p=><View key={p.id} style={{flexDirection:'row',alignItems:'center',gap:10,paddingVertical:10,borderTopWidth:1,borderTopColor:t.line}}><Ionicons name="checkmark-circle-outline" size={19} color={t.green}/><View style={{flex:1}}><Text style={{color:t.text,fontWeight:'600'}}>Paid</Text><Text style={{color:t.muted,fontSize:12,marginTop:3}}>{new Date(`${p.paid_at}T12:00:00`).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</Text></View>{label(currency+Number(p.amount||0).toFixed(2))}</View>)}
      {!payments.some(p=>p.subscription_id===s.id)&&<Text style={{color:t.muted,fontSize:13}}>No payments recorded yet.</Text>}
    </View>
    <Text style={{fontSize:14,fontWeight:'700',color:t.text,marginBottom:11,marginLeft:2}}>Manage subscription</Text>
    <View style={{flexDirection:'row',flexWrap:'wrap',gap:10,marginBottom:20}}>
      {s.status==='Active'&&action('Mark as Paid','checkmark-circle-outline',onPaid,true)}
      {action('Edit','create-outline',onEdit)}
      {action(s.status==='Active'?'Pause':'Activate',s.status==='Active'?'pause-circle-outline':'play-circle-outline',onToggle)}
      {action('Delete','trash-outline',onDelete,false,true)}
    </View>
  </View>;
}
