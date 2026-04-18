import { revalidatePath } from 'next/cache';

export function revalidateSpecimen(slug: string) {
  revalidatePath('/');
  revalidatePath(`/catalogue/${slug}`);
  // Revalidate all stage views (slug unknown at hook time, revalidate all)
  revalidatePath('/stages/[stage]', 'page');
}

export function revalidateFieldNote(slug: string) {
  revalidatePath('/field-notes');
  revalidatePath(`/field-notes/${slug}`);
}
