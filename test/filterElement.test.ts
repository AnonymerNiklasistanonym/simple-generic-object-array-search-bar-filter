import { describe, it } from "mocha"
import { expect } from "chai"

import type { ElementFilterInformation } from "../src/filterElement"

import { filterElement } from "../src/filterElement"
import { parseFilter } from "../src/parseFilter"

interface TestElement {
    name: string
    description: string
    score: number
}

const getTestElementInformation = (
    testElement: TestElement,
): ElementFilterInformation[] => {
    return [
        {
            propertyName: "name",
            stringValue: testElement.name,
            type: "string",
        },
        {
            propertyName: "description",
            stringValue: testElement.description,
            type: "string",
        },
        {
            numberValue: testElement.score,
            propertyName: "score",
            type: "number",
        },
    ]
}

describe("filterElement", () => {
    it("simple-substring", () => {
        const testElement: TestElement = {
            description: "Another video game",
            name: "Apex",
            score: 10,
        }
        expect(
            filterElement(
                testElement,
                getTestElementInformation,
                parseFilter("video"),
            ),
        ).to.deep.equal({
            errors: [],
            match: true,
        })

        expect(
            filterElement(
                testElement,
                getTestElementInformation,
                parseFilter("video game"),
            ),
        ).to.deep.equal({
            errors: [],
            match: true,
        })

        expect(
            filterElement(
                testElement,
                getTestElementInformation,
                parseFilter("halo"),
            ),
        ).to.deep.equal({
            errors: [],
            match: false,
        })

        expect(
            filterElement(
                testElement,
                getTestElementInformation,
                parseFilter("halo+game"),
            ),
        ).to.deep.equal({
            errors: [],
            match: false,
        })

        expect(
            filterElement(
                testElement,
                getTestElementInformation,
                parseFilter("halo game"),
            ),
        ).to.deep.equal({
            errors: [],
            match: true,
        })
    })

    it("simple-property-substring", () => {
        const testElement: TestElement = {
            description: "Another video game",
            name: "Apex",
            score: 10,
        }
        expect(
            filterElement(
                testElement,
                getTestElementInformation,
                parseFilter("name=video"),
            ),
        ).to.deep.equal({
            errors: [],
            match: false,
        })

        expect(
            filterElement(
                testElement,
                getTestElementInformation,
                parseFilter("description=video"),
            ),
        ).to.deep.equal({
            errors: [],
            match: true,
        })

        expect(
            filterElement(
                testElement,
                getTestElementInformation,
                parseFilter("name=ape"),
                { debug: true },
            ),
        ).to.deep.equal({
            errors: [],
            match: true,
        })
    })
})
