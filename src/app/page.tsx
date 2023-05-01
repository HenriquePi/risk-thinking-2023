'use client'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import axios from 'axios'
import React from 'react'
import { InteractiveMap, RiskChart, RiskDataTable } from '@/components'
import { RiskData, RiskDataObject } from '../../risk-data/RiskDataType'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  const [riskData, setRiskData] = React.useState<RiskDataObject| null>(null);
  const [selectedDecade, setSelectedDecade] = React.useState<number | string>("All");
  const selectDecade = (decade: number) => {
    setSelectedDecade(decade);
  }

  const setMapData = async (year: number | string) => {
    if (year !== "All") {
      const res = await axios.post(`/api/riskdata`, {year: year} );
      setRiskData(res.data);
    } else {
      const res = await axios.get(`/api/riskdata`);
      setRiskData(res.data);
    }
  }

  React.useEffect(() => {
    setMapData(selectedDecade);
  }, [selectedDecade]);

  return (
    <main className="flex flex-col items-center justify-between min-h-screen p-24">
      {/* <div className="flex flex-col gap-10 xl:flex-row"> */}
        <div className="w-full">
          <InteractiveMap  riskData={riskData} selectDecade={selectDecade}/>
        </div>

        <div className="w-full">
          <RiskDataTable riskData={riskData} decade={selectedDecade}/>
        </div>
      {/* </div> */}

      <div className="w-full">
        <RiskChart riskData={riskData} decade={selectedDecade} />
      </div>
    </main>
  )
}
