import { describe, Suite } from "mocha"

import { lesserTestSuite } from "./stringPossibleRange/lesser.test"
import { greaterTestSuite } from "./stringPossibleRange/greater.test"

export const stringPossibleRangeTestSuite = (): Suite =>
    describe("stringPossibleRange", () => {
        lesserTestSuite()
        greaterTestSuite()
    })
