import { expect } from "chai"
import { describe, Suite } from "mocha"
import { ElementFilterInformation } from "../../src/filterElement"
import { ParseFilterElementOr } from "../../src/parseFilter"
import { parseOrFilter } from "../../src/parseOrFilter"

export const substringTestSuite = (): Suite =>
    describe("substring", () => {
        it("simple", () => {
            const parsedOrFilter1: ParseFilterElementOr = {
                and: [
                    {
                        substring: "test",
                        type: "substring",
                    },
                ],
            }
            const elementFilterInformation1: ElementFilterInformation[] = [
                {
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
                        substring: "testa",
                        type: "substring",
                    },
                ],
            }
            const elementFilterInformation2: ElementFilterInformation[] = [
                {
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

            const parsedOrFilter3: ParseFilterElementOr = {
                and: [
                    {
                        substring: "es",
                        type: "substring",
                    },
                ],
            }
            const elementFilterInformation3: ElementFilterInformation[] = [
                {
                    stringValue: "test",
                    type: "string",
                },
            ]
            expect(
                parseOrFilter(parsedOrFilter3, elementFilterInformation3),
            ).to.deep.equal({
                errors: [],
                match: true,
            })

            const parsedOrFilter4: ParseFilterElementOr = {
                and: [
                    {
                        substring: "halo",
                        type: "substring",
                    },
                ],
            }
            const elementFilterInformation4: ElementFilterInformation[] = [
                {
                    propertyName: "videoGameName",
                    stringValue: "apex legends",
                    type: "string",
                },
            ]
            expect(
                parseOrFilter(parsedOrFilter4, elementFilterInformation4),
            ).to.deep.equal({
                errors: [],
                match: false,
            })
        })
    })
