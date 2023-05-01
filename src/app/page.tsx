'use client'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import axios from 'axios'
import React from 'react'
import { Controls, InteractiveMap, RiskChart, RiskDataTable } from '@/components'
import { RiskData, RiskDataObject } from '../../risk-data/RiskDataType'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  return (
    <main className="flex flex-col items-center justify-between min-h-screen p-24 pb-[200px]">
      {/* <div className="flex flex-col gap-10 xl:flex-row"> */}
      <a href="#chart">SCROLL</a>
        <div className="w-full" id="map">
          <InteractiveMap/>
        </div>

        <div className="w-full mt-4" id="table">
          <RiskDataTable/>
        </div>
      {/* </div> */}

      <div className="w-full" id="chart">
        <RiskChart/>
      </div>
      <Controls />
    </main>
  )
}
