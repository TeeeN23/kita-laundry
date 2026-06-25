class OrderItem < ApplicationRecord
  belongs_to :order
  belongs_to :service

  validates :quantity, numericality: { only_integer: true, greater_than: 0 }, allow_nil: true
  validates :weight_kg, numericality: { greater_than: 0 }, allow_nil: true
  
  validate :must_have_quantity_or_weight

  private

  def must_have_quantity_or_weight
    if quantity.blank? && weight_kg.blank?
      errors.add(:base, "Must provide either quantity or weight")
    end
  end
end
