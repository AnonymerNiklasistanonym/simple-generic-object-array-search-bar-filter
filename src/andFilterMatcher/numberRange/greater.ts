import { ElementFilterInformation } from "../../filterElement"
import { ParseFilterElementAnd } from "../../parseFilter"
import { ParseOrFilterOptions, FilterElementResult } from "../../parseOrFilter"

export interface GreaterMatcherOptions extends ParseOrFilterOptions {
    canBeEqual?: boolean
}

export const greaterMatcherRawNumber = (
    a: number,
    b: number,
    options: GreaterMatcherOptions,
): boolean => {
    let match: boolean
    if (options.canBeEqual) {
        match = a >= b
    } else {
        match = a > b
    }
    if (options.debug) {
        console.debug(`${a} ${options.canBeEqual ? ">=" : ">"} ${b} = ${match}`)
    }
    return match
}

export const greaterMatcherNumber = (
    andFilterNumber?: number,
    filterInformationNumberValue?: number,
    options: GreaterMatcherOptions = {},
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
        match: greaterMatcherRawNumber(
            filterInformationNumberValue,
            andFilterNumber,
            options,
        ),
    }
}

export const greaterMatcherString = (
    andFilterString?: string,
    filterInformationNumberString?: string,
    filterInformationStringToNumberMapper?: (input: string) => number,
    options: GreaterMatcherOptions = {},
): FilterElementResult => {
    const errors: string[] = []
    if (andFilterString === undefined) {
        throw Error("andFilter.stringRangeBegin was undefined")
    }
    if (filterInformationNumberString === undefined) {
        throw Error("filterInformation.stringValue was undefined")
    }
    let result: FilterElementResult
    if (filterInformationStringToNumberMapper === undefined) {
        result = {
            errors: [
                "string-possible-range could not be executed since " +
                    "the property does not have a mapper function",
            ],
            match: false,
        }
    } else {
        result = {
            errors: [],
            match: greaterMatcherRawNumber(
                filterInformationStringToNumberMapper(
                    filterInformationNumberString,
                ),
                filterInformationStringToNumberMapper(andFilterString),
                options,
            ),
        }
    }
    errors.push(...result.errors)
    return {
        errors,
        match: result.match,
    }
}

export const greaterMatcher = (
    andFilter: ParseFilterElementAnd,
    filterInformation: ElementFilterInformation,
    options: GreaterMatcherOptions = {},
): FilterElementResult => {
    const errors: string[] = []
    let result: FilterElementResult
    switch (filterInformation.type) {
        case "number":
            result = greaterMatcherNumber(
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
                        const result = greaterMatcherNumber(
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
            result = greaterMatcherString(
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
                        const result = greaterMatcherString(
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
