import { 
  CreditCard, 
  Truck, 
  Sparkles, 
  CheckCircle,
  Shirt,
  Award,
  Shield,
  Zap,
  Star,
  Package,
  RefreshCw,
  Headphones,
  Ticket,
  HelpCircle,
  Clock
} from 'lucide-react'

export const HOW_IT_WORKS_DATA = [
  {
    id: 1,
    title: 'Pesan Online',
    description: 'Ajukan permintaan laundry Anda hanya dalam beberapa klik.',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    icon: CreditCard
  },
  {
    id: 2,
    title: 'Penjemputan',
    description: 'Kami mengambil pakaian Anda langsung dari depan pintu.',
    image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    icon: Truck
  },
  {
    id: 3,
    title: 'Pencucian',
    description: 'Perawatan ahli dengan teknologi cuci canggih.',
    image: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    icon: Sparkles
  },
  {
    id: 4,
    title: 'Pengiriman',
    description: 'Pakaian bersih segar dikirim kembali tepat waktu.',
    image: '/images/del.jpg',
    icon: CheckCircle
  }
]

export const SERVICES_DATA = [
  {
    id: 1,
    title: 'Cuci & Lipat',
    description: 'Pakaian segar, bersih, dan rapi dilipat.\nSempurna untuk pakaian sehari-hari.',
    icon: Shirt
  },
  {
    id: 2,
    title: 'Cuci & Setrika',
    description: 'Pakaian bersih, rapi, bebas kerutan.\nSiap dipakai setiap hari.',
    icon: Sparkles
  },
  {
    id: 3,
    title: 'Laundry Premium',
    description: 'Perawatan lembut untuk kain khusus.\nPerhatian ekstra pada detail.',
    icon: Award
  },
  {
    id: 4,
    title: 'Dry Clean',
    description: 'Perawatan halus untuk pakaian formal.\nSetelan, blazer & lainnya.',
    icon: Shield
  },
  {
    id: 5,
    title: 'Setrika Uap',
    description: 'Hasil halus dan rapi dengan uap.\nLayanan setrika profesional.',
    icon: Zap
  },
  {
    id: 6,
    title: 'Pengkanjian',
    description: 'Kekakuan sempurna dan tahan lama.\nIdeal untuk katun & kain formal.',
    icon: Star
  },
  {
    id: 7,
    title: 'Setrika Uap Premium',
    description: 'Layanan setrika ekstra halus.\nKhusus untuk pakaian berkualitas tinggi.',
    icon: CheckCircle
  },
  {
    id: 8,
    title: 'Dry Clean Premium',
    description: 'Perawatan mewah untuk barang bermerek.\nAhli pakaian desainer.',
    icon: Truck
  }
]

export const TESTIMONIALS_DATA = [
  {
    id: 1,
    name: 'Divya K.',
    review: 'Saya menyerahkan kain sutra saya dan jujur saja khawatir. Tapi mereka menanganinya dengan sangat baik. Layanan yang mengesankan dan aman untuk kain halus!',
    rating: 5
  },
  {
    id: 2,
    name: 'Rajat T.',
    review: 'Prosesnya sangat lancar — pesan lewat aplikasi, langsung dapat konfirmasi, dan penjemputan tiba tepat waktu. Sangat cocok untuk orang sibuk seperti saya.',
    rating: 5
  },
  {
    id: 3,
    name: 'Tanvi M.',
    review: 'Harga terjangkau dan kualitas luar biasa. Pakaian disetrika sempurna dan baunya sangat segar. 10/10 untuk layanannya!',
    rating: 5
  },
  {
    id: 4,
    name: 'Karan V.',
    review: 'Ini kali ketiga saya menggunakan KitaLaundry dan saya tidak akan kembali ke cuci tangan atau toko dry cleaning. Sangat mudah dan bisa diandalkan!',
    rating: 5
  },
  {
    id: 5,
    name: 'Sneha R.',
    review: 'Suka dengan perhatian mereka terhadap detail. Bahkan noda membandel pun bisa dihilangkan sepenuhnya tanpa merusak kain. Sangat direkomendasikan!',
    rating: 5
  },
  {
    id: 6,
    name: 'Rahul P.',
    review: 'Layanan ekspres adalah penyelamat. Butuh setelan dry cleaning untuk rapat mendadak, dan mereka mengantarkannya dengan sempurna di hari yang sama.',
    rating: 5
  }
]

