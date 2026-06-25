class CreateOrders < ActiveRecord::Migration[8.1]
  def change
    create_table :orders do |t|
      t.references :user, null: false, foreign_key: true
      t.references :branch, null: false, foreign_key: true
      t.references :pickup_address, foreign_key: { to_table: :addresses }
      t.references :delivery_address, foreign_key: { to_table: :addresses }
      t.integer :status, default: 0
      t.integer :total_price, default: 0
      t.text :notes

      t.timestamps
    end
  end
end
