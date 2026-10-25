/*
 * LOTUS CHINESE RESTAURANT · МЕНЮГИЙН ӨГӨГДӨЛ
 *
 * Сайтын бүх текст, үнэ, ангилал, зураг энэ ганц файлд байна.
 * Хоол нэмэх, засах, устгахдаа зөвхөн энэ файлыг өөрчилнө.
 *
 * Хоолны талбарууд:
 *   id          Давтагдахгүй латин нэр. Зургийн файлын нэр болон холбоосонд ашиглагдана.
 *   category    Доорх categories жагсаалтын id.
 *   name        Монгол нэр.
 *   nameZh      Хятад нэр (заавал биш).
 *   nameEn      Англи нэр. Хайлтад ашиглагдана, дэлгэцэнд харагдахгүй.
 *   price       Үнэ, төгрөгөөр, зөвхөн тоо.
 *   portion     Хэмжээ (заавал биш).
 *   description Дэлгэрэнгүй тайлбар.
 *   tags        "spicy" (халуун ногоотой), "vegetarian" (цагаан хоол), "chef" (тогоочийн санал).
 *   featured    true бол "Онцлох хоол" хэсэгт гарна.
 *   image       Зургийн эх үүсвэр. Гурван хэлбэрийн аль нэг:
 *                 "commons:Файлын_нэр.jpg"   Wikimedia Commons дээрх файл
 *                 "images/source/миний_зураг.jpg"   Репо доторх өөрийн зураг
 *                 "https://..."   Шууд холбоос
 *               Build хийх үед бүх зургийг 960 x 720 хэмжээтэй WebP болгон нэг жигд тайрна.
 *   credit      Зургийн зохиогч болон лиценз (нээлттэй лицензтэй зурагт заавал бичнэ).
 */

export const restaurant = {
  name: "Lotus Chinese Restaurant",
  nameZh: "莲花中餐厅",
  tagline: "Хятадын уламжлалт амт, орчин үеийн тансаг үйлчилгээ",
  intro:
    "Кантон, Сычуань, Бээжингийн хоолны уламжлалыг туршлагатай тогооч нарын ур чадвар, өдөр бүр шинээр ирдэг түүхий эдтэй хослуулан бэлтгэдэг. Гэр бүл, найз нөхөд, бизнесийн уулзалтад тохирсон тав тухтай орчинд таныг урьж байна.",
  // Демо мэдээлэл. Жинхэнэ хаяг, утсаар солино уу.
  address: "Улаанбаатар хот, Сүхбаатар дүүрэг, Энхтайваны өргөн чөлөө",
  hours: "Өдөр бүр 11:00 цагаас 23:00 цаг хүртэл",
  phone: "+976 7700 8888",
  phoneHref: "+97677008888",
  currency: "₮"
};

export const categories = [
  { id: "chinese", name: "Хятад хоол", icon: "wok" },
  { id: "noodles", name: "Гоймон", icon: "noodle" },
  { id: "rice", name: "Будаатай хоол", icon: "rice" },
  { id: "dumplings", name: "Банш", icon: "dumpling" },
  { id: "soups", name: "Шөл", icon: "soup" },
  { id: "desserts", name: "Амттан", icon: "dessert" },
  { id: "drinks", name: "Ундаа", icon: "tea" }
];

