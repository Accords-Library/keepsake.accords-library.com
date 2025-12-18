import { defineDb, column } from "astro:db";

// https://astro.build/db/config
export default defineDb({
  tables: {
    Comments: {
      columns: {
        id: column.number({ primaryKey: true, autoIncrement: true }),
        content: column.text(),
        createdAt: column.date(),
        createdBy: column.text(),
        location: column.text(),
        status: column.text({ enum: ["pending", "approved", "rejected"] }),
        referrer: column.text({ default: "" }),
      },
    },
    Referrers: {
      columns: {
        referrer: column.text({ primaryKey: true }),
        autoApprove: column.boolean({ default: false }),
      },
    },
  },
});
