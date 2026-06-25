class Order < ApplicationRecord
  belongs_to :user
  belongs_to :branch
  belongs_to :pickup_address, class_name: 'Address', optional: true
  belongs_to :delivery_address, class_name: 'Address', optional: true
  belongs_to :assigned_staff, class_name: 'User', optional: true

  has_many :order_items, dependent: :destroy
  accepts_nested_attributes_for :order_items
  has_one :review, dependent: :destroy

  enum :status, { pending: 0, processing: 1, ready: 2, completed: 3, cancelled: 4, picked: 5, driver_assigned: 6 }
  enum :payment_status, { unpaid: 0, paid: 1, failed: 2, expired: 3 }

  validates :total_price, numericality: { greater_than_or_equal_to: 0 }

  after_create_commit :notify_order_created
  after_update_commit :notify_payment_success, if: :saved_change_to_payment_status?
  after_update_commit :notify_order_ready, if: :saved_change_to_status?

  private

  def notify_order_created
    return unless user&.phone.present?
    
    # Memanggil template "order_created"
    WhatsappNotificationJob.perform_later(user.phone, 'order_created')
  end

  def notify_payment_success
    return unless user&.phone.present? && payment_status == 'paid'
    
    # Memanggil template "payment_confirmed"
    WhatsappNotificationJob.perform_later(user.phone, 'payment_confirmed')
  end

  def notify_order_ready
    return unless user&.phone.present? && status == 'ready'
    
    # Memanggil template "order_ready"
    WhatsappNotificationJob.perform_later(user.phone, 'order_ready')
  end
end
