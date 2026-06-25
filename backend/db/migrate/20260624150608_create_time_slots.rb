class CreateTimeSlots < ActiveRecord::Migration[8.1]
  def change
    create_table :time_slots do |t|
      t.string :start_time
      t.string :end_time
      t.boolean :is_active

      t.timestamps
    end
  end
end