export const FAQ_CATEGORIES_DATA = {
  general: [
    {
      question: "Bagaimana cara kerja KitaLaundry?",
      answer: "KitaLaundry membuat laundry menjadi mudah! Cukup pesan secara online, jadwalkan waktu penjemputan, dan tim kami akan mengambil pakaian Anda dari depan pintu. Kami membersihkannya secara profesional dan mengembalikannya dalam keadaan segar dan terlipat dalam 24-48 jam."
    },
    {
      question: "Area mana saja yang Anda layani?",
      answer: "Saat ini kami melayani 5+ kota besar di Medan dan sekitarnya. Kami terus berkembang ke area baru. Periksa ketersediaan layanan kami dengan memasukkan kode pos Anda di halaman utama."
    },
    {
      question: "Berapa jam operasional Anda?",
      answer: "Layanan penjemputan dan pengiriman kami beroperasi dari pukul 08.00 hingga 21.00, 7 hari seminggu. Dukungan pelanggan tersedia 24/7 melalui telepon, email, dan WhatsApp."
    },
    {
      question: "Bagaimana cara melacak pesanan saya?",
      answer: "Setelah pesanan Anda dibuat, Anda akan menerima pembaruan SMS dan email di setiap tahap. Anda juga dapat melacak pesanan secara real-time melalui dasbor pelanggan atau dengan menghubungi tim dukungan kami."
    }
  ],
  orders: [
    {
      question: "Bagaimana cara membuat pesanan?",
      answer: "Anda dapat membuat pesanan melalui website atau aplikasi mobile kami. Cukup pilih jenis layanan, tambahkan item, pilih waktu penjemputan/pengiriman, dan konfirmasi. Prosesnya kurang dari 2 menit!"
    },
    {
      question: "Bisakah saya mengubah atau membatalkan pesanan?",
      answer: "Ya! Anda dapat mengubah atau membatalkan pesanan hingga 2 jam sebelum waktu penjemputan yang dijadwalkan. Buka 'Pesanan Saya' di dasbor dan pilih pesanan yang ingin diubah."
    },
    {
      question: "Berapa nilai pesanan minimum?",
      answer: "Tidak ada nilai pesanan minimum! Anda dapat memesan bahkan untuk satu item saja. Namun, pesanan di atas Rp200 memenuhi syarat untuk penjemputan dan pengiriman gratis."
    },
    {
      question: "Apakah Anda menawarkan layanan hari yang sama?",
      answer: "Ya! Layanan Ekspres kami menyediakan penjemputan dan pengiriman di hari yang sama untuk kebutuhan mendesak. Biaya ekspres tambahan Rp50 berlaku. Pesanan harus dibuat sebelum pukul 14.00 untuk pengiriman di hari yang sama."
    }
  ],
  payment: [
    {
      question: "Metode pembayaran apa yang Anda terima?",
      answer: "Kami menerima Bayar di Tempat (COD), pembayaran transfer, kartu kredit/debit (Visa, Mastercard), dan dompet digital."
    },
    {
      question: "Apakah pembayaran online aman?",
      answer: "Tentu! Kami menggunakan enkripsi SSL standar industri dan bermitra dengan gateway pembayaran terpercaya untuk memastikan informasi pembayaran Anda selalu aman."
    },
    {
      question: "Apakah Anda menawarkan diskon?",
      answer: "Ya! Kami menawarkan diskon pesanan massal: diskon 5% untuk pesanan di atas Rp500, 10% di atas Rp1000, dan 15% di atas Rp2000. Diskon diterapkan secara otomatis saat checkout."
    },
    {
      question: "Bisakah saya mendapatkan refund?",
      answer: "Jika Anda tidak puas dengan layanan kami, kami akan mengerjakan ulang pesanan Anda secara gratis. Jika masih belum puas, kami memberikan pengembalian dana penuh dalam 7 hari kerja. Hubungi tim dukungan kami untuk memulai proses refund."
    }
  ],
  services: [
    {
      question: "Layanan apa saja yang Anda tawarkan?",
      answer: "Kami menawarkan Cuci & Lipat, Dry Cleaning, Setrika, Setrika Uap, Pengkanjian, dan layanan Premium untuk kain halus. Setiap layanan ditangani oleh profesional terlatih menggunakan produk berkualitas."
    },
    {
      question: "Bagaimana Anda menangani kain yang rapuh?",
      answer: "Layanan dry cleaning kami mengkhususkan diri pada kain halus seperti sutra, wol, kasmir, dan pakaian berdesainer. Kami menggunakan pelarut ramah lingkungan dan memiliki profesional terlatih yang memahami persyaratan perawatan kain."
    },
    {
      question: "Apakah Anda menyediakan layanan penghilangan noda?",
      answer: "Ya! Penghilangan noda termasuk dalam layanan dry cleaning kami. Untuk noda membandel, para ahli kami menggunakan perawatan khusus. Harap informasikan tentang noda tertentu saat memesan."
    },
    {
      question: "Bagaimana jika pakaian saya rusak?",
      answer: "Meski jarang terjadi, jika ada barang yang rusak selama proses kami, kami memberikan kompensasi penuh berdasarkan nilai barang yang dinyatakan. Kami juga memiliki asuransi komprehensif untuk semua pesanan."
    }
  ]
}

