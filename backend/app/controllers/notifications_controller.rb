class NotificationsController < ApplicationController
  before_action :authorize_request

  def index
    notifications = current_user.notifications.order(created_at: :desc)
    
    render json: { 
      success: true, 
      data: { 
        notifications: notifications.map do |n|
          {
            _id: n.id.to_s,
            id: n.id.to_s,
            title: n.title,
            message: n.message,
            isRead: n.is_read,
            type: n.notification_type,
            referenceId: n.reference_id,
            createdAt: n.created_at.iso8601
          }
        end
      } 
    }
  end

  def mark_read
    if params[:id] == 'all'
      current_user.notifications.update_all(is_read: true)
    else
      notification = current_user.notifications.find(params[:id])
      notification.update(is_read: true)
    end
    
    render json: { success: true }
  end

  def unread_count
    count = current_user.notifications.where(is_read: false).count
    render json: { success: true, count: count }
  end

  private
end
