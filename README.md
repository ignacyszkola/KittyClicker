# KittyClicker

KittyClicker to gra przeglądarkowa typu clicker. Projekt składa się z frontendowej aplikacji React/Vite oraz backendowego API Spring Boot z bazą SQLite.

## Wymagania

- Node.js i npm
- Java 21
- Windows: repozytorium zawiera Maven Wrapper (`backend\mvnw.cmd`)

## Uruchomienie lokalne

### Backend

W PowerShellu, w katalogu głównym repozytorium:

```powershell
cd backend
$env:JWT_SECRET = node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
.\mvnw.cmd spring-boot:run
```

Backend uruchamia się domyślnie pod `http://localhost:8080`. `JWT_SECRET` musi być kluczem Base64 zawierającym co najmniej 32 bajty. Wygeneruj i zachowaj własny klucz, jeśli tokeny mają pozostać ważne po ponownym uruchomieniu backendu.

Baza SQLite jest wskazywana ścieżką `./kittyclicker.db` względem katalogu, z którego uruchomiono backend. Przy powyższych komendach jej lokalizacja to `backend\kittyclicker.db`. Skrypty schematu i danych startowych są w `backend\src\main\resources`.

### Frontend

Otwórz drugi terminal w katalogu głównym repozytorium:

```powershell
cd frontend
npm install
npm run dev
```

Vite uruchomi aplikację pod `http://localhost:5173`. Żądania `/api` są przekazywane do backendu pod `http://localhost:8080`.

## Budowanie i testy

Frontend:

```powershell
cd frontend
npm run build
npm run lint
```

Backend:

```powershell
cd backend
.\mvnw.cmd test
```

## API

API używa JSON. Rejestracja i logowanie są publiczne; pozostałe endpointy wymagają nagłówka:

```http
Authorization: Bearer <token>
```

| Metoda | Endpoint | Opis |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Rejestracja. `username` ma 3–20 znaków, `password` 8–64 znaki. |
| `POST` | `/api/auth/login` | Logowanie; odpowiedź zawiera token JWT oraz dane użytkownika. |
| `GET` | `/api/auth/me` | Dane zalogowanego użytkownika. |
| `GET` | `/api/users/{id}` | Profil i saldo użytkownika. |
| `GET` | `/api/game` | Stan gry, w tym kliknięcia, waluta, ulepszenia, osiągnięcia, wybrany skin i odblokowane skiny. |
| `POST` | `/api/clicks` | Wykonuje kliknięcie i zwraca nowy stan oraz informacje o nagrodach. |
| `POST` | `/api/users/{userId}/cats` | Kupuje kota. Body to wartość enum, np. `"POINTS_PER_CLICK"`. |
| `POST` | `/api/users/{userId}/upgrades` | Ulepsza kota. Body używa tych samych wartości enum. |
| `POST` | `/api/users/{userId}/items/{itemId}/use` | Używa przedmiotu. |
| `PATCH` | `/api/users/{userId}/skin` | Wybiera skin; body to liczbowe ID, np. `1`. |
| `POST` | `/api/golden-cat/appear` | Rozpoczyna wydarzenie Golden Cat i zwraca czas wygaśnięcia. |
| `POST` | `/api/golden-cat/claim` | Odbiera nagrodę Golden Cat. |

Przykładowe typy kotów i ulepszeń: `POINTS_PER_CLICK`, `MONEY_CHANCE`, `CRIT_CHANCE`, `MONEY_MULTIPLIER`, `CRIT_MULTIPLIER`, `PASSIVE_CAT`.

Interfejs dokumentacji OpenAPI/Swagger jest dostępny pod `http://localhost:8080/swagger-ui/index.html`.


### Bigos
Zobacz jak smakuje prawdziwy bigos tradycyjny. Poznaj mój sprawdzony przepis na bigos z dużą ilością różnych mięs, z suszonymi grzybami, śliwkami i idealnie dobranymi przyprawami. To danie, które Cię zachwyci.

Czas przygotowania: 2 godziny
Czas duszenia: 2 dni
Liczba porcji: 5 kg bigosu
 W 100 g:
Wartość energetyczna
161 kcal
Węglowodany
4 g
- W tym cukry
2 g
Białko
7 g
Tłuszcze
13 g
Dieta: bezglutenowa, keto, niskocukrowa, niskowęglowodanowa


