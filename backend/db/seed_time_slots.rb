TimeSlot.destroy_all
[
  { start_time: "09:00", end_time: "11:00", is_active: true },
  { start_time: "11:00", end_time: "13:00", is_active: true },
  { start_time: "13:00", end_time: "15:00", is_active: true },
  { start_time: "15:00", end_time: "17:00", is_active: true }
].each do |slot|
  TimeSlot.create!(slot)
end
puts "Time slots seeded successfully!"
