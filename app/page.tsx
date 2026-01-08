"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

type GameState = "waiting" | "ready" | "active" | "too-early" | "result"

export default function ReactionTimeTest() {
  const [gameState, setGameState] = useState<GameState>("waiting")
  const [reactionTimes, setReactionTimes] = useState<number[]>([])
  const [currentTime, setCurrentTime] = useState<number>(0)
  const startTimeRef = useRef<number>(0)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>()
  const MAX_ATTEMPTS = 5

  const startTest = () => {
    // Stop interactions once max attempts reached; ask for reset
    if (reactionTimes.length >= MAX_ATTEMPTS) return

    if (gameState === "waiting" || gameState === "result" || gameState === "too-early") {
      setGameState("ready")
      const randomDelay = Math.random() * 3000 + 1000 // 1-4 seconds
      timeoutRef.current = setTimeout(() => {
        // Flip to active, then mark start at the same frame for tighter timing
        setGameState("active")
        // Use high-resolution timer and pointer down events for accuracy
        if (typeof performance !== "undefined" && performance.now) {
          startTimeRef.current = performance.now()
        } else {
          startTimeRef.current = Date.now()
        }
      }, randomDelay)
    } else if (gameState === "ready") {
      // Clicked too early
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      setGameState("too-early")
    } else if (gameState === "active") {
      // Calculate reaction time
      const now = typeof performance !== "undefined" && performance.now ? performance.now() : Date.now()
      const reactionTime = Math.round(now - startTimeRef.current)
      setCurrentTime(reactionTime)
      setReactionTimes([...reactionTimes, reactionTime])
      setGameState("result")
    }
  }

  const calculateAverage = () => {
    if (reactionTimes.length === 0) return 0
    return Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const summaryReady = reactionTimes.length >= MAX_ATTEMPTS

  // Prepare data for trend chart
  const chartData = reactionTimes.map((t, i) => ({
    attempt: i + 1,
    time: t,
  }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-foreground">Reaction Time Test</h1>
        </div>
      </header>

      <main>
        {/* Full-width test area: full width, 2/3 viewport height */}
        <section className="w-full">
          <div
            onPointerDown={startTest}
            className={`
              relative overflow-hidden cursor-pointer transition-all duration-300 flex items-center justify-center text-center w-full h-[66vh]
              ${summaryReady ? "pointer-events-none" : ""}
              ${gameState === "waiting" ? "bg-blue-500 hover:bg-blue-600" : ""}
              ${gameState === "ready" ? "bg-red-500" : ""}
              ${gameState === "active" ? "bg-green-500" : ""}
              ${gameState === "too-early" ? "bg-red-500" : ""}
              ${gameState === "result" ? "bg-blue-500 hover:bg-blue-600" : ""}
            `}
          >
            <div className="text-white">
              {gameState === "waiting" && (
                <div>
                  <h2 className="text-3xl font-bold mb-4">Reaction Time Test</h2>
                  <p className="text-xl mb-2">When the red box turns green, click as quickly as you can.</p>
                  <p className="text-lg opacity-90">Click anywhere to start</p>
                </div>
              )}

              {gameState === "ready" && (
                <div>
                  <h2 className="text-3xl font-bold mb-4">Wait for green...</h2>
                </div>
              )}

              {gameState === "active" && (
                <div>
                  <h2 className="text-3xl font-bold mb-4">Click!</h2>
                </div>
              )}

              {gameState === "too-early" && (
                <div>
                  <h2 className="text-3xl font-bold mb-4">Too soon!</h2>
                  <p className="text-xl">Click to try again</p>
                </div>
              )}

              {gameState === "result" && (
                <div>
                  <h2 className="text-5xl font-bold mb-4">{currentTime} ms</h2>
                  <p className="text-xl mb-4">Click to keep going</p>
                  {reactionTimes.length > 0 && <p className="text-lg opacity-90">Attempt {reactionTimes.length}</p>}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Charts & Statistics */}
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {reactionTimes.length > 0 && (
            <Card className="p-6 mb-8">
              <h3 className="text-2xl font-bold mb-4">Trend</h3>
              {/* Simple line chart for attempts vs time */}
              <ReactionTrendChart data={chartData} />
            </Card>
          )}

          {reactionTimes.length > 0 && (
            <Card className="p-6 mb-8">
              <h3 className="text-2xl font-bold mb-4">Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Average</p>
                  <p className="text-2xl font-bold">{calculateAverage()} ms</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Best</p>
                  <p className="text-2xl font-bold">{Math.min(...reactionTimes)} ms</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Worst</p>
                  <p className="text-2xl font-bold">{Math.max(...reactionTimes)} ms</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Attempts</p>
                  <p className="text-2xl font-bold">{reactionTimes.length}</p>
                </div>
              </div>
              <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
                <Button
                  variant={summaryReady ? "default" : "outline"}
                  className={summaryReady ? "h-12 px-8 text-lg font-semibold w-full sm:w-auto shadow-md" : undefined}
                  aria-label="Reset reaction test"
                  onClick={() => {
                    setReactionTimes([])
                    setGameState("waiting")
                  }}
                >
                  Reset
                </Button>
                {summaryReady && (
                  <div className="text-sm text-muted-foreground self-center">
                    Summary complete after {MAX_ATTEMPTS} attempts.
                  </div>
                )}
              </div>
            </Card>
          )}

        </div>

        {/* About section removed per requirement for a cleaner page */}
      </main>
      {/* Floating reset button: visible without scrolling when summary complete */}
      {summaryReady && (
        <div className="fixed bottom-4 left-0 right-0 z-50 flex justify-center px-4 pb-[env(safe-area-inset-bottom)] pointer-events-none">
          <Button
            aria-label="Reset reaction test (floating)"
            className="pointer-events-auto h-12 sm:h-14 px-8 sm:px-10 text-lg sm:text-xl font-semibold shadow-lg rounded-full"
            onClick={() => {
              setReactionTimes([])
              setGameState("waiting")
            }}
          >
            Reset
          </Button>
        </div>
      )}
    </div>
  )
}

// Small, focused chart component to visualize reaction time trend
function ReactionTrendChart({
  data,
}: {
  data: { attempt: number; time: number }[]
}) {
  return (
    <ChartContainer
      className="w-full aspect-[2/1]"
      config={{
        time: {
          label: "Reaction Time (ms)",
          color: "hsl(221.2 83.2% 53.3%)",
        },
      }}
    >
      <LineChart data={data} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="attempt" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} />
        <Line type="monotone" dataKey="time" stroke="var(--color-time)" strokeWidth={2} dot />
        <ChartTooltip content={<ChartTooltipContent />} />
      </LineChart>
    </ChartContainer>
  )
}
