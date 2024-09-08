'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Image from "next/image"
import { useEffect, useState } from "react"

interface DividendData {
  ex_date: string
  payable_date: string
  symbol: string
  rate: number
}

export function DividendInfo() {
  const [dividendData, setDividendData] = useState<DividendData[]>([])

  useEffect(() => {
    const fetchDividendData = async () => {
      try {
        const response = await fetch('https://dividends-api.ferminrp.workers.dev/')
        const data = await response.json()
        setDividendData(data.corporate_actions.cash_dividends)
      } catch (error) {
        console.error('Error fetching dividend data:', error)
      }
    }

    fetchDividendData()
  }, [])

  const getImageUrl = (ticker: string) => {
    return `https://uokihdagbfiaicipggkz.supabase.co/storage/v1/object/public/finance_logos/${ticker}.svg`
  }

  const getFallbackImageUrl = (ticker: string) => {
    return `https://static.savvytrader.com/logos/${ticker}.webp`
  }

  const sortedByExDate = [...dividendData].sort((a, b) => new Date(a.ex_date).getTime() - new Date(b.ex_date).getTime())
  const sortedByPayableDate = [...dividendData].sort((a, b) => new Date(a.payable_date).getTime() - new Date(b.payable_date).getTime())

  const renderDividendList = (data: DividendData[], dateType: 'ex_date' | 'payable_date') => (
    <ul className="space-y-4">
      {data.map((item) => (
        <li key={item.symbol} className="flex items-center space-x-4 p-4 bg-secondary rounded-lg">
          <div className="w-10 h-10 relative flex-shrink-0 rounded-full overflow-hidden bg-background">
            <Image
              src={getImageUrl(item.symbol)}
              alt={`${item.symbol} logo`}
              fill
              className="rounded-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.onerror = null
                target.src = getFallbackImageUrl(item.symbol)
              }}
            />
          </div>
          <div className="flex-grow">
            <div className="flex justify-between items-baseline">
              <h3 className="text-lg font-semibold">
                {item.symbol}{" "}
                <span className="text-sm font-normal text-muted-foreground hidden sm:inline">
                  en {Math.max(0, Math.floor((new Date(item[dateType]).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))} día(s) el {item[dateType]}
                </span>
              </h3>
            </div>
            <p className="text-sm text-muted-foreground hidden sm:block">
              {dateType === 'ex_date' ? `Fecha de Pago: ${item.payable_date}` : `Fecha Ex-Dividendo: ${item.ex_date}`}
            </p>
            <p className="text-sm text-muted-foreground sm:hidden">
              {dateType === 'ex_date' ? `Ex: ${item.ex_date}` : `Pago: ${item.payable_date}`}
            </p>
          </div>
          <div className="text-right">
            <CardDescription>Dividendo</CardDescription>
            <CardTitle className="text-xl sm:text-2xl">${item.rate.toFixed(2)}</CardTitle>
          </div>
        </li>
      ))}
    </ul>
  )

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Próximos Dividendos</CardTitle>
        <p className="text-center text-muted-foreground">Fechas Ex Dividendos en el próximo mes</p>
      </CardHeader>
      <CardContent>
        {renderDividendList(sortedByExDate, 'ex_date')}
      </CardContent>
      <CardHeader>
        <p className="text-center text-muted-foreground">Fechas de pago en el próximo mes</p>
      </CardHeader>
      <CardContent>
        {renderDividendList(sortedByPayableDate, 'payable_date')}
      </CardContent>
    </Card>
  )
}