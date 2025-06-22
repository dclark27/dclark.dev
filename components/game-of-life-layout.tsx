"use client"

import type React from "react"
import { useCallback, useEffect, useRef, useState } from "react"
import { MoonIcon, Palette, Settings } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"

interface GameRules {
  minSurvival: number
  maxSurvival: number
  birth: number
}

export const GameOfLifeLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(null)
  const gridRef = useRef<boolean[][]>([])
  const [isRunning, setIsRunning] = useState(true)
  const [rainbowMode, setRainbowMode] = useState(new Date().getMonth() === 5)
  const [isMouseDown, setIsMouseDown] = useState(false)
  const [showControls, setShowControls] = useState(false)
  const [brushSize, setBrushSize] = useState(1)
  const [gridSize, setGridSize] = useState(12)
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })

  // Game rules state - Conway's default rules
  const [rules, setRules] = useState<GameRules>({
    minSurvival: 2, // Live cells need at least 2 neighbors to survive
    maxSurvival: 3, // Live cells need at most 3 neighbors to survive
    birth: 3, // Dead cells need exactly 3 neighbors to become alive
  })

  const rows = Math.floor(canvasSize.height / gridSize)
  const cols = Math.floor(canvasSize.width / gridSize)

  // Dynamically adjust canvas size
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        // Update canvas resolution
        canvas.width = width
        canvas.height = height
        setCanvasSize({ width, height })
      }
    })

    resizeObserver.observe(canvas)

    return () => resizeObserver.disconnect()
  }, [])

  // Initialize grid when grid size changes
  useEffect(() => {
    if (canvasSize.width === 0 || canvasSize.height === 0) return

    const newGrid = Array(rows)
      .fill(null)
      .map(() =>
        Array(cols)
          .fill(null)
          .map(() => Math.random() > 0.85)
      )
    gridRef.current = newGrid
  }, [rows, cols, gridSize])

  // Conway's Game of Life logic with custom rules
  const getNextGeneration = useCallback(
    (currentGrid: boolean[][]) => {
      if (!currentGrid || currentGrid.length === 0) return currentGrid

      const newGrid = currentGrid.map((row) => [...row])

      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          let neighbors = 0

          // Count neighbors
          for (let di = -1; di <= 1; di++) {
            for (let dj = -1; dj <= 1; dj++) {
              if (di === 0 && dj === 0) continue
              const ni = i + di
              const nj = j + dj
              if (ni >= 0 && ni < rows && nj >= 0 && nj < cols) {
                if (currentGrid[ni][nj]) neighbors++
              }
            }
          }

          // Apply custom rules
          if (currentGrid[i][j]) {
            // Live cell survival rules
            newGrid[i][j] =
              neighbors >= rules.minSurvival && neighbors <= rules.maxSurvival
          } else {
            // Dead cell birth rules
            newGrid[i][j] = neighbors === rules.birth
          }
        }
      }

      return newGrid
    },
    [rows, cols, rules]
  )

  // Draw grid
  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, currentGrid: boolean[][]) => {
      if (!currentGrid || currentGrid.length === 0) return

      ctx.clearRect(0, 0, canvasSize.width, canvasSize.height)

      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          if (currentGrid[i][j]) {
            if (rainbowMode) {
              const hue = (i * j * 137.508) % 360
              ctx.fillStyle = `hsl(${hue}, 70%, 60%)`
            } else {
              ctx.fillStyle = "#ffffff"
            }
            ctx.fillRect(j * gridSize, i * gridSize, gridSize - 1, gridSize - 1)
          }
        }
      }
    },
    [rows, cols, rainbowMode, gridSize, canvasSize]
  )

  const animationRefCurr = animationRef.current

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const intervalId = setInterval(() => {
      if (isRunning && gridRef.current.length > 0) {
        const nextGrid = getNextGeneration(gridRef.current)
        gridRef.current = nextGrid
        draw(ctx, nextGrid)
      } else if (gridRef.current.length > 0) {
        draw(ctx, gridRef.current)
      }
    }, 100)

    return () => {
      clearInterval(intervalId)
      if (animationRefCurr) {
        cancelAnimationFrame(animationRefCurr)
      }
    }
  }, [isRunning, draw, getNextGeneration, animationRefCurr])

  // Handle mouse interactions
  const handleMouseEvent = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current
      if (!canvas || gridRef.current.length === 0) return

      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const centerCol = Math.floor(x / gridSize)
      const centerRow = Math.floor(y / gridSize)

      // Spawn cells in a circular area based on brush size
      const radius = brushSize
      for (let i = -radius; i <= radius; i++) {
        for (let j = -radius; j <= radius; j++) {
          const row = centerRow + i
          const col = centerCol + j

          // Check if within circular brush and grid bounds
          const distance = Math.sqrt(i * i + j * j)
          if (
            distance <= radius &&
            row >= 0 &&
            row < rows &&
            col >= 0 &&
            col < cols
          ) {
            gridRef.current[row][col] = true
          }
        }
      }

      // Immediate redraw for responsive feedback
      const ctx = canvas.getContext("2d")
      if (ctx) {
        draw(ctx, gridRef.current)
      }
    },
    [rows, cols, draw, brushSize, gridSize]
  )

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsMouseDown(true)
    handleMouseEvent(e)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isMouseDown) {
      handleMouseEvent(e)
    }
  }

  const handleMouseUp = () => {
    setIsMouseDown(false)
  }

  // Reset to Conway's classic rules
  const resetToClassicRules = () => {
    setRules({
      minSurvival: 2,
      maxSurvival: 3,
      birth: 3,
    })
  }

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 cursor-crosshair"
        style={{
          width: "100%",
          height: "100%",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />

      {/* Top Controls */}
      <div className="absolute top-6 right-6 z-10 flex gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowControls(!showControls)}
          className="backdrop-blur-md bg-white/10 border-white/20 text-white "
        >
          <Settings className="w-4 h-4 mr-2" />
          {"Controls"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setRainbowMode(!rainbowMode)}
          className={`backdrop-blur-md bg-white/10 border-white/20 text-white ${
            rainbowMode
              ? "bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500"
              : ""
          }`}
        >
          <Palette className="w-4 h-4 mr-2" />
          {rainbowMode ? "Rainbow ON" : "Rainbow OFF"}
        </Button>
      </div>

      {/* Controls Panel */}
      {showControls && (
        <div className="absolute top-20 right-6 z-10 w-80 max-h-[80vh] overflow-y-auto">
          <Card className="backdrop-blur-xl bg-white/10 border-white/20 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{"Game Controls"}</CardTitle>
              <p className="text-sm text-white/70">
                {"Adjust rules, grid size, and brush settings"}
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Grid Size Control */}
              <div className="space-y-3">
                {/* Quick Grid Size Presets */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-white/90">
                    {"Quick Grid Sizes:"}
                  </p>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setGridSize(1.2)}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10 h-8"
                    >
                      {"Tiny (1px)"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setGridSize(4)}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10 h-8"
                    >
                      {"Small (4px)"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setGridSize(8)}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10 h-8"
                    >
                      {"Medium (8px)"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setGridSize(12)}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10 h-8"
                    >
                      {"Large (12px)"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setGridSize(16)}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10 h-8"
                    >
                      {"Huge (16px)"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setGridSize(20)}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10 h-8"
                    >
                      {"Giant (20px)"}
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-white/90">
                    {`Cell Size: ${gridSize}px`}
                  </label>
                  <Slider
                    value={[gridSize]}
                    onValueChange={(value) => setGridSize(value[0])}
                    max={20}
                    min={1}
                    step={1}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-xs text-white/50 mt-1">
                    <span>{"Tiny (1px)"}</span>
                    <span>{"Giant (20px)"}</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-white/90">
                    {`Brush Size: ${brushSize}`}
                  </label>
                  <Slider
                    value={[brushSize]}
                    onValueChange={(value) => setBrushSize(value[0])}
                    max={15}
                    min={1}
                    step={1}
                    className="mt-2"
                  />
                </div>
              </div>

              {/* Game Rules */}
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-white/90">
                    {`Min Neighbors for Survival: ${rules.minSurvival}`}
                  </label>
                  <Slider
                    value={[rules.minSurvival]}
                    onValueChange={(value) =>
                      setRules((prev) => ({ ...prev, minSurvival: value[0] }))
                    }
                    max={8}
                    min={0}
                    step={1}
                    className="mt-2"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-white/90">
                    {`Max Neighbors for Survival: ${rules.maxSurvival}`}
                  </label>
                  <Slider
                    value={[rules.maxSurvival]}
                    onValueChange={(value) =>
                      setRules((prev) => ({ ...prev, maxSurvival: value[0] }))
                    }
                    max={8}
                    min={0}
                    step={1}
                    className="mt-2"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-white/90">
                    Neighbors for Birth: {rules.birth}
                  </label>
                  <Slider
                    value={[rules.birth]}
                    onValueChange={(value) =>
                      setRules((prev) => ({ ...prev, birth: value[0] }))
                    }
                    max={8}
                    min={0}
                    step={1}
                    className="mt-2"
                  />
                </div>
              </div>

              {/* Reset Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={resetToClassicRules}
                className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10"
              >
                {"Reset to Conway's Classic Rules"}
              </Button>

              {/* Popular Rule Sets */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-white/90">
                  Popular Rule Sets:
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setRules({ minSurvival: 2, maxSurvival: 3, birth: 3 })
                    }
                    className="bg-white/5 border-white/20 text-white hover:bg-white/10 h-8"
                  >
                    {"Conway (2-3/3)"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setRules({ minSurvival: 1, maxSurvival: 1, birth: 1 })
                    }
                    className="bg-white/5 border-white/20 text-white hover:bg-white/10 h-8"
                  >
                    {"Gnarl (1/1)"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setRules({ minSurvival: 3, maxSurvival: 4, birth: 3 })
                    }
                    className="bg-white/5 border-white/20 text-white hover:bg-white/10 h-8"
                  >
                    {"Maze (3-4/3)"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setRules({ minSurvival: 0, maxSurvival: 2, birth: 3 })
                    }
                    className="bg-white/5 border-white/20 text-white hover:bg-white/10 h-8"
                  >
                    {"Seeds (0-2/3)"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      {children}
      {/* Bottom Controls */}
      <div className="absolute bottom-6 left-6 z-10">
        <Button
          variant="outline"
          onClick={() => setIsRunning(!isRunning)}
          className="backdrop-blur-md bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          {isRunning ? "Pause" : "Play"}
        </Button>
      </div>
    </div>
  )
}
