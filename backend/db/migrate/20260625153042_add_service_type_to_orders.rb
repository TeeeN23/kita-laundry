class AddServiceTypeToOrders < ActiveRecord::Migration[8.1]
  def change
    add_column :orders, :service_type, :string
  end
end
