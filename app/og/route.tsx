import { ImageResponse } from "next/og"

export const runtime = "edge"

const CELL_SIZE = 15
const WIDTH = 1200
const HEIGHT = 630
const COLS = WIDTH / CELL_SIZE
const ROWS = HEIGHT / CELL_SIZE

function generateRandomGrid() {
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => Math.random() > 0.85)
  )
}

export async function GET() {
  const grid = generateRandomGrid()

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
                  backgroundColor: cell ? "white" : "black",
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
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(8px)",
          }}
        >
          <h1
            style={{
              fontSize: 128,
              fontWeight: 700,
              color: "white",
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}
          >
            dclark.dev
          </h1>
        </div>
      </div>
    ),
    {
      width: WIDTH,
      height: HEIGHT,
    }
  )
}
