import { describe } from "mocha"

import { substringTestSuite } from "./parseOrFilter/substring.test"
import { propertySubstringTestSuite } from "./parseOrFilter/propertySubstring.test"
import { stringPossibleRangeTestSuite } from "./parseOrFilter/stringPossibleRange.test"

describe("parseOrFilter", () => {
    substringTestSuite()
    propertySubstringTestSuite()
    stringPossibleRangeTestSuite()
})
