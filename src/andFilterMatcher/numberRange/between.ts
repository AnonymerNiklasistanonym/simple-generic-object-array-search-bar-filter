import { ElementFilterInformation } from "../../filterElement"
import { ParseFilterElementAnd } from "../../parseFilter"
import { ParseOrFilterOptions, FilterElementResult } from "../../parseOrFilter"

export const betweenMatcherRawNumber = (
    rangeBegin: number,
    rangeEnd: number,
    valueInBetween: number,
    options: ParseOrFilterOptions = {},
): boolean => {
    const numberRangeBegin = rangeBegin <= valueInBetween
    const numberRangeEnd = rangeEnd >= valueInBetween
    const result = numberRangeBegin && numberRangeEnd
    if (options.debug) {
        console.debug(
            `numberRangeBegin: ${numberRangeBegin} (${rangeBegin}<=${valueInBetween}), numberRangeEnd: ${numberRangeEnd} (${rangeEnd}>=${valueInBetween}) => ${result}`,
        )
    }
    return result
}

export const betweenMatcherNumberRange = (
    andFilterNumberRangeBegin?: number,
    andFilterNumberRangeEnd?: number,
    filterInformationNumberValue?: number,
    options: ParseOrFilterOptions = {},
): FilterElementResult => {
    const errors: string[] = []
    if (andFilterNumberRangeBegin === undefined) {
        throw Error("andFilter.numberRangeBegin was undefined")
    }
    if (andFilterNumberRangeEnd === undefined) {
        throw Error("andFilter.numberRangeEnd was undefined")
    }
    if (filterInformationNumberValue === undefined) {
        throw Error("filterInformation.numberValue was undefined")
    }
    return {
        errors,
        match: betweenMatcherRawNumber(
            andFilterNumberRangeBegin,
            andFilterNumberRangeEnd,
            filterInformationNumberValue,
            options,
        ),
    }
}

export const betweenMatcherStringRange = (
    andFilterStringRangeBegin?: string,
    andFilterStringRangeEnd?: string,
    filterInformationStringValue?: string,
    filterInformationStringToNumberMapper?: (input: string) => number,
    options: ParseOrFilterOptions = {},
): FilterElementResult => {
    const errors: string[] = []
    if (andFilterStringRangeBegin === undefined) {
        throw Error("andFilter.stringRangeBegin was undefined")
    }
    if (andFilterStringRangeEnd === undefined) {
        throw Error("andFilter.stringRangeEnd was undefined")
    }
    if (filterInformationStringValue === undefined) {
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
            match: betweenMatcherRawNumber(
                filterInformationStringToNumberMapper(
                    andFilterStringRangeBegin,
                ),
                filterInformationStringToNumberMapper(andFilterStringRangeEnd),
                filterInformationStringToNumberMapper(
                    filterInformationStringValue,
                ),
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

export const betweenMatcher = (
    andFilter: ParseFilterElementAnd,
    filterInformation: ElementFilterInformation,
    options: ParseOrFilterOptions = {},
): FilterElementResult => {
    const errors: string[] = []
    let result: FilterElementResult
    switch (filterInformation.type) {
        case "number":
            result = betweenMatcherNumberRange(
                andFilter.numberRangeBegin,
                andFilter.numberRangeEnd,
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
                        const result = betweenMatcherNumberRange(
                            andFilter.numberRangeBegin,
                            andFilter.numberRangeEnd,
                            numberValue,
                            options,
                        )
                        errors.push(...result.errors)
                        return result.match
                    },
                ),
            }
        case "string":
            result = betweenMatcherStringRange(
                andFilter.stringRangeBegin,
                andFilter.stringRangeEnd,
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
                        const result = betweenMatcherStringRange(
                            andFilter.stringRangeBegin,
                            andFilter.stringRangeEnd,
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
