import { z } from "zod";

export type HouseType = {
  houseId: number;
  id: number;
  streetNumber: number;
  lastName: string | null;
  name: string | null;
  type: string | null;
  streetId: number;
  locationId: number;
  lastUpdated: Date;
  lastUpdatedBy: string | null;
  internalNotes: string | null;
  statusAttempt: string | null;
  consent: string | null;
  // externalNotes: string | null;
  phone: string | null;
  email: string | null;
  Street: {
    name: string;
  };
  Location: {
    name: string;
  };
};

export type HouseDetailsProps = {
  props: HouseType;
};

export type HousesFeedProps = {
  id: string | string[] | undefined;
  start: number;
  perPage: number;
  userId: string;
  viewAll: string;
};

export type HouseFeedData = {
    feed: HousesFeedProps;
}

export type HouseItemProps = {
  house: HouseType;
  activeShift: boolean;
  // locationId: number;
};


export const FormSchema = z.object({
  houseId: z.string(),
  agentId: z.string(),
  // externalNotes: z.string().optional(),
  type: z.union([z.string(), z.literal(""), z.null()]).optional(),
  statusAttempt: z.string().optional(),

  name: z
    .union([
      z
        .string()
        .trim()
        .regex(/^[a-zA-Z ]+$/, "Name must be letters only"),
      z.literal(""),
    ])
    .optional(),

  lastName: z
    .union([
      z
        .string()
        .trim()
        .regex(/^[a-zA-Z ]+$/, "Last Name must be letters only"),
      z.literal(""),
    ])
    .optional(),
  phone: z
    .union([
      z
        .string()
        .trim()
        .min(10, "Phone number must be at least 10 digits long")
        .max(10, "Phone number must not be longer than 10 digits"),
      // .regex(/^[0-10()+\s-]+$/, "Phone number must be numeric"),
      z.literal(""),
    ])
    .optional(),
  email: z.union([z.string().email(), z.literal("")]).optional(),
  notes: z.string().optional(),
});




export const ConsentYesSchema = z
  .object({
    houseId: z.string(),
    agentId: z.string(),
    // externalNotes: z.string().optional(),
    type: z.string({
      required_error:
        "Type must be provided if status attempt is Consent Final Yes",
      invalid_type_error:
        " Type must be provided if status attempt is Consent Final Yes",
    }),
    statusAttempt: z.string().optional(),

    name: z
      .union([
        z
          .string()
          .trim()
          .regex(/^[a-zA-Z ]+$/, "Name must be letters only"),
        z.literal(""),
      ])
      .optional(),

    lastName: z
      .union([
        z
          .string()
          .trim()
          .regex(/^[a-zA-Z ]+$/, "Last Name must be letters only"),
        z.literal(""),
      ])
      .optional(),

    phone: z
      .union([
        z
          .string()
          .trim()
          .min(10, "Phone number must be at least 10 digits long")
          .max(10, "Phone number must not be longer than 10 digits"),
        // .regex(/^[0-10()+\s-]+$/, "Phone number must be numeric"),
        z.literal(""),
      ])
      .optional(),
    email: z.union([z.string().email(), z.literal("")]).optional(),
    notes: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.email && !data.phone) {
      ctx.addIssue({
        code: "custom",
        path: ["email"],
        message: "Email must be provided if phone is not provided",
      });
      ctx.addIssue({
        code: "custom",
        path: ["phone"],
        message: "Phone must be provided if email is not provided",
      });
    }
    if (!data.name && !data.lastName) {
      ctx.addIssue({
        code: "custom",
        path: ["name"],
        message: "Name must be provided if last name is not provided",
      });
      ctx.addIssue({
        code: "custom",
        path: ["lastName"],
        message: "LastName must be provided if name is not provided",
      });
    }
  });




  
