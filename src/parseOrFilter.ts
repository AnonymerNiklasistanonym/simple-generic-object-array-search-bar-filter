import type { ElementFilterInformation } from "./filterElement"
import type { ParseFilterElementOr } from "./parseFilter"

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

export interface ParseOrFilterOptions {
    debug?: boolean
}

export const parseOrFilter = (
    parsedFilterOr: ParseFilterElementOr,
    elementFilterInformation: ElementFilterInformation[],
    options: ParseOrFilterOptions = {},
): FilterElementResult => {
    const errors: string[] = []
    const match = parsedFilterOr.and.every((andFilter) => {
        switch (andFilter.type) {
            case "substring":
                return elementFilterInformation.some((filterInformation) => {
                    if (andFilter.substring === undefined) {
                        throw Error("andFilter.substring was undefined")
                    }
                    switch (filterInformation.type) {
                        case "number":
                            if (filterInformation.numberValue === undefined) {
                                throw Error(
                                    "filterInformation.stringValue was undefined",
                                )
                            }
                            return filterInformation.numberValue
                                .toString()
                                .includes(andFilter.substring)
                        case "string":
                            if (filterInformation.stringValue === undefined) {
                                throw Error(
                                    "filterInformation.stringValue was undefined",
                                )
                            }
                            return filterInformation.stringValue
                                .toLocaleLowerCase()
                                .includes(andFilter.substring)
                        default:
                            throw Error(
                                `unsupported filterInformation.type '${filterInformation.type}'`,
                            )
                    }
                })
            case "property-substring":
                return elementFilterInformation
                    .filter((filterInformation) => {
                        return (
                            andFilter.propertyName !== undefined &&
                            andFilter.propertyName ===
                                filterInformation.propertyName?.toLowerCase()
                        )
                    })
                    .some((filterInformation) => {
                        if (andFilter.substring === undefined) {
                            throw Error("andFilter.substring was undefined")
                        }
                        if (filterInformation.stringValue === undefined) {
                            throw Error(
                                "filterInformation.stringValue was undefined",
                            )
                        }
                        return filterInformation.stringValue
                            .toLowerCase()
                            .includes(andFilter.substring)
                    })
            case "property-number-range":
                switch (andFilter.numberRange) {
                    case "=":
                        return elementFilterInformation
                            .filter((filterInformation) => {
                                return (
                                    andFilter.propertyName !== undefined &&
                                    andFilter.propertyName ===
                                        filterInformation.propertyName?.toLowerCase()
                                )
                            })
                            .some((filterInformation) => {
                                if (andFilter.numberRangeBegin === undefined) {
                                    throw Error(
                                        "andFilter.numberRangeBegin was undefined",
                                    )
                                }
                                if (
                                    filterInformation.numberValue === undefined
                                ) {
                                    throw Error(
                                        "filterInformation.numberValue was undefined",
                                    )
                                }
                                return (
                                    Math.abs(
                                        andFilter.numberRangeBegin -
                                            filterInformation.numberValue,
                                    ) < Number.EPSILON
                                )
                            })
                    case "=-":
                        return elementFilterInformation
                            .filter((filterInformation) => {
                                return (
                                    andFilter.propertyName !== undefined &&
                                    andFilter.propertyName ===
                                        filterInformation.propertyName?.toLowerCase()
                                )
                            })
                            .some((filterInformation) => {
                                if (andFilter.numberRangeBegin === undefined) {
                                    throw Error(
                                        "andFilter.numberRangeBegin was undefined",
                                    )
                                }
                                if (andFilter.numberRangeEnd === undefined) {
                                    throw Error(
                                        "andFilter.numberRangeEnd was undefined",
                                    )
                                }
                                if (
                                    filterInformation.numberValue === undefined
                                ) {
                                    throw Error(
                                        "filterInformation.numberValue was undefined",
                                    )
                                }
                                const numberRangeBegin =
                                    andFilter.numberRangeBegin <=
                                    filterInformation.numberValue
                                const numberRangeEnd =
                                    andFilter.numberRangeEnd >=
                                    filterInformation.numberValue
                                if (options.debug) {
                                    console.debug(
                                        `numberRangeBegin: ${numberRangeBegin} (${andFilter.numberRangeBegin}<=${filterInformation.numberValue}), numberRangeEnd: ${numberRangeEnd} (${andFilter.numberRangeEnd}>=${filterInformation.numberValue})`,
                                    )
                                }
                                return numberRangeBegin && numberRangeEnd
                            })
                    default:
                        throw Error(
                            `unsupported andFilter.numberRange '${andFilter.numberRange}'`,
                        )
                }
            default:
                throw Error(`unsupported andFilter.type '${andFilter.type}'`)
        }
    })
    return { errors, match }
}
