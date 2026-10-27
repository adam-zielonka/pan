import { readable, derived } from 'svelte/store'
const translations: Record<string, string> = {
  'PAN — Twój stolik, Twoja strategia': 'PAN — your table, your strategy',
  'PAN — klasyczna gra karciana. Wybierz przeciwników, poznaj ich strategie i zagraj przy swoim stole.':
    'PAN — a classic card game. Choose your opponents, discover their strategies and join the table.',
  'PAN — strona główna': 'PAN home',
  'KLASYCZNIE. PO SWOJEMU.': 'A CLASSIC. YOUR WAY.',
  'Widok aplikacji': 'Application view',
  'Stół do gry': 'Game table',
  'Poznaj graczy': 'Meet the players',
  'Zasady gry': 'Game rules',
  'MAŁA TALIA. WIELE MOŻLIWOŚCI.': 'SMALL DECK. MANY POSSIBILITIES.',
  'Usiądź przy stole.': 'Take a seat.',
  'Każdy gra po swojemu.': 'Everyone plays their own way.',
  'Ty, 24 karty i przeciwnicy z charakterem.':
    'You, 24 cards and opponents with character.',
  'Sześć strategii. Sześć osobowości. Wybierz swoje towarzystwo.':
    'Six strategies. Six personalities. Choose your company.',
  'Nowe rozdanie': 'New deal',
  'Jak grać w Pana?': 'How do you play Pan?',
  'Zamknij zasady': 'Close rules',
  '01 · Zacznij od dziewiątki': '01 · Start with the nine',
  'Talia ma 24 karty, od 9 do asa. Rozpoczyna osoba z 9♥, wykładając ją na stół.':
    'The deck has 24 cards, from nine to ace. The player holding 9♥ starts by placing it on the table.',
  '02 · Równo lub wyżej': '02 · Equal or higher',
  'Zagraj kartę o tej samej lub wyższej figurze. Możesz też dobrać do 3 kart ze stosu — 9♥ zostaje na stole.':
    'Play a card of the same or a higher rank. You can also take up to 3 cards from the pile — 9♥ stays on the table.',
  '03 · Wykorzystaj serię': '03 · Use a combo',
  'Po zagraniu karty możesz dołożyć trzy pozostałe tej samej figury. Rozpoczętą serię trzeba dokończyć. Dla dziewiątek działa też uzupełnienie parą przy dwóch kartach na stosie.':
    'After playing a card, you can add the other three of the same rank. Once started, a combo must be completed. For nines, you can also add a pair when the pile has two cards.',
  '04 · Nie zostań ostatni': '04 · Don’t be last',
  'Pik na wierzchu oddaje ruch w lewo, pozostałe kolory w prawo. Gracze bez kart odpadają. Ostatnia osoba z kartami przegrywa.':
    'A spade on top passes the turn to the left; other suits pass it to the right. Players with no cards leave the game. The last player holding cards loses.',
  'Strategie przeciwników': 'Opponent strategies',
  'NOWY PRZY STOLE': 'NEW AT THE TABLE',
  'STAŁY BYWALEC': 'A REGULAR',
  'Algorytmy są eksperymentalne. Opisy mówią, jak wybierają ruchy — nie są rankingiem siły gry. Symulacje mają ograniczoną liczbę kroków, a niedokończone partie oceniają na podstawie kart pozostałych w ręce.':
    'The algorithms are experimental. These descriptions explain how they choose moves; they are not a ranking of playing strength. Simulations have a limited number of steps and evaluate unfinished games using the cards left in each hand.',
  'Bez pośpiechu. Dobra partia zaczyna się od dobrego ruchu.':
    'Take your time. A good game starts with a good move.',
  'Przy Twoim stole': 'At your table',
  'Dobierz przeciwników do swojego stylu.': 'Choose opponents to suit your style.',
  'Tempo gry': 'Game pace',
  Spokojne: 'Relaxed',
  Normalne: 'Normal',
  Szybkie: 'Fast',
  'Wybierz co najmniej dwóch graczy.': 'Choose at least two players.',
  'Nowy skład czeka. Kliknij „Nowe rozdanie”, aby nim zagrać.':
    'Your new line-up is ready. Click “New deal” to play with it.',
  'Zmiany składu zadziałają od nowego rozdania.':
    'Line-up changes apply from the next deal.',
  'Ostatnie ruchy': 'Recent moves',
  'Historia ruchów': 'Move history',
  'Karty rozdane. Czas na pierwszy ruch.': 'Cards dealt. Time for the first move.',
  'Mała karta, duża różnica.': 'Small card, big difference.',
  'Niskich figur trudniej pozbyć się pod koniec. Czasem warto zagrać je od razu.':
    'Low cards are harder to get rid of towards the end. Sometimes it pays to play them early.',
  'Klasyczna gra. Nowi przeciwnicy.': 'Classic game. New opponents.',
  'Stworzone dla przyjemności gry.': 'Made for the joy of playing.',
  Ty: 'You',
  Gracz: 'Player',
  TY: 'YOU',
  'Twoje karty': 'Your cards',
  'Twój fotel przy stole. Podświetlone karty możesz teraz zagrać.':
    'Your seat at the table. You can play the highlighted cards now.',
  'Wolne miejsce': 'Empty seat',
  'Bez gracza': 'No player',
  'Nie gra': 'Not playing',
  'Wyłącz ten fotel. Do rozdania potrzeba co najmniej dwóch graczy.':
    'Leave this seat empty. At least two players are needed for a deal.',
  Losowy: 'Random',
  'Bez podglądania': 'No peeking',
  'Zdaje się na los: każdy dozwolony ruch ma taką samą szansę. Dobry punkt odniesienia.':
    'Leaves it to chance: every legal move is equally likely. A useful baseline.',
  Zachłanny: 'Greedy',
  'Zagrywa najniższą dozwoloną kartę. Wysokie figury zachowuje na później.':
    'Plays the lowest legal card and saves higher ranks for later.',
  'Drzewo Monte Carlo': 'Monte Carlo tree',
  'Losuje nieznane ręce': 'Samples unknown hands',
  'Rozbudowuje drzewo ruchów metodą UCT. W 180 próbach losuje możliwe ręce rywali i symuluje dalszą grę.':
    'Builds a move tree using UCT. Across 180 trials, samples possible opponent hands and simulates how the game continues.',
  'MaxN · 4 ruchy': 'MaxN · 4 moves',
  'Zna wszystkie ręce': 'Knows all hands',
  'Analizuje do 4 ruchów naprzód, zakładając, że każdy gra na swoją korzyść. Unika powtarzania ruchów. Wariant eksperymentalny z pełną wiedzą o kartach.':
    'Looks up to 4 moves ahead, assuming each player acts in their own interest. Avoids repeating moves. An experimental variant with full knowledge of all cards.',
  Taktyczna: 'Tactical',
  'Pozbywa się niskich kart, premiuje serie i dobiera kierunek po piku do liczby kart następnego gracza. Przy powtarzającym się układzie próbuje innego ruchu.':
    'Sheds low cards, favours combos and chooses the direction after a spade based on the next player’s card count. Tries a different move when a position repeats.',
  'Symulacje Monte Carlo': 'Monte Carlo simulations',
  'Porównuje ruchy w 36 symulacjach na każdy ruch. Za każdym razem losuje możliwe karty przeciwników.':
    'Compares moves using 36 simulations per move, sampling possible opponent cards each time.',
  'Rozdajemy karty…': 'Dealing cards…',
  'Zostajesz z kartami': 'You are left holding cards',
  '{name} zostaje z kartami': '{name} is left holding cards',
  'Koniec rozdania · {result}': 'Deal over · {result}',
  'Możesz zagrać serię': 'You can play a combo',
  'Twój ruch': 'Your turn',
  '{name} wybiera ruch…': '{name} is choosing a move…',
  ROZDANIE: 'DEAL',
  'Pokaż karty rywali': 'Show opponents’ cards',
  'KLASYCZNA GRA KARCIANA': 'CLASSIC CARD GAME',
  'Poza grą ✓': 'Finished ✓',
  'Pik · ruch w lewo': 'Spade · turn passes left',
  'Ruch w prawo': 'Turn passes right',
  'Zagraj tę samą figurę': 'Play the same rank',
  'Wybierz podświetloną kartę': 'Choose a highlighted card',
  Ruch: 'Move',
  'TWOJA RĘKA': 'YOUR HAND',
  '{name} · OBSERWUJESZ GRĘ': '{name} · WATCHING THE GAME',
  '{count} kart': 'Cards: {count}',
  'Za chwilę dostaniesz karty.': 'Your cards will arrive shortly.',
  'Wszystkie karty zagrane. Dobra robota! ♡': 'All cards played. Well done! ♡',
  'Rozdaj ponownie, by zagrać jeszcze raz.': 'Deal again to play another game.',
  'Pozbądź się kart. Ostatni przy stole przegrywa.':
    'Get rid of your cards. The last player at the table loses.',
  'Pomiń serię': 'Skip combo',
  'Dobierz {count} ze stosu': 'Take {count} from the pile',
  FOTEL: 'SEAT',
  '· TWÓJ': ' · YOURS',
  'Stos: {count} kart': 'Pile: {count} cards',
  'Tu zaczyna się gra': 'The game starts here',
  '{count} kart na stole': 'Cards on the table: {count}',
  'Czekamy na 9♥': 'Waiting for 9♥',
  'Zakryta karta': 'Face-down card',
  '— zagraj': ' — play',
  'pasuje serię': 'skips combo',
  'dobiera {count}': 'takes {count}',
}
const PAGE_TITLE = 'PAN — Twój stolik, Twoja strategia'
const PAGE_DESCRIPTION =
  'PAN — klasyczna gra karciana. Wybierz przeciwników, poznaj ich strategie i zagraj przy swoim stole.'
