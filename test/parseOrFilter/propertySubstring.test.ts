import { expect } from "chai"
import { describe, Suite } from "mocha"
import { ElementFilterInformation } from "../../src/filterElement"
import { ParseFilterElementOr } from "../../src/parseFilter"
import { parseOrFilter } from "../../src/parseOrFilter"

export const propertySubstringTestSuite = (): Suite =>
    describe("propertySubstring", () => {
        it("simple", () => {
            const parsedOrFilter1: ParseFilterElementOr = {
                and: [
                    {
                        propertyName: "abc",
                        substring: "es",
                        type: "property-substring",
                    },
                ],
            }
            const elementFilterInformation1: ElementFilterInformation[] = [
                {
                    propertyName: "abc",
                    stringValue: "test",
                    type: "string",
                },
            ]
            expect(
                parseOrFilter(parsedOrFilter1, elementFilterInformation1),
            ).to.deep.equal({
                errors: [],
                match: true,
            })

            const parsedOrFilter2: ParseFilterElementOr = {
                and: [
                    {
                        propertyName: "abc",
                        substring: "es",
                        type: "property-substring",
                    },
                ],
            }
            const elementFilterInformation2: ElementFilterInformation[] = [
                {
                    propertyName: "def",
                    stringValue: "test",
                    type: "string",
                },
            ]
            expect(
                parseOrFilter(parsedOrFilter2, elementFilterInformation2),
            ).to.deep.equal({
                errors: [],
                match: false,
            })
        })
    })
