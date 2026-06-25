class OrdersController < ApplicationController
  before_action :authorize_request
  before_action :set_order, only: [:show, :update, :destroy]

  def index
    if current_user.admin? || current_user.center_admin?
      @orders = Order.all
    elsif current_user.branch_manager?
      # Assuming branch_manager has a branch_id somehow, or we can check via parameters for now.
      # For simplicity, if branch_id is passed, filter by it.
      if params[:branch_id].present?
        @orders = Order.where(branch_id: params[:branch_id])
      else
        @orders = Order.all
      end
    else
      @orders = current_user.orders
    end

    render json: @orders, include: [:order_items]
  end

  def show
    render json: @order, include: [:order_items, :payments, :branch, :pickup_address, :delivery_address]
  end

  def create
    @order = current_user.orders.build(order_params)
    
    # Calculate totals
    total = 0
    @order.order_items.each do |item|
      service = Service.find(item.service_id)
      item.subtotal = calculate_item_price(service, item)
      total += item.subtotal
    end
    
    @order.total_amount = total

    if @order.save
      render json: @order, status: :created
    else
      render json: @order.errors, status: :unprocessable_entity
    end
  end

  def update
    # Usually only branch manager or admin can update status
    if current_user.customer? && order_params[:status].present? && order_params[:status] != 'cancelled'
      return render json: { error: 'Customers can only cancel orders' }, status: :forbidden
    end

    if @order.update(order_params)
      render json: @order
    else
      render json: @order.errors, status: :unprocessable_entity
    end
  end

  private

  def set_order
    @order = Order.find(params[:id])
    
    # Ensure customers can only see their own orders
    if current_user.customer? && @order.customer_id != current_user.id
      render json: { error: 'Forbidden' }, status: :forbidden
    end
  end

  def order_params
    params.require(:order).permit(
      :branch_id, :status, :pickup_address_id, :delivery_address_id, :notes,
      order_items_attributes: [:service_id, :quantity, :weight_kg]
    )
  end

  def calculate_item_price(service, item)
    if item.weight_kg.present?
      service.price_per_kg * item.weight_kg
    elsif item.quantity.present?
      # If the service is per item rather than per kg, we assume price_per_kg is used as price_per_item
      service.price_per_kg * item.quantity
    else
      0
    end
  end
end
