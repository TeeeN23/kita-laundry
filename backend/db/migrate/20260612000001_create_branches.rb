class CreateBranches < ActiveRecord::Migration[8.1]
  def change
    create_table :branches do |t|
      t.string :name, null: false
      t.text :address
      t.string :phone
      t.integer :status, default: 0

      t.timestamps
    end
  end
end
