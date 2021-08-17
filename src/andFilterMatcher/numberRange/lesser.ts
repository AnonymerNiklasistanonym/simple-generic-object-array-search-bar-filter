import { ElementFilterInformation } from "../../filterElement"
import { ParseFilterElementAnd } from "../../parseFilter"
import { ParseOrFilterOptions, FilterElementResult } from "../../parseOrFilter"

export interface LesserMatcherOptions extends ParseOrFilterOptions {
    canBeEqual?: boolean
}

export const lesserMatcherRawNumber = (
    a: number,
    b: number,
    options: LesserMatcherOptions = {},
): boolean => {
    let match: boolean
    if (options.canBeEqual) {
        match = a <= b
    } else {
        match = a < b
    }
    if (options.debug) {
        console.debug(`${a} ${options.canBeEqual ? "<=" : "<"} ${b} = ${match}`)
    }
    return match
}

export const lesserMatcherNumber = (
    andFilterNumber?: number,
    filterInformationNumberValue?: number,
    options: LesserMatcherOptions = {},
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
        match: lesserMatcherRawNumber(
            filterInformationNumberValue,
            andFilterNumber,
            options,
        ),
    }
}

export const lesserMatcherString = (
    andFilterString?: string,
    filterInformationNumberString?: string,
    filterInformationStringToNumberMapper?: (input: string) => number,
    options: LesserMatcherOptions = {},
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
            match: lesserMatcherRawNumber(
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

export const lesserMatcher = (
    andFilter: ParseFilterElementAnd,
    filterInformation: ElementFilterInformation,
    options: LesserMatcherOptions = {},
): FilterElementResult => {
    const errors: string[] = []
    let result: FilterElementResult
    switch (filterInformation.type) {
        case "number":
            result = lesserMatcherNumber(
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
                        const result = lesserMatcherNumber(
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
            result = lesserMatcherString(
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
                        const result = lesserMatcherString(
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
