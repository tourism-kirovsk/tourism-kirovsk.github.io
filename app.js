function scrollToMap() {
  const section = document.getElementById("planner-section");
  section.scrollIntoView({ behavior: "smooth" });
}
// карта
const map = L.map('map').setView([67.615, 33.66], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap'
}).addTo(map);

// кластер
let cluster = L.markerClusterGroup();
map.addLayer(cluster);

// состояние
let currentCategory = "all";
let route = [];
let polyline = null;
let favorites = [];

try {
  favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
} catch (e) {
  favorites = [];
 favorites = [];
 try { localStorage.setItem('favorites', 
JSON.stringify(favorites)); } catch(e2) { /* storage blocked */ } }

// 🔥 БАЗА ДАННЫХ 
const allPlaces = [ 
// 🏨 ОТЕЛИ 
{name:"Гостиница Северная", lat:67.614484, lon:33.661986, rating:5.0, phone:"8 (800) 200-20-00 (доб. 2)", site:"https://bigwood.ru/hotels/severnaja/?utm_source=YandexMapGosSevernaya&yclid=13268046393859112959", hours:"24/7", type:"hotel"}, 
{name:"Апарт-отель Кольский", lat:67.615607, lon:33.663135, rating:4.6, phone:"8 (800) 200-20-00", site:"https://bigwood.ru/hotels/apart-kolski/?yclid=15570127274819452927&utm_content=16867483062&utm_source=geoadv_maps", hours:"24/7", type:"hotel"}, 
{name:"Отель Кольский", lat:67.608170, lon:33.679752, rating:4.7, phone:"+7 (981) 302-60-96", site:"https://kirovskhotel.ru/?yclid=7592157658494533631&utm_content=17595824076&utm_source=geoadv_maps", hours:"24/7", type:"hotel"}, 
{name:"Sokroma Пик-Шале", lat:67.613583, lon:33.682715, rating:4.5, phone:"+7 (921) 900-05-51", site:"https://sokroma.ru/?utm_campaign=yandex&utm_medium=organic&utm_source=maps&yclid=3084644337967169535", hours:"24/7", type:"hotel"}, 
{name:"Sokroma Гиперборея", lat:67.614703, lon:33.680490, rating:4.9, phone:"+7 (921) 900-05-51", site:"https://sokroma.ru/?utm_campaign=yandex&utm_medium=organic&utm_source=maps&yclid=18317438704496148479", hours:"24/7", type:"hotel"}, 
{name:"Явр", lat:67.613580, lon:33.682807, rating:4.9, phone:"+7 (931) 800-21-10", site:"https://sokroma.ru/?yclid=7418247644994863103&utm_content=17513765558&utm_source=geoadv_maps", hours:"24/7", type:"hotel"}, 
{name:"БиБиКлуб", lat:67.655925, lon:33.711340, rating:4.9, phone:"+7 (921) 519-09-77", site:"https://bbclub-khibiny.clients.site/?yclid=11778515652479025151&utm_content=16065811958&utm_source=geoadv_maps", hours:"24/7", type:"hotel"}, 
{name:"Паудер", lat:67.613264, lon:33.683428, rating:5.0, phone:"+7 (911) 308-34-46", site:"http://www.powderhotel.ru/", hours:"24/7", type:"hotel"}, 
{name:"Хибины", lat:67.605011, lon:33.683923, rating:4.6, phone:"+7 (911) 800-14-44", site:"https://www.hibiny.today/", hours:"24/7", type:"hotel"}, 
{name:"Горница", lat:67.607448, lon:33.673204, rating:4.3, phone:"+7 (81531) 5-91-13", site:"https://gornitcahotel.ru/", hours:"24/7", type:"hotel"}, 
{name:"Эккос", lat:67.614868, lon:33.658082, rating:4.9, phone:"+7 (911) 804-01-03", site:"http://www.hibiny.today/", hours:"24/7", type:"hotel"}, 
{name:"Горная долина", lat:67.655200, lon:33.700120, rating:4.9, phone:"+7 (991) 112-50-11", site:"http://gornaya-dolina.info/", hours:"24/7", type:"hotel"}, 
{name:"Наш", lat:67.618534, lon:33.660212, rating:0, phone:"8 (800) 550-55-98", site:"http://dom.hibiny4you.ru/", hours:"24/7", type:"hotel"}, 
{name:"Riders Apartments 83", lat:67.612656, lon:33.689222, rating:0, phone:"+7 (996) 092-51-51", site:"https://riders-apartments.ru/", hours:"24/7", type:"hotel"}, 
{name:"Wood House", lat:67.584358,lon:33.588775, rating:4.2, phone:"-", site:"-", hours:"-", type:"hotel"}, 

// 🍽 ЕДА 
{name:"Ресторан Перец", lat:67.611108, lon:33.666483, rating:5.0, price:"1500₽", phone:"+7 (921) 708-51-00", site:"https://vk.com/perec51", hours:"12:00-23:00", type:"food"}, 
{name:"Папа Джонс", lat:67.615607,lon:33.663135, rating:5.0, price:"от 429₽", phone:"+7 (905) 294-98-00", site:"https://papajohns.ru", hours:"11:00-23:00", type:"food"}, 
{name:"Кафе-бистро Плато", lat:67.601745, lon:33.727750, rating:4.0, price:"от 1500₽", phone:"+7 (921) 043-54-98", site:"https://plateaurestaurant.ru/bistro/?yclid=1213387532786991103&utm_content=16924646033&utm_source=geoadv_maps", hours:"12:00-18:00", type:"food"}, 
{name:"Северный", lat:67.614457, lon:33.661778, rating:5.0, price:"от 2000₽", phone:"+7 (921) 033-68-58", site:"https://bigwood.ru/eat/restoran-severnyj/?utm_source=YandexRestSeverny&yclid=10662564054248980479", hours:"07:30-00:00", type:"food"}, 
{name:"Додо Пицца", lat:67.615573, lon:33.672297, rating:5.0, price:"от 500₽", phone:"8 (800) 302-00-60", site:"https://app.dodopizza.ru/YlkM/yandexmaps?yclid=17416588133872697343&utm_content=17573862288&utm_source=geoadv_maps", hours:"10:00-22:00", type:"food"}, 
{name:"Bambumaki", lat:67.612395, lon:33.660794, rating:4.6, price:"от 800₽", phone:"+7 (921) 030-08-88", site:"https://vk.com/s/v1/doc/y4fWgwlCFwd-UEjoDJgf8AVzuFsKxqMZjZS7FVQ8FiFKFE7QPwk", hours:"13:00-00:00", type:"food"}, 
{name:"Хибины в тарелке", lat:67.614065, lon:33.668938, rating:5.0, price:"от 1000₽", phone:"+7 (953) 751-12-22", site:"https://vk.com/khibinyvtarelke", hours:"12:00-23:00", type:"food"}, 
{name:"Полярки", lat:67.608052, lon:33.678945, rating:5.0, price:"от 2000₽", phone:"+7 (911) 334-17-17", site:"https://vk.com/polyarki51", hours:"08:00-23:00", type:"food"}, 
{name:"Баревич", lat:67.608714, lon:33.673460, rating:5.0, price:"от 700₽", phone:"+7 (911) 314-08-76", site:"http://barbarevich.ru/", hours:"15:00-02:00", type:"food"}, 
{name:"Гамарджоба", lat:67.612320, lon:33.660528, rating:5.0, price:"от 1500₽", phone:"+7 (921) 033-33-53", site:"https://vk.com/club161291184", hours:"13:00-01:00", type:"food"}, 
{name:"Впекло", lat:67.615024, lon:33.658136, rating:4.9, price:"от -₽", phone:"+7 (911) 808-90-90", site:"https://vk.com/vpeklokrvsk", hours:"11:30-23:00", type:"food"}, 

// 🎿 ДОСУГ 
{name:"Культурный центр Большевик", lat:67.615258, lon:33.660343, rating:4.8, price:"", phone:"+7 (81531) 4-83-75", site:"https://premierzal.ru/theatre/bolshevik/schedule?TheatreScheduleSearch%5Bdate%5D=19.03.2026&TheatreScheduleSearch%5Bformat%5D=", hours:"10:00-22:00", type:"leisure"}, 
{name:"Fusion", lat:67.608084, lon:33.678706, rating:4.1, price:"от -₽", phone:"+7 (911) 333-17-17", site:"http://vk.com/rzfusion", hours:"21:00-04:00", type:"leisure"}, 
{name:"Апатит. Музей,выставочный центр", lat:67.615742, lon:33.666148, rating:5.0, price:"Бесплатно", phone:"+7 (81531) 3-28-32", site:"http://mvc-apatit.ru/", hours:"10:00-20:00", type:"leisure"}, 
{name:"Экскурсионно-туристический центр Снежная Деревня", lat:67.652735, lon:33.659493, rating:5.0, price:"от 800₽", phone:"8 (800) 101-99-90", site:"http://snowderevnya.ru/", hours:"11:00-21:00", type:"leisure"}, 
{name:"Большой Вудъявр. Горнолыжный комплекс", lat:67.609791, lon:33.695286, rating:5.0, price:"от 1500₽", phone:"8 (800) 200-20-00", site:"https://bigwood.ru/?utm_source=YandexMAPBigWood", hours:"09:00-23:00", type:"leisure"}, 
{name:"Кольские Экспедиции", lat:67.653081, lon:33.660988, rating:5.0, price:"от 8000₽", phone:"+7 (921) 514-75-55", site:"https://kola-exp.com/?yclid=13584927212049793023&utm_content=15790644218&utm_source=geoadv_maps", hours:"10:00-18:00", type:"leisure"}, 
{name:"Центр северного сафари", lat:67.653476, lon:33.662311, rating:5.0, price:"от 5000₽", phone:"+7 (8152) 63-73-65", site:"https://nord-safari.ru/", hours:"09:00-18:00", type:"leisure"}, 

// 📍 МЕСТА 
{name:"Пассажирский вокзал Кировск", lat:67.619694, lon:33.669787, rating:4.1, price:"Бесплатно", phone:"—", site:"-", hours:"Всегда", type:"place"}, 
{name:"Историко-краеведческий музей", lat:67.612073, lon:33.669881, rating:4.9, price:"Бесплатно", phone:"+7 (81531) 5-26-63", site:"https://hibinymuseum.ru/", hours:"10:00-18:00", type:"place"}, 
{name:"Хибинский литературный музей В. Ерофеева", lat:67.613443, lon:33.658710, rating:4.5, price:"-", phone:"+7 (81531) 5-46-34", site:"http://erofeevm.bibliokirovsk.ru/", hours:"11:00-19:00", type:"place"}, 
{name:"Кировский историко-краеведческий музей", lat:67.658729, lon:33.716922, rating:4.8, price:"-", phone:"+7 (81531) 5-26-63", site:"http://hibinymuseum.ru/", hours:"10:00-17:30", type:"place"}, 
{name:"Подземный гейзер", lat:67.660420, lon:33.635117, rating:5.0, price:"Бесплатно", phone:"-", site:"-", hours:"Всегда", type:"place"}, 
{name:"Заброшенный молибденитовый рудник", lat:67.665455, lon:33.558515, rating:4.8, price:"Бесплатно", phone:"-", site:"-", hours:"Всегда", type:"place"}]; 

