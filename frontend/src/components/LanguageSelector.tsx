import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, ChevronDown, Check } from "lucide-react";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import { ScrollArea } from "@/components/ui/scroll-area";

interface LanguageSelectorProps {
  variant?: "navbar" | "footer";
}

export function LanguageSelector({ variant = "navbar" }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { currentLanguage, setLanguage, languages, t } = useLanguage();

  const handleSelect = (lang: Language) => {
    setLanguage(lang);
    setIsOpen(false);
  };

  if (variant === "footer") {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border/50 hover:border-primary/50 transition-colors bg-card/50 backdrop-blur-sm"
        >
          <Globe className="w-4 h-4" />
          <span className="text-sm">{currentLanguage.flag} {currentLanguage.nativeName}</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsOpen(false)} 
              />
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-full left-0 mb-2 w-64 bg-popover border border-border rounded-xl shadow-xl z-50 overflow-hidden"
              >
                <div className="p-2 border-b border-border">
                  <p className="text-xs text-muted-foreground font-medium px-2">{t("footer.language")}</p>
                </div>
                <ScrollArea className="h-80">
                  <div className="p-2 grid grid-cols-1 gap-1">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleSelect(lang)}
                        className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-left transition-colors ${
                          currentLanguage.code === lang.code
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-muted"
                        }`}
                      >
                        <span className="text-lg">{lang.flag}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{lang.nativeName}</p>
                          <p className="text-xs text-muted-foreground truncate">{lang.name}</p>
                        </div>
                        {currentLanguage.code === lang.code && (
                          <Check className="w-4 h-4 text-primary flex-shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-full hover:bg-muted transition-colors"
        aria-label="Select language"
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium hidden sm:inline">{currentLanguage.flag}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)} 
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full right-0 mt-2 w-72 bg-popover border border-border rounded-xl shadow-xl z-50 overflow-hidden"
            >
              <div className="p-3 border-b border-border bg-muted/50">
                <p className="text-sm font-semibold">{t("footer.language")}</p>
                <p className="text-xs text-muted-foreground">Choose your preferred language</p>
              </div>
              <ScrollArea className="h-80">
                <div className="p-2 grid grid-cols-2 gap-1">
                  {languages.map((lang) => (
                    <motion.button
                      key={lang.code}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelect(lang)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-left transition-colors ${
                        currentLanguage.code === lang.code
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      }`}
                    >
                      <span className="text-base">{lang.flag}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{lang.nativeName}</p>
                      </div>
                      {currentLanguage.code === lang.code && (
                        <Check className="w-3 h-3 flex-shrink-0" />
                      )}
                    </motion.button>
                  ))}
                </div>
              </ScrollArea>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
