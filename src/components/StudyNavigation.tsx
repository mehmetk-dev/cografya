import { useEffect, useRef } from "react";
import { BookOpen, Flag, GitBranch, HelpCircle, Map } from "lucide-react";

type StudySection = "notes" | "history" | "ataturk" | "questions";
const sections = [
  { id: "map", href: "#", label: "Coğrafya", icon: Map },
  { id: "history", href: "#tarih-zinciri", label: "Osmanlı", icon: GitBranch },
  { id: "ataturk", href: "#ataturk-ve-inkilap", label: "Atatürk", icon: Flag },
  { id: "notes", href: "#konu-notlari", label: "Konu notları", icon: BookOpen },
  { id: "questions", href: "#sorular", label: "Soru atölyesi", icon: HelpCircle },
];

export function StudyNavigation({ active }: { active: StudySection }) {
  const navigationRef = useRef<HTMLElement>(null);
  useEffect(() => {
    navigationRef.current?.querySelector('[aria-current="page"]')?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [active]);
  return (
    <div className="study-navigation">
      <a className="study-navigation__brand" href="#" aria-label="Atlasım ana menü">
        <span><Map size={21} /></span><strong>Atlasım<small>ÇALIŞMA KÜTÜPHANESİ</small></strong>
      </a>
      <nav ref={navigationRef} aria-label="Çalışma sayfaları">
        {sections.map(({ id, href, label, icon: Icon }) => (
          <a key={id} href={href} aria-current={active === id ? "page" : undefined}>
            <Icon size={17} /><span>{label}</span>
          </a>
        ))}
      </nav>
    </div>
  );
}
