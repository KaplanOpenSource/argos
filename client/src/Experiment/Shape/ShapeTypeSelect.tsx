import React from "react"
import { SelectProperty } from "../../Property/SelectProperty"

export const ShapeTypeSelect = ({ type, setType }) => {
  return (
    <SelectProperty
      label="Type"
      data={type || "Polyline"}
      setData={newtype => setType(newtype)}
      options={[
        { name: "Polygon" },
        { name: "Polyline" },
        { name: "Circle" },
      ]}
    />
  )
}