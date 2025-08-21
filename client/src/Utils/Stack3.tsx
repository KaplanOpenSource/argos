import { Stack } from "@mui/material"
import { chunk } from "lodash"
import { Fragment, ReactNode } from "react"

export const Stack3 = ({
  spacingX = 1,
  spacingY = 0,
  children
}: {
  spacingX?: number,
  spacingY?: number,
  children: ReactNode[]
}) => {
  const groups = chunk(children.map((x, i) => ({ node: x, index: i })), 3);
  return (
    <Stack direction='column' spacing={spacingY}>
      {groups.map((group, i) => (
        <Stack direction='row' spacing={spacingX} key={`stack3_row_${i}`}>
          {group.map(({ node, index }) => (
            <Fragment key={`stack3_${index}`}>
              {node}
            </Fragment>
          ))}
        </Stack>
      ))}
    </Stack>
  )
}