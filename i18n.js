(function () {
  "use strict";

  var STORAGE_KEY = "ikanza-demo-language";
  var sourceText = new WeakMap();
  var sourceAttributes = new WeakMap();
  var watchedRoots = new WeakMap();
  var sourceSampleValues = new WeakMap();
  var sampleListenerRoots = new WeakSet();
  var selectedLanguage = "en";
  var languages = { en: "en", my: "ms-MY", cn: "zh-Hans" };
  var productNames = ["Coral grouper", "Grouper", "Sea bass", "Red snapper", "Indian mackerel", "Fresh prawns", "Whole squid", "Flower crab", "Golden pomfret", "Spanish mackerel", "Fourfinger threadfin", "Torpedo scad", "Sardine", "Threadfin bream", "White prawns", "Tiger prawns", "Red prawns", "Rainbow prawns", "White squid", "Baby squid", "Cuttlefish", "Baby cuttlefish", "Female flower crab", "Mud crab", "Soft-shell crab", "Flower crab meat"];
  var businessSampleFields = {
    "buyer-name": "Example Buyer",
    "business-name": "Example Kitchen",
    "seafood-interest": "Whole fish for shared mains",
    "business-quantity": "20 kg per order",
    "business-message": "Interested in confirmed species, preparation and delivery terms when available."
  };

  // Keys are the English copy in app.js and the standalone pages. Keep those sources unchanged; each render
  // creates fresh nodes and this layer applies the selected language to the DOM.
  var copy = {
    "Skip to content": ["Langkau ke kandungan", "跳转至内容"],
    "SEMPORNA SEAFOOD": ["MAKANAN LAUT SEMPORNA", "仙本那海鲜"],
    "OPENING SOON FOR PENINSULAR MALAYSIA": ["AKAN DIBUKA DI SEMENANJUNG MALAYSIA", "即将面向马来西亚半岛开放"],
    "Ikanza home": ["Laman utama Ikanza", "Ikanza 首页"],
    "Main navigation": ["Navigasi utama", "主导航"],
    "Mobile navigation": ["Navigasi mudah alih", "移动导航"],
    "Choose language": ["Pilih bahasa", "选择语言"],
    "Shop seafood": ["Lihat makanan laut", "看看海鲜"],
    "How it works": ["Cara membeli-belah", "购物流程"],
    "Track delivery": ["Contoh penjejakan", "送货进度示例"],
    "Account": ["Akaun contoh", "示例账户"],
    "Customer story": ["Kisah pelanggan", "顾客故事"],
    "Our story": ["Kisah kami", "我们的故事"],
    "Delivery & FAQ": ["Penghantaran & Soalan Lazim", "送货与常见问题"],
    "Bag": ["Troli", "购物车"],
    "Open menu": ["Buka menu", "打开菜单"],
    "Close menu": ["Tutup menu", "关闭菜单"],
    "A simpler way to explore seafood from Semporna.": ["Makanan laut Semporna, lebih mudah dipilih.", "仙本那海鲜，挑选更轻松。"],
    "Opening soon · Orders not open": ["Kedai contoh · Belum menerima pesanan", "店铺展示中 · 暂未开放下单"],
    "Explore": ["Lihat", "看看"],
    "Seafood": ["Makanan laut", "海鲜"],
    "Information": ["Maklumat", "信息"],
    "Your bag": ["Troli anda", "购物车"],
    "Contact details at launch": ["Butiran hubungan semasa pelancaran", "开业时公布联系方式"],
    "© Ikanza. Preview storefront; no orders or payments.": ["© Ikanza. Kedai contoh; tiada pesanan atau bayaran.", "© Ikanza。店铺展示；目前无法下单或付款。"],
    "Listings and AI-generated imagery are illustrative.": ["Senarai produk dan imej janaan AI adalah untuk ilustrasi.", "商品信息及 AI 生成图片仅供示意。"],
    "Preview listing": ["Produk contoh", "商品示例"],
    "Sample price": ["Harga contoh", "参考价格"],
    "Whole fish example": ["Contoh ikan seekor", "整鱼示例"],
    "Add to bag": ["Tambah ke troli contoh", "加入示例购物车"],
    "Coral grouper": ["Kerapu karang", "珊瑚石斑鱼"],
    "Sea bass": ["Siakap", "金目鲈"],
    "Red snapper": ["Ikan merah", "红鲷鱼"],
    "Firm & rich": ["Isi pejal & kaya rasa", "肉质紧实，味道浓郁"],
    "Mild & versatile": ["Rasa lembut & serba guna", "味道清淡，烹法多样"],
    "Clean & delicate": ["Rasa segar & halus", "味道清爽细腻"],
    "800 g example pack": ["Pek contoh 800 g", "800 克示例包装"],
    "1 kg example pack": ["Pek contoh 1 kg", "1 公斤示例包装"],
    "A firm, rich fish that works beautifully steamed with ginger or simply roasted.": ["Ikan berisi pejal dan kaya rasa, enak dikukus dengan halia atau dipanggang ringkas.", "肉质紧实、味道浓郁，适合姜蒸或简单烤制。"],
    "A mild, versatile choice for a family meal, whether steamed, baked or pan-seared.": ["Pilihan berasa lembut dan serba guna untuk hidangan keluarga, sama ada dikukus, dibakar atau digoreng dalam kuali.", "味道清淡、烹法多样，适合家庭餐桌；可清蒸、烘烤或香煎。"],
    "A clean, delicate flavour suited to simple cooking and shared dishes.": ["Rasa segar dan halus, sesuai dimasak ringkas untuk dinikmati bersama.", "味道清爽细腻，适合简单烹调，与家人共享。"],

    "From Semporna to your table": ["Dari Semporna ke meja anda", "从仙本那到您的餐桌"],
    "Semporna seafood, made simple.": ["Makanan laut Semporna, lebih mudah dipilih.", "仙本那海鲜，挑选更轻松。"],
    "Ikanza is exploring a fish-first storefront shaped by a Semporna partner who buys wild-caught fish from small local fishers. The catalogue here uses market-based examples; the partner’s actual fish list, prices and delivery arrangements are not confirmed. Orders are not open yet.": ["Ikanza sedang meneroka kedai yang mengutamakan ikan bersama rakan di Semporna yang membeli ikan tangkapan liar daripada nelayan kecil tempatan. Semua produk di sini ialah contoh berdasarkan pasaran; senarai ikan, harga dan penghantaran sebenar daripada rakan kami belum disahkan. Pesanan belum dibuka.", "Ikanza 正与仙本那的合作伙伴探索以鱼类为主的网店；合作伙伴向当地小规模渔民收购野生捕捞的鱼。这里的商品仅为市场参考示例；实际鱼类清单、价格和送货安排尚待确认。目前未开放下单。"],
    "Explore familiar fish, compare pack weights and see a sample delivered total. Ikanza is shaping a fish-first shop for Peninsular Malaysia while the real catch list and delivery route are confirmed.": ["Lihat pilihan ikan yang dikenali ramai, bandingkan berat pek dan semak contoh jumlah termasuk penghantaran. Ikanza sedang merancang kedai yang mengutamakan ikan untuk Semenanjung Malaysia sementara senarai tangkapan sebenar dan laluan penghantaran disahkan.", "先看看熟悉的鱼类，比较包装重量和含运费的示例总额。Ikanza 正筹备面向马来西亚半岛、以鱼类为主的网店；实际渔获清单和送货路线仍待确认。"],
    "Storefront preview · Orders are not open": ["Kedai contoh · Belum menerima pesanan", "店铺展示中 · 暂未开放下单"],
    "Find something for the table.": ["Cari pilihan untuk hidangan anda.", "找找适合上桌的海鲜。"],
    "Start with grouper for steaming, snapper for a shared dinner or tenggiri for curry. Compare the example pack and guide price as you browse.": ["Cuba lihat kerapu untuk dikukus, ikan merah untuk hidangan bersama atau tenggiri untuk kari. Bandingkan pek contoh dan harga panduan semasa melihat-lihat.", "想清蒸石斑鱼、准备红鲷鱼晚餐，或煮咖喱马鲛鱼？浏览时可比较示例包装和参考价格。"],
    "Pick your next dinner.": ["Cari idea untuk makan malam.", "看看下一顿吃什么。"],
    "Browse the sample catalogue and try the bag and checkout preview. Orders are not open yet.": ["Lihat produk contoh dan cuba troli serta halaman semak pesanan. Ikanza belum menerima pesanan.", "看看示例商品，试用购物车和订单核对页面。目前还不能下单。"],
    "Good seafood.": ["Makanan laut Semporna.", "仙本那海鲜。"],
    "Made simple.": ["Mudah dipilih.", "挑选更轻松。"],
    "Ikanza is preparing a clearer way to shop Semporna seafood across Peninsular Malaysia. Explore the storefront while our catalogue and delivery service are being finalised.": ["Ikanza sedang menyiapkan kedai untuk pelanggan di Semenanjung Malaysia. Lihat contoh produk sementara jenis ikan, harga dan penghantaran disahkan.", "Ikanza 正在筹备面向马来西亚半岛（西马）的海鲜网店。先看看商品示例；鱼种、价格和送货安排确认后才会开放下单。"],
    "Explore seafood": ["Lihat produk", "看看商品"],
    "Opening soon. The listings shown are previews.": ["Belum menerima pesanan. Produk yang dipaparkan ialah contoh.", "暂未开放下单。页面展示的是示例商品。"],
    "Illustrative seafood arrangement on ice": ["Ilustrasi susunan makanan laut di atas ais", "冰上陈列海鲜的示意图片"],
    "From the sea": ["Dari laut", "来自大海"],
    "to you": ["untuk anda", "送到您手中"],
    "Explore the seafood": ["Lihat makanan laut", "看看海鲜"],
    "See the full delivery total": ["Semak jumlah termasuk penghantaran", "查看含运费的总额"],
    "Preview the checkout": ["Cuba semak pesanan", "查看示例订单"],
    "Explore the collection": ["Lihat semua produk", "浏览全部商品"],
    "A taste of what is coming.": ["Lihat pilihan yang sedang dirancang.", "看看正在筹备的商品。"],
    "Fish names, pack sizes and prices should be easy to compare. Here is a preview of how the collection will be presented.": ["Bandingkan nama ikan, berat pek dan harga contoh di satu tempat.", "鱼名、包装重量和示例价格放在一起，方便比较。"],
    "Preview listings only. Species, availability, pack sizes and prices will be confirmed before orders open.": ["Produk ini hanya contoh. Jenis ikan, bekalan, berat pek dan harga akan disahkan sebelum pesanan dibuka.", "商品仅作展示。鱼种、供应、包装重量和价格会在开放下单前确认。"],
    "How shopping works": ["Cara membeli-belah", "购物方式"],
    "Simple from the first click.": ["Pilih, semak, kemudian putuskan.", "先挑选，再核对。"],
    "Know what is in the pack and what delivery adds before you decide.": ["Semak kandungan pek dan caj penghantaran sebelum memilih.", "挑选前，先看清每包有多少、运费是多少。"],
    "See how it works": ["Lihat cara ia berfungsi", "了解购物流程"],
    "Choose your fish": ["Pilih ikan", "挑选鱼类"],
    "Compare pack size, price and product format.": ["Bandingkan saiz pek, harga dan bentuk produk.", "比较包装规格、价格和产品形式。"],
    "Review delivery": ["Semak penghantaran", "查看送货"],
    "See the delivery area, date and full total together.": ["Semak kawasan, tarikh dan jumlah termasuk caj penghantaran.", "核对送货地区、日期和含运费的总额。"],
    "Know the next step": ["Ketahui langkah seterusnya", "了解下一步"],
    "Review all the details in one place before an order.": ["Semak semua butiran di satu tempat sebelum membuat pesanan.", "下单前在同一处核对所有详情。"],
    "“Know the fish. Know the price. Know what happens next.”": ["“Kenali ikan. Tahu harganya. Fahami langkah seterusnya.”", "“看清鱼种、价格和后续安排。”"],
    "Why Ikanza": ["Mengapa Ikanza", "为什么选择 Ikanza"],
    "A better link between Semporna and your kitchen.": ["Dari Semporna ke dapur anda.", "让仙本那海鲜走进更多家庭厨房。"],
    "A clearer path for Semporna’s wild catch.": ["Laluan yang lebih jelas untuk ikan tangkapan Semporna.", "让仙本那的野生渔获走向更多餐桌。"],
    "Our Semporna partner buys wild-caught fish from small local fishers and sells it beyond the area. Ikanza is exploring a fish-first storefront for Peninsular Malaysian homes, with verified fish, pack details and delivery costs shown before orders open.": ["Rakan kami di Semporna membeli ikan tangkapan liar daripada nelayan kecil tempatan dan menjualnya ke luar kawasan. Ikanza sedang meneroka kedai yang mengutamakan ikan untuk keluarga di Semenanjung Malaysia, dengan jenis ikan, butiran pek dan kos penghantaran yang disahkan sebelum pesanan dibuka.", "仙本那的合作伙伴向当地小规模渔民收购野生捕捞的鱼，再销往外地。Ikanza 正探索面向马来西亚半岛家庭、以鱼类为主的网店；开放下单前会列明已确认的鱼种、包装详情和运费。"],
    "Clear fish names and source details": ["Nama ikan dan maklumat sumber yang jelas", "清楚列出鱼名与来源"],
    "Pack weight, condition and price before checkout": ["Berat pek, keadaan ikan dan harga sebelum semak pesanan", "结账前看清包装重量、鱼的状态和价格"],
    "Delivery and support terms explained": ["Syarat penghantaran dan bantuan pelanggan yang jelas", "说明送货与售后安排"],
    "Fish names and preparation explained plainly": ["Nama ikan dan penyediaannya dijelaskan dengan mudah", "清楚说明鱼名与处理方式"],
    "Full cost and delivery timing shown early": ["Jumlah kos dan masa penghantaran dipaparkan awal", "提前显示完整费用和配送时间"],
    "Clear help when something goes wrong": ["Bantuan yang jelas jika timbul masalah", "遇到问题时有明确的求助途径"],
    "Explore what is coming": ["Lihat produk contoh", "看看商品示例"],
    "Seafood shopping, made clearer.": ["Pilih makanan laut dengan maklumat yang jelas.", "看清详情，再挑海鲜。"],
    "Browse the preview collection and see how the ordering journey could work. Orders are not open yet.": ["Lihat produk contoh dan cuba cara semak pesanan. Ikanza belum menerima pesanan.", "看看商品示例，试用核对订单的流程。目前不能下单。"],

    "The collection": ["Pilihan makanan laut", "海鲜商品"],
    "Find your seafood.": ["Cari makanan laut", "找海鲜"],
    "Browse by English or Malay name and compare guide prices. Fish lead this preview; prawns, squid and crab show possible future categories. None is confirmed supplier stock.": ["Cari mengikut nama Inggeris atau Melayu dan bandingkan harga panduan. Ikan menjadi tumpuan contoh kedai ini; udang, sotong dan ketam menunjukkan kategori yang mungkin ditawarkan kelak. Tiada satu pun stok pembekal yang disahkan.", "可按英文或马来文名称浏览，并比较参考价格。此店铺示例以鱼类为主；虾、苏东和螃蟹展示未来可能加入的类别。所有商品都不是已确认的供应商库存。"],
    "Search fish, prawns, squid or crab": ["Cari ikan, udang, sotong atau ketam", "搜索鱼、虾、苏东或螃蟹"],
    "Seafood, without the guesswork.": ["Makanan laut dengan maklumat yang jelas.", "选购海鲜，心中有数。"],
    "Search preview products": ["Cari produk contoh", "搜索示例商品"],
    "Search fish or Malay name": ["Cari nama ikan", "搜索鱼名或马来文名称"],
    "No matching fish in this preview.": ["Tiada produk yang sepadan.", "没有找到匹配的示例商品。"],
    "Try a different name or clear the search.": ["Cuba nama lain atau kosongkan carian.", "请尝试其他名称或清除搜索内容。"],
    "Clear search": ["Kosongkan carian", "清除搜索"],

    "Not found": ["Tidak ditemui", "未找到"],
    "Guide price from": ["Harga panduan dari", "参考价起"],
    "Choose pack": ["Pilih pek", "选择规格"],
    "Preview item · Not for sale yet": ["Produk contoh · Belum dijual", "示例商品 · 尚未开售"],
    "Add to preview bag": ["Tambah ke troli contoh", "加入示例购物车"],
    "Market-based guide only. Final Ikanza stock, preparation, condition and price are unconfirmed. No order or payment is available.": ["Harga panduan ini berdasarkan pasaran. Stok, cara penyediaan, keadaan produk dan harga Ikanza belum disahkan. Belum boleh membuat pesanan atau bayaran.", "价格仅供参考。Ikanza 的库存、处理方式、商品状态和实际价格尚未确认；目前不能下单或付款。"],
    "Market price reference:": ["Rujukan harga pasaran:", "市场价格参考："],
    "View seller listing": ["Lihat produk penjual", "查看商家商品"],
    ". Other pack sizes may be estimated.": [". Berat pek lain mungkin anggaran.", "。其他包装规格可能是估算值。"],
    "What if a pack weighs differently?": ["Bagaimana jika berat pek berbeza?", "如果包装重量不同怎么办？"],
    "That fish is not on this menu.": ["Ikan itu tiada dalam senarai ini.", "商品列表中没有这种鱼。"],
    "Return to the sample catalogue.": ["Kembali ke produk contoh.", "返回示例商品。"],
    "Back to shop": ["Kembali ke kedai", "返回商店"],
    "Preview in checkout": ["Semak pada langkah seterusnya", "下一步查看"],
    "Sample pack": ["Pek contoh", "示例包装"],
    "Preparation": ["Penyediaan", "处理方式"],
    "Proposed origin": ["Cadangan asal", "拟定产地"],
    "Semporna, Sabah": ["Semporna, Sabah", "沙巴仙本那"],
    "Delivery": ["Penghantaran", "送货"],
    "Quantity": ["Kuantiti", "数量"],
    "Choose quantity": ["Pilih kuantiti", "选择数量"],
    "Decrease quantity": ["Kurangkan kuantiti", "减少数量"],
    "Increase quantity": ["Tambah kuantiti", "增加数量"],
    "View bag": ["Lihat troli", "查看购物车"],
    "Preview item. Species, size, cut, condition and availability will be confirmed before launch. No order or payment is available yet.": ["Produk ini hanya contoh. Jenis, saiz, potongan, keadaan dan bekalan belum disahkan. Belum boleh membuat pesanan atau bayaran.", "此商品仅作示例。鱼种、大小、切法、状态和供应尚待确认；目前不能下单或付款。"],
    "How will it be delivered?": ["Bagaimana ia akan dihantar?", "会如何配送？"],
    "Coverage, dates, packaging and fees are being finalised. The figures in checkout are examples.": ["Kawasan, tarikh, pembungkusan dan caj penghantaran belum disahkan. Angka pada halaman semak pesanan hanyalah contoh.", "送货地区、日期、包装和运费尚待确认。核对订单页面的金额仅作示例。"],
    "What if the weight varies?": ["Bagaimana jika beratnya berbeza?", "如果重量有差异怎么办？"],
    "Confirmed listings will explain the pack weight and final price clearly. This preview uses a fixed sample pack.": ["Berat pek dan harga akhir akan diterangkan pada produk sebenar. Di sini, kami menggunakan pek contoh dengan berat tetap.", "正式商品页面会说明包装重量和最终价格。这里先用固定重量的示例包装。"],

    "Your bag is empty.": ["Troli anda kosong.", "购物车是空的。"],
    "Choose a preview item to see how the ordering journey will work.": ["Tambah produk contoh untuk mencuba cara membuat pesanan.", "加入一件示例商品，试用订购流程。"],
    "Nothing in your bag yet.": ["Troli anda masih kosong.", "购物车里还没有商品。"],
    "Explore the collection, then come back here to review your choices.": ["Lihat produk contoh, kemudian semak pilihan anda di sini.", "先看看示例商品，再回来核对所选商品。"],
    "Ready for your table?": ["Semak pilihan anda", "核对所选商品"],
    "Review the preview items in your bag and see the full sample total on the next step.": ["Semak produk contoh dalam troli. Jumlah termasuk caj penghantaran ditunjukkan pada langkah seterusnya.", "核对购物车中的示例商品；下一步可查看含运费的总额。"],
    "Preview items and prices only. Nothing is reserved or ordered.": ["Produk dan harga ini hanya contoh. Tiada stok ditempah atau pesanan dibuat.", "商品和价格仅作示例，不会预留库存或提交订单。"],
    "← Keep browsing": ["← Terus lihat produk", "← 继续看看"],
    "Bag summary": ["Ringkasan troli", "购物车小计"],
    "Sample delivery": ["Caj penghantaran contoh", "示例运费"],
    "Use sample details to explore the form. Checkout details stay on this page; see": ["Gunakan maklumat contoh untuk mencuba borang. Butiran ini kekal pada halaman ini; baca", "请使用示例资料试用表单。填写内容只留在此页面；详情请看"],
    "Privacy & demo data": ["Privasi dan data contoh", "隐私与示例数据"],
    "Shown next": ["Dipaparkan seterusnya", "下一步显示"],
    "Subtotal": ["Jumlah kecil", "商品小计"],
    "Continue to checkout preview": ["Semak pesanan contoh", "查看示例订单"],
    "Orders and payments are not open yet.": ["Belum boleh membuat pesanan atau bayaran.", "目前不能下单或付款。"],
    "Preview item": ["Produk contoh", "示例商品"],
    "Remove": ["Keluarkan", "移除"],

    "Checkout preview": ["Semak pesanan contoh", "示例订单核对"],
    "Add a preview item to explore checkout.": ["Tambah produk contoh untuk mencuba halaman semak pesanan.", "加入一件示例商品，试用订单核对页面。"],
    "Browse seafood": ["Lihat makanan laut", "浏览海鲜"],
    "See the full picture.": ["Semak jumlah dan penghantaran.", "核对金额与送货安排。"],
    "Explore the delivery and order summary with sample information. Nothing is sent or charged.": ["Gunakan maklumat contoh untuk melihat ringkasan pesanan dan penghantaran. Tiada pesanan dihantar atau bayaran dikenakan.", "用示例资料查看订单和送货摘要。不会提交订单或扣款。"],
    "Delivery details": ["Butiran penghantaran", "送货资料"],
    "Review": ["Semak", "核对"],
    "Where would it go?": ["Alamat penghantaran contoh", "示例送货地址"],
    "Use the sample details below. Form entries stay on this page and are not submitted to a server.": ["Gunakan maklumat contoh di bawah. Butiran borang tidak dihantar ke pelayan.", "请使用下方示例资料。表单内容不会提交到服务器。"],
    "Use sample details": ["Isi maklumat contoh", "填入示例资料"],
    "Full name": ["Nama penuh", "全名"],
    "Email": ["E-mel", "电子邮箱"],
    "Mobile number": ["Nombor telefon bimbit", "手机号码"],
    "Postcode": ["Poskod", "邮政编码"],
    "e.g. 00000": ["cth. 00000", "例如 00000"],
    "Enter a five-digit Malaysian postcode": ["Masukkan poskod Malaysia lima digit", "请输入五位数的马来西亚邮政编码"],
    "Delivery address": ["Alamat penghantaran", "送货地址"],
    "Example Customer": ["Pelanggan Contoh", "示例顾客"],
    "Example street address": ["Alamat jalan contoh", "示例街道地址"],
    "Choose a sample delivery area": ["Pilih kawasan penghantaran contoh", "选择示例送货地区"],
    "Klang Valley": ["Lembah Klang", "巴生谷"],
    "Other Peninsular areas": ["Kawasan lain di Semenanjung", "马来西亚半岛其他地区"],
    "Other Peninsular area": ["Kawasan lain di Semenanjung", "马来西亚半岛其他地区"],
    "Sample delivery date": ["Tarikh penghantaran contoh", "示例送货日期"],
    "Preview only.": ["Contoh sahaja.", "仅作示例。"],
    "Continuing displays a sample confirmation. No order, payment or delivery is created.": ["Langkah seterusnya memaparkan contoh pengesahan. Tiada pesanan, bayaran atau penghantaran dibuat.", "下一步会显示示例确认页，不会产生订单、付款或送货安排。"],
    "Order preview": ["Pesanan contoh", "示例订单"],
    "Sample total": ["Jumlah contoh", "示例总额"],
    "All amounts are illustrative. No payment is taken.": ["Semua jumlah adalah contoh. Tiada pembayaran diambil.", "所有金额仅供示意，不会收取费用。"],
    "View sample confirmation": ["Lihat contoh pengesahan", "查看示例确认"],

    "Sample confirmation": ["Pengesahan contoh", "示例确认"],
    "No preview completed yet.": ["Belum ada contoh pengesahan.", "还没有示例确认记录。"],
    "Explore checkout to see how the final screen will look.": ["Cuba semak pesanan untuk melihat contoh halaman pengesahan.", "试用订单核对流程，看看示例确认页。"],
    "Here is your sample confirmation.": ["Ini contoh pengesahan anda.", "这是您的示例确认页。"],
    "This is how a clear order confirmation could look.": ["Beginilah contoh pengesahan pesanan Ikanza.", "未来的订单确认页可能会是这样。"],
    "No real order was placed, no payment was taken, and nothing will be delivered.": ["Tiada pesanan sebenar dibuat, tiada bayaran diambil dan tiada apa-apa akan dihantar.", "并未提交真实订单、收取付款或安排配送。"],
    "Sample summary": ["Ringkasan contoh", "示例摘要"],
    "Preview reference": ["Nombor rujukan contoh", "示例编号"],
    "Products": ["Produk", "商品"],
    "Sample destination": ["Alamat contoh", "示例送货地点"],
    "Sample date": ["Tarikh contoh", "示例日期"],
    "The reference is generated in your browser only.": ["Nombor rujukan ini dijana dalam pelayar anda sahaja.", "此编号仅在您的浏览器中生成。"],

    "A clear path from sea to table.": ["Pilih ikan dengan maklumat yang lengkap.", "挑鱼时，先把详情看清楚。"],
    "We are preparing a shopping experience that makes the fish, pack size and delivery total easy to understand. Final shipping arrangements will be shared before orders open.": ["Kami sedang menyiapkan kedai yang memaparkan jenis ikan, berat pek dan jumlah termasuk penghantaran. Butiran penghantaran sebenar akan diumumkan sebelum pesanan dibuka.", "我们正在筹备海鲜网店，让您看清鱼种、包装重量和含运费的总额。实际送货安排会在开放下单前公布。"],
    "Find your fish": ["Cari ikan", "找鱼"],
    "See the fish name, preparation, pack weight and price together.": ["Lihat nama ikan, cara penyediaan, berat pek dan harga di satu tempat.", "在同一处查看鱼名、处理方式、包装重量和价格。"],
    "Choose an area and date, then see the complete total.": ["Pilih kawasan dan tarikh, kemudian lihat jumlah keseluruhan.", "选择配送区域和日期，再查看完整总额。"],
    "Check every detail": ["Semak setiap butiran", "核对每项详情"],
    "Review the items, delivery timing and final amount in one place.": ["Semak produk, masa penghantaran dan jumlah akhir di satu tempat.", "在同一处核对商品、配送时间和最终金额。"],
    "What matters most": ["Yang paling penting", "最重要的事"],
    "Clarity at every step.": ["Jelas pada setiap langkah.", "每一步都清楚。"],
    "Fish condition, preparation, weight and delivery cost should all be clear before a customer places an order.": ["Sebelum membuat pesanan, pelanggan patut tahu keadaan ikan, cara penyediaan, berat dan caj penghantaran.", "下单前，顾客应该知道鱼的状态、处理方式、重量和运费。"],
    "Plain-language product details": ["Butiran produk yang mudah difahami", "易懂的商品详情"],
    "Malay and English names side by side.": ["Nama Melayu dan Inggeris dipaparkan bersebelahan.", "并列显示马来文和英文名称。"],
    "Transparent weight and price": ["Berat dan harga yang telus", "透明的重量与价格"],
    "Defined pack sizes or a clear final-weight process.": ["Saiz pek yang ditetapkan atau proses berat akhir yang jelas.", "明确的包装规格，或清楚的最终称重流程。"],
    "Visible help and policies": ["Bantuan dan dasar yang mudah dicari", "容易查找的帮助与政策"],
    "Answers easy to find throughout the journey.": ["Jawapan mudah dicari sepanjang proses pembelian.", "购物过程中，相关解答随时可查。"],

    "Rooted in Semporna.": ["Bermula di Semporna.", "故事从仙本那开始。"],
    "Our Story | From Semporna to More Tables | Ikanza": ["Kisah Kami | Dari Semporna ke Meja Makan Anda | Ikanza", "我们的故事 | 从仙本那到更多餐桌 | Ikanza"],
    "Discover the small-fisher wild-catch model behind Ikanza’s Semporna fish shop preview for Peninsular Malaysia. Orders are not open yet.": ["Kenali cara rakan Semporna Ikanza membeli ikan tangkapan liar daripada nelayan kecil tempatan. Lihat kedai contoh untuk Semenanjung Malaysia; pesanan belum dibuka.", "了解 Ikanza 仙本那鱼类店铺示例背后的采购方式：向当地小规模渔民收购野生捕捞的鱼，面向马来西亚半岛筹备销售。目前尚未开放下单。"],
    "A better link between Semporna and your kitchen.": ["Dari Semporna, untuk lebih banyak dapur.", "让更多家庭认识仙本那海鲜。"],
    "From Semporna’s small fishers to more Malaysian tables.": ["Dari nelayan kecil Semporna ke lebih banyak meja makan di Malaysia.", "从仙本那的小规模渔民，走向更多马来西亚人的餐桌。"],
    "Ikanza is exploring a clearer way for Peninsular households to discover wild-caught fish from Semporna.": ["Ikanza sedang meneroka cara yang lebih jelas untuk keluarga di Semenanjung Malaysia mengenali ikan tangkapan liar dari Semporna.", "Ikanza 正探索更清楚的方式，让马来西亚半岛的家庭认识来自仙本那的野生捕捞鱼类。"],
    "Good fish deserve a clearer way to reach your table.": ["Tahu apa yang dibeli, sebelum ikan sampai ke dapur.", "买鱼之前，先把详情看清楚。"],
    "Where it began": ["Di mana ia bermula", "故事的起点"],
    "Closer to the source. Clearer at the table.": ["Kenali sumber ikan, semak butiran sebelum membeli.", "了解来源，买前看清详情。"],
    "Our Semporna partner buys wild-caught fish from small local fishers and sells it beyond the area. That local network is the starting point for Ikanza.": ["Rakan kami di Semporna membeli ikan tangkapan liar daripada nelayan kecil tempatan dan menjualnya ke luar kawasan. Rangkaian setempat itu menjadi titik mula Ikanza.", "仙本那的合作伙伴向当地小规模渔民收购野生捕捞的鱼，再销往外地。这个本地采购网络是 Ikanza 的起点。"],
    "We want families in Peninsular Malaysia to know exactly which fish is offered, its weight and condition, the price and the delivery plan before ordering. The partner has not confirmed a sale catalogue for this site yet.": ["Kami mahu keluarga di Semenanjung Malaysia tahu jenis ikan yang ditawarkan, berat dan keadaannya, harga serta rancangan penghantaran sebelum membuat pesanan. Rakan kami belum mengesahkan senarai produk untuk dijual di laman ini.", "我们希望马来西亚半岛的家庭在下单前看清实际供应的鱼种、重量与状态、价格和送货安排。合作伙伴尚未确认本网站的销售清单。"],
    "Our first focus is fish for households in Peninsular Malaysia. Other seafood categories in this preview show how the shop could work; they are not confirmed supplier products.": ["Tumpuan awal kami ialah ikan untuk keluarga di Semenanjung Malaysia. Kategori makanan laut lain dalam contoh ini hanya menunjukkan cara kedai mungkin berfungsi; produk itu belum disahkan oleh pembekal.", "我们首先面向马来西亚半岛的家庭销售鱼类。页面中的其他海鲜类别只用于展示店铺可能如何运作，尚非供应商确认的商品。"],
    "What we are building toward": ["Matlamat yang sedang kami usahakan", "我们正在努力实现"],
    "Seafood shopping with fewer surprises.": ["Pilih ikan dengan lebih yakin.", "看清详情，放心挑鱼。"],
    "Know the fish": ["Kenali ikan", "了解鱼"],
    "Clear names, origin, preparation and pack details.": ["Nama, asal, cara penyediaan dan butiran pek yang jelas.", "清楚列出名称、来源、处理方式和包装详情。"],
    "Know the full cost": ["Ketahui jumlah kos", "看清全部费用"],
    "Product and delivery costs visible before checkout.": ["Harga produk dan kos penghantaran kelihatan sebelum semakan pesanan.", "结账前就能看到商品价格和配送费用。"],
    "Know what to expect": ["Ketahui apa yang boleh dijangka", "了解后续安排"],
    "Straight answers on handling, timing and help when something goes wrong.": ["Jawapan yang terus terang tentang pengendalian, masa penghantaran dan bantuan jika timbul masalah.", "清楚说明处理方式、配送时间，以及出现问题时如何获得帮助。"],
    "Come see what we are building": ["Lihat kedai contoh", "看看店铺示例"],
    "From Semporna, with care.": ["Kedai Ikanza sedang disiapkan.", "Ikanza 店铺正在筹备。"],
    "Explore the storefront while the fish list and delivery arrangements are being confirmed. Ikanza is not yet taking orders; current listings, prices and checkout are illustrative.": ["Lihat kedai contoh sementara senarai ikan dan aturan penghantaran disahkan. Ikanza belum menerima pesanan; produk, harga dan halaman semak pesanan di sini hanyalah contoh.", "鱼类清单和送货安排仍待确认，欢迎先看看店铺。Ikanza 暂未接单；当前商品、价格和订单核对页仅作示例。"],
    "Seafood should feel easy to choose, order and enjoy.": ["Memilih, memesan dan menikmati makanan laut sepatutnya mudah.", "挑选、订购和享用海鲜，本该轻松简单。"],
    "The idea": ["Idea Ikanza", "Ikanza 的想法"],
    "Our starting point is simple: make it easier for households to understand the fish they are choosing and the full cost of getting it home.": ["Titik permulaan kami mudah: memudahkan isi rumah memahami ikan yang dipilih dan jumlah kos untuk menghantarnya ke rumah.", "我们的出发点很简单：让家庭更容易了解所选的鱼，以及送货到家的全部费用。"],
    "Clear species, weights, cuts and prices": ["Spesies, berat, potongan dan harga yang jelas", "清楚列出鱼种、重量、切割方式和价格"],
    "Published delivery coverage and quality process": ["Liputan penghantaran dan proses kualiti yang diterbitkan", "公开配送范围与品质处理流程"],

    "Answers before checkout.": ["Soalan lazim sebelum membeli.", "下单前，先看看常见问题。"],
    "We are finalising delivery and product handling. Here is what is known, and what will be confirmed before orders open.": ["Kami sedang memuktamadkan penghantaran dan pengendalian produk. Berikut perkara yang sudah diketahui dan yang akan disahkan sebelum pesanan dibuka.", "配送和产品处理方式仍在敲定。以下说明目前已知事项，以及开放下单前还需确认的内容。"],
    "Where will Ikanza deliver?": ["Kawasan mana akan menerima penghantaran?", "未来会送货到哪些地区？"],
    "We are planning for Peninsular Malaysia. Coverage, postcodes, delivery frequency and charges will be published before orders open. The checkout preview uses sample areas and fees.": ["Kami merancang penghantaran ke Semenanjung Malaysia. Kawasan, poskod, kekerapan dan caj sebenar akan diumumkan sebelum pesanan dibuka. Kawasan dan caj pada halaman semak pesanan hanyalah contoh.", "我们计划送货到马来西亚半岛。实际送货地区、邮编、频率和运费会在开放下单前公布。订单核对页目前使用示例地区和费用。"],
    "When would my fish arrive?": ["Bilakah ikan saya akan tiba?", "鱼什么时候会送到？"],
    "Delivery dates are not confirmed yet. The dates shown in checkout are examples; actual estimates and order cutoffs will be shown before payment is enabled.": ["Tarikh penghantaran belum disahkan. Tarikh yang dipaparkan hanyalah contoh. Anggaran ketibaan dan waktu akhir pesanan sebenar akan diumumkan sebelum pembayaran dibuka.", "送货日期尚未确认。页面上的日期仅作示例；实际预计送达时间和截单时间会在开放付款前公布。"],
    "Will the fish be chilled or frozen?": ["Adakah ikan disejukkan atau dibekukan?", "鱼是冷藏还是冷冻的？"],
    "The product condition and packing method have not been confirmed. Each live listing will state these details clearly.": ["Keadaan ikan dan cara pembungkusan belum disahkan. Butiran ini akan dinyatakan pada produk sebenar.", "鱼的状态和包装方式尚未确认。正式商品页面会列明这些详情。"],
    "Are these the Semporna partner’s actual products?": ["Adakah ini produk sebenar daripada rakan di Semporna?", "这些是仙本那合作伙伴的实际商品吗？"],
    "Not yet. The images, species, pack sizes and prices are illustrative. We will list real products only after the partner confirms the fish, source, condition, size, price and availability.": ["Belum. Imej, jenis ikan, saiz pek dan harga hanyalah contoh. Produk sebenar hanya akan disenaraikan selepas rakan kami mengesahkan jenis ikan, sumber, keadaan, saiz, harga dan ketersediaannya.", "还不是。图片、鱼种、包装规格和价格仅作示例。合作伙伴确认鱼种、来源、状态、规格、价格和供应情况后，我们才会列出实际商品。"],
    "Will every fish be available each week?": ["Adakah semua jenis ikan tersedia setiap minggu?", "每种鱼每周都会有货吗？"],
    "Wild-caught supply can change. Live listings will need current availability and pack details confirmed before a customer orders.": ["Bekalan ikan tangkapan liar boleh berubah. Sebelum pelanggan membuat pesanan, senarai produk sebenar perlu menyatakan bekalan semasa dan butiran pek yang telah disahkan.", "野生捕捞鱼类的供应会变化。顾客下单前，正式商品页面须确认当前库存和包装详情。"],
    "What if there is a problem with an order?": ["Bagaimana jika ada masalah dengan pesanan?", "如果订单出现问题怎么办？"],
    "We will publish contact details and a clear process for missing, damaged or incorrect seafood before taking orders. There are no real purchases or refunds through this preview.": ["Kami akan menerbitkan butiran hubungan serta proses yang jelas untuk makanan laut yang hilang, rosak atau tersalah hantar sebelum menerima pesanan. Tiada pembelian atau bayaran balik sebenar melalui pratonton ini.", "接单前，我们会公布联系方式及处理漏发、损坏或错发海鲜的明确流程。此预览不涉及真实购买或退款。"],
    "Can I pay here?": ["Bolehkah saya membayar di sini?", "可以在这里付款吗？"],
    "No. Orders are not open. The checkout preview does not collect payment details or send an order.": ["Tidak. Pesanan belum dibuka. Halaman semak pesanan contoh tidak meminta maklumat bayaran atau menghantar pesanan.", "不能。目前尚未开放下单。示例订单页面不会收集付款资料或提交订单。"],
    "Contact details, full terms and privacy information will be published before any live selling.": ["Butiran hubungan, terma jualan dan notis privasi penuh untuk kedai sebenar akan diterbitkan sebelum jualan bermula.", "正式销售前，我们会公布联系方式、销售条款和正式隐私声明。"],
    "The operator's contact details, full terms and a live-service privacy notice will be published before orders open.": ["Butiran hubungan pengendali, terma penuh dan notis privasi untuk perkhidmatan sebenar akan diterbitkan sebelum pesanan dibuka.", "开放真实订单前，我们会公布经营者的联系方式、完整条款和正式服务的隐私声明。"],
    "Sample details filled. Nothing was submitted.": ["Maklumat contoh diisi. Tiada apa-apa dihantar.", "已填入示例资料，未提交任何内容。"],
    "Preview bag updated.": ["Troli contoh dikemas kini.", "示例购物车已更新。"],
    "Item removed from preview bag.": ["Produk dikeluarkan daripada troli contoh.", "商品已从示例购物车移除。"],
    "Sample confirmation shown. No payment or real order was made.": ["Pengesahan contoh dipaparkan. Tiada bayaran atau pesanan sebenar dibuat.", "已显示示例确认页面，没有付款或提交真实订单。"],
    "Track this preview": ["Lihat contoh penjejakan", "查看送货进度示例"],
    "View account preview": ["Lihat akaun contoh", "查看示例账户"],
    "Illustrative customer journey": ["Contoh pengalaman pelanggan", "顾客体验示例"],
    "A seafood dinner, with the details clear from the start.": ["Makan malam makanan laut, dengan butiran jelas sejak awal.", "一顿海鲜晚餐，从一开始就清楚明白。"],
    "Picture a household in Peninsular Malaysia planning a weekend meal. They compare fish names and pack sizes, check the full sample total with delivery, and review the details before deciding. That is the shopping experience Ikanza is exploring with a Semporna partner who buys wild-caught fish from small local fishers.": ["Bayangkan sebuah keluarga di Semenanjung Malaysia merancang hidangan hujung minggu. Mereka membandingkan nama ikan dan saiz pek, menyemak jumlah contoh termasuk penghantaran, kemudian meneliti butiran sebelum membuat keputusan. Itulah pengalaman membeli-belah yang sedang diteroka Ikanza bersama rakan Semporna yang membeli ikan tangkapan liar daripada nelayan kecil tempatan.", "想象马来西亚半岛的一家人计划周末聚餐：他们比较鱼名和包装规格，查看含运费的示例总额，再核对详情后作决定。这是 Ikanza 正与仙本那合作伙伴探索的购物体验；该伙伴向当地小规模渔民收购野生捕捞的鱼。"],
    "See the customer story": ["Lihat contoh pengalaman", "看看体验示例"],
    "This is an illustrative journey, not a customer testimonial. Products, prices, delivery and order availability are still being confirmed.": ["Ini perjalanan sebagai ilustrasi, bukan testimoni pelanggan. Produk, harga, penghantaran dan ketersediaan pesanan masih disahkan.", "此体验仅为示意，并非顾客评价。商品、价格、配送及开放下单时间仍在确认中。"],
    "A seafood dinner, with every detail in view.": ["Makan malam makanan laut, dengan setiap butiran jelas.", "海鲜晚餐的每一步，都清清楚楚。"],
    "This story shows the experience we want to build. It does not describe a real customer or delivery.": ["Kisah ini menggambarkan pengalaman yang ingin kami bina. Ia bukan tentang pelanggan atau penghantaran sebenar.", "这个故事展示我们希望打造的体验，并非真实顾客或配送记录。"],
    "A future family meal": ["Hidangan keluarga pada masa depan", "未来的一顿家庭餐"],
    "From choosing fish to planning delivery.": ["Daripada memilih ikan hingga merancang penghantaran.", "从挑鱼到安排配送。"],
    "Picture a household planning a weekend dinner. They want to know what fish they can buy, how much is in the pack and what it will cost to reach their home.": ["Bayangkan sebuah keluarga merancang makan malam hujung minggu. Mereka ingin tahu ikan yang boleh dibeli, kuantiti dalam pek dan jumlah kos untuk menghantarnya ke rumah.", "想象一家人正在计划周末晚餐。他们想知道可以买到什么鱼、每包有多少，以及送货到家的总费用。"],
    "Choose with confidence": ["Pilih dengan yakin", "安心挑选"],
    "They compare fish names, pack weights and preparation details in one place.": ["Mereka membandingkan nama ikan, berat pek dan butiran penyediaan di satu tempat.", "他们在同一处比较鱼名、包装重量和处理方式。"],
    "See the full cost": ["Lihat jumlah kos", "看清全部费用"],
    "They review the item total, delivery area and charge before deciding.": ["Mereka menyemak jumlah harga produk, kawasan penghantaran dan caj sebelum membuat pilihan.", "他们在决定前查看商品总额、配送区域和运费。"],
    "Follow the journey": ["Ikuti perjalanan pesanan", "追踪配送进度"],
    "Once real orders open, their account could show each delivery update from preparation to arrival.": ["Apabila pesanan sebenar dibuka, akaun mereka boleh memaparkan setiap kemas kini penghantaran dari penyediaan hingga ketibaan.", "正式开放下单后，他们可以在账户中查看从备货到送达的每次配送更新。"],
    "That is the Ikanza experience we are working toward.": ["Itulah pengalaman Ikanza yang sedang kami usahakan.", "这就是我们努力打造的 Ikanza 体验。"],
    "There are no real customer stories yet. We will add genuine feedback with the customer’s permission after deliveries begin.": ["Belum ada kisah pelanggan sebenar. Jika penghantaran sudah bermula, maklum balas hanya akan dikongsi dengan izin pelanggan.", "目前没有真实顾客故事。送货服务开始后，只有得到顾客同意才会分享反馈。"],
    "Explore the storefront": ["Lihat kedai contoh", "看看店铺示例"],
    "No checkout previews yet.": ["Belum ada pesanan contoh.", "还没有示例订单。"],
    "Explore a product and try the sample checkout to see a reference here.": ["Pilih produk contoh dan cuba semak pesanan untuk melihat nombor rujukan di sini.", "加入示例商品并试用订单核对流程，这里就会显示示例编号。"],
    "Sample order": ["Pesanan contoh", "示例订单"],
    "Track preview →": ["Lihat penjejakan contoh →", "查看送货示例 →"],
    "Account preview": ["Akaun contoh", "示例账户"],
    "Your Ikanza space.": ["Cuba akaun Ikanza.", "试用 Ikanza 账户。"],
    "Create a sample profile to see how an account and order history could work.": ["Cipta profil contoh untuk melihat cara sejarah pesanan mungkin dipaparkan.", "创建示例资料，看看订单记录未来可能如何显示。"],
    "Create a preview profile": ["Cipta profil contoh", "创建示例资料"],
    "This is stored only in this browser. It does not create a real account, password or email subscription.": ["Nama dan e-mel contoh disimpan dalam pelayar ini sahaja. Tiada akaun sebenar, kata laluan atau langganan e-mel dibuat.", "示例姓名和电邮只保存在此浏览器，不会建立真实账户、密码或邮件订阅。"],
    "I understand this is a browser-only preview profile. I have read": ["Saya faham profil contoh ini hanya disimpan dalam pelayar ini. Saya telah membaca", "我了解此示例资料只保存在本浏览器，并已阅读"],
    "Name": ["Nama", "姓名"],
    "Create preview profile": ["Cipta profil contoh", "创建示例资料"],
    "What an account could do": ["Fungsi akaun pada masa depan", "账户未来可以做什么"],
    "Find order history, review delivery details and follow tracking updates in one place.": ["Lihat sejarah pesanan, butiran penghantaran dan status penjejakan di satu tempat.", "在同一处查看订单记录、送货详情和进度。"],
    "For this preview, entries stay on your device. No email is sent and no account is available on another device.": ["Untuk pratonton ini, maklumat kekal pada peranti anda. Tiada e-mel dihantar dan akaun ini tidak tersedia pada peranti lain.", "在此预览中，资料只保存在您的设备上。不会发送邮件，也无法在其他设备上使用此账户。"],
    "Your sample orders and delivery previews are saved in this browser.": ["Pesanan dan penjejakan contoh disimpan dalam pelayar ini.", "示例订单和送货进度保存在此浏览器。"],
    "Order history preview": ["Sejarah pesanan contoh", "示例订单记录"],
    "Your sample orders": ["Pesanan contoh anda", "您的示例订单"],
    "Preview profile": ["Profil contoh", "示例资料"],
    "This profile is browser-only. There is no password, sign-in or live account yet.": ["Profil ini hanya wujud dalam pelayar. Belum ada kata laluan, log masuk atau akaun sebenar.", "此资料仅存在于浏览器中，目前没有密码、登录功能或真实账户。"],
    "Remove preview profile": ["Padam profil contoh", "删除示例资料"],
    "Example date": ["Tarikh contoh", "示例日期"],
    "No matching preview reference.": ["Nombor contoh tidak ditemui.", "找不到这个示例编号。"],
    "Only references created in this browser and the sample reference can be shown. No courier system is connected.": ["Hanya rujukan yang dicipta dalam pelayar ini dan rujukan contoh boleh dipaparkan. Tiada sistem kurier disambungkan.", "只能显示在此浏览器中生成的编号和内置示例编号；目前未连接任何快递系统。"],
    "Preview created": ["Contoh dibuat", "示例已生成"],
    "Packing at origin": ["Pembungkusan di tempat asal", "产地打包"],
    "Handed to courier": ["Diserahkan kepada kurier", "交给快递公司"],
    "In transit": ["Dalam perjalanan", "运输途中"],
    "Out for delivery": ["Sedang dihantar", "派送中"],
    "Delivered": ["Telah dihantar", "已送达"],
    "Sample tracking": ["Contoh penjejakan", "送货进度示例"],
    "No real shipment exists.": ["Tiada penghantaran sebenar.", "没有真实配送。"],
    "The first step shows a preview reference; the remaining steps show the type of updates a real courier could provide.": ["Langkah pertama menunjukkan nombor contoh. Langkah seterusnya hanya menggambarkan kemas kini yang mungkin diberikan kurier selepas perkhidmatan bermula.", "第一步显示示例编号；其余步骤只展示未来可能出现的快递更新。"],
    "Preview reference shown in this browser.": ["Nombor contoh dipaparkan dalam pelayar ini.", "示例编号显示在此浏览器。"],
    "Example future milestone — no courier update yet.": ["Langkah penghantaran contoh — belum ada kemas kini kurier.", "送货步骤示例——目前没有快递更新。"],
    "Delivery tracking preview": ["Contoh penjejakan penghantaran", "送货进度示例"],
    "Know where things stand.": ["Lihat cara penjejakan berfungsi.", "看看送货进度会如何显示。"],
    "Try a sample reference to see how delivery updates could appear when Ikanza begins taking orders.": ["Cuba nombor rujukan contoh untuk melihat cara status penghantaran mungkin dipaparkan nanti.", "试用示例编号，看看日后的送货进度可能如何显示。"],
    "Track a preview reference": ["Semak nombor rujukan contoh", "查询示例编号"],
    "Enter a reference from this browser’s sample checkout, or open the built-in example.": ["Masukkan nombor daripada pesanan contoh dalam pelayar ini atau gunakan contoh yang disediakan.", "输入此浏览器生成的示例编号，或使用内置示例。"],
    "Show tracking preview": ["Lihat contoh penjejakan", "查看送货进度示例"],
    "Try sample reference": ["Guna nombor contoh", "使用示例编号"],
    "Tracking is a design preview. No carrier is connected, and this site cannot locate a real parcel.": ["Penjejakan ini hanya contoh. Tiada kurier disambungkan dan laman ini tidak boleh menjejak bungkusan sebenar.", "这里展示的只是送货进度示例。网站尚未连接快递公司，无法查询真实包裹。"],
    "Sample profile details filled.": ["Butiran profil contoh diisi.", "已填入示例资料。"],
    "Preview profile removed from this browser.": ["Profil contoh dipadam daripada pelayar ini.", "示例资料已从此浏览器删除。"],
    "Preview profile created in this browser.": ["Profil contoh disimpan dalam pelayar ini.", "示例资料已保存在此浏览器。"],

    // Standalone wholesale preview.
    "Wholesale Seafood Enquiries for Peninsular Malaysia | Ikanza": ["Pertanyaan Borong Makanan Laut Semporna di Semenanjung Malaysia | Ikanza", "马来西亚半岛海鲜批发咨询 | Ikanza"],
    "Explore Ikanza’s wholesale preview for Peninsular kitchens, shaped by a Semporna buyer of wild-caught fish from small fishers. Enquiries are not open yet.": ["Lihat contoh pertanyaan borong Ikanza untuk dapur di Semenanjung Malaysia, bersama pembeli ikan tangkapan liar daripada nelayan kecil di Semporna. Pertanyaan belum dibuka.", "了解 Ikanza 面向马来西亚半岛餐饮业者的批发咨询示例。仙本那的合作伙伴向小规模渔民收购野生捕捞的鱼；目前尚未开放咨询。"],
    "A future wholesale connection to Semporna seafood for Peninsular Malaysian kitchens. Preview the enquiry journey; enquiries are not open yet.": ["Saluran borong makanan laut Semporna untuk dapur di Semenanjung Malaysia sedang dirancang. Borang ini hanya contoh dan belum menghantar pertanyaan.", "面向马来西亚半岛餐饮业者的仙本那海鲜批发渠道仍在筹备。此表单仅作示例，目前无法发送咨询。"],
    "WHOLESALE ENQUIRY PREVIEW": ["CONTOH PERTANYAAN BORONG", "批发咨询示例"],
    "Wholesale": ["Borong", "批发"],
    "For restaurants, hotels & caterers": ["Untuk restoran, hotel dan katering", "面向餐厅、酒店和餐饮业者"],
    "A closer connection to Semporna seafood, built for your kitchen.": ["Keperluan dapur anda, terus kepada perkara penting.", "先谈清楚厨房的采购需要。"],
    "Our Semporna partner buys wild-caught fish from small local fishers and sells it beyond the area. Ikanza is exploring how restaurants, hotels and caterers in Peninsular Malaysia could see clear species, pack and delivery details before buying. For now, you can preview the enquiry journey.": ["Rakan kami di Semporna membeli ikan tangkapan liar daripada nelayan kecil tempatan dan menjualnya ke luar kawasan. Ikanza sedang meneroka cara restoran, hotel dan katering di Semenanjung Malaysia dapat melihat jenis ikan, butiran pek dan penghantaran dengan jelas sebelum membeli. Buat masa ini, cuba lihat aliran pertanyaan contoh.", "仙本那的合作伙伴向当地小规模渔民收购野生捕捞的鱼，再销往外地。Ikanza 正探索如何让马来西亚半岛的餐厅、酒店及餐饮业者在采购前看清鱼种、包装和送货详情。目前可先试用咨询流程示例。"],
    "Preview a wholesale enquiry": ["Cuba borang pertanyaan", "试用咨询表单"],
    "Read our story": ["Baca kisah kami", "阅读我们的故事"],
    "Preview only. No business enquiry is sent from this page.": ["Borang contoh sahaja. Tiada pertanyaan dihantar daripada halaman ini.", "表单仅作示例。此页面不会发送咨询。"],
    "From Semporna": ["Dari Semporna", "来自仙本那"],
    "to more menus": ["ke lebih banyak menu", "走进更多菜单"],
    "Illustrative imagery; no supplier product list is confirmed.": ["Imej hanya ilustrasi; senarai produk pembekal belum disahkan.", "图片仅供示意；供应商商品清单尚未确认。"],
    "A better sourcing conversation": ["Berbincang tentang bekalan", "谈谈采购需求"],
    "Good decisions start with good details.": ["Semak butiran sebelum membuat keputusan.", "决定前，先把细节问清楚。"],
    "Every kitchen has its own needs. We are shaping a wholesale experience around the questions that matter before a buyer commits.": ["Setiap dapur memerlukan jenis ikan, kuantiti dan jadual yang berbeza. Borang contoh ini menunjukkan maklumat yang boleh dibincangkan apabila pertanyaan dibuka.", "每个厨房需要的鱼种、数量和订购时间都不同。这个示例表单列出正式开放咨询后可以讨论的细节。"],
    "Your menu comes first": ["Menu anda diutamakan", "从您的菜单需求出发"],
    "Tell us the fish, preparation, quantity and ordering rhythm your business would consider.": ["Nyatakan jenis ikan, cara penyediaan, kuantiti dan kekerapan yang diperlukan.", "列出所需鱼种、处理方式、采购量和订购频率。"],
    "The facts on the table": ["Maklumat yang jelas untuk dinilai", "把关键信息摆在桌面上"],
    "Confirmed species, condition, pack sizes, availability and prices should be clear before a decision.": ["Spesies, keadaan produk, saiz pek, ketersediaan dan harga yang disahkan perlu jelas sebelum membuat keputusan.", "作决定前，应清楚了解已确认的鱼种、产品状态、包装规格、供应情况和价格。"],
    "A route that makes sense": ["Maklumat penghantaran", "送货安排"],
    "Coverage, handling, timing and support will be explained when the delivery arrangements are ready.": ["Kawasan liputan, pengendalian, masa penghantaran dan bantuan akan diterangkan setelah aturan penghantaran disahkan.", "送货安排确认后，我们会说明地区、处理方式、时间和售后支持。"],
    "Wholesale enquiry preview": ["Borang pertanyaan borong contoh", "批发咨询表单示例"],
    "What could Ikanza bring to your menu?": ["Apa yang dapur anda perlukan?", "您的厨房需要什么？"],
    "Show us the shape of your kitchen’s needs. This preview demonstrates the future enquiry flow while the fish list, supply, pricing and delivery route are being confirmed.": ["Nyatakan keperluan dapur anda di bawah. Borang ini menunjukkan contoh aliran pertanyaan sementara senarai ikan, bekalan, harga dan laluan penghantaran disahkan.", "欢迎在下方填写厨房的采购需求示例。鱼类清单、供应、价格和送货路线仍待确认；此表单只展示未来的咨询流程。"],
    "Describe your needs.": ["Terangkan keperluan anda.", "描述您的需求。"],
    "Choose the type of business, area, seafood interest and expected volume.": ["Pilih jenis perniagaan, kawasan, makanan laut yang diminati dan anggaran kuantiti.", "选择企业类型、所在地区、感兴趣的海鲜及预计采购量。"],
    "See a sample confirmation.": ["Lihat pengesahan contoh.", "查看示例确认。"],
    "The preview clears your entries immediately afterward.": ["Maklumat yang diisi akan dikosongkan selepas contoh pengesahan dipaparkan.", "显示示例确认页后，表单内容会立即清空。"],
    "Connect later.": ["Hubungi kami kemudian.", "稍后再联系。"],
    "A real contact route will be published when wholesale enquiries open.": ["Saluran hubungan sebenar akan diterbitkan apabila pertanyaan borong dibuka.", "批发咨询开放时，我们会公布正式的联系渠道。"],
    "Current wholesale status": ["Status borong semasa", "当前批发业务状态"],
    "Opening later": ["Akan dibuka kemudian", "稍后开放"],
    "Where things stand": ["Keadaan semasa", "目前进展"],
    "No wholesale catalogue, stock, prices or delivery schedule is confirmed yet. There is no way to send an enquiry through this preview.": ["Senarai borong, stok, harga dan jadual penghantaran belum disahkan. Borang ini belum boleh menghantar pertanyaan.", "批发商品、库存、价格和送货时间表尚未确认。此表单目前无法发送咨询。"],
    "Try the experience": ["Cuba borang contoh", "试用示例表单"],
    "Your wholesale brief": ["Keperluan borong anda", "您的批发采购需求"],
    "Preview only:": ["Borang contoh:", "示例表单："],
    "Nothing entered here is sent to Ikanza or saved by this page. Please use sample information.": ["Maklumat di sini tidak dihantar kepada Ikanza atau disimpan oleh halaman ini. Gunakan maklumat contoh sahaja.", "填写内容不会发送给 Ikanza，也不会由此页面保存。请只使用示例资料。"],
    "Your name": ["Nama anda", "您的姓名"],
    "Business name": ["Nama perniagaan", "企业名称"],
    "Work email": ["E-mel kerja", "工作邮箱"],
    "Business type": ["Jenis perniagaan", "企业类型"],
    "Select a business type": ["Pilih jenis perniagaan", "选择企业类型"],
    "Restaurant": ["Restoran", "餐厅"],
    "Hotel": ["Hotel", "酒店"],
    "Caterer": ["Penyedia katering", "餐饮承办商"],
    "Other food business": ["Perniagaan makanan lain", "其他餐饮企业"],
    "Operating area": ["Kawasan operasi", "经营地区"],
    "City or area in Peninsular Malaysia": ["Bandar atau kawasan di Semenanjung Malaysia", "马来西亚半岛的城市或地区"],
    "Seafood you are looking for": ["Jenis makanan laut diperlukan", "想采购的海鲜"],
    "Species, format or dishes you have in mind": ["Jenis ikan, bentuk produk atau hidangan", "鱼种、产品形式或菜肴"],
    "Approximate quantity": ["Anggaran kuantiti", "预计数量"],
    "e.g. 20 kg per order": ["cth. 20 kg setiap pesanan", "例如每单 20 公斤"],
    "Expected frequency": ["Kekerapan yang dijangka", "预计订购频率"],
    "Select a frequency": ["Pilih kekerapan", "选择频率"],
    "Weekly": ["Setiap minggu", "每周"],
    "Every two weeks": ["Setiap dua minggu", "每两周"],
    "Monthly": ["Setiap bulan", "每月"],
    "One event or occasion": ["Untuk satu acara atau majlis", "单次活动或场合"],
    "Still exploring": ["Masih meninjau", "仍在了解"],
    "Anything else we should know?": ["Maklumat tambahan", "其他需求"],
    "Optional": ["Tidak wajib", "选填"],
    "Preparation, timing or questions for a future conversation": ["Penyediaan, masa atau soalan untuk perbincangan akan datang", "处理方式、时间安排或未来沟通时想问的问题"],
    "* Required for the sample preview": ["* Wajib untuk borang contoh", "* 示例表单必填"],
    "This button displays a local preview. It does not contact Ikanza.": ["Butang ini hanya memaparkan contoh pada peranti anda. Ia tidak menghubungi Ikanza.", "此按钮只会在您的设备上显示示例，不会联系 Ikanza。"],
    "Your preview is complete.": ["Contoh pertanyaan selesai.", "咨询示例已完成。"],
    "No enquiry was sent, no reply is expected, and the details you entered have been cleared from the form. When Ikanza opens wholesale enquiries, this is where you would receive a real confirmation and next steps.": ["Tiada pertanyaan dihantar, jadi tiada balasan akan diterima. Maklumat yang diisi telah dikosongkan. Apabila pertanyaan borong dibuka, pengesahan sebenar dan langkah seterusnya akan dipaparkan di sini.", "咨询没有发送，因此不会收到回复；您填写的内容已清空。正式开放批发咨询后，这里会显示确认和下一步安排。"],
    "Try the preview again": ["Cuba sekali lagi", "再试一次"],
    "Built around your kitchen": ["Dibina mengikut keperluan dapur anda", "围绕您的厨房需求打造"],
    "A clearer connection begins here.": ["Kenali Ikanza sementara butiran borong disediakan.", "批发详情筹备中，先了解 Ikanza。"],
    "Explore the Ikanza story and the storefront preview while real wholesale details are being prepared.": ["Baca kisah Ikanza dan lihat kedai contoh sementara butiran borong sebenar disediakan.", "批发详情仍在准备，欢迎先了解 Ikanza 的故事和店铺示例。"],
    "© Ikanza. Preview storefront; no orders or enquiries.": ["© Ikanza. Kedai contoh; tiada pesanan atau pertanyaan diterima.", "© Ikanza。店铺展示；目前不接受订单或咨询。"],

    // Values inserted by the page's sample-fill button.
    "Example Buyer": ["Pembeli Contoh", "示例采购员"],
    "Example Kitchen": ["Dapur Contoh", "示例厨房"],
    "Whole fish for shared mains": ["Ikan seekor untuk hidangan utama berkongsi", "适合共享主菜的整鱼"],
    "20 kg per order": ["20 kg setiap pesanan", "每单 20 公斤"],
    "Interested in confirmed species, preparation and delivery terms when available.": ["Berminat untuk mengetahui spesies, cara penyediaan dan syarat penghantaran yang disahkan apabila tersedia.", "希望在信息确认后了解鱼种、处理方式及配送条款。"],

    // Seven-product catalogue, sizes and search.
    "Grouper": ["Kerapu", "石斑鱼"],
    "Indian mackerel": ["Ikan kembung", "印度鲭鱼"],
    "Fresh prawns": ["Udang", "虾"],
    "Whole squid": ["Sotong seekor", "整只鱿鱼"],
    "Flower crab": ["Ketam bunga", "花蟹"],
    "Golden pomfret": ["Ikan bawal emas", "金鲳鱼"],
    "Spanish mackerel": ["Ikan tenggiri", "马鲛鱼"],
    "Fourfinger threadfin": ["Ikan senangin", "午鱼"],
    "Torpedo scad": ["Ikan cencaru", "硬尾鱼"],
    "Sardine": ["Ikan sardin", "沙丁鱼"],
    "Threadfin bream": ["Ikan kerisi", "金线鱼"],
    "White prawns": ["Udang putih", "白虾"],
    "Tiger prawns": ["Udang harimau", "老虎虾"],
    "Red prawns": ["Udang merah", "红虾"],
    "Rainbow prawns": ["Udang bunga", "花虾"],
    "White squid": ["Sotong putih", "白鱿鱼"],
    "Baby squid": ["Sotong kecil", "小苏东"],
    "Cuttlefish": ["Sotong katak", "墨鱼"],
    "Baby cuttlefish": ["Sotong katak kecil", "小墨鱼"],
    "Female flower crab": ["Ketam bunga betina", "母花蟹"],
    "Mud crab": ["Ketam nipah", "肉蟹"],
    "Soft-shell crab": ["Ketam kulit lembut", "软壳蟹"],
    "Flower crab meat": ["Isi ketam bunga", "花蟹肉"],
    "Ikan kerapu": ["Ikan kerapu", "Ikan kerapu（石斑鱼）"],
    "Ikan kembung": ["Ikan kembung", "Ikan kembung（印度鲭鱼）"],
    "Ikan merah": ["Ikan merah", "Ikan merah（红鱼）"],
    "Siakap": ["Siakap", "Siakap（金目鲈）"],
    "Udang": ["Udang", "Udang（虾）"],
    "Sotong": ["Sotong", "Sotong（鱿鱼）"],
    "Ketam bunga": ["Ketam bunga", "Ketam bunga（花蟹）"],
    "Kerapu": ["Kerapu", "Kerapu（石斑鱼）"],
    "Ikan bawal emas": ["Ikan bawal emas", "Ikan bawal emas（金鲳鱼）"],
    "Ikan tenggiri": ["Ikan tenggiri", "Ikan tenggiri（马鲛鱼）"],
    "Ikan senangin": ["Ikan senangin", "Ikan senangin（午鱼）"],
    "Ikan cencaru": ["Ikan cencaru", "Ikan cencaru（硬尾鱼）"],
    "Ikan sardin": ["Ikan sardin", "Ikan sardin（沙丁鱼）"],
    "Ikan kerisi": ["Ikan kerisi", "Ikan kerisi（金线鱼）"],
    "Udang putih": ["Udang putih", "Udang putih（白虾）"],
    "Udang harimau": ["Udang harimau", "Udang harimau（老虎虾）"],
    "Udang merah": ["Udang merah", "Udang merah（红虾）"],
    "Udang bunga": ["Udang bunga", "Udang bunga（花虾）"],
    "Sotong putih": ["Sotong putih", "Sotong putih（白鱿鱼）"],
    "Sotong kecil": ["Sotong kecil", "Sotong kecil（小苏东）"],
    "Sotong katak": ["Sotong katak", "Sotong katak（墨鱼）"],
    "Sotong katak kecil": ["Sotong katak kecil", "Sotong katak kecil（小墨鱼）"],
    "Ketam bunga betina": ["Ketam bunga betina", "Ketam bunga betina（母花蟹）"],
    "Ketam nipah": ["Ketam nipah", "Ketam nipah（肉蟹）"],
    "Ketam kulit lembut": ["Ketam kulit lembut", "Ketam kulit lembut（软壳蟹）"],
    "Isi ketam bunga": ["Isi ketam bunga", "Isi ketam bunga（花蟹肉）"],
    "Whole fish": ["Ikan seekor", "整鱼"],
    "Whole prawns": ["Udang seekor", "整只虾"],
    "Whole crab": ["Ketam seekor", "整蟹"],
    "Whole cuttlefish": ["Sotong katak seekor", "整只墨鱼"],
    "Fish cut": ["Potongan ikan", "鱼切块"],
    "Picked meat": ["Isi ketam", "蟹肉"],
    "Whole prawns example": ["Contoh udang utuh", "整虾示例"],
    "Whole squid example": ["Contoh sotong seekor", "整只鱿鱼示例"],
    "Whole crab example": ["Contoh ketam seekor", "整蟹示例"],
    "Whole cuttlefish example": ["Contoh sotong katak seekor", "整只墨鱼示例"],
    "Fish cut example": ["Contoh potongan ikan", "鱼切块示例"],
    "Picked meat example": ["Contoh isi ketam", "蟹肉示例"],
    "Everyday favourite": ["Pilihan harian", "日常之选"],
    "Sweet & versatile": ["Manis & serba guna", "鲜甜，做法多样"],
    "Tender & savoury": ["Lembut & enak", "鲜嫩可口"],
    "Sweet & delicate": ["Manis & halus", "鲜甜细腻"],
    "Silky & mild": ["Lembut dan ringan", "肉质细嫩，味道清淡"],
    "Firm & savoury": ["Isi pejal dan enak", "肉质紧实，鲜味足"],
    "Delicate & flaky": ["Isi lembut dan mudah lerai", "肉质细嫩，容易分片"],
    "Bold & satisfying": ["Rasa lebih kuat", "味道浓郁"],
    "Rich & savoury": ["Kaya rasa", "鲜香浓郁"],
    "Light & sweet": ["Ringan dan manis", "味道清甜"],
    "Gentle & sweet": ["Lembut dan manis", "味道清甜"],
    "Meaty & sweet": ["Isi tebal dan manis", "肉质饱满，味道鲜甜"],
    "Rich & sweet": ["Kaya rasa dan manis", "鲜甜浓郁"],
    "Sweet & firm": ["Manis dan pejal", "鲜甜紧实"],
    "Mild & tender": ["Ringan dan lembut", "味道清淡，口感软嫩"],
    "Small & savoury": ["Kecil dan enak", "个头小，鲜味足"],
    "Bite-sized & tender": ["Kecil dan lembut", "小巧软嫩"],
    "Meaty & rich": ["Isi tebal dan kaya rasa", "蟹肉饱满，味道浓郁"],
    "Crisp when fried": ["Rangup apabila digoreng", "油炸后香脆"],
    "Ready for the pan": ["Mudah dimasak", "下锅方便"],
    "A firm fish often enjoyed steamed with ginger or roasted.": ["Ikan berisi pejal yang sering dinikmati kukus bersama halia atau dipanggang.", "肉质紧实，常用姜清蒸或烤制。"],
    "A mild fish suited to steaming, baking or pan-searing.": ["Ikan berasa lembut yang sesuai dikukus, dibakar atau digoreng dalam kuali.", "味道清淡，适合清蒸、烘烤或香煎。"],
    "A clean flavour that works well in shared dishes.": ["Rasa segar yang sesuai untuk hidangan yang dinikmati bersama.", "味道清爽，适合与家人朋友分享。"],
    "An everyday fish that is lovely fried, grilled or cooked in curry.": ["Ikan kegemaran harian yang enak digoreng, dibakar atau dimasak kari.", "家常鱼类，适合油炸、烧烤或煮咖喱。"],
    "A versatile seafood favourite for stir-fries, noodles and grilling.": ["Makanan laut kegemaran yang serba guna untuk tumisan, mi dan panggangan.", "做法多样的海鲜佳选，适合快炒、配面或烧烤。"],
    "A versatile option for quick cooking, grilling or sambal.": ["Pilihan serba guna untuk masakan ringkas, panggangan atau sambal.", "适合快炒、烧烤或做叁巴酱料理。"],
    "A seafood favourite for curry, steaming and shared meals.": ["Makanan laut kegemaran untuk kari, kukus dan hidangan bersama.", "适合做咖喱、清蒸，也适合多人共享。"],
    "A whole fish for ginger steaming or a crisp pan-fry.": ["Ikan seekor yang sesuai dikukus dengan halia atau digoreng garing.", "整鱼适合姜蒸，也可煎至香脆。"],
    "A meaty cut for curry, asam pedas or a quick sear.": ["Potongan isi tebal untuk kari, asam pedas atau digoreng ringkas.", "厚实鱼块适合煮咖喱、亚参辣汤或香煎。"],
    "A local favourite for steaming, frying or fish curry.": ["Pilihan tempatan yang sesuai dikukus, digoreng atau dimasak kari.", "适合清蒸、油炸或煮鱼咖喱。"],
    "Score, stuff with sambal and grill for a familiar dinner.": ["Kelarkan ikan, isi sambal dan bakar untuk hidangan yang biasa dinikmati di rumah.", "划刀后塞入叁巴酱烧烤，是熟悉的家常做法。"],
    "Small whole fish suited to frying or a tomato sambal.": ["Ikan kecil seekor yang sesuai digoreng atau dimasak sambal tomato.", "小整鱼适合油炸或煮番茄叁巴。"],
    "Good for a quick fry or a comforting fish soup.": ["Sesuai digoreng ringkas atau dimasak sup ikan.", "适合快煎或煮一锅鱼汤。"],
    "Easy to add to fried rice, noodles or tomyam.": ["Sesuai untuk nasi goreng, mi atau tomyam.", "适合加入炒饭、面食或冬阴功汤。"],
    "A larger prawn for grilling, butter sauce or a sharing platter.": ["Udang yang lebih besar, sesuai dibakar, dimasak sos mentega atau dikongsi bersama.", "较大的虾，适合烧烤、奶油酱料理或共享拼盘。"],
    "Try them steamed or tossed through a chilli garlic sauce.": ["Cuba kukus atau gaul dengan sos cili dan bawang putih.", "可清蒸，也可拌入蒜香辣椒酱。"],
    "A colourful pick for prawn noodles, steaming or stir-fry.": ["Sesuai untuk mi udang, kukus atau tumis.", "适合做虾面、清蒸或快炒。"],
    "Quick to cook in sambal, on a grill or in a stir-fry.": ["Cepat dimasak bersama sambal, dibakar atau ditumis.", "适合做叁巴、烧烤或快炒。"],
    "Great for a fast sambal tumis or a crisp flour fry.": ["Sesuai ditumis bersama sambal atau digoreng tepung hingga rangup.", "适合快炒叁巴，或裹粉炸至香脆。"],
    "Slice for a quick stir-fry or cook with a rich sambal.": ["Hiris untuk tumisan ringkas atau masak bersama sambal.", "切片快炒，或煮成香浓叁巴。"],
    "A small cuttlefish for sambal, frying or a quick stir-fry.": ["Sotong katak kecil yang sesuai dimasak sambal, digoreng atau ditumis ringkas.", "小墨鱼适合做叁巴、油炸或快炒。"],
    "A flower crab choice for steaming or a family curry.": ["Ketam bunga yang sesuai dikukus atau dimasak kari untuk keluarga.", "花蟹适合清蒸或煮成一家人共享的咖喱。"],
    "A substantial crab for chilli sauce or ginger and spring onion.": ["Ketam berisi untuk sos cili atau masakan halia dan daun bawang.", "肉蟹适合辣椒酱或姜葱做法。"],
    "Fry whole for a crunchy seafood plate or burger.": ["Goreng seekor untuk hidangan rangup atau burger makanan laut.", "整只炸至香脆，可配成海鲜餐或汉堡。"],
    "Add to fried rice, omelettes or a quick crab soup.": ["Masukkan ke dalam nasi goreng, telur dadar atau sup ketam ringkas.", "可加入炒饭、煎蛋或快煮蟹肉汤。"],
    "All seafood": ["Semua makanan laut", "全部海鲜"],
    "Premium fish": ["Ikan premium", "优质鱼类"],
    "Everyday fish": ["Ikan harian", "日常鱼类"],
    "Prawns": ["Udang", "虾类"],
    "Squid": ["Sotong", "鱿鱼"],
    "Squid & cuttlefish": ["Sotong dan sotong katak", "鱿鱼与墨鱼"],
    "Crab": ["Ketam", "螃蟹"],
    "Small": ["Kecil", "小"],
    "Medium": ["Sederhana", "中"],
    "Large": ["Besar", "大"],
    "Small pack": ["Pek kecil", "小包装"],
    "Medium pack": ["Pek sederhana", "中包装"],
    "Large pack": ["Pek besar", "大包装"],
    "500 g pack": ["Pek 500 g", "500 克装"],
    "1 kg pack": ["Pek 1 kg", "1 公斤装"],
    "Large whole fish": ["Ikan seekor saiz besar", "大整鱼"],
    "500 g cut": ["Potongan 500 g", "500 克鱼切块"],
    "1 kg cut": ["Potongan 1 kg", "1 公斤鱼切块"],
    "500 g portion": ["Bahagian 500 g", "500 克份"],
    "1 kg portion": ["Bahagian 1 kg", "1 公斤份"],
    "600–900 g": ["600–900 g", "600–900 克"],
    "1.2–1.5 kg": ["1.2–1.5 kg", "1.2–1.5 公斤"],
    "400–600 g": ["400–600 g", "400–600 克"],
    "600–800 g": ["600–800 g", "600–800 克"],
    "700–900 g": ["700–900 g", "700–900 克"],
    "900 g–1.1 kg": ["900 g–1.1 kg", "900 克–1.1 公斤"],
    "1.1–1.3 kg": ["1.1–1.3 kg", "1.1–1.3 公斤"],
    "1.3–1.5 kg": ["1.3–1.5 kg", "1.3–1.5 公斤"],
    "1.4–1.6 kg": ["1.4–1.6 kg", "1.4–1.6 公斤"],
    "500 g": ["500 g", "500 克"],
    "1 kg": ["1 kg", "1 公斤"],
    "Example market prices.": ["Harga pasaran contoh.", "市场参考价格。"],
    "Guide prices checked against Malaysian shops on 29 October 2026.": ["Harga panduan dibandingkan dengan kedai di Malaysia pada 29 Oktober 2026.", "参考价格于 2026 年 10 月 29 日对照马来西亚商店资料。"],
    "See the market listing on each product page, or browse": ["Lihat pautan penjual pada setiap halaman produk, atau semak", "可查看各商品页面的商家链接，也可浏览"],
    "PasarHub seafood": ["makanan laut PasarHub", "PasarHub 海鲜"],
    "MySeafoodMart shellfish": ["kerang-kerangan MySeafoodMart", "MySeafoodMart 贝类"],
    ". Some pack weights and prices are estimates. The Semporna partner has not confirmed a sale catalogue, stock, preparation, condition, delivery or Ikanza prices.": [". Sebahagian berat pek dan harga ialah anggaran. Rakan di Semporna belum mengesahkan senarai produk untuk dijual, stok, cara penyediaan, keadaan ikan, penghantaran atau harga Ikanza.", "。部分包装重量和价格为估算。仙本那合作伙伴尚未确认销售清单、库存、处理方式、鱼的状态、送货安排或 Ikanza 价格。"],
    "Example market prices, checked 29 October 2026.": ["Harga pasaran contoh, disemak pada 29 Oktober 2026.", "市场参考价格，查阅日期：2026 年 10 月 29 日。"],
    "References:": ["Rujukan:", "参考来源："],
    "PasarHub fish": ["ikan di PasarHub", "PasarHub 鱼类"],
    "seafood": ["makanan laut", "海鲜"],
    "AEON siakap": ["siakap di AEON", "AEON 金目鲈"],
    "ShopFrosty grouper": ["kerapu di ShopFrosty", "ShopFrosty 石斑鱼"],
    "red snapper": ["ikan merah", "红鲷鱼"],
    ", and": [", dan", "，以及"],
    "Based on public": ["Berdasarkan senarai awam daripada", "参考公开的"],
    "and": ["dan", "和"],
    "Example offers": ["Tawaran contoh", "优惠示例"],
    "Free delivery from RM250 in Klang Valley or RM400 elsewhere in Peninsular Malaysia": ["Contoh tawaran: penghantaran percuma apabila jumlah produk mencapai RM250 di Lembah Klang atau RM400 di kawasan lain Semenanjung Malaysia", "优惠示例：巴生谷商品满 RM250，或西马其他地区满 RM400，可免运费"],
    "Spend RM500 on items for an extra 5% off (up to RM50).": ["Contoh: belanja RM500 untuk produk dan dapatkan diskaun tambahan 5% (maksimum RM50).", "示例：商品满 RM500，再折 5%（最多 RM50）。"],
    "Preview math only. Real delivery costs and offers depend on the Semporna cold chain and are not available yet.": ["Ini pengiraan contoh sahaja. Caj penghantaran dan tawaran sebenar belum disahkan; aturan rantaian sejuk dari Semporna masih dirancang.", "以上仅为示例计算。实际运费和优惠尚未确认，仙本那的冷链送货安排仍在筹备。"],
    "Example free delivery unlocked": ["Contoh penghantaran percuma dicapai", "已达到示例免运费条件"],
    "Extra 5% example discount unlocked": ["Contoh diskaun tambahan 5% dicapai", "已达到示例额外 5% 折扣条件"],
    "See all 7 example items": ["Lihat semua 7 produk contoh", "查看全部 7 件示例商品"],
    "For business": ["Untuk perniagaan", "企业采购"],
    "For restaurants & hotels": ["Untuk restoran & hotel", "面向餐厅与酒店"],
    "Restaurants, hotels & caterers": ["Restoran, hotel dan katering", "餐厅、酒店和餐饮业者"],
    "Looking for a steadier seafood conversation?": ["Berminat dengan bekalan makanan laut?", "想了解海鲜批发？"],
    "Tell us the species, volume and delivery area you need. Explore how a direct Semporna supply enquiry could work.": ["Nyatakan jenis ikan, kuantiti dan kawasan penghantaran yang diperlukan. Lihat cara pertanyaan bekalan Semporna mungkin berfungsi.", "列出所需鱼种、采购量和送货地区，看看未来的仙本那海鲜咨询流程。"],
    "Preview how a Semporna seafood enquiry for your kitchen could work, including species, volume and delivery area.": ["Lihat contoh borang pertanyaan untuk dapur anda, termasuk jenis ikan, kuantiti dan kawasan penghantaran. Pertanyaan belum dibuka.", "看看餐饮采购咨询的示例表单，涵盖鱼种、数量和送货地区。目前尚未开放咨询。"],
    "Explore business enquiries": ["Lihat borang borong contoh", "查看批发咨询示例"],
    "Find seafood by name, local name or category": ["Cari makanan laut mengikut nama, nama tempatan atau kategori", "按名称、当地名称或类别搜索海鲜"],
    "What seafood are you craving?": ["Makanan laut apa yang anda inginkan?", "想吃什么海鲜？"],
    "Clear": ["Kosongkan", "清除"],
    "Try a name:": ["Cuba nama ini:", "试试这些名称："],
    "Filter seafood by category": ["Tapis makanan laut mengikut kategori", "按类别筛选海鲜"],
    "Nothing matching that yet.": ["Belum ada yang sepadan.", "暂时没有匹配的商品。"],
    "Try a different name or browse a category.": ["Cuba nama lain atau lihat mengikut kategori.", "请尝试其他名称或浏览类别。"],
    "Try another spelling, a Malay or English name, or browse a category.": ["Cuba ejaan lain, nama Melayu atau Inggeris, atau lihat mengikut kategori.", "请尝试其他拼写、马来文或英文名称，或浏览类别。"],
    "Ikan bilis is usually sold dried and is not in this fresh seafood preview. Try a fresh fish category or see all seafood.": ["Ikan bilis biasanya dijual kering dan tiada dalam senarai contoh ini. Cuba kategori ikan atau lihat semua makanan laut.", "江鱼仔通常作为干货出售，未列入这些示例商品。可浏览鱼类或全部海鲜。"],
    "See all seafood": ["Lihat semua makanan laut", "查看全部海鲜"],
    "That seafood is not in this preview.": ["Makanan laut itu tiada dalam senarai contoh.", "示例商品中没有这种海鲜。"],
    "Return to the sample collection.": ["Kembali ke produk contoh.", "返回示例商品。"],
    "Example item": ["Produk contoh", "示例商品"],
    "Example from": ["Harga contoh bermula", "示例价起"],
    "Choose size": ["Pilih saiz", "选择规格"],
    "Not for sale yet": ["Belum dijual", "尚未开售"],
    "Choose a sample size or pack weight": ["Pilih berat pek contoh", "选择示例包装重量"],
    "Size names include a gram range, so you can compare what the example pack means.": ["Setiap pilihan menunjukkan julat berat dan harga contoh.", "每个选项都列出重量范围和示例价格。"],
    "Selected example pack": ["Pek contoh yang dipilih", "已选示例包装"],
    "Format": ["Bentuk produk", "产品形式"],
    "Supplier source": ["Sumber pembekal", "供应商来源"],
    "To be confirmed": ["Akan disahkan", "待确认"],
    "Add example to bag": ["Tambah ke troli contoh", "加入示例购物车"],
    "What if the fish weighs differently?": ["Bagaimana jika berat ikan berbeza?", "如果鱼的重量不同怎么办？"],
    "The gram ranges and prices here are illustrations. Confirmed listings will explain weighing and final pricing before any real checkout opens.": ["Julat berat dan harga di sini hanya contoh. Cara penimbangan dan harga akhir akan diterangkan sebelum pembelian sebenar dibuka.", "这里的重量范围和价格仅作示例。正式开放购买前，我们会说明称重方式和最终价格。"],
    "Is this part of the Semporna catch?": ["Adakah ini daripada tangkapan ikan di Semporna?", "这属于仙本那的渔获吗？"],
    "No sale list or product photos from the Semporna partner are confirmed yet. This market-based example does not establish origin, availability or handling.": ["Senarai produk untuk dijual dan foto sebenar daripada rakan Semporna belum disahkan. Contoh berdasarkan pasaran ini tidak membuktikan asal, ketersediaan atau cara pengendaliannya.", "仙本那合作伙伴尚未确认销售清单或实物照片。这个市场参考示例不能证明产地、供应情况或处理方式。"],
    "Review the example items, delivery area and full preview total before continuing.": ["Semak produk contoh, kawasan penghantaran dan jumlah termasuk caj sebelum meneruskan.", "继续前，请核对示例商品、送货地区和含运费的总额。"],
    "Example delivery area": ["Kawasan penghantaran contoh", "示例送货地区"],
    "Example discount": ["Diskaun contoh", "示例折扣"],
    "Example delivery": ["Caj penghantaran contoh", "示例运费"],
    "Example total": ["Jumlah contoh", "示例总额"],
    "Example items": ["Produk contoh", "示例商品"],
    "Example RM30 delivery; free from RM250 item subtotal": ["Penghantaran contoh RM30; percuma apabila jumlah kecil produk mencapai RM250", "示例配送费 RM30；商品小计满 RM250 免运费"],
    "Example RM60 delivery; free from RM400 item subtotal": ["Penghantaran contoh RM60; percuma apabila jumlah kecil produk mencapai RM400", "示例配送费 RM60；商品小计满 RM400 免运费"],
    "These offers are examples only. Orders and payments are not open.": ["Tawaran ini hanyalah contoh. Pesanan dan pembayaran belum dibuka.", "这些优惠仅为示例，目前尚未开放下单或付款。"],
    "All amounts and offers are illustrative. No payment is taken.": ["Semua jumlah dan tawaran hanya contoh. Tiada bayaran diambil.", "金额和优惠仅作示例，不会扣款。"],
    "The reference is generated in your browser only. No real offer was applied.": ["Nombor rujukan hanya dijana dalam pelayar anda. Tiada tawaran sebenar digunakan.", "此编号仅在您的浏览器中生成，没有应用任何真实优惠。"],
    "Your shopping journey": ["Cara membeli-belah", "购买流程"],
    "Three clear decisions, with the useful details right where you need them.": ["Tiga keputusan yang jelas, dengan maklumat berguna tersedia apabila anda memerlukannya.", "三个清晰的步骤，在需要时就能看到实用信息。"],
    "Compare familiar names, sample size ranges in grams, and the price for each pack.": ["Bandingkan nama yang biasa dikenali, julat saiz contoh dalam gram dan harga setiap pek.", "比较熟悉的名称、以克为单位的示例重量范围及每包价格。"],
    "Choose an area and date, then see the example delivery charge and any example offer.": ["Pilih kawasan dan tarikh, kemudian lihat caj penghantaran serta tawaran contoh yang berkenaan.", "选择配送区域和日期，再查看示例配送费及适用的示例优惠。"],
    "Review your items and complete sample total before seeing the preview confirmation.": ["Semak produk dan jumlah contoh sebelum melihat halaman pengesahan.", "核对商品和示例总额，再查看确认页面。"]
  };

  var pageMetadata = {
    en: ["Ikanza | Semporna Fish Shop Preview", "Explore Ikanza’s fish-first shop preview, shaped by a Semporna partner who buys wild-caught fish from small local fishers. Products and delivery are unconfirmed; orders are not open."],
    my: ["Ikanza | Kedai Ikan Semporna Contoh", "Lihat kedai contoh Ikanza yang mengutamakan ikan. Rakan kami di Semporna membeli ikan tangkapan liar daripada nelayan kecil tempatan. Produk dan penghantaran belum disahkan; pesanan belum dibuka."],
    cn: ["Ikanza | 仙本那鱼类店铺示例", "看看 Ikanza 以鱼类为主的店铺示例。仙本那合作伙伴向当地小规模渔民收购野生捕捞的鱼；商品与送货安排仍待确认，暂未开放下单。"]
  };

  var days = {
    Sunday: ["Ahad", "星期日"], Monday: ["Isnin", "星期一"], Tuesday: ["Selasa", "星期二"],
    Wednesday: ["Rabu", "星期三"], Thursday: ["Khamis", "星期四"], Friday: ["Jumaat", "星期五"], Saturday: ["Sabtu", "星期六"]
  };
  var months = {
    January: ["Januari", 1], February: ["Februari", 2], March: ["Mac", 3], April: ["April", 4],
    May: ["Mei", 5], June: ["Jun", 6], July: ["Julai", 7], August: ["Ogos", 8],
    September: ["September", 9], October: ["Oktober", 10], November: ["November", 11], December: ["Disember", 12]
  };

  function normalize(lang) {
    lang = String(lang || "").toLowerCase();
    if (lang === "my" || lang === "ms" || lang === "ms-my" || lang === "bm") return "my";
    if (lang === "cn" || lang === "zh" || lang === "zh-cn" || lang === "zh-hans") return "cn";
    return "en";
  }
  function current() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) selectedLanguage = normalize(stored);
    } catch (_) { /* Use the in-memory language when storage is disabled. */ }
    return selectedLanguage;
  }
  function set(lang) {
    var selected = normalize(lang);
    selectedLanguage = selected;
    try { localStorage.setItem(STORAGE_KEY, selected); } catch (_) { /* Storage can be disabled. */ }
    document.documentElement.lang = languages[selected];
    return selected;
  }
  function literal(value, lang) {
    var entry = copy[value];
    return entry ? entry[lang === "my" ? 0 : 1] : null;
  }
  function translateValue(value, lang) {
    if (lang === "en" || !value) return value;
    var match = value.match(/^(\s*)([\s\S]*?)(\s*)$/);
    var lead = match[1], text = match[2], trail = match[3];
    if (!text) return value;
    var result = literal(text, lang);
    if (result !== null) return lead + result + trail;

    // A product's price line contains both a variable pack weight and a variable RM amount.
    var m = text.match(/^Guide price for (.+) · approx\. (.+) \/ kg at midpoint weight$/);
    if (m) {
      var weight = literal(m[1], lang) || m[1];
      return lead + (lang === "my"
        ? "Harga panduan untuk " + weight + " · anggaran " + m[2] + " / kg pada berat pertengahan"
        : "参考价：" + weight + " · 按重量区间中值约 " + m[2] + " / 公斤") + trail;
    }
    m = text.match(/^Example price for (.+) · approx\. (.+) \/ kg at midpoint weight$/);
    if (m) {
      var exampleWeight = literal(m[1], lang) || m[1];
      return lead + (lang === "my"
        ? "Harga contoh untuk " + exampleWeight + " · anggaran " + m[2] + " / kg pada berat pertengahan"
        : "示例价格：" + exampleWeight + " · 按重量区间中值约 " + m[2] + " / 公斤") + trail;
    }
    m = text.match(/^(Whole fish|Whole prawns|Whole squid|Whole crab|Whole cuttlefish|Fish cut|Picked meat) example$/);
    if (m) return lead + (lang === "my" ? "Contoh " + (literal(m[1], lang) || m[1]).toLowerCase() : (literal(m[1], lang) || m[1]) + "示例") + trail;

    // Product metadata uses reusable pieces separated by middle dots.
    if (text.indexOf(" · ") >= 0) {
      var pieces = text.split(" · ");
      var translated = pieces.map(function (piece) { return translateValue(piece, lang); });
      if (translated.some(function (part, i) { return part !== pieces[i]; })) return lead + translated.join(" · ") + trail;
    }

    m = text.match(/^Approx\. (.+) \/ kg$/);
    if (m) return lead + (lang === "my" ? "Anggaran " + m[1] + " / kg" : "约 " + m[1] + " / 公斤") + trail;
    m = text.match(/^From approx\. (.+) \/ kg$/);
    if (m) return lead + (lang === "my" ? "Daripada anggaran " + m[1] + " / kg" : "约 " + m[1] + " / 公斤起") + trail;
    m = text.match(/^Sample price for (.+) · approx\. (.+) \/ kg$/);
    if (m) return lead + (lang === "my" ? "Harga contoh untuk " + (literal(m[1], lang) || m[1]) + " · anggaran " + m[2] + " / kg" : (literal(m[1], lang) || m[1]) + "的参考价 · 约 " + m[2] + " / 公斤") + trail;
    m = text.match(/^Example price for (.+) · approx\. (.+) \/ kg at midpoint weight$/);
    if (m) return lead + (lang === "my" ? "Harga contoh untuk " + (literal(m[1], lang) || m[1]) + " · anggaran " + m[2] + " / kg pada berat pertengahan" : (literal(m[1], lang) || m[1]) + "的示例价格 · 按重量区间中值计算约 " + m[2] + " / 公斤") + trail;
    m = text.match(/^See all (\d+) preview items?$/);
    if (m) return lead + (lang === "my" ? "Lihat semua " + m[1] + " produk contoh" : "查看全部 " + m[1] + " 件示例商品") + trail;
    m = text.match(/^(\d+) preview listings?$/);
    if (m) return lead + (lang === "my" ? m[1] + " produk contoh" : m[1] + " 件示例商品") + trail;
    m = text.match(/^(\d+) example items?$/);
    if (m) return lead + (lang === "my" ? m[1] + " produk contoh" : m[1] + " 件示例商品") + trail;
    m = text.match(/^(\d+) preview items?$/);
    if (m) return lead + (lang === "my" ? m[1] + " produk contoh" : m[1] + " 件示例商品") + trail;
    m = text.match(/^(.+) away from example free delivery$/);
    if (m) return lead + (lang === "my" ? "Lagi " + m[1] + " untuk mencapai syarat penghantaran percuma (contoh)" : "还差 " + m[1] + " 达到示例免运费条件") + trail;
    m = text.match(/^(.+) away from the extra 5% example discount$/);
    if (m) return lead + (lang === "my" ? "Lagi " + m[1] + " untuk mencapai syarat diskaun 5% (contoh)" : "还差 " + m[1] + " 达到示例额外 5% 折扣条件") + trail;
    m = text.match(/^Based on item subtotal and (Klang Valley|other Peninsular area) example delivery\.$/);
    if (m) {
      var place = literal(m[1] === "other Peninsular area" ? "Other Peninsular area" : m[1], lang) || m[1];
      return lead + (lang === "my" ? "Berdasarkan jumlah produk dan caj penghantaran contoh ke " + place + "." : "根据商品小计和" + place + "的示例运费计算。") + trail;
    }
    m = text.match(/^View bag, (\d+) items?$/);
    if (m) return lead + (lang === "my" ? "Lihat troli, " + m[1] + " produk" : "查看购物车，" + m[1] + " 件商品") + trail;
    m = text.match(/^Welcome, (.+)\.$/);
    if (m) return lead + (lang === "my" ? "Selamat kembali, " + m[1] + "." : "欢迎回来，" + m[1] + "。") + trail;
    m = text.match(/^Destination: (.+)$/);
    if (m) return lead + (lang === "my" ? "Destinasi: " : "送货地点：") + (literal(m[1], lang) || m[1]) + trail;
    m = text.match(/^Quantity (\d+)$/);
    if (m) return lead + (lang === "my" ? "Kuantiti " + m[1] : "数量 " + m[1]) + trail;
    m = text.match(/^(Remove|Add) one (.+) (Large whole fish|Whole fish|500 g cut|1 kg cut|500 g portion|1 kg portion|Small pack|Medium pack|Large pack|Small|Medium|Large|500 g pack|1 kg pack)$/);
    if (m && productNames.indexOf(m[2]) >= 0) return lead + (lang === "my" ? (m[1] === "Remove" ? "Keluarkan satu " : "Tambah satu ") + literal(m[2], lang) + " (" + literal(m[3], lang) + ")" : (m[1] === "Remove" ? "移除一份" : "添加一份") + literal(m[2], lang) + "（" + literal(m[3], lang) + "）") + trail;
    m = text.match(/^(Remove|Add) one (.+)$/);
    if (m) return lead + (lang === "my" ? (m[1] === "Remove" ? "Keluarkan satu " : "Tambah satu ") + (literal(m[2], lang) || m[2]) : (m[1] === "Remove" ? "移除一件" : "添加一件") + (literal(m[2], lang) || m[2])) + trail;
    m = text.match(/^View (.+)$/);
    if (m && productNames.indexOf(m[1]) >= 0) return lead + (lang === "my" ? "Lihat " : "查看") + literal(m[1], lang) + trail;
    m = text.match(/^Illustrative image of whole (coral grouper|sea bass|red snapper)$/i);
    if (m) return lead + (lang === "my" ? "Imej ilustrasi ikan seekor " + (literal(titleCaseFish(m[1]), lang) || m[1]) : "整条" + (literal(titleCaseFish(m[1]), lang) || m[1]) + "的示意图片") + trail;
    m = text.match(/^Illustrative (coral grouper|sea bass|red snapper)$/i);
    if (m) return lead + (lang === "my" ? "Ilustrasi " + (literal(titleCaseFish(m[1]), lang) || m[1]) : (literal(titleCaseFish(m[1]), lang) || m[1]) + "示意图片") + trail;
    m = text.match(/^Illustrative image of (.+)$/i);
    if (m && productNames.indexOf(titleCaseFish(m[1])) >= 0) return lead + (lang === "my" ? "Imej ilustrasi " + literal(titleCaseFish(m[1]), lang) : literal(titleCaseFish(m[1]), lang) + "的示意图片") + trail;
    m = text.match(/^Illustrative (.+)$/i);
    if (m && productNames.indexOf(titleCaseFish(m[1])) >= 0) return lead + (lang === "my" ? "Ilustrasi " + literal(titleCaseFish(m[1]), lang) : literal(titleCaseFish(m[1]), lang) + "示意图片") + trail;
    m = text.match(/^Illustrative delivery: (RM[\d,.]+)$/);
    if (m) return lead + (lang === "my" ? "Caj penghantaran contoh: " : "示例运费：") + m[1] + trail;
    m = text.match(/^(\d+) (Coral grouper|Sea bass|Red snapper) added to your preview bag\.$/);
    if (m) return lead + (lang === "my" ? m[1] + " " + literal(m[2], lang) + " ditambah ke troli contoh." : "已将 " + m[1] + " 件" + literal(m[2], lang) + "加入示例购物车。") + trail;
    m = text.match(/^(\d+) (.+) \((Large whole fish|Whole fish|500 g cut|1 kg cut|500 g portion|1 kg portion|Small pack|Medium pack|Large pack|Small|Medium|Large|500 g pack|1 kg pack)\) added to your preview bag\.$/);
    if (m && productNames.indexOf(m[2]) >= 0) return lead + (lang === "my" ? m[1] + " " + literal(m[2], lang) + " (" + literal(m[3], lang) + ") ditambah ke troli contoh." : "已将 " + m[1] + " 件" + literal(m[2], lang) + "（" + literal(m[3], lang) + "）加入示例购物车。") + trail;
    m = text.match(/^(Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday), (\d{1,2}) (January|February|March|April|May|June|July|August|September|October|November|December) (\d{4})( \(example\))?$/);
    if (m) return lead + (lang === "my" ? days[m[1]][0] + ", " + m[2] + " " + months[m[3]][0] + " " + m[4] + (m[5] ? " (contoh)" : "") : m[4] + "年" + months[m[3]][1] + "月" + m[2] + "日（" + days[m[1]][1] + (m[5] ? "，示例" : "") + "）") + trail;
    return value;
  }
  function titleCaseFish(fish) { return fish.charAt(0).toUpperCase() + fish.slice(1).toLowerCase(); }

  function translateBusinessSamples(root, lang) {
    if (!root.querySelector || !root.querySelector("#business-sample-fill")) return;
    Object.keys(businessSampleFields).forEach(function (id) {
      var field = root.querySelector("#" + id);
      var state = field && sourceSampleValues.get(field);
      if (!state) return;
      if (field.value !== state.last) { sourceSampleValues.delete(field); return; }
      var translated = translateValue(state.original, lang);
      if (field.value !== translated) field.value = translated;
      state.last = translated;
    });
    if (sampleListenerRoots.has(root)) return;
    root.addEventListener("click", function (event) {
      if (!event.target.closest || !event.target.closest("#business-sample-fill")) return;
      // The button's handler fills the fields before this bubbling listener runs.
      Object.keys(businessSampleFields).forEach(function (id) {
        var field = root.querySelector("#" + id), original = businessSampleFields[id];
        if (!field || field.value !== original) return;
        var state = { original: original, last: original };
        sourceSampleValues.set(field, state);
        var translated = translateValue(original, current());
        if (field.value !== translated) field.value = translated;
        state.last = translated;
      });
    });
    root.addEventListener("input", function (event) {
      if (sourceSampleValues.has(event.target)) sourceSampleValues.delete(event.target);
    });
    sampleListenerRoots.add(root);
  }

  function translate(root, lang) {
    if (!root) return;
    lang = normalize(lang || current());
    document.documentElement.lang = languages[lang];
    // Standalone pages keep their own SEO title and description.
    if (root.id === "app" || (root.querySelector && root.querySelector("#app"))) {
      document.title = pageMetadata[lang][0];
      var description = document.querySelector('meta[name="description"]');
      if (description) description.setAttribute("content", pageMetadata[lang][1]);
    }
    var nodes = [];
    if (root.nodeType === Node.TEXT_NODE) nodes.push(root);
    else {
      var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) nodes.push(walker.currentNode);
    }
    nodes.forEach(function (node) {
      if (node.parentElement && /^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE|SVG)$/.test(node.parentElement.tagName)) return;
      var state = sourceText.get(node);
      var now = node.nodeValue;
      if (!state || state.last !== now) state = { original: now, last: now };
      var translated = translateValue(state.original, lang);
      if (now !== translated) node.nodeValue = translated;
      state.last = translated;
      sourceText.set(node, state);
    });
    var elements = root.nodeType === Node.ELEMENT_NODE ? [root].concat(Array.prototype.slice.call(root.querySelectorAll("*"))) : [];
    elements.forEach(function (element) {
      var attrs = sourceAttributes.get(element) || {};
      ["placeholder", "aria-label", "alt", "title", "aria-description", "content"].forEach(function (name) {
        if (!element.hasAttribute(name)) return;
        var now = element.getAttribute(name);
        var state = attrs[name];
        if (!state || state.last !== now) state = { original: now, last: now };
        var translated = translateValue(state.original, lang);
        if (now !== translated) element.setAttribute(name, translated);
        state.last = translated;
        attrs[name] = state;
      });
      sourceAttributes.set(element, attrs);
      if (element.matches && element.matches("[data-product-card]")) {
        var link = element.querySelector("a[href^='#product/']");
        var fish = link && ({ "#product/grouper": "Coral grouper", "#product/seabass": "Sea bass", "#product/snapper": "Red snapper" })[link.getAttribute("href")];
        if (fish) {
          var terms = element.getAttribute("data-search") || "";
          [literal(fish, "my"), literal(fish, "cn")].forEach(function (name) {
            if (name && terms.indexOf(name.toLowerCase()) < 0) terms += " " + name.toLowerCase();
          });
          element.setAttribute("data-search", terms.trim());
        }
      }
    });
    translateBusinessSamples(root, lang);
    // app.js also updates badges, toast messages and aria labels without a full
    // render. Watch the small storefront subtree so those changes stay localised.
    if (root.nodeType === Node.ELEMENT_NODE && typeof MutationObserver !== "undefined") {
      var watch = watchedRoots.get(root);
      if (!watch) {
        watch = { lang: lang };
        watch.observer = new MutationObserver(function () { translate(root, watch.lang); });
        watch.observer.observe(root, { subtree: true, childList: true, characterData: true, attributes: true,
          attributeFilter: ["placeholder", "aria-label", "alt", "title", "aria-description", "content"] });
        watchedRoots.set(root, watch);
      }
      watch.lang = lang;
    }
    // app.js writes live announcements outside #app after interactions.
    if (root.id === "app") {
      var announcer = document.getElementById("announcer");
      if (announcer) translate(announcer, lang);
    }
  }

  window.IkanzaI18n = { current: current, set: set, translate: translate };
})();
