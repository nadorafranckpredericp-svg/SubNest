import React,{useState,useMemo} from 'react';
import {View,Text,TextInput,TouchableOpacity,ScrollView} from 'react-native';
import {WORLD_CURRENCIES,legacyCurrencyCode} from './WorldCurrencies';
export default function CurrencyPicker({value,onChange,t}){
 const [search,setSearch]=useState('');
 const current=legacyCurrencyCode(value);
 const options=useMemo(()=>WORLD_CURRENCIES.filter(c=>(c.name+' '+c.code).toLowerCase().includes(search.trim().toLowerCase())),[search]);
 return <View style={{paddingBottom:15}}>
 <Text style={{color:t.text,fontSize:16,fontWeight:'800',marginBottom:5}}>Display currency</Text>
 <Text style={{color:t.muted,fontSize:12,marginBottom:12}}>Search by currency name or ISO code. Listed alphabetically.</Text>
 <TextInput placeholder="Search 181 currencies..." placeholderTextColor={t.muted} value={search} onChangeText={setSearch} style={{padding:14,borderWidth:1,borderColor:t.line,borderRadius:13,backgroundColor:t.input,color:t.text,marginBottom:12}}/>
 <Text style={{color:t.muted,fontSize:12,marginBottom:8}}>{options.length} results · Selected: {current}</Text>
 <ScrollView nestedScrollEnabled style={{maxHeight:430,borderWidth:1,borderColor:t.line,borderRadius:15,backgroundColor:t.card}} keyboardShouldPersistTaps="handled">
 {options.map(c=><TouchableOpacity key={c.code} accessibilityLabel={'Select '+c.name} onPress={()=>onChange(c.code)} style={{paddingHorizontal:15,paddingVertical:13,borderBottomWidth:1,borderBottomColor:t.line,backgroundColor:current===c.code?t.card2:'transparent',flexDirection:'row',gap:12,alignItems:'center'}}><Text style={{color:t.text,flex:1,fontSize:13,fontWeight:current===c.code?'800':'500'}}>{c.name}</Text><Text style={{color:current===c.code?t.purple2:t.muted,fontWeight:'700',fontSize:12}}>{c.code}{current===c.code?' ✓':''}</Text></TouchableOpacity>)}
 {options.length===0&&<Text style={{color:t.muted,padding:18}}>No matching currencies</Text>}
 </ScrollView>
 <Text style={{color:t.muted,fontSize:12,lineHeight:19,marginTop:12}}>Changing the display currency does not convert stored subscription amounts or apply exchange rates.</Text>
 </View>;
}
