import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "./firebase";

export function setupRecaptcha(phoneNumber) {
  const recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {}, auth);
  recaptchaVerifier.render();
  return signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
}