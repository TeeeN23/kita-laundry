class AddFieldsToAddresses < ActiveRecord::Migration[8.1]
  def change
    add_column :addresses, :address_type, :string
    add_column :addresses, :address_line_1, :string
    add_column :addresses, :address_line_2, :string
    add_column :addresses, :city, :string
    add_column :addresses, :state, :string
    add_column :addresses, :pincode, :string
    add_column :addresses, :landmark, :string
    add_column :addresses, :is_default, :boolean
    add_column :addresses, :phone, :string
    
    change_column_null :addresses, :full_address, true
  end
end
