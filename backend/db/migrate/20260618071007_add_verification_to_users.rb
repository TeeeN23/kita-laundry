class AddVerificationToUsers < ActiveRecord::Migration[8.1]
  def change
    add_column :users, :verification_token, :string
    add_column :users, :email_verified_at, :datetime
  end
end
