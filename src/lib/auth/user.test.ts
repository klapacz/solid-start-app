import { describe, expect, test } from "vitest";
import { faker } from "@faker-js/faker";
import { Users } from "./user";
import { validate as validateUUID } from "uuid";

describe("`Users.findOrCreateByEmail`", () => {
  test("creates user if user does not exist", async () => {
    const email = faker.internet.email();
    const createdUser = await Users.findOrCreateByEmail(email);
    if (!createdUser.isOk()) {
      console.error(createdUser.error);
      throw new Error("User should be created.");
    }

    expect(createdUser.value).toMatchObject({
      email: email.toLocaleLowerCase().trim(),
      status: "UNCONFIRMED",
    });
    expect(validateUUID(createdUser.value.id)).toBe(true);

    const foundUser = await Users.findOrCreateByEmail(email);
    if (foundUser.isErr()) {
      console.error(foundUser.error);
      throw new Error("User should be found.");
    }
    expect(createdUser.value).toMatchObject({
      email: email.toLocaleLowerCase().trim(),
      status: "UNCONFIRMED",
    });
    expect(foundUser.value.id).toBe(createdUser.value.id);
  });
});
