class AddDetailsToOrderItems < ActiveRecord::Migration[8.1]
  def change
    add_column :order_items, :item_name, :string
    add_column :order_items, :unit_price, :integer
  end
end
