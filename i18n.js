(function () {
  "use strict";

  var STORAGE_KEY = "ikanza-demo-language";
  var sourceText = new WeakMap();
  var sourceAttributes = new WeakMap();
  var watchedRoots = new WeakMap();
  var selectedLanguage = "en";
  var languages = { en: "en", my: "ms-MY", cn: "zh-Hans" };

  // Keys are the English copy in app.js and the static story page. Keep those sources unchanged; each render
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
    "Sea bass": ["Siakap", "海鲈鱼"],
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
    "For years, the fish moved through buyers before reaching households. Along that path, prices could rise and the customer experience could drift away from the care taken at the source. Ikanza is being built to bring those ends closer together.": ["Selama bertahun-tahun, ikan melalui beberapa pembeli sebelum sampai kepada keluarga. Sepanjang laluan itu, harga boleh meningkat dan pengalaman pelanggan boleh semakin jauh daripada ketelitian di tempat asal. Ikanza dibina untuk merapatkan kedua-dua hujung ini.", "多年来，鱼要经过层层买家才能到达家庭。途中价格可能上涨，顾客的体验也可能与源头的用心渐行渐远。Ikanza 希望拉近这两端的距离。"],
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
    "Preview profile created in this browser.": ["Profil pratonton dicipta dalam pelayar ini.", "预览资料已在此浏览器中创建。"]
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
    m = text.match(/^Sample price for (.+) · approx\. (.+) \/ kg$/);
    if (m) return lead + (lang === "my" ? "Harga contoh untuk " + (literal(m[1], lang) || m[1]) + " · anggaran " + m[2] + " / kg" : (literal(m[1], lang) || m[1]) + "的参考价 · 约 " + m[2] + " / 公斤") + trail;
    m = text.match(/^(\d+) preview listings?$/);
    if (m) return lead + (lang === "my" ? m[1] + " senarai contoh" : m[1] + " 件预览商品") + trail;
    m = text.match(/^(\d+) preview items?$/);
    if (m) return lead + (lang === "my" ? m[1] + " produk pratonton" : m[1] + " 件预览商品") + trail;
    m = text.match(/^View bag, (\d+) items?$/);
    if (m) return lead + (lang === "my" ? "Lihat bakul, " + m[1] + " produk" : "查看购物袋，" + m[1] + " 件商品") + trail;
    m = text.match(/^Welcome, (.+)\.$/);
    if (m) return lead + (lang === "my" ? "Selamat kembali, " + m[1] + "." : "欢迎回来，" + m[1] + "。") + trail;
    m = text.match(/^Destination: (.+)$/);
    if (m) return lead + (lang === "my" ? "Destinasi: " : "配送地点：") + (literal(m[1], lang) || m[1]) + trail;
    m = text.match(/^Quantity (\d+)$/);
    if (m) return lead + (lang === "my" ? "Kuantiti " + m[1] : "数量 " + m[1]) + trail;
    m = text.match(/^(Remove|Add) one (.+)$/);
    if (m) return lead + (lang === "my" ? (m[1] === "Remove" ? "Buang satu " : "Tambah satu ") + (literal(m[2], lang) || m[2]) : (m[1] === "Remove" ? "移除一件" : "添加一件") + (literal(m[2], lang) || m[2])) + trail;
    m = text.match(/^View (Coral grouper|Sea bass|Red snapper)$/);
    if (m) return lead + (lang === "my" ? "Lihat " : "查看") + literal(m[1], lang) + trail;
    m = text.match(/^Illustrative image of whole (coral grouper|sea bass|red snapper)$/i);
    if (m) return lead + (lang === "my" ? "Imej ilustrasi ikan seekor " + (literal(titleCaseFish(m[1]), lang) || m[1]) : "整条" + (literal(titleCaseFish(m[1]), lang) || m[1]) + "的示意图片") + trail;
    m = text.match(/^Illustrative (coral grouper|sea bass|red snapper)$/i);
    if (m) return lead + (lang === "my" ? "Ilustrasi " + (literal(titleCaseFish(m[1]), lang) || m[1]) : (literal(titleCaseFish(m[1]), lang) || m[1]) + "示意图片") + trail;
    m = text.match(/^Illustrative delivery: (RM[\d,.]+)$/);
    if (m) return lead + (lang === "my" ? "Penghantaran contoh: " : "示例配送费：") + m[1] + trail;
    m = text.match(/^(\d+) (Coral grouper|Sea bass|Red snapper) added to your preview bag\.$/);
    if (m) return lead + (lang === "my" ? m[1] + " " + literal(m[2], lang) + " dimasukkan ke bakul pratonton anda." : "已将 " + m[1] + " 件" + literal(m[2], lang) + "加入预览购物袋。") + trail;
    m = text.match(/^(Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday), (\d{1,2}) (January|February|March|April|May|June|July|August|September|October|November|December) (\d{4})( \(example\))?$/);
    if (m) return lead + (lang === "my" ? days[m[1]][0] + ", " + m[2] + " " + months[m[3]][0] + " " + m[4] + (m[5] ? " (contoh)" : "") : m[4] + "年" + months[m[3]][1] + "月" + m[2] + "日（" + days[m[1]][1] + (m[5] ? "，示例" : "") + "）") + trail;
    return value;
  }
  function titleCaseFish(fish) { return fish.charAt(0).toUpperCase() + fish.slice(1).toLowerCase(); }

  function translate(root, lang) {
    if (!root) return;
    lang = normalize(lang || current());
    document.documentElement.lang = languages[lang];
    // The static story page has its own SEO title and description.
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
