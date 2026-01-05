export type SignupPayload = { name: string; phone: string };

export async function signupService(payload: SignupPayload) {
  // Mock: in a real app call your backend API here
  await new Promise((r) => setTimeout(r, 400));
  return { success: true, otpSent: true };
}

export async function verifyOtpService({ phone, code }: { phone?: string; code?: string }) {
  await new Promise((r) => setTimeout(r, 400));
  // Accept any 4+ digit code in demo
  return { success: !!code && code.length >= 4 };
}