Składniki
1 kg kapusty świeżej - pół średniej główki
2 kg kapusty kiszonej + 2,5 szklanki wody do gotowania
80 g suszonych grzybów + 500 ml wody do moczenia
500 g łopatki wieprzowej
300 g łopatki wołowej
500 g boczku surowego bez skóry
500 g schabu wieprzowego od karku
50 g smalcu wieprzowego
180 g kiełbasy myśliwskiej podwędzanej
150 g boczku surowego wędzonego
150 g boczku parzonego wędzonego
2 duże cebule - do 400 g
50 g suszonych śliwek bez pestek - lub więcej
1 szklanka czerwonego, wytrawnego wina - można pominąć
przyprawy i zioła: 5 ziaren ziela angielskiego, łyżeczka czarnego pieprzu, 5 liści laurowych, 1 goździk, 2 ziarna jałowca
Składniki:

Nie wygaszaj ekranu
Bigos
Przed szykowaniem przepisu zachęcam też do przeczytania najpierw całego wpisu. W treści podaję bowiem dużo ciekawych porad dotyczących składników oraz ich zamienników. Być może zapragniesz coś zmienić, z czegoś zrezygnować lub dokupić jakąś przyprawę.

Do duszenia bigosu polecam użyć garnka emaliowanego, żeliwnego emaliowanego lub garnka z mocną i nieprzywierającą powłoką o pojemności minimum siedmiu litrów. Nie używamy zaś garnków aluminiowych.

Mój przepis na bigos domowy zawiera w składzie bardzo dużo mięsa. Zdaję sobie sprawę z tego, że większość z Was nie daje do bigosu tak dużej ilości mięs i wędzonek. Ja daję... ale jeśli Wy chcecie ograniczyć ilość mięsa w bigosie, to śmiało możecie zrezygnować np. z dodatku surowego schabu lub boczku oraz np. z boczku surowego wędzonego lub parzonego wędzonego. W bigosie będzie wówczas mniej mięsa, ale reszta składników (również przyprawy) pozostaje bez zmian.

Porcja bigosu została nałożona na biały talerz z delikatną obwódką. Kapusta jest miękka i błyszcząca, wymieszana z kawałkami mięsa i ciemnymi dodatkami przypominającymi grzyby. Obok znajduje się widelec, kromki chleba i naczynie z gotowanymi ziemniakami.
Szykowanie bigosu zacznij od namoczenia suszonych grzybów. 80 gramów suszonych grzybów, to trochę więcej niż dwie garście grzybków. Suszone grzyby umieść w większym naczyniu i zalej dwiema szklankami zimnej wody... może być woda z kranu. 

Miseczkę przykryj np. talerzykiem i odstaw w suche i chłodne miejsce na 12 godzin, a najlepiej na całą noc. Grzyby wchłoną część wody i zmiękną. 

Biała misa jest wypełniona suszonymi grzybami zalanymi wodą, która przybrała ciemny kolor. Plastry i kawałki grzybów są napęczniałe i miękkie, gotowe do wykorzystania w kolejnym etapie przygotowania bigosu.

Różnicę widać od razu. Woda zrobiła się ciemna, a grzyby ładnie napuchły. 
W białej misce znajdują się suszone grzyby zalane wodą, która przybrała ciemny, herbaciany kolor. Miękkie kapelusze i kawałki grzybów unoszą się w płynie, co pokazuje etap moczenia przed dalszym gotowaniem bigosu.
Odcedź grzyby z wody, ale wody nie wylewaj. Wodę z moczenia grzybów dodajemy potem do bigosu. Odcedzone grzyby posiekaj na drobne paski. 

Dwie miski na niebieskim blacie zawierają składniki po moczeniu grzybów. W dolnej misce znajdują się posiekane, ciemnobrązowe grzyby o błyszczącej powierzchni, a w górnej misce pozostaje ciemna woda, którą zachowuje się do bigosu.
Dwa kilogramy kapusty kiszonej odciśnij dokładnie z wody a następnie posiekaj. Kapustę umieść w garnku. Wlej dwie i pół szklanki zwykłej wody z kranu lub wody filtrowanej (mniej lub więcej, ale tyle, by przykryć wodą kapustę). Kapusta kiszona z mojego przepisu będzie idealna o bigosu. 

Porada: Je nie płuczę kapusty kiszonej, ale odciskam ją ze słono kwaśnej wody. Dla mnie to taki kompromis smakowy. Jeśli wolisz bardziej kwaśny bigos, to nie odciskaj kapusty z wody. Jeśli zaś lubisz bigos bardzo łagodny, to możesz odciśniętą w wody kapustę kiszonką jeszcze dodatkowo przepłukać w zimnej wodzie i raz jeszcze odcisnąć. Zawsze polecam też najpierw sprawdzić smak kiszonej kapusty, bowiem jedne są mniej kwaśne i słone a inne bardziej. 

