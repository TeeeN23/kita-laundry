class CreateAddresses < ActiveRecord::Migration[8.1]
  def change
    create_table :addresses do |t|
      t.references :user, null: false, foreign_key: true
      t.text :full_address, null: false
      t.float :latitude
      t.float :longitude

      t.timestamps
    end
  end
end
