'use client';
import Image from 'next/image';
import {useState} from 'react';
import type {ReactNode} from 'react';
type ArtworkAsset={path:string;alt:string;title:string};
const river={path:'/images/trang-giang.webp',alt:'Tranh minh họa sông rộng lúc chiều muộn, thuyền nhỏ và bờ xa.',title:'Sông chiều'};
export function Artwork({asset=river,priority=false,className='',motif}:{asset?:ArtworkAsset;priority?:boolean;className?:string;motif?:ReactNode}){const [failed,setFailed]=useState(false);return <div className={`artwork ${className}`}>{failed?(motif??<div className="image-fallback">{asset.title}<br/><small>Minh họa chưa tải được.</small></div>):<Image src={asset.path} alt={asset.alt} width={1400} height={933} quality={65} sizes="(max-width: 390px) calc(100vw - 32px), (max-width: 767px) calc(100vw - 40px), (max-width: 1100px) calc(60vw - 36px), 744px" priority={priority} onError={()=>setFailed(true)}/>}</div>;}
