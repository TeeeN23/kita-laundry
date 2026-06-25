class Admin::InventoryController < ApplicationController
  before_action :authorize_request

  def index
    branch_id = current_user.role == 'branch_manager' ? get_branch_id : Branch.first&.id
    items = branch_id ? InventoryItem.where(branch_id: branch_id) : InventoryItem.all
    
    formatted_items = items.map { |i| format_item(i) }
    
    stats = {
      totalItems: items.count,
      lowStockItems: items.count { |i| i.current_stock.to_i < i.min_threshold.to_i },
      expiredItems: 0,
      totalValue: items.sum { |i| i.current_stock.to_f * i.unit_cost.to_f }
    }

    render json: { success: true, data: { inventory: formatted_items, stats: stats } }, status: :ok
  end

  def create
    branch_id = current_user.role == 'branch_manager' ? get_branch_id : Branch.first&.id
    item = InventoryItem.new(
      item_name: params[:itemName],
      current_stock: params[:currentStock],
      min_threshold: params[:minThreshold],
      max_capacity: params[:maxCapacity],
      unit: params[:unit],
      unit_cost: params[:unitCost],
      supplier: params[:supplier],
      branch_id: branch_id
    )

    if item.save
      render json: { success: true, data: { item: format_item(item) } }, status: :created
    else
      render json: { success: false, errors: item.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def stock
    item = InventoryItem.find(params[:id])
    quantity = params[:quantity].to_i
    
    if params[:action_type] == 'add' || params[:action] == 'add'
      item.current_stock = item.current_stock.to_i + quantity
    else
      item.current_stock = item.current_stock.to_i - quantity
      item.current_stock = 0 if item.current_stock < 0
    end

    if item.save
      render json: { success: true, data: { item: format_item(item) } }, status: :ok
    else
      render json: { success: false, errors: item.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    item = InventoryItem.find(params[:id])
    item.destroy
    render json: { success: true, message: "Item deleted successfully" }, status: :ok
  end

  private

  def format_item(item)
    {
      _id: item.id.to_s,
      itemName: item.item_name,
      currentStock: item.current_stock.to_i,
      minThreshold: item.min_threshold.to_i,
      maxCapacity: item.max_capacity.to_i,
      unit: item.unit || 'units',
      unitCost: item.unit_cost.to_f,
      supplier: item.supplier,
      isLowStock: item.current_stock.to_i < item.min_threshold.to_i,
      isExpired: false
    }
  end
end
