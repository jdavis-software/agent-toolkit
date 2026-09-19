export {};
const debug = { trace: (...values: string[]) => values.join(":") };
const logger = { debug: (value: string) => value };
const result = debug.trace("sample");
const untouched = debug["trace"]("computed");
const multiple = debug.trace("a", "b");
const literal = "debug.trace(value)";
// debug.trace(value)
if (result !== "sample" || untouched !== "computed" || multiple !== "a:b" || literal !== "debug.trace(value)") throw new Error("behavior changed");
