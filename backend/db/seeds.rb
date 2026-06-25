# Bersihkan data lama dengan urutan yang benar karena ada foreign keys
puts "Menghapus data lama..."
OrderItem.destroy_all
Order.destroy_all
Service.destroy_all
Address.destroy_all
Branch.destroy_all
User.destroy_all

puts "Membuat Cabang..."
# 5 Cabang di Medan
branches = [
  Branch.create!(
    name: "KitaLaundry Medan Petisah",
    address: "Plaza Medan Fair, Kota Medan",
    phone: "08116000001",
    status: :active
  ),
  Branch.create!(
    name: "KitaLaundry Medan Polonia",
    address: "Sun Plaza, Kota Medan",
    phone: "08116000002",
    status: :active
  ),
  Branch.create!(
    name: "KitaLaundry Medan Timur",
    address: "Centre Point Mall, Kota Medan",
    phone: "08116000003",
    status: :active
  ),
  Branch.create!(
    name: "KitaLaundry Medan Sunggal",
    address: "Manhattan Times Square, Kota Medan",
    phone: "08116000004",
    status: :active
  ),
  Branch.create!(
    name: "KitaLaundry Medan Johor",
    address: "Jalan Karya Wisata, Medan Johor, Kota Medan",
    phone: "08116000005",
    status: :active
  )
]

puts "Membuat Layanan (Services)..."
# Layanan untuk setiap cabang
service_templates = [
  { name: "Cuci Komplit (Reguler)", price: 7000, desc: "Cuci dan setrika pakaian reguler, selesai dalam 2-3 hari" },
  { name: "Cuci Kering", price: 5000, desc: "Hanya cuci kering dan lipat rapi, tidak disetrika" },
  { name: "Setrika Saja", price: 4000, desc: "Hanya jasa setrika pakaian yang sudah bersih" },
  { name: "Cuci Sepatu Premium", price: 35000, desc: "Perawatan cuci sepatu dengan sabun khusus dan sikat lembut" },
  { name: "Cuci Bedcover", price: 25000, desc: "Cuci bedcover segala ukuran (Harga per potong/estimasi per kg)" },
  { name: "Cuci Jas/Blazer", price: 20000, desc: "Pencucian jas formal atau blazer dengan metode dry clean ringan" }
]

all_services = []
branches.each do |branch|
  service_templates.each do |st|
    all_services << Service.create!(
      branch: branch,
      name: st[:name],
      price_per_kg: st[:price],
      description: st[:desc]
    )
  end
end

puts "Membuat User (Admin, Managers, Customers)..."
# Admin Pusat
admin = User.create!(
  email: "admin@kitalaundry.com",
  password: "Password123!",
  role: :center_admin,
  first_name: "Admin",
  last_name: "Pusat",
  phone: "08111222333",
  email_verified_at: Time.current
)

# 5 Branch Managers
managers = []
branches.each_with_index do |branch, index|
  name_parts = branch.name.split(' ')
  managers << User.create!(
    email: "manager.#{name_parts.last.downcase}@kitalaundry.com",
    password: "Password123!",
    role: :branch_manager,
    first_name: "Manager",
    last_name: name_parts.last,
    phone: "0811600100#{index}",
    email_verified_at: Time.current
  )
end

# 10 Staff per branch (50 total)
staff_members = []
roles = [:washer, :ironer, :driver, :staff]

branches.each_with_index do |branch, branch_index|
  10.times do |i|
    role = roles[i % roles.length]
    staff_members << User.create!(
      email: "staff#{i+1}.branch#{branch_index+1}@kitalaundry.com",
      password: "Password123!",
      role: role,
      first_name: "Staff#{i+1}",
      last_name: branch.name.split(' ').last,
      phone: "08116002#{(branch_index * 10 + i).to_s.rjust(3, '0')}",
      email_verified_at: Time.current,
      branch: branch
    )
  end
end

# 20 Customers (4 per cabang)
customers = []
20.times do |i|
  customers << User.create!(
    email: "customer#{i+1}@gmail.com",
    password: "Password123!",
    role: :customer,
    first_name: "Pelanggan",
    last_name: "Ke-#{i+1}",
    phone: "08999888#{i.to_s.rjust(3, '0')}",
    email_verified_at: Time.current
  )
end

