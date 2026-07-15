"use client";

import { useState, createContext, useContext } from "react";
import type { InvitationData, Language } from "@/types/invitation";
import { getTemplate, themeToCssVars } from "@/lib/templates";
import QizlarBazmiTemplate from "./qizlar-bazmi/QizlarBazmiTemplate";
import ToyTemplate from "./toy/ToyTemplate";
import TugilganKunTemplate from "./tugilgan-kun/TugilganKunTemplate";
import EnvelopeLanding from "./EnvelopeLanding";
import HeroSection from "./HeroSection";
import LetterSection from "./LetterSection";
import DateSection from "./DateSection";
import LocationSection from "./LocationSection";
import CountdownTimer from "./CountdownTimer";
import MusicPlayer from "./MusicPlayer";
import LanguageSwitcher from "./LanguageSwitcher";

interface LangContextType {
  lang: Language;
  t: (uz: string, ru: string) => string;
}

export const LangContext = createContext<LangContextType>({
  lang: "uz",
  t: (uz) => uz,
});

export const useLang = () => useContext(LangContext);

interface Props {
  data: InvitationData;
}

export default function InvitationWrapper({ data }: Props) {
  const [opened, setOpened] = useState(false);
  const [lang, setLang] = useState<Language>("uz");

  const t = (uz: string, ru: string) => (lang === "uz" ? uz : ru);

  // Fully custom, self-contained template with its own chrome (language
  // switcher, music, intro animation), so it bypasses the generic layout.
  if (data.template.slug === "qizlar-bazmi") {
    return <QizlarBazmiTemplate data={data} />;
  }

  if (data.template.slug === "toy-nikoh") {
    return <ToyTemplate data={data} />;
  }

  if (data.template.slug === "tugilgan-kun") {
    return <TugilganKunTemplate data={data} />;
  }

  const template = getTemplate(data.template.slug);
  const theme = template?.theme;
  const musicUrl = data.customMusicUrl ?? data.musicTrack?.fileUrl ?? null;

  const themeVars = theme
    ? ({
        "--primary": theme.primaryColor,
        "--secondary": theme.secondaryColor,
        "--accent": theme.accentColor,
        "--bg": theme.bgColor,
        "--text": theme.textColor,
        "--envelope-bg": theme.envelopeBg,
      } as React.CSSProperties)
    : {};

  return (
    <LangContext.Provider value={{ lang, t }}>
      <div className="relative min-h-screen" style={themeVars}>
        <LanguageSwitcher lang={lang} onChange={setLang} />
        {musicUrl && <MusicPlayer url={musicUrl} />}

        {!opened ? (
          <EnvelopeLanding
            eventType={data.eventType}
            brideName={data.brideName}
            templateSlug={data.template.slug}
            onOpen={() => setOpened(true)}
            t={t}
          />
        ) : (
          <main>
            <HeroSection data={data} t={t} />
            <LetterSection data={data} t={t} />
            <DateSection data={data} t={t} />
            <LocationSection data={data} t={t} />
            <CountdownTimer eventDate={data.eventDate} t={t} />
          </main>
        )}
      </div>
    </LangContext.Provider>
  );
}
