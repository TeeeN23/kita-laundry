class Service < ApplicationRecord
  belongs_to :branch
  has_many :order_items, dependent: :restrict_with_error

  validates :name, presence: true
  validates :price_per_kg, presence: true, numericality: { greater_than_or_equal_to: 0 }
end
