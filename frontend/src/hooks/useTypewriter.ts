import { useState, useEffect, useCallback, useRef } from "react";

interface TypewriterOptions {
  typeSpeed?: number;
  deleteSpeed?: number;
  pauseDuration?: number;
  loop?: boolean;
}

const DEFAULT_OPTIONS: Required<TypewriterOptions> = {
  typeSpeed: 60,
  deleteSpeed: 40,
  pauseDuration: 2000,
  loop: true,
};

type Phase = "typing" | "pausing" | "deleting";

export function useTypewriter(
  phrases: readonly string[] | string[],
  options: TypewriterOptions = {}
): string {
  const config = { ...DEFAULT_OPTIONS, ...options };
  const [displayText, setDisplayText] = useState("");
  const phaseRef = useRef<Phase>("typing");
  const phraseIndexRef = useRef(0);
  const charIndexRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const tick = useCallback(() => {
    const currentPhrase = phrases[phraseIndexRef.current];
    const phase = phaseRef.current;

    if (phase === "typing") {
      if (charIndexRef.current < currentPhrase.length) {
        charIndexRef.current++;
        setDisplayText(currentPhrase.slice(0, charIndexRef.current));
        timeoutRef.current = setTimeout(tick, config.typeSpeed);
      } else {
        phaseRef.current = "pausing";
        timeoutRef.current = setTimeout(tick, config.pauseDuration);
      }
    } else if (phase === "pausing") {
      phaseRef.current = "deleting";
      timeoutRef.current = setTimeout(tick, config.deleteSpeed);
    } else if (phase === "deleting") {
      if (charIndexRef.current > 0) {
        charIndexRef.current--;
        setDisplayText(currentPhrase.slice(0, charIndexRef.current));
        timeoutRef.current = setTimeout(tick, config.deleteSpeed);
      } else {
        phraseIndexRef.current = (phraseIndexRef.current + 1) % phrases.length;

        if (!config.loop && phraseIndexRef.current === 0) {
          setDisplayText(phrases[phrases.length - 1]);
          return;
        }

        phaseRef.current = "typing";
        timeoutRef.current = setTimeout(tick, config.typeSpeed);
      }
    }
  }, [phrases, config.typeSpeed, config.deleteSpeed, config.pauseDuration, config.loop]);

  useEffect(() => {
    phaseRef.current = "typing";
    charIndexRef.current = 0;
    phraseIndexRef.current = 0;
    setDisplayText("");
    timeoutRef.current = setTimeout(tick, config.typeSpeed);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [tick, config.typeSpeed]);

  return displayText;
}
