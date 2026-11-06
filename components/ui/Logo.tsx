import Image from "next/image";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/logo/neurogenesis-officiel.png"
      width={500}
      height={500}
      alt="NeuroGenesis Academy"
      className={className}
    />
  );
}
