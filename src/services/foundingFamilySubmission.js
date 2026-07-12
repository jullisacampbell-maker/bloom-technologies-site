const STORAGE_KEY = 'bloom_founding_families';

/**
 * Submit a Founding Family signup.
 *
 * Placeholder implementation — stores submissions in localStorage.
 *
 * TODO: Replace with email provider integration (Kit, Mailchimp, ConvertKit, Resend).
 * Swap the body of this function; the form component should not need changes.
 */
export async function submitFoundingFamily(data) {
  const submission = {
    ...data,
    submittedAt: new Date().toISOString(),
  };

  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    existing.push(submission);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  } catch {
    // localStorage unavailable — log only
    console.warn('localStorage unavailable; submission logged to console only.');
  }

  console.log('Founding Family signup:', submission);

  return { success: true };
}
