import type { ParseFilter } from "./parseFilter"

import { parseOrFilter } from "./parseOrFilter"

export interface ElementFilterInformation {
    /**
     * The name of the property with the following string/number value
     */
    propertyName?: string
    /**
     * This defines the type of information that is provided by this object property
     */
    type: "string" | "number"
    /**
     * When of type "string" this attribute indicates the string value of the property
     */
    stringValue?: string
    /**
     * When of type "number" this attribute indicates the number value of the property
     */
    numberValue?: number
}

export type getElementFilterInformation = <ElementType>(
    element: ElementType,
) => ElementFilterInformation[]

export interface FilterElementResult {
    /**
     * True if the object matches the filters and should show up in the search results
     */
    match: boolean
    /**
     * A collection of error messages between ParseFilter and ObjectFilterInformation[]
     */
    errors: string[]
}

export const filterElement = <ElementType>(
    element: ElementType,
    elementFilter: getElementFilterInformation,
    parsedFilter?: ParseFilter,
): FilterElementResult => {
    const elementFilterInformation = elementFilter(element)
    const errors: string[] = []

    if (parsedFilter === undefined) {
        return { errors, match: true }
    }

    const match =
        parsedFilter.include.some((parsedFilterOr) =>
            parseOrFilter(parsedFilterOr, elementFilterInformation),
        ) &&
        !parsedFilter.exclude.some((parsedFilterOr) =>
            parseOrFilter(parsedFilterOr, elementFilterInformation),
        )
    return { errors, match }
}
