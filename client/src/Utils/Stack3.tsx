import { Stack } from "@mui/material"
import { ReactNode } from "react"

export const Stack3 = ({
  spacingX = 1,
  spacingY = 0,
  children
}: {
  spacingX?: number,
  spacingY?: number,
  children: ReactNode[]
}) => {
  return (
    <Stack direction='column' spacing={spacingY}>
      {children.map((_, i) => i % 3 !== 0 ? null : (<>
        <Stack direction='row' spacing={spacingX} key={`stack3_row_${i}`}>
          {children.slice(i, i + 3)}
        </Stack>
      </>))}
    </Stack>
  )
}