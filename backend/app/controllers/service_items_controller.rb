class ServiceItemsController < ApplicationController
  def index
    @service_items = ServiceItem.all

    items = @service_items.map do |item|
      {
        _id: item.id.to_s,
        category: item.category,
        name: item.name,
        service: item.service_type,
        basePrice: item.base_price,
        description: ""
      }
    end

    render json: {
      success: true,
      items: items
    }
  end
end
