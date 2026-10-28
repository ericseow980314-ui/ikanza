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
  var productNames = ["Coral grouper", "Grouper", "Sea bass", "Red snapper", "Indian mackerel", "Fresh prawns", "Whole squid", "Flower crab"];
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
    "OPENING SOON FOR PENINSULAR MALAYSIA": ["AKAN DIBUKA UNTUK SEMENANJUNG MALAYSIA", "即将面向马来西亚半岛开放"],
    "Ikanza home": ["Laman utama Ikanza", "Ikanza 首页"],
    "Main navigation": ["Navigasi utama", "主导航"],
    "Mobile navigation": ["Navigasi mudah alih", "移动导航"],
    "Choose language": ["Pilih bahasa", "选择语言"],
    "Shop seafood": ["Beli makanan laut", "选购海鲜"],
    "How it works": ["Cara ia berfungsi", "购物流程"],
    "Track delivery": ["Jejak penghantaran", "追踪配送"],
    "Account": ["Akaun", "账户"],
    "Customer story": ["Kisah pelanggan", "顾客故事"],
    "Our story": ["Kisah kami", "我们的故事"],
    "Delivery & FAQ": ["Penghantaran & Soalan Lazim", "配送与常见问题"],
    "Bag": ["Bakul", "购物袋"],
    "Open menu": ["Buka menu", "打开菜单"],
    "Close menu": ["Tutup menu", "关闭菜单"],
    "A simpler way to explore seafood from Semporna.": ["Cara lebih mudah untuk meneroka makanan laut dari Semporna.", "更轻松地了解来自仙本那的海鲜。"],
    "Opening soon · Orders not open": ["Akan dibuka · Pesanan belum dibuka", "即将开业 · 暂未开放下单"],
    "Explore": ["Terokai", "探索"],
    "Seafood": ["Makanan laut", "海鲜"],
    "Information": ["Maklumat", "信息"],
    "Your bag": ["Bakul anda", "您的购物袋"],
    "Contact details at launch": ["Butiran hubungan semasa pelancaran", "开业时公布联系方式"],
    "© Ikanza. Preview storefront; no orders or payments.": ["© Ikanza. Pratonton kedai; tiada pesanan atau pembayaran.", "© Ikanza。店铺预览；暂不接受订单或付款。"],
    "Listings and AI-generated imagery are illustrative.": ["Senarai produk dan imej janaan AI adalah untuk ilustrasi.", "商品信息及 AI 生成图片仅供示意。"],
    "Preview listing": ["Senarai contoh", "商品预览"],
    "Sample price": ["Harga contoh", "参考价格"],
    "Whole fish example": ["Contoh ikan seekor", "整鱼示例"],
    "Add to bag": ["Masukkan ke bakul", "加入购物袋"],
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
    "Good seafood.": ["Makanan laut berkualiti.", "好海鲜。"],
    "Made simple.": ["Lebih mudah dinikmati.", "轻松享用。"],
    "Ikanza is preparing a clearer way to shop Semporna seafood across Peninsular Malaysia. Explore the storefront while our catalogue and delivery service are being finalised.": ["Ikanza sedang menyediakan cara yang lebih jelas untuk membeli makanan laut Semporna di seluruh Semenanjung Malaysia. Terokai kedai ini sementara katalog dan perkhidmatan penghantaran kami dimuktamadkan.", "Ikanza 正在筹备更清晰便捷的仙本那海鲜选购体验，服务马来西亚半岛。商品目录和配送服务仍在敲定中，欢迎先浏览店铺预览。"],
    "Explore seafood": ["Terokai makanan laut", "探索海鲜"],
    "Opening soon. The listings shown are previews.": ["Akan dibuka. Senarai produk yang dipaparkan ialah pratonton.", "即将开业。所示商品均为预览。"],
    "Illustrative seafood arrangement on ice": ["Ilustrasi susunan makanan laut di atas ais", "冰上陈列海鲜的示意图片"],
    "From the sea": ["Dari laut", "来自大海"],
    "to you": ["untuk anda", "送到您手中"],
    "Explore the seafood": ["Terokai makanan laut", "探索海鲜"],
    "See the full delivery total": ["Lihat jumlah termasuk penghantaran", "查看含配送费的总额"],
    "Preview the checkout": ["Pratonton semakan pesanan", "预览结账流程"],
    "Explore the collection": ["Terokai koleksi", "浏览商品系列"],
    "A taste of what is coming.": ["Sekilas tentang yang bakal tiba.", "抢先看看即将上架的商品。"],
    "Fish names, pack sizes and prices should be easy to compare. Here is a preview of how the collection will be presented.": ["Nama ikan, saiz pek dan harga patut mudah dibandingkan. Ini pratonton cara koleksi kami akan dipaparkan.", "鱼名、包装规格和价格应当一目了然，方便比较。以下是商品系列的展示预览。"],
    "Preview listings only. Species, availability, pack sizes and prices will be confirmed before orders open.": ["Senarai ini hanya pratonton. Spesies, ketersediaan, saiz pek dan harga akan disahkan sebelum pesanan dibuka.", "此处仅为商品预览。鱼种、供应情况、包装规格和价格将在开放下单前确认。"],
    "How shopping works": ["Cara membeli-belah", "购物方式"],
    "Simple from the first click.": ["Mudah sejak klik pertama.", "从第一步起，购物就很简单。"],
    "Know what is in the pack and what delivery adds before you decide.": ["Ketahui kandungan pek dan kos penghantaran sebelum membuat pilihan.", "做决定前，先了解包装内容和配送费用。"],
    "See how it works": ["Lihat cara ia berfungsi", "了解购物流程"],
    "Choose your fish": ["Pilih ikan anda", "挑选鱼类"],
    "Compare pack size, price and product format.": ["Bandingkan saiz pek, harga dan bentuk produk.", "比较包装规格、价格和产品形式。"],
    "Review delivery": ["Semak penghantaran", "查看配送"],
    "See the delivery area, date and full total together.": ["Lihat kawasan, tarikh penghantaran dan jumlah keseluruhan serentak.", "一并查看配送区域、日期和完整总额。"],
    "Know the next step": ["Ketahui langkah seterusnya", "了解下一步"],
    "Review all the details in one place before an order.": ["Semak semua butiran di satu tempat sebelum membuat pesanan.", "下单前在同一处核对所有详情。"],
    "“Know the fish. Know the price. Know when it arrives.”": ["“Kenali ikan. Ketahui harga. Tahu bila ia tiba.”", "“了解鱼，了解价格，也了解送达时间。”"],
    "Why Ikanza": ["Mengapa Ikanza", "为什么选择 Ikanza"],
    "A better link between the farm and your kitchen.": ["Hubungan lebih baik antara ladang dan dapur anda.", "让养殖场与您的厨房联系更紧密。"],
    "We are developing Ikanza with a seafood farming partner in Semporna. The confirmed fish, handling process and delivery details will be shared before the store begins taking orders.": ["Kami membangunkan Ikanza bersama rakan penternakan makanan laut di Semporna. Jenis ikan, proses pengendalian dan butiran penghantaran yang disahkan akan dikongsi sebelum kedai mula menerima pesanan.", "我们正与仙本那的海鲜养殖伙伴共同开发 Ikanza。店铺开始接单前，我们会公布已确认的鱼种、处理流程和配送详情。"],
    "Fish names and preparation explained plainly": ["Nama ikan dan penyediaannya dijelaskan dengan mudah", "清楚说明鱼名与处理方式"],
    "Full cost and delivery timing shown early": ["Jumlah kos dan masa penghantaran dipaparkan awal", "提前显示完整费用和配送时间"],
    "Clear help when something goes wrong": ["Bantuan yang jelas jika timbul masalah", "遇到问题时有明确的求助途径"],
    "Explore what is coming": ["Terokai yang bakal tiba", "探索即将推出的商品"],
    "Seafood shopping, made clearer.": ["Pembelian makanan laut yang lebih jelas.", "让选购海鲜更明白。"],
    "Browse the preview collection and see how the ordering journey could work. Orders are not open yet.": ["Lihat koleksi pratonton dan kenali cara pesanan mungkin dibuat. Pesanan belum dibuka.", "浏览预览商品，了解未来的订购流程。目前尚未开放下单。"],

    "The collection": ["Koleksi", "商品系列"],
    "Seafood, without the guesswork.": ["Makanan laut dengan maklumat yang jelas.", "选购海鲜，心中有数。"],
    "Explore the first look at our storefront. The confirmed farm catalogue and prices will be published before orders open.": ["Lihat pratonton awal kedai kami. Katalog dan harga ladang yang disahkan akan diterbitkan sebelum pesanan dibuka.", "欢迎浏览店铺抢先预览。已确认的养殖场商品目录及价格将在开放下单前公布。"],
    "Search preview products": ["Cari produk pratonton", "搜索预览商品"],
    "Search fish or Malay name": ["Cari nama ikan atau nama Melayunya", "搜索鱼名或马来文名称"],
    "No matching fish in this preview.": ["Tiada ikan yang sepadan dalam pratonton ini.", "预览商品中没有匹配的鱼类。"],
    "Try a different name or clear the search.": ["Cuba nama lain atau kosongkan carian.", "请尝试其他名称或清除搜索内容。"],
    "Clear search": ["Kosongkan carian", "清除搜索"],
    "Preview only: imagery is illustrative, and species, prices, weights and preparation are not yet confirmed with the farm.": ["Pratonton sahaja: imej adalah ilustrasi, manakala spesies, harga, berat dan penyediaan belum disahkan dengan ladang.", "仅供预览：图片仅为示意，鱼种、价格、重量和处理方式尚未与养殖场确认。"],

    "Not found": ["Tidak ditemui", "未找到"],
    "That fish is not on this menu.": ["Ikan itu tiada dalam senarai ini.", "商品列表中没有这种鱼。"],
    "Return to the sample catalogue.": ["Kembali ke katalog contoh.", "返回示例商品目录。"],
    "Back to shop": ["Kembali ke kedai", "返回商店"],
    "Preview in checkout": ["Pratonton semasa semakan pesanan", "结账时预览"],
    "Sample pack": ["Pek contoh", "示例包装"],
    "Preparation": ["Penyediaan", "处理方式"],
    "Proposed origin": ["Asal yang dicadangkan", "拟定产地"],
    "Semporna, Sabah": ["Semporna, Sabah", "沙巴仙本那"],
    "Delivery": ["Penghantaran", "配送"],
    "Quantity": ["Kuantiti", "数量"],
    "Choose quantity": ["Pilih kuantiti", "选择数量"],
    "Decrease quantity": ["Kurangkan kuantiti", "减少数量"],
    "Increase quantity": ["Tambah kuantiti", "增加数量"],
    "View bag": ["Lihat bakul", "查看购物袋"],
    "Preview item. Species, size, cut, condition and availability will be confirmed before launch. No order or payment is available yet.": ["Produk pratonton. Spesies, saiz, potongan, keadaan dan ketersediaan akan disahkan sebelum pelancaran. Pesanan dan pembayaran belum tersedia.", "预览商品。鱼种、大小、切割方式、产品状态和供应情况将在开业前确认。目前尚不能下单或付款。"],
    "How will it be delivered?": ["Bagaimana ia akan dihantar?", "会如何配送？"],
    "Coverage, dates, packaging and fees are being finalised. The figures in checkout are examples.": ["Kawasan liputan, tarikh, pembungkusan dan caj sedang dimuktamadkan. Angka dalam pratonton semakan pesanan hanyalah contoh.", "配送范围、日期、包装和费用仍在敲定。结账页面显示的数字仅为示例。"],
    "What if the weight varies?": ["Bagaimana jika beratnya berbeza?", "如果重量有差异怎么办？"],
    "Confirmed listings will explain the pack weight and final price clearly. This preview uses a fixed sample pack.": ["Senarai produk yang disahkan akan menerangkan berat pek dan harga akhir dengan jelas. Pratonton ini menggunakan pek contoh dengan berat tetap.", "正式商品页面会清楚说明包装重量和最终价格。此预览使用固定重量的示例包装。"],
    "Is this fish from the actual farm?": ["Adakah ikan ini dari ladang sebenar?", "这条鱼来自实际的养殖场吗？"],
    "This is an illustrative listing and image. The confirmed farm catalogue and product photography have not been supplied yet.": ["Senarai dan imej ini hanya ilustrasi. Katalog ladang yang disahkan dan foto produk sebenar belum disediakan.", "此商品信息和图片仅供示意。养殖场尚未提供已确认的商品目录和实物照片。"],

    "Your bag is empty.": ["Bakul anda kosong.", "您的购物袋是空的。"],
    "Choose a preview item to see how the ordering journey will work.": ["Pilih produk pratonton untuk melihat cara proses pesanan akan berjalan.", "选择一件预览商品，了解订购流程。"],
    "Nothing in your bag yet.": ["Bakul anda masih kosong.", "购物袋里还没有商品。"],
    "Explore the collection, then come back here to review your choices.": ["Terokai koleksi kami, kemudian kembali ke sini untuk menyemak pilihan anda.", "浏览商品系列后，再回到这里查看您的选择。"],
    "Ready for your table?": ["Sedia untuk meja anda?", "准备好上桌了吗？"],
    "Review the preview items in your bag and see the full sample total on the next step.": ["Semak produk pratonton dalam bakul anda dan lihat jumlah contoh keseluruhan pada langkah seterusnya.", "核对购物袋中的预览商品，并在下一步查看示例总额。"],
    "Preview items and prices only. Nothing is reserved or ordered.": ["Produk dan harga hanya untuk pratonton. Tiada tempahan atau pesanan dibuat.", "商品和价格仅供预览。没有商品被预留或订购。"],
    "← Keep browsing": ["← Teruskan melayari", "← 继续浏览"],
    "Bag summary": ["Ringkasan bakul", "购物袋摘要"],
    "Sample delivery": ["Penghantaran contoh", "示例配送费"],
    "Shown next": ["Dipaparkan seterusnya", "下一步显示"],
    "Subtotal": ["Jumlah kecil", "商品小计"],
    "Continue to checkout preview": ["Teruskan ke pratonton semakan pesanan", "继续预览结账"],
    "Orders and payments are not open yet.": ["Pesanan dan pembayaran belum dibuka.", "目前尚未开放下单和付款。"],
    "Preview item": ["Produk pratonton", "预览商品"],
    "Remove": ["Buang", "移除"],

    "Checkout preview": ["Pratonton semakan pesanan", "结账预览"],
    "Add a preview item to explore checkout.": ["Tambah produk pratonton untuk meneroka semakan pesanan.", "添加一件预览商品，了解结账流程。"],
    "Browse seafood": ["Lihat makanan laut", "浏览海鲜"],
    "See the full picture.": ["Lihat semua butiran.", "全面了解费用与配送。"],
    "Explore the delivery and order summary with sample information. Nothing is sent or charged.": ["Terokai ringkasan penghantaran dan pesanan dengan maklumat contoh. Tiada maklumat dihantar atau bayaran dikenakan.", "使用示例信息查看配送及订单摘要。不会提交订单，也不会收费。"],
    "Delivery details": ["Butiran penghantaran", "配送详情"],
    "Review": ["Semak", "核对"],
    "Where would it go?": ["Ke manakah ia akan dihantar?", "要送到哪里？"],
    "Use the sample details below. Form entries stay on this page and are not submitted to a server.": ["Gunakan maklumat contoh di bawah. Maklumat yang diisi kekal pada halaman ini dan tidak dihantar ke pelayan.", "请使用下方示例资料。表单内容只留在此页面，不会提交到服务器。"],
    "Use sample details": ["Isi maklumat contoh", "填入示例资料"],
    "Full name": ["Nama penuh", "全名"],
    "Email": ["E-mel", "电子邮箱"],
    "Mobile number": ["Nombor telefon bimbit", "手机号码"],
    "Postcode": ["Poskod", "邮政编码"],
    "e.g. 00000": ["cth. 00000", "例如 00000"],
    "Enter a five-digit Malaysian postcode": ["Masukkan poskod Malaysia lima digit", "请输入五位数的马来西亚邮政编码"],
    "Delivery address": ["Alamat penghantaran", "配送地址"],
    "Example Customer": ["Pelanggan Contoh", "示例顾客"],
    "Example street address": ["Alamat jalan contoh", "示例街道地址"],
    "Choose a sample delivery area": ["Pilih kawasan penghantaran contoh", "选择示例配送区域"],
    "Klang Valley": ["Lembah Klang", "巴生谷"],
    "Other Peninsular areas": ["Kawasan lain di Semenanjung", "马来西亚半岛其他地区"],
    "Other Peninsular area": ["Kawasan lain di Semenanjung", "马来西亚半岛其他地区"],
    "Sample delivery date": ["Tarikh penghantaran contoh", "示例配送日期"],
    "Preview only.": ["Pratonton sahaja.", "仅供预览。"],
    "Continuing displays a sample confirmation. No order, payment or delivery is created.": ["Meneruskan akan memaparkan pengesahan contoh. Tiada pesanan, pembayaran atau penghantaran dibuat.", "继续后将显示示例确认页面，不会产生订单、付款或配送。"],
    "Order preview": ["Pratonton pesanan", "订单预览"],
    "Sample total": ["Jumlah contoh", "示例总额"],
    "All amounts are illustrative. No payment is taken.": ["Semua jumlah adalah contoh. Tiada pembayaran diambil.", "所有金额仅供示意，不会收取费用。"],
    "View sample confirmation": ["Lihat pengesahan contoh", "查看示例确认"],

    "Sample confirmation": ["Pengesahan contoh", "示例确认"],
    "No preview completed yet.": ["Tiada pratonton yang dilengkapkan lagi.", "尚未完成结账预览。"],
    "Explore checkout to see how the final screen will look.": ["Terokai semakan pesanan untuk melihat rupa skrin akhir.", "体验结账流程，看看最终页面的样子。"],
    "Here is your sample confirmation.": ["Ini pengesahan contoh anda.", "这是您的示例确认页面。"],
    "This is how a clear order confirmation could look.": ["Beginilah rupa pengesahan pesanan yang jelas.", "清晰的订单确认页面可以是这样的。"],
    "No real order was placed, no payment was taken, and nothing will be delivered.": ["Tiada pesanan sebenar dibuat, tiada bayaran diambil dan tiada apa-apa akan dihantar.", "并未提交真实订单、收取付款或安排配送。"],
    "Sample summary": ["Ringkasan contoh", "示例摘要"],
    "Preview reference": ["Rujukan pratonton", "预览编号"],
    "Products": ["Produk", "商品"],
    "Sample destination": ["Destinasi contoh", "示例配送地点"],
    "Sample date": ["Tarikh contoh", "示例日期"],
    "The reference is generated in your browser only.": ["Nombor rujukan ini dijana dalam pelayar anda sahaja.", "此编号仅在您的浏览器中生成。"],

    "A clear path from sea to table.": ["Laluan yang jelas dari laut ke meja anda.", "从大海到餐桌，每一步都清楚。"],
    "We are preparing a shopping experience that makes the fish, pack size and delivery total easy to understand. Final shipping arrangements will be shared before orders open.": ["Kami sedang menyediakan pengalaman membeli-belah yang memudahkan anda memahami jenis ikan, saiz pek dan jumlah termasuk penghantaran. Aturan penghantaran akhir akan dikongsi sebelum pesanan dibuka.", "我们正在筹备让鱼种、包装规格和配送总额清楚易懂的购物体验。最终配送安排会在开放下单前公布。"],
    "Find your fish": ["Cari ikan anda", "找到想要的鱼"],
    "See the fish name, preparation, pack weight and price together.": ["Lihat nama ikan, cara penyediaan, berat pek dan harga di satu tempat.", "在同一处查看鱼名、处理方式、包装重量和价格。"],
    "Choose an area and date, then see the complete total.": ["Pilih kawasan dan tarikh, kemudian lihat jumlah keseluruhan.", "选择配送区域和日期，再查看完整总额。"],
    "Check every detail": ["Semak setiap butiran", "核对每项详情"],
    "Review the items, delivery timing and final amount in one place.": ["Semak produk, masa penghantaran dan jumlah akhir di satu tempat.", "在同一处核对商品、配送时间和最终金额。"],
    "What matters most": ["Yang paling penting", "最重要的事"],
    "Clarity at every step.": ["Jelas pada setiap langkah.", "每一步都清楚。"],
    "Fish condition, preparation, weight and delivery cost should all be clear before a customer places an order.": ["Keadaan ikan, cara penyediaan, berat dan kos penghantaran perlu jelas sebelum pelanggan membuat pesanan.", "顾客下单前，应能清楚了解鱼的状态、处理方式、重量和配送费用。"],
    "Plain-language product details": ["Butiran produk yang mudah difahami", "易懂的商品详情"],
    "Malay and English names side by side.": ["Nama Melayu dan Inggeris dipaparkan bersebelahan.", "并列显示马来文和英文名称。"],
    "Transparent weight and price": ["Berat dan harga yang telus", "透明的重量与价格"],
    "Defined pack sizes or a clear final-weight process.": ["Saiz pek yang ditetapkan atau proses berat akhir yang jelas.", "明确的包装规格，或清楚的最终称重流程。"],
    "Visible help and policies": ["Bantuan dan dasar yang mudah dicari", "容易查找的帮助与政策"],
    "Answers easy to find throughout the journey.": ["Jawapan mudah dicari sepanjang proses pembelian.", "购物过程中，相关解答随时可查。"],

    "Rooted in Semporna.": ["Berakar di Semporna.", "扎根仙本那。"],
    "Our Story | From Semporna to More Tables | Ikanza": ["Kisah Kami | Dari Semporna ke Lebih Banyak Meja Makan | Ikanza", "我们的故事 | 从仙本那走向更多餐桌 | Ikanza"],
    "Discover the Semporna fisherman’s wish behind Ikanza and the clearer seafood shopping experience being built for Malaysian homes. Preview only; orders are not open.": ["Kenali hasrat nelayan Semporna di sebalik Ikanza dan pengalaman membeli makanan laut yang lebih jelas untuk keluarga di Malaysia. Pratonton sahaja; pesanan belum dibuka.", "了解 Ikanza 背后仙本那渔民的心愿，以及我们为马来西亚家庭打造的更清晰海鲜购物体验。仅供预览，尚未开放下单。"],
    "A better link between Semporna and your kitchen.": ["Hubungan yang lebih dekat antara Semporna dan dapur anda.", "让仙本那与您的厨房联系更紧密。"],
    "Ikanza grew from a fisherman’s wish to share the fish and flavours of Semporna with more Malaysian homes. We are developing the storefront with a seafood farming partner, and will share the confirmed fish, handling process and delivery details before taking orders.": ["Ikanza lahir daripada hasrat seorang nelayan untuk berkongsi ikan dan cita rasa Semporna dengan lebih banyak rumah di Malaysia. Kami sedang membangunkan kedai ini bersama rakan penternakan makanan laut, dan akan berkongsi jenis ikan, proses pengendalian serta butiran penghantaran yang disahkan sebelum menerima pesanan.", "Ikanza 源自一位渔民的心愿：让更多马来西亚家庭品尝到仙本那的鱼鲜与风味。我们正与海鲜养殖伙伴共同开发店铺，并会在接单前公布已确认的鱼种、处理流程和配送详情。"],
    "One fisherman. More tables. The flavours of Semporna.": ["Seorang nelayan. Lebih banyak meja makan. Cita rasa Semporna.", "一位渔民，更多餐桌，仙本那的鲜味。"],
    "Ikanza began with a simple wish: help more Malaysian households discover the fish and flavours he knows best.": ["Ikanza bermula dengan hasrat yang sederhana: membantu lebih banyak keluarga di Malaysia mengenali ikan dan cita rasa yang paling dekat dengan kehidupan nelayan itu.", "Ikanza 始于一个朴素的心愿：让更多马来西亚家庭认识这位渔民最熟悉的鱼鲜与风味。"],
    "Good fish deserve a clearer way to reach your table.": ["Ikan yang baik wajar sampai ke meja anda dengan cara yang lebih jelas.", "好鱼值得以更透明的方式走上您的餐桌。"],
    "Where it began": ["Di mana ia bermula", "故事的起点"],
    "Closer to the source. Clearer at the table.": ["Lebih dekat dengan sumber. Lebih jelas di meja makan.", "更贴近源头，餐桌上更明白。"],
    "For a fisherman in Semporna, seafood is part of home. He wanted families beyond Sabah to enjoy its flavours, too.": ["Bagi seorang nelayan di Semporna, makanan laut ialah sebahagian daripada kampung halamannya. Dia juga mahu keluarga di luar Sabah menikmati cita rasanya.", "对一位仙本那渔民来说，海鲜是家乡生活的一部分。他希望沙巴以外的家庭也能品尝这些风味。"],
    "The Semporna farmer previously relied on one buyer who supplies businesses. Ikanza is being built to bring his fish closer to households in Peninsular Malaysia, with clearer product, price and delivery details before anyone orders.": ["Penternak ikan di Semporna itu sebelum ini bergantung pada seorang pembeli yang membekalkan ikan kepada perniagaan. Ikanza sedang dibina untuk mendekatkan hasil ikannya kepada keluarga di Semenanjung Malaysia, dengan butiran produk, harga dan penghantaran yang lebih jelas sebelum sesiapa membuat pesanan.", "这位仙本那养殖户此前依靠一位向商家供货的买家。Ikanza 正在筹建，希望让他的鱼更贴近马来西亚半岛的家庭，并在下单前清楚说明产品、价格和配送详情。"],
    "We want it to be easier to understand the fish, see the full cost and know what to expect before ordering. Our first focus is homes in Peninsular Malaysia.": ["Kami mahu pelanggan lebih mudah memahami ikan yang dibeli, melihat jumlah kos dan mengetahui apa yang boleh dijangka sebelum membuat pesanan. Tumpuan awal kami ialah keluarga di Semenanjung Malaysia.", "我们希望顾客在下单前，更容易了解鱼、看清全部费用，并知道接下来会怎样。我们首先面向马来西亚半岛的家庭。"],
    "What we are building toward": ["Matlamat yang sedang kami usahakan", "我们正在努力实现"],
    "Seafood shopping with fewer surprises.": ["Membeli makanan laut dengan lebih sedikit kejutan.", "选购海鲜，少一些意外。"],
    "Know the fish": ["Kenali ikan", "了解鱼"],
    "Clear names, origin, preparation and pack details.": ["Nama, asal, cara penyediaan dan butiran pek yang jelas.", "清楚列出名称、来源、处理方式和包装详情。"],
    "Know the full cost": ["Ketahui jumlah kos", "看清全部费用"],
    "Product and delivery costs visible before checkout.": ["Harga produk dan kos penghantaran kelihatan sebelum semakan pesanan.", "结账前就能看到商品价格和配送费用。"],
    "Know what to expect": ["Ketahui apa yang boleh dijangka", "了解后续安排"],
    "Straight answers on handling, timing and help when something goes wrong.": ["Jawapan yang terus terang tentang pengendalian, masa penghantaran dan bantuan jika timbul masalah.", "清楚说明处理方式、配送时间，以及出现问题时如何获得帮助。"],
    "Come see what we are building": ["Lihat apa yang sedang kami bina", "看看我们正在打造什么"],
    "From Semporna, with care.": ["Dari Semporna, dengan penuh teliti.", "来自仙本那，用心呈现。"],
    "Explore the storefront while the farm catalogue and delivery arrangements are being finalised. Ikanza is not yet taking orders; current listings, prices and checkout are illustrative.": ["Terokai kedai ini sementara katalog ladang dan aturan penghantaran dimuktamadkan. Ikanza belum menerima pesanan; senarai produk, harga dan semakan pesanan yang dipaparkan hanyalah ilustrasi.", "养殖场商品目录和配送安排仍在敲定中，欢迎先浏览店铺。Ikanza 尚未接单；当前商品信息、价格及结账流程仅供示意。"],
    "Ikanza is being developed with a seafood farming partner in Semporna, with Peninsular Malaysian households in mind.": ["Ikanza dibangunkan bersama rakan penternakan makanan laut di Semporna, dengan keperluan isi rumah di Semenanjung Malaysia dalam fikiran.", "Ikanza 正与仙本那的海鲜养殖伙伴共同开发，面向马来西亚半岛的家庭。"],
    "Seafood should feel easy to choose, order and enjoy.": ["Memilih, memesan dan menikmati makanan laut sepatutnya mudah.", "挑选、订购和享用海鲜，本该轻松简单。"],
    "The idea": ["Idea kami", "我们的想法"],
    "A clearer link between the farm and your kitchen.": ["Hubungan yang lebih jelas antara ladang dan dapur anda.", "让养殖场与您的厨房联系更清晰。"],
    "Our starting point is simple: make it easier for households to understand the fish they are choosing and the full cost of getting it home.": ["Titik permulaan kami mudah: memudahkan isi rumah memahami ikan yang dipilih dan jumlah kos untuk menghantarnya ke rumah.", "我们的出发点很简单：让家庭更容易了解所选的鱼，以及送货到家的全部费用。"],
    "We are still confirming the farm catalogue, packing process and delivery route. We will publish the real products, photos, prices and contact details before taking orders.": ["Kami masih mengesahkan katalog ladang, proses pembungkusan dan laluan penghantaran. Produk, foto, harga dan butiran hubungan sebenar akan diterbitkan sebelum kami menerima pesanan.", "养殖场商品目录、包装流程和配送路线仍在确认中。接单前，我们会公布实际商品、照片、价格和联系方式。"],
    "Confirmed farm details and sourcing": ["Butiran ladang dan sumber yang disahkan", "已确认的养殖场及来源信息"],
    "Clear species, weights, cuts and prices": ["Spesies, berat, potongan dan harga yang jelas", "清楚列出鱼种、重量、切割方式和价格"],
    "Published delivery coverage and quality process": ["Liputan penghantaran dan proses kualiti yang diterbitkan", "公开配送范围与品质处理流程"],

    "Answers before checkout.": ["Jawapan sebelum semakan pesanan.", "结账前，先找到答案。"],
    "We are finalising delivery and product handling. Here is what is known, and what will be confirmed before orders open.": ["Kami sedang memuktamadkan penghantaran dan pengendalian produk. Berikut perkara yang sudah diketahui dan yang akan disahkan sebelum pesanan dibuka.", "配送和产品处理方式仍在敲定。以下说明目前已知事项，以及开放下单前还需确认的内容。"],
    "Where will Ikanza deliver?": ["Ke mana Ikanza akan menghantar?", "Ikanza 会配送到哪里？"],
    "We are planning for Peninsular Malaysia. Coverage, postcodes, delivery frequency and charges will be published before orders open. The checkout preview uses sample areas and fees.": ["Kami merancang penghantaran ke Semenanjung Malaysia. Liputan, poskod, kekerapan penghantaran dan caj akan diterbitkan sebelum pesanan dibuka. Pratonton semakan pesanan menggunakan kawasan dan caj contoh.", "我们计划配送至马来西亚半岛。配送范围、邮编、配送频率和费用将在开放下单前公布。结账预览使用的是示例区域和费用。"],
    "When would my fish arrive?": ["Bilakah ikan saya akan tiba?", "鱼什么时候会送到？"],
    "Delivery dates are not confirmed yet. The dates shown in checkout are examples; actual estimates and order cutoffs will be shown before payment is enabled.": ["Tarikh penghantaran belum disahkan. Tarikh dalam pratonton semakan pesanan hanyalah contoh; anggaran sebenar dan waktu akhir pesanan akan dipaparkan sebelum pembayaran diaktifkan.", "配送日期尚未确认。结账页面显示的日期仅为示例；实际预计送达时间和截单时间会在开放付款前公布。"],
    "Will the fish be chilled or frozen?": ["Adakah ikan disejukkan atau dibekukan?", "鱼是冷藏还是冷冻的？"],
    "The product condition and packing method have not been confirmed. Each live listing will state these details clearly.": ["Keadaan produk dan kaedah pembungkusan belum disahkan. Setiap senarai produk rasmi akan menyatakan butiran ini dengan jelas.", "产品状态及包装方式尚未确认。正式商品页面会清楚列出这些信息。"],
    "Are these the farm’s actual products?": ["Adakah ini produk sebenar dari ladang?", "这些是养殖场的实际产品吗？"],
    "Not yet. The images, species, pack sizes and prices are illustrative. The final catalogue will follow the farm’s confirmed offering.": ["Belum lagi. Imej, spesies, saiz pek dan harga hanyalah ilustrasi. Katalog akhir akan mengikut produk yang disahkan oleh ladang.", "目前还不是。图片、鱼种、包装规格和价格仅供示意。最终目录将以养殖场确认的产品为准。"],
    "What if there is a problem with an order?": ["Bagaimana jika ada masalah dengan pesanan?", "如果订单出现问题怎么办？"],
    "We will publish contact details and a clear process for missing, damaged or incorrect seafood before taking orders. There are no real purchases or refunds through this preview.": ["Kami akan menerbitkan butiran hubungan serta proses yang jelas untuk makanan laut yang hilang, rosak atau tersalah hantar sebelum menerima pesanan. Tiada pembelian atau bayaran balik sebenar melalui pratonton ini.", "接单前，我们会公布联系方式及处理漏发、损坏或错发海鲜的明确流程。此预览不涉及真实购买或退款。"],
    "Can I pay here?": ["Bolehkah saya membayar di sini?", "可以在这里付款吗？"],
    "No. Orders are not open. The checkout preview does not collect payment details or send an order.": ["Tidak. Pesanan belum dibuka. Pratonton semakan pesanan tidak mengumpul butiran pembayaran atau menghantar pesanan.", "不可以。目前尚未开放下单。结账预览不会收集付款资料或提交订单。"],
    "Contact details, full terms and privacy information will be published before any live selling.": ["Butiran hubungan, terma penuh dan maklumat privasi akan diterbitkan sebelum jualan sebenar bermula.", "正式销售开始前，我们会公布联系方式、完整条款及隐私信息。"],
    "Sample details filled. Nothing was submitted.": ["Maklumat contoh diisi. Tiada apa-apa dihantar.", "已填入示例资料，未提交任何内容。"],
    "Preview bag updated.": ["Bakul pratonton dikemas kini.", "预览购物袋已更新。"],
    "Item removed from preview bag.": ["Produk dikeluarkan daripada bakul pratonton.", "商品已从预览购物袋移除。"],
    "Sample confirmation shown. No payment or real order was made.": ["Pengesahan contoh dipaparkan. Tiada bayaran atau pesanan sebenar dibuat.", "已显示示例确认页面，没有付款或提交真实订单。"],
    "Track this preview": ["Jejak pratonton ini", "追踪此预览订单"],
    "View account preview": ["Lihat pratonton akaun", "查看账户预览"],
    "Illustrative customer journey": ["Perjalanan pelanggan sebagai ilustrasi", "顾客体验示例"],
    "A seafood dinner, with the details clear from the start.": ["Makan malam makanan laut, dengan butiran jelas sejak awal.", "一顿海鲜晚餐，从一开始就清楚明白。"],
    "Picture a household in Peninsular Malaysia planning a weekend meal. They compare fish names and pack sizes, check the full sample total with delivery, and review the details before deciding. That is the shopping experience Ikanza is building with a seafood farming partner in Semporna.": ["Bayangkan sebuah keluarga di Semenanjung Malaysia merancang hidangan hujung minggu. Mereka membandingkan nama ikan dan saiz pek, melihat jumlah contoh termasuk penghantaran, lalu menyemak butiran sebelum membuat keputusan. Itulah pengalaman membeli-belah yang sedang dibina oleh Ikanza bersama rakan penternakan makanan laut di Semporna.", "想象马来西亚半岛的一家人正在计划周末聚餐。他们比较鱼名和包装规格，查看含配送费的示例总额，再核对详情后作决定。这正是 Ikanza 与仙本那海鲜养殖伙伴共同打造的购物体验。"],
    "See the customer story": ["Lihat kisah pelanggan", "查看顾客故事"],
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
    "There are no real customer stories yet. We will add genuine feedback with the customer’s permission after deliveries begin.": ["Belum ada kisah pelanggan sebenar. Kami akan menambah maklum balas yang tulen dengan izin pelanggan selepas penghantaran bermula.", "目前还没有真实顾客故事。配送开始后，我们会在获得顾客许可的情况下加入真实反馈。"],
    "Explore the storefront": ["Terokai kedai", "浏览店铺"],
    "No checkout previews yet.": ["Belum ada pratonton semakan pesanan.", "还没有结账预览记录。"],
    "Explore a product and try the sample checkout to see a reference here.": ["Terokai produk dan cuba semakan pesanan contoh untuk melihat nombor rujukan di sini.", "浏览商品并体验示例结账，即可在这里看到预览编号。"],
    "Sample order": ["Pesanan contoh", "示例订单"],
    "Track preview →": ["Jejak pratonton →", "追踪预览订单 →"],
    "Account preview": ["Pratonton akaun", "账户预览"],
    "Your Ikanza space.": ["Ruang Ikanza anda.", "您的 Ikanza 专属空间。"],
    "Create a sample profile to see how an account and order history could work.": ["Cipta profil contoh untuk melihat cara akaun dan sejarah pesanan mungkin berfungsi.", "创建示例个人资料，了解账户和订单记录未来可能的样子。"],
    "Create a preview profile": ["Cipta profil pratonton", "创建预览资料"],
    "This is stored only in this browser. It does not create a real account, password or email subscription.": ["Maklumat ini disimpan dalam pelayar ini sahaja. Ia tidak mencipta akaun sebenar, kata laluan atau langganan e-mel.", "资料仅保存在此浏览器中，不会创建真实账户、密码或邮件订阅。"],
    "Name": ["Nama", "姓名"],
    "Create preview profile": ["Cipta profil pratonton", "创建预览资料"],
    "What an account could do": ["Fungsi akaun pada masa depan", "账户未来可以做什么"],
    "Find order history, review delivery details and follow tracking updates in one place.": ["Lihat sejarah pesanan, semak butiran penghantaran dan ikuti kemas kini penjejakan di satu tempat.", "在同一处查看订单记录、配送详情和追踪更新。"],
    "For this preview, entries stay on your device. No email is sent and no account is available on another device.": ["Untuk pratonton ini, maklumat kekal pada peranti anda. Tiada e-mel dihantar dan akaun ini tidak tersedia pada peranti lain.", "在此预览中，资料只保存在您的设备上。不会发送邮件，也无法在其他设备上使用此账户。"],
    "Your sample orders and delivery previews are saved in this browser.": ["Pesanan contoh dan pratonton penghantaran anda disimpan dalam pelayar ini.", "您的示例订单和配送预览保存在此浏览器中。"],
    "Order history preview": ["Pratonton sejarah pesanan", "订单记录预览"],
    "Your sample orders": ["Pesanan contoh anda", "您的示例订单"],
    "Preview profile": ["Profil pratonton", "预览资料"],
    "This profile is browser-only. There is no password, sign-in or live account yet.": ["Profil ini hanya wujud dalam pelayar. Belum ada kata laluan, log masuk atau akaun sebenar.", "此资料仅存在于浏览器中，目前没有密码、登录功能或真实账户。"],
    "Remove preview profile": ["Padam profil pratonton", "移除预览资料"],
    "Example date": ["Tarikh contoh", "示例日期"],
    "No matching preview reference.": ["Tiada rujukan pratonton yang sepadan.", "找不到匹配的预览编号。"],
    "Only references created in this browser and the sample reference can be shown. No courier system is connected.": ["Hanya rujukan yang dicipta dalam pelayar ini dan rujukan contoh boleh dipaparkan. Tiada sistem kurier disambungkan.", "只能显示在此浏览器中生成的编号和内置示例编号；目前未连接任何快递系统。"],
    "Preview created": ["Pratonton dicipta", "预览已创建"],
    "Packing at origin": ["Pembungkusan di tempat asal", "产地打包"],
    "Handed to courier": ["Diserahkan kepada kurier", "交给快递公司"],
    "In transit": ["Dalam perjalanan", "运输途中"],
    "Out for delivery": ["Sedang dihantar", "派送中"],
    "Delivered": ["Telah dihantar", "已送达"],
    "Sample tracking": ["Penjejakan contoh", "示例追踪"],
    "No real shipment exists.": ["Tiada penghantaran sebenar.", "没有真实配送。"],
    "The first step shows a preview reference; the remaining steps show the type of updates a real courier could provide.": ["Langkah pertama menunjukkan rujukan pratonton; langkah selebihnya menunjukkan jenis kemas kini yang mungkin diberikan oleh kurier sebenar.", "第一步显示预览编号；其余步骤展示真实快递公司未来可能提供的更新类型。"],
    "Preview reference shown in this browser.": ["Rujukan pratonton dipaparkan dalam pelayar ini.", "预览编号显示在此浏览器中。"],
    "Example future milestone — no courier update yet.": ["Contoh peringkat penghantaran akan datang — belum ada kemas kini kurier.", "未来配送节点示例——目前没有快递更新。"],
    "Delivery tracking preview": ["Pratonton penjejakan penghantaran", "配送追踪预览"],
    "Know where things stand.": ["Ketahui perkembangan terkini.", "随时了解配送进度。"],
    "Try a sample reference to see how delivery updates could appear when Ikanza begins taking orders.": ["Cuba rujukan contoh untuk melihat cara kemas kini penghantaran mungkin dipaparkan apabila Ikanza mula menerima pesanan.", "试用示例编号，看看 Ikanza 开始接单后配送更新可能如何呈现。"],
    "Track a preview reference": ["Jejak rujukan pratonton", "追踪预览编号"],
    "Enter a reference from this browser’s sample checkout, or open the built-in example.": ["Masukkan rujukan daripada semakan pesanan contoh dalam pelayar ini atau buka contoh yang disediakan.", "输入此浏览器示例结账产生的编号，或打开内置示例。"],
    "Show tracking preview": ["Lihat pratonton penjejakan", "查看追踪预览"],
    "Try sample reference": ["Cuba rujukan contoh", "试用示例编号"],
    "Tracking is a design preview. No carrier is connected, and this site cannot locate a real parcel.": ["Penjejakan ini ialah pratonton reka bentuk. Tiada syarikat penghantaran disambungkan dan laman ini tidak dapat menjejak bungkusan sebenar.", "追踪功能仅为设计预览。此网站未连接物流公司，无法查询真实包裹。"],
    "Sample profile details filled.": ["Butiran profil contoh diisi.", "已填入示例资料。"],
    "Preview profile removed from this browser.": ["Profil pratonton dipadam daripada pelayar ini.", "预览资料已从此浏览器移除。"],
    "Preview profile created in this browser.": ["Profil pratonton dicipta dalam pelayar ini.", "预览资料已在此浏览器中创建。"],

    // Standalone wholesale preview.
    "Wholesale Seafood Enquiries for Peninsular Malaysia | Ikanza": ["Pertanyaan Borong Makanan Laut Semporna di Semenanjung Malaysia | Ikanza", "马来西亚半岛海鲜批发咨询 | Ikanza"],
    "Ikanza is exploring a clearer connection between a Semporna seafood farming partner and restaurants, hotels and caterers in Peninsular Malaysia. Preview a wholesale enquiry; enquiries are not open yet.": ["Ikanza sedang meneroka hubungan yang lebih jelas antara rakan penternakan makanan laut di Semporna dengan restoran, hotel dan penyedia katering di Semenanjung Malaysia. Lihat pratonton pertanyaan borong; pertanyaan belum dibuka.", "Ikanza 正在探索如何让仙本那海鲜养殖伙伴与马来西亚半岛的餐厅、酒店及餐饮服务商建立更清晰的联系。欢迎预览批发咨询流程；目前尚未开放咨询。"],
    "A future wholesale connection to Semporna seafood for Peninsular Malaysian kitchens. Preview the enquiry journey; enquiries are not open yet.": ["Hubungan borong makanan laut Semporna yang sedang dirancang untuk dapur di Semenanjung Malaysia. Lihat pratonton proses pertanyaan; pertanyaan belum dibuka.", "面向马来西亚半岛餐饮厨房的仙本那海鲜批发联系正在筹备中。欢迎预览咨询流程；目前尚未开放咨询。"],
    "WHOLESALE ENQUIRY PREVIEW": ["PRATONTON PERTANYAAN BORONG", "批发咨询预览"],
    "Wholesale": ["Borong", "批发"],
    "For restaurants, hotels & caterers": ["Untuk restoran, hotel & penyedia katering", "面向餐厅、酒店及餐饮服务商"],
    "A closer connection to Semporna seafood, built for your kitchen.": ["Hubungan lebih dekat dengan makanan laut Semporna, untuk dapur anda.", "让您的厨房更贴近仙本那海鲜。"],
    "Ikanza is exploring a clearer way for food businesses in Peninsular Malaysia to connect with a seafood farming partner in Semporna. Tell us what matters to your menu when enquiries open. For now, you can preview the journey.": ["Ikanza sedang meneroka cara yang lebih jelas untuk perniagaan makanan di Semenanjung Malaysia berhubung dengan rakan penternakan makanan laut di Semporna. Apabila pertanyaan dibuka kelak, kongsikan keperluan menu anda. Buat masa ini, anda boleh melihat pratonton prosesnya.", "Ikanza 正在探索如何让马来西亚半岛的餐饮企业更清楚地与仙本那的海鲜养殖伙伴对接。咨询开放后，欢迎告诉我们您的菜单需求。目前可先预览流程。"],
    "Preview a wholesale enquiry": ["Lihat pratonton pertanyaan borong", "预览批发咨询"],
    "Read our story": ["Baca kisah kami", "阅读我们的故事"],
    "Preview only. No business enquiry is sent from this page.": ["Pratonton sahaja. Tiada pertanyaan perniagaan dihantar melalui halaman ini.", "仅供预览。本页面不会发送商业咨询。"],
    "From Semporna": ["Dari Semporna", "来自仙本那"],
    "to more menus": ["ke lebih banyak menu", "走进更多菜单"],
    "Illustrative imagery; farm products are being confirmed.": ["Imej hanya ilustrasi; produk ladang sedang disahkan.", "图片仅供示意；养殖场产品仍在确认中。"],
    "A better sourcing conversation": ["Perbincangan perolehan yang lebih baik", "更有效的采购沟通"],
    "Good decisions start with good details.": ["Keputusan yang baik bermula dengan maklumat yang jelas.", "好的决策始于清楚的细节。"],
    "Every kitchen has its own needs. We are shaping a wholesale experience around the questions that matter before a buyer commits.": ["Setiap dapur mempunyai keperluan tersendiri. Kami sedang membentuk pengalaman borong berasaskan persoalan penting sebelum pembeli membuat komitmen.", "每个厨房都有自己的需求。我们正围绕买家作出决定前最关心的问题，设计批发体验。"],
    "Your menu comes first": ["Menu anda diutamakan", "从您的菜单需求出发"],
    "Tell us the fish, preparation, quantity and ordering rhythm your business would consider.": ["Kongsikan jenis ikan, cara penyediaan, kuantiti dan kekerapan pesanan yang perniagaan anda pertimbangkan.", "告诉我们您的企业会考虑哪些鱼种、处理方式、数量和订购频率。"],
    "The facts on the table": ["Maklumat yang jelas untuk dinilai", "把关键信息摆在桌面上"],
    "Confirmed species, condition, pack sizes, availability and prices should be clear before a decision.": ["Spesies, keadaan produk, saiz pek, ketersediaan dan harga yang disahkan perlu jelas sebelum membuat keputusan.", "作决定前，应清楚了解已确认的鱼种、产品状态、包装规格、供应情况和价格。"],
    "A route that makes sense": ["Laluan penghantaran yang masuk akal", "合理的配送安排"],
    "Coverage, handling, timing and support will be explained when the delivery arrangements are ready.": ["Liputan, pengendalian, masa penghantaran dan sokongan akan diterangkan apabila aturan penghantaran siap.", "配送安排确定后，我们会说明覆盖范围、处理方式、时间和支持服务。"],
    "Wholesale enquiry preview": ["Pratonton pertanyaan borong", "批发咨询预览"],
    "What could Ikanza bring to your menu?": ["Apa yang boleh Ikanza tawarkan untuk menu anda?", "Ikanza 未来能为您的菜单带来什么？"],
    "Show us the shape of your kitchen’s needs. This preview demonstrates the future enquiry flow while the farm catalogue, supply, pricing and delivery route are being confirmed.": ["Kongsikan gambaran keperluan dapur anda. Pratonton ini menunjukkan proses pertanyaan yang dirancang sementara katalog ladang, bekalan, harga dan laluan penghantaran sedang disahkan.", "告诉我们您厨房需求的大致方向。养殖场商品目录、供应、价格和配送路线仍在确认中；此页面仅展示未来可能的咨询流程。"],
    "Describe your needs.": ["Terangkan keperluan anda.", "描述您的需求。"],
    "Choose the type of business, area, seafood interest and expected volume.": ["Pilih jenis perniagaan, kawasan, makanan laut yang diminati dan anggaran kuantiti.", "选择企业类型、所在地区、感兴趣的海鲜及预计采购量。"],
    "See a sample confirmation.": ["Lihat pengesahan contoh.", "查看示例确认。"],
    "The preview clears your entries immediately afterward.": ["Pratonton ini akan mengosongkan maklumat yang anda isi sejurus selepas itu.", "预览随后会立即清除您填写的内容。"],
    "Connect later.": ["Hubungi kami kemudian.", "稍后再联系。"],
    "A real contact route will be published when wholesale enquiries open.": ["Saluran hubungan sebenar akan diterbitkan apabila pertanyaan borong dibuka.", "批发咨询开放时，我们会公布正式的联系渠道。"],
    "Current wholesale status": ["Status borong semasa", "当前批发业务状态"],
    "Opening later": ["Akan dibuka kemudian", "稍后开放"],
    "Where things stand": ["Keadaan semasa", "目前进展"],
    "No wholesale catalogue, stock, prices or delivery schedule is confirmed yet. There is no way to send an enquiry through this preview.": ["Katalog borong, stok, harga dan jadual penghantaran belum disahkan. Pertanyaan tidak boleh dihantar melalui pratonton ini.", "批发商品目录、库存、价格和配送时间表均尚未确认。此预览无法发送咨询。"],
    "Try the experience": ["Cuba pengalaman ini", "体验一下"],
    "Your wholesale brief": ["Ringkasan keperluan borong anda", "您的批发需求简述"],
    "Preview only:": ["Pratonton sahaja:", "仅供预览："],
    "Nothing entered here is sent to Ikanza or saved by this page. Please use sample information.": ["Maklumat yang diisi di sini tidak dihantar kepada Ikanza atau disimpan oleh halaman ini. Sila gunakan maklumat contoh.", "您在此填写的内容不会发送给 Ikanza，也不会由此页面保存。请使用示例信息。"],
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
    "Seafood you are looking for": ["Makanan laut yang anda cari", "您希望采购的海鲜"],
    "Species, format or dishes you have in mind": ["Spesies, bentuk produk atau hidangan yang anda fikirkan", "您考虑的鱼种、产品形式或菜肴"],
    "Approximate quantity": ["Anggaran kuantiti", "预计数量"],
    "e.g. 20 kg per order": ["cth. 20 kg setiap pesanan", "例如每单 20 公斤"],
    "Expected frequency": ["Kekerapan yang dijangka", "预计订购频率"],
    "Select a frequency": ["Pilih kekerapan", "选择频率"],
    "Weekly": ["Setiap minggu", "每周"],
    "Every two weeks": ["Setiap dua minggu", "每两周"],
    "Monthly": ["Setiap bulan", "每月"],
    "One event or occasion": ["Untuk satu acara atau majlis", "单次活动或场合"],
    "Still exploring": ["Masih meninjau", "仍在了解"],
    "Anything else we should know?": ["Ada perkara lain yang perlu kami tahu?", "还有什么希望我们了解？"],
    "Optional": ["Pilihan", "选填"],
    "Preparation, timing or questions for a future conversation": ["Penyediaan, masa atau soalan untuk perbincangan akan datang", "处理方式、时间安排或未来沟通时想问的问题"],
    "* Required for the sample preview": ["* Wajib untuk pratonton contoh", "* 示例预览必填"],
    "This button displays a local preview. It does not contact Ikanza.": ["Butang ini memaparkan pratonton pada peranti anda. Ia tidak menghubungi Ikanza.", "此按钮仅显示本地预览，不会联系 Ikanza。"],
    "Your preview is complete.": ["Pratonton anda selesai.", "预览已完成。"],
    "No enquiry was sent, no reply is expected, and the details you entered have been cleared from the form. When Ikanza opens wholesale enquiries, this is where you would receive a real confirmation and next steps.": ["Tiada pertanyaan dihantar dan tiada balasan akan diterima. Maklumat yang anda isi telah dikosongkan daripada borang. Apabila Ikanza membuka pertanyaan borong, di sinilah pengesahan sebenar dan langkah seterusnya akan dipaparkan.", "咨询未发送，因此不会收到回复；您填写的内容已从表单中清除。Ikanza 开放批发咨询后，正式确认和后续步骤将显示在这里。"],
    "Try the preview again": ["Cuba pratonton sekali lagi", "再次体验预览"],
    "Built around your kitchen": ["Dibina mengikut keperluan dapur anda", "围绕您的厨房需求打造"],
    "A clearer connection begins here.": ["Hubungan yang lebih jelas bermula di sini.", "更清晰的合作，从这里开始。"],
    "Explore the Ikanza story and the storefront preview while real wholesale details are being prepared.": ["Terokai kisah Ikanza dan pratonton kedai sementara butiran borong sebenar sedang disediakan.", "正式批发信息仍在准备中，欢迎先了解 Ikanza 的故事并浏览店铺预览。"],
    "© Ikanza. Preview storefront; no orders or enquiries.": ["© Ikanza. Pratonton kedai; tiada pesanan atau pertanyaan diterima.", "© Ikanza。店铺预览；暂不接受订单或咨询。"],

    // Values inserted by the page's sample-fill button.
    "Example Buyer": ["Pembeli Contoh", "示例采购员"],
    "Example Kitchen": ["Dapur Contoh", "示例厨房"],
    "Whole fish for shared mains": ["Ikan seekor untuk hidangan utama berkongsi", "适合共享主菜的整鱼"],
    "20 kg per order": ["20 kg setiap pesanan", "每单 20 公斤"],
    "Interested in confirmed species, preparation and delivery terms when available.": ["Berminat untuk mengetahui spesies, cara penyediaan dan syarat penghantaran yang disahkan apabila tersedia.", "希望在信息确认后了解鱼种、处理方式及配送条款。"],

    // Seven-product catalogue, sizes and search.
    "Grouper": ["Kerapu", "石斑鱼"],
    "Indian mackerel": ["Ikan kembung", "印度鲭鱼"],
    "Fresh prawns": ["Udang segar", "鲜虾"],
    "Whole squid": ["Sotong seekor", "整只鱿鱼"],
    "Flower crab": ["Ketam bunga", "花蟹"],
    "Ikan kerapu": ["Ikan kerapu", "Ikan kerapu（石斑鱼）"],
    "Ikan kembung": ["Ikan kembung", "Ikan kembung（印度鲭鱼）"],
    "Ikan merah": ["Ikan merah", "Ikan merah（红鱼）"],
    "Siakap": ["Siakap", "Siakap（金目鲈）"],
    "Udang": ["Udang", "Udang（虾）"],
    "Sotong": ["Sotong", "Sotong（鱿鱼）"],
    "Ketam bunga": ["Ketam bunga", "Ketam bunga（花蟹）"],
    "Kerapu": ["Kerapu", "Kerapu（石斑鱼）"],
    "Whole fish": ["Ikan seekor", "整鱼"],
    "Whole prawns": ["Udang utuh", "整虾"],
    "Whole crab": ["Ketam seekor", "整蟹"],
    "Whole prawns example": ["Contoh udang utuh", "整虾示例"],
    "Whole squid example": ["Contoh sotong seekor", "整只鱿鱼示例"],
    "Whole crab example": ["Contoh ketam seekor", "整蟹示例"],
    "Everyday favourite": ["Pilihan harian", "日常之选"],
    "Sweet & versatile": ["Manis & serba guna", "鲜甜，做法多样"],
    "Tender & savoury": ["Lembut & enak", "鲜嫩可口"],
    "Sweet & delicate": ["Manis & halus", "鲜甜细腻"],
    "A firm fish often enjoyed steamed with ginger or roasted.": ["Ikan berisi pejal yang sering dinikmati kukus bersama halia atau dipanggang.", "肉质紧实，常用姜清蒸或烤制。"],
    "A mild fish suited to steaming, baking or pan-searing.": ["Ikan berasa lembut yang sesuai dikukus, dibakar atau digoreng dalam kuali.", "味道清淡，适合清蒸、烘烤或香煎。"],
    "A clean flavour that works well in shared dishes.": ["Rasa segar yang sesuai untuk hidangan yang dinikmati bersama.", "味道清爽，适合与家人朋友分享。"],
    "An everyday fish that is lovely fried, grilled or cooked in curry.": ["Ikan kegemaran harian yang enak digoreng, dibakar atau dimasak kari.", "家常鱼类，适合油炸、烧烤或煮咖喱。"],
    "A versatile seafood favourite for stir-fries, noodles and grilling.": ["Makanan laut kegemaran yang serba guna untuk tumisan, mi dan panggangan.", "做法多样的海鲜佳选，适合快炒、配面或烧烤。"],
    "A versatile option for quick cooking, grilling or sambal.": ["Pilihan serba guna untuk masakan ringkas, panggangan atau sambal.", "适合快炒、烧烤或做叁巴酱料理。"],
    "A seafood favourite for curry, steaming and shared meals.": ["Makanan laut kegemaran untuk kari, kukus dan hidangan bersama.", "适合做咖喱、清蒸，也适合多人共享。"],
    "All seafood": ["Semua makanan laut", "全部海鲜"],
    "Premium fish": ["Ikan premium", "优质鱼类"],
    "Everyday fish": ["Ikan harian", "日常鱼类"],
    "Prawns": ["Udang", "虾类"],
    "Squid": ["Sotong", "鱿鱼"],
    "Crab": ["Ketam", "螃蟹"],
    "Small": ["Kecil", "小"],
    "Medium": ["Sederhana", "中"],
    "Large": ["Besar", "大"],
    "Small pack": ["Pek kecil", "小包装"],
    "Medium pack": ["Pek sederhana", "中包装"],
    "Large pack": ["Pek besar", "大包装"],
    "500 g pack": ["Pek 500 g", "500 克装"],
    "1 kg pack": ["Pek 1 kg", "1 公斤装"],
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
    "Example market prices, checked 29 October 2026.": ["Harga pasaran contoh, disemak pada 29 Oktober 2026.", "市场参考价格，查阅日期：2026 年 10 月 29 日。"],
    "References:": ["Rujukan:", "参考来源："],
    "PasarHub fish": ["ikan di PasarHub", "PasarHub 鱼类"],
    "seafood": ["makanan laut", "海鲜"],
    "AEON siakap": ["siakap di AEON", "AEON 金目鲈"],
    "ShopFrosty grouper": ["kerapu di ShopFrosty", "ShopFrosty 石斑鱼"],
    "red snapper": ["ikan merah", "红鲷鱼"],
    ", and": [", dan", "，以及"],
    ". Pack sizes and several prices are estimates for this preview; species, cuts, condition, farm stock and Ikanza prices are unconfirmed.": [". Saiz pek dan beberapa harga adalah anggaran untuk pratonton ini; spesies, potongan, keadaan produk, stok ladang dan harga Ikanza belum disahkan.", "。此预览的包装规格和部分价格为估算；鱼种、切割方式、产品状态、养殖场库存及 Ikanza 价格尚未确认。"],
    "Based on public": ["Berdasarkan senarai awam daripada", "参考公开的"],
    "and": ["dan", "和"],
    "listings checked 29 October 2026. Pack options are demo estimates; farm stock and Ikanza prices are unconfirmed.": ["yang disemak pada 29 Oktober 2026. Pilihan pek ialah anggaran demo; stok ladang dan harga Ikanza belum disahkan.", "商品信息（查阅日期：2026 年 10 月 29 日）。包装选项为演示估算；养殖场库存和 Ikanza 价格尚未确认。"],
    "Example offers": ["Tawaran contoh", "优惠示例"],
    "Free delivery from RM250 in Klang Valley or RM400 elsewhere in Peninsular Malaysia": ["Penghantaran percuma bermula daripada RM250 di Lembah Klang atau RM400 di kawasan lain Semenanjung Malaysia", "巴生谷商品满 RM250，或马来西亚半岛其他地区满 RM400，即可享示例免运费"],
    "Spend RM500 on items for an extra 5% off (up to RM50).": ["Belanja RM500 untuk produk dan dapatkan diskaun tambahan 5% (maksimum RM50).", "商品消费满 RM500，可额外享 5% 示例折扣（最高 RM50）。"],
    "Preview math only. Real delivery costs and offers depend on the Semporna cold chain and are not available yet.": ["Pengiraan ini hanya untuk pratonton. Kos penghantaran dan tawaran sebenar bergantung pada rantaian sejuk dari Semporna dan belum tersedia.", "仅为预览计算。实际配送费用和优惠取决于仙本那的冷链安排，目前尚未确定。"],
    "Example free delivery unlocked": ["Penghantaran percuma contoh tersedia", "已达到示例免运费门槛"],
    "Extra 5% example discount unlocked": ["Diskaun tambahan 5% contoh tersedia", "已达到额外 5% 示例折扣门槛"],
    "See all 7 example items": ["Lihat semua 7 produk contoh", "查看全部 7 件示例商品"],
    "For business": ["Untuk perniagaan", "企业采购"],
    "For restaurants & hotels": ["Untuk restoran & hotel", "面向餐厅与酒店"],
    "Restaurants, hotels & caterers": ["Restoran, hotel & penyedia katering", "餐厅、酒店及餐饮服务商"],
    "Looking for a steadier seafood conversation?": ["Mahukan perbincangan bekalan makanan laut yang lebih jelas?", "希望更踏实地洽谈海鲜供应？"],
    "Tell us the species, volume and delivery area you need. Explore how a direct Semporna supply enquiry could work.": ["Kongsikan spesies, kuantiti dan kawasan penghantaran yang anda perlukan. Terokai cara pertanyaan bekalan terus dari Semporna mungkin berfungsi.", "告诉我们您需要的鱼种、数量和配送区域，了解未来如何咨询仙本那直供海鲜。"],
    "Preview how a Semporna seafood enquiry for your kitchen could work, including species, volume and delivery area.": ["Lihat pratonton cara pertanyaan makanan laut Semporna untuk dapur anda mungkin berfungsi, termasuk spesies, kuantiti dan kawasan penghantaran.", "预览面向您厨房的仙本那海鲜咨询流程，包括鱼种、采购量和配送区域。"],
    "Explore business enquiries": ["Terokai pertanyaan perniagaan", "了解企业采购咨询"],
    "Find seafood by name, local name or category": ["Cari makanan laut mengikut nama, nama tempatan atau kategori", "按名称、当地名称或类别搜索海鲜"],
    "What seafood are you craving?": ["Makanan laut apa yang anda inginkan?", "想吃什么海鲜？"],
    "Clear": ["Kosongkan", "清除"],
    "Try a name:": ["Cuba nama ini:", "试试这些名称："],
    "Filter seafood by category": ["Tapis makanan laut mengikut kategori", "按类别筛选海鲜"],
    "Nothing matching that yet.": ["Belum ada yang sepadan.", "暂时没有匹配的商品。"],
    "Try a different name or browse a category.": ["Cuba nama lain atau lihat mengikut kategori.", "请尝试其他名称或浏览类别。"],
    "Try another spelling, a Malay or English name, or browse a category.": ["Cuba ejaan lain, nama Melayu atau Inggeris, atau lihat mengikut kategori.", "请尝试其他拼写、马来文或英文名称，或浏览类别。"],
    "Ikan bilis is usually sold dried and is not in this fresh seafood preview. Try a fresh fish category or see all seafood.": ["Ikan bilis biasanya dijual kering dan tiada dalam pratonton makanan laut segar ini. Cuba kategori ikan segar atau lihat semua makanan laut.", "江鱼仔通常以干货形式出售，因此不在此鲜海鲜预览中。请选择鲜鱼类别或查看全部海鲜。"],
    "See all seafood": ["Lihat semua makanan laut", "查看全部海鲜"],
    "That seafood is not in this preview.": ["Makanan laut itu tiada dalam pratonton ini.", "此预览中没有该海鲜。"],
    "Return to the sample collection.": ["Kembali ke koleksi contoh.", "返回示例商品系列。"],
    "Example item": ["Produk contoh", "示例商品"],
    "Example from": ["Harga contoh bermula", "示例价起"],
    "Choose size": ["Pilih saiz", "选择规格"],
    "Not for sale yet": ["Belum dijual", "尚未开售"],
    "Choose a sample size or pack weight": ["Pilih saiz atau berat pek contoh", "选择示例尺寸或包装重量"],
    "Size names include a gram range, so you can compare what the example pack means.": ["Nama saiz disertakan julat gram supaya anda boleh membandingkan maksud setiap pek contoh.", "每种规格都标明重量范围，方便比较示例包装的实际含义。"],
    "Selected example pack": ["Pek contoh yang dipilih", "已选示例包装"],
    "Format": ["Bentuk produk", "产品形式"],
    "Farm source": ["Sumber ladang", "养殖场来源"],
    "To be confirmed": ["Akan disahkan", "待确认"],
    "Add example to bag": ["Masukkan produk contoh ke bakul", "将示例商品加入购物袋"],
    "Example product, size and market-based price. The farm catalogue, preparation, condition and availability are still unconfirmed. No order or payment is available.": ["Produk, saiz dan harga berasaskan pasaran ini hanyalah contoh. Katalog ladang, cara penyediaan, keadaan dan ketersediaan masih belum disahkan. Pesanan dan pembayaran belum tersedia.", "商品、规格及参考市场价仅为示例。养殖场目录、处理方式、产品状态和供应情况尚未确认，目前无法下单或付款。"],
    "What if the fish weighs differently?": ["Bagaimana jika berat ikan berbeza?", "如果鱼的重量不同怎么办？"],
    "The gram ranges and prices here are illustrations. Confirmed listings will explain weighing and final pricing before any real checkout opens.": ["Julat gram dan harga di sini hanyalah ilustrasi. Senarai produk yang disahkan akan menerangkan cara penimbangan dan harga akhir sebelum semakan pesanan sebenar dibuka.", "此处的重量范围和价格仅供示意。正式开放结账前，已确认的商品页面会说明称重和最终定价方式。"],
    "Is this from the Semporna farm?": ["Adakah ini dari ladang di Semporna?", "这来自仙本那的养殖场吗？"],
    "The farm has not supplied its final product list or photos. This preview shows possible categories, not confirmed farm stock.": ["Ladang belum memberikan senarai produk akhir atau foto. Pratonton ini menunjukkan kategori yang mungkin ditawarkan, bukan stok ladang yang disahkan.", "养殖场尚未提供最终商品清单或照片。此预览展示的是可能的类别，并非已确认的库存。"],
    "Review the example items, delivery area and full preview total before continuing.": ["Semak produk contoh, kawasan penghantaran dan jumlah penuh pratonton sebelum meneruskan.", "继续前，请核对示例商品、配送区域和预览总额。"],
    "Example delivery area": ["Kawasan penghantaran contoh", "示例配送区域"],
    "Example discount": ["Diskaun contoh", "示例折扣"],
    "Example delivery": ["Penghantaran contoh", "示例配送费"],
    "Example total": ["Jumlah contoh", "示例总额"],
    "Example items": ["Produk contoh", "示例商品"],
    "Example RM30 delivery; free from RM250 item subtotal": ["Penghantaran contoh RM30; percuma apabila jumlah kecil produk mencapai RM250", "示例配送费 RM30；商品小计满 RM250 免运费"],
    "Example RM60 delivery; free from RM400 item subtotal": ["Penghantaran contoh RM60; percuma apabila jumlah kecil produk mencapai RM400", "示例配送费 RM60；商品小计满 RM400 免运费"],
    "These offers are examples only. Orders and payments are not open.": ["Tawaran ini hanyalah contoh. Pesanan dan pembayaran belum dibuka.", "这些优惠仅为示例，目前尚未开放下单或付款。"],
    "All amounts and offers are illustrative. No payment is taken.": ["Semua jumlah dan tawaran hanyalah ilustrasi. Tiada pembayaran diambil.", "所有金额和优惠仅供示意，不会收取费用。"],
    "The reference is generated in your browser only. No real offer was applied.": ["Nombor rujukan hanya dijana dalam pelayar anda. Tiada tawaran sebenar digunakan.", "此编号仅在您的浏览器中生成，没有应用任何真实优惠。"],
    "Your shopping journey": ["Perjalanan membeli-belah anda", "您的购物流程"],
    "Three clear decisions, with the useful details right where you need them.": ["Tiga keputusan yang jelas, dengan maklumat berguna tersedia apabila anda memerlukannya.", "三个清晰的步骤，在需要时就能看到实用信息。"],
    "Compare familiar names, sample size ranges in grams, and the price for each pack.": ["Bandingkan nama yang biasa dikenali, julat saiz contoh dalam gram dan harga setiap pek.", "比较熟悉的名称、以克为单位的示例重量范围及每包价格。"],
    "Choose an area and date, then see the example delivery charge and any example offer.": ["Pilih kawasan dan tarikh, kemudian lihat caj penghantaran serta tawaran contoh yang berkenaan.", "选择配送区域和日期，再查看示例配送费及适用的示例优惠。"],
    "Review your items and complete sample total before seeing the preview confirmation.": ["Semak produk dan jumlah contoh keseluruhan sebelum melihat pengesahan pratonton.", "查看商品和完整示例总额，再进入预览确认页面。"]
  };

  var pageMetadata = {
    en: ["Ikanza | Semporna Seafood for Peninsular Malaysia", "Discover Ikanza, a Semporna fisherman’s vision to share local fish and flavours with more Malaysian homes. Explore our seafood storefront before orders open."],
    my: ["Ikanza | Makanan Laut Semporna untuk Semenanjung Malaysia", "Kenali Ikanza, cetusan hasrat seorang nelayan Semporna untuk berkongsi ikan dan cita rasa tempatan dengan lebih banyak keluarga di Malaysia. Terokai kedai makanan laut kami sebelum pesanan dibuka."],
    cn: ["Ikanza | 面向马来西亚半岛的仙本那海鲜", "认识 Ikanza：一位仙本那渔民希望与更多马来西亚家庭分享当地鱼鲜与风味的心愿。开放下单前，欢迎浏览海鲜店铺预览。"]
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

    // Product metadata uses reusable pieces separated by middle dots.
    if (text.indexOf(" · ") >= 0) {
      var pieces = text.split(" · ");
      var translated = pieces.map(function (piece) { return translateValue(piece, lang); });
      if (translated.some(function (part, i) { return part !== pieces[i]; })) return lead + translated.join(" · ") + trail;
    }

    var m = text.match(/^Approx\. (.+) \/ kg$/);
    if (m) return lead + (lang === "my" ? "Anggaran " + m[1] + " / kg" : "约 " + m[1] + " / 公斤") + trail;
    m = text.match(/^From approx\. (.+) \/ kg$/);
    if (m) return lead + (lang === "my" ? "Daripada anggaran " + m[1] + " / kg" : "约 " + m[1] + " / 公斤起") + trail;
    m = text.match(/^Sample price for (.+) · approx\. (.+) \/ kg$/);
    if (m) return lead + (lang === "my" ? "Harga contoh untuk " + (literal(m[1], lang) || m[1]) + " · anggaran " + m[2] + " / kg" : (literal(m[1], lang) || m[1]) + "的参考价 · 约 " + m[2] + " / 公斤") + trail;
    m = text.match(/^Example price for (.+) · approx\. (.+) \/ kg at midpoint weight$/);
    if (m) return lead + (lang === "my" ? "Harga contoh untuk " + (literal(m[1], lang) || m[1]) + " · anggaran " + m[2] + " / kg pada berat pertengahan" : (literal(m[1], lang) || m[1]) + "的示例价格 · 按重量区间中值计算约 " + m[2] + " / 公斤") + trail;
    m = text.match(/^(\d+) preview listings?$/);
    if (m) return lead + (lang === "my" ? m[1] + " senarai contoh" : m[1] + " 件预览商品") + trail;
    m = text.match(/^(\d+) example items?$/);
    if (m) return lead + (lang === "my" ? m[1] + " produk contoh" : m[1] + " 件示例商品") + trail;
    m = text.match(/^(\d+) preview items?$/);
    if (m) return lead + (lang === "my" ? m[1] + " produk pratonton" : m[1] + " 件预览商品") + trail;
    m = text.match(/^(.+) away from example free delivery$/);
    if (m) return lead + (lang === "my" ? "Lagi " + m[1] + " untuk penghantaran percuma contoh" : "再消费 " + m[1] + " 即达示例免运费门槛") + trail;
    m = text.match(/^(.+) away from the extra 5% example discount$/);
    if (m) return lead + (lang === "my" ? "Lagi " + m[1] + " untuk diskaun tambahan 5% contoh" : "再消费 " + m[1] + " 即达额外 5% 示例折扣门槛") + trail;
    m = text.match(/^Based on item subtotal and (Klang Valley|other Peninsular area) example delivery\.$/);
    if (m) {
      var place = literal(m[1] === "other Peninsular area" ? "Other Peninsular area" : m[1], lang) || m[1];
      return lead + (lang === "my" ? "Berdasarkan jumlah kecil produk dan contoh penghantaran untuk " + place + "." : "根据商品小计和" + place + "的示例配送费计算。") + trail;
    }
    m = text.match(/^View bag, (\d+) items?$/);
    if (m) return lead + (lang === "my" ? "Lihat bakul, " + m[1] + " produk" : "查看购物袋，" + m[1] + " 件商品") + trail;
    m = text.match(/^Welcome, (.+)\.$/);
    if (m) return lead + (lang === "my" ? "Selamat kembali, " + m[1] + "." : "欢迎回来，" + m[1] + "。") + trail;
    m = text.match(/^Destination: (.+)$/);
    if (m) return lead + (lang === "my" ? "Destinasi: " : "配送地点：") + (literal(m[1], lang) || m[1]) + trail;
    m = text.match(/^Quantity (\d+)$/);
    if (m) return lead + (lang === "my" ? "Kuantiti " + m[1] : "数量 " + m[1]) + trail;
    m = text.match(/^(Remove|Add) one (.+) (Small pack|Medium pack|Large pack|Small|Medium|Large|500 g pack|1 kg pack)$/);
    if (m && productNames.indexOf(m[2]) >= 0) return lead + (lang === "my" ? (m[1] === "Remove" ? "Buang satu " : "Tambah satu ") + literal(m[2], lang) + " (" + literal(m[3], lang) + ")" : (m[1] === "Remove" ? "移除一份" : "添加一份") + literal(m[2], lang) + "（" + literal(m[3], lang) + "）") + trail;
    m = text.match(/^(Remove|Add) one (.+)$/);
    if (m) return lead + (lang === "my" ? (m[1] === "Remove" ? "Buang satu " : "Tambah satu ") + (literal(m[2], lang) || m[2]) : (m[1] === "Remove" ? "移除一件" : "添加一件") + (literal(m[2], lang) || m[2])) + trail;
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
    if (m) return lead + (lang === "my" ? "Penghantaran contoh: " : "示例配送费：") + m[1] + trail;
    m = text.match(/^(\d+) (Coral grouper|Sea bass|Red snapper) added to your preview bag\.$/);
    if (m) return lead + (lang === "my" ? m[1] + " " + literal(m[2], lang) + " dimasukkan ke bakul pratonton anda." : "已将 " + m[1] + " 件" + literal(m[2], lang) + "加入预览购物袋。") + trail;
    m = text.match(/^(\d+) (.+) \((Small pack|Medium pack|Large pack|Small|Medium|Large|500 g pack|1 kg pack)\) added to your preview bag\.$/);
    if (m && productNames.indexOf(m[2]) >= 0) return lead + (lang === "my" ? m[1] + " " + literal(m[2], lang) + " (" + literal(m[3], lang) + ") dimasukkan ke bakul pratonton anda." : "已将 " + m[1] + " 件" + literal(m[2], lang) + "（" + literal(m[3], lang) + "）加入预览购物袋。") + trail;
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
