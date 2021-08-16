import { describe, it } from "mocha"
import { expect } from "chai"

import type { ParseFilter } from "../src/parseFilter"

import { parseFilter } from "../src/parseFilter"

describe("parseFilter", () => {
    it("EMPTY", () => {
        const filterEmpty = ""
        const filterUndefined = ""
        const filterOnlySpaces = "       "

        const filterEmptyExpect: ParseFilter = {
            exclude: [],
            include: [],
        }

        const filterEmptyResult = parseFilter(filterEmpty)
        expect(filterEmptyResult).to.deep.equal(filterEmptyExpect)

        const filterUndefinedResult = parseFilter(filterUndefined)
        expect(filterUndefinedResult).to.deep.equal(filterEmptyExpect)

        const filterOnlySpacesResult = parseFilter(filterOnlySpaces)
        expect(filterOnlySpacesResult).to.deep.equal(filterEmptyExpect)
    })

    it("OR", () => {
        const filterOr1 = "a"
        const filterOr1Expect: ParseFilter = {
            exclude: [],
            include: [
                {
                    and: [{ substring: "a", type: "substring" }],
                },
            ],
        }

        const filterOr1Result = parseFilter(filterOr1)
        expect(filterOr1Result).to.deep.equal(filterOr1Expect)

        const filterOr2 = "a b"
        const filterOr2Expect: ParseFilter = {
            exclude: [],
            include: [
                {
                    and: [{ substring: "a", type: "substring" }],
                },
                {
                    and: [{ substring: "b", type: "substring" }],
                },
            ],
        }

        const filterOr2Result = parseFilter(filterOr2)
        expect(filterOr2Result).to.deep.equal(filterOr2Expect)

        const filterOr3 = "eins zwei drei"
        const filterOr3Expect: ParseFilter = {
            exclude: [],
            include: [
                {
                    and: [{ substring: "eins", type: "substring" }],
                },
                {
                    and: [{ substring: "zwei", type: "substring" }],
                },
                {
                    and: [{ substring: "drei", type: "substring" }],
                },
            ],
        }

        const filterOr3Result = parseFilter(filterOr3)
        expect(filterOr3Result).to.deep.equal(filterOr3Expect)
    })

    it("AND", () => {
        const filterAnd1 = "a+b"
        const filterAnd1Expect: ParseFilter = {
            exclude: [],
            include: [
                {
                    and: [
                        { substring: "a", type: "substring" },
                        { substring: "b", type: "substring" },
                    ],
                },
            ],
        }

        const filterAnd1Result = parseFilter(filterAnd1)
        expect(filterAnd1Result).to.deep.equal(filterAnd1Expect)

        const filterAnd2 = "eins+zwei+drei"
        const filterAnd2Expect: ParseFilter = {
            exclude: [],
            include: [
                {
                    and: [
                        { substring: "eins", type: "substring" },
                        { substring: "zwei", type: "substring" },
                        { substring: "drei", type: "substring" },
                    ],
                },
            ],
        }

        const filterAnd2Result = parseFilter(filterAnd2)
        expect(filterAnd2Result).to.deep.equal(filterAnd2Expect)

        const filterAnd3 = "a+b c+d+e f+g"
        const filterAnd3Expect: ParseFilter = {
            exclude: [],
            include: [
                {
                    and: [
                        { substring: "a", type: "substring" },
                        { substring: "b", type: "substring" },
                    ],
                },
                {
                    and: [
                        { substring: "c", type: "substring" },
                        { substring: "d", type: "substring" },
                        { substring: "e", type: "substring" },
                    ],
                },
                {
                    and: [
                        { substring: "f", type: "substring" },
                        { substring: "g", type: "substring" },
                    ],
                },
            ],
        }

        const filterAnd3Result = parseFilter(filterAnd3)
        expect(filterAnd3Result).to.deep.equal(filterAnd3Expect)

        const filterAndEdgeCase1 = "+a"
        const filterAndEdgeCase1Expect: ParseFilter = {
            exclude: [],
            include: [
                {
                    and: [{ substring: "a", type: "substring" }],
                },
            ],
        }

        const filterAndEdgeCase1Result = parseFilter(filterAndEdgeCase1)
        expect(filterAndEdgeCase1Result).to.deep.equal(filterAndEdgeCase1Expect)

        const filterAndEdgeCase2 = "+a+"
        const filterAndEdgeCase2Expect: ParseFilter = {
            exclude: [],
            include: [
                {
                    and: [{ substring: "a", type: "substring" }],
                },
            ],
        }

        const filterAndEdgeCase2Result = parseFilter(filterAndEdgeCase2)
        expect(filterAndEdgeCase2Result).to.deep.equal(filterAndEdgeCase2Expect)

        const filterAndEdgeCase3 = "++a"
        const filterAndEdgeCase3Expect: ParseFilter = {
            exclude: [],
            include: [
                {
                    and: [{ substring: "a", type: "substring" }],
                },
            ],
        }

        const filterAndEdgeCase3Result = parseFilter(filterAndEdgeCase3)
        expect(filterAndEdgeCase3Result).to.deep.equal(filterAndEdgeCase3Expect)

        const filterAndEdgeCase4 = "++a++"
        const filterAndEdgeCase4Expect: ParseFilter = {
            exclude: [],
            include: [
                {
                    and: [{ substring: "a", type: "substring" }],
                },
            ],
        }

        const filterAndEdgeCase4Result = parseFilter(filterAndEdgeCase4)
        expect(filterAndEdgeCase4Result).to.deep.equal(filterAndEdgeCase4Expect)
    })
})