Duży biały garnek jest wypełniony posiekaną kapustą kiszoną o jasnozielonym kolorze. Kapusta została zalana wodą do poziomu, który przykrywa jej wiórki, co stanowi bazę bigosu przed dalszym gotowaniem.
Małą główkę białej kapusty lub też pół większej główki (łącznie jeden kilogram) posiekaj i umieść na sitku w zlewie. Sparz kapustę wrzątkiem z czajnika. Sparzoną kapustę umieść w garnku razem z kapustą kiszoną. Garnek przykryj przykrywką. Zagotuj całość a następnie zmniejsz moc palnika do takiej, by kapusty tylko lekko mrugały. Gotuj je tak przez godzinę pod przykrywką. 

Porada: Jeśli chcesz zrobić bigos wyłącznie z użyciem świeżej kapusty (główka kapusty "słodkiej") z pominięciem kapusty kiszonej, to wystarczy, że do bigosu dodasz około jednego kilograma tartych na tarce, kwaśnych i twardych jabłek. Np. na dwa kilogramy kapusty dajemy jeden kilogram jabłek. Jabłka dodajemy wówczas pod koniec szykowania bigosu. 

W białym garnku znajduje się porcja grubo poszatkowanej, jasnej kapusty. Kawałki są wilgotne i lekko połyskliwe, przygotowane do połączenia z kapustą kiszoną w kolejnym etapie gotowania bigosu.
W trakcie gotowania się kapusty przygotuj mięso. Surowe mięsa pokrój na małe kawałki: 500 g łopatki wieprzowej, 300 g łopatki wołowej, 500 g schabu wieprzowego od karku, 500 g boczku surowego bez skóry. Przygotuj też 50 g smalcu wieprzowego.

Im więcej różnych mięs, tym bogatszy smak bigosu. Jak jednak wspomniałam wcześniej, możesz śmiało zrezygnować nawet z połowy mięs. Wówczas wszystkie inne składniki dajemy w tych samym ilościach. Jeśli zaś masz dostęp do dobrej jakości dziczyzny (mięso z dzika, sarny, kaczki lub zająca), to polecam zrezygnować np. ze schabu wieprzowego, na rzecz dziczyzny. 

Szary talerz zawiera różne rodzaje mięsa pokrojonego w małą kostkę, w tym jaśniejsze kawałki z tłuszczem i ciemniejsze czerwone mięso. Pośrodku została ułożona podłużna porcja białego smalcu przygotowana do smażenia.
Smalec roztop na dużej patelni a następnie wyłóż też razem wszystkie rodzaje pokrojonego mięsa. Mięso podsmażaj tak na średniej mocy palnika przez 40 minut. Co kilka minut zamieszaj całość przy pomocy drewnianej łyżki. 

Po godzinie gotowania kapustę razem z wodą przełóż do bardzo dużego garnka. Dodaj wszystkie przyprawy i zioła: 5 ziaren ziela angielskiego, łyżeczka czarnego pieprzu, 5 liści laurowych, 1 goździk, 2 ziarna jałowca. Wlej też wodę, która została z moczenia grzybów (jeśli nie jest gorzka) oraz dodaj posiekane grzyby. Dokładnie wszystko wymieszaj.

Porada: Do bigosu możesz też śmiało dodać (oprócz wyżej wymienionych przypraw) gotową mieszankę przypraw do bigosu. To dobry sposób na doprawienie bigosu, gdy brakuje nam np. jałowca lub goździków. W gotowych mieszankach zazwyczaj je znajdziecie. Wystarczy jedna saszetka o wadze 20 gramów. Jeśli zaś dysponujesz wyłącznie mieszanką przypraw, to możesz dodać do 40 gramów mieszanki przypraw do bigosu. 

Duży garnek jest wypełniony jasną, drobno poszatkowaną kapustą, a na środku znajduje się kopczyk ciemnych, posiekanych suszonych grzybów. To etap przygotowania bigosu tuż przed dokładnym wymieszaniem grzybów z kapustą.
Kolejno dodaj też podsmażone na patelni mięso. Całość wymieszaj i przykryj przykrywką. Bigos gotuj cały czas na bardzo małej mocy palnika. Mieszaj, by się nie przypalił. 