// готовые маршруты 
const readyRoutes = [ 
{
    name: "1 день в Кировске",
    time: "5-6 часов",
    description: "Главные места города + лёгкая прогулка",
    points: [
      [67.614484,33.661986], // Гостиница Северная
      [67.612073,33.669881], // Историко-краеведческий музей
      [67.615742,33.666148], // Музей Апатит
      [67.611108,33.666483], // Ресторан Перец
      [67.609791,33.695286]  // Большой Вудъявр
    ]
  },

  {
    name: "Горный маршрут",
    time: "6-8 часов",
    description: "Хибины, природа и виды",
    points: [
      [67.609791,33.695286], // Большой Вудъявр
      [67.652735,33.659493], // Снежная деревня
      [67.660420,33.635117], // Подземный гейзер
      [67.665455,33.558515]  // Заброшенный рудник
    ]
  },

  {
    name: "Гастро-тур",
    time: "3-4 часа",
    description: "Лучшие рестораны города",
    points: [
      [67.611108,33.666483], // Перец
      [67.614065,33.668938], // Хибины в тарелке
      [67.612320,33.660528], // Гамарджоба
      [67.608714,33.673460]  // Баревич
    ]
  },

  {
    name: "Активный отдых",
    time: "5 часов",
    description: "Развлечения и экстрим",
    points: [
      [67.609791,33.695286], // Вудъявр
      [67.653476,33.662311], // Северное сафари
      [67.653081,33.660988], // Кольские экспедиции
      [67.608084,33.678706]  // Fusion (вечер)
    ]
  },

  {
    name: "Спокойный отдых",
    time: "4-5 часов",
    description: "Музеи, прогулки и атмосфера",
    points: [
      [67.619694,33.669787], // Вокзал
      [67.612073,33.669881], // Музей
      [67.613443,33.658710], // Литературный музей
      [67.615258,33.660343], // Большевик
      [67.614457,33.661778]  // Ресторан Северный
 ]
  },    
 ]; 

