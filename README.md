# simple-generic-object-array-search-bar-filter

A simple search bar filter optimized to be used with any object array

## Specification

If possible this library should use TypeScript generics.

### Filter input

This are the supported filter inputs for an object to be shown in the results:

```txt
AND: "abc+def"
=> the "abc" AND "def" filter are required to return true
OR: "abc def"
=> the "abc" OR "def" filter are required to return true
AND+OR: "abc+def ghi"
=> ("abc" AND "def") OR "ghi" filter are required to return true

EXCLUDE: "-abc"
=> the "abc" filter is required to return false
EXCLUDE+AND: "-abc+def"
=> ("abc" AND "def") filter are required to return false
```

Some filters can be more than only a substring seach:

```txt
SUBSTRING: "abc"
=> search all strings of seach object for the substring "abc"

PROPERTY-SUBSTRING: "abc=def"
=> search all strings that are registered under the property name "abc"
   for the substring "def"

PROPERTY-NUMBER-RANGE: "abc>=10" ["abc<=10","abc>10","abc<10"]
=> search all numbers that are registered under the property name "abc"
   and check if the object value is bigger or equal to 10
PROPERTY-NUMBER-RANGE: "abc=10-20" ["abc=-10-20","abc=-10--2"]
=> search all numbers that are registered under the property name "abc"
   and check if the object value is between 10 to 20
```

### Parse filter

```ts
export const parseFilter = (
    filter?: string
): ParseFilter => { /* ... */ }
```

This method takes the content of the search bar (=`filter`) and parses it to the following output:

```ts
export interface ParseFilter {
    /**
     * In here are all filters where a match qualifies an object to
     * be included in the search results.
     * All elements should be evaluated as OR to be a hit.
     */
    include: ParseFilterElementOr[]
    /**
     * In here are all filters where a match disqualifies an object
     * from being included in the search results.
     * All elements should be evaluated as OR to be a hit.
     */
    exclude: ParseFilterElementOr[]
}
```

```ts
export interface ParseFilterElementOr {
    and: ParseFilterElementAnd[]
}
export interface ParseFilterElementAnd {
    /**
     * This defines the type of filter that should be evaluated
     */
    type:
        | "substring" // Check if the input matches a substring
        //               of the object
        // example-input: "abc" -> Search for objects that contain
        //                         somewhere "abc"
        | "property-substring" // Same as sub-string but only on
        //                        a specific property
        // example-input: "name=abc" -> Search for objects that
        //                              contain on the property
        //                              "name" "abc"
        | "property-number-range" // Check if on a certain property
    //                               the number matches a range
    // example-input: "score>=10" -> Search for objects that have a
    //                               property "score" value >=10
    // example-input: "score<=10" -> Search for objects that have a
    //                               property "score" value <=10
    // example-input: "score>10" -> Search for objects that have a
    //                               property "score" value >10
    // example-input: "score<10" -> Search for objects that have a
    //                               property "score" value <10
    // example-input: "score=10-20" -> Search for objects that have
    //                                 a property "score" value
    //                                 between 10 and 20
    /**
     * When of type "substring" or "property-substring" this
     * attribute indicates the substring to check
     */
    substring?: string
    /**
     * When of type "property-substring" or "property-number-range"
     * this attribute indicates the property
     */
    propertyName?: string
    /**
     * When of type "property-number-range" this attribute indicates
     * the operation
     */
    numberRange?: ">=" | "<=" | ">" | "<" | "=-" | "="
    /**
     * When of type "property-number-range" this attribute indicates
     * the begin of the number range
     */
    numberRangeBegin?: number
    /**
     * When of type "property-number-range" this attribute indicates
     * the end of the number range
     */
    numberRangeEnd?: number
}
```

### Filter element

```ts
export interface FilterElementOptions {
    debug?: boolean
}

export const filterElement = <ElementType>(
    element: ElementType,
    elementFilter: (element: ElementType) => ElementFilterInformation[],
    parsedFilter?: ParseFilter,
    options: FilterElementOptions = {},
): FilterElementResult => { / * ... */ }
```

This method takes the output of the filter parser and any object that should be checked if it should show up in the search results.
It returns true if the object qualifies after executing the filters on it (if the filter is undefined true is returned).

```ts
export interface FilterElementResult {
    /**
     * True if the object matches the filters and should show up
     * in the search results
     */
    match: boolean
    /**
     * A collection of error messages between ParseFilter and
     * ElementFilterInformation[]
     */
    errors: string[]
}
```

```ts
export interface ElementFilterInformation {
    /**
     * The name of the property with the following string/number value
     */
    propertyName?: string
    /**
     * This defines the type of information that is provided by this
     * object property
     */
    type: "string" | "number" | "string-array" | "number-array"
    /**
     * When of type "string" this attribute indicates the string value
     * of the property
     */
    stringValue?: string
    /**
     * When of type "number" this attribute indicates the number value
     * of the property
     */
    numberValue?: number
    /**
     * When of type "string-array" this attribute indicates the string
     * array value of the property
     */
    stringArrayValue?: string[]
    /**
     * When of type "number-array" this attribute indicates the number
     * array value of the property
     */
    numberArrayValue?: number[]
}
```
