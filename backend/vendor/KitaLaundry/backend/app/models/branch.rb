class Branch < ApplicationRecord
  has_many :services, dependent: :destroy
  has_many :orders, dependent: :destroy
  
  enum :status, { inactive: 0, active: 1 }, default: :active
  
  validates :name, presence: true
end
