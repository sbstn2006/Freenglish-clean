import { Suspense } from "react";
import VerifyEmailContent from "./VerifyEmailContent";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Verificando cuenta...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}