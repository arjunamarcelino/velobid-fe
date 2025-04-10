"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { formatEther, parseUnits } from "ethers"

import { Button } from "@heroui/button"
import { Card, CardHeader, CardBody } from "@heroui/card"
import { Tabs, Tab } from "@heroui/tabs"
import CreateAuctionModal from "@/components/create-auction-modal"
import { getContract } from "@/contract/contract"
import toast from "react-hot-toast"
import { Input } from "@heroui/input"
import { useAccount } from 'wagmi';

type Auction = {
  auctionId: string;
  auctionName: string;
  auctionDescription: string;
  auctionEndTime: string;
  startingBid: string;
  highestBid: string;
  highestBidder: string;
  ended: boolean;
  winner: string;
  totalVolumeBid: string;
  beneficiary: string;
};

function getTimeLeft(endTime: string | number) {
  const now = Math.floor(Date.now() / 1000);
  const diff = Number(endTime) - now;
  if (diff <= 0) return "Ended";

  const hours = Math.floor(diff / 3600);
  const minutes = Math.floor((diff % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

function shortenAddress(address: string, chars = 4) {
  if (!address) return "";
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
};

export default function Dashboard() {
  const [theme, setTheme] = useState<"light" | "dark">("dark")

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    document.documentElement.classList.toggle("dark")
  }

  // Ensure dark mode is applied on initial render
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark")
      setTheme("dark")
    }
  }, [])

  const { address, isConnected } = useAccount();

  useEffect(() => {
    const checkUser = async () => {
      if (!isConnected || !address) return;

      const contract = await getContract();
      const user = await contract.users(address);

      if (!user.registered) {
        await contract.registerUser();
      }
    };

    checkUser();
  }, [isConnected, address]);


  const [overview, setOverview] = useState({
    activeAuctions: 0,
    upcoming: 0,
    totalBids: 0,
    avgBid: "0 ETH",
    auction: 0,
  })

  const fetchPlatformData = async () => {
    const contract = await getContract();
    try {
      const result = await contract.data();

      const platformStats = {
        totalAuction: result.totalAuction.toString(),
        totalActiveAuction: result.totalActiveAuction.toString(),
        totalBidders: result.totalBidders.toString(),
        totalBid: result.totalBid.toString(),
        totalVolumeBid: result.totalVolumeBid.toString(),
        highestBid: result.highestBid.toString(),
        highestBidder: result.highestBidder,
        averageBidValue: result.averageBidValue.toString(),
        totalUsers: result.totalUsers.toString(),
      };

      setOverview({
        activeAuctions: Number(platformStats.totalActiveAuction),
        upcoming: Number(platformStats.totalAuction) - Number(platformStats.totalActiveAuction),
        totalBids: Number(platformStats.totalBid),
        avgBid: `${formatEther(platformStats.averageBidValue)} ETH`,
        auction: Number(platformStats.totalAuction),
      });

      return platformStats;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchPlatformData()
  }, [])

  const [auctions, setAuctions] = useState<Auction[]>([])

  const fetchAuctions = async () => {
    if (overview.auction > 0) {
      try {
        const contract = await getContract()
        const startIndex = 0
        const limit = 10

        const auctionIds = await contract.getAuctions(startIndex, limit)

        const auctionDetails = await Promise.all(
          auctionIds.map(async (id: any) => {
            const cleanId = BigInt(id.toString().split('.')[0])
            const auction = await contract.auctions(cleanId)

            const auctionEndTime = parseInt(auction.auctionEndTime.toString(), 10)
            const now = Math.floor(Date.now() / 1000)

            if (auctionEndTime < now && !auction.ended) {
              await contract.auctionEnd(auction.auctionId)
            }

            return {
              auctionId: auction.auctionId.toString(),
              auctionName: auction.auctionName,
              auctionDescription: auction.auctionDescription,
              auctionEndTime: auction.auctionEndTime.toString(),
              startingBid: formatEther(auction.startingBid),
              highestBid: formatEther(auction.highestBid),
              highestBidder: auction.highestBidder,
              ended: auction.ended,
              winner: auction.winner,
              totalVolumeBid: formatEther(auction.totalVolumeBid),
              beneficiary: auction.beneficiary,
            }
          })
        )

        auctionDetails.sort((a, b) => {
          if (!a.ended && b.ended) return -1;
          if (a.ended && !b.ended) return 1;

          if (!a.ended && !b.ended) {
            return parseInt(a.auctionEndTime) - parseInt(b.auctionEndTime)
          }

          return parseInt(b.auctionEndTime) - parseInt(a.auctionEndTime)
        })

        setAuctions(auctionDetails)
      } catch (err) {
        console.error("Error fetching auctions:", err)
      }
    }
  }

  useEffect(() => {
    fetchAuctions();

    const interval = setInterval(() => {
      fetchAuctions();
    }, 30000);

    return () => clearInterval(interval);
  }, [overview]);

  return (
    <div className={`min-h-screen w-full bg-background`}>
      <div className="grid min-h-screen w-full">

        {/* Main Content */}
        <main className="flex flex-col">

          {/* Dashboard Content */}
          <div className="flex-1 space-y-8 p-6 pt-16 md:p-8 md:pt-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <h1 className="text-2xl font-bold tracking-tight">Auction Dashboard</h1>
              <div className="ml-auto"></div>
              <CreateAuctionModal />
            </div>

            {/* Overview Cards */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Auction Overview Card */}
              <Card className="p-2">
                <CardHeader className="pb-2">
                  <div className="flex flex-col gap-2">
                    <span className="font-semibold leading-none tracking-tight text-start text-xl">Auction Overview</span>
                    <span className="text-sm text-foreground-500">Summary of your auction activities</span>
                  </div>
                </CardHeader>
                <CardBody>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-foreground-500">Active Auctions</p>
                      <p className="text-2xl font-bold">{overview.auction - auctions.filter(a => a.ended).length}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-foreground-500">Past Auctions</p>
                      <p className="text-2xl font-bold">{auctions.filter(a => a.ended).length}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-foreground-500">Total Bids</p>
                      <p className="text-2xl font-bold">{overview.totalBids}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-foreground-500">Avg. Bid Value</p>
                      <p className="text-2xl font-bold">{overview.avgBid}</p>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Financial Overview Card */}
              <Card className="p-2">
                <CardHeader className="pb-2">
                  <div className="flex flex-col gap-2">
                    <span className="font-semibold leading-none tracking-tight text-start text-xl">Financial Overview</span>
                    <span className="text-sm text-foreground-500">Your earnings and transactions</span>
                  </div>
                </CardHeader>
                <CardBody>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-foreground-500">Total Revenue</p>
                      <p className="text-2xl font-bold">156.8 ETH</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-foreground-500">This Month</p>
                      <p className="text-2xl font-bold">24.5 ETH</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-foreground-500">Highest Sale</p>
                      <p className="text-2xl font-bold">12.6 ETH</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-foreground-500">Pending</p>
                      <p className="text-2xl font-bold">3.2 ETH</p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Top Collections */}
            <div className="space-y-4 mt-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Top Collections</h2>

              </div>
              <Tabs aria-label="Options">
                <Tab key="all" title="All">
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {auctions.length > 0 ? (
                      auctions.map((auction, index) => (
                        <CollectionCard
                          key={auction.auctionId.toString() + index}
                          image="/NeonGenesis.jpg?height=400&width=400"
                          name={auction.auctionName}
                          creator={auction.beneficiary}
                          price={`${auction.highestBid === "0.0" ? auction.startingBid : auction.highestBid} ETH`}
                          timeLeft={getTimeLeft(auction.auctionEndTime)}
                          bidCount={Number(auction.totalVolumeBid)}
                          id={auction.auctionId}
                          winner={auction.winner}
                        />
                      ))
                    ) : (
                      <p className="col-span-full text-center text-gray-500">No auctions available.</p>
                    )}
                  </div>
                </Tab>
                <Tab key="active" title="Active">
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {auctions.filter(a => getTimeLeft(a.auctionEndTime) !== "Ended").length > 0 ? (
                      auctions
                        .filter(a => getTimeLeft(a.auctionEndTime) !== "Ended")
                        .map((auction) => (
                          <CollectionCard
                            key={auction.auctionId.toString()}
                            image="/NeonGenesis.jpg?height=400&width=400"
                            name={auction.auctionName}
                            creator={auction.beneficiary}
                            price={`${auction.highestBid === "0.0" ? auction.startingBid : auction.highestBid} ETH`}
                            timeLeft={getTimeLeft(auction.auctionEndTime)}
                            bidCount={Number(auction.totalVolumeBid)}
                            featured={false}
                            id={auction.auctionId}
                            winner={auction.winner}
                          />
                        ))
                    ) : (
                      <p className="col-span-full text-center text-gray-500">No active auctions.</p>
                    )}
                  </div>
                </Tab>


                <Tab key="past" title="Past">
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {auctions.filter(a => getTimeLeft(a.auctionEndTime) === "Ended").length > 0 ? (
                      auctions
                        .filter(a => getTimeLeft(a.auctionEndTime) === "Ended")
                        .map((auction) => (
                          <CollectionCard
                            key={auction.auctionId.toString()}
                            image="/NeonGenesis.jpg?height=400&width=400"
                            name={auction.auctionName}
                            creator={auction.beneficiary}
                            price={`${auction.highestBid === "0.0" ? auction.startingBid : auction.highestBid} ETH`}
                            timeLeft="Ended"
                            bidCount={Number(auction.totalVolumeBid)}
                            featured={false}
                            id={auction.auctionId}
                            winner={auction.winner}
                          />
                        ))
                    ) : (
                      <p className="col-span-full text-center text-gray-500">No past auctions.</p>
                    )}
                  </div>
                </Tab>

              </Tabs>

            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

