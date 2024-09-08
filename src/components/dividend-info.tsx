'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

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

  const filterFutureDividends = (data: DividendData[], dateType: 'ex_date' | 'payable_date') => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return data.filter(item => new Date(item[dateType]) >= today);
  };

  const sortedByExDate = filterFutureDividends([...dividendData], 'ex_date')
    .sort((a, b) => new Date(a.ex_date).getTime() - new Date(b.ex_date).getTime());

  const sortedByPayableDate = filterFutureDividends([...dividendData], 'payable_date')
    .sort((a, b) => new Date(a.payable_date).getTime() - new Date(b.payable_date).getTime());

  const renderDividendList = (data: DividendData[], dateType: 'ex_date' | 'payable_date') => (
    <ul className="space-y-4">
      {data.map((item) => (
        <li key={item.symbol} className="flex items-center space-x-4 p-4 bg-secondary rounded-lg dark:bg-gray-800">
          <Avatar className="w-10 h-10 rounded-full overflow-hidden">
            <AvatarImage src={getImageUrl(item.symbol)} alt={`${item.symbol} logo`} className="object-cover rounded-lg" />
            <AvatarFallback className="bg-primary text-primary-foreground rounded-lg">
              {item.symbol[0]}
            </AvatarFallback >
          </Avatar>
          <div className="flex-grow">
            <div className="flex justify-between items-baseline">
              <h3 className="text-lg font-semibold dark:text-white">
                {item.symbol}{" "}
                <span className="text-sm font-normal text-muted-foreground dark:text-gray-400 hidden sm:inline">
                  en {Math.max(0, Math.floor((new Date(item[dateType]).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))} día(s) el {item[dateType]}
                </span>
              </h3>
            </div>
            <p className="text-sm text-muted-foreground dark:text-gray-400 hidden sm:block">
              {dateType === 'ex_date' ? `Fecha de Pago: ${item.payable_date}` : `Fecha Ex-Dividendo: ${item.ex_date}`}
            </p>
            <p className="text-sm text-muted-foreground dark:text-gray-400 sm:hidden">
              {dateType === 'ex_date' ? `Ex: ${item.ex_date}` : `Pago: ${item.payable_date}`}
            </p>
          </div>
          <div className="text-right">
            <CardDescription className="dark:text-gray-400">Dividendo</CardDescription>
            <CardTitle className="text-xl sm:text-2xl dark:text-white">${item.rate.toFixed(2)}</CardTitle>
          </div>
        </li>
      ))}
    </ul>
  )

  return (
    <Card className="w-full max-w-3xl mx-auto dark:bg-gray-800 dark:text-white">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center dark:text-white">Fechas Ex Dividendos</CardTitle>
        <p className="text-center text-muted-foreground dark:text-gray-400">En el próximo mes</p>
      </CardHeader>
      <CardContent>
        {renderDividendList(sortedByExDate, 'ex_date')}
      </CardContent>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center dark:text-white">Fechas de Pago</CardTitle>
        <p className="text-center text-muted-foreground dark:text-gray-400">En el próximo mes</p>
      </CardHeader>
      <CardContent>
        {renderDividendList(sortedByPayableDate, 'payable_date')}
      </CardContent>
    </Card>
  )
}