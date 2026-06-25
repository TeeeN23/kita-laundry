class Branch < ApplicationRecord
  has_many :services, dependent: :destroy
  has_many :orders, dependent: :restrict_with_error

  enum :status, { inactive: 0, active: 1 }

  validates :name, presence: true
  validates :address, presence: true
end
