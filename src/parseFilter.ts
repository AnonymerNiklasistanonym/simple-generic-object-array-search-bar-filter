export interface ParseFilterElementAnd {
    /**
     * This defines the type of filter that should be evaluated
     */
    type:
        | "substring" // Check if the input matches a substring
        //               of the object
        // example-input: "abc" -> Search for objects that contain
        //                         somewhere "abc"
        | "property-substring" // Same as sub-string but only on
        //                        a specific property
        // example-input: "name=abc" -> Search for objects that
        //                              contain on the property
        //                              "name" "abc"
        | "property-number-range" // Check if on a certain property
    //                               the number matches a range
    // example-input: "score>=10" -> Search for objects that have a
    //                               property "score" value >=10
    // example-input: "score<=10" -> Search for objects that have a
    //                               property "score" value <=10
    // example-input: "score>10" -> Search for objects that have a
    //                               property "score" value >10
    // example-input: "score<10" -> Search for objects that have a
    //                               property "score" value <10
    // example-input: "score=10-20" -> Search for objects that have
    //                                 a property "score" value
    //                                 between 10 and 20
    /**
     * When of type "substring" or "property-substring" this
     * attribute indicates the substring to check
     */
    substring?: string
    /**
     * When of type "property-substring" or "property-number-range"
     * this attribute indicates the property
     */
    propertyName?: string
    /**
     * When of type "property-number-range" this attribute indicates
     * the operation
     */
    numberRange?: ">=" | "<=" | ">" | "<" | "=-" | "="
    /**
     * When of type "property-number-range" this attribute indicates
     * the begin of the number range
     */
    numberRangeBegin?: number
    /**
     * When of type "property-number-range" this attribute indicates
     * the end of the number range
     */
    numberRangeEnd?: number
}

export interface ParseFilter {
    /**
     * In here are all filters where a match qualifies an object to
     * be included in the search results.
     * All elements should be evaluated as OR to be a hit.
     */
    include: ParseFilterElementOr[]
    /**
     * In here are all filters where a match disqualifies an object
     * from being included in the search results.
     * All elements should be evaluated as OR to be a hit.
     */
    exclude: ParseFilterElementOr[]
}

export interface ParseFilterElementOr {
    and: ParseFilterElementAnd[]
}

export const regexPropertySubstring = /(^[^=<>]+)=([^=<>]+)$/
export const regexPropertyNumber = /(^[^=<>]+)=(\d+\.?\d*)$/
export const regexPropertyNumberRangeLeq = /(^[^=<>]+)<=(\d+\.?\d*)$/
export const regexPropertyNumberRangeGeq = /(^[^=<>]+)>=(\d+\.?\d*)$/
export const regexPropertyNumberRangeLe = /(^[^=<>]+)<(\d+\.?\d*)$/
export const regexPropertyNumberRangeGe = /(^[^=<>]+)>(\d+\.?\d*)$/
export const regexPropertyNumberRange = /(^[^=<>]+)=(\d+\.?\d*)-(\d+\.?\d*)$/

export const parseFilter = (filter?: string): ParseFilter => {
    const exclude: ParseFilterElementOr[] = []
    const include: ParseFilterElementOr[] = []
    if (filter === undefined) {
        return {
            exclude,
            include,
        }
    }
    // Get the OR elements of the filter
    const orFilters = filter
        .split(/ /)
        .map((a) => a.trim())
        .filter((b) => b !== "")

    // Parse the AND expressions elements of the filter
    for (const possibleAndFilter of orFilters) {
        const andFilter = possibleAndFilter
            .split(/\+/)
            .map((a) => a.trim())
            .filter((b) => b !== "")
            .filter((c) => c !== "+")
        // Check if the filter should be excluded
        let excludeFilter = false
        if (andFilter[0]?.startsWith("-")) {
            excludeFilter = true
            andFilter[0] = andFilter[0].substring(1)
        }
        // If the filter starts with a "-" add it to the exclude list
        const parseFilterElementsOr: ParseFilterElementOr = {
            and: andFilter.map((andFilterElement): ParseFilterElementAnd => {
                const regexPropertyNumberRangeGroupMatch =
                    regexPropertyNumberRange.exec(andFilterElement)
                if (regexPropertyNumberRangeGroupMatch != null) {
                    return {
                        numberRange: "=-",
                        numberRangeBegin: Number.parseFloat(
                            regexPropertyNumberRangeGroupMatch[2],
                        ),
                        numberRangeEnd: Number.parseFloat(
                            regexPropertyNumberRangeGroupMatch[3],
                        ),
                        propertyName:
                            regexPropertyNumberRangeGroupMatch[1].toLowerCase(),
                        type: "property-number-range",
                    }
                }

                const regexPropertyNumberGroupMatch =
                    regexPropertyNumber.exec(andFilterElement)
                if (regexPropertyNumberGroupMatch != null) {
                    return {
                        numberRange: "=",
                        numberRangeBegin: Number.parseFloat(
                            regexPropertyNumberGroupMatch[2],
                        ),
                        propertyName:
                            regexPropertyNumberGroupMatch[1].toLowerCase(),
                        type: "property-number-range",
                    }
                }

                const regexPropertySubstringGroupMatch =
                    regexPropertySubstring.exec(andFilterElement)
                if (regexPropertySubstringGroupMatch != null) {
                    return {
                        propertyName:
                            regexPropertySubstringGroupMatch[1].toLowerCase(),
                        substring:
                            regexPropertySubstringGroupMatch[2].toLowerCase(),
                        type: "property-substring",
                    }
                }

                // Check for property-number-ranges with regex

                return {
                    substring: andFilterElement.toLowerCase(),
                    type: "substring",
                }
            }),
        }
        if (excludeFilter) {
            exclude.push(parseFilterElementsOr)
        } else {
            include.push(parseFilterElementsOr)
        }
    }

    return {
        exclude,
        include,
    }
}
