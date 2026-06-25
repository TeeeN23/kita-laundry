class Service < ApplicationRecord
  belongs_to :branch

  validates :name, :price_per_kg, presence: true
  validates :price_per_kg, numericality: { greater_than_or_equal_to: 0 }
end
