"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Avatar } from "@heroui/avatar"
import { Input } from "@heroui/input"
import { Kbd } from "@heroui/kbd"
import { Trophy } from "lucide-react"

import { SearchIcon } from "@/components/icons";
import { getContract } from "@/contract/contract"
import React from "react"

export default function LeaderboardPage() {
  const [tabs, setTabs] = useState("topBidders")
  const [topPlayersSpend, setTopPlayersSpend] = useState<any[]>([])
  const [topPlayersBid, setTopPlayersBid] = useState<any[]>([])
  const [otherPlayersSpend, setOtherPlayersSpend] = useState<any[]>([])
  const [otherPlayersBid, setOtherPlayersBid] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  React.useEffect(() => {
    async function fetchData() {
      setLoading(true)

      try {
        const contract = await getContract()
        const [addresses, bidCounts, spends] = await contract.getAllUsersStats()

        const users = addresses.map((addr: string, i: number) => ({
          address: addr,
          name: `${addr.slice(0, 6)}...${addr.slice(-4)}`,
          totalBids: bidCounts[i]?.toNumber?.() ?? 0,
          totalSpends: spends[i]?.toNumber?.() ?? 0,
        }))

        const topBidders = users
          .filter((u: any) => u.totalBids > 0)
          .sort((a: any, b: any) => b.totalBids - a.totalBids)
          .slice(0, 20)

        const topSpenders = users
          .filter((u: any) => u.totalSpends > 0)
          .sort((a: any, b: any) => b.totalSpends - a.totalSpends)
          .slice(0, 20)

        setTopPlayersBid(topBidders.slice(0, 3))
        setTopPlayersSpend(topSpenders.slice(0, 3))
        setOtherPlayersBid(topBidders.slice(3))
        setOtherPlayersSpend(topSpenders.slice(3))
      } catch (error) {
        console.error("Failed to fetch leaderboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])



  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
  }

  return (
    <div className="flex h-screen">

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        {/* Club header with gradient background */}
        <div className="relative border-b dark:border-[#2A2A2A]">
          {/* Gradient background */}
          <div className="absolute inset-0 overflow-hidden">
            <div
              className="absolute inset-0 bg-[url('/CosmicVoyagers.jpg?height=400&width=1200')] bg-cover bg-center opacity-20"
              style={{ filter: "blur(2px)" }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#121212] via-white/70 dark:via-[#121212]/70 to-transparent"></div>
          </div>

          {/* Content */}
          <div className="relative px-6 py-4 mt-24 flex items-center gap-6 z-10">
            {topPlayersSpend[0] ? (
              <>
                <Avatar className="h-16 w-16 rounded-full ring-2 ring-[#FF6B00]/30">
                  <Avatar
                    src="/placeholder.svg?height=64&width=64"
                    alt={topPlayersSpend[0].name}
                  />
                </Avatar>

                <div className="flex-1">
                  <h1 className="text-xl font-bold text-start">{topPlayersSpend[0].name}</h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 text-start">
                    Top Spender in last auction period.
                  </p>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Leaderboard resets in:</span>
                  <span className="text-black dark:text-white">21 : 52</span>
                </div>
              </>
            ) : (
              <div className="text-sm text-gray-500">No spenders.</div>
            )}
          </div>
        </div>

        {/* Leaderboard filters */}
        <div className="px-6 py-4 flex items-center justify-between border-b dark:border-[#2A2A2A]">
          <div className="flex items-center gap-6">
            <button className="text-sm font-medium px-2 py-1 hover:bg-gray-200 dark:hover:bg-[#2A2A2A] rounded" onClick={() => setTabs('topBidders')}>Top Bidders</button>
            <button className="text-sm font-medium px-2 py-1 hover:bg-gray-200 dark:hover:bg-[#2A2A2A] rounded" onClick={() => setTabs('topSpender')}>Top Spenders</button>
          </div>
          <div className="w-[300px]">
            <Input
              aria-label="Search"
              classNames={{
                inputWrapper: "bg-default-100",
                input: "text-sm",
              }}
              endContent={
                <Kbd className="hidden lg:inline-block" keys={["command"]}>
                  K
                </Kbd>
              }
              labelPlacement="outside"
              placeholder="Search..."
              startContent={
                <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
              }
              type="search"
            />
          </div>
        </div>

        {/* Top 3 players */}
        <motion.div className="grid grid-cols-3 gap-4 px-6 py-4" variants={container} initial="hidden" animate="show">
          {(tabs === 'topBidders' ? topPlayersBid : topPlayersSpend).map((player, index) => (
            <motion.div
              key={player.id}
              variants={item}
              className="rounded-md p-4 border dark:border-[#2A2A2A] flex items-center justify-between"
            >
              <div className="flex flex-col gap-4 w-full">
                <div className="flex justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <Avatar name={player.name} />
                    </Avatar>

                    <div>
                      <div className="font-medium text-start">{player.name}</div>
                    </div>
                  </div>

                  <Trophy className="h-6 w-6 text-amber-500" />
                </div>

                <div key={`stats-${player.id}`} className="flex justify-between text-sm">
                  <div className="flex flex-row gap-2 w-full justify-between items-center">
                    <div className="text-gray-600 dark:text-gray-400">
                      {tabs === 'topBidders' ? 'Total Bids' : 'Total Spends'}
                    </div>
                    <div className="font-medium mt-1">
                      {tabs === 'topBidders' ? player.totalBids : player.totalSpends}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Leaderboard table */}
        <div className="px-6 py-6 flex-1 overflow-auto">
          {(tabs === 'topBidders' ? otherPlayersBid : otherPlayersSpend).length === 0 ? (
            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              No data available.
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left text-sm">
                  <th className="pb-3 font-medium w-[10%] text-center">Place</th>
                  <th className="pb-3 font-medium w-[70%]">Player name</th>
                  <th className="pb-3 font-medium w-[20%] text-center">
                    {tabs === 'topBidders' ? 'Total Bid' : 'Total Spend'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {(tabs === 'topBidders' ? otherPlayersBid : otherPlayersSpend).map((player, index) => (
                  <motion.tr
                    key={player.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.05 * index }}
                    className="border-t dark:border-[#2A2A2A] hover:bg-slate-50 dark:hover:bg-[#1A1A1A]/50"
                  >
                    <td className="py-3 text-sm text-center">{index + 4}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <Avatar name={player.name} />
                        </Avatar>
                        <span className="font-medium">{player.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-center text-sm">
                      {tabs === 'topBidders' ? player.totalBids : player.totalSpends}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
