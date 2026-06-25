class OrderItem < ApplicationRecord
  belongs_to :order
  belongs_to :service

  validates :weight_kg, presence: true, numericality: { greater_than: 0 }
end
