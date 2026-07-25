import { useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Brain,
  CloudSun,
  Compass,
  ExternalLink,
  Globe2,
  Layers3,
  Map,
  Mountain,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { STUDY_NOTE_TOPICS } from "../studyNotes";
import { FlashcardStudy } from "./FlashcardStudy";

const SELECTED_TOPIC_KEY = "cografya-atlasim-selected-note-topic";
const READY_NOTE_TOPICS = STUDY_NOTE_TOPICS.filter(
  (topic) => topic.status === "ready",
);
const TOTAL_SECTION_COUNT = READY_NOTE_TOPICS.reduce(
  (count, topic) => count + topic.sections.length,
  0,
);

function TopicIcon({ topicId, size = 22 }: { topicId: string; size?: number }) {
  if (topicId === "earth-movements") return <Globe2 size={size} />;
  if (topicId === "latitude-longitude") return <Compass size={size} />;
  if (topicId === "map-knowledge") return <Map size={size} />;
  if (topicId === "climate-knowledge") return <CloudSun size={size} />;
  if (topicId === "landforms") return <Layers3 size={size} />;
  if (topicId === "mountains" || topicId === "plains-plateaus") {
    return <Mountain size={size} />;
  }
  return <BookOpen size={size} />;
}

type StudyNotesPageProps = {
  onBack: () => void;
  onOpenStudyCenter: () => void;
};

export function StudyNotesPage({
  onBack,
  onOpenStudyCenter,
}: StudyNotesPageProps) {
  const [query, setQuery] = useState("");
  const [flashcardOpen, setFlashcardOpen] = useState(false);
  const [selectedTopicId, setSelectedTopicId] = useState(() => {
    const storedTopicId = localStorage.getItem(SELECTED_TOPIC_KEY);
    return READY_NOTE_TOPICS.some((topic) => topic.id === storedTopicId)
      ? storedTopicId!
      : READY_NOTE_TOPICS[0]?.id ?? "";
  });
  const contentRef = useRef<HTMLElement>(null);

  const filteredTopics = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("tr-TR");
    if (!normalizedQuery) return READY_NOTE_TOPICS;

    return READY_NOTE_TOPICS.filter((topic) =>
      [
        topic.title,
        topic.subject,
        topic.description,
        ...topic.quickFacts,
      ]
        .join(" ")
        .toLocaleLowerCase("tr-TR")
        .includes(normalizedQuery),
    );
  }, [query]);

  const selectedTopic =
    READY_NOTE_TOPICS.find((topic) => topic.id === selectedTopicId) ??
    READY_NOTE_TOPICS[0];
  const selectedTopicIndex = READY_NOTE_TOPICS.findIndex(
    (topic) => topic.id === selectedTopic?.id,
  );
  const previousTopic =
    selectedTopicIndex > 0 ? READY_NOTE_TOPICS[selectedTopicIndex - 1] : null;
  const nextTopic =
    selectedTopicIndex < READY_NOTE_TOPICS.length - 1
      ? READY_NOTE_TOPICS[selectedTopicIndex + 1]
      : null;

  const selectTopic = (topicId: string, scrollToContent = true) => {
    setFlashcardOpen(false);
    setSelectedTopicId(topicId);
    localStorage.setItem(SELECTED_TOPIC_KEY, topicId);

    if (scrollToContent) {
      window.requestAnimationFrame(() => {
        contentRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    }
  };

  if (!selectedTopic) return null;

  return (
    <div className="study-page">
      <header className="study-page__topbar">
        <button
          className="study-page__back"
          type="button"
          onClick={onBack}
        >
          <ArrowLeft size={18} />
          <span>Haritaya dön</span>
        </button>

        <div className="study-page__brand">
          <span><BookOpen size={20} /></span>
          <div>
            <small>MEB / KPSS</small>
            <strong>Coğrafya Konu Notları</strong>
          </div>
        </div>

        <button
          className="study-page__center-button"
          type="button"
          onClick={onOpenStudyCenter}
        >
          <Brain size={17} />
          <span>Çalışma merkezi</span>
        </button>
      </header>

      <div className="study-page__layout">
        <aside className="study-page__sidebar">
          <div className="study-page__sidebar-heading">
            <div>
              <small>KONU KÜTÜPHANESİ</small>
              <h1>Ders notların</h1>
            </div>
            <span>{READY_NOTE_TOPICS.length}</span>
          </div>

          <label className="study-page__search">
            <Search size={16} />
            <input
              value={query}
              placeholder="Konu ara..."
              onChange={(event) => setQuery(event.target.value)}
            />
            {query && (
              <button
                type="button"
                aria-label="Konu aramasını temizle"
                onClick={() => setQuery("")}
              >
                <X size={14} />
              </button>
            )}
          </label>

          <div className="study-page__topic-list" aria-label="Konu seç">
            {filteredTopics.map((topic) => {
              const topicIndex = READY_NOTE_TOPICS.findIndex(
                (entry) => entry.id === topic.id,
              );
              const active = topic.id === selectedTopic.id;

              return (
                <button
                  className={active ? "is-active" : ""}
                  key={topic.id}
                  type="button"
                  aria-current={active ? "page" : undefined}
                  onClick={() => selectTopic(topic.id)}
                >
                  <span className="study-page__topic-number">
                    {String(topicIndex + 1).padStart(2, "0")}
                  </span>
                  <span className="study-page__topic-copy">
                    <strong>{topic.title}</strong>
                    <small>{topic.sections.length} bölüm · {topic.subject}</small>
                  </span>
                  <ArrowRight size={15} />
                </button>
              );
            })}

            {filteredTopics.length === 0 && (
              <div className="study-page__empty-search">
                <Search size={20} />
                <strong>Konu bulunamadı</strong>
                <span>Başka bir kelime deneyebilirsin.</span>
              </div>
            )}
          </div>

          <div className="study-page__library-stat">
            <Sparkles size={17} />
            <span>
              <strong>{TOTAL_SECTION_COUNT} kısa bölüm</strong>
              <small>Önemli bilgiler ve KPSS ayırıcı notlar</small>
            </span>
          </div>
        </aside>

        <main className="study-page__content" ref={contentRef}>
          {flashcardOpen ? (
            <FlashcardStudy
              topics={READY_NOTE_TOPICS}
              initialTopicId={selectedTopic.id}
              onClose={() => setFlashcardOpen(false)}
            />
          ) : (
            <>
          <header className="study-page__hero">
            <div className="study-page__hero-icon">
              <TopicIcon topicId={selectedTopic.id} size={29} />
            </div>
            <div className="study-page__hero-copy">
              <small>{selectedTopic.subject}</small>
              <h2>{selectedTopic.title}</h2>
              <p>{selectedTopic.description}</p>
              <div>
                <span>{String(selectedTopicIndex + 1).padStart(2, "0")} / {READY_NOTE_TOPICS.length}</span>
                <span>{selectedTopic.sections.length} bölüm</span>
                <span>Resmî MEB kaynaklı</span>
              </div>
            </div>
            <div className="study-page__hero-mark" aria-hidden="true">
              {String(selectedTopicIndex + 1).padStart(2, "0")}
            </div>
          </header>

          <section className="study-page__quick">
            <header>
              <span><Sparkles size={17} /></span>
              <div>
                <small>HIZLI TEKRAR</small>
                <h3>60 saniyede konunun özü</h3>
              </div>
              <button
                className="study-page__flashcard-button"
                type="button"
                onClick={() => setFlashcardOpen(true)}
              >
                <Brain size={16} />
                Kartlarla çalış
              </button>
            </header>
            <div>
              {selectedTopic.quickFacts.map((fact, index) => (
                <article key={fact}>
                  <span>{index + 1}</span>
                  <p>{fact}</p>
                </article>
              ))}
            </div>
          </section>

          <div className="study-page__section-list">
            {selectedTopic.sections.map((section, index) => (
              <article className="study-page__section" key={section.id}>
                <header>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <small>{section.eyebrow}</small>
                    <h3>{section.title}</h3>
                  </div>
                </header>

                <div className="study-page__section-body">
                  <p className="study-page__section-summary">{section.summary}</p>

                  {section.bullets && (
                    <ul className="study-page__bullet-list">
                      {section.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  )}

                  {section.groups && (
                    <div className="study-page__groups">
                      {section.groups.map((group) => (
                        <article key={group.title}>
                          <strong>{group.title}</strong>
                          <ul>
                            {group.items.map((entry) => (
                              <li key={entry}>{entry}</li>
                            ))}
                          </ul>
                        </article>
                      ))}
                    </div>
                  )}

                  {section.examNote && (
                    <aside className="study-page__exam-note">
                      <span>KPSS</span>
                      <div>
                        <strong>Sınavda ayıran bilgi</strong>
                        <p>{section.examNote}</p>
                      </div>
                    </aside>
                  )}
                </div>
              </article>
            ))}
          </div>

          <section className="study-page__sources">
            <header>
              <BookOpen size={18} />
              <div>
                <small>KAYNAKÇA</small>
                <h3>Resmî MEB kaynakları</h3>
              </div>
            </header>
            <div>
              {selectedTopic.sources.map((source) => (
                <a
                  href={source.url}
                  key={`${source.label}-${source.detail}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>
                    <strong>{source.label}</strong>
                    <small>{source.detail}</small>
                  </span>
                  <ExternalLink size={15} />
                </a>
              ))}
            </div>
          </section>

          <nav className="study-page__pager" aria-label="Konu sayfaları">
            {previousTopic ? (
              <button
                type="button"
                onClick={() => selectTopic(previousTopic.id)}
              >
                <ArrowLeft size={17} />
                <span>
                  <small>ÖNCEKİ KONU</small>
                  <strong>{previousTopic.title}</strong>
                </span>
              </button>
            ) : (
              <span />
            )}

            {nextTopic && (
              <button
                className="study-page__pager-next"
                type="button"
                onClick={() => selectTopic(nextTopic.id)}
              >
                <span>
                  <small>SONRAKİ KONU</small>
                  <strong>{nextTopic.title}</strong>
                </span>
                <ArrowRight size={17} />
              </button>
            )}
          </nav>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