// 🔥 РЕНДЕР 
function renderPlaces(list){ 
cluster.clearLayers(); // очистка кластеров 
const sidebar = document.getElementById("sidebar"); 
sidebar.innerHTML = ""; // очистка панели 

list.forEach(p => { 
// маркер на карте 
const marker = L.marker([p.lat, p.lon]);
    marker.bindPopup(`
      <h3>${p.name}</h3>
      <div>⭐ ${p.rating}</div>
      <div>🕒 ${p.hours}</div>
      <div>📞 ${p.phone}</div>
      <div>💰 ${p.price}</div>
      <button onclick="addToRoute([${p.lat},${p.lon}])">Добавить в маршрут</button>
      <button onclick="toggleFavorite('${p.name}')">
        ${favorites.includes(p.name) ? "💔 Убрать" : "❤️ В избранное"}
      </button>
    `);
    cluster.addLayer(marker);

// карточка слева
 const div = document.createElement("div");
 div.className = "place-card";
 div.innerHTML = `
  <h4>${p.name}</h4>
  <div>⭐ ${p.rating}</div>
  <div>🕒 ${p.hours}</div>
  <div>📞 ${p.phone}</div>
  <div>💰 ${p.price || "-"}</div>
 <button onclick="map.setView([${p.lat},${p.lon}],17)">Показать на карте</button>
    `;
    sidebar.appendChild(div);
  });
}
// 📂 категории
function setCategory(cat) {
  currentCategory = cat;
  applyFilters(); // применяем фильтр + обновляем sidebar и карту
}