export const QUICK_HELP_CARDS_DATA = [
  {
    icon: Package,
    title: "Lacak Pesanan",
    description: "Cek status laundry Anda secara real-time",
    link: "/customer/orders",
    color: "bg-blue-500"
  },
  {
    icon: Ticket,
    title: "Buat Tiket",
    description: "Laporkan masalah atau dapatkan bantuan",
    link: "/customer/support/new",
    color: "bg-purple-500"
  },
  {
    icon: RefreshCw,
    title: "Minta Refund",
    description: "Ajukan pengembalian dana untuk pesanan",
    link: "/customer/support/new?category=payment",
    color: "bg-orange-500"
  },
  {
    icon: Headphones,
    title: "Dukungan Langsung",
    description: "Chat dengan tim dukungan kami",
    link: "/customer/support",
    color: "bg-teal-500"
  }
]

export const CATEGORY_TABS_DATA = [
  { id: 'general', label: 'Umum', icon: HelpCircle },
  { id: 'orders', label: 'Pesanan', icon: Package },
  { id: 'payment', label: 'Pembayaran', icon: CreditCard },
  { id: 'services', label: 'Layanan', icon: Sparkles }
]

export const SERVICES_PAGE_DATA = [
  { id: 'wash-fold', name: 'Cuci & Lipat', icon: Shirt, description: 'Layanan cuci dan lipat standar untuk pakaian sehari-hari', price: 'Mulai Rp25/item', features: ['Penjemputan hari yang sama', 'Deterjen ramah lingkungan', 'Dilipat rapi'] },
  { id: 'dry-cleaning', name: 'Dry Cleaning', icon: Sparkles, description: 'Dry cleaning profesional untuk pakaian halus dan formal', price: 'Mulai Rp60/item', features: ['Perawatan ahli', 'Penghilangan noda', 'Hasil premium'] },
  { id: 'laundry', name: 'Layanan Laundry', icon: Package, description: 'Layanan laundry lengkap dengan cuci, kering, dan setrika', price: 'Mulai Rp30/item', features: ['Layanan penuh', 'Cepat selesai', 'Kualitas terjamin'] },
  { id: 'shoe-cleaning', name: 'Cuci Sepatu', icon: Award, description: 'Layanan perawatan dan pembersihan sepatu profesional', price: 'Mulai Rp80/pasang', features: ['Pembersihan mendalam', 'Semir & kilap', 'Penghilangan bau'] },
  { id: 'express', name: 'Layanan Ekspres', icon: Clock, description: 'Pengiriman di hari yang sama untuk kebutuhan laundry mendesak', price: 'Mulai Rp45/item', features: ['Pengiriman 4-6 jam', 'Prioritas penanganan', 'Perawatan premium'] }
]

