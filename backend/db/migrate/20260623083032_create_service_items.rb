class CreateServiceItems < ActiveRecord::Migration[8.1]
  def change
    create_table :service_items do |t|
      t.string :category
      t.string :name
      t.string :service_type
      t.integer :base_price

      t.timestamps
    end
  end
end