// 🔎 поиск 
function searchPlaces() { applyFilters(); } 

// Фильтр рейтинг 
function filterByRating (val)
 { window.minRating = parseFloat(val);
 applyFilters(); } 

// ❤️ избранное 
function toggleFavorite(name) {
 if (favorites.includes(name)) {
 favorites = favorites.filter(f => f !== name);
 } else {
 favorites.push(name);
 } 
localStorage.setItem("favorites", JSON.stringify(favorites)); applyFilters(); }

function showFavorites() {

  const modal = document.getElementById("favoritesModal");
  const container = document.getElementById("favoritesList");

  const favPlaces = allPlaces.filter(p =>
    favorites.includes(p.name)
  );

  if (favPlaces.length === 0) {

    container.innerHTML = "<p>Нет избранных мест</p>";

  } else {

    container.innerHTML = "";

    favPlaces.forEach(p => {

      const div = document.createElement("div");

      div.className = "place-card";

      div.innerHTML = `
        <h3>${p.name}</h3>
        <div>⭐ ${p.rating}</div>
        <div>🕒 ${p.hours}</div>
        <div>📞 ${p.phone}</div>

        <button onclick="map.setView([${p.lat}, ${p.lon}], 17)">
          📍 На карте
        </button>

        <button onclick="removeFromFavorites('${p.name}')">
          ❌ Удалить
        </button>
      `;

      container.appendChild(div);

    });
  }

  modal.style.display = "block";
}

function closeFavorites() { document.getElementById("favoritesModal").style.display = "none"; }

function removeFromFavorites(name) {

  favorites = favorites.filter(f => f !== name);

  localStorage.setItem(
    "favorites",
    JSON.stringify(favorites)
  );

  showFavorites();
  applyFilters();
}