export const HOW_WE_WORK_STEPS = [
  { id: 1, title: 'Jadwalkan Penjemputan', subtitle: 'Pesan dalam hitungan detik', description: 'Gunakan aplikasi atau website kami untuk menjadwalkan penjemputan di waktu yang nyaman.', features: ['Pemesanan online mudah', 'Slot waktu fleksibel', 'Konfirmasi instan', 'Pelacakan real-time', 'Ubah jadwal sekali klik'], image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: 2, title: 'Kami Menjemput', subtitle: 'Penjemputan di depan pintu', description: 'Mitra pengiriman terlatih kami tiba di depan pintu Anda untuk mengambil laundry.', features: ['Penjemputan gratis di depan pintu', 'Profesional terverifikasi', 'Penanganan hati-hati', 'Tanda terima per item', 'Catatan perawatan khusus'], image: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: 3, title: 'Pembersihan Ahli', subtitle: 'Perawatan premium', description: 'Pakaian Anda dibersihkan dengan deterjen ramah lingkungan premium oleh para ahli terlatih.', features: ['Deterjen ramah lingkungan', 'Mesin canggih', 'Perawatan noda', 'Inspeksi kualitas', 'Perawatan kain halus'], image: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: 4, title: 'Pengiriman', subtitle: 'Segar & dilipat rapi', description: 'Pakaian bersih segar Anda dikirim kembali ke depan pintu tepat waktu.', features: ['Pengiriman tepat waktu', 'Dikemas rapi', 'Pemeriksaan kualitas', 'Opsi tanpa kontak', 'Kepuasan 100%'], image: '/images/del.jpg' }
]

export const SERVICES_FAQ_DATA = [
  { question: "Jenis pakaian apa yang Anda cuci?", answer: "Kami mencuci semua jenis pakaian termasuk pakaian sehari-hari, pakaian formal, kain halus, wol, sutra, setelan, gorden, sprei, dan lainnya." },
  { question: "Bagaimana Anda menangani kain yang rapuh?", answer: "Kain halus seperti sutra, wol, dan kasmir mendapat perhatian khusus dengan deterjen lembut yang sesuai jenis kain dan metode pencucian yang tepat." },
  { question: "Apa perbedaan antara Cuci & Lipat dan Dry Cleaning?", answer: "Cuci & Lipat adalah pencucian berbasis air untuk pakaian sehari-hari. Dry Cleaning menggunakan pelarut khusus untuk kain halus dan pakaian formal." },
  { question: "Bisakah Anda menghilangkan noda membandel?", answer: "Ya! Teknisi ahli kami mengkhususkan diri dalam penghilangan noda termasuk minyak, tinta, anggur, kopi, dan noda makanan." },
  { question: "Berapa lama waktu yang dibutuhkan untuk layanan?", answer: "Layanan standar membutuhkan 24-48 jam. Layanan ekspres tersedia untuk pengiriman di hari yang sama atau hari berikutnya." },
  { question: "Apakah Anda menyediakan kemasan untuk pakaian yang dikirim?", answer: "Ya, semua pakaian yang sudah dicuci dikemas dengan hati-hati. Pakaian formal dikirim dengan gantungan dan penutup pelindung." }
]

