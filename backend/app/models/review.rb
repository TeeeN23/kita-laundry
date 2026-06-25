class Review < ApplicationRecord
  belongs_to :order
  belongs_to :user

  validates :rating, presence: true, inclusion: { in: 1..5 }
end
