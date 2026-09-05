import React from "react";
import { CheckCircle } from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function VerifyEmailCard() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center p-4">
      <Card className="w-full max-w-[440px] mx-auto text-center">
        <CardHeader className="pb-2">
          <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CheckCircle className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl font-bold">Email Berhasil Diverifikasi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Terima kasih telah memverifikasi alamat email Anda. Akun KomikHQ Anda sekarang telah aktif sepenuhnya.
          </p>
          <div className="pt-2">
            <a href="/login">
              <Button className="w-full">Masuk ke Akun Anda</Button>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