// 🔥 общий фильтр 
function applyFilters(){ const search = document.getElementById("searchInput").value.toLowerCase(); const minRating = parseFloat(document.getElementById("ratingFilter").value) || 0; 

// фильтруем одновременно по категории, рейтингу и поиску 
let filtered = allPlaces.filter(p => { const matchCategory = currentCategory === "all" || 
p.type === currentCategory;
 const matchRating = p.rating >= minRating;
 const matchSearch = 
p.name.toLowerCase().includes(search); return matchCategory && matchRating && matchSearch; }); 

// отображаем точки на карте и в sidebar 
renderPlaces(filtered); } 

// 🗺 маршрут 
function addToRoute(coords) { route.push(coords); drawRoute(); }

 function drawRoute() {
 if (polyline) map.removeLayer(polyline);
 if (route.length >= 2) { polyline = L.polyline(route, { color: '#00bfff', weight: 4 }).addTo(map); } } 

// Панель маршрута 
function saveRoute(){
 localStorage.setItem("route", JSON.stringify(route));
 alert("Маршрут сохранён"); } 

function loadRoute(){
 route = JSON.parse(localStorage.getItem("route") || "[]"); drawRoute(); }

 function exportRoute(){
 const data = JSON.stringify(route);
 const blob = new Blob([data], {type:"application/json"}); const url = URL.createObjectURL(blob);
 const a = document.createElement("a"); a.href = url; a.download = "route.json"; a.click(); } 

// 📍 готовые маршруты
function renderReadyRoutes(){
  const container=document.getElementById("routes"); container.innerHTML="";
  readyRoutes.forEach((r,i)=>{
    const div=document.createElement("div"); div.className="route-card";
    div.innerHTML=`<h3>${r.name}</h3><p>${r.description}</p><p>⏱ ${r.time}</p><button onclick="route=${JSON.stringify(r.points)}; drawRoute();">Показать</button>`;
    container.appendChild(div);
  });
}
async function exportRoutePDF() {

  const { jsPDF } = window.jspdf;

  const doc = new jsPDF("p", "mm", "a4");

  // ===== СКРИН КАРТЫ =====

  const mapElement = document.getElementById("map");

  const canvas = await html2canvas(mapElement);

  const mapImage = canvas.toDataURL("image/png");

  // ===== ЗАГОЛОВОК =====

  doc.setFontSize(24);
  doc.setTextColor(30, 144, 255);

  doc.text("Туристический маршрут Кировска", 20, 20);

  // дата
  doc.setFontSize(11);
  doc.setTextColor(100);

  doc.text(
    "Дата: " + new Date().toLocaleDateString(),
    20,
    28
  );

  // ===== КАРТА =====

  doc.addImage(
    mapImage,
    "PNG",
    15,
    35,
    180,
    90
  );

  // ===== СПИСОК МЕСТ =====

  let y = 140;

  doc.setFontSize(18);
  doc.setTextColor(0);

  doc.text("Маршрут:", 20, y);

  y += 10;

  route.forEach((point, index) => {

    const place = allPlaces.find(
      p => p.lat === point[0] && p.lon === point[1]
    );

    if (place) {

      doc.setFontSize(14);

      doc.text(
        `${index + 1}. ${place.name}`,
        25,
        y
      );

      y += 7;

      doc.setFontSize(11);

      doc.text(
        `⭐ ${place.rating}   🕒 ${place.hours}`,
        30,
        y
      );

      y += 10;
    }
  });

  // ===== ИНФОРМАЦИЯ =====

  y += 5;

  doc.setFontSize(13);

  doc.text(
    `Количество точек: ${route.length}`,
    20,
    y
  );

  y += 8;

  doc.text(
    `Маршрут построен через сервис туристических маршрутов`,
    20,
    y
  );

  // ===== FOOTER =====

  doc.setFontSize(10);
  doc.setTextColor(120);

  doc.text(
    "Kirovsk Travel • Хибины • Arctic Russia",
    20,
    285
  );

  // ===== СОХРАНЕНИЕ =====

  doc.save("kirovsk-route.pdf");
}
// старт 
applyFilters();
renderReadyRoutes();

window.showFavorites = showFavorites;
window.closeFavorites = closeFavorites;
window.removeFromFavorites = removeFromFavorites;
window.scrollToMap = scrollToMap;
window.exportRoutePDF = exportRoutePDF;
