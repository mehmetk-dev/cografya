import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  BadgeCheck,
  BookOpenCheck,
  Brain,
  CalendarRange,
  Check,
  ChevronRight,
  CircleAlert,
  ExternalLink,
  GitBranch,
  Landmark,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  X,
} from "lucide-react";
import {
  HISTORY_TOPICS,
  buildChronologyRound,
  buildOutcomeQuestion,
  evaluateChronology,
  filterHistoryEvents,
  getHistoryEvent,
  loadHistoryProgress,
  saveHistoryProgress,
  type HistoryEvent,
  type HistoryProgress,
  type HistoryTopic,
} from "../historyStudy";

type HistoryMode = "timeline" | "chronology" | "outcome";

type HistoryStudyPageProps = {
  onBack: () => void;
};

function moveItem(items: string[], from: number, to: number) {
  if (to < 0 || to >= items.length) return items;
  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

function eventKindLabel(event: HistoryEvent) {
  switch (event.kind) {
    case "reform":
      return "Yenileşme";
    case "constitution":
      return "Anayasal gelişme";
    case "war":
      return "Savaş";
    case "treaty":
      return "Antlaşma";
    case "diplomacy":
      return "Diplomasi";
    default:
      return "Dönüm noktası";
  }
}

function HistoryEventDetail({
  event,
  previousEvent,
  nextEvent,
  onSelect,
}: {
  event: HistoryEvent;
  previousEvent?: HistoryEvent;
  nextEvent?: HistoryEvent;
  onSelect: (event: HistoryEvent) => void;
}) {
  return (
    <article className="history-detail">
      <header className="history-detail__header">
        <div>
          <span>{event.dateLabel}</span>
          <small>{eventKindLabel(event)}</small>
        </div>
        <div>
          <small>{event.eyebrow}</small>
          <h2>{event.title}</h2>
          <p>{event.summary}</p>
        </div>
      </header>

      <div className="history-causal-chain">
        <article>
          <span><CircleAlert size={18} /></span>
          <small>NEDEN</small>
          <p>{event.cause}</p>
        </article>
        <div aria-hidden="true"><ArrowRight size={19} /></div>
        <article className="history-causal-chain__event">
          <span><Landmark size={19} /></span>
          <small>OLAY</small>
          <strong>{event.title}</strong>
          <p>{event.dateLabel}</p>
        </article>
        <div aria-hidden="true"><ArrowRight size={19} /></div>
        <article>
          <span><BadgeCheck size={18} /></span>
          <small>SONUÇ</small>
          <p>{event.result}</p>
        </article>
      </div>

      <div className="history-detail__lower">
        <section>
          <header>
            <Users size={17} />
            <strong>Kişi ve taraflar</strong>
          </header>
          <div className="history-detail__actors">
            {event.actors.map((actor) => <span key={actor}>{actor}</span>)}
          </div>
        </section>
        <section className="history-exam-note">
          <header>
            <Target size={17} />
            <strong>KPSS ayırıcı</strong>
          </header>
          <p>{event.examNote}</p>
        </section>
      </div>

      <footer className="history-detail__footer">
        <div className="history-detail__pager">
          <button
            type="button"
            disabled={!previousEvent}
            onClick={() => previousEvent && onSelect(previousEvent)}
          >
            <ArrowLeft size={15} />
            <span>
              <small>Önceki</small>
              <strong>{previousEvent?.title ?? "Başlangıç"}</strong>
            </span>
          </button>
          <button
            type="button"
            disabled={!nextEvent}
            onClick={() => nextEvent && onSelect(nextEvent)}
          >
            <span>
              <small>Sonraki</small>
              <strong>{nextEvent?.title ?? "Zincir sonu"}</strong>
            </span>
            <ArrowRight size={15} />
          </button>
        </div>

        <a href={event.source.url} target="_blank" rel="noreferrer">
          <ShieldCheck size={16} />
          <span>
            <small>İÇERİK KAYNAĞI</small>
            <strong>MEB kaynağını aç</strong>
          </span>
          <ExternalLink size={14} />
        </a>
      </footer>
    </article>
  );
}

function ChronologyGame({
  topic,
  progress,
  onProgress,
}: {
  topic: HistoryTopic;
  progress: HistoryProgress;
  onProgress: (progress: HistoryProgress) => void;
}) {
  const [round, setRound] = useState(() => buildChronologyRound(topic));
  const [order, setOrder] = useState(() =>
    round.cards.map((event) => event.id),
  );
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);

  const newRound = () => {
    const nextRound = buildChronologyRound(topic);
    setRound(nextRound);
    setOrder(nextRound.cards.map((event) => event.id));
    setResult(null);
  };

  const check = () => {
    const correct = evaluateChronology(order, round.correctOrder);
    setResult(correct ? "correct" : "wrong");
    onProgress({
      ...progress,
      chronologyAttempts: progress.chronologyAttempts + 1,
      chronologyCorrect:
        progress.chronologyCorrect + (correct ? 1 : 0),
    });
  };

  return (
    <section className="history-game">
      <header className="history-game__hero">
        <span><CalendarRange size={25} /></span>
        <div>
          <small>KRONOLOJİ OYUNU</small>
          <h2>Olayları eskiden yeniye sırala</h2>
          <p>
            Tarihlere bakmadan önce olayların birbirini nasıl hazırladığını
            düşün. Oklarla kartların sırasını değiştir.
          </p>
        </div>
        <button type="button" onClick={newRound}>
          <RefreshCw size={15} /> Yeni tur
        </button>
      </header>

      <div className="history-sort-list">
        {order.map((eventId, index) => {
          const event = getHistoryEvent(eventId)!;
          return (
            <article key={event.id}>
              <span>{index + 1}</span>
              <div>
                <small>{eventKindLabel(event)}</small>
                <strong>{event.title}</strong>
                {result && <p>{event.dateLabel}</p>}
              </div>
              <div>
                <button
                  type="button"
                  aria-label={`${event.title} olayını yukarı taşı`}
                  disabled={index === 0}
                  onClick={() => {
                    setOrder((items) => moveItem(items, index, index - 1));
                    setResult(null);
                  }}
                >
                  <ArrowUp size={17} />
                </button>
                <button
                  type="button"
                  aria-label={`${event.title} olayını aşağı taşı`}
                  disabled={index === order.length - 1}
                  onClick={() => {
                    setOrder((items) => moveItem(items, index, index + 1));
                    setResult(null);
                  }}
                >
                  <ArrowDown size={17} />
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {result && (
        <div className={`history-game__feedback is-${result}`} role="status">
          {result === "correct" ? (
            <>
              <Check size={20} />
              <span>
                <strong>Zincir doğru kuruldu</strong>
                <small>Olayların kronolojik ilişkisini tamamladın.</small>
              </span>
            </>
          ) : (
            <>
              <CircleAlert size={20} />
              <span>
                <strong>Bu sırada kopukluk var</strong>
                <small>Tarihleri açtım; kartları yeniden düzenleyebilirsin.</small>
              </span>
            </>
          )}
        </div>
      )}

      <button
        className="history-game__check"
        type="button"
        onClick={check}
      >
        <GitBranch size={17} /> Sıralamayı kontrol et
      </button>
    </section>
  );
}

function OutcomeGame({
  topic,
  progress,
  onProgress,
}: {
  topic: HistoryTopic;
  progress: HistoryProgress;
  onProgress: (progress: HistoryProgress) => void;
}) {
  const createQuestion = () => {
    const event =
      topic.events[Math.floor(Math.random() * topic.events.length)] ??
      topic.events[0];
    return buildOutcomeQuestion(event.id);
  };
  const [question, setQuestion] = useState(createQuestion);
  const [selected, setSelected] = useState("");

  if (!question) return null;
  const answered = Boolean(selected);
  const correct = selected === question.correctAnswer;
  const event = getHistoryEvent(question.eventId)!;

  const answer = (choice: string) => {
    if (answered) return;
    setSelected(choice);
    const isCorrect = choice === question.correctAnswer;
    onProgress({
      ...progress,
      outcomeAttempts: progress.outcomeAttempts + 1,
      outcomeCorrect: progress.outcomeCorrect + (isCorrect ? 1 : 0),
    });
  };

  const nextQuestion = () => {
    setQuestion(createQuestion());
    setSelected("");
  };

  return (
    <section className="history-outcome-game">
      <header>
        <span><Brain size={25} /></span>
        <div>
          <small>NEDEN–SONUÇ TURU</small>
          <h2>Bağlantıyı bul</h2>
          <p>Ezberlediğin tarihi değil, olayın neyi değiştirdiğini seç.</p>
        </div>
      </header>

      <article className="history-question">
        <div>
          <small>{event.dateLabel} · {eventKindLabel(event)}</small>
          <h3>{question.prompt}</h3>
        </div>
        <div className="history-question__choices">
          {question.choices.map((choice, index) => {
            const isCorrectChoice = choice === question.correctAnswer;
            const isSelected = choice === selected;
            const className = answered
              ? isCorrectChoice
                ? "is-correct"
                : isSelected
                  ? "is-wrong"
                  : ""
              : "";
            return (
              <button
                className={className}
                key={choice}
                type="button"
                disabled={answered}
                onClick={() => answer(choice)}
              >
                <span>{String.fromCharCode(65 + index)}</span>
                <p>{choice}</p>
                {answered && isCorrectChoice && <Check size={17} />}
              </button>
            );
          })}
        </div>

        {answered && (
          <div
            className={`history-question__explanation ${
              correct ? "is-correct" : "is-wrong"
            }`}
          >
            {correct ? <BadgeCheck size={21} /> : <CircleAlert size={21} />}
            <div>
              <strong>{correct ? "Doğru bağlantı" : "Doğru sonucu incele"}</strong>
              <p>{event.examNote}</p>
            </div>
            <button type="button" onClick={nextQuestion}>
              Sonraki <ArrowRight size={15} />
            </button>
          </div>
        )}
      </article>
    </section>
  );
}

export function HistoryStudyPage({ onBack }: HistoryStudyPageProps) {
  const [activeTopicId, setActiveTopicId] = useState(HISTORY_TOPICS[0].id);
  const activeTopic =
    HISTORY_TOPICS.find((topic) => topic.id === activeTopicId) ??
    HISTORY_TOPICS[0];
  const [selectedEventId, setSelectedEventId] = useState(
    HISTORY_TOPICS[0].events[0].id,
  );
  const [mode, setMode] = useState<HistoryMode>("timeline");
  const [query, setQuery] = useState("");
  const [progress, setProgress] = useState(loadHistoryProgress);

  const searchResults = useMemo(
    () => filterHistoryEvents(HISTORY_TOPICS, query),
    [query],
  );
  const selectedEvent =
    getHistoryEvent(selectedEventId) ?? activeTopic.events[0];
  const selectedIndex = activeTopic.events.findIndex(
    (event) => event.id === selectedEvent.id,
  );
  const visitedInTopic = activeTopic.events.filter((event) =>
    progress.visitedEventIds.includes(event.id),
  ).length;
  const successAttempts =
    progress.chronologyAttempts + progress.outcomeAttempts;
  const successCorrect =
    progress.chronologyCorrect + progress.outcomeCorrect;
  const successPercent = successAttempts
    ? Math.round((successCorrect / successAttempts) * 100)
    : 0;

  const updateProgress = (next: HistoryProgress) => {
    setProgress(saveHistoryProgress(next));
  };

  const selectEvent = (event: HistoryEvent) => {
    const topic = HISTORY_TOPICS.find((entry) => entry.id === event.topicId);
    if (topic && topic.id !== activeTopicId) setActiveTopicId(topic.id);
    setSelectedEventId(event.id);
    setMode("timeline");
    setQuery("");

    if (!progress.visitedEventIds.includes(event.id)) {
      updateProgress({
        ...progress,
        visitedEventIds: [...progress.visitedEventIds, event.id],
      });
    }

    window.requestAnimationFrame(() => {
      document
        .querySelector("#history-detail")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const selectTopic = (topic: HistoryTopic) => {
    setActiveTopicId(topic.id);
    setSelectedEventId(topic.events[0].id);
    setMode("timeline");
    setQuery("");
  };

  return (
    <div className="history-page">
      <header className="history-topbar">
        <button
          className="history-topbar__back"
          type="button"
          onClick={onBack}
        >
          <ArrowLeft size={17} />
          <span>Coğrafyaya dön</span>
        </button>

        <div className="history-topbar__brand">
          <span><GitBranch size={20} /></span>
          <div>
            <small>KPSS ATLASIM</small>
            <strong>Tarih Zinciri</strong>
          </div>
        </div>

        <div className="history-topbar__source">
          <ShieldCheck size={16} />
          <span>
            <strong>Yalnızca MEB kaynakları</strong>
            <small>Her olay kaynak bağlantılı</small>
          </span>
        </div>
      </header>

      <div className="history-layout">
        <aside className="history-sidebar">
          <header>
            <small>DERS KÜTÜPHANESİ</small>
            <h1>Tarih rotan</h1>
            <p>Olayı oku, nedenini bağla, kronolojiyi kendin kur.</p>
          </header>

          <label className="history-search">
            <Search size={16} />
            <input
              value={query}
              placeholder="Olay, kişi veya antlaşma ara..."
              onChange={(event) => setQuery(event.target.value)}
            />
            {query && (
              <button
                type="button"
                aria-label="Aramayı temizle"
                onClick={() => setQuery("")}
              >
                <X size={14} />
              </button>
            )}
          </label>

          {query ? (
            <div className="history-search-results">
              <small>{searchResults.length} sonuç</small>
              {searchResults.map((event) => (
                <button
                  key={event.id}
                  type="button"
                  onClick={() => selectEvent(event)}
                >
                  <span>{event.dateLabel}</span>
                  <strong>{event.title}</strong>
                  <ChevronRight size={14} />
                </button>
              ))}
              {searchResults.length === 0 && (
                <div>
                  <Search size={20} />
                  <strong>Sonuç bulunamadı</strong>
                  <span>Başka bir kişi veya olay dene.</span>
                </div>
              )}
            </div>
          ) : (
            <div className="history-topic-list">
              {HISTORY_TOPICS.map((topic, index) => {
                const active = topic.id === activeTopic.id;
                const visited = topic.events.filter((event) =>
                  progress.visitedEventIds.includes(event.id),
                ).length;
                return (
                  <button
                    className={active ? "is-active" : ""}
                    key={topic.id}
                    type="button"
                    style={{ "--topic-color": topic.color } as React.CSSProperties}
                    onClick={() => selectTopic(topic)}
                  >
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <small>{topic.period}</small>
                      <strong>{topic.title}</strong>
                      <p>{visited} / {topic.events.length} olay incelendi</p>
                    </div>
                    <ChevronRight size={15} />
                  </button>
                );
              })}
            </div>
          )}

          <section className="history-sidebar__progress">
            <header>
              <Sparkles size={17} />
              <div>
                <small>ÇALIŞMA DURUMU</small>
                <strong>Zincir ilerlemen</strong>
              </div>
            </header>
            <div>
              <span>
                <strong>{progress.visitedEventIds.length}</strong>
                <small>incelenen olay</small>
              </span>
              <span>
                <strong>%{successPercent}</strong>
                <small>oyun başarısı</small>
              </span>
            </div>
          </section>
        </aside>

        <main className="history-content">
          <section
            className="history-hero"
            style={{ "--topic-color": activeTopic.color } as React.CSSProperties}
          >
            <div className="history-hero__copy">
              <small>{activeTopic.period} · MEBİ TARİH</small>
              <h1>{activeTopic.title}</h1>
              <p>{activeTopic.description}</p>
              <div>
                <span><CalendarRange size={15} /> {activeTopic.events.length} olay</span>
                <span><GitBranch size={15} /> neden–sonuç zinciri</span>
                <span><ShieldCheck size={15} /> resmî kaynak</span>
              </div>
            </div>
            <div className="history-hero__progress">
              <span>
                <b style={{
                  width: `${Math.round(
                    (visitedInTopic / activeTopic.events.length) * 100,
                  )}%`,
                }} />
              </span>
              <strong>{visitedInTopic} / {activeTopic.events.length}</strong>
              <small>olay incelendi</small>
            </div>
          </section>

          <nav className="history-mode-tabs" aria-label="Tarih çalışma biçimi">
            <button
              className={mode === "timeline" ? "is-active" : ""}
              type="button"
              onClick={() => setMode("timeline")}
            >
              <GitBranch size={17} />
              <span>
                <strong>Zaman zinciri</strong>
                <small>Olayları bağlayarak öğren</small>
              </span>
            </button>
            <button
              className={mode === "chronology" ? "is-active" : ""}
              type="button"
              onClick={() => setMode("chronology")}
            >
              <CalendarRange size={17} />
              <span>
                <strong>Kronoloji oyunu</strong>
                <small>Kartları doğru sıraya koy</small>
              </span>
            </button>
            <button
              className={mode === "outcome" ? "is-active" : ""}
              type="button"
              onClick={() => setMode("outcome")}
            >
              <Brain size={17} />
              <span>
                <strong>Bağlantıyı bul</strong>
                <small>Neden ve sonucu ayırt et</small>
              </span>
            </button>
          </nav>

          {mode === "timeline" && (
            <>
              <section className="history-timeline" aria-label="Tarih olayları">
                <header>
                  <div>
                    <small>ZAMAN OMURGASI</small>
                    <h2>Bir olay, sonrakinin zeminini hazırlar</h2>
                  </div>
                  <span>{activeTopic.events.length} bağlantı</span>
                </header>
                <div className="history-timeline__rail">
                  {activeTopic.events.map((event, index) => {
                    const active = event.id === selectedEvent.id;
                    const visited = progress.visitedEventIds.includes(event.id);
                    return (
                      <button
                        className={`${active ? "is-active" : ""} ${
                          visited ? "is-visited" : ""
                        }`}
                        key={event.id}
                        type="button"
                        onClick={() => selectEvent(event)}
                      >
                        <span className="history-timeline__date">
                          {event.dateLabel}
                        </span>
                        <i>
                          {visited ? <Check size={13} /> : index + 1}
                        </i>
                        <span className="history-timeline__copy">
                          <small>{event.eyebrow}</small>
                          <strong>{event.title}</strong>
                          <p>{event.summary}</p>
                        </span>
                        <ChevronRight size={16} />
                      </button>
                    );
                  })}
                </div>
              </section>

              <div id="history-detail">
                <HistoryEventDetail
                  event={selectedEvent}
                  previousEvent={
                    selectedIndex > 0
                      ? activeTopic.events[selectedIndex - 1]
                      : undefined
                  }
                  nextEvent={
                    selectedIndex < activeTopic.events.length - 1
                      ? activeTopic.events[selectedIndex + 1]
                      : undefined
                  }
                  onSelect={selectEvent}
                />
              </div>
            </>
          )}

          {mode === "chronology" && (
            <ChronologyGame
              key={`chronology-${activeTopic.id}`}
              topic={activeTopic}
              progress={progress}
              onProgress={updateProgress}
            />
          )}

          {mode === "outcome" && (
            <OutcomeGame
              key={`outcome-${activeTopic.id}`}
              topic={activeTopic}
              progress={progress}
              onProgress={updateProgress}
            />
          )}

          <footer className="history-content__footer">
            <BookOpenCheck size={18} />
            <span>
              <strong>İçerik ilkesi</strong>
              <small>
                Bu bölümdeki olay özetleri yalnızca MEB ve MEBİ materyallerinden
                hazırlanmıştır. Harici blog veya dershane kaynağı kullanılmaz.
              </small>
            </span>
          </footer>
        </main>
      </div>
    </div>
  );
}
