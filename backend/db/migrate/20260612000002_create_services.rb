class CreateServices < ActiveRecord::Migration[8.1]
  def change
    create_table :services do |t|
      t.references :branch, null: false, foreign_key: true
      t.string :name, null: false
      t.integer :price_per_kg, null: false
      t.text :description

      t.timestamps
    end
  end
end
