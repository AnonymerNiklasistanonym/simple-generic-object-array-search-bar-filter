import { parseFilter } from "./parseFilter"
import { filterElement } from "./filterElement"

const simpleGenericObjectArraySearchBarFilter = {
    filterElement,
    parseFilter,
}

// Typescript default export:
// (import sgoasbf from "simpleGenericObjectArraySearchBarFilter")
// NodeJs:
// (const sgoasbf = require("simpleGenericObjectArraySearchBarFilter").default)
export default simpleGenericObjectArraySearchBarFilter
