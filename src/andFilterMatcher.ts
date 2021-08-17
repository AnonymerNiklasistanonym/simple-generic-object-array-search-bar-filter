import { substringMatcher as substring } from "./andFilterMatcher/substring"
import { numberRangeMatcher as numberRange } from "./andFilterMatcher/numberRange"

export const andFilterMatcher = {
    numberRange,
    substring,
}
