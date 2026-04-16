const RAW_WORDS = `
bookmark a website, dodac strone do zakladek;
code/write code, kodowac/pisac kod;
create a website, stworzyc strone internetowa;
digital skills, umiejetnosci cyfrowe;
increased, zwiekszony;
leave feedback, zostawic opinie;
make a video call, przeprowadzic wideorozmowe;
navigate a website, poruszac sie po stronie;
post on a forum, napisac post na forum;
share music/photos online, udostepniac muzyke/zdjecia w internecie;
store data on a device, przechowywac dane na urzadzeniu;
update antivirus software, aktualizowac oprogramowanie antywirusowe;
use a search engine, korzystac z wyszukiwarki;
android robot, robot android;
give somebody a ring, zadzwonic do kogos;
armchair critics, domowi krytycy;
calculations, obliczenia;
do a lot of work, wlozyc w cos duzo pracy;
do an experiment, przeprowadzac eksperyment;
do research into something, prowadzic badania;
do without something, obejsc sie bez czegos;
exaggerate the problem, wyolbrzymiac problem;
invent, wynalezc;
invention, wynalazek;
life-saving, ratujacy zycie;
make a comment, skomentowac cos;
make a discovery, dokonac odkrycia;
make mistakes, popelniac bledy;
make/take a decision, podjac decyzje;
make/take notes, robic notatki;
secure password, bezpieczne haslo;
take a look at something, rzucic okiem na cos;
take the time, znalezc czas;
turn up the volume, podglosnic;
wheel, kolo;
wireless charger, ladowarka bezprzewodowa;
tag, oznaczac;
unique, wyjatkowy;
aboard, na pokladzie;
artificial limb, proteza konczyny;
astronaut, astronauta;
be into stargazing, interesowac sie obserwowaniem gwiazd;
benefit humankind, przyniesc korzysc ludzkosci;
colonise space, kolonizowac kosmos;
come into being, powstac;
commercial partners, partnerzy handlowi;
contribution to something, wklad w cos;
develop an interest, rozwinac zainteresowanie;
entrepreneur, przedsiebiorca;
explore the universe, badac wszechswiat;
fly a jet, pilotowac odrzutowiec;
freak, dziwak;
gain, zyskac;
give up on an idea, porzucic pomysl;
graduate, absolwent;
in collaboration with somebody, we wspolpracy z kims;
land people on the Moon, wyslac ludzi na Ksiezyc;
let one's creative juices flow, puscic wodze kreatywnosci;
make history, zapisac sie w historii;
provide benefits to somebody, przyniesc komus korzysci;
resources, zasoby;
robotics, robotyka;
run an idea past somebody, skonsultowac pomysl;
scientific, naukowy;
scratch-resistant lenses, soczewki odporne na zarysowania;
smoke detector, wykrywacz dymu;
space mission, misja kosmiczna;
space shuttle, prom kosmiczny;
space station, stacja kosmiczna;
space tourist, turysta kosmiczny;
space travel, podroz kosmiczna;
spaceship, statek kosmiczny;
appeal to somebody, podobac sie komus;
archaeology, archeologia;
area of science, dziedzina nauki;
astronomy, astronomia;
computer science, informatyka;
engaging, zajmujacy;
humanities, nauki humanistyczne;
interactive whiteboard, tablica interaktywna;
linguistics, jezykoznawstwo;
multimedia presentation, prezentacja multimedialna;
natural force, zjawisko naturalne;
nervous system, uklad nerwowy;
neuroscience, neurobiologia;
social science, nauki spoleczne;
teamwork, praca zespolowa;
workshop, warsztaty;
essential, niezbedny;
facilitate, ulatwiac;
genuinely, autentycznie;
get addicted to something, uzaleznic sie od czegos;
gimmicky, efektowny;
handy, przydatny;
indispensable, niezbedny;
manufacturer, producent;
market something, promowac cos;
novel, nowy/nowatorski;
popularity, popularnosc;
sensible, rozsadny;
strike a balance, znalezc zloty srodek;
technological progress, postep technologiczny;
youngsters, mlodzi ludzie;
digital detox, detoks cyfrowy;
flick through something, przegladac cos;
initiative, inicjatywa;
reconnect with somebody, polaczyc sie z kims ponownie;
stay off something, trzymac sie z dala od czegos;
try something out, wyprobowac cos;
avoid malicious software, unikac zlosliwego oprogramowania;
coexist, wspolistniec;
cooperate, wspolpracowac;
disappear, znikac;
disapprove of something, nie popierac czegos;
make threats, grozic;
mislead, wprowadzac w blad;
misunderstand, zle zrozumiec;
overcrowded, przepelniony;
overspend, przekraczac budzet;
protect your personal data, chronic dane osobowe;
report trolling, zglaszac trolling;
retake, powtorzyc;
rethink, przemyslec ponownie;
underachieve, osiagac slabe wyniki;
underpaid, niedoplacany;
use parental controls, korzystac z kontroli rodzicielskiej;
use privacy settings, korzystac z ustawien prywatnosci;
use secure websites, korzystac z bezpiecznych stron;
write hurtful things online, pisac krzywdzace komentarze;
`;

function parseWords(raw) {
  const lines = raw.split(";");
  const words = [];
  const seen = new Set();

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      continue;
    }

    const commaIndex = trimmed.indexOf(",");
    if (commaIndex === -1) {
      continue;
    }

    const en = trimmed.slice(0, commaIndex).trim();
    const pl = trimmed.slice(commaIndex + 1).trim();
    if (!en || !pl) {
      continue;
    }

    const key = `${en.toLowerCase()}|||${pl.toLowerCase()}`;
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    words.push({ id: seen.size, en, pl });
  }

  return words;
}

window.WORDS = parseWords(RAW_WORDS);

