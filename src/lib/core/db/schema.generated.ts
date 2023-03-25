import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type UserStatus = "CONFIRMED" | "UNCONFIRMED";

export interface User {
  id: Generated<string>;
  email: string;
  status: Generated<UserStatus>;
}

export interface DB {
  user: User;
}
