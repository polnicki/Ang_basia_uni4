# Gra edukacyjna EN-PL (HTML)

Prosta gra do nauki slowek z dwoma trybami:
- Tryb 1: Angielski -> Polski
- Tryb 2: Polski -> Angielski

## Funkcje
- Poziomy: `easy=3`, `medium=4`, `hard=4` (liczba opcji odpowiedzi)
- Losowa liczba pytan `n` (zakres `1-50`, modyfikowalne)
- 10 sekund na pytanie
- Po czasie poprawna odpowiedz podswietla sie na zielono
- Punktacja
- Odczyt angielskiego slowka przez Web Speech API (w trybie EN->PL)

## Pliki
- `index.html` - interfejs
- `styles.css` - style
- `words.js` - baza slowek
- `app.js` - logika gry

## Uruchomienie
Wystarczy otworzyc `index.html` w przegladarce.

Mozesz tez uruchomic prosty serwer lokalny:

```powershell
Set-Location "G:\My Drive\Projekty\Ang_basia_uni4"
python -m http.server 8080
```

Nastepnie wejdz na: `http://localhost:8080`

