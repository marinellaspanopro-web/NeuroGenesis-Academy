"use client";

import { useCycle } from "@/components/shared/CycleProvider";
import { siteConfig } from "@/lib/site-config";

export default function CycleSessionLabel() {
  const { started } = useCycle();
  return <>{started ? siteConfig.session.afterBadge : `Cursus Technicien · ${siteConfig.session.startDateDisplay}`}</>;
}
