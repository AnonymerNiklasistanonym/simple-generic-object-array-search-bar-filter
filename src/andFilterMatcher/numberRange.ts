import { equalsMatcher as equals } from "./numberRange/equals"
import { betweenMatcher as between } from "./numberRange/between"
import { greaterMatcher as greater } from "./numberRange/greater"
import { lesserMatcher as lesser } from "./numberRange/lesser"

export const numberRangeMatcher = {
    between,
    equals,
    greater,
    lesser,
}
