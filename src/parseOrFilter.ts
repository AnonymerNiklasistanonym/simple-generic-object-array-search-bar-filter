import { andFilterMatcher } from "./andFilterMatcher"
import type { ElementFilterInformation } from "./filterElement"
import type { ParseFilterElementAnd, ParseFilterElementOr } from "./parseFilter"

export interface FilterElementResult {
    /**
     * True if the object matches the filters and should show up
     * in the search results
     */
    match: boolean
    /**
     * A collection of error messages between ParseFilter and
     * ElementFilterInformation[]
     */
    errors: string[]
}

export interface ParseOrFilterOptions {
    debug?: boolean
}

const filterElementInformationProperty = (
    filterInformation: ElementFilterInformation[],
    andFilterPropertyName?: string,
    options: ParseOrFilterOptions = {},
): ElementFilterInformation[] => {
    const filteredFilterInformation = filterInformation.filter(
        (filterInformationElement) =>
            andFilterPropertyName !== undefined &&
            andFilterPropertyName ===
                filterInformationElement.propertyName?.toLowerCase(),
    )
    if (options.debug && filteredFilterInformation.length === 0) {
        console.debug(`No property is matching for '${andFilterPropertyName}'`)
    }
    if (options.debug && filteredFilterInformation.length !== 0) {
        console.debug(
            `For '${andFilterPropertyName}' #${filteredFilterInformation.length} elements are matching`,
            filteredFilterInformation,
        )
    }
    return filteredFilterInformation
}

export const parseOrFilter = (
    parsedFilterOr: ParseFilterElementOr,
    elementFilterInformation: ElementFilterInformation[],
    options: ParseOrFilterOptions = {},
): FilterElementResult => {
    const errors: string[] = []
    const match = parsedFilterOr.and.every((andFilter) => {
        if (options.debug) {
            console.debug("  - run and filter:", andFilter)
        }
        switch (andFilter.type) {
            case "substring":
                return elementFilterInformation.some((filterInformation) => {
                    const result = andFilterMatcher.substring(
                        andFilter,
                        filterInformation,
                        { debug: options.debug },
                    )
                    errors.push(...result.errors)
                    return result.match
                })
            case "property-substring":
                return filterElementInformationProperty(
                    elementFilterInformation,
                    andFilter.propertyName,
                    { debug: options.debug },
                ).some((filterInformation) => {
                    const result = andFilterMatcher.substring(
                        andFilter,
                        filterInformation,
                        { debug: options.debug },
                    )
                    errors.push(...result.errors)
                    return result.match
                })
            case "property-number-range":
            case "property-string-possible-range":
                switch (andFilter.rangeIndicator) {
                    case "=":
                        return filterElementInformationProperty(
                            elementFilterInformation,
                            andFilter.propertyName,
                            { debug: options.debug },
                        ).some((filterInformation) => {
                            const result = andFilterMatcher.numberRange.equals(
                                andFilter,
                                filterInformation,
                                { debug: options.debug },
                            )
                            errors.push(...result.errors)
                            return result.match
                        })
                    case "<=>-":
                        return filterElementInformationProperty(
                            elementFilterInformation,
                            andFilter.propertyName,
                            { debug: options.debug },
                        ).some((filterInformation) => {
                            const result = andFilterMatcher.numberRange.between(
                                andFilter,
                                filterInformation,
                                { debug: options.debug },
                            )
                            errors.push(...result.errors)
                            return result.match
                        })
                    case ">=":
                        return filterElementInformationProperty(
                            elementFilterInformation,
                            andFilter.propertyName,
                            { debug: options.debug },
                        ).some((filterInformation) => {
                            const result = andFilterMatcher.numberRange.greater(
                                andFilter,
                                filterInformation,
                                { canBeEqual: true, debug: options.debug },
                            )
                            errors.push(...result.errors)
                            return result.match
                        })
                    case "<=":
                        return filterElementInformationProperty(
                            elementFilterInformation,
                            andFilter.propertyName,
                            { debug: options.debug },
                        ).some((filterInformation) => {
                            const result = andFilterMatcher.numberRange.lesser(
                                andFilter,
                                filterInformation,
                                { canBeEqual: true, debug: options.debug },
                            )
                            errors.push(...result.errors)
                            return result.match
                        })
                    case ">":
                        return filterElementInformationProperty(
                            elementFilterInformation,
                            andFilter.propertyName,
                            { debug: options.debug },
                        ).some((filterInformation) => {
                            const result = andFilterMatcher.numberRange.greater(
                                andFilter,
                                filterInformation,
                                { debug: options.debug },
                            )
                            errors.push(...result.errors)
                            return result.match
                        })
                    case "<":
                        return filterElementInformationProperty(
                            elementFilterInformation,
                            andFilter.propertyName,
                            { debug: options.debug },
                        ).some((filterInformation) => {
                            const result = andFilterMatcher.numberRange.lesser(
                                andFilter,
                                filterInformation,
                                { debug: options.debug },
                            )
                            errors.push(...result.errors)
                            return result.match
                        })
                    default:
                        throw Error(
                            `unsupported andFilter.rangeIndicator '${andFilter.rangeIndicator}'`,
                        )
                }
            default:
                throw Error(`unsupported andFilter.type '${andFilter.type}'`)
        }
    })
    return { errors, match }
}