puts "Membuat Alamat Pelanggan..."
cities = ["Medan Petisah", "Medan Baru", "Medan Timur", "Medan Sunggal", "Medan Johor"]
customers.each_with_index do |customer, i|
  # Default Address (Home)
  Address.create!(
    user: customer,
    address_type: "home",
    address_line_1: "Jl. Perumahan Indah No. #{i+10}",
    address_line_2: "Blok A#{i}",
    city: cities[i % 5],
    state: "Sumatera Utara",
    pincode: "2011#{i % 5}",
    landmark: "Dekat Mesjid/Gereja",
    phone: customer.phone,
    is_default: true
  )

  # Secondary Address (Office)
  if i % 2 == 0
    Address.create!(
      user: customer,
      address_type: "office",
      address_line_1: "Gedung Perkantoran Maju Lt. #{i % 5 + 1}",
      city: "Medan Pusat",
      state: "Sumatera Utara",
      pincode: "20111",
      phone: customer.phone,
      is_default: false
    )
  end
end

puts "Membuat Order & Transaksi..."
payment_methods = ['cash', 'qris', 'bank_transfer', 'ewallet']
order_statuses = [0, 1, 2, 3, 4] # :pending, :processing, :ready_for_delivery, :completed, :cancelled
payment_statuses = [0, 1, 2] # :unpaid, :paid, :failed

# Membuat total 60 orderan (rata-rata 3 order per pelanggan)
customers.each_with_index do |customer, idx|
  # Pilih cabang yang lokasinya sesuai dengan kota pelanggan (index branch sama dengan index city mod 5)
  branch = branches[idx % 5]
  branch_services = branch.services.to_a
  address = customer.addresses.first

  3.times do |o_idx|
    status = order_statuses.sample
    # Jika sudah diproses, kemungkinan besar sudah dibayar
    payment_status = (status >= 1) ? 1 : payment_statuses.sample
    
    order = Order.create!(
      user: customer,
      branch: branch,
      pickup_address_id: address.id,
      delivery_address_id: address.id,
      status: status,
      payment_status: payment_status,
      payment_method: payment_methods.sample,
      notes: "Tolong lipat yang rapi ya.",
      created_at: rand(1..30).days.ago
    )

    # Tambahkan 1 atau 2 item layanan ke dalam order
    total_price = 0
    rand(1..2).times do
      service = branch_services.sample
      weight = rand(2.0..6.5).round(1)
      
      OrderItem.create!(
        order: order,
        service: service,
        weight_kg: weight
      )
      total_price += (service.price_per_kg * weight).to_i
    end

    # Update total price order
    order.update(total_price: total_price)
  end
end

puts "Membuat Daftar Harga Satuan (Service Items)..."
ServiceItem.destroy_all

# Kategori: men, women, kids, household, institutional, others
# Service: dry_clean, steam_press, starching, wash_fold, wash_iron, premium_laundry

