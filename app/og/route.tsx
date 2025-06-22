import { ImageResponse } from "next/og"

export const runtime = "edge"

const CELL_SIZE = 30
const WIDTH = 1200
const HEIGHT = 630
const COLS = Math.floor(WIDTH / CELL_SIZE)
const ROWS = Math.floor(HEIGHT / CELL_SIZE)

const COLORS = [
  "#f87171",
  "#fb923c",
  "#fbbf24",
  "#a3e635",
  "#4ade80",
  "#34d399",
  "#22d3ee",
  "#60a5fa",
  "#a78bfa",
  "#f472b6",
]

const PATTERNS = {
  block: [
    [1, 1],
    [1, 1],
  ],
  beehive: [
    [0, 1, 1, 0],
    [1, 0, 0, 1],
    [0, 1, 1, 0],
  ],
  loaf: [
    [0, 1, 1, 0],
    [1, 0, 0, 1],
    [0, 1, 0, 1],
    [0, 0, 1, 0],
  ],
  boat: [
    [1, 1, 0],
    [1, 0, 1],
    [0, 1, 0],
  ],
  tub: [
    [0, 1, 0],
    [1, 0, 1],
    [0, 1, 0],
  ],
}

type PatternKey = keyof typeof PATTERNS

function generateGrid() {
  const grid = Array.from({ length: ROWS }, () => Array(COLS).fill(0))
  const patternKeys = Object.keys(PATTERNS) as PatternKey[]

  for (let i = 0; i < 25; i++) {
    const patternKey =
      patternKeys[Math.floor(Math.random() * patternKeys.length)]
    const pattern = PATTERNS[patternKey]
    const patternHeight = pattern.length
    const patternWidth = pattern[0].length
    const col = Math.floor(Math.random() * (COLS - patternWidth))
    const row = Math.floor(Math.random() * (ROWS - patternHeight))

    for (let y = 0; y < patternHeight; y++) {
      for (let x = 0; x < patternWidth; x++) {
        if (pattern[y][x]) {
          grid[row + y][col + x] = 1
        }
      }
    }
  }

  return grid
}

export async function GET(request: Request) {
  const { protocol, host } = new URL(request.url)
  const iconUrl = `${protocol}//${host}/logos/icon-dark.png`

  const geistRegularFont = fetch(
    new URL("../../public/fonts/Geist-Regular.otf", import.meta.url)
  ).then((res) => res.arrayBuffer())

  const grid = generateGrid()

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          backgroundColor: "black",
          position: "relative",
        }}
      >
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: "flex" }}>
            {row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                style={{
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                  backgroundColor: cell
                    ? COLORS[Math.floor(Math.random() * COLORS.length)]
                    : "black",
                  borderRadius: "4px",
                }}
              />
            ))}
          </div>
        ))}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "24px",
              padding: "48px 64px",
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "24px",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={iconUrl}
              alt="dclark.dev logo"
              width={128}
              height={128}
              style={{ borderRadius: "24px" }}
            />
            <div
              style={{
                fontSize: 60,
                fontWeight: 400,
                fontFamily: "Geist",
                color: "white",
                letterSpacing: "-0.02em",
              }}
            >
              dclark.dev
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: WIDTH,
      height: HEIGHT,
      fonts: [
        {
          name: "Geist",
          data: await geistRegularFont,
          style: "normal",
          weight: 400,
        },
      ],
    }
  )
}
