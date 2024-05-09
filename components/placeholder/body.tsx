'use client'
import React from 'react'
import { placeholderRunes } from '@/data/placeholders'
import Image from 'next/image'

const Body = () => {

  const runes = placeholderRunes.map(rune => (
    <Image src={rune.src} key={rune.key} width={135} height={135} alt={rune.alt} />
  ))
  return (
    <div className='space-y-7'>
        <span>Select An Item to Stake Your runes With.</span>
        <div className="flex flex-wrap gap-4">
            {runes}
        </div>
    </div>
  )
}

export default Body