export const PRICING_FAQ_DATA = [
  {
    question: "Apakah ada biaya untuk penjemputan dan pengiriman?",
    answer: "Tidak, penjemputan dan pengiriman sepenuhnya gratis untuk semua pesanan di atas Rp200. Untuk pesanan di bawah Rp200, dikenakan biaya nominal Rp30."
  },
  {
    question: "Metode pembayaran apa yang Anda terima?",
    answer: "Kami menerima Bayar di Tempat (COD), pembayaran transfer, kartu kredit/debit, dan dompet digital."
  },
  {
    question: "Apakah ada nilai pesanan minimum?",
    answer: "Tidak ada nilai pesanan minimum! Pesanan di atas Rp200 memenuhi syarat untuk penjemputan dan pengiriman gratis."
  },
  {
    question: "Apakah Anda menawarkan diskon untuk pelanggan tetap?",
    answer: "Ya, kami memiliki paket keanggotaan dan menawarkan diskon pesanan massal hingga 15%."
  }
]
export const MOCK_ORDERS = [
  { _id: '1', orderNumber: 'ORD-1001', status: 'in_process', items: [{ itemType: 'Shirt', quantity: 5, unitPrice: 15000, totalPrice: 75000 }], totalAmount: 85000, isExpress: true, createdAt: new Date().toISOString(), statusHistory: [{ status: 'placed', date: new Date().toISOString(), updatedAt: new Date().toISOString() }, { status: 'in_process', date: new Date().toISOString(), updatedAt: new Date().toISOString() }], pricing: { subtotal: 80000, tax: 5000, deliveryCharge: 0, expressCharge: 0, discount: 0, total: 85000 }, paymentMethod: 'cod', paymentStatus: 'pending', pickupDate: new Date().toISOString(), pickupTimeSlot: '09:00-11:00' },
  { _id: '2', orderNumber: 'ORD-1002', status: 'ready', items: [{ itemType: 'Pants', quantity: 3, unitPrice: 15000, totalPrice: 45000 }], totalAmount: 45000, isExpress: false, createdAt: new Date(Date.now() - 86400000).toISOString(), statusHistory: [{ status: 'placed', date: new Date().toISOString(), updatedAt: new Date().toISOString() }, { status: 'ready', date: new Date().toISOString(), updatedAt: new Date().toISOString() }], pricing: { subtotal: 40000, tax: 5000, deliveryCharge: 0, expressCharge: 0, discount: 0, total: 45000 }, paymentMethod: 'online', paymentStatus: 'paid', pickupDate: new Date().toISOString(), pickupTimeSlot: '11:00-13:00' },
  { _id: '3', orderNumber: 'ORD-1003', status: 'delivered', items: [{ itemType: 'Jacket', quantity: 1, unitPrice: 30000, totalPrice: 30000 }], totalAmount: 35000, isExpress: false, createdAt: new Date(Date.now() - 172800000).toISOString(), statusHistory: [{ status: 'placed', date: new Date().toISOString(), updatedAt: new Date().toISOString() }, { status: 'delivered', date: new Date().toISOString(), updatedAt: new Date().toISOString() }], pricing: { subtotal: 30000, tax: 5000, deliveryCharge: 0, expressCharge: 0, discount: 0, total: 35000 }, paymentMethod: 'online', paymentStatus: 'paid', pickupDate: new Date().toISOString(), pickupTimeSlot: '13:00-15:00' },
  { _id: '4', orderNumber: 'ORD-1004', status: 'placed', items: [{ itemType: 'Bed Sheet', quantity: 2, unitPrice: 25000, totalPrice: 50000 }], totalAmount: 60000, isExpress: false, createdAt: new Date().toISOString(), statusHistory: [{ status: 'placed', date: new Date().toISOString(), updatedAt: new Date().toISOString() }], pricing: { subtotal: 55000, tax: 5000, deliveryCharge: 0, expressCharge: 0, discount: 0, total: 60000 }, paymentMethod: 'cod', paymentStatus: 'pending', pickupDate: new Date().toISOString(), pickupTimeSlot: '15:00-17:00' }
];

export const MOCK_ADDRESSES = [
  { _id: 'a1', tag: 'Home', street: 'Jl. Merdeka No. 10', city: 'Medan', state: 'Sumatera Utara', pincode: '20111', isDefault: true },
  { _id: 'a2', tag: 'Office', street: 'Komp. Ruko Setia Budi', city: 'Medan', state: 'Sumatera Utara', pincode: '20122', isDefault: false }
];

export const MOCK_ADMIN_DASHBOARD = {
  branch: { _id: 'br-medan-1', name: 'KitaLaundry Cabang Medan', code: 'MDN-01' },
  metrics: { todayOrders: 24, pendingOrders: 5, processingOrders: 12, readyOrders: 4, completedToday: 3, todayRevenue: 1540000, weeklyOrders: 150, staffCount: 8, activeStaff: 6 },
  recentOrders: [
    { _id: '1', orderNumber: 'ORD-1001', status: 'in_process', amount: 85000, itemCount: 5, isExpress: true, createdAt: new Date().toISOString(), customer: { name: 'Budi Santoso', phone: '08123456789' } }
  ],
  staffPerformance: [{ name: 'Ahmad', role: 'Washer', ordersProcessed: 15 }],
  alerts: [{ type: 'warning', title: 'Low Detergent Stock', message: 'Premium Liquid Detergent is running low.' }]
};

export const MOCK_STAFF = [
  { _id: 'w1', name: 'Ahmad Ridwan', email: 'ahmad@demo.com', phone: '08111222333', workerType: { name: 'Washer', role: 'washer' }, isActive: true, currentLoad: 3, maxLoad: 10, completedOrders: 15 },
  { _id: 'w2', name: 'Siti Aminah', email: 'siti@demo.com', phone: '08222333444', workerType: { name: 'Ironer', role: 'ironer' }, isActive: true, currentLoad: 5, maxLoad: 15, completedOrders: 22 },
  { _id: 'w3', name: 'Bambang Supriadi', email: 'bambang@demo.com', phone: '08333444555', workerType: { name: 'Driver', role: 'driver' }, isActive: false, currentLoad: 0, maxLoad: 8, completedOrders: 40 }
];

