import React,{useState} from 'react';
import {View,Text,TextInput,TouchableOpacity,ScrollView} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import Svg,{Path,Circle} from 'react-native-svg';
import {CATEGORY_COLORS} from './CategoryVisuals';

export const CATEGORY_ICONS=['pricetag','film','musical-notes','briefcase','apps','cloud','game-controller','tv','videocam','book','school','fitness','barbell','bicycle','car','airplane','train','restaurant','cafe','pizza','fast-food','basketball','football','shirt','bag','cart','gift','heart','medical','home','wifi','phone-portrait','laptop','desktop','headset','camera','images','color-palette','construct','hammer','code-slash','globe','earth','leaf','flower','paw','paw-outline','wallet','card','cash','business','people','person','sparkles','star','diamond','rocket','flash','sunny','moon','water','beer','wine','library','newspaper','key','shield','lock-closed','time','calendar','notifications','ellipsis-horizontal'];
const validHex=v=>/^#[0-9a-fA-F]{6}$/.test(v);
const hsvHex=(h,s,v)=>{const f=n=>{const k=(n+h/60)%6;return Math.round((v-v*s*Math.max(Math.min(k,4-k,1),0))*255).toString(16).padStart(2,'0')};return ('#'+f(5)+f(3)+f(1)).toUpperCase()};
const hexHue=hex=>{if(!validHex(hex))return 0;const r=parseInt(hex.slice(1,3),16)/255,g=parseInt(hex.slice(3,5),16)/255,b=parseInt(hex.slice(5,7),16)/255;const max=Math.max(r,g,b),min=Math.min(r,g,b),d=max-min;if(!d)return 0;let h=max===r?((g-b)/d)%6:max===g?(b-r)/d+2:(r-g)/d+4;return (h*60+360)%360};
const wheelPath=(cx,cy,r1,r2,a1,a2)=>{const point=(r,a)=>[cx+r*Math.cos(a),cy+r*Math.sin(a)];const [x1,y1]=point(r2,a1),[x2,y2]=point(r2,a2),[x3,y3]=point(r1,a2),[x4,y4]=point(r1,a1);return `M ${x1} ${y1} A ${r2} ${r2} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${r1} ${r1} 0 0 0 ${x4} ${y4} Z`};
export function CategoryIcon({name,color='#fff',size=22}){return CATEGORY_ICONS.includes(name)?<Ionicons name={name} size={size} color={color}/>:<Text style={{fontSize:size*0.85,color}}>{name||'🏷️'}</Text>}
export function CategoryIconEditor({value,onChange,t}){
 const [search,setSearch]=useState('');
 const shown=CATEGORY_ICONS.filter(x=>x.includes(search.toLowerCase().trim()));
 return <View style={{marginBottom:20}}>
 <Text style={{color:t.text,fontWeight:'700',fontSize:14,marginBottom:9}}>Category icon</Text>
 <TextInput placeholder="Search icons (e.g. music, camera)" placeholderTextColor={t.muted} value={search} onChangeText={setSearch} style={{backgroundColor:t.input,color:t.text,borderColor:t.line,borderWidth:1,borderRadius:12,padding:12,marginBottom:10}}/>
 <View style={{flexDirection:'row',flexWrap:'wrap',gap:8}}>{shown.map(name=><TouchableOpacity key={name} accessibilityLabel={'Select '+name+' icon'} onPress={()=>onChange(name)} style={{width:46,height:46,borderRadius:12,backgroundColor:value===name?t.purple:t.card2,borderColor:value===name?t.purple2:t.line,borderWidth:value===name?2:1,alignItems:'center',justifyContent:'center'}}><CategoryIcon name={name} color={value===name?'#fff':t.text}/></TouchableOpacity>)}</View>
 <Text style={{color:t.muted,fontSize:12,marginTop:12,marginBottom:6}}>Or enter an emoji as the category icon</Text>
 <TextInput placeholder="e.g. 🎬 or 🎧" placeholderTextColor={t.muted} value={CATEGORY_ICONS.includes(value)?'':value||''} onChangeText={v=>onChange(v.slice(0,12))} style={{backgroundColor:t.input,color:t.text,borderColor:t.line,borderWidth:1,borderRadius:12,padding:12}}/>
 </View>;
}
export function CategoryColorEditor({value,onChange,t,mode="all"}){
 const [brightness,setBrightness]=useState(100);
 const hue=hexHue(value);
 const pick=(h,v=brightness)=>onChange(hsvHex(h,1,v/100));
 const wheelSize=232,center=116,outer=108,inner=63;
 const segments=Array.from({length:72},(_,i)=>{const a1=(i*5-90)*Math.PI/180,a2=((i+1)*5-90)*Math.PI/180;return <Path key={i} d={wheelPath(center,center,inner,outer,a1,a2)} fill={hsvHex(i*5+2.5,1,brightness/100)}/>});
 const selectTouch=e=>{const {locationX:x,locationY:y}=e.nativeEvent;const dx=x-center,dy=y-center,dist=Math.sqrt(dx*dx+dy*dy);if(dist>outer+7||dist<inner-7)return;pick((Math.atan2(dy,dx)*180/Math.PI+90+360)%360)};
 return <View style={{marginBottom:24}}>
 {mode!=='wheel'&&<Text style={{color:t.text,fontWeight:'700',fontSize:14,marginBottom:10}}>{mode==='custom'?'Custom color':'Category color'}</Text>}
 {mode!=='custom'&&mode!=='wheel'&&<View style={{flexDirection:'row',flexWrap:'wrap',gap:9}}>{CATEGORY_COLORS.map(color=><TouchableOpacity key={color} onPress={()=>onChange(color)} accessibilityLabel={'Choose '+color} style={{width:42,height:42,borderRadius:12,backgroundColor:color,borderColor:value===color?t.text:'transparent',borderWidth:value===color?3:0}}/>)}</View>}
 {mode!=='custom'&&mode!=='presets'&&<><Text style={{color:t.text,fontWeight:'700',fontSize:13,marginTop:18,marginBottom:5}}>Color wheel</Text>
 <Text style={{color:t.muted,fontSize:12,marginBottom:10}}>Tap or drag around the wheel to choose a color.</Text>
 <View style={{alignItems:'center',marginBottom:12}}><View style={{width:wheelSize,height:wheelSize}} onStartShouldSetResponder={()=>true} onMoveShouldSetResponder={()=>true} onResponderGrant={selectTouch} onResponderMove={selectTouch}>
 <Svg width={wheelSize} height={wheelSize} viewBox="0 0 232 232" pointerEvents="none">{segments}<Circle cx={center} cy={center} r={inner-6} fill={t.card}/><Circle cx={center} cy={center} r={37} fill={validHex(value)?value:'#888888'}/><Circle cx={center} cy={center} r={38} stroke={t.line} strokeWidth="2" fill="none"/><Circle cx={center+86*Math.cos((hue-90)*Math.PI/180)} cy={center+86*Math.sin((hue-90)*Math.PI/180)} r={9} stroke="#FFFFFF" strokeWidth="3" fill={hsvHex(hue,1,brightness/100)}/></Svg>
 </View></View>
 <Text style={{color:t.muted,fontSize:12,marginBottom:8}}>Brightness</Text>
 <View style={{flexDirection:'row',gap:7,marginBottom:16}}>{[25,40,55,70,85,100].map(n=><TouchableOpacity key={n} accessibilityLabel={'Brightness '+n+' percent'} onPress={()=>{setBrightness(n);pick(hue,n)}} style={{flex:1,height:35,borderRadius:9,backgroundColor:hsvHex(hue,1,n/100),borderWidth:brightness===n?3:1,borderColor:brightness===n?t.text:t.line}}/>)}</View>
 </>}
 {mode!=='wheel'&&mode!=='presets'&&<><Text style={{color:t.muted,fontSize:12,marginBottom:8}}>HEX color (e.g. #22AABB)</Text>
 <View style={{flexDirection:'row',gap:10,alignItems:'center'}}><TextInput autoCapitalize="characters" value={value||''} onChangeText={v=>{if(v.length<=7)onChange(v)}} style={{flex:1,backgroundColor:t.input,color:t.text,borderWidth:1,borderColor:validHex(value)?t.line:t.red,borderRadius:12,padding:12}}/><View style={{width:46,height:46,borderRadius:12,backgroundColor:validHex(value)?value:'#888888',borderWidth:1,borderColor:t.line}}/></View></>}
 </View>;
}
