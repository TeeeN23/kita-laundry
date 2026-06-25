class CreateNotifications < ActiveRecord::Migration[8.1]
  def change
    create_table :notifications do |t|
      t.references :user, null: false, foreign_key: true
      t.string :title
      t.text :message
      t.boolean :is_read, default: false
      t.string :notification_type
      t.string :reference_id

      t.timestamps
    end
  end
end