export const MOCK_WORKER_TYPES = [
  { _id: 't1', name: 'Washer', role: 'washer' }, 
  { _id: 't2', name: 'Ironer', role: 'ironer' }, 
  { _id: 't3', name: 'Driver', role: 'driver' }
];

export const MOCK_INVENTORY = [
  { _id: 'inv1', itemName: 'Premium Liquid Detergent', currentStock: 45, unit: 'Liters', minThreshold: 10, unitCost: 15000, lastRestocked: new Date().toISOString() },
  { _id: 'inv2', itemName: 'Fabric Softener (Floral)', currentStock: 8, unit: 'Liters', minThreshold: 15, unitCost: 12000, lastRestocked: new Date(Date.now() - 86400000 * 10).toISOString() },
  { _id: 'inv3', itemName: 'Stain Remover', currentStock: 20, unit: 'Bottles', minThreshold: 5, unitCost: 35000, lastRestocked: new Date(Date.now() - 86400000 * 5).toISOString() }
];

export const MOCK_ADMIN_SERVICES = [
  { _id: 'srv1', name: 'wash_fold', displayName: 'Wash & Fold', description: 'Standard washing and folding', category: 'regular_wash', source: 'admin', isActive: true, turnaroundTime: { standard: 48, express: 24 } },
  { _id: 'srv2', name: 'dry_cleaning', displayName: 'Dry Cleaning', description: 'Premium dry cleaning service', category: 'dry_cleaning', source: 'admin', isActive: true, turnaroundTime: { standard: 72, express: 48 } }
];

export const MOCK_SERVICE_ITEMS = [
  { _id: 'item1', name: 'T-Shirt', category: 'Tops', basePrice: 5000 },
  { _id: 'item2', name: 'Pants', category: 'Bottoms', basePrice: 7000 },
  { _id: 'item3', name: 'Bed Sheet', category: 'Household', basePrice: 25000 }
];

export const MOCK_SETTINGS = {
  branch: {
    name: 'KitaLaundry Cabang Medan',
    operatingHours: {
      monday: { isOpen: true, open: '08:00', close: '20:00' },
      tuesday: { isOpen: true, open: '08:00', close: '20:00' },
      wednesday: { isOpen: true, open: '08:00', close: '20:00' },
      thursday: { isOpen: true, open: '08:00', close: '20:00' },
      friday: { isOpen: true, open: '08:00', close: '20:00' },
      saturday: { isOpen: true, open: '09:00', close: '18:00' },
      sunday: { isOpen: false, open: '00:00', close: '00:00' }
    },
    settings: { maxDailyOrders: 100, autoAssignOrders: true, allowExpressDelivery: true }
  }
};


export const MOCK_ANALYTICS = {
  branch: { name: 'KitaLaundry Cabang Medan', code: 'MDN-01' },
  timeframe: '7d',
  totals: {
    totalOrders: 150,
    totalRevenue: 5250000,
    avgOrderValue: 35000
  },
  dailyStats: [
    { _id: { year: 2026, month: 5, day: 1 }, orders: 15, revenue: 500000 },
    { _id: { year: 2026, month: 5, day: 2 }, orders: 20, revenue: 700000 },
    { _id: { year: 2026, month: 5, day: 3 }, orders: 18, revenue: 650000 },
    { _id: { year: 2026, month: 5, day: 4 }, orders: 25, revenue: 900000 },
    { _id: { year: 2026, month: 5, day: 5 }, orders: 22, revenue: 800000 },
    { _id: { year: 2026, month: 5, day: 6 }, orders: 30, revenue: 1100000 },
    { _id: { year: 2026, month: 5, day: 7 }, orders: 20, revenue: 600000 }
  ],
  serviceStats: [
    { _id: 'Wash & Fold', count: 80, revenue: 2000000 },
    { _id: 'Dry Cleaning', count: 40, revenue: 2500000 },
    { _id: 'Ironing Only', count: 30, revenue: 750000 }
  ],
  statusDistribution: [
    { _id: 'delivered', count: 120 },
    { _id: 'in_process', count: 15 },
    { _id: 'ready', count: 10 },
    { _id: 'placed', count: 5 }
  ],
  staffPerformance: [
    { name: 'Ahmad Ridwan', ordersProcessed: 60, revenue: 2100000 },
    { name: 'Siti Aminah', ordersProcessed: 50, revenue: 1750000 },
    { name: 'Bambang Supriadi', ordersProcessed: 40, revenue: 1400000 }
  ]
};

