class PaymentsController < ApplicationController
  before_action :authorize_request
  before_action :set_order

  def index
    render json: @order.payments
  end

  def create
    @payment = @order.payments.build(payment_params)
    
    # In a real app, this is where we integrate with Xendit API
    # to create an invoice or capture a payment
    
    if @payment.save
      render json: @payment, status: :created
    else
      render json: @payment.errors, status: :unprocessable_entity
    end
  end

  private

  def set_order
    @order = Order.find(params[:order_id])
    if current_user.customer? && @order.customer_id != current_user.id
      render json: { error: 'Forbidden' }, status: :forbidden
    end
  end

  def payment_params
    params.require(:payment).permit(:amount, :payment_method, :transaction_id, :status)
  end
end
