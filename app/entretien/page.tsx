import BookingForm from "./BookingForm";

export const metadata = { title: "Choisir mon entretien offert | NeuroGenesis Academy" };

export default function InterviewPage() {
  return <div className="bg-cream pt-[76px]">
    <section className="dark-section">
      <div className="container-editorial py-section-sm">
        <p className="mb-4 text-xs uppercase tracking-wide3 text-gold">Entretien individuel · 30 minutes</p>
        <h1 className="font-serif text-hero text-cream">Choisir mon entretien offert</h1>
        <p className="mt-5 max-w-xl text-body-lg text-gold/80">Un échange sans engagement pour parler de votre projet de formation. Je vous appellerai au numéro indiqué, selon le mode d’entretien que vous aurez choisi.</p>
      </div>
    </section>
    <div className="container-editorial py-section-sm"><BookingForm /></div>
  </div>;
}
