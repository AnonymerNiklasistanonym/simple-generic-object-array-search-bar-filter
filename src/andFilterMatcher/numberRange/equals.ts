import { ElementFilterInformation } from "../../filterElement"
import { ParseFilterElementAnd } from "../../parseFilter"
import { ParseOrFilterOptions, FilterElementResult } from "../../parseOrFilter"
import { substringMatcher, substringMatcherStringValue } from "../substring"

export const equalsMatcherRawNumber = (a: number, b: number): boolean => {
    return Math.abs(a - b) < Number.EPSILON
}

export const equalsMatcherNumber = (
    andFilterNumber?: number,
    filterInformationNumberValue?: number,
    options: ParseOrFilterOptions = {},
): FilterElementResult => {
    const errors: string[] = []
    if (andFilterNumber === undefined) {
        throw Error("andFilter.numberRangeBegin was undefined")
    }
    if (filterInformationNumberValue === undefined) {
        throw Error("filterInformation.numberValue was undefined")
    }
    return {
        errors,
        match: equalsMatcherRawNumber(
            andFilterNumber,
            filterInformationNumberValue,
        ),
    }
}

export const equalsMatcherString = (
    andFilterString?: string,
    filterInformationStringValue?: string,
    filterInformationStringToNumberMapper?: (input: string) => number,
    options: ParseOrFilterOptions = {},
): FilterElementResult => {
    const errors: string[] = []
    if (andFilterString === undefined) {
        throw Error("andFilterString was undefined")
    }
    if (filterInformationStringValue === undefined) {
        throw Error("filterInformationStringValue was undefined")
    }
    let result: FilterElementResult
    if (filterInformationStringToNumberMapper === undefined) {
        result = substringMatcherStringValue(
            andFilterString,
            filterInformationStringValue,
            options,
        )
    } else {
        result = equalsMatcherNumber(
            filterInformationStringToNumberMapper(andFilterString),
            filterInformationStringToNumberMapper(filterInformationStringValue),
            options,
        )
    }
    errors.push(...result.errors)
    return {
        errors,
        match: result.match,
    }
}

export const equalsMatcher = (
    andFilter: ParseFilterElementAnd,
    filterInformation: ElementFilterInformation,
    options: ParseOrFilterOptions = {},
): FilterElementResult => {
    const errors: string[] = []
    let result: FilterElementResult
    switch (filterInformation.type) {
        case "number":
            result = equalsMatcherNumber(
                andFilter.numberRangeBegin,
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
                        const result = equalsMatcherNumber(
                            andFilter.numberRangeBegin,
                            numberValue,
                            options,
                        )
                        errors.push(...result.errors)
                        return result.match
                    },
                ),
            }
        case "string":
            result = equalsMatcherString(
                andFilter.stringRangeBegin,
                filterInformation.stringValue,
                filterInformation.stringValueToNumberValueMapper,
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
                        const result = equalsMatcherString(
                            andFilter.stringRangeBegin,
                            stringValue,
                            filterInformation.stringValueToNumberValueMapper,
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
