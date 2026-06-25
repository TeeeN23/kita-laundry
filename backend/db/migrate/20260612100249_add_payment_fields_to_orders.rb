class AddPaymentFieldsToOrders < ActiveRecord::Migration[8.1]
  def change
    add_column :orders, :xendit_invoice_id, :string
    add_column :orders, :invoice_url, :string
    add_column :orders, :payment_method, :string
    add_column :orders, :payment_status, :integer
  end
end
