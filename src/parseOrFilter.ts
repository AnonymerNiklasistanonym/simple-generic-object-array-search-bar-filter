import type { ElementFilterInformation } from "./filterElement"
import type { ParseFilterElementOr } from "./parseFilter"

export const parseOrFilter = (
    parsedFilterOr: ParseFilterElementOr,
    elementFilterInformation: ElementFilterInformation[],
): boolean => {
    return parsedFilterOr.and.every((andFilter) => {
        switch (andFilter.type) {
            case "substring":
                return elementFilterInformation.some((filterInformation) => {
                    if (andFilter.substring === undefined) {
                        throw Error("andFilter.substring was undefined")
                    }
                    if (filterInformation.stringValue === undefined) {
                        throw Error(
                            "filterInformation.stringValue was undefined",
                        )
                    }
                    return filterInformation.stringValue.includes(
                        andFilter.substring,
                    )
                })
            case "property-substring":
                return elementFilterInformation
                    .filter((filterInformation) => {
                        return (
                            andFilter.propertyName !== undefined &&
                            andFilter.propertyName ===
                                filterInformation.propertyName
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
                        return filterInformation.stringValue.includes(
                            andFilter.substring,
                        )
                    })
            case "property-number-range":
                throw Error(`unsupported and filter type '${andFilter.type}'`)
            default:
                throw Error(`unsupported and filter type '${andFilter.type}'`)
        }
    })
}
