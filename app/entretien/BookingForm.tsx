"use client";

import { useEffect, useState, type FormEvent } from "react";
import { methods, type InterviewSlot } from "@/lib/entretiens";

const field = "block w-full mt-1 rounded-sm border border-forest/30 bg-cream-soft px-4 py-3";
const selection = "rounded-pill border border-forest/30 px-4 py-2 text-sm peer-checked:bg-forest peer-checked:text-cream peer-focus-visible:outline";

export default function BookingForm() {
  const [slots, setSlots] = useState<InterviewSlot[] | null>(null);
  const [chosen, setChosen] = useState("");
  const [requestId, setRequestId] = useState("");
  const [reload, setReload] = useState(0);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState("");
  const [unavailable, setUnavailable] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/entretiens", { cache: "no-store", signal: controller.signal })
      .then(async res => {
        if (!res.ok) throw new Error();
        const body = await res.json();
        setSlots(body.slots);
        setUnavailable(false);
      })
      .catch(() => { if (!controller.signal.aborted) setUnavailable(true); });
    return () => controller.abort();
  }, [reload]);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending) return;
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const slot = slots?.find(s => s.id === chosen);
    if (!slot) return;
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/entretiens", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, requestId, slotId: chosen }) });
      const body = await res.json();
      if (res.status === 409) {
        setChosen("");
        setSlots(list => list?.filter(s => s.id !== chosen) ?? []);
        setReload(i => i + 1);
      }
      if (!res.ok || !body.confirmed) throw new Error(body.error || "Veuillez réessayer.");
      const method = methods[data.method as keyof typeof methods];
      setSuccess([slot.day, slot.hours + " (heure belge).", method + " au " + data.phone + ".",
        body.mailPending ? "Votre e-mail de confirmation suivra." : "Une confirmation vous a été envoyée par e-mail."].join(" "));
    } catch (err) {
      setError(err instanceof TypeError ? "Connexion interrompue. Réessayez pour vérifier votre réservation." :
        err instanceof Error ? err.message : "Veuillez réessayer.");
    } finally { setSending(false); }
  }

  if (success) return <div role="status" className="max-w-xl rounded-lg border border-gold-deep/30 p-8">
    <h2 className="font-serif text-h2 text-forest">Votre entretien est confirmé</h2><p className="mt-4">{success}</p></div>;
  if (unavailable) return <div role="alert">Les disponibilités sont momentanément inaccessibles.{" "}
    <button className="underline" onClick={() => setReload(i => i + 1)}>Réessayer</button></div>;
  if (!slots) return <p role="status">Chargement des créneaux disponibles…</p>;
  if (!slots.length) return <p>Tous les créneaux proposés sont terminés ou réservés. <a href="/contact" className="underline">Contactez l’Académie</a> pour convenir d’un entretien.</p>;

  return <form onSubmit={submit} className="max-w-2xl space-y-8">
    <fieldset disabled={sending} className="space-y-4">
      <legend className="font-serif text-h2 text-forest">Créneaux disponibles</legend>
      <p className="text-sm text-ink/70">Durée de 30 minutes · heure belge</p>
      {Array.from(new Set(slots.map(s => s.day))).map(day => <div key={day}>
        <p className="mb-2 font-medium capitalize">{day}</p><div className="flex flex-wrap gap-2">
          {slots.filter(s => s.day === day).map(s => <label className="cursor-pointer" key={s.id}>
            <input type="radio" name="slot" required value={s.id} aria-label={s.day + " " + s.hours}
              checked={chosen === s.id} onChange={() => { setChosen(s.id); setRequestId(crypto.randomUUID()); }} className="peer sr-only" />
            <span className={selection + " inline-block"}>{s.hours}</span>
          </label>)}
        </div></div>)}
    </fieldset>
    <fieldset disabled={sending} className="grid gap-4 sm:grid-cols-2">
      <legend className="mb-4 font-serif text-h3 text-forest">Vos coordonnées</legend>
      <label>Prénom<input className={field} name="firstName" autoComplete="given-name" maxLength={100} required /></label>
      <label>Nom<input className={field} name="lastName" autoComplete="family-name" maxLength={100} required /></label>
      <label>Adresse e-mail<input className={field} type="email" name="email" autoComplete="email" maxLength={254} required /></label>
      <label>Numéro de téléphone (obligatoire)<input className={field} type="tel" name="phone" autoComplete="tel" maxLength={40} required /></label>
      <div hidden><label>Société<input name="company" autoComplete="off" tabIndex={-1} /></label></div>
    </fieldset>
    <fieldset disabled={sending}>
      <legend className="mb-3 font-serif text-h3 text-forest">Comment souhaitez-vous être appelé(e) ?</legend>
      {Object.entries(methods).map(([value, label]) => <label key={value} className="mb-2 block">
        <input className="mr-2 accent-forest" type="radio" required name="method" value={value} />{label}</label>)}
      <p className="text-sm text-ink/70">Pour la vidéo, indiquez le numéro associé à votre compte WhatsApp.</p>
    </fieldset>
    {error && <p role="alert" className="text-red-800">{error}</p>}
    <button type="submit" disabled={sending} className="rounded-pill bg-forest px-6 py-3 text-cream disabled:opacity-60">
      {sending ? "Confirmation en cours…" : "Confirmer mon rendez-vous"}
    </button>
  </form>;
}
