import { LanguageParser } from "../../../languagedef/parser/LanguageParser";

describe("Checking language parser on checking errors", () => {
    const testdir = "src/test/__tests__/language-tests/faultyDefFiles/checking-errors/";
    const parser = new LanguageParser();
    const checker = parser.checker;

    test("language should have a model concept", () => {
        const parseFile = testdir + "test1.lang";
        try {
            parser.parse(parseFile);
        } catch (e) {
            expect(e.message).toBe(`checking errors.`);
            checker.errors.forEach(error =>
                expect(error).toBe("There should be a model in your language [line: 1, column: 1].")
            );
        }
    });

    test("language should have no more than one model concept and concepts and properties should have unique names", () => {
        const parseFile = testdir + "test2.lang";
        try {
            parser.parse(parseFile);
        } catch (e) {
            expect(e.message).toBe(`checking errors.`);
            expect(checker.errors.includes("There may be only one model in the language definition [line: 5, column: 1].")).toBeTruthy();
            expect(checker.errors.includes("Concept with name 'ZZZ' already exists [line: 7, column: 1]."));
            expect(checker.errors.includes("Property with name 'simple' already exists in ZZZ [line: 9, column: 5].")).toBeTruthy();
            expect(checker.errors.includes("Concept with name 'YYY' already exists [line: 12, column: 1].")).toBeTruthy();
            expect(checker.errors.includes("Concept or interface with name 'AAA' already exists [line: 16, column: 1].")).toBeTruthy();
            expect(checker.errors.includes("Concept may not have a name that is equal to a reserved word in TypeScript ('string') [line: 19, column: 1].")).toBeTruthy();
            expect(checker.errors.includes("Concept may not have a name that is equal to a reserved word in TypeScript ('number') [line: 21, column: 1].")).toBeTruthy();
            expect(checker.errors.includes("Concept may not have a name that is equal to a reserved word in TypeScript ('boolean') [line: 23, column: 1].")).toBeTruthy();
            expect(checker.errors.includes("Concept with name 'LowerCase' already exists [line: 27, column: 1].")).toBeTruthy();

        }
    });

    test("checking limitations on inheritance and implemented interfaces", () => {
        const parseFile = testdir + "test3.lang";
        try {
            parser.parse(parseFile);
        } catch (e) {
            expect(e.message).toBe(`checking errors.`);
            expect(checker.errors.includes("Base 'AAA' must be a concept [line: 9, column: 18].")).toBeTruthy();
            expect(checker.errors.includes("Base 'ZZ' of limited concept must be a limited concept [line: 11, column: 17].")).toBeTruthy();
            expect(checker.errors.includes("Limited concept 'AA' cannot be base of an unlimited concept [line: 13, column: 16].")).toBeTruthy();
            expect(checker.errors.includes("Concept 'ZZ' is not an interface [line: 18, column: 23].")).toBeTruthy();
        }
    });

    test("checking circular inheritance", () => {
        const parseFile = testdir + "test4.lang";
        try {
            parser.parse(parseFile);
        } catch (e) {
            expect(e.message).toBe(`checking errors.`);
            expect(checker.errors.includes("Concept or interface 'AAA' is part of a forbidden circular inheritance tree (AAA, BBB) [line: 3, column: 1].")).toBeTruthy();
            expect(checker.errors.includes("Concept or interface 'CCC' is part of a forbidden circular inheritance tree (CCC, DDD, EEE, FFF) [line: 7, column: 1].")).toBeTruthy();
            expect(checker.errors.includes("Concept or interface 'DDD' is part of a forbidden circular inheritance tree (DDD, EEE, FFF, CCC) [line: 10, column: 1].")).toBeTruthy();
            expect(checker.errors.includes("Concept or interface 'EEE' is part of a forbidden circular inheritance tree (EEE, FFF, CCC, DDD) [line: 13, column: 1].")).toBeTruthy();
            expect(checker.errors.includes("Concept or interface 'FFF' is part of a forbidden circular inheritance tree (FFF, CCC, DDD, EEE) [line: 16, column: 1].")).toBeTruthy();
            expect(checker.errors.includes("Concept or interface 'BBB' is part of a forbidden circular inheritance tree (BBB, AAA) [line: 18, column: 1].")).toBeTruthy();
            expect(checker.errors.includes("Property with name 'prop1' already exists in xxx [line: 24, column: 5].")).toBeTruthy();
            expect(checker.errors.includes("Property with name 'prop1' already exists in xxx [line: 30, column: 5].")).toBeTruthy();
            expect(checker.errors.includes("Property with name 'prop1' already exists in yyy [line: 30, column: 5].")).toBeTruthy();
        }
    });

    test("checking circular interfaces", () => {
        const parseFile = testdir + "test5.lang";
        try {
            parser.parse(parseFile);
        } catch (e) {
            expect(e.message).toBe(`checking errors.`);
            expect(checker.errors.includes("Concept or interface 'AAA' is part of a forbidden circular inheritance tree (AAA, BBB) [line: 5, column: 1].")).toBeTruthy();
            expect(checker.errors.includes("Concept or interface 'CCC' is part of a forbidden circular inheritance tree (CCC, DDD, EEE, FFF) [line: 8, column: 1].")).toBeTruthy();
            expect(checker.errors.includes("Concept or interface 'DDD' is part of a forbidden circular inheritance tree (DDD, EEE, FFF, CCC) [line: 11, column: 1].")).toBeTruthy();
            expect(checker.errors.includes("Concept or interface 'EEE' is part of a forbidden circular inheritance tree (EEE, FFF, CCC, DDD) [line: 14, column: 1].")).toBeTruthy();
            expect(checker.errors.includes("Concept or interface 'FFF' is part of a forbidden circular inheritance tree (FFF, CCC, DDD, EEE) [line: 18, column: 1].")).toBeTruthy();
            expect(checker.errors.includes("Concept or interface 'BBB' is part of a forbidden circular inheritance tree (BBB, AAA) [line: 21, column: 1].")).toBeTruthy();
        }
    });

    test("checking expression concepts", () => {
        const parseFile = testdir + "test6.lang";
        try {
            parser.parse(parseFile);
        } catch (e) {
            expect(e.message).toBe(`checking errors.`);
            expect(checker.errors.includes("Binary expression concept YYY should have a priority [line: 5, column: 1].")).toBeTruthy();
            expect(checker.errors.includes("Binary expression concept YYY should have a left part [line: 5, column: 1].")).toBeTruthy();
            expect(checker.errors.includes("Binary expression concept YYY should have a right part [line: 5, column: 1].")).toBeTruthy();
        }
    });

    test("checking limited concepts", () => {
        const parseFile = testdir + "test7.lang";
        try {
            parser.parse(parseFile);
        } catch (e) {
            expect(e.message).toBe(`checking errors.`);
            expect(checker.errors.includes("Type 'NoName' cannot be used as a reference, because it has no name property [line: 4, column: 24].")).toBeTruthy();
            expect(checker.errors.includes("Type 'NameNotStringType' cannot be used as a reference, because its name property is not of type 'string' [line: 5, column: 25].")).toBeTruthy();
            expect(checker.errors.includes("Property 's' does not exist on concept RRRR [line: 13, column: 19].")).toBeTruthy();
            expect(checker.errors.includes("Type of 'text' does not equal type of property 'simple' [line: 14, column: 19].")).toBeTruthy();
            expect(checker.errors.includes("Property 's' does not exist on concept AA [line: 20, column: 19].")).toBeTruthy();
            expect(checker.errors.includes("Type of 'text' does not equal type of property 'simple' [line: 21, column: 19].")).toBeTruthy();
            expect(checker.errors.includes("Type of '10' does not equal type of property 'prop2' [line: 24, column: 19].")).toBeTruthy();
            expect(checker.errors.includes("Instance with name 'instance5' already exists [line: 25, column: 5].")).toBeTruthy();
        }
    });

    test("checking limited concepts extended", () => {
        const parseFile = testdir + "test8.lang";
        try {
            parser.parse(parseFile);
        } catch (e) {
            expect(e.message).toBe(`checking errors.`);
            expect(checker.errors.includes("Property 'ZZprop7' of limited concept should have primitive type [line: 12, column: 5].")).toBeTruthy();
            expect(checker.errors.includes("A non-abstract limited concept must have instances [line: 3, column: 1].")).toBeTruthy();
            expect(checker.errors.includes("Property 'ZZprop7' does not exist on concept YY [line: 16, column: 21].")).toBeTruthy();
        }
    });

    test("language should have a name", () => {
        const parseFile = testdir + "test10.lang";
        try {
            parser.parse(parseFile);
        } catch (e) {
            expect(e.message).toBe(`checking errors.`);
            expect(checker.errors.includes("Language should have a name [line: 1, column: 1].")).toBeTruthy();
            expect(checker.errors.includes("There should be a model in your language [line: 1, column: 1].")).toBeTruthy();
        }
    });
});
