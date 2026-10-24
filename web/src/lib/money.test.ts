import assert from "node:assert/strict";
import {total, type Expense} from "./money.ts";

const e = (groupId: string, cents: number): Expense => ({id: "x", groupId, description: "", cents, date: "2026-01-01"});
const all = [e("a", 1050), e("a", 250), e("b", 999)];

assert.equal(total(all), 2299);
assert.equal(total(all, "a"), 1300);
assert.equal(total([], "a"), 0);
console.log("ok");
