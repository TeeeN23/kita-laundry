class Address < ApplicationRecord
  belongs_to :user

  has_many :pickup_orders, class_name: 'Order', foreign_key: 'pickup_address_id', dependent: :restrict_with_error
  has_many :delivery_orders, class_name: 'Order', foreign_key: 'delivery_address_id', dependent: :restrict_with_error

  validates :address_line_1, :city, :pincode, presence: true
end