export const items = [
  /* ---------- ХЯТАД ХООЛ ---------- */
  {
    id: "peking-duck",
    category: "chinese",
    name: "Бээжин нугас",
    nameZh: "北京烤鸭",
    nameEn: "Peking duck roast duck",
    price: 89000,
    portion: "Бүтэн нугас, хоёр гурван хүнд",
    description:
      "Тусгай зууханд удаан шарж, хальсыг нь алтлаг шаржигнуур, махыг нь зөөлөн шүүслэг болгосон Бээжингийн алдарт нугас. Нимгэн гурилан бин, ногоон сонгино, өргөст хэмх, амтат шошны соустай хамт үйлчилнэ.",
    tags: ["chef"],
    featured: true,
    image: "commons:Peking duck 1.jpg",
    credit: "Pauloleong2002 · CC BY-SA 4.0 · Wikimedia Commons"
  },
  {
    id: "kung-pao-chicken",
    category: "chinese",
    name: "Гунбао тахиа",
    nameZh: "宫保鸡丁",
    nameEn: "Kung pao chicken",
    price: 32900,
    portion: "1 хүний порц",
    description:
      "Шоо хэлбэрээр хэрчсэн тахианы махыг газрын самар, хатаасан улаан чинжүү, ногоон сонгинотой хамт өндөр гал дээр хуурсан Сычуань мужийн алдарт хоол. Амтат, исгэлэн, халуун амт нь тэнцвэртэй хослоно.",
    tags: ["spicy"],
    featured: true,
    image: "commons:Kung Pao Chicken at Yujiayan Restaurant (20230510123120).jpg",
    credit: "N509FZ · CC BY-SA 4.0 · Wikimedia Commons"
  },
  {
    id: "mapo-tofu",
    category: "chinese",
    name: "Мапо тофу",
    nameZh: "麻婆豆腐",
    nameEn: "Mapo tofu",
    price: 26900,
    portion: "1 хүний порц",
    description:
      "Зөөлөн тофуг татсан үхрийн мах, халуун шошны зуурмаг, Сычуань чинжүүтэй хамт чанасан халуун, анхилуун хоол. Цагаан будаатай хамт идэхэд хамгийн тохиромжтой.",
    tags: ["spicy"],
    featured: false,
    image: "commons:Chen Mapo Tofu.jpg",
    credit: "ZhengZhou · CC BY-SA 4.0 · Wikimedia Commons"
  },
  {
    id: "sweet-sour-pork",
    category: "chinese",
    name: "Амтат исгэлэн гахайн мах",
    nameZh: "咕噜肉",
    nameEn: "Sweet and sour pork",
    price: 34900,
    portion: "1 хүний порц",
    description:
      "Шаржигнатал шарсан гахайн махыг хан боргоцой, амтат чинжүү, сонгинотой хамт амтат исгэлэн соусаар хуурсан Кантон маягийн хоол.",
    tags: [],
    featured: false,
    image: "commons:菠萝咕噜肉.jpg",
    credit: "Walter Grassroot · CC BY-SA 3.0 · Wikimedia Commons"
  },

  /* ---------- ГОЙМОН ---------- */
  {
    id: "lanzhou-beef-noodles",
    category: "noodles",
    name: "Ланжоу үхрийн махан гоймон",
    nameZh: "兰州牛肉面",
    nameEn: "Lanzhou beef noodle soup",
    price: 24900,
    portion: "Том аяга",
    description:
      "Гараар сунгаж хийсэн шинэхэн гоймонг долоон цаг чанасан үхрийн махан шөл, нимгэн хэрчсэн үхрийн мах, цагаан лууван, кориандр, чинжүүтэй тосоор үйлчилнэ.",
    tags: ["chef"],
    featured: true,
    image: "commons:Chinese Beef Noodle Soup - 中式牛肉湯麵.jpg",
    credit: "NeoBatfreak · CC BY-SA 4.0 · Wikimedia Commons"
  },
  {
    id: "chow-mein",
    category: "noodles",
    name: "Чоу мейн шарсан гоймон",
    nameZh: "炒面",
    nameEn: "Chow mein fried noodles",
    price: 22900,
    portion: "1 хүний порц",
    description:
      "Өндөгтэй гоймонг чар сиу гахайн мах, байцаа, шошны соёолж, ногоон сонгинотой хамт вок тогоонд хүчтэй гал дээр хуурсан Хонконг маягийн гоймон.",
    tags: [],
    featured: false,
    image: "commons:Chasiu chow mein in yuen long.jpg",
    credit: "Peachyeung316 · CC BY-SA 4.0 · Wikimedia Commons"
  },
  {
    id: "dan-dan-noodles",
    category: "noodles",
    name: "Дань дань гоймон",
    nameZh: "担担面",
    nameEn: "Dan dan noodles",
    price: 21900,
    portion: "1 хүний порц",
    description:
      "Кунжутын зуурмаг, чинжүүтэй тос, Сычуань чинжүү, татсан гахайн махтай халуун амттай гоймон. Самрын анхилуун үнэр нь онцлог.",
    tags: ["spicy"],
    featured: false,
    image: "commons:担担面 Dandan noodles.jpg",
    credit: "Sharon Ang · CC0 · Wikimedia Commons"
  },
  {
    id: "zhajiang-noodles",
    category: "noodles",
    name: "Жажан гоймон",
    nameZh: "炸酱面",
    nameEn: "Zhajiangmian noodles",
    price: 21900,
    portion: "1 хүний порц",
    description:
      "Бээжингийн уламжлалт шошны зуурмагтай гахайн махан соустай гоймон. Шинэ өргөст хэмх, шошны соёолжоор чимэглэнэ.",
    tags: [],
    featured: false,
    image: "commons:Zhajiangmian before stirring at Fangzhuanchang (20210115130756).jpg",
    credit: "N509FZ · CC BY-SA 4.0 · Wikimedia Commons"
  },

  /* ---------- БУДААТАЙ ХООЛ ---------- */
  {
    id: "yangzhou-fried-rice",
    category: "rice",
    name: "Янжоу шарсан будаа",
    nameZh: "扬州炒饭",
    nameEn: "Yangzhou fried rice",
    price: 23900,
    portion: "1 хүний порц",
    description:
      "Сам хорхой, чар сиу гахайн мах, өндөг, ногоон вандуй, ногоон сонгинотой хамт вок тогоонд хуурсан алтлаг шарсан будаа.",
    tags: [],
    featured: false,
    image: "commons:Yeung Chow Fried Rice in Hong Kong Fast Food Shop.JPG",
    credit: "Ceeseven · CC BY-SA 4.0 · Wikimedia Commons"
  },
  {
    id: "hainan-chicken-rice",
    category: "rice",
    name: "Хайнань тахиатай будаа",
    nameZh: "海南鸡饭",
    nameEn: "Hainanese chicken rice",
    price: 27900,
    portion: "1 хүний порц",
    description:
      "Тахианы шөлөнд болгосон анхилуун будаа, зөөлөн чанасан тахианы мах, цагаан гаатай болон чинжүүтэй соус, шинэ өргөст хэмхтэй.",
    tags: [],
    featured: false,
    image: "commons:Hainanese chicken rice.jpg",
    credit: "Misaochan · CC BY 4.0 · Wikimedia Commons"
  },
  {
    id: "char-siu-rice",
    category: "rice",
    name: "Чар сиу гахайн махтай будаа",
    nameZh: "叉烧饭",
    nameEn: "Char siu barbecue pork rice",
    price: 28900,
    portion: "1 хүний порц",
    description:
      "Зөгийн бал, таван амтлагчаар даршилж шарсан Кантон маягийн чар сиу гахайн махыг цагаан будаа, чанасан ногоотой хамт үйлчилнэ.",
    tags: ["chef"],
    featured: false,
    image: "commons:Char Siu & Fried Egg with Rice.jpg",
    credit: "Ceeseven · CC BY-SA 4.0 · Wikimedia Commons"
  },
  {
    id: "claypot-rice",
    category: "rice",
    name: "Шавар тогоонд болгосон будаа",
    nameZh: "煲仔饭",
    nameEn: "Claypot rice",
    price: 31900,
    portion: "1 хүний порц",
    description:
      "Шавар тогоонд удаан болгосон будаа, Кантон хиам, тахианы мах, мөөгтэй. Тогооны ёроолд үүссэн шаржигнуур хальс нь энэ хоолны гол онцлог.",
    tags: [],
    featured: false,
    image: "commons:Cured Meat Claypot Rice at The Soup Kitchen (20200718171540).jpg",
    credit: "N509FZ · CC BY-SA 4.0 · Wikimedia Commons"
  },

  /* ---------- БАНШ ---------- */
  {
    id: "xiaolongbao",
    category: "dumplings",
    name: "Сяолунбао шөлтэй банш",
    nameZh: "小笼包",
    nameEn: "Xiaolongbao soup dumplings",
    price: 19900,
    portion: "6 ширхэг",
    description:
      "Нимгэн гурилан дотроо халуун шөл, гахайн махан чанартай Шанхайн алдарт уурын банш. Цагаан гаатай хар цуунд дүрж идээрэй.",
    tags: ["chef"],
    featured: true,
    image: "commons:2019-02-22 Xiaolongbao in \"Taste Of Shanghai\" restaurant, Sydney, Australia.jpg",
    credit: "Maksym Kozlenko · CC BY-SA 4.0 · Wikimedia Commons"
  },
  {
    id: "har-gow",
    category: "dumplings",
    name: "Хар гоу сам хорхойтой банш",
    nameZh: "虾饺",
    nameEn: "Har gow shrimp dumplings dim sum",
    price: 22900,
    portion: "4 ширхэг",
    description:
      "Тунгалаг нимгэн гурилтай, бүтэн сам хорхойн чанартай Кантон дим сам. Зөөлөн, шүүслэг амттай.",
    tags: [],
    featured: false,
    image: "commons:Har Gow at Canal Luna restaurant, InterContinental Guangzhou Exhibition Center (20180923125523).jpg",
    credit: "N509FZ · CC BY-SA 4.0 · Wikimedia Commons"
  },
  {
    id: "siu-mai",
    category: "dumplings",
    name: "Шумай",
    nameZh: "烧卖",
    nameEn: "Siu mai shumai dim sum",
    price: 18900,
    portion: "4 ширхэг",
    description:
      "Гахайн мах, сам хорхой, мөөгөөр чанартай, дээд тал нь задгай хэлбэртэй уурын банш.",
    tags: [],
    featured: false,
    image: "commons:Prawn-and-pork-siu-mai.jpg",
    credit: "Sara McCleary · CC BY-SA 4.0 · Wikimedia Commons"
  },
  {
    id: "potstickers",
    category: "dumplings",
    name: "Хайруулын банш",
    nameZh: "锅贴",
    nameEn: "Potstickers guotie pan fried dumplings",
    price: 17900,
    portion: "8 ширхэг",
    description:
      "Ёроолыг нь алтлаг шаржигнатал хайруулдаад уураар жигнэсэн гахайн мах, байцааны чанартай банш.",
    tags: [],
    featured: false,
    image: "commons:15 pan fried dumplings of Bafang Yunji 20150305.jpg",
    credit: "a2335825 · CC BY-SA 2.0 · Wikimedia Commons"
  },

  /* ---------- ШӨЛ ---------- */
  {
    id: "hot-sour-soup",
    category: "soups",
    name: "Халуун исгэлэн шөл",
    nameZh: "酸辣汤",
    nameEn: "Hot and sour soup",
    price: 14900,
    portion: "Аяга",
    description:
      "Тофу, мод мөөг, хулсны найлзуур, өндөгтэй, хар цуу болон цагаан чинжүүний амттай өтгөн шөл.",
    tags: ["spicy"],
    featured: false,
    image: "commons:Hot-and-Sour-Soup-Bowl.jpg",
    credit: "Evan-Amos · Public domain · Wikimedia Commons"
  },
  {
    id: "wonton-soup",
    category: "soups",
    name: "Вонтон шөл",
    nameZh: "云吞汤",
    nameEn: "Wonton soup",
    price: 16900,
    portion: "Аяга",
    description:
      "Сам хорхой, гахайн махан чанартай зөөлөн вонтонг тунгалаг тахианы шөлөнд ногоон ногоотой хамт үйлчилнэ.",
    tags: [],
    featured: false,
    image: "commons:Wonton soup at 65 Huguosi St (20211221173225).jpg",
    credit: "N509FZ · CC BY-SA 4.0 · Wikimedia Commons"
  },
  {
    id: "egg-drop-soup",
    category: "soups",
    name: "Өндөгний цэцэгтэй шөл",
    nameZh: "蛋花汤",
    nameEn: "Egg drop soup",
    price: 12900,
    portion: "Аяга",
    description:
      "Тунгалаг шөлөнд өндгийг нимгэн цэцэг шиг задлан, ногоон сонгинотой болгосон зөөлөн амттай шөл.",
    tags: ["vegetarian"],
    featured: false,
    image: "commons:Egg Drop Soup (蛋花湯）.jpg",
    credit: "Ralff Nestor Nacor · CC BY-SA 4.0 · Wikimedia Commons"
  },
  {
    id: "tomato-egg-soup",
    category: "soups",
    name: "Улаан лоольтой өндөгний шөл",
    nameZh: "番茄蛋汤",
    nameEn: "Tomato egg soup",
    price: 13900,
    portion: "Аяга",
    description:
      "Шинэ улаан лооль, өндөг, ногоон сонгинотой, исгэлэн чихэрлэг амттай гэрийн уламжлалт шөл.",
    tags: ["vegetarian"],
    featured: false,
    image: "commons:Tomato and egg soup.jpg",
    credit: "NNU-10-HanRongrong · CC BY 3.0 · Wikimedia Commons"
  },

  /* ---------- АМТТАН ---------- */
  {
    id: "egg-tart",
    category: "desserts",
    name: "Өндөгтэй тарт",
    nameZh: "蛋挞",
    nameEn: "Egg tart",
    price: 9900,
    portion: "3 ширхэг",
    description:
      "Олон давхар шаржигнуур гурилан дотор зөөлөн өндөгний кремтэй Хонконг маягийн амттан.",
    tags: ["vegetarian"],
    featured: false,
    image: "commons:Hong Kong Dan tat.jpg",
    credit: "stu_spivack · CC BY-SA 2.0 · Wikimedia Commons"
  },
  {
    id: "mango-sago",
    category: "desserts",
    name: "Манго саго",
    nameZh: "杨枝甘露",
    nameEn: "Mango pomelo sago",
    price: 14900,
    portion: "Аяга",
    description:
      "Шинэ манго, кокосын сүү, саго бөмбөлөг, грейпфрутын ширхэгтэй сэрүүн, зөөлөн амттан.",
    tags: ["vegetarian"],
    featured: true,
    image: "commons:MangoPomeloSago 1.jpg",
    credit: "Thomas.Lu · CC BY 3.0 · Wikimedia Commons"
  },
  {
    id: "sesame-balls",
    category: "desserts",
    name: "Кунжуттай бөмбөлөг",
    nameZh: "煎堆",
    nameEn: "Sesame balls jian dui",
    price: 10900,
    portion: "4 ширхэг",
    description:
      "Гадуураа кунжутаар бүрсэн, дотроо улаан шошны чихэрлэг зуурмагтай шаржигнуур бөмбөлөг.",
    tags: ["vegetarian"],
    featured: false,
    image: "commons:Fried sesame balls with a sweet filling (芝麻煎堆仔) 02.jpg",
    credit: "Ecritures · CC BY-SA 4.0 · Wikimedia Commons"
  },
  {
    id: "tangyuan",
    category: "desserts",
    name: "Тан юань",
    nameZh: "汤圆",
    nameEn: "Tangyuan glutinous rice balls",
    price: 11900,
    portion: "Аяга",
    description:
      "Наалдамхай будааны гурилан зөөлөн бөмбөлгийг тээрэмдсэн хар кунжутын өтгөн, бүлээн чихэрлэг шөлтэй үйлчилнэ.",
    tags: ["vegetarian"],
    featured: false,
    image: "commons:石磨芝麻糊湯丸 - 深深甜品.jpg",
    credit: "Andy Li · CC0 · Wikimedia Commons"
  },

  /* ---------- УНДАА ---------- */
  {
    id: "jasmine-tea",
    category: "drinks",
    name: "Жасмин цай",
    nameZh: "茉莉花茶",
    nameEn: "Jasmine tea",
    price: 8900,
    portion: "Данх",
    description:
      "Жасмин цэцгийн анхилуун үнэр шингэсэн ногоон цай. Хоолны дараа ууж, амтыг сэргээхэд тохиромжтой.",
    tags: ["vegetarian"],
    featured: false,
    image: "commons:Jasmine tea in a glass (8658148091).jpg",
    credit: "Ruth Hartnup from Vancouver, Canada · CC BY 2.0 · Wikimedia Commons"
  },
  {
    id: "hong-kong-milk-tea",
    category: "drinks",
    name: "Хонконг сүүтэй цай",
    nameZh: "港式奶茶",
    nameEn: "Hong Kong milk tea",
    price: 9900,
    portion: "Аяга",
    description:
      "Хүчтэй хар цайг өтгөрүүлсэн сүүтэй хольсон, зөөлөн, өтгөн амттай Хонконг маягийн цай. Халуун болон хүйтнээр захиалж болно.",
    tags: ["vegetarian"],
    featured: false,
    image: "commons:Hong Kong-style Milk Tea.jpg",
    credit: "WiNG · CC BY-SA 3.0 · Wikimedia Commons"
  },
  {
    id: "bubble-tea",
    category: "drinks",
    name: "Сувдан сүүтэй цай",
    nameZh: "珍珠奶茶",
    nameEn: "Bubble tea boba pearl milk tea",
    price: 11900,
    portion: "Аяга",
    description:
      "Хар чихэрт даршилсан тапиока сувдтай, сэрүүн сүүтэй цай.",
    tags: ["vegetarian"],
    featured: false,
    image: "commons:Pearl Milk Tea in Chun Shui Tang.jpg",
    credit: "Battlesnake1 · CC0 · Wikimedia Commons"
  },
  {
    id: "plum-drink",
    category: "drinks",
    name: "Исгэлэн чавганы ундаа",
    nameZh: "酸梅汤",
    nameEn: "Sour plum drink suanmeitang",
    price: 7900,
    portion: "Аяга",
    description:
      "Утсан чавга, жимс, чихрээр бэлтгэсэн исгэлэн чихэрлэг амттай, сэрүүн уламжлалт ундаа.",
    tags: ["vegetarian"],
    featured: false,
    image: "commons:Sour plum drink.jpg",
    credit: "用心阁/Yongxinge · CC BY-SA 3.0 · Wikimedia Commons"
  }
];

export const tagLabels = {
  spicy: "Халуун ногоотой",
  vegetarian: "Цагаан хоол",
  chef: "Тогоочийн санал"
};
