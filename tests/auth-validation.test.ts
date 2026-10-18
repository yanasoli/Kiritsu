import { test } from "node:test";
import assert from "node:assert/strict";
import { loginSchema, registerSchema } from "../src/features/auth/validation";

const valid = { email: "learner@example.com", password: "long password 123", confirmPassword: "long password 123" };

test("registration accepts a valid matching password", () => {
  assert.equal(registerSchema.safeParse(valid).success, true);
});

test("registration rejects invalid email, short password and mismatched confirmation", () => {
  for (const fields of [
    { ...valid, email: "not-an-email" },
    { ...valid, password: "short", confirmPassword: "short" },
    { ...valid, confirmPassword: "different password" },
    { ...valid, password: "a".repeat(129), confirmPassword: "a".repeat(129) },
  ]) assert.equal(registerSchema.safeParse(fields).success, false);
});

test("password whitespace is preserved and blank credentials fail", () => {
  const password = "  a valid passphrase  ";
  assert.equal(registerSchema.parse({ ...valid, password, confirmPassword: password }).password, password);
  assert.equal(loginSchema.safeParse({ email: valid.email, password: "" }).success, false);
  assert.equal(loginSchema.safeParse({ email: "", password: "password" }).success, false);
});

test("login does not impose new registration password requirements on existing users", () => {
  assert.equal(loginSchema.safeParse({ email: valid.email, password: "legacy" }).success, true);
});
