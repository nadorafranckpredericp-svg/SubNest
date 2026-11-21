import {Ionicons} from '@expo/vector-icons';
import React from 'react';
import {View,Text} from 'react-native';
export const CATEGORY_COLORS=['#E47D88','#6DA9E8','#49C7A5','#E8B96A','#B89CE5','#61C3CF','#E78F68','#91B7A1'];
export const DEFAULT_CATEGORY_COLOR=CATEGORY_COLORS[0];
export const categoryColor=(category)=>category?.color||'#8B98A9';
export function CategoryMarker({category,size=10}){return <View style={{width:size,height:size,borderRadius:size/2,backgroundColor:categoryColor(category),flexShrink:0}}/>;}
export function CategoryTag({category,theme}){return <View style={{flexDirection:'row',alignItems:'center',gap:7,marginTop:5}}>{category?.icon?<View style={{width:17,height:17,alignItems:'center',justifyContent:'center'}}>{/^[a-z-]+$/.test(category.icon)?<Ionicons name={category.icon} size={14} color={categoryColor(category)}/>:<Text style={{fontSize:13}}>{category.icon}</Text>}</View>:<CategoryMarker category={category}/>}<Text numberOfLines={1} style={{color:theme.muted,fontSize:11}}>{category?.name||'Uncategorized'}</Text></View>;}
