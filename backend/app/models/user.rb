class User < ApplicationRecord
  has_secure_password validations: false

  has_many :addresses, dependent: :destroy
  has_many :orders, dependent: :restrict_with_error
  has_many :notifications, dependent: :destroy
  has_many :assigned_orders, class_name: 'Order', foreign_key: 'assigned_staff_id'
  belongs_to :branch, optional: true

  enum :role, {
    customer: 0,
    admin: 1,
    branch_manager: 2,
    support_agent: 3,
    center_admin: 4,
    staff: 5,
    driver: 6,
    washer: 7,
    ironer: 8
  }, default: :customer

  validates :first_name, presence: { message: "tidak boleh kosong" }
  validates :email, presence: { message: "tidak boleh kosong" }, 
                    uniqueness: { message: "sudah terdaftar" },
                    format: { with: URI::MailTo::EMAIL_REGEXP, message: "format tidak valid" }
  validates :password, presence: { message: "tidak boleh kosong" },
                       length: { minimum: 8, message: "minimal 8 karakter" },
                       format: { 
                         with: /\A(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}\z/, 
                         message: "harus mengandung huruf besar, huruf kecil, angka, dan karakter khusus" 
                       },
                       if: -> { (new_record? || !password.nil?) && provider.blank? }

  before_create :generate_verification_token, unless: -> { provider.present? }

  def generate_verification_token
    self.verification_token = SecureRandom.urlsafe_base64.to_s
  end
end
