class CreateInventoryItems < ActiveRecord::Migration[8.1]
  def change
    create_table :inventory_items do |t|
      t.string :item_name
      t.integer :current_stock
      t.integer :min_threshold
      t.integer :max_capacity
      t.string :unit
      t.decimal :unit_cost
      t.string :supplier
      t.datetime :last_restocked
      t.references :branch, null: false, foreign_key: true

      t.timestamps
    end
  end
end
