class AddAssignedStaffIdToOrders < ActiveRecord::Migration[8.1]
  def change
    add_column :orders, :assigned_staff_id, :integer
  end
end
