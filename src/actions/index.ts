import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { db, Comments, eq, Referrers } from "astro:db";

export const server = {
  submitComment: defineAction({
    accept: "json",
    input: z.object({
      createdBy: z.string().min(1),
      content: z.string().min(1),
      referrer: z.string().optional(),
    }),
    handler: async (input) => {
      const dbReferrer = await db.select().from(Referrers).where(eq(Referrers.referrer, input.referrer ?? "")).limit(1);
      const autoApprove = dbReferrer?.[0]?.autoApprove ?? false;
      const referrer = dbReferrer?.[0]?.referrer ?? "";

      if (input.content.length > 500) {
        throw new Error("Content must be less than 500 characters");
      }
      input.content = input.content.replaceAll("\n", "");
      
      await db.insert(Comments).values({
        createdBy: input.createdBy,
        content: input.content,
        status: autoApprove ? "approved" : "pending",
        createdAt: new Date(),
        referrer,
      });
    },
  }),
  approveComment: defineAction({
    accept: "json",
    input: z.object({
      id: z.number(),
    }),
    handler: async ({ id }) => {
      await db
        .update(Comments)
        .set({ status: "approved" })
        .where(eq(Comments.id, id));
    },
  }),
  rejectComment: defineAction({
    accept: "json",
    input: z.object({
      id: z.number(),
    }),
    handler: async ({ id }) => {
      await db
        .update(Comments)
        .set({ status: "rejected" })
        .where(eq(Comments.id, id));
    },
  }),
  createReferrer: defineAction({
    accept: "json",
    input: z.object({
      referrer: z.string().min(1),
      autoApprove: z.boolean(),
    }),
    handler: async ({ referrer, autoApprove }) => {
      await db.insert(Referrers).values({ referrer, autoApprove });
      return { referrer };
    },
  }),
  deleteReferrer: defineAction({
    accept: "json",
    input: z.object({
      referrer: z.string().min(1),
    }),
    handler: async ({ referrer }) => {
      await db.delete(Referrers).where(eq(Referrers.referrer, referrer));
    },
  }),
  deleteComment: defineAction({
    accept: "json",
    input: z.object({
      id: z.number(),
    }),
    handler: async ({ id }) => {
      await db.delete(Comments).where(eq(Comments.id, id));
    },
  }),
  toggleAutoApprove: defineAction({
    accept: "json",
    input: z.object({
      referrer: z.string().min(1),
    }),
    handler: async ({ referrer }) => {
      const referrerRecord = await db.select().from(Referrers).where(eq(Referrers.referrer, referrer)).limit(1);
      if (!referrerRecord) {
        throw new Error("Referrer not found");
      }
      const autoApprove = referrerRecord[0].autoApprove;
      await db.update(Referrers).set({ autoApprove: !autoApprove }).where(eq(Referrers.referrer, referrer));
    },
  }), 
};
