class User < ApplicationRecord
  has_secure_password
  has_many :addresses, dependent: :destroy
  has_many :orders, foreign_key: 'customer_id', dependent: :destroy

  enum :role, {
    customer: 0,
    admin: 1,
    branch_manager: 2,
    support_agent: 3,
    center_admin: 4
  }, default: :customer

  validates :email, presence: true, uniqueness: true
end
