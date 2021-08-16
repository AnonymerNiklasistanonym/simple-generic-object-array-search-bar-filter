import type { FilterElementResult } from "./parseOrFilter"
import type { ParseFilter } from "./parseFilter"

import { parseOrFilter } from "./parseOrFilter"

export interface ElementFilterInformation {
    /**
     * The name of the property with the following string/number value
     */
    propertyName?: string
    /**
     * This defines the type of information that is provided by this
     * object property
     */
    type: "string" | "number" | "string-array" | "number-array"
    /**
     * When of type "string" this attribute indicates the string value
     * of the property
     */
    stringValue?: string
    /**
     * When of type "number" this attribute indicates the number value
     * of the property
     */
    numberValue?: number
    /**
     * When of type "string-array" this attribute indicates the string
     * array value of the property
     */
    stringArrayValue?: string[]
    /**
     * When of type "number-array" this attribute indicates the number
     * array value of the property
     */
    numberArrayValue?: number[]
}

export interface FilterElementOptions {
    debug?: boolean
}

export const filterElement = <ElementType>(
    element: ElementType,
    elementFilter: (element: ElementType) => ElementFilterInformation[],
    parsedFilter?: ParseFilter,
    options: FilterElementOptions = {},
): FilterElementResult => {
    const errors: string[] = []
    const elementFilterInformation = elementFilter(element)

    if (options.debug) {
        console.debug("elementFilterInformation", elementFilterInformation)
    }

    if (parsedFilter === undefined) {
        //console.debug("parsedFilter === undefined")
        return { errors, match: true }
    }

    if (
        parsedFilter.exclude.length === 0 &&
        parsedFilter.include.length === 0
    ) {
        //console.debug("parsedFilter.exclude/include.length === 0")
        return { errors, match: true }
    }

    const includeFinal = parsedFilter.include.some((parsedFilterOr) => {
        const result = parseOrFilter(parsedFilterOr, elementFilterInformation, {
            debug: options.debug,
        })
        if (options.debug) {
            console.debug("include", parsedFilterOr, result)
        }
        return result.match
    })
    if (options.debug) {
        console.debug("final result include:", includeFinal)
    }

    const excludeFinal = parsedFilter.exclude.some((parsedFilterOr) => {
        const result = parseOrFilter(parsedFilterOr, elementFilterInformation, {
            debug: options.debug,
        })
        if (options.debug) {
            console.debug("exclude", parsedFilterOr, result)
        }
        return result.match
    })
    if (options.debug) {
        console.debug("final result exclude:", excludeFinal)
    }

    const match = includeFinal && !excludeFinal
    if (options.debug) {
        console.debug("final result include+exclude:", match)
    }

    return { errors, match }
}
