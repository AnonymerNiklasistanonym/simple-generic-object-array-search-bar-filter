import { expect } from "chai"
import { describe, Suite } from "mocha"

import { ElementFilterInformation } from "../../../src/filterElement"
import { ParseFilterElementOr } from "../../../src/parseFilter"
import { parseOrFilter } from "../../../src/parseOrFilter"

export const lesserTestSuite = (): Suite =>
    describe("</<=", () => {
        const stringValueToNumberValueMapper1 = (element: string): number => {
            switch (element) {
                case "a1":
                    return 1
                case "b2":
                    return 2
                case "c3":
                    return 3
                default:
                    return 0
            }
        }
        it("simple", () => {
            const parsedOrFilter1Less: ParseFilterElementOr = {
                and: [
                    {
                        propertyName: "abc",
                        rangeIndicator: "<",
                        stringRangeBegin: "b2",
                        type: "property-string-possible-range",
                    },
                ],
            }
            const parsedOrFilter1LessEq: ParseFilterElementOr = {
                and: [
                    {
                        propertyName: "abc",
                        rangeIndicator: "<=",
                        stringRangeBegin: "b2",
                        type: "property-string-possible-range",
                    },
                ],
            }

            const elementFilterInformation1: ElementFilterInformation[] = [
                {
                    propertyName: "abc",
                    stringValue: "a1",
                    stringValueToNumberValueMapper:
                        stringValueToNumberValueMapper1,
                    type: "string",
                },
            ]
            expect(
                parseOrFilter(parsedOrFilter1Less, elementFilterInformation1),
            ).to.deep.equal({
                errors: [],
                match: true,
            })
            expect(
                parseOrFilter(parsedOrFilter1LessEq, elementFilterInformation1),
            ).to.deep.equal({
                errors: [],
                match: true,
            })

            const parsedOrFilter2Less: ParseFilterElementOr = {
                and: [
                    {
                        propertyName: "abc",
                        rangeIndicator: "<",
                        stringRangeBegin: "a1",
                        type: "property-string-possible-range",
                    },
                ],
            }
            const parsedOrFilter2LessEq: ParseFilterElementOr = {
                and: [
                    {
                        propertyName: "abc",
                        rangeIndicator: "<=",
                        stringRangeBegin: "a1",
                        type: "property-string-possible-range",
                    },
                ],
            }
            expect(
                parseOrFilter(parsedOrFilter2Less, elementFilterInformation1),
            ).to.deep.equal({
                errors: [],
                match: false,
            })
            expect(
                parseOrFilter(parsedOrFilter2LessEq, elementFilterInformation1),
            ).to.deep.equal({
                errors: [],
                match: true,
            })
        })
    })
