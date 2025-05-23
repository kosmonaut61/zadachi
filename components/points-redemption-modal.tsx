"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { X, Coins } from "lucide-react"

interface PointsRedemptionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userName: string
  totalPoints: number
  onRedeem: (points: number) => void
}

export function PointsRedemptionModal({
  open,
  onOpenChange,
  userName,
  totalPoints,
  onRedeem,
}: PointsRedemptionModalProps) {
  const [pointsToRedeem, setPointsToRedeem] = useState([0])

  // Reset slider when modal opens
  useEffect(() => {
    if (open) {
      setPointsToRedeem([Math.min(100, totalPoints)])
    }
  }, [open, totalPoints])

  const handleRedeem = async () => {
    const points = pointsToRedeem[0]
    if (points > 0 && points <= totalPoints) {
      // Close modal immediately
      onOpenChange(false)

      // Update points immediately
      onRedeem(points)

      // Small delay to ensure modal is closed, then trigger confetti
      setTimeout(() => {
        triggerConfetti()
      }, 100)
    }
  }

  const triggerConfetti = () => {
    // Dynamic import to avoid SSR issues
    import("canvas-confetti").then((confetti) => {
      // Shorter, more reasonable confetti duration
      const duration = 1500 // Reduced from 3000ms to 1500ms
      const end = Date.now() + duration

      const colors = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#feca57", "#ff9ff3"]

      // Single big burst - more impactful, less overwhelming
      confetti.default({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: colors,
      })

      // Smaller follow-up burst
      setTimeout(() => {
        confetti.default({
          particleCount: 50,
          spread: 50,
          origin: { y: 0.7 },
          colors: colors,
        })
      }, 200)
    })
  }

  const handleClose = () => {
    onOpenChange(false)
  }

  const currentPoints = pointsToRedeem[0]
  const maxPoints = totalPoints
  const remainingPoints = totalPoints - currentPoints

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <Coins className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-lg">Redeem Points</CardTitle>
              <p className="text-sm text-muted-foreground">{userName}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Points Display */}
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold">{currentPoints.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Points to redeem</div>
            <div className="text-xs text-muted-foreground">{remainingPoints.toLocaleString()} points remaining</div>
          </div>

          {/* Slider */}
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>0</span>
              <span>Choose amount</span>
              <span>{maxPoints.toLocaleString()}</span>
            </div>
            <Slider
              value={pointsToRedeem}
              onValueChange={setPointsToRedeem}
              max={maxPoints}
              min={0}
              step={10}
              className="w-full"
            />

            {/* Quick Select Buttons */}
            <div className="grid grid-cols-5 gap-2">
              {[25, 50, 100, 250].map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => setPointsToRedeem([Math.min(amount, maxPoints)])}
                  disabled={amount > maxPoints}
                >
                  {amount}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => setPointsToRedeem([maxPoints])}
                disabled={maxPoints === 0}
              >
                All
              </Button>
            </div>
          </div>

          {/* Redeem Button */}
          <div className="space-y-2">
            <Button
              className="w-full"
              onClick={handleRedeem}
              disabled={currentPoints === 0 || currentPoints > totalPoints}
            >
              <Coins className="h-4 w-4 mr-2" />
              Redeem {currentPoints.toLocaleString()} Points
            </Button>

            {currentPoints > totalPoints && (
              <p className="text-destructive text-sm text-center">Not enough points available</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
