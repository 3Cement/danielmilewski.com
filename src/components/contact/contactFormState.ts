export type ContactField = "name" | "email" | "company" | "subject" | "message";
export type FieldErrorCode = "required" | "invalidEmail" | "tooShort" | "tooLong";
export type ContactMessageCode =
  | "success"
  | "configError"
  | "sendError";

export interface ContactFormState {
  status: "idle" | "success" | "error";
  messageCode?: ContactMessageCode;
  fieldErrors?: Partial<Record<ContactField, FieldErrorCode>>;
}

export const initialContactFormState: ContactFormState = {
  status: "idle",
};
