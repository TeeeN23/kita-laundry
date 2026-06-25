class MockController < ApplicationController
  def unread_count
    render json: { success: true, data: { unreadCount: 0 } }
  end

  def notifications
    render json: { success: true, data: { notifications: [] } }
  end

  def service_items
    render json: { success: true, data: {} }
  end
end
