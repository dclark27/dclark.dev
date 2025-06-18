"use client"

import { useState } from "react"

import { useInterval } from "@/hooks/use-interval"

export default function GameOfLife(props: { board: boolean[][] }) {
  const [board, setBoard] = useState(props.board)

  useInterval(() => {
    const evolve = (board: boolean[][]) => {
      const evolvedBoard = [...board]
      evolvedBoard.forEach((row, i) => {
        row.forEach((alive, j) => {
          let neighbors = 0

          // Look up
          if (evolvedBoard[i + 1]?.[j]) {
            neighbors++
          }

          if (evolvedBoard[i - 1]?.[j]) {
            neighbors++
          }

          if (evolvedBoard[i][j + 1]) {
            neighbors++
          }

          if (evolvedBoard[i][j - 1]) {
            neighbors++
          }

          if (evolvedBoard[i + 1]?.[j + 1]) {
            neighbors++
          }

          if (evolvedBoard[i + 1]?.[j - 1]) {
            neighbors++
          }

          if (evolvedBoard[i - 1]?.[j + 1]) {
            neighbors++
          }

          if (evolvedBoard[i - 1]?.[j - 1]) {
            neighbors++
          }

          // Any live cell with fewer than two live neighbors dies, as if by under-population.
          if (alive && neighbors < 2) {
            evolvedBoard[i][j] = false
          }

          // Any live cell with two or three live neighbors lives on to the next generation.
          if ((alive && neighbors === 2) || neighbors === 3) {
            evolvedBoard[i][j] = true
          }
          // Any live cell with more than three live neighbors dies, as if by overpopulation.
          if (alive && neighbors > 3) {
            evolvedBoard[i][j] = false
          }

          // Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.
          if (!alive && neighbors === 3) {
            evolvedBoard[i][j] = true
          }
        })
      })

      setBoard(evolvedBoard)
    }
    evolve(board)
  }, 300)

  return (
    <div className="fixed top-0 left-0 -z-50">
      <div className="flex">
        {board.map((row, i) => (
          <div key={`board-row-${i}`} className="w-full">
            {row.map((val, j) => (
              <div
                key={`board-square-${j}`}
                className={`size-4 border border-slate-100 ${val ? "bg-slate-200" : "bg-transparent"}`}
              ></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