export type Language = 'pl' | 'en'
const storageKey = 'pan-language'
export function detectLanguage(
  saved: string | null,
  languages: readonly string[],
): Language {
  if (saved === 'pl' || saved === 'en') return saved
  for (const language of languages) {
    const code = language.toLowerCase().split(/[-_]/)[0]
    if (code === 'pl' || code === 'en') return code
  }
  return 'en'
}
function initialLanguage(): Language {
  let saved: string | null = null
  try {
    saved = localStorage.getItem(storageKey)
  } catch {
    /* Storage may be blocked. */
  }
  return detectLanguage(
    saved,
    typeof navigator === 'undefined'
      ? []
      : navigator.languages?.length
        ? navigator.languages
        : [navigator.language],
  )
}
export let language = initialLanguage()
const listeners = new Set<() => void>()
export function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}
export function setLanguage(value: Language) {
  language = value
  try {
    localStorage.setItem(storageKey, value)
  } catch {
    /* Switching still works without persistence. */
  }
  updateDocument()
  listeners.forEach(listener => listener())
}
export function t(source: string, values: Record<string, string | number> = {}): string {
  if (language === 'en' && /^dobiera \d+$/.test(source))
    return t('dobiera {count}', { count: source.split(' ')[1] })
  const key = source.replace(/\s+/g, ' ').trim()
  const translated = language === 'en' ? (translations[key] ?? source) : source
  return translated.replace(/\{(\w+)\}/g, (match, key: string) =>
    String(values[key] ?? match),
  )
}
function updateDocument() {
  if (typeof document === 'undefined') return
  document.documentElement.lang = language
  document.title = t(PAGE_TITLE)
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute('content', t(PAGE_DESCRIPTION))
}
updateDocument()

export const locale = readable(language, set => subscribe(() => set(language)))
export const tr = derived(
  locale,
  () => (source: string, values?: Record<string, string | number>) => t(source, values),
)
