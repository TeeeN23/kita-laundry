puts "Seeding Staff and Inventory..."

# 1. Seed 10 Staff per branch
branches = Branch.all
staff_names = [
  "Budi Santoso", "Siti Aminah", "Ahmad Fauzi", "Dewi Lestari", "Rudi Hermawan",
  "Rina Wati", "Andi Saputra", "Maya Sari", "Hendra Gunawan", "Nina Marlina"
]

branches.each do |branch|
  puts "Seeding staff for branch: #{branch.name}"
  10.times do |i|
    name = "#{staff_names[i]} #{branch.id}"
    email = "staff#{i}_branch#{branch.id}@kitalaundry.com"
    u = User.find_or_initialize_by(email: email)
    u.first_name = name
    u.last_name = ""
    u.phone = "0812345#{branch.id}#{i.to_s.rjust(3, '0')}"
    u.password = "Password@123"
    u.password_confirmation = "Password@123"
    u.role = 'staff'
    u.branch_id = branch.id
    u.save!
  end
end

# 2. Seed 10 Inventory for center admin (Branch.first)
center_branch = Branch.first
if center_branch
  puts "Seeding inventory for center admin (Branch ID: #{center_branch.id})"
  inventory_items = [
    { name: "Deterjen Cair Premium", stock: 150, min: 20, max: 200, unit: "liters", cost: 15000, supplier: "PT Bersih Maju" },
    { name: "Pewangi Pakaian (Floral)", stock: 80, min: 15, max: 100, unit: "liters", cost: 25000, supplier: "CV Harum Segar" },
    { name: "Pemutih Pakaian", stock: 30, min: 10, max: 50, unit: "liters", cost: 12000, supplier: "PT Bersih Maju" },
    { name: "Plastik Packing (Besar)", stock: 500, min: 100, max: 1000, unit: "pieces", cost: 500, supplier: "Toko Plastik Jaya" },
    { name: "Plastik Packing (Kecil)", stock: 800, min: 200, max: 1500, unit: "pieces", cost: 300, supplier: "Toko Plastik Jaya" },
    { name: "Hanger Kawat", stock: 1200, min: 300, max: 2000, unit: "pieces", cost: 1500, supplier: "Grosir Hanger Indo" },
    { name: "Tag Laundry", stock: 2000, min: 500, max: 5000, unit: "pieces", cost: 100, supplier: "Percetakan Cepat" },
    { name: "Sabun Cuci Sepatu", stock: 15, min: 5, max: 30, unit: "liters", cost: 45000, supplier: "ShoeCare Pro" },
    { name: "Sikat Bulu Halus", stock: 8, min: 5, max: 20, unit: "pieces", cost: 25000, supplier: "ShoeCare Pro" },
    { name: "Cairan Anti Noda Berat", stock: 12, min: 5, max: 25, unit: "liters", cost: 55000, supplier: "PT Bersih Maju" }
  ]

  inventory_items.each do |item|
    inv = InventoryItem.find_or_initialize_by(item_name: item[:name], branch_id: center_branch.id)
    inv.current_stock = item[:stock]
    inv.min_threshold = item[:min]
    inv.max_capacity = item[:max]
    inv.unit = item[:unit]
    inv.unit_cost = item[:cost]
    inv.supplier = item[:supplier]
    inv.save!
  end
end

puts "Done seeding!"
