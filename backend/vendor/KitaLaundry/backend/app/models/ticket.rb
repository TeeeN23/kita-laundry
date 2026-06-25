class Ticket < ApplicationRecord
  belongs_to :user
  belongs_to :assigned_to, class_name: 'User', optional: true

  enum :status, { open: 0, in_progress: 1, resolved: 2 }, default: :open

  validates :subject, :description, presence: true
end
