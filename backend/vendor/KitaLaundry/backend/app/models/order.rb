class Order < ApplicationRecord
  belongs_to :customer, class_name: 'User', foreign_key: 'customer_id'
  belongs_to :branch
  belongs_to :pickup_address, class_name: 'Address', optional: true
  belongs_to :delivery_address, class_name: 'Address', optional: true
  
  has_many :order_items, dependent: :destroy
  has_many :payments, dependent: :destroy
  
  accepts_nested_attributes_for :order_items
  
  enum :status, { 
    pending: 0, 
    picked_up: 1, 
    processing: 2, 
    ready: 3, 
    delivered: 4, 
    cancelled: 5 
  }, default: :pending

  validates :total_amount, numericality: { greater_than_or_equal_to: 0 }

  after_update_commit :broadcast_status_update

  private

  def broadcast_status_update
    if saved_change_to_status?
      payload = { id: id, status: status, updated_at: updated_at }
      ActionCable.server.broadcast("orders_user_#{customer_id}", payload)
      ActionCable.server.broadcast("orders_admin_#{branch_id}", payload)
      ActionCable.server.broadcast("orders_admin_all", payload)
    end
  end
end
