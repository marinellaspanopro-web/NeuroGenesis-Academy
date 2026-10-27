"use client";

import type { ComponentProps } from "react";
import Button from "@/components/ui/Button";
import { useCycle } from "@/components/shared/CycleProvider";
import { enrollmentHref, type EnrollmentPathway } from "@/lib/cycle";

type Props = Omit<ComponentProps<typeof Button>, "href"> & { pathway?: EnrollmentPathway };

/** All reservation entry points share the same cycle transition. */
export default function EnrollmentButton({ pathway, children, ...props }: Props) {
  const { started } = useCycle();
  const label = started && pathway !== "praticien"
    ? pathway === "pack" ? "Pack du prochain cycle" : "Prochain cycle"
    : children;
  return <Button {...props} href={enrollmentHref(pathway, started)}>{label}</Button>;
}
