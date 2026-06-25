class CreateOrderItems < ActiveRecord::Migration[8.1]
  def change
    create_table :order_items do |t|
      t.references :order, null: false, foreign_key: true
      t.references :service, null: false, foreign_key: true
      t.decimal :weight_kg, precision: 8, scale: 2, null: false

      t.timestamps
    end
  end
end