interface CollectionCardProps {
  image: string
  name: string
  creator: string
  price: string
  timeLeft: string
  bidCount: number
  featured?: boolean
  upcoming?: boolean
  id?: string
  winner?: string
}

function CollectionCard({
  image,
  name,
  creator,
  price,
  timeLeft,
  bidCount,
  featured = false,
  upcoming = false,
  id = "",
  winner,
}: CollectionCardProps) {

  const [bidAmount, setBidAmount] = useState("")

  const placeBid = async () => {
    try {
      const priceValue = parseFloat(price.replace(" ETH", ""))
      const bidValue = parseFloat(bidAmount)

      if (isNaN(bidValue) || bidValue <= priceValue) {
        toast.error(`Bid must be more than current price (${price})`)
        return
      }

      const contract = await getContract()
      const auctionId = Number(id);
      const bidAmountWei = parseUnits(bidAmount, "ether")

      const tx = await contract.bid(auctionId, bidAmountWei, { value: bidAmountWei })

      const receipt = await tx.wait();

      if (receipt.status === 1) {
        toast.success("Bid placed!");

        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        toast.error("Failed to place bid.");
        throw new Error("Failed to place bid.");
      }

    } catch (err) {
      console.error("Failed to place bid:", err)
      toast.error("Failed to place bid.")
    }
  }

  return (
    <Card className={`overflow-hidden transition-all hover:shadow-lg ${featured ? "border-primary" : ""}`}>
      <div className="relative">
        <Image
          src={image || "/placeholder.svg"}
          alt={name}
          width={400}
          height={400}
          className="aspect-square w-full object-cover"
        />
        {featured && (
          <div className="absolute top-2 right-2 rounded-full bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
            Featured
          </div>
        )}
        {upcoming && (
          <div className="absolute top-2 right-2 rounded-full bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
            Upcoming
          </div>
        )}
        <div className="absolute bottom-2 right-2 rounded-full bg-background/80 px-2 py-1 text-xs font-medium backdrop-blur-sm">
          {timeLeft}
        </div>
      </div>

      <CardBody className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{name}</h3>
            <p className="text-sm font-medium text-primary">{price}</p>
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>{shortenAddress(creator)}</p>
            <p>{bidCount} bids</p>
          </div>

          {timeLeft === "Ended" && winner && (
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <p>Winner</p>
              <p>{shortenAddress(winner)}</p>
            </div>
          )}


          {/* 👇 New Bid Input Section */}
          {timeLeft !== "Ended" && (
            <>
              <Input
                type="text"
                inputMode="decimal"
                pattern="^\d*\.?\d*$"
                placeholder="Enter your bid (ETH)"
                value={bidAmount}
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow only digits and a single decimal point
                  if (/^\d*\.?\d*$/.test(value)) {
                    setBidAmount(value);
                  }
                }}
                onPaste={(e) => {
                  const pasted = e.clipboardData.getData("text");
                  if (!/^\d*\.?\d*$/.test(pasted)) {
                    e.preventDefault();
                  }
                }}
              />

              <Button variant="bordered" className="w-full" onPress={placeBid}>
                {upcoming ? "Remind Me" : "Place Bid"}
              </Button>
            </>
          )}
        </div>
      </CardBody>
    </Card>
  )
}