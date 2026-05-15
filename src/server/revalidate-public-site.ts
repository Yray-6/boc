import { revalidatePath } from "next/cache";

/** Bust cached public HTML after admin updates site settings (footer, contact, etc.). */
export function revalidatePublicSiteContent() {
  revalidatePath("/", "layout");
  revalidatePath("/contact");
  revalidatePath("/properties");
}
