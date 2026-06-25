class AddBranchToUsers < ActiveRecord::Migration[8.1]
  def change
    add_reference :users, :branch, null: true, foreign_key: true
  end
end
