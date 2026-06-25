class Address < ApplicationRecord
  belongs_to :user

  validates :street, :city, :postal_code, presence: true
end
