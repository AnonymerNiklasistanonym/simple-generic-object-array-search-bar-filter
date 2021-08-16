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

const testElement: TestElement = {
    description: "Another video game",
    name: "Apex",
    score: 10,
}

const result = filterElement(
    testElement,
    getTestElementInformation,
    parseFilter("description=video"),
    { debug: true },
)
console.log(result)
