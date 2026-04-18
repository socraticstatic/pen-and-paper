export async function revalidateSpecimen(slug: string) {
  const { revalidatePath } = await import('next/cache');
  revalidatePath('/');
  revalidatePath(`/catalogue/${slug}`);
  // Revalidate all stage views (slug unknown at hook time, revalidate all)
  revalidatePath('/stages/[stage]', 'page');
}

export async function revalidateFieldNote(slug: string) {
  const { revalidatePath } = await import('next/cache');
  revalidatePath('/field-notes');
  revalidatePath(`/field-notes/${slug}`);
}