items_data = [
  # --- PRIA (men) ---
  { cat: 'men', name: 'Kemeja Lengan Pendek', services: { wash_fold: 5000, wash_iron: 7000, dry_clean: 15000, steam_press: 4000 } },
  { cat: 'men', name: 'Kemeja Lengan Panjang', services: { wash_fold: 6000, wash_iron: 8000, dry_clean: 18000, steam_press: 5000 } },
  { cat: 'men', name: 'Celana Panjang', services: { wash_fold: 7000, wash_iron: 9000, dry_clean: 20000, steam_press: 5000 } },
  { cat: 'men', name: 'Celana Pendek', services: { wash_fold: 4000, wash_iron: 6000, dry_clean: 12000, steam_press: 3000 } },
  { cat: 'men', name: 'Jas / Blazer', services: { wash_fold: 0, wash_iron: 0, dry_clean: 35000, steam_press: 10000 } },
  { cat: 'men', name: 'Jaket', services: { wash_fold: 12000, wash_iron: 15000, dry_clean: 25000, steam_press: 8000 } },

  # --- WANITA (women) ---
  { cat: 'women', name: 'Blus', services: { wash_fold: 6000, wash_iron: 8000, dry_clean: 18000, steam_press: 5000 } },
  { cat: 'women', name: 'Rok', services: { wash_fold: 7000, wash_iron: 9000, dry_clean: 20000, steam_press: 5000 } },
  { cat: 'women', name: 'Gaun / Dress (Pendek)', services: { wash_fold: 10000, wash_iron: 15000, dry_clean: 30000, steam_press: 8000 } },
  { cat: 'women', name: 'Gaun / Dress (Panjang)', services: { wash_fold: 15000, wash_iron: 20000, dry_clean: 45000, steam_press: 12000 } },
  { cat: 'women', name: 'Kebaya', services: { wash_fold: 0, wash_iron: 0, dry_clean: 50000, steam_press: 15000 } },

  # --- ANAK-ANAK (kids) ---
  { cat: 'kids', name: 'Baju Anak', services: { wash_fold: 3000, wash_iron: 5000, dry_clean: 10000, steam_press: 2000 } },
  { cat: 'kids', name: 'Celana Anak', services: { wash_fold: 3000, wash_iron: 5000, dry_clean: 10000, steam_press: 2000 } },
  { cat: 'kids', name: 'Jaket Anak', services: { wash_fold: 6000, wash_iron: 8000, dry_clean: 15000, steam_press: 4000 } },
  { cat: 'kids', name: 'Seragam Sekolah', services: { wash_fold: 5000, wash_iron: 8000, dry_clean: 15000, steam_press: 4000 } },

  # --- RUMAH TANGGA (household) ---
  { cat: 'household', name: 'Sprei Single', services: { wash_fold: 10000, wash_iron: 15000, dry_clean: 25000, steam_press: 8000 } },
  { cat: 'household', name: 'Sprei Double/King', services: { wash_fold: 15000, wash_iron: 20000, dry_clean: 30000, steam_press: 10000 } },
  { cat: 'household', name: 'Bed Cover Single', services: { wash_fold: 20000, wash_iron: 0, dry_clean: 35000, steam_press: 0 } },
  { cat: 'household', name: 'Bed Cover Double', services: { wash_fold: 30000, wash_iron: 0, dry_clean: 50000, steam_press: 0 } },
  { cat: 'household', name: 'Selimut Tipis', services: { wash_fold: 12000, wash_iron: 0, dry_clean: 20000, steam_press: 0 } },
  { cat: 'household', name: 'Selimut Tebal', services: { wash_fold: 18000, wash_iron: 0, dry_clean: 30000, steam_press: 0 } },
  { cat: 'household', name: 'Handuk Mandi', services: { wash_fold: 8000, wash_iron: 10000, dry_clean: 0, steam_press: 0 } },
  { cat: 'household', name: 'Sarung Bantal/Guling', services: { wash_fold: 3000, wash_iron: 5000, dry_clean: 0, steam_press: 2000 } },

  # --- INSTITUSI (institutional) ---
  { cat: 'institutional', name: 'Seragam Karyawan', services: { wash_fold: 5000, wash_iron: 8000, dry_clean: 15000, steam_press: 4000 } },
  { cat: 'institutional', name: 'Taplak Meja (Kecil)', services: { wash_fold: 5000, wash_iron: 8000, dry_clean: 0, steam_press: 4000 } },
  { cat: 'institutional', name: 'Taplak Meja (Besar)', services: { wash_fold: 10000, wash_iron: 15000, dry_clean: 0, steam_press: 8000 } },

  # --- LAINNYA (others) ---
  { cat: 'others', name: 'Sepatu Kets/Sneakers', services: { wash_fold: 0, wash_iron: 0, dry_clean: 0, premium_laundry: 35000 } },
  { cat: 'others', name: 'Sepatu Kulit', services: { wash_fold: 0, wash_iron: 0, dry_clean: 0, premium_laundry: 50000 } },
  { cat: 'others', name: 'Tas Ransel', services: { wash_fold: 0, wash_iron: 0, dry_clean: 0, premium_laundry: 40000 } },
  { cat: 'others', name: 'Topi', services: { wash_fold: 5000, wash_iron: 0, dry_clean: 10000, premium_laundry: 15000 } },
  { cat: 'others', name: 'Boneka Kecil', services: { wash_fold: 10000, wash_iron: 0, dry_clean: 15000, premium_laundry: 0 } },
  { cat: 'others', name: 'Boneka Besar', services: { wash_fold: 25000, wash_iron: 0, dry_clean: 35000, premium_laundry: 0 } },
]

items_data.each do |item|
  item[:services].each do |service_type, price|
    next if price == 0 # Jangan buat data jika harga 0 (tidak tersedia)
    ServiceItem.create!(
      category: item[:cat],
      name: item[:name],
      service_type: service_type.to_s,
      base_price: price
    )
  end
end

puts "Membuat Time Slots..."
TimeSlot.destroy_all
[
  { start_time: "09:00", end_time: "11:00", is_active: true },
  { start_time: "11:00", end_time: "13:00", is_active: true },
  { start_time: "13:00", end_time: "15:00", is_active: true },
  { start_time: "15:00", end_time: "17:00", is_active: true }
].each do |slot|
  TimeSlot.create!(slot)
end

puts "✅ Seeding selesai dengan sempurna!"
puts "--------------------------------------------------"
puts "🔑 Gunakan kredensial berikut untuk login/testing:"
puts "--- ADMIN PUSAT ---"
puts "Email: admin@kitalaundry.com | Pass: Password123!"
puts "--- BRANCH MANAGERS ---"
managers.each do |m|
  puts "Email: #{m.email} | Pass: Password123! | (Cabang #{m.last_name})"
end
puts "--- CUSTOMERS ---"
puts "Email: customer1@gmail.com s/d customer15@gmail.com | Pass: Password123!"
puts "--------------------------------------------------"
