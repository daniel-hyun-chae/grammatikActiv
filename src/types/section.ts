import { z } from "zod";

export const sectionFormSchema = z.object({
  title: z.string().min(1),
});

export type SectionForm = z.infer<typeof sectionFormSchema>;

export const sectionSchema = sectionFormSchema.extend({
  courseId: z.string().min(1),
});

export type Section = z.infer<typeof sectionSchema>;
