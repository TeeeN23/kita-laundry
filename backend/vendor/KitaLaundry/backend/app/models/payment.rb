class Payment < ApplicationRecord
  belongs_to :order

  enum :status, { pending: 0, completed: 1, failed: 2, refunded: 3 }, default: :pending

  validates :amount, presence: true, numericality: { greater_than: 0 }
  validates :payment_method, presence: true
end