W szerokim garnku znajduje się posiekana kapusta z ciemnymi kawałkami grzybów, a na wierzchu rozłożone są rumiane kostki podsmażonego mięsa. Kadr pokazuje etap łączenia składników przed dokładnym wymieszaniem i dalszym gotowaniem bigosu.
Na samym końcu przygotuj cebule oraz wędzonki. Potrzebujesz dwie duże cebule, po 150 gramów boczku wędzonego surowego i parzonego oraz 180 g kiełbasy myśliwskiej podwędzanej. W pierwszej kolejności pokrój w kostkę boczek parzony i umieść go na patelni po mięsie. Gdy wytopisz już z boczku tłuszcz dodaj posiekaną cebulę. Po pięciu minutach podsmażania dodaj też pokrojony w kostkę boczek surowy wędzony. Podsmażaj całość dziesięć minut. 

Porada: Możesz też użyć wyłącznie kiełbasy a najlepiej po kawałku różnych kiełbas (Kiełbas nie trzeba wcześniej podsmażać... szczególnie tych podsuszanych). Możesz też użyć wyłącznie boczku wędzonego. Całkowicie dozwolone jest też dodanie pokrojonych w kosteczkę kawałków pieczeni, które zostały Ci z poprzednich obiadów np. pieczony schab lub karkówka. 

Na szerokiej patelni znajduje się posiekana cebula wymieszana z kostkami boczku, częściowo zrumienionymi na brzegach. Składniki są już lekko błyszczące od wytopionego tłuszczu i stanowią aromatyczną bazę przed dalszym gotowaniem bigosu.
Po tym czasie całą zawartość patelni przełóż do garnka z gotującym się bigosem. Kiełbasę pokrój w kostkę i dodaj go bigosu. Posiekaj też drobno minimum 50 gramów suszonych śliwek. Jeśli nie masz śliwek suszonych, to bardzo dobrze sprawdzą się też domowe powidła śliwkowe. Wszystko bardzo dokładnie wymieszaj. 

Bigos gotuj na minimalnej mocy palnika przez cztery godziny. Jeśli planujesz dodać do bigosu czerwone wino, to zrób to pierwszego lub ostatniego dnia gotowania bigosu. Szklankę dobrego czerwonego wina lub też madery wlej do bigosu zaraz po dodaniu ostatnich składników lub też na dwie godziny przed wyłączeniem bigosu w dniu w którym chcesz go podać. 

Przynajmniej co 30 minut zaglądaj do bigosu i mieszaj go przy pomocy drewnianej łyżki, bowiem bigos lubi się przypalać. Następnego dnia ponownie podgrzewaj bigos przez przynajmniej dwie godziny. Bigos gotowy jest do jedzenia już pierwszego dnia, jednak podgrzewany drugiego lub nawet trzeciego, czy czwartego dnia robi się coraz lepszy.

Porcja bigosu została nałożona na biały talerz. Potrawa zawiera mięso w kostkach, miękką kapustę i ciemne kawałki grzybów, a na wierzchu znajduje się zielony listek. Z boku ustawiono kromki pieczywa, a w tle znajduje się naczynie z ugotowanymi ziemniakami.
Na białym talerzu znajduje się porcja gęstego bigosu z kapustą i widocznymi kawałkami mięsa oraz ciemnymi dodatkami. Danie jest udekorowane listkiem zieleniny. Obok ustawiono widelec i łyżkę, a w tle stoją ziemniaki i ciemne pieczywo.

Pod koniec gotowania bigosu można też dodać przecier pomidorowy, jednak kuchnia staropolska nie znała kiedyś takiego dodatku. Ja przecieru nie dodaję, ale jeśli macie ochotę, to możecie wzbogacić smak bigosu o kila łyżek przecieru lub koncentratu z pomidorów, czy też posiekanych świeżych pomidorów bez skórki. 

Jeśli lubisz bardziej tłusty bigos, to śmiało.. dodaj więcej dobrej jakości smalcu wieprzowego lub też smalcu z gęsi. W razie potrzeby dodaj też do bigosu trochę soli lub też pieprzu, czy cukru. Jest jeszcze kwestia sporna, czyli szykowanie zasmażki do bigosu. Według mnie nie ma takiej potrzeby. Bogaty w składniki i długo duszony bigos będzie gęsty i zawiesisty bez zasmażki. 

Bigos polecam podawać bardzo gorący. Domowy bigos najlepiej smakuje z ciemnym pieczywem, ziemniakami oraz różnymi kluskami z ziemniaków. Koniecznie piszcie jakie są Wasze sprawdzone sposoby na pyszny bigos oraz smaczny sposób podania.
Powodzenia!
