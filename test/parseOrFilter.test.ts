import { describe, it } from "mocha"
import { expect } from "chai"

import type { ElementFilterInformation } from "../src/filterElement"
import type { ParseFilterElementOr } from "../src/parseFilter"

import { parseOrFilter } from "../src/parseOrFilter"

describe("parseOrFilter", () => {
    it("simple-substring", () => {
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
        expect(parseOrFilter(parsedOrFilter1, elementFilterInformation1)).to.be
            .true

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
        expect(parseOrFilter(parsedOrFilter2, elementFilterInformation2)).to.be
            .false

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
        expect(parseOrFilter(parsedOrFilter3, elementFilterInformation3)).to.be
            .true
    })

    it("simple-property-substring", () => {
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
        expect(parseOrFilter(parsedOrFilter1, elementFilterInformation1)).to.be
            .true

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
        expect(parseOrFilter(parsedOrFilter2, elementFilterInformation2)).to.be
            .false
    })
})
