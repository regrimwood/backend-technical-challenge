import { Static, Type } from "@sinclair/typebox";

export const ErrorType = Type.Object({
  message: Type.String(),
});

export type ErrorType = Static<typeof ErrorType>;
