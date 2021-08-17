import type { ElementFilterInformation } from "../filterElement"
import type { ParseFilterElementAnd } from "../parseFilter"
import type {
    ParseOrFilterOptions,
    FilterElementResult,
} from "../parseOrFilter"

export const substringMatcherNumberValue = (
    andFilterSubstring: string,
    filterInformationNumberValue?: number,
    options: ParseOrFilterOptions = {},
): FilterElementResult => {
    const errors: string[] = []
    if (filterInformationNumberValue === undefined) {
        throw Error("filterInformation.numberValue was undefined")
    }
    return {
        errors,
        match: filterInformationNumberValue
            .toString()
            .includes(andFilterSubstring),
    }
}

export const substringMatcherStringValue = (
    andFilterSubstring: string,
    filterInformationStringValue?: string,
    options: ParseOrFilterOptions = {},
): FilterElementResult => {
    const errors: string[] = []
    if (filterInformationStringValue === undefined) {
        throw Error("filterInformation.stringValue was undefined")
    }
    return {
        errors,
        match: filterInformationStringValue
            .toLocaleLowerCase()
            .includes(andFilterSubstring),
    }
}

export const substringMatcher = (
    andFilter: ParseFilterElementAnd,
    filterInformation: ElementFilterInformation,
    options: ParseOrFilterOptions = {},
): FilterElementResult => {
    const errors: string[] = []
    const andFilterSubstring = andFilter.substring
    if (andFilterSubstring === undefined) {
        throw Error("andFilter.substring was undefined")
    }
    let result: FilterElementResult
    switch (filterInformation.type) {
        case "number":
            if (filterInformation.numberValue === undefined) {
                throw Error("filterInformation.stringValue was undefined")
            }
            result = substringMatcherNumberValue(
                andFilterSubstring,
                filterInformation.numberValue,
                options,
            )
            errors.push(...result.errors)
            return { errors, match: result.match }
        case "number-array":
            if (filterInformation.numberArrayValue === undefined) {
                throw Error("filterInformation.numberArrayValue was undefined")
            }
            return {
                errors,
                match: filterInformation.numberArrayValue.some(
                    (numberValue) => {
                        const result = substringMatcherNumberValue(
                            andFilterSubstring,
                            numberValue,
                            options,
                        )
                        errors.push(...result.errors)
                        return result.match
                    },
                ),
            }
        case "string":
            result = substringMatcherStringValue(
                andFilterSubstring,
                filterInformation.stringValue,
                options,
            )
            errors.push(...result.errors)
            return { errors, match: result.match }
        case "string-array":
            if (filterInformation.stringArrayValue === undefined) {
                throw Error("filterInformation.stringArrayValue was undefined")
            }
            return {
                errors,
                match: filterInformation.stringArrayValue.some(
                    (stringValue) => {
                        const result = substringMatcherStringValue(
                            andFilterSubstring,
                            stringValue,
                            options,
                        )
                        errors.push(...result.errors)
                        return result.match
                    },
                ),
            }
        default:
            throw Error(
                `unsupported filterInformation.type '${filterInformation.type}'`,
            )
    }
}
