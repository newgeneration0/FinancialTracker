import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Brain } from 'lucide-react'

function MarketInsight() {
    const [selectedMarket, setSelectedMarket] = useState('All Market')
    const [stocks, setStocks] = useState([])
    const [favourites, setFavourites] = useState<string[]>([])
    const markets = [
        {name: 'All markets', id: 'ALL'},
        {name: 'United States', id: 'US'},
        {name: 'Nigeria (NGX)', id: 'NGX'},
        {name: 'United Kingdom', id: 'UK'},
        {name: 'Canada', id: 'CA'},
    ]
    const apikey = import.meta.env.VITE_FINNHUB_KEY
    
    useEffect(()=> {
        async function fetchStocks() {
            let url = "";

            switch (selectedMarket) {
                case 'US':
                    url = `https://finnhub.io/api/v1/stock/symbol?exchange=US&token=${apikey}`;
                    break;
                case 'NGX':
                    url= `hhttps://finnhub.io/api/v1/stock/symbol?exchange=US&token=${apikey}`;
                    break;
                default:
                    url= `hhttps://finnhub.io/api/v1/stock/symbol?exchange=US&token=${apikey}`;
            }
            const res = await fetch(url);
            const data = await res.json();
            console.log(data)
            setStocks(data)
        }

        fetchStocks()
    }, [selectedMarket])

    const toggleFavourite = (symbol: string) => {
        setFavourites((prev)=>
        prev.includes(symbol) ? prev.filter((s) => s !== symbol) : [...prev, symbol]
        )
    }

  return (
    <div className="space-y-6">
        {/* AI Insights */}
        <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <Brain className="h-5 w-5 text-purple-600" />
                    <span>AI-Powered Insights</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div>
                    <select
                        value={selectedMarket}
                        onChange={(e) => setSelectedMarket(e.target.value)}
                        className='border rounded p-2'
                    >
                        {markets.map((m) => (
                            <option key={m.id} value={m.id}>
                                {m.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className='mt-8'>
                    <h3 className='text-2xl font-semibold'>Market Overview</h3>
                    <div className='grid grid-cols-4 md:grid-cols mt-3 gap-3'>
                        {stocks.slice(0,5).map((stock) => (
                            <button>
                                <Card className='px-1 py-4 hover:bg-gray-100'>
                                    <CardContent className=''>
                                        <div className='flex items-center justify-between'>
                                            <p className='text-lg font-mono font-semibold'>{stock.symbol}<span className='ms-3 border px-2 rounded-lg font-normal text-sm'>{stock.currency}</span></p>
                                            <button 
                                            onClick={()=> toggleFavourite(stock.symbol)}
                                            className='text-yellow-500 text-2xl'
                                        >
                                            {favourites.includes(stock.symbol) ? "★" : "☆"}
                                        </button>
                                        </div>
                                        <div className='mt-2'>
                                            <p className='text-sm text-left'>{stock.description}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </button>

                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
  )
}

export default MarketInsight