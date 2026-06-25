Order.where(status: [2, 3]).each do |o|
  staff = User.where(branch_id: o.branch_id, role: %w[staff washer ironer driver]).sample
  o.update_column(:assigned_staff_id, staff.id) if staff
  # Also update updated_at so that it counts as today
  o.update_column(:updated_at, Time.current)
end
puts "Assigned orders to staff"
