# PAN

Polska gra karciana dla 2–4 osób przy jednym wirtualnym stole. Responsywny interfejs,
wybór przeciwników, historia ruchów i tryb obserwowania rozgrywki botów.

## Przeciwnicy

- **Felek — losowy:** wybiera równomiernie spośród dozwolonych ruchów.
- **Bolek — zachłanny:** zagrywa najniższą dostępną kartę, w razie potrzeby dobiera.
- **Tosia — taktyczna:** ocenia niskie figury, możliwość serii i następnego gracza.
- **Bruno — płaskie Monte Carlo:** porównuje każdy ruch w 36 symulacjach z losowanymi
  nieznanymi rękami przeciwników.
- **Monte — MCTS:** 180 iteracji przeszukiwania drzewa z UCT, losowaniem nieznanych
  rąk w każdej iteracji i osobną oceną korzyści każdego gracza.
- **Ada — MaxN:** przeszukuje do 4 ruchów naprzód (limit 1400 węzłów na ruch
  początkowy). Każdy gracz maksymalizuje własną ocenę. **Zna wszystkie ręce** —
  to celowo jawny wariant eksperymentalny, zachowujący identyfikator `AZ`.

Ada i Tosia pamiętają do 96 znanych układów stołu. Po trzech powrotach do tego
samego układu próbują rzadziej wybieranego ruchu, ograniczając cykle dobierania
i ponownego zagrywania. Pamięć obejmuje wyłącznie własną rękę, publiczny stos
i liczby kart rywali. Nie gwarantuje to zakończenia każdej możliwej partii.

Symulacje nie zmieniają prawdziwej gry, nie uruchamiają timerów i przesuwają turę
wyłącznie przez wykonanie ruchu. Monte i Bruno zachowują znaną rękę i liczby kart
rywali; nie modelują pamięci wcześniejszych zagrań. Losowane ręce służą jako
przybliżenie niepełnej informacji. Przebiegi mają limit 100 ruchów, a ścieżka wyboru
MCTS dodatkowo 60. Gdy symulacja nie dobiegnie końca, ocena uwzględnia liczbę oraz
figury pozostałych kart (niskie figury ważą więcej). To heurystyki, a nie
skalibrowane prawdopodobieństwa wygranej ani potwierdzony ranking siły gry.

## Zasady tej wersji

Talia: 24 karty, 9–A. Zaczyna 9♥. Karta musi mieć figurę równą lub wyższą niż
wierzch stosu; zamiast zagrywać można dobrać do 3 wierzchnich kart, pozostawiając
9♥. Po zagraniu jednej z czterech kart tej samej figury można rozpocząć serię
pozostałych trzech; rozpoczętą serię trzeba dokończyć. Przy dwóch dziewiątkach na
stosie można uzupełnić serię pozostałą parą. Pik na wierzchu kieruje turę do
poprzedniego aktywnego fotela, a inny kolor do następnego. Gracze bez kart nie
uczestniczą już w turach; ostatni z kartami przegrywa.

## Development

See [DEVELOPMENT.md](DEVELOPMENT.md) for setup and validation.
The bundled DM Sans font uses the [SIL Open Font License](src/assets/fonts/OFL.txt).


## Language / Język

The browser version supports Polish and English. On the first visit it uses the
first supported language from the browser’s preferences, falling back to English.
The PL / EN selector saves an explicit choice in this application’s local storage.
Switching language preserves the current game. If storage is blocked, language switching
still works for the current visit.